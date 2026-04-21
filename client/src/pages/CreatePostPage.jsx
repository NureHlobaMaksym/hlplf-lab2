import { Panel } from '../shared/ui/Panel';
import { useNavigate } from 'react-router-dom';
import { CreatePostForm } from '../features/create-post/CreatePostForm';

export const CreatePostPage = () => {
  const navigate = useNavigate();

  const onCreated = (post) => {
    navigate(`/posts/${post.id}`);
  };

  return (
    <Panel title="Створити пост" subtitle="Окрема сторінка створення поста">
      <CreatePostForm onCreated={onCreated} />
    </Panel>
  );
};
