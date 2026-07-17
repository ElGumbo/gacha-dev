import apiClient from './client';
import type { ProgressResponse } from '../types/progress.types';

export async function getProgressRequest() {
  const { data } = await apiClient.get<ProgressResponse>('/api/progress');
  return data;
}
