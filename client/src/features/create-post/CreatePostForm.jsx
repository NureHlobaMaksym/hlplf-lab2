import { Input } from '../../shared/ui/Input';
import { Textarea } from '../../shared/ui/Textarea';
import { Select } from '../../shared/ui/Select';
import { Button } from '../../shared/ui/Button';
import { StatusBox } from '../../shared/ui/StatusBox';
import { useCreatePost } from './useCreatePost';

export const CreatePostForm = ({ onCreated }) => {
  const { title, setTitle, content, setContent, tags, setTags, visibility, setVisibility, error, submit } =
    useCreatePost(onCreated);

  return (
    <form className="stack" onSubmit={submit}>
      <Input
        label="Заголовок"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        minLength={3}
        maxLength={160}
      />
      <Textarea
        label="Контент"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        required
        rows={5}
        minLength={10}
        maxLength={2000}
      />
      <Select label="Видимість" value={visibility} onChange={(event) => setVisibility(event.target.value)}>
        <option value="public">Для всіх</option>
        <option value="friends">Тільки для друзів</option>
      </Select>
      <Input
        label="Теги (через кому)"
        value={tags}
        onChange={(event) => setTags(event.target.value)}
        placeholder="travel,photo,design"
        maxLength={120}
      />
      <Button type="submit">Опублікувати пост</Button>
      <StatusBox type="error" message={error} />
    </form>
  );
};
