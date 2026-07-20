import type { MouseEvent, ReactNode } from 'react';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ onClose, children }: ModalProps) {
  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 px-4" onClick={handleBackdropClick}>
      <div className="relative w-full max-w-sm rounded-xl border border-terminal-800 bg-terminal-900 px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-2 text-terminal-100 hover:text-terminal-50"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
