import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { APP_ROUTES } from '../../shared/constants/routes';
import { ConfirmModal } from '../../shared/ui/ConfirmModal';
import { CONFIRM_TEXT } from '../../shared/constants/ui';

export const AppShell = ({ children, user, onLogout, unreadCount }) => {
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    setLogoutOpen(false);
    onLogout();
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand-kicker">HLPLF Lab 2</p>
          <h1>Social Sphere</h1>
          <p className="topbar-user">
            {user.firstName} {user.lastName}
          </p>
        </div>
        <nav className="menu">
          <NavLink to={APP_ROUTES.POSTS}>Пости</NavLink>
          <NavLink to={APP_ROUTES.CREATE_POST}>Створити</NavLink>
          <NavLink to={APP_ROUTES.USERS}>Користувачі</NavLink>
          <NavLink to={APP_ROUTES.CONNECTIONS}>Друзі</NavLink>
          <NavLink to={APP_ROUTES.CHATS}>Чати {unreadCount > 0 ? <span className="badge">{unreadCount}</span> : null}</NavLink>
          <button type="button" className="btn btn--ghost" onClick={() => setLogoutOpen(true)}>
            Вийти
          </button>
        </nav>
      </header>
      <main className="content">{children}</main>
      <ConfirmModal
        open={logoutOpen}
        title={CONFIRM_TEXT.LOGOUT_TITLE}
        description={CONFIRM_TEXT.LOGOUT_DESCRIPTION}
        confirmText="Вийти"
        onCancel={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};
