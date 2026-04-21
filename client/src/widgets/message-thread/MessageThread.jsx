import { useEffect, useRef } from 'react';
import { userFullName } from '../../shared/lib/user-name';

export const MessageThread = ({ messages, currentUserId, activePeerId }) => {
  const endRef = useRef(null);
  const shouldScrollOnOpenRef = useRef(false);

  useEffect(() => {
    shouldScrollOnOpenRef.current = true;
  }, [activePeerId]);

  useEffect(() => {
    if (!messages.length) return;

    if (shouldScrollOnOpenRef.current) {
      endRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
      shouldScrollOnOpenRef.current = false;
      return;
    }

    const lastMessage = messages[messages.length - 1];
    const isSentByCurrentUser = Number(lastMessage.sender.id) === Number(currentUserId);

    if (isSentByCurrentUser) {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, currentUserId]);

  if (!messages.length) {
    return <p className="muted">Історія повідомлень порожня.</p>;
  }

  const formatDateTime = (value) => {
    const date = new Date(value);
    const day = new Intl.DateTimeFormat('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    const time = new Intl.DateTimeFormat('uk-UA', { hour: '2-digit', minute: '2-digit' }).format(date);
    return `${day} ${time}`;
  };

  return (
    <div className="thread">
      {messages.map((message) => {
        const isMine = message.sender.id === Number(currentUserId);
        return (
          <div className={`thread__row ${isMine ? 'thread__row--mine' : 'thread__row--peer'}`} key={message.id}>
            <div className={`bubble ${isMine ? 'bubble--mine' : 'bubble--peer'}`}>
              <p className="bubble__author">{userFullName(message.sender)}</p>
              <p className="bubble__content">{message.content}</p>
              <small className="bubble__meta">{formatDateTime(message.createdAt)}</small>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
};
