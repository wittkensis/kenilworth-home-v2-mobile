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
      <div className="page-header page-header--compact">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="page-title">Routine</h1>
          <button
            onClick={() => { setSelected(null); setSheetOpen(true); }}
            className="fab"
            style={{ position: 'static', width: 36, height: 36 }}
            aria-label="Add reminder"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        {!hasAny ? (
          <div className="empty-state">
            <p className="empty-state-title">No reminders yet</p>
            <p className="empty-state-body">Tap + to add your first seasonal reminder.</p>
          </div>
        ) : (
          SEASON_ORDER.map((season) => {
            const items = grouped[season];
            if (items.length === 0) return null;
            const isOpen = openSeasons.has(season);
            return (
              <div key={season} style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => toggle(season)}
                  className="group-card"
                  style={{ marginBottom: '4px' }}
                >
                  <span className="group-card-label">{SEASON_LABELS[season]}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="group-card-count">{items.length}</span>
                    <svg
                      width="13" height="13" viewBox="0 0 16 16" fill="none"
                      style={{
                        color: 'var(--text-dim)',
                        flexShrink: 0,
                        transform: isOpen ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.15s',
                      }}
                    >
                      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>

                {isOpen && items.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { setSelected(r); setSheetOpen(true); }}
                    className="row row--tappable"
                  >
                    <div className="row-content">
                      <span className="row-primary">{r.name}</span>
                      {r.season_position && (
                        <span className="row-secondary" style={{ textTransform: 'capitalize' }}>
                          {r.season_position} of {SEASON_LABELS[r.season].toLowerCase()}
                        </span>
                      )}
                    </div>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--border)', flexShrink: 0 }}>
                      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}
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
