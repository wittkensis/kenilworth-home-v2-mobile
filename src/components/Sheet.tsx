'use client';

import { useEffect, useRef } from 'react';

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  noPadding?: boolean;
};

export default function Sheet({ open, onClose, title, children, noPadding }: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="sheet-backdrop">
      {/* Backdrop overlay */}
      <div className="sheet-backdrop-overlay" onClick={onClose} />

      {/* Sheet panel */}
      <div ref={sheetRef} className="sheet-panel">
        {/* Handle */}
        <div className="sheet-handle" />

        {/* Header */}
        <div className="sheet-header">
          <h2 className="sheet-title">{title}</h2>
          <button className="sheet-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={noPadding ? 'sheet-body' : 'sheet-body sheet-body--padded'}>
          {children}
        </div>
      </div>
    </div>
  );
}
