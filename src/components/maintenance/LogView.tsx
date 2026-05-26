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
      <div className="page-header page-header--compact">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="page-title">Log</h1>
          <button
            onClick={() => { setSelected(null); setSheetOpen(true); }}
            className="fab"
            style={{ position: 'static', width: 36, height: 36 }}
            aria-label="Add log entry"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ padding: '0 0 16px' }}>
        {logEntries.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">No log entries yet</p>
            <p className="empty-state-body">Tap + to record your first maintenance entry.</p>
          </div>
        ) : (
          logEntries.map((e) => (
            <button
              key={e.id}
              onClick={() => { setSelected(e); setSheetOpen(true); }}
              className="row row--tappable"
            >
              <div className="row-content">
                <span className="row-primary">{e.name}</span>
                <span className="row-secondary">
                  {[
                    e.asset_name,
                    e.contractor,
                    e.cost != null ? `$${e.cost.toLocaleString()}` : null,
                  ].filter(Boolean).join(' · ') || 'No details'}
                </span>
              </div>
              <span className="row-trailing">{e.date}</span>
            </button>
          ))
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
