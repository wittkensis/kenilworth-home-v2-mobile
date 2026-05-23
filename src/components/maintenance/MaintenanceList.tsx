'use client';

import { useState } from 'react';
import TaskSheet from './TaskSheet';
import { type TaskWithStatus } from '@/actions/maintenance';

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  overdue: { bg: 'var(--danger)', text: '#fff', label: 'Overdue' },
  'due-soon': { bg: 'var(--warning)', text: '#1A1A1A', label: 'Due soon' },
  upcoming: { bg: 'var(--surface-raised)', text: 'var(--text-muted)', label: 'Upcoming' },
};

export default function MaintenanceList({ tasks }: { tasks: TaskWithStatus[] }) {
  const [selected, setSelected] = useState<TaskWithStatus | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function openNew() {
    setSelected(null);
    setSheetOpen(true);
  }

  function openTask(task: TaskWithStatus) {
    setSelected(task);
    setSheetOpen(true);
  }

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Maintenance</h1>
        <button
          onClick={openNew}
          className="w-9 h-9 flex items-center justify-center rounded-full text-xl"
          style={{ background: 'var(--accent)', color: '#1A1A1A' }}
        >
          +
        </button>
      </div>

      <div className="px-4 pb-4">
        {tasks.length === 0 && (
          <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
            No tasks yet. Tap + to add one.
          </p>
        )}

        <div className="space-y-2">
          {tasks.map((task) => {
            const style = STATUS_STYLES[task.status];
            return (
              <button
                key={task.id}
                onClick={() => openTask(task)}
                className="w-full text-left rounded-xl p-4 flex items-start gap-3"
                style={{ background: 'var(--surface)' }}
              >
                <div
                  className="mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ background: style.bg, color: style.text }}
                >
                  {style.label}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                    {task.name}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {task.frequency_label ?? `Every ${task.frequency_days} days`}
                    {task.last_completed_date && (
                      <> · Last: {task.last_completed_date}</>
                    )}
                    {!task.last_completed_date && ' · Never logged'}
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

      <TaskSheet
        task={selected}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
