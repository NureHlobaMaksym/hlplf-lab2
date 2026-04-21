import { useEffect, useState } from 'react';
import { postsApi } from '../../entities/posts/api';

export const usePostsList = (query = '') => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await postsApi.getAll(query);
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [query]);

  return { posts, loading, error, reloadPosts: loadPosts };
};
