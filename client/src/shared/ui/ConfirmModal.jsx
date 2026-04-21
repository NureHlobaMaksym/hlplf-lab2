import { Button } from './Button';

export const ConfirmModal = ({
  open,
  title = 'Підтвердження дії',
  description = '',
  confirmText = 'Підтвердити',
  cancelText = 'Скасувати',
  onConfirm,
  onCancel
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>{title}</h3>
        {description ? <p className="muted">{description}</p> : null}
        <div className="row">
          <Button variant="ghost" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
