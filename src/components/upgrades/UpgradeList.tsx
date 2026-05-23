'use client';

import { useState } from 'react';
import UpgradeSheet from './UpgradeSheet';
import { type UpgradeRow } from '@/actions/upgrades';

const PHASE_STYLE: Record<string, { label: string; bg: string; text: string }> = {
  idea: { label: 'Idea', bg: 'var(--surface-raised)', text: 'var(--text-muted)' },
  planning: { label: 'Planning', bg: '#2A3A5A', text: '#7AB0E8' },
  in_progress: { label: 'In Progress', bg: '#3A5A2A', text: '#8AE87A' },
  completed: { label: 'Done', bg: '#2A4A2A', text: 'var(--success)' },
  cancelled: { label: 'Cancelled', bg: 'var(--surface-raised)', text: 'var(--text-muted)' },
};

const PRIORITY_COLOR: Record<string, string> = {
  urgent: 'var(--danger)',
  high: 'var(--warning)',
  medium: 'var(--text-muted)',
  low: 'var(--text-muted)',
  someday: 'var(--text-muted)',
};

function fmt(v: string): string {
  return v.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatCost(low: number | null, high: number | null, actual: number | null): string | null {
  if (actual) return `$${actual.toLocaleString()}`;
  if (low && high) return `$${low.toLocaleString()}–$${high.toLocaleString()}`;
  if (low) return `~$${low.toLocaleString()}`;
  return null;
}

const PHASE_ORDER = ['in_progress', 'planning', 'idea', 'completed', 'cancelled'];

export default function UpgradeList({ upgrades }: { upgrades: UpgradeRow[] }) {
  const [selected, setSelected] = useState<UpgradeRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activePhase, setActivePhase] = useState<string | null>(null);

  const grouped: Record<string, UpgradeRow[]> = {};
  for (const u of upgrades) {
    if (!grouped[u.phase]) grouped[u.phase] = [];
    grouped[u.phase].push(u);
  }

  const visiblePhases = PHASE_ORDER.filter((p) => grouped[p]?.length);
  const filtered = activePhase ? [activePhase] : visiblePhases;

  function openNew() {
    setSelected(null);
    setSheetOpen(true);
  }

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Upgrades</h1>
        <button
          onClick={openNew}
          className="w-9 h-9 flex items-center justify-center rounded-full text-xl"
          style={{ background: 'var(--accent)', color: '#1A1A1A' }}
        >
          +
        </button>
      </div>

      {/* Phase filter tabs */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
        <button
          onClick={() => setActivePhase(null)}
          className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            background: !activePhase ? 'var(--accent)' : 'var(--surface)',
            color: !activePhase ? '#1A1A1A' : 'var(--text-muted)',
          }}
        >
          All
        </button>
        {visiblePhases.map((p) => {
          const s = PHASE_STYLE[p];
          return (
            <button
              key={p}
              onClick={() => setActivePhase(activePhase === p ? null : p)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: activePhase === p ? s.bg : 'var(--surface)',
                color: activePhase === p ? s.text : 'var(--text-muted)',
              }}
            >
              {s.label} ({grouped[p]?.length ?? 0})
            </button>
          );
        })}
      </div>

      <div className="px-4 pb-4 space-y-5">
        {filtered.map((phase) => {
          const items = grouped[phase] ?? [];
          const ps = PHASE_STYLE[phase];
          return (
            <div key={phase}>
              <p className="text-xs uppercase tracking-wide mb-2 px-1" style={{ color: 'var(--text-muted)' }}>
                {ps.label}
              </p>
              <div className="space-y-2">
                {items.map((u) => {
                  const cost = formatCost(u.estimated_cost_low, u.estimated_cost_high, u.actual_cost);
                  const priorityColor = u.priority ? PRIORITY_COLOR[u.priority] : 'var(--text-muted)';
                  return (
                    <button
                      key={u.id}
                      onClick={() => { setSelected(u); setSheetOpen(true); }}
                      className="w-full text-left rounded-xl p-4 flex items-start gap-3"
                      style={{ background: 'var(--surface)' }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                          {u.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {u.priority && (
                            <span className="text-xs" style={{ color: priorityColor }}>
                              {fmt(u.priority)}
                            </span>
                          )}
                          {cost && (
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {cost}
                            </span>
                          )}
                        </div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--border)', flexShrink: 0, marginTop: 2 }}>
                        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {upgrades.length === 0 && (
          <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
            No upgrades yet. Tap + to add one.
          </p>
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
