import { Textarea } from '../../shared/ui/Textarea';
import { Button } from '../../shared/ui/Button';
import { StatusBox } from '../../shared/ui/StatusBox';
import { useCreateComment } from './useCreateComment';

export const CreateCommentForm = ({ postId, onCreated }) => {
  const { content, setContent, error, submit } = useCreateComment(postId, onCreated);

  return (
    <form className="stack" onSubmit={submit}>
      <Textarea
        label="Коментар"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        required
        rows={3}
        minLength={1}
        maxLength={500}
      />
      <Button type="submit" variant="secondary">
        Додати коментар
      </Button>
      <StatusBox type="error" message={error} />
    </form>
  );
};
