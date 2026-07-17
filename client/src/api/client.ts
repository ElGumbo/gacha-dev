import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { AuthSuccessResponse } from '../types/auth.types';

const AUTH_ENDPOINTS_WITHOUT_REFRESH_RETRY = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh'];

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

apiClient.interceptors.request.use(config => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

export function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post<AuthSuccessResponse>('/api/auth/refresh')
      .then(({ data }) => {
        setAccessToken(data.accessToken);
        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const config = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (!config) return Promise.reject(error);

    const isUnauthorized = error.response?.status === 401;
    const isExemptFromRefresh = AUTH_ENDPOINTS_WITHOUT_REFRESH_RETRY.includes(config.url ?? '');
    const alreadyRetried = config._retry ?? false;

    if (!isUnauthorized || isExemptFromRefresh || alreadyRetried) {
      return Promise.reject(error);
    }
    config._retry = true;

    try {
      await refreshAccessToken();
    } catch (refreshError) {
      const refreshStatus = axios.isAxiosError(refreshError) ? refreshError.response?.status : undefined;
      const refreshTokenIsInvalid = refreshStatus === 401 || refreshStatus === 403;

      if (refreshTokenIsInvalid) {
        setAccessToken(null);
        apiClient.delete('/api/auth/logout').catch(() => {
          // best-effort: the refresh token is already invalid either way
        });
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    return apiClient(config);
  }
);

export default apiClient;
