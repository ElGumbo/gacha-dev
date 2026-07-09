import apiClient from './client';
import type {
  AuthSuccessResponse,
  LoginPayload,
  MeResponse,
  RegisterPayload
} from '../types/auth.types';

export async function registerRequest(payload: RegisterPayload) {
  const { data } = await apiClient.post<AuthSuccessResponse>('/api/auth/register', payload);
  return data;
}

export async function loginRequest(payload: LoginPayload) {
  const { data } = await apiClient.post<AuthSuccessResponse>('/api/auth/login', payload);
  return data;
}

export async function logoutRequest() {
  const { data } = await apiClient.delete<{ message: string }>('/api/auth/logout');
  return data;
}

export async function refreshRequest() {
  const { data } = await apiClient.post<AuthSuccessResponse>('/api/auth/refresh');
  return data;
}

export async function meRequest() {
  const { data } = await apiClient.get<MeResponse>('/api/auth/me');
  return data;
}
