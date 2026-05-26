'use client';

import { useState } from 'react';
import ReminderSheet from './ReminderSheet';
import LogSheet from './LogSheet';
import type { RoutineReminder, Season } from '@/actions/routineReminders';
import type { MaintenanceLogEntry } from '@/actions/maintenanceLog';
import type { AssetRow } from '@/actions/assets';

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

type Props = {
  reminders: RoutineReminder[];
  logEntries: MaintenanceLogEntry[];
  assets: AssetRow[];
};

type Tab = 'reminders' | 'log';

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

export default function MaintenanceView({ reminders, logEntries, assets }: Props) {
  const [tab, setTab] = useState<Tab>('reminders');
  const [selectedReminder, setSelectedReminder] = useState<RoutineReminder | null>(null);
  const [reminderSheetOpen, setReminderSheetOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<MaintenanceLogEntry | null>(null);
  const [logSheetOpen, setLogSheetOpen] = useState(false);

  function openNewReminder() { setSelectedReminder(null); setReminderSheetOpen(true); }
  function openReminder(r: RoutineReminder) { setSelectedReminder(r); setReminderSheetOpen(true); }
  function openNewLog() { setSelectedLog(null); setLogSheetOpen(true); }
  function openLog(e: MaintenanceLogEntry) { setSelectedLog(e); setLogSheetOpen(true); }

  const grouped = SEASON_ORDER.reduce<Record<Season, RoutineReminder[]>>((acc, s) => {
    acc[s] = reminders.filter((r) => r.season === s);
    return acc;
  }, {} as Record<Season, RoutineReminder[]>);

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Maintenance</h1>
        <button
          onClick={tab === 'reminders' ? openNewReminder : openNewLog}
          className="w-9 h-9 flex items-center justify-center rounded-full text-xl font-light"
          style={{ background: 'var(--accent)', color: '#1A1A1A' }}
        >
          +
        </button>
      </div>

      <div className="px-4 mb-4">
        <div className="flex rounded-xl overflow-hidden" style={{ background: 'var(--surface-raised)' }}>
          {(['reminders', 'log'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 text-sm font-medium capitalize transition-colors"
              style={{
                background: tab === t ? 'var(--accent)' : 'transparent',
                color: tab === t ? '#1A1A1A' : 'var(--text-muted)',
              }}
            >
              {t === 'reminders' ? 'Reminders' : 'Log'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        {tab === 'reminders' ? (
          <RemindersTab grouped={grouped} onOpen={openReminder} />
        ) : (
          <LogTab entries={logEntries} onOpen={openLog} />
        )}
      </div>

      <ReminderSheet
        reminder={selectedReminder}
        open={reminderSheetOpen}
        onClose={() => setReminderSheetOpen(false)}
      />
      <LogSheet
        entry={selectedLog}
        assets={assets}
        open={logSheetOpen}
        onClose={() => setLogSheetOpen(false)}
      />
    </>
  );
}

function RemindersTab({
  grouped,
  onOpen,
}: {
  grouped: Record<Season, RoutineReminder[]>;
  onOpen: (r: RoutineReminder) => void;
}) {
  const [openSeasons, setOpenSeasons] = useState<Set<Season>>(new Set([getCurrentSeason()]));

  function toggle(s: Season) {
    setOpenSeasons((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  const hasAny = SEASON_ORDER.some((s) => grouped[s].length > 0);
  if (!hasAny) {
    return (
      <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
        No reminders yet. Tap + to add one.
      </p>
    );
  }

  return (
    <div>
      {SEASON_ORDER.map((season) => {
        const items = grouped[season];
        if (items.length === 0) return null;
        const isOpen = openSeasons.has(season);
        return (
          <div key={season} style={{ borderBottom: '1px solid var(--border)' }}>
            <button
              onClick={() => toggle(season)}
              className="w-full flex items-center justify-between py-3"
            >
              <span className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>
                {SEASON_LABELS[season]}
              </span>
              <div className="flex items-center gap-2.5">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{items.length}</span>
                <Chevron open={isOpen} />
              </div>
            </button>

            {isOpen && (
              <div>
                {items.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onOpen(r)}
                    className="w-full text-left py-3 flex items-center gap-3"
                    style={{ borderTop: '1px solid var(--border)' }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{r.name}</div>
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
      })}
    </div>
  );
}

function LogTab({ entries, onOpen }: { entries: MaintenanceLogEntry[]; onOpen: (e: MaintenanceLogEntry) => void }) {
  if (entries.length === 0) {
    return (
      <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
        No log entries yet. Tap + to record maintenance.
      </p>
    );
  }

  return (
    <div>
      {entries.map((e) => (
        <button
          key={e.id}
          onClick={() => onOpen(e)}
          className="w-full text-left py-3 flex items-start gap-3"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{e.name}</span>
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
  );
}
