import apiClient from './client';
import type { BannersListResponse, PullResponse } from '../types/banner.types';

export async function getBannersRequest() {
  const { data } = await apiClient.get<BannersListResponse>('/api/banners');
  return data;
}

export async function pullBannerRequest(bannerId: string) {
  const { data } = await apiClient.post<PullResponse>(`/api/banners/${bannerId}/pull`);
  return data;
}
