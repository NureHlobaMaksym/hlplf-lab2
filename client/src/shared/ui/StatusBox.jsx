export const StatusBox = ({ type = 'info', message }) => {
  if (!message) return null;

  return <div className={`status status--${type}`}>{message}</div>;
};
