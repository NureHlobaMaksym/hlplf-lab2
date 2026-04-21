import { Panel } from '../shared/ui/Panel';
import { Input } from '../shared/ui/Input';
import { StatusBox } from '../shared/ui/StatusBox';
import { ConfirmModal } from '../shared/ui/ConfirmModal';
import { PostFeed } from '../widgets/post-feed/PostFeed';
import { useAuth } from '../app/providers/AuthProvider';
import { usePostsPage } from '../features/posts/usePostsPage';
import { CONFIRM_TEXT } from '../shared/constants/ui';

export const PostsPage = () => {
  const { user } = useAuth();
  const { query, setQuery, posts, loading, error, actionError, deletePostId, setDeletePostId, requestDelete, confirmDelete } =
    usePostsPage();

  return (
    <div className="stack-lg">
      <Panel title="Стрічка постів" subtitle="Відкритий список постів з live-пошуком">
        <Input
          label="Пошук постів"
          placeholder="Введіть заголовок або текст"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          maxLength={80}
        />
        <StatusBox type="error" message={error || actionError} />
      </Panel>

      <Panel title={loading ? 'Завантаження...' : `Постів: ${posts.length}`}>
        <PostFeed posts={posts} onPostDeleted={requestDelete} currentUserId={user.id} />
      </Panel>
      <ConfirmModal
        open={Boolean(deletePostId)}
        title={CONFIRM_TEXT.DELETE_POST_TITLE}
        description={CONFIRM_TEXT.DELETE_POST_DESCRIPTION}
        confirmText="Видалити"
        onCancel={() => setDeletePostId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
