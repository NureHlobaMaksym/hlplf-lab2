import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../shared/constants/routes';

const initialRegister = {
  firstName: '',
  lastName: '',
  email: '',
  password: ''
};

const initialLogin = {
  email: '',
  password: ''
};

export const useAuthForm = ({ login, register }) => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState(initialRegister);
  const [loginData, setLoginData] = useState(initialLogin);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login');

  const title = useMemo(() => (mode === 'login' ? 'Вхід' : 'Реєстрація'), [mode]);

  useEffect(() => {
    setError('');
  }, [mode]);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await register(registerData);
      navigate(APP_ROUTES.POSTS, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(loginData);
      navigate(APP_ROUTES.POSTS, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    registerData,
    setRegisterData,
    loginData,
    setLoginData,
    error,
    mode,
    setMode,
    title,
    handleRegister,
    handleLogin
  };
};
