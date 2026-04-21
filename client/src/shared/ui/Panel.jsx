export const Panel = ({ title, subtitle, children, actions }) => {
  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions ? <div className="panel__actions">{actions}</div> : null}
      </header>
      <div>{children}</div>
    </section>
  );
};
