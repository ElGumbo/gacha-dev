import { useState } from 'react';
import { getCollectionRequest } from '../api/collection.api';
import { useEffectOnce } from './useEffectOnce';
import type { CollectionCharacter } from '../types/collection.types';

export function useCollection() {
  const [characters, setCharacters] = useState<CollectionCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffectOnce(() => {
    async function load() {
      try {
        const data = await getCollectionRequest();
        setCharacters(data.characters);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  });

  return { characters, isLoading, error };
}
