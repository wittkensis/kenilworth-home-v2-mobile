'use client';

import { useState } from 'react';
import AssetSheet from './AssetSheet';
import { type AssetRow, type AreaGroup, type AreaItem } from '@/actions/assets';

const WARRANTY_BADGE: Record<string, { label: string; color: string }> = {
  active: { label: 'In warranty', color: 'var(--success)' },
  expiring: { label: 'Expiring', color: 'var(--warning)' },
  expired: { label: 'Expired', color: 'var(--danger)' },
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="13" height="13" viewBox="0 0 16 16" fill="none"
      style={{
        color: 'var(--text-muted)',
        flexShrink: 0,
        transform: open ? 'rotate(90deg)' : 'none',
        transition: 'transform 0.15s',
      }}
    >
      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const grouped: Record<string, AssetRow[]> = {};
  for (const a of assets) {
    const key = a.area_group_name ?? 'No Area';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(a);
  }

  function toggle(key: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Assets</h1>
        <button
          onClick={() => { setSelected(null); setSheetOpen(true); }}
          className="w-9 h-9 flex items-center justify-center rounded-full text-xl"
          style={{ background: 'var(--accent)', color: '#1A1A1A' }}
        >
          +
        </button>
      </div>

      <div className="px-4 pb-4">
        {assets.length === 0 ? (
          <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
            No assets yet. Tap + to add one.
          </p>
        ) : (
          Object.entries(grouped).map(([group, items]) => {
            const isOpen = openGroups.has(group);
            return (
              <div key={group} style={{ borderBottom: '1px solid var(--border)' }}>
                <button
                  onClick={() => toggle(group)}
                  className="w-full flex items-center justify-between py-3"
                >
                  <span className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>
                    {group}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{items.length}</span>
                    <Chevron open={isOpen} />
                  </div>
                </button>

                {isOpen && (
                  <div>
                    {items.map((a) => {
                      const wb = a.warranty_status ? WARRANTY_BADGE[a.warranty_status] : null;
                      const sub = [a.area_item_name, a.brand, a.model].filter(Boolean).join(' · ');
                      return (
                        <button
                          key={a.id}
                          onClick={() => { setSelected(a); setSheetOpen(true); }}
                          className="w-full text-left py-3 flex items-center gap-3"
                          style={{ borderTop: '1px solid var(--border)' }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                              {a.name}
                            </div>
                            {sub && (
                              <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                                {sub}
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
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--border)', flexShrink: 0 }}>
                            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
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
