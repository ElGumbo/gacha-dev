import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { refreshAccessToken, setAccessToken } from '../api/client';
import { loginRequest, logoutRequest, meRequest, registerRequest } from '../api/auth.api';
import type { LoginPayload, RegisterPayload, User } from '../types/auth.types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasRestoredSession = useRef(false);

  useEffect(() => {
    if (hasRestoredSession.current) return;
    hasRestoredSession.current = true;

    async function restoreSession() {
      try {
        await refreshAccessToken();
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
