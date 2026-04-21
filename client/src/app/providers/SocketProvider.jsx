import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { env } from '../../shared/config/env';
import { useAuth } from './AuthProvider';
import { messagesApi } from '../../entities/messages/api';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChatPeerId, setActiveChatPeerIdState] = useState(null);
  const activeChatPeerRef = useRef(null);

  const refreshChats = async () => {
    if (!isAuthenticated) {
      setChats([]);
      return;
    }

    const data = await messagesApi.chats();
    setChats(data);
  };

  useEffect(() => {
    if (!token || !user) {
      setSocket(null);
      setChats([]);
      return;
    }

    const ws = io(env.socketUrl, { auth: { token } });
    setSocket(ws);

    refreshChats().catch(() => null);

    const onNewMessage = (message) => {
      setChats((prev) => {
        const peer = message.sender.id === user.id ? message.receiver : message.sender;
        const existingIndex = prev.findIndex((item) => item.peer.id === peer.id);

        const currentActive = activeChatPeerRef.current;
        const unreadIncrement = message.receiver.id === user.id && Number(currentActive) !== Number(peer.id) ? 1 : 0;

        let next = [...prev];

        if (existingIndex === -1) {
          next.unshift({
            peer,
            lastMessage: message,
            unreadCount: unreadIncrement
          });
        } else {
          const current = next[existingIndex];
          const updated = {
            ...current,
            lastMessage: message,
            unreadCount: Math.max(0, (current.unreadCount || 0) + unreadIncrement)
          };

          next.splice(existingIndex, 1);
          next.unshift(updated);
        }

        return next;
      });
    };

    const onChatRead = ({ peerId }) => {
      setChats((prev) => prev.map((chat) => (chat.peer.id === Number(peerId) ? { ...chat, unreadCount: 0 } : chat)));
    };

    const onChatDeleted = ({ userAId, userBId }) => {
      const peerId = Number(user.id) === Number(userAId) ? Number(userBId) : Number(userAId);
      setChats((prev) => prev.filter((chat) => Number(chat.peer.id) !== peerId));
    };

    ws.on('new_message', onNewMessage);
    ws.on('chat_read', onChatRead);
    ws.on('chat_deleted', onChatDeleted);

    return () => {
      ws.off('new_message', onNewMessage);
      ws.off('chat_read', onChatRead);
      ws.off('chat_deleted', onChatDeleted);
      ws.disconnect();
      setSocket(null);
    };
  }, [token, user?.id]);

  const setActiveChatPeer = async (peerId) => {
    const normalized = peerId ? Number(peerId) : null;
    activeChatPeerRef.current = normalized;
    setActiveChatPeerIdState(normalized);

    if (!normalized || !socket) {
      return;
    }

    setChats((prev) => prev.map((chat) => (chat.peer.id === normalized ? { ...chat, unreadCount: 0 } : chat)));

    socket.emit('chat_open', { peerId: normalized });
    await messagesApi.markRead(normalized);
  };

  const closeActiveChat = () => {
    activeChatPeerRef.current = null;
    setActiveChatPeerIdState(null);
    if (socket) {
      socket.emit('chat_close');
    }
  };

  const totalUnread = chats.reduce((acc, chat) => acc + (chat.unreadCount || 0), 0);

  const value = useMemo(
    () => ({
      socket,
      chats,
      totalUnread,
      refreshChats,
      activeChatPeerId,
      setActiveChatPeer,
      closeActiveChat
    }),
    [socket, chats, totalUnread, activeChatPeerId]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocketState = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketState must be used inside SocketProvider');
  }
  return context;
};
