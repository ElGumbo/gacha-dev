import { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { refreshAccessToken, setAccessToken } from '../api/client';
import { loginRequest, logoutRequest, meRequest, registerRequest } from '../api/auth.api';
import { useEffectOnce } from '../hooks/useEffectOnce';
import type { LoginPayload, RegisterPayload, User } from '../types/auth.types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffectOnce(() => {
    async function restoreSession() {
      try {
        await refreshAccessToken();
        setIsAuthenticated(true);
        const { user } = await meRequest();
        setUser(user);
      } catch {
        setAccessToken(null);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  });

  async function login(payload: LoginPayload) {
    const { accessToken } = await loginRequest(payload);
    setAccessToken(accessToken);
    const { user } = await meRequest();
    setUser(user);
    setIsAuthenticated(true);
  }

  async function register(payload: RegisterPayload) {
    const { accessToken } = await registerRequest(payload);
    setAccessToken(accessToken);
    const { user } = await meRequest();
    setUser(user);
    setIsAuthenticated(true);
  }

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      setAccessToken(null);
      setIsAuthenticated(false);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
