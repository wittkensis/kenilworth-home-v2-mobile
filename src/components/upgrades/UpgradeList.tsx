'use client';

import { useState } from 'react';
import UpgradeSheet from './UpgradeSheet';
import { type UpgradeRow } from '@/actions/upgrades';

const PHASE_LABEL: Record<string, string> = {
  in_progress: 'In Progress',
  planning: 'Planning',
  idea: 'Ideas',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const PHASE_ORDER = ['in_progress', 'planning', 'idea', 'completed', 'cancelled'];

function formatCost(low: number | null, high: number | null, actual: number | null): string | null {
  if (actual) return `$${actual.toLocaleString()}`;
  if (low && high) return `$${low.toLocaleString()}–$${high.toLocaleString()}`;
  if (low) return `~$${low.toLocaleString()}`;
  return null;
}

export default function UpgradeList({ upgrades }: { upgrades: UpgradeRow[] }) {
  const [selected, setSelected] = useState<UpgradeRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openPhases, setOpenPhases] = useState<Set<string>>(new Set(['in_progress', 'planning']));

  const grouped: Record<string, UpgradeRow[]> = {};
  for (const u of upgrades) {
    if (!grouped[u.phase]) grouped[u.phase] = [];
    grouped[u.phase].push(u);
  }

  const visiblePhases = PHASE_ORDER.filter((p) => grouped[p]?.length);

  function toggle(p: string) {
    setOpenPhases((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  }

  return (
    <>
      <div className="page-header page-header--compact">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="page-title">Upgrades</h1>
          <button
            onClick={() => { setSelected(null); setSheetOpen(true); }}
            className="fab"
            style={{ position: 'static', width: 36, height: 36 }}
            aria-label="Add upgrade"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        {upgrades.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">No upgrades yet</p>
            <p className="empty-state-body">Tap + to add your first home upgrade idea.</p>
          </div>
        ) : (
          visiblePhases.map((phase) => {
            const items = grouped[phase];
            const isOpen = openPhases.has(phase);
            return (
              <div key={phase} style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => toggle(phase)}
                  className={`section-header section-header--interactive${isOpen ? ' section-header--open' : ''}`}
                >
                  <span className="section-header-label">{PHASE_LABEL[phase] ?? phase}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="section-header-count">{items.length}</span>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="section-header-chevron">
                      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>

                <div style={{ overflow: 'hidden', maxHeight: isOpen ? '4000px' : '0', transition: 'max-height 250ms ease' }}>
                  {items.map((u) => {
                    const cost = formatCost(u.estimated_cost_low, u.estimated_cost_high, u.actual_cost);
                    return (
                      <button
                        key={u.id}
                        onClick={() => { setSelected(u); setSheetOpen(true); }}
                        className="row row--tappable"
                      >
                        <div className="row-content">
                          <span className="row-primary">{u.name}</span>
                          {cost && <span className="row-secondary">{cost}</span>}
                        </div>
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

      <UpgradeSheet
        upgrade={selected}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
