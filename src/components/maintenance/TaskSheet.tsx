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
        <div className="flex mx-5 mt-4 rounded-lg overflow-hidden" style={{ background: 'var(--surface-raised)' }}>
          {(['edit', 'log'] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className="flex-1 py-2.5 text-sm font-medium capitalize transition-colors"
              style={{
                background: tab === t ? 'var(--accent)' : 'transparent',
                color: tab === t ? '#1A1A1A' : 'var(--text-muted)',
              }}
            >
              {t === 'edit' ? 'Edit' : 'Log'}
            </button>
          ))}
        </div>
      )}

      {tab === 'edit' ? (
        <form action={handleSave} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 overscroll-contain">
            <Field label="Task Name">
              <input name="name" defaultValue={task?.name ?? ''} required placeholder="e.g. Clean gutters" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Frequency (days)">
                <input
                  name="frequency_days"
                  type="number"
                  min="1"
                  defaultValue={task?.frequency_days ?? 365}
                  required
                />
              </Field>
              <Field label="Label">
                <input name="frequency_label" defaultValue={task?.frequency_label ?? ''} placeholder="e.g. Annual" />
              </Field>
            </div>

            <Field label="Est. Minutes">
              <input
                name="estimated_minutes"
                type="number"
                min="0"
                defaultValue={task?.estimated_minutes ?? ''}
                placeholder="Optional"
              />
            </Field>

            <Field label="Notes">
              <textarea name="notes" defaultValue={task?.notes ?? ''} placeholder="Optional notes" />
            </Field>
          </div>
          <div className="shrink-0 px-5 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <FormActions
              onCancel={handleClose}
              onDelete={task?.id ? handleDelete : undefined}
              pending={isPending}
            />
          </div>
        </form>
      ) : (
        <div className="overflow-y-auto px-5 py-4 space-y-4 overscroll-contain">
          {/* Log new completion */}
          <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--surface-raised)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Log completion</p>
            <Field label="Date">
              <input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
              />
            </Field>
            <Field label="Notes (optional)">
              <input
                type="text"
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                placeholder="Any notes..."
              />
            </Field>
            <button
              onClick={handleLog}
              disabled={isPending}
              className="w-full py-3 rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform disabled:opacity-50"
              style={{ background: 'var(--success)', color: '#E5E0D8' }}
            >
              {isPending ? 'Logging...' : 'Mark Complete'}
            </button>
          </div>

          {/* Past logs */}
          {logs.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>History</p>
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-sm" style={{ color: 'var(--text)' }}>{log.completed_date}</span>
                    {log.notes && <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{log.notes}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {logs.length === 0 && !isPending && (
            <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No logs yet</p>
          )}
        </div>
      )}
    </Sheet>
  );
}
