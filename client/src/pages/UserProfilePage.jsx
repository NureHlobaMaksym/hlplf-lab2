import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Panel } from '../shared/ui/Panel';
import { StatusBox } from '../shared/ui/StatusBox';
import { Button } from '../shared/ui/Button';
import { usersApi } from '../entities/users/api';
import { PostFeed } from '../widgets/post-feed/PostFeed';
import { useAuth } from '../app/providers/AuthProvider';

export const UserProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    usersApi
      .getProfile(id)
      .then(setProfile)
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <div className="stack-lg">
      <Panel title="Профіль користувача" subtitle={profile ? `${profile.user.firstName} ${profile.user.lastName}` : 'Завантаження...'}>
        <StatusBox type="error" message={error} />
        {profile ? (
          <div className="row">
            <div>
              <h3>
                {profile.user.firstName} {profile.user.lastName}
              </h3>
              <p className="muted">{profile.user.bio || 'Без біо'}</p>
            </div>
            {profile.user.id !== user.id && profile.user.canMessage ? (
              <Button onClick={() => navigate(`/chats?peerId=${profile.user.id}`)}>Написати</Button>
            ) : null}
          </div>
        ) : null}
      </Panel>

      <Panel title="Пости користувача">
        <PostFeed posts={profile?.posts || []} onPostDeleted={() => null} currentUserId={user.id} />
      </Panel>
    </div>
  );
};
