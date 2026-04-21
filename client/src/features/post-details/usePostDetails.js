import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsApi } from '../../entities/posts/api';
import { commentsApi } from '../../entities/comments/api';

export const usePostDetails = ({ postId }) => {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    tags: '',
    visibility: 'public'
  });
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [deletePostOpen, setDeletePostOpen] = useState(false);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await postsApi.getById(postId);
      setPost(data);
      setEditForm({
        title: data.title,
        content: data.content,
        tags: (data.tags || []).join(','),
        visibility: data.visibility || 'public'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [postId]);

  const savePost = async () => {
    try {
      setError('');
      const updated = await postsApi.update(Number(postId), editForm);
      setPost(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const openDeleteCommentModal = (commentId) => setDeleteCommentId(commentId);

  const confirmDeleteComment = async () => {
    if (!deleteCommentId) return;

    try {
      setError('');
      await commentsApi.remove(deleteCommentId);
      await loadPost();
    } catch {
      setError('Не вдалося видалити коментар');
    } finally {
      setDeleteCommentId(null);
    }
  };

  const confirmDeletePost = async () => {
    setDeletePostOpen(false);
    try {
      await postsApi.remove(Number(postId));
      navigate('/posts');
    } catch {
      setError('Не вдалося видалити пост');
    }
  };

  return {
    post,
    error,
    loading,
    isEditing,
    setIsEditing,
    editForm,
    setEditForm,
    savePost,
    loadPost,
    deleteCommentId,
    setDeleteCommentId,
    openDeleteCommentModal,
    confirmDeleteComment,
    deletePostOpen,
    setDeletePostOpen,
    confirmDeletePost
  };
};
