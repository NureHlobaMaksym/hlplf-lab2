import { Panel } from '../shared/ui/Panel';
import { Button } from '../shared/ui/Button';
import { SendMessageForm } from '../features/send-message/SendMessageForm';
import { MessageThread } from '../widgets/message-thread/MessageThread';
import { useSocketState } from '../app/providers/SocketProvider';
import { useAuth } from '../app/providers/AuthProvider';
import { userFullName } from '../shared/lib/user-name';
import { ConfirmModal } from '../shared/ui/ConfirmModal';
import { useChats } from '../features/chats/useChats';

export const ChatsPage = () => {
  const { user } = useAuth();
  const { socket, chats, refreshChats, setActiveChatPeer, closeActiveChat } = useSocketState();
  const {
    selectedPeerId,
    setSelectedPeerId,
    messages,
    onSend,
    deleteModalOpen,
    requestDeleteChat,
    closeDeleteModal,
    onDeleteChat,
    deleteModalText
  } = useChats({
    userId: user.id,
    socket,
    chats,
    refreshChats,
    setActiveChatPeer,
    closeActiveChat
  });

  return (
    <div className="chat-layout">
      <Panel title="Переписки" subtitle="Список існуючих чатів">
        <div className="stack">
          {chats.map((chat) => (
            <button
              key={chat.peer.id}
              className={`chat-item ${Number(selectedPeerId) === Number(chat.peer.id) ? 'chat-item--active' : ''}`}
              type="button"
              onClick={() => setSelectedPeerId(String(chat.peer.id))}
            >
              <span>{userFullName(chat.peer)}</span>
              {chat.unreadCount > 0 ? <span className="badge">{chat.unreadCount}</span> : null}
            </button>
          ))}
        </div>
      </Panel>

      <Panel title={selectedPeerId ? 'Діалог' : 'Оберіть чат зі списку'}>
        {selectedPeerId ? (
          <div className="row">
            <Button variant="danger" onClick={requestDeleteChat}>
              Видалити чат
            </Button>
          </div>
        ) : null}
        <MessageThread messages={messages} currentUserId={user.id} activePeerId={selectedPeerId} />
        {selectedPeerId ? <SendMessageForm onSend={onSend} /> : null}
      </Panel>
      <ConfirmModal
        open={deleteModalOpen}
        title={deleteModalText.title}
        description={deleteModalText.description}
        confirmText="Видалити"
        onCancel={closeDeleteModal}
        onConfirm={onDeleteChat}
      />
    </div>
  );
};
