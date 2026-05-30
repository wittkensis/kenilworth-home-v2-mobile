'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Canonical KW bottom sheet — identical file in Focus and Home.
// `open` defaults to true so consumers that conditionally mount the sheet
// work without passing it; consumers that keep it mounted toggle `open`.

type SheetProps = {
  open?: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  noPadding?: boolean;
};

const CLOSE_ANIM_MS = 280;
const DRAG_THRESHOLD = 80; // px down to dismiss
const UP_RESISTANCE = 0.25; // rubber-band damping when dragging up

export function Sheet({ open = true, onClose, title, children, noPadding }: SheetProps) {
  const [visible, setVisible] = useState(open);
  const [closing, setClosing] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startY: 0, dy: 0 });

  useEffect(() => {
    if (open) { setVisible(true); setClosing(false); }
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  const finishClose = useCallback(() => {
    setVisible(false);
    setClosing(false);
    onClose();
  }, [onClose]);

  const triggerClose = useCallback(() => {
    setClosing(true);
    setTimeout(finishClose, CLOSE_ANIM_MS);
  }, [finishClose]);

  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') triggerClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible, triggerClose]);

  // Mobile keyboard: lift the sheet above the on-screen keyboard while an
  // input is focused, and revert when it closes. Uses the VisualViewport API.
  useEffect(() => {
    if (!visible) return;
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    if (!vv) return;
    const apply = () => {
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      sheetRef.current?.style.setProperty('--kb-inset', `${inset}px`);
    };
    vv.addEventListener('resize', apply);
    vv.addEventListener('scroll', apply);
    apply();
    return () => {
      vv.removeEventListener('resize', apply);
      vv.removeEventListener('scroll', apply);
      sheetRef.current?.style.removeProperty('--kb-inset');
    };
  }, [visible]);

  // Keep the focused field visible above the keyboard.
  // block:'nearest' only scrolls if the element is out of view — avoids
  // jarring scroll when tapping a field (like a date picker) already visible.
  function onFocusCapture(e: React.FocusEvent) {
    const t = e.target as HTMLElement;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) {
      setTimeout(() => t.scrollIntoView({ block: 'nearest', behavior: 'instant' }), 150);
    }
  }

  function onHandleTouchStart(e: React.TouchEvent) {
    drag.current = { active: true, startY: e.touches[0].clientY, dy: 0 };
    if (sheetRef.current) {
      sheetRef.current.style.transition = 'none';
      sheetRef.current.style.willChange = 'transform';
    }
  }

  function onHandleTouchMove(e: React.TouchEvent) {
    if (!drag.current.active || !sheetRef.current) return;
    const delta = e.touches[0].clientY - drag.current.startY;
    drag.current.dy = delta;
    // Down: follow finger 1:1. Up: rubber-band with resistance (sticky feel).
    const offset = delta >= 0 ? delta : delta * UP_RESISTANCE;
    sheetRef.current.style.transform = `translateY(${offset}px)`;
  }

  function onHandleTouchEnd() {
    if (!drag.current.active || !sheetRef.current) return;
    drag.current.active = false;
    const dy = drag.current.dy;
    sheetRef.current.style.willChange = '';
    if (dy > DRAG_THRESHOLD) {
      // Past threshold — dismiss
      sheetRef.current.style.transition = `transform ${CLOSE_ANIM_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`;
      sheetRef.current.style.transform = 'translateY(100%)';
      setTimeout(finishClose, CLOSE_ANIM_MS);
    } else {
      // Snap back (covers both small down-drags and any up-drag)
      sheetRef.current.style.transition = 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)';
      sheetRef.current.style.transform = 'translateY(0)';
      setTimeout(() => { if (sheetRef.current) sheetRef.current.style.transition = ''; }, 300);
    }
  }

  if (!visible) return null;

  return (
    <div className={`sheet-backdrop${closing ? ' sheet-backdrop--closing' : ''}`}>
      <div className="sheet-backdrop-overlay" onClick={triggerClose} />
      <div ref={sheetRef} className={`sheet-panel${closing ? ' sheet-panel--closing' : ''}`} onFocusCapture={onFocusCapture}>
        <div
          className="sheet-handle"
          onTouchStart={onHandleTouchStart}
          onTouchMove={onHandleTouchMove}
          onTouchEnd={onHandleTouchEnd}
          style={{ cursor: 'grab', touchAction: 'none' }}
        />
        <div className="sheet-header">
          <h2 className="sheet-title">{title}</h2>
          <button className="sheet-close" onClick={triggerClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className={noPadding ? 'sheet-body' : 'sheet-body sheet-body--padded'}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Sheet;
