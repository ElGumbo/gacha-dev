import type { ReactNode } from 'react';

interface CharacterGridProps {
  children: ReactNode;
}

export function CharacterGrid({ children }: CharacterGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">{children}</div>
  );
}
