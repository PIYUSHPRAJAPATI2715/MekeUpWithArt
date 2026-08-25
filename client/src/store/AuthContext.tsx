import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '../types';
import { authApi } from '../api';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('mwa_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    if (!localStorage.getItem('mwa_token')) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await authApi.getMe();
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error('[Auth] Failed to load session', err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await authApi.login({ email, password: pass });
    if (res.data.success) {
      const token = res.data.token;
      const user = res.data.user;
      localStorage.setItem('mwa_token', token);
      setToken(token);
      setUser(user);
    }
    return res.data;
  };

  const register = async (name: string, email: string, phone: string, pass: string) => {
    const res = await authApi.register({ name, email, phone, password: pass });
    if (res.data.success) {
      const token = res.data.token;
      const user = res.data.user;
      localStorage.setItem('mwa_token', token);
      setToken(token);
      setUser(user);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('mwa_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
