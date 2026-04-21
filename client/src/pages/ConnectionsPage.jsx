import { Panel } from '../shared/ui/Panel';
import { Button } from '../shared/ui/Button';
import { Select } from '../shared/ui/Select';
import { StatusBox } from '../shared/ui/StatusBox';
import { ConfirmModal } from '../shared/ui/ConfirmModal';
import { useAuth } from '../app/providers/AuthProvider';
import { useConnections } from '../features/connections/useConnections';
import { CONFIRM_TEXT } from '../shared/constants/ui';

export const ConnectionsPage = () => {
  const { user, updateUser } = useAuth();
  const {
    incoming,
    outgoing,
    friends,
    privacy,
    error,
    friendToRemove,
    setFriendToRemove,
    onAccept,
    onReject,
    onPrivacyChange,
    onConfirmRemoveFriend
  } = useConnections(user.allowMessagesFrom, (allowMessagesFrom) => updateUser({ allowMessagesFrom }));

  return (
    <div className="stack-lg">
      <Panel title="Налаштування повідомлень" subtitle="За замовчуванням: тільки друзі">
        <Select label="Хто може писати" value={privacy} onChange={(e) => onPrivacyChange(e.target.value)}>
          <option value="friends">Тільки друзі</option>
          <option value="all">Всі користувачі</option>
        </Select>
        <StatusBox type="error" message={error} />
      </Panel>

      <Panel title={`Вхідні запити: ${incoming.length}`}>
        {incoming.map((item) => (
          <div className="card-row" key={item.id}>
            <p>
              {item.from.firstName} {item.from.lastName}
            </p>
            <div className="row">
              <Button onClick={() => onAccept(item.id)}>Прийняти</Button>
              <Button variant="danger" onClick={() => onReject(item.id)}>
                Відхилити
              </Button>
            </div>
          </div>
        ))}
      </Panel>

      <Panel title={`Відправлені запити: ${outgoing.length}`}>
        {outgoing.map((item) => (
          <div className="card-row" key={item.id}>
            <p>
              {item.to.firstName} {item.to.lastName}
            </p>
            <span className="muted">Запит відправлено</span>
          </div>
        ))}
      </Panel>

      <Panel title={`Друзі: ${friends.length}`}>
        {friends.map((friend) => (
          <div className="card-row" key={friend.id}>
            <p>
              {friend.firstName} {friend.lastName}
            </p>
            <Button variant="danger" onClick={() => setFriendToRemove(friend)}>
              Видалити з друзів
            </Button>
          </div>
        ))}
      </Panel>
      <ConfirmModal
        open={Boolean(friendToRemove)}
        title={CONFIRM_TEXT.REMOVE_FRIEND_TITLE}
        description={CONFIRM_TEXT.REMOVE_FRIEND_DESCRIPTION}
        confirmText="Видалити"
        onCancel={() => setFriendToRemove(null)}
        onConfirm={onConfirmRemoveFriend}
      />
    </div>
  );
};
