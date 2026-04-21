import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../../entities/users/api';
import { friendshipsApi } from '../../entities/friendships/api';
import { UI_DEBOUNCE_MS } from '../../shared/constants/ui';

export const useUsersSearch = (currentUserId) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [pendingIds, setPendingIds] = useState(new Set());
  const [friendIds, setFriendIds] = useState(new Set());

  useEffect(() => {
    Promise.all([friendshipsApi.outgoing(), friendshipsApi.friends()])
      .then(([outgoing, friends]) => {
        setPendingIds(new Set(outgoing.map((item) => item.to.id)));
        setFriendIds(new Set(friends.map((item) => item.id)));
      })
      .catch(() => null);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setError('');
        const data = await usersApi.search(query);
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    }, UI_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query]);

  const sendRequest = async (userId) => {
    try {
      setError('');
      await friendshipsApi.sendRequest(userId);
      setPendingIds((prev) => new Set([...prev, Number(userId)]));
      setFriendIds((prev) => {
        const next = new Set(prev);
        next.delete(Number(userId));
        return next;
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const goToChat = (userId) => {
    navigate(`/chats?peerId=${userId}`);
  };

  const list = users.map((user) => ({
    ...user,
    isPending: pendingIds.has(Number(user.id)),
    isFriend: Boolean(user.isFriend || friendIds.has(Number(user.id))),
    isCurrentUser: Number(user.id) === Number(currentUserId)
  }));

  return {
    query,
    setQuery,
    users: list,
    error,
    sendRequest,
    goToChat
  };
};
