'use client';

import { useState } from 'react';
import AssetSheet from './AssetSheet';
import { type AssetRow, type AreaGroup, type AreaItem } from '@/actions/assets';

const WARRANTY_BADGE: Record<string, { label: string; color: string }> = {
  active: { label: 'In warranty', color: 'var(--success)' },
  expiring: { label: 'Expiring', color: 'var(--warning)' },
  expired: { label: 'Expired', color: 'var(--danger)' },
};

export default function AssetList({
  assets,
  areaGroups,
  areaItems,
}: {
  assets: AssetRow[];
  areaGroups: AreaGroup[];
  areaItems: AreaItem[];
}) {
  const [selected, setSelected] = useState<AssetRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Group by area_group_name
  const grouped: Record<string, AssetRow[]> = {};
  for (const a of assets) {
    const key = a.area_group_name ?? 'No Area';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(a);
  }

  function openNew() {
    setSelected(null);
    setSheetOpen(true);
  }

  function openAsset(a: AssetRow) {
    setSelected(a);
    setSheetOpen(true);
  }

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Assets</h1>
        <button
          onClick={openNew}
          className="w-9 h-9 flex items-center justify-center rounded-full text-xl"
          style={{ background: 'var(--accent)', color: '#1A1A1A' }}
        >
          +
        </button>
      </div>

      <div className="px-4 pb-4 space-y-5">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group}>
            <p className="text-xs uppercase tracking-wide mb-2 px-1" style={{ color: 'var(--text-muted)' }}>
              {group}
            </p>
            <div className="space-y-2">
              {items.map((a) => {
                const wb = a.warranty_status ? WARRANTY_BADGE[a.warranty_status] : null;
                return (
                  <button
                    key={a.id}
                    onClick={() => openAsset(a)}
                    className="w-full text-left rounded-xl p-4 flex items-center gap-3"
                    style={{ background: 'var(--surface)' }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                        {a.name}
                      </div>
                      {(a.brand || a.model) && (
                        <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                          {[a.brand, a.model].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>
                    {wb && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: wb.color + '22', color: wb.color }}
                      >
                        {wb.label}
                      </span>
                    )}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--border)', flexShrink: 0 }}>
                      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {assets.length === 0 && (
          <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
            No assets yet. Tap + to add one.
          </p>
        )}
      </div>

      <AssetSheet
        asset={selected}
        areaGroups={areaGroups}
        areaItems={areaItems}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
