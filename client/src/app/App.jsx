import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../widgets/layout/AppShell';
import { APP_ROUTES } from '../shared/constants/routes';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PostDetailsPage } from '../pages/PostDetailsPage';
import { AuthPage } from '../pages/AuthPage';
import { useAuth } from './providers/AuthProvider';
import { useSocketState } from './providers/SocketProvider';
import { PostsPage } from '../pages/PostsPage';
import { CreatePostPage } from '../pages/CreatePostPage';
import { UsersPage } from '../pages/UsersPage';
import { UserProfilePage } from '../pages/UserProfilePage';
import { ChatsPage } from '../pages/ChatsPage';
import { ConnectionsPage } from '../pages/ConnectionsPage';

export const App = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { totalUnread } = useSocketState();

  if (loading) {
    return <div className="auth-screen">Завантаження...</div>;
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <AppShell user={user} onLogout={logout} unreadCount={totalUnread}>
      <Routes>
        <Route path={APP_ROUTES.HOME} element={<Navigate to={APP_ROUTES.POSTS} replace />} />
        <Route path={APP_ROUTES.POSTS} element={<PostsPage />} />
        <Route path={APP_ROUTES.CREATE_POST} element={<CreatePostPage />} />
        <Route path={APP_ROUTES.POST_DETAILS} element={<PostDetailsPage />} />
        <Route path={APP_ROUTES.USERS} element={<UsersPage />} />
        <Route path={APP_ROUTES.USER_PROFILE} element={<UserProfilePage />} />
        <Route path={APP_ROUTES.CHATS} element={<ChatsPage />} />
        <Route path={APP_ROUTES.CONNECTIONS} element={<ConnectionsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
};
