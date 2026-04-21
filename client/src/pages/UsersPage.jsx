import { Link } from 'react-router-dom';
import { Panel } from '../shared/ui/Panel';
import { Input } from '../shared/ui/Input';
import { Button } from '../shared/ui/Button';
import { StatusBox } from '../shared/ui/StatusBox';
import { useAuth } from '../app/providers/AuthProvider';
import { useUsersSearch } from '../features/users-search/useUsersSearch';

export const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const { query, setQuery, users, error, sendRequest, goToChat } = useUsersSearch(currentUser.id);

  return (
    <div className="stack-lg">
      <Panel title="Пошук користувачів" subtitle="Працює автоматично без кнопки">
        <Input
          label="Запит"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          minLength={1}
          maxLength={80}
          placeholder="Ім'я, прізвище, email"
        />
        <StatusBox type="error" message={error} />
      </Panel>

      <Panel title={`Результати: ${users.length}`}>
        <div className="stack">
          {users.map((user) => {
            const { isPending, isFriend, isCurrentUser } = user;
            return (
              <article key={user.id} className="card-row">
                <div>
                  <h4>
                    {user.firstName} {user.lastName}
                  </h4>
                </div>
                <div className="row">
                  <Link className="link-btn" to={`/users/${user.id}`}>
                    Профіль
                  </Link>
                  {!isCurrentUser ? (
                    <>
                      {!isFriend ? (
                        <Button variant="secondary" onClick={() => sendRequest(user.id)} disabled={isPending}>
                          {isPending ? 'Запит відправлено' : 'Запит в друзі'}
                        </Button>
                      ) : null}
                      {user.canMessage ? (
                        <Button onClick={() => goToChat(user.id)}>Написати</Button>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </Panel>
    </div>
  );
};
