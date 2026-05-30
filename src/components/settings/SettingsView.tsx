'use client';

import { useState } from 'react';
import { ThemeSheet } from '@/components/ui/ThemeSwitcher';

export default function SettingsView() {
  const [themeOpen, setThemeOpen] = useState(false);

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <h1 className="page-title">Settings</h1>
        </div>
      </div>

      <div className="page-body">
        <p className="category-label" style={{ padding: '16px 20px 6px' }}>Appearance</p>

        <button
          className="row row--tappable"
          onClick={() => setThemeOpen(true)}
        >
          <span className="row-content">
            <span className="row-primary">Theme</span>
          </span>
          <svg className="row-trailing" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--text-dim)' }}>
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      <ThemeSheet open={themeOpen} onClose={() => setThemeOpen(false)} />
    </>
  );
}
