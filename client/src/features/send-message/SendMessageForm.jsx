import { Textarea } from '../../shared/ui/Textarea';
import { Button } from '../../shared/ui/Button';
import { StatusBox } from '../../shared/ui/StatusBox';
import { useSendMessage } from './useSendMessage';

export const SendMessageForm = ({ onSend }) => {
  const { content, setContent, error, submit } = useSendMessage();

  return (
    <form className="stack" onSubmit={(event) => submit(event, onSend)}>
      <Textarea
        label="Повідомлення"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={3}
        required
        minLength={1}
        maxLength={1000}
      />
      <Button type="submit">Надіслати</Button>
      <StatusBox type="error" message={error} />
    </form>
  );
};
