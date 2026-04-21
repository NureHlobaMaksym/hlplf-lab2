export const Input = ({ label, ...props }) => {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
};
