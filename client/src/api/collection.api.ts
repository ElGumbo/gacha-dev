import apiClient from './client';
import type { CollectionListResponse } from '../types/collection.types';

export async function getCollectionRequest() {
  const { data } = await apiClient.get<CollectionListResponse>('/api/collection');
  return data;
}
