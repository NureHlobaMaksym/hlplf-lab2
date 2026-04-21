import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../../entities/auth/api';
import { setAuthToken } from '../../shared/api/http';
import { tokenStorage } from '../../shared/lib/token-storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(tokenStorage.get());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthToken(token);

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then((profile) => setUser(profile))
      .catch(() => {
        tokenStorage.clear();
        setAuthToken('');
        setToken('');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (payload) => {
    const result = await authApi.login(payload);
    setAuthToken(result.token);
    tokenStorage.set(result.token);
    setToken(result.token);
    setUser(result.user);
  };

  const register = async (payload) => {
    const result = await authApi.register(payload);
    setAuthToken(result.token);
    tokenStorage.set(result.token);
    setToken(result.token);
    setUser(result.user);
  };

  const logout = () => {
    tokenStorage.clear();
    setAuthToken('');
    setToken('');
    setUser(null);
  };

  const updateUser = (patch) => {
    setUser((prev) => {
      if (!prev) {
        return prev;
      }

      return { ...prev, ...patch };
    });
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      updateUser
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
