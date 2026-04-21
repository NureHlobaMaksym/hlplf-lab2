import { useEffect, useState } from 'react';
import { friendshipsApi } from '../../entities/friendships/api';
import { usersApi } from '../../entities/users/api';

export const useConnections = (initialPrivacy, onPrivacyUpdated) => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [friends, setFriends] = useState([]);
  const [privacy, setPrivacy] = useState(initialPrivacy || 'friends');
  const [error, setError] = useState('');
  const [friendToRemove, setFriendToRemove] = useState(null);

  const load = async () => {
    try {
      setError('');
      const [inData, outData, friendsData] = await Promise.all([
        friendshipsApi.incoming(),
        friendshipsApi.outgoing(),
        friendshipsApi.friends()
      ]);
      setIncoming(inData);
      setOutgoing(outData);
      setFriends(friendsData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onAccept = async (requestId) => {
    await friendshipsApi.accept(requestId);
    await load();
  };

  const onReject = async (requestId) => {
    await friendshipsApi.reject(requestId);
    await load();
  };

  const onPrivacyChange = async (value) => {
    try {
      setError('');
      const updated = await usersApi.updatePrivacy(value);
      setPrivacy(updated.allowMessagesFrom);
      onPrivacyUpdated?.(updated.allowMessagesFrom);
    } catch (err) {
      setError(err.message);
    }
  };

  const onConfirmRemoveFriend = async () => {
    if (!friendToRemove) return;

    try {
      setError('');
      await friendshipsApi.removeFriend(friendToRemove.id);
      setFriendToRemove(null);
      await load();
    } catch (err) {
      setError(err.message);
      setFriendToRemove(null);
    }
  };

  return {
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
  };
};
