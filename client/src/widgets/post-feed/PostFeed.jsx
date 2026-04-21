import { Link } from 'react-router-dom';
import { Button } from '../../shared/ui/Button';

export const PostFeed = ({ posts, onPostDeleted, currentUserId }) => {
  if (!posts.length) {
    return <p className="muted">Поки що постів немає.</p>;
  }

  return (
    <div className="stack-lg">
      {posts.map((post) => (
        <article className="post" key={post.id}>
          <header className="post__header">
            <div>
              <h3>{post.title}</h3>
              <p>
                Автор: <strong>{post.author.firstName} {post.author.lastName}</strong>
              </p>
            </div>
            <div className="row">
              <Link className="link-btn" to={`/posts/${post.id}`}>
                Деталі
              </Link>
              {post.author.id === Number(currentUserId) ? (
                <Button variant="danger" onClick={() => onPostDeleted(post.id)}>
                  Видалити
                </Button>
              ) : null}
            </div>
          </header>

          <p>{post.content}</p>

          <div className="chips">
            {(post.tags || []).filter(Boolean).map((tag) => (
              <span key={`${post.id}-${tag}`} className="chip">
                #{tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
};
