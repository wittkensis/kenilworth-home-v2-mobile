"use client";

import { useState, useEffect } from "react";
import { Sheet } from "./Sheet";

type ThemeId = 'folk' | 'lcars' | 'midnight' | 'carbon' | 'win95' | 'mac';

const THEMES: {
  id: ThemeId;
  name: string;
  description: string;
  preview: { bg: string; surface: string; accent: string; text: string };
}[] = [
  {
    id: 'folk',
    name: 'Folk',
    description: 'Warm earth tones',
    preview: { bg: '#1A1816', surface: '#2D2A26', accent: '#A8946A', text: '#F5F1E8' },
  },
  {
    id: 'lcars',
    name: 'LCARS',
    description: 'Star Trek: TNG',
    preview: { bg: '#090909', surface: '#190700', accent: '#ec943a', text: '#eb9870' },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep ocean blue',
    preview: { bg: '#060B14', surface: '#0D1826', accent: '#4078FF', text: '#DCE8FF' },
  },
  {
    id: 'carbon',
    name: 'Carbon',
    description: 'Minimal black',
    preview: { bg: '#000000', surface: '#0A0A0A', accent: '#FFFFFF', text: '#FFFFFF' },
  },
  {
    id: 'win95',
    name: 'Win 95',
    description: 'Windows 95',
    preview: { bg: '#008080', surface: '#C0C0C0', accent: '#000080', text: '#000000' },
  },
  {
    id: 'mac',
    name: 'Classic Mac',
    description: 'System 6 / 7',
    preview: { bg: '#FFFFFF', surface: '#EEEEEE', accent: '#000000', text: '#000000' },
  },
];

const STORAGE_KEY = 'home-theme';

function applyTheme(id: ThemeId) {
  const html = document.documentElement;
  if (id === 'folk') {
    delete html.dataset.theme;
  } else {
    html.dataset.theme = id;
  }
}

function readTheme(): ThemeId {
  try { return (localStorage.getItem(STORAGE_KEY) as ThemeId) || 'folk'; }
  catch { return 'folk'; }
}

interface SheetProps {
  open: boolean;
  onClose: () => void;
}

export function ThemeSheet({ open, onClose }: SheetProps) {
  const [current, setCurrent] = useState<ThemeId>('folk');

  useEffect(() => { setCurrent(readTheme()); }, []);

  function pick(id: ThemeId) {
    applyTheme(id);
    localStorage.setItem(STORAGE_KEY, id);
    setCurrent(id);
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title="Appearance">
      <div className="sheet-body--padded">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {THEMES.map((t) => {
            const active = current === t.id;
            return (
              <button
                key={t.id}
                onClick={() => pick(t.id)}
                style={{
                  background: t.preview.bg,
                  border: `2px solid ${active ? t.preview.accent : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'border-color 150ms ease',
                  boxShadow: active ? `0 0 0 1px ${t.preview.accent}` : 'none',
                }}
                aria-pressed={active}
              >
                {/* Color swatch row */}
                <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, background: t.preview.surface, border: '1px solid rgba(255,255,255,0.08)' }} />
                  <div style={{ width: 18, height: 18, borderRadius: 4, background: t.preview.accent }} />
                  <div style={{ width: 18, height: 18, borderRadius: 4, background: t.preview.text, opacity: 0.4 }} />
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: t.preview.text, lineHeight: 1.2, marginBottom: 3 }}>
                  {t.name}
                  {active && (
                    <span style={{ marginLeft: 6, fontSize: '10px', color: t.preview.accent, fontWeight: 700, letterSpacing: '0.05em' }}>✓</span>
                  )}
                </div>
                <div style={{ fontSize: '0.6875rem', color: t.preview.text, opacity: 0.45, letterSpacing: '0.02em' }}>
                  {t.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Sheet>
  );
}

// Palette icon SVG
function PaletteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/>
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/>
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/>
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  );
}

interface TriggerProps {
  variant?: 'sidebar' | 'floating';
}

export function ThemeTrigger({ variant = 'floating' }: TriggerProps) {
  const [open, setOpen] = useState(false);

  if (variant === 'sidebar') {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="app-sidebar-item"
          style={{ marginTop: 'auto', color: 'var(--text-dim)', opacity: 0.6 }}
          title="Change theme"
        >
          <PaletteIcon />
          <span>Appearance</span>
        </button>
        {open && <ThemeSheet open onClose={() => setOpen(false)} />}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: `calc(max(env(safe-area-inset-bottom, 0px), 12px) + 80px + 10px)`,
          left: 16,
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'var(--surface-raised)',
          color: 'var(--text-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 19,
          opacity: 0.7,
          transition: 'opacity var(--t-fast)',
          border: '1px solid var(--border)',
        }}
        aria-label="Change theme"
      >
        <PaletteIcon />
      </button>
      {open && <ThemeSheet open onClose={() => setOpen(false)} />}
    </>
  );
}
