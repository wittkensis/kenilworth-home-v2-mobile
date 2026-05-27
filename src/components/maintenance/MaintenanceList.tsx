'use client';

import { useState } from 'react';
import TaskSheet from './TaskSheet';
import { type TaskWithStatus } from '@/actions/maintenance';

const STATUS_BADGE: Record<string, string> = {
  overdue: 'badge badge-danger',
  'due-soon': 'badge badge-warning',
  upcoming: 'badge badge-neutral',
};

const STATUS_LABEL: Record<string, string> = {
  overdue: 'Overdue',
  'due-soon': 'Due soon',
  upcoming: 'Upcoming',
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
      <div className="page-header page-header--compact">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="page-title">Maintenance</h1>
          <button
            onClick={openNew}
            className="fab"
            style={{ position: 'static', width: 36, height: 36 }}
            aria-label="Add task"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ padding: '0 0 16px' }}>
        {tasks.length === 0 && (
          <div className="empty-state">
            <p className="empty-state-title">No tasks yet</p>
            <p className="empty-state-body">Tap + to add your first maintenance task.</p>
          </div>
        )}

        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => openTask(task)}
            className="row row--tappable"
          >
            <span className={STATUS_BADGE[task.status] ?? 'badge badge-neutral'}>
              {STATUS_LABEL[task.status] ?? task.status}
            </span>
            <div className="row-content">
              <span className="row-primary">{task.name}</span>
              <span className="row-secondary">
                {task.frequency_label ?? `Every ${task.frequency_days} days`}
                {task.last_completed_date && ` · Last: ${task.last_completed_date}`}
                {!task.last_completed_date && ' · Never logged'}
              </span>
            </div>
          </button>
        ))}
      </div>

      <TaskSheet
        task={selected}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
