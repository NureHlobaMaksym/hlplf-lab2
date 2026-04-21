import { useParams } from 'react-router-dom';
import { Panel } from '../shared/ui/Panel';
import { StatusBox } from '../shared/ui/StatusBox';
import { Input } from '../shared/ui/Input';
import { Textarea } from '../shared/ui/Textarea';
import { Select } from '../shared/ui/Select';
import { Button } from '../shared/ui/Button';
import { useAuth } from '../app/providers/AuthProvider';
import { ConfirmModal } from '../shared/ui/ConfirmModal';
import { CreateCommentForm } from '../features/create-comment/CreateCommentForm';
import { usePostDetails } from '../features/post-details/usePostDetails';
import { CONFIRM_TEXT } from '../shared/constants/ui';

export const PostDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const {
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
  } = usePostDetails({ postId: id });

  return (
    <Panel title="Деталі поста" subtitle={loading ? 'Завантаження...' : post?.title || 'Пост'}>
      <StatusBox type="error" message={error} />
      {post ? (
        <article className="post">
          <div className="row">
            <h3>{post.title}</h3>
            {post.author.id === Number(user.id) ? (
              <div className="row">
                <Button variant="ghost" onClick={() => setIsEditing((prev) => !prev)}>
                  {isEditing ? 'Скасувати' : 'Редагувати'}
                </Button>
                <Button variant="danger" onClick={() => setDeletePostOpen(true)}>
                  Видалити
                </Button>
              </div>
            ) : null}
          </div>

          {isEditing ? (
            <div className="stack">
              <Input
                label="Заголовок"
                value={editForm.title}
                onChange={(event) => setEditForm((prev) => ({ ...prev, title: event.target.value }))}
                minLength={3}
                maxLength={160}
              />
              <Textarea
                label="Контент"
                value={editForm.content}
                onChange={(event) => setEditForm((prev) => ({ ...prev, content: event.target.value }))}
                rows={5}
                minLength={10}
                maxLength={2000}
              />
              <Select
                label="Видимість"
                value={editForm.visibility}
                onChange={(event) => setEditForm((prev) => ({ ...prev, visibility: event.target.value }))}
              >
                <option value="public">Для всіх</option>
                <option value="friends">Тільки для друзів</option>
              </Select>
              <Input
                label="Теги (через кому)"
                value={editForm.tags}
                onChange={(event) => setEditForm((prev) => ({ ...prev, tags: event.target.value }))}
                maxLength={120}
              />
              <Button onClick={savePost}>Зберегти зміни</Button>
            </div>
          ) : (
            <p>{post.content}</p>
          )}
          <p>
            Автор: <strong>{post.author.firstName} {post.author.lastName}</strong>
          </p>
          <div className="chips">
            {(post.tags || []).filter(Boolean).map((tag) => (
              <span key={tag} className="chip">
                #{tag}
              </span>
            ))}
          </div>
          <div className="comment-block">
            <h4>Коментарі</h4>
            {(post.comments || []).map((comment) => (
              <div key={comment.id} className="comment-item comment-item--line">
                <p className="comment-item__text">
                  <strong>{comment.author.firstName} {comment.author.lastName}:</strong> {comment.content}
                </p>
                {comment.author.id === Number(user.id) ? (
                  <Button variant="danger" onClick={() => openDeleteCommentModal(comment.id)}>
                    Видалити
                  </Button>
                ) : null}
              </div>
            ))}
            <CreateCommentForm postId={post.id} onCreated={loadPost} />
          </div>
        </article>
      ) : null}
      <ConfirmModal
        open={Boolean(deleteCommentId)}
        title={CONFIRM_TEXT.DELETE_COMMENT_TITLE}
        description={CONFIRM_TEXT.DELETE_COMMENT_DESCRIPTION}
        confirmText="Видалити"
        onCancel={() => setDeleteCommentId(null)}
        onConfirm={confirmDeleteComment}
      />
      <ConfirmModal
        open={deletePostOpen}
        title={CONFIRM_TEXT.DELETE_POST_TITLE}
        description={CONFIRM_TEXT.DELETE_POST_DESCRIPTION}
        confirmText="Видалити"
        onCancel={() => setDeletePostOpen(false)}
        onConfirm={confirmDeletePost}
      />
    </Panel>
  );
};
