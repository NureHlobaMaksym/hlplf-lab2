import { useState } from 'react';
import { usePostsList } from './usePostsList';
import { postsApi } from '../../entities/posts/api';

export const usePostsPage = () => {
  const [query, setQuery] = useState('');
  const [actionError, setActionError] = useState('');
  const [deletePostId, setDeletePostId] = useState(null);
  const { posts, loading, error, reloadPosts } = usePostsList(query);

  const requestDelete = (id) => {
    setDeletePostId(id);
  };

  const confirmDelete = async () => {
    if (!deletePostId) return;

    try {
      setActionError('');
      await postsApi.remove(deletePostId);
      await reloadPosts();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setDeletePostId(null);
    }
  };

  return {
    query,
    setQuery,
    posts,
    loading,
    error,
    actionError,
    deletePostId,
    setDeletePostId,
    requestDelete,
    confirmDelete
  };
};
