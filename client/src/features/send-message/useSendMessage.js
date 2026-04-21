import { useState } from 'react';

export const useSendMessage = (onSuccess) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const submit = async (event, sendFn) => {
    event.preventDefault();

    if (!content.trim()) {
      setError('Message cannot be empty');
      return;
    }

    if (content.trim().length > 1000) {
      setError('Message is too long');
      return;
    }

    try {
      setError('');
      sendFn(content.trim());
      setContent('');
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    }
  };

  return { content, setContent, error, submit };
};
