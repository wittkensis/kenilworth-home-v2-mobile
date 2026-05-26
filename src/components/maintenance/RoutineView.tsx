'use client';

import { useState } from 'react';
import ReminderSheet from './ReminderSheet';
import type { RoutineReminder, Season } from '@/actions/routineReminders';

const SEASON_LABELS: Record<Season, string> = {
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
  winter: 'Winter',
  'year-round': 'Year-round',
};

const SEASON_ORDER: Season[] = ['spring', 'summer', 'fall', 'winter', 'year-round'];

function getCurrentSeason(): Season {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'fall';
  return 'winter';
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

export default function RoutineView({ reminders }: { reminders: RoutineReminder[] }) {
  const [selected, setSelected] = useState<RoutineReminder | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openSeasons, setOpenSeasons] = useState<Set<Season>>(new Set([getCurrentSeason()]));

  const grouped = SEASON_ORDER.reduce<Record<Season, RoutineReminder[]>>((acc, s) => {
    acc[s] = reminders.filter((r) => r.season === s);
    return acc;
  }, {} as Record<Season, RoutineReminder[]>);

  function toggle(s: Season) {
    setOpenSeasons((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  const hasAny = SEASON_ORDER.some((s) => grouped[s].length > 0);

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Routine</h1>
        <button
          onClick={() => { setSelected(null); setSheetOpen(true); }}
          className="w-9 h-9 flex items-center justify-center rounded-full text-xl font-light"
          style={{ background: 'var(--accent)', color: '#1A1A1A' }}
        >
          +
        </button>
      </div>

      <div className="px-4 pb-4">
        {!hasAny ? (
          <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
            No reminders yet. Tap + to add one.
          </p>
        ) : (
          SEASON_ORDER.map((season, i) => {
            const items = grouped[season];
            if (items.length === 0) return null;
            const isOpen = openSeasons.has(season);
            return (
              <div key={season} className={i === 0 ? 'mt-3' : 'mt-5'}>
                <button
                  onClick={() => toggle(season)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: 'var(--surface)' }}
                >
                  <span className="text-base font-semibold" style={{ color: 'var(--text)' }}>
                    {SEASON_LABELS[season]}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'var(--surface-raised)', color: 'var(--text-muted)' }}>
                      {items.length}
                    </span>
                    <Chevron open={isOpen} />
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-1">
                    {items.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => { setSelected(r); setSheetOpen(true); }}
                        className="w-full text-left py-3 px-1 flex items-center gap-3"
                        style={{ borderBottom: '1px solid var(--border)' }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm" style={{ color: 'var(--text)' }}>{r.name}</div>
                          {r.season_position && (
                            <div className="text-xs mt-0.5 capitalize" style={{ color: 'var(--text-muted)' }}>
                              {r.season_position} of {SEASON_LABELS[r.season].toLowerCase()}
                            </div>
                          )}
                        </div>
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--border)', flexShrink: 0 }}>
                          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <ReminderSheet
        reminder={selected}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
