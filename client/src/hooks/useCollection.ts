import { useEffect, useRef, useState } from 'react';
import { getCollectionRequest } from '../api/collection.api';
import type { CollectionCharacter } from '../types/collection.types';

export function useCollection() {
  const [characters, setCharacters] = useState<CollectionCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

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
  }, []);

  return { characters, isLoading, error };
}
