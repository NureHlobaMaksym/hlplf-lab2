import { useState } from 'react';
import { commentsApi } from '../../entities/comments/api';

export const useCreateComment = (postId, onSuccess) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();

    try {
      setError('');
      await commentsApi.create({ postId, content });
      setContent('');
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    }
  };

  return { content, setContent, error, submit };
};
