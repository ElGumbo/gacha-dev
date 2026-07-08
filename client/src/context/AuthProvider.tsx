import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { setAccessToken } from '../api/client';
import { loginRequest, logoutRequest, meRequest, refreshRequest, registerRequest } from '../api/auth.api';
import type { LoginPayload, RegisterPayload, User } from '../types/auth.types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const { accessToken } = await refreshRequest();
        setAccessToken(accessToken);
        const { user } = await meRequest();
        setUser(user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function login(payload: LoginPayload) {
    const { accessToken } = await loginRequest(payload);
    setAccessToken(accessToken);
    const { user } = await meRequest();
    setUser(user);
  }

  async function register(payload: RegisterPayload) {
    const { accessToken } = await registerRequest(payload);
    setAccessToken(accessToken);
    const { user } = await meRequest();
    setUser(user);
  }

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
