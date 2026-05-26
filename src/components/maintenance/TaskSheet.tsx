'use client';

import { useState, useTransition } from 'react';
import Sheet from '@/components/Sheet';
import { Field, FormActions } from '@/components/Field';
import { saveTask, deleteTask, logCompletion, getTaskLogs, type TaskWithStatus } from '@/actions/maintenance';

type Props = {
  task: TaskWithStatus | null;
  open: boolean;
  onClose: () => void;
};

type Log = { id: number; task_id: number; completed_date: string; notes: string | null };

export default function TaskSheet({ task, open, onClose }: Props) {
  const [tab, setTab] = useState<'edit' | 'log'>('edit');
  const [logs, setLogs] = useState<Log[]>([]);
  const [logDate, setLogDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [logNotes, setLogNotes] = useState('');
  const [isPending, startTransition] = useTransition();

  const isNew = !task?.id;
  const title = isNew ? 'New Task' : task!.name;

  function handleClose() {
    setTab('edit');
    setLogs([]);
    setLogDate(new Date().toISOString().split('T')[0]);
    setLogNotes('');
    onClose();
  }

  function handleTabChange(t: 'edit' | 'log') {
    setTab(t);
    if (t === 'log' && task?.id) {
      startTransition(async () => {
        const data = await getTaskLogs(task.id);
        setLogs(data);
      });
    }
  }

  async function handleSave(formData: FormData) {
    startTransition(async () => {
      await saveTask({
        id: task?.id,
        name: formData.get('name') as string,
        frequency_days: parseInt(formData.get('frequency_days') as string),
        frequency_label: formData.get('frequency_label') as string,
        estimated_minutes: formData.get('estimated_minutes') as string,
        notes: formData.get('notes') as string,
      });
      handleClose();
    });
  }

  async function handleDelete() {
    if (!task?.id || !confirm('Delete this task?')) return;
    startTransition(async () => {
      await deleteTask(task.id);
      handleClose();
    });
  }

  async function handleLog() {
    if (!task?.id) return;
    startTransition(async () => {
      await logCompletion(task.id, logDate, logNotes);
      const data = await getTaskLogs(task.id);
      setLogs(data);
      setLogNotes('');
    });
  }

  return (
    <Sheet open={open} onClose={handleClose} title={title} noPadding>
      {!isNew && (
        <div style={{ padding: '12px 20px 0' }}>
          <div className="tab-switcher">
            {(['edit', 'log'] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                className={`tab-switcher-tab${tab === t ? ' tab-switcher-tab--active' : ''}`}
              >
                {t === 'edit' ? 'Edit' : 'Log'}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'edit' ? (
        <form action={handleSave} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="sheet-body">
            <div className="form-fields">
              <Field label="Task Name">
                <input name="name" defaultValue={task?.name ?? ''} required placeholder="e.g. Clean gutters" className="input" />
              </Field>

              <div className="form-fields-row">
                <Field label="Frequency (days)">
                  <input
                    name="frequency_days"
                    type="number"
                    min="1"
                    defaultValue={task?.frequency_days ?? 365}
                    required
                    className="input"
                  />
                </Field>
                <Field label="Label">
                  <input name="frequency_label" defaultValue={task?.frequency_label ?? ''} placeholder="e.g. Annual" className="input" />
                </Field>
              </div>

              <Field label="Est. Minutes">
                <input
                  name="estimated_minutes"
                  type="number"
                  min="0"
                  defaultValue={task?.estimated_minutes ?? ''}
                  placeholder="Optional"
                  className="input"
                />
              </Field>

              <Field label="Notes">
                <textarea name="notes" defaultValue={task?.notes ?? ''} placeholder="Optional notes" className="input textarea" />
              </Field>
            </div>
          </div>
          <div className="sheet-footer">
            <FormActions
              onCancel={handleClose}
              onDelete={task?.id ? handleDelete : undefined}
              pending={isPending}
            />
          </div>
        </form>
      ) : (
        <div className="sheet-body sheet-body--padded">
          {/* Log new completion */}
          <div className="log-card" style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>Log completion</p>
            <Field label="Date">
              <input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Notes (optional)">
              <input
                type="text"
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                placeholder="Any notes..."
                className="input"
              />
            </Field>
            <button
              type="button"
              onClick={handleLog}
              disabled={isPending}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {isPending ? 'Logging...' : 'Mark Complete'}
            </button>
          </div>

          {/* Past logs */}
          {logs.length > 0 && (
            <div>
              <p className="category-label">History</p>
              {logs.map((log) => (
                <div key={log.id} className="row">
                  <span className="row-primary">{log.completed_date}</span>
                  {log.notes && <span className="row-trailing">{log.notes}</span>}
                </div>
              ))}
            </div>
          )}
          {logs.length === 0 && !isPending && (
            <p style={{ fontSize: '0.875rem', textAlign: 'center', padding: '16px 0', color: 'var(--text-dim)' }}>No logs yet</p>
          )}
        </div>
      )}
    </Sheet>
  );
}
