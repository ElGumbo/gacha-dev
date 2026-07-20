import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  children: ReactNode;
}

export function StatCard({ label, children }: StatCardProps) {
  return (
    <div className="rounded-xl border border-terminal-800 bg-terminal-900 p-4">
      <p className="mb-1.5 text-xs text-terminal-100">{label}</p>
      {children}
    </div>
  );
}
