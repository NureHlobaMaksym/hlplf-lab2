import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { messagesApi } from '../../entities/messages/api';
import { CONFIRM_TEXT } from '../../shared/constants/ui';

export const useChats = ({ userId, socket, chats, refreshChats, setActiveChatPeer, closeActiveChat }) => {
  const [searchParams] = useSearchParams();
  const [selectedPeerId, setSelectedPeerId] = useState(searchParams.get('peerId') || '');
  const [messages, setMessages] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    refreshChats().catch(() => null);
    return () => closeActiveChat();
  }, []);

  useEffect(() => {
    const peerId = searchParams.get('peerId');
    if (peerId) {
      setSelectedPeerId(peerId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!selectedPeerId) {
      setMessages([]);
      return;
    }

    setActiveChatPeer(Number(selectedPeerId)).catch(() => null);
    messagesApi.getConversation(Number(selectedPeerId)).then(setMessages).catch(() => setMessages([]));
  }, [selectedPeerId]);

  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (message) => {
      const isCurrentDialog =
        (message.sender.id === Number(selectedPeerId) && message.receiver.id === Number(userId)) ||
        (message.sender.id === Number(userId) && message.receiver.id === Number(selectedPeerId));

      if (isCurrentDialog) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const onChatDeleted = ({ userAId, userBId }) => {
      const shouldClear =
        (Number(userId) === Number(userAId) && Number(selectedPeerId) === Number(userBId)) ||
        (Number(userId) === Number(userBId) && Number(selectedPeerId) === Number(userAId));

      if (shouldClear) {
        setSelectedPeerId('');
        setMessages([]);
      }
    };

    socket.on('new_message', onNewMessage);
    socket.on('chat_deleted', onChatDeleted);

    return () => {
      socket.off('new_message', onNewMessage);
      socket.off('chat_deleted', onChatDeleted);
    };
  }, [socket, selectedPeerId, userId]);

  const onSend = (content) => {
    if (!socket || !selectedPeerId) return;
    socket.emit('send_message', { receiverId: Number(selectedPeerId), content });
  };

  const requestDeleteChat = () => setDeleteModalOpen(true);

  const onDeleteChat = async () => {
    if (!selectedPeerId) return;

    setDeleteModalOpen(false);
    await messagesApi.deleteConversation(Number(selectedPeerId));
    setSelectedPeerId('');
    setMessages([]);
    await refreshChats();
  };

  return {
    selectedPeerId,
    setSelectedPeerId,
    messages,
    onSend,
    chats,
    deleteModalOpen,
    requestDeleteChat,
    closeDeleteModal: () => setDeleteModalOpen(false),
    onDeleteChat,
    deleteModalText: {
      title: CONFIRM_TEXT.DELETE_CHAT_TITLE,
      description: CONFIRM_TEXT.DELETE_CHAT_DESCRIPTION
    }
  };
};
