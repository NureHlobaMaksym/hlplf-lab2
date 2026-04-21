import { useState } from 'react';
import { postsApi } from '../../entities/posts/api';

export const useCreatePost = (onSuccess) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();

    try {
      setError('');
      const createdPost = await postsApi.create({ title, content, tags, visibility });
      setTitle('');
      setContent('');
      setTags('');
      setVisibility('public');
      onSuccess?.(createdPost);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    tags,
    setTags,
    visibility,
    setVisibility,
    error,
    submit
  };
};
