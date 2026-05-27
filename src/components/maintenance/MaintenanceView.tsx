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
      <div className="page-header page-header--compact">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="page-title">Maintenance</h1>
          <button
            onClick={tab === 'reminders' ? openNewReminder : openNewLog}
            className="fab"
            style={{ position: 'static', width: 36, height: 36 }}
            aria-label="Add item"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ padding: '0 16px 12px' }}>
        <div className="tab-switcher">
          {(['reminders', 'log'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`tab-switcher-tab${tab === t ? ' tab-switcher-tab--active' : ''}`}
            >
              {t === 'reminders' ? 'Reminders' : 'Log'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 0 16px' }}>
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
      <div className="empty-state">
        <p className="empty-state-title">No reminders yet</p>
        <p className="empty-state-body">Tap + to add your first seasonal reminder.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 16px' }}>
      {SEASON_ORDER.map((season) => {
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

            <div style={{ overflow: 'hidden', maxHeight: isOpen ? '4000px' : '0', transition: 'max-height 250ms ease' }}>
              {items.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onOpen(r)}
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
          </div>
        );
      })}
    </div>
  );
}

function LogTab({ entries, onOpen }: { entries: MaintenanceLogEntry[]; onOpen: (e: MaintenanceLogEntry) => void }) {
  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">No log entries yet</p>
        <p className="empty-state-body">Tap + to record your first maintenance entry.</p>
      </div>
    );
  }

  return (
    <div>
      {entries.map((e) => (
        <button
          key={e.id}
          onClick={() => onOpen(e)}
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
      ))}
    </div>
  );
}
