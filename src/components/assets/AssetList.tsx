'use client';

import { useState } from 'react';
import AssetSheet from './AssetSheet';
import { type AssetRow, type AreaGroup, type AreaItem } from '@/actions/assets';

const WARRANTY_BADGE: Record<string, string> = {
  active: 'badge badge-success',
  expiring: 'badge badge-warning',
  expired: 'badge badge-danger',
};

const WARRANTY_LABEL: Record<string, string> = {
  active: 'In warranty',
  expiring: 'Expiring',
  expired: 'Expired',
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
      <div className="page-header page-header--compact">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="page-title">Assets</h1>
          <button
            onClick={() => { setSelected(null); setSheetOpen(true); }}
            className="fab"
            style={{ position: 'static', width: 36, height: 36 }}
            aria-label="Add asset"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        {assets.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">No assets yet</p>
            <p className="empty-state-body">Tap + to add your first home asset.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([group, items]) => {
            const isOpen = openGroups.has(group);
            return (
              <div key={group} style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => toggle(group)}
                  className={`section-header section-header--interactive${isOpen ? ' section-header--open' : ''}`}
                >
                  <span className="section-header-label">{group}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="section-header-count">{items.length}</span>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="section-header-chevron">
                      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>

                <div style={{ overflow: 'hidden', maxHeight: isOpen ? '4000px' : '0', transition: 'max-height 250ms ease' }}>
                  {items.map((a) => {
                    const sub = [a.area_item_name, a.brand, a.model].filter(Boolean).join(' · ');
                    return (
                      <button
                        key={a.id}
                        onClick={() => { setSelected(a); setSheetOpen(true); }}
                        className="row row--tappable"
                      >
                        <div className="row-content">
                          <span className="row-primary">{a.name}</span>
                          {sub && <span className="row-secondary">{sub}</span>}
                        </div>
                        {a.warranty_status && WARRANTY_BADGE[a.warranty_status] && (
                          <span className={WARRANTY_BADGE[a.warranty_status]}>
                            {WARRANTY_LABEL[a.warranty_status]}
                          </span>
                        )}
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--border)', flexShrink: 0 }}>
                          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
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
