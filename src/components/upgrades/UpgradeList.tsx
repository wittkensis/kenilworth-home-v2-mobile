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
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Upgrades</h1>
        <button
          onClick={() => { setSelected(null); setSheetOpen(true); }}
          className="w-9 h-9 flex items-center justify-center rounded-full text-xl"
          style={{ background: 'var(--accent)', color: '#1A1A1A' }}
        >
          +
        </button>
      </div>

      <div className="px-4 pb-4">
        {upgrades.length === 0 ? (
          <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
            No upgrades yet. Tap + to add one.
          </p>
        ) : (
          visiblePhases.map((phase, i) => {
            const items = grouped[phase];
            const isOpen = openPhases.has(phase);
            return (
              <div key={phase} className={i === 0 ? 'mt-3' : 'mt-5'}>
                {/* Section header */}
                <button
                  onClick={() => toggle(phase)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: 'var(--surface)' }}
                >
                  <span className="text-base font-semibold" style={{ color: 'var(--text)' }}>
                    {PHASE_LABEL[phase] ?? phase}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'var(--surface-raised)', color: 'var(--text-muted)' }}>
                      {items.length}
                    </span>
                    <Chevron open={isOpen} />
                  </div>
                </button>

                {/* Items */}
                {isOpen && (
                  <div className="mt-1">
                    {items.map((u) => {
                      const cost = formatCost(u.estimated_cost_low, u.estimated_cost_high, u.actual_cost);
                      return (
                        <button
                          key={u.id}
                          onClick={() => { setSelected(u); setSheetOpen(true); }}
                          className="w-full text-left py-3 px-1 flex items-start gap-3"
                          style={{ borderBottom: '1px solid var(--border)' }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm" style={{ color: 'var(--text)' }}>
                              {u.name}
                            </div>
                            {cost && (
                              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                {cost}
                              </div>
                            )}
                          </div>
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--border)', flexShrink: 0, marginTop: 2 }}>
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

      <UpgradeSheet
        upgrade={selected}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
