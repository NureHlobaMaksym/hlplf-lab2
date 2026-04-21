import { useAuth } from '../app/providers/AuthProvider';
import { Panel } from '../shared/ui/Panel';
import { Input } from '../shared/ui/Input';
import { Button } from '../shared/ui/Button';
import { StatusBox } from '../shared/ui/StatusBox';
import { useAuthForm } from '../features/auth/useAuthForm';

export const AuthPage = () => {
  const { login, register } = useAuth();
  const { registerData, setRegisterData, loginData, setLoginData, error, mode, setMode, title, handleRegister, handleLogin } =
    useAuthForm({ login, register });

  return (
    <div className="auth-screen">
      <Panel title="Social Sphere" subtitle="Instagram-like: стрічка, друзі, профілі, realtime чат">
        <div className="row">
          <Button variant={mode === 'login' ? 'primary' : 'ghost'} onClick={() => setMode('login')}>
            Увійти
          </Button>
          <Button variant={mode === 'register' ? 'primary' : 'ghost'} onClick={() => setMode('register')}>
            Зареєструватись
          </Button>
        </div>

        <h3>{title}</h3>
        <StatusBox type="error" message={error} />

        {mode === 'login' ? (
          <form className="stack" onSubmit={handleLogin}>
            <Input
              label="Email"
              type="email"
              value={loginData.email}
              onChange={(event) => setLoginData((prev) => ({ ...prev, email: event.target.value }))}
              required
              minLength={3}
              maxLength={180}
            />
            <Input
              label="Пароль"
              type="password"
              value={loginData.password}
              onChange={(event) => setLoginData((prev) => ({ ...prev, password: event.target.value }))}
              required
              minLength={8}
              maxLength={64}
            />
            <Button type="submit">Увійти</Button>
          </form>
        ) : (
          <form className="stack" onSubmit={handleRegister}>
            <Input
              label="Ім'я"
              value={registerData.firstName}
              onChange={(event) => setRegisterData((prev) => ({ ...prev, firstName: event.target.value }))}
              required
              minLength={2}
              maxLength={80}
            />
            <Input
              label="Прізвище"
              value={registerData.lastName}
              onChange={(event) => setRegisterData((prev) => ({ ...prev, lastName: event.target.value }))}
              required
              minLength={2}
              maxLength={80}
            />
            <Input
              label="Email"
              type="email"
              value={registerData.email}
              onChange={(event) => setRegisterData((prev) => ({ ...prev, email: event.target.value }))}
              required
              maxLength={180}
            />
            <Input
              label="Пароль"
              type="password"
              value={registerData.password}
              onChange={(event) => setRegisterData((prev) => ({ ...prev, password: event.target.value }))}
              required
              minLength={8}
              maxLength={64}
            />
            <Button type="submit">Створити акаунт</Button>
          </form>
        )}
      </Panel>
    </div>
  );
};
