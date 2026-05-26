'use client';

import { useState } from 'react';
import LogSheet from './LogSheet';
import type { MaintenanceLogEntry } from '@/actions/maintenanceLog';
import type { AssetRow } from '@/actions/assets';

export default function LogView({ logEntries, assets }: { logEntries: MaintenanceLogEntry[]; assets: AssetRow[] }) {
  const [selected, setSelected] = useState<MaintenanceLogEntry | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Log</h1>
        <button
          onClick={() => { setSelected(null); setSheetOpen(true); }}
          className="w-9 h-9 flex items-center justify-center rounded-full text-xl font-light"
          style={{ background: 'var(--accent)', color: '#1A1A1A' }}
        >
          +
        </button>
      </div>

      <div className="px-4 pb-4">
        {logEntries.length === 0 ? (
          <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
            No log entries yet. Tap + to record maintenance.
          </p>
        ) : (
          <div className="mt-3">
            {logEntries.map((e) => (
              <button
                key={e.id}
                onClick={() => { setSelected(e); setSheetOpen(true); }}
                className="w-full text-left py-3 px-1 flex items-start gap-3"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm truncate" style={{ color: 'var(--text)' }}>{e.name}</span>
                    <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>{e.date}</span>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {[
                      e.asset_name,
                      e.contractor,
                      e.cost != null ? `$${e.cost.toLocaleString()}` : null,
                    ].filter(Boolean).join(' · ') || 'No details'}
                  </div>
                </div>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--border)', flexShrink: 0, marginTop: 2 }}>
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>

      <LogSheet
        entry={selected}
        assets={assets}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
