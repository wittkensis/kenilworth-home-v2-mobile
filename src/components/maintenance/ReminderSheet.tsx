'use client';

import { useState, useTransition } from 'react';
import Sheet from '@/components/Sheet';
import { Field, FormActions } from '@/components/Field';
import {
  saveReminder, deleteReminder,
  type RoutineReminder, type Season, type SeasonPosition,
} from '@/actions/routineReminders';

const SEASONS: { value: Season; label: string }[] = [
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'fall', label: 'Fall' },
  { value: 'winter', label: 'Winter' },
  { value: 'year-round', label: 'Year-round' },
];

type Props = {
  reminder: RoutineReminder | null;
  open: boolean;
  onClose: () => void;
};

export default function ReminderSheet({ reminder, open, onClose }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClose() { onClose(); }

  async function handleSave(formData: FormData) {
    startTransition(async () => {
      await saveReminder({
        id: reminder?.id,
        name: formData.get('name') as string,
        season: formData.get('season') as Season,
        season_position: (formData.get('season_position') as SeasonPosition) || null,
        notes: formData.get('notes') as string,
      });
      handleClose();
    });
  }

  async function handleDelete() {
    if (!reminder?.id || !confirm('Delete this reminder?')) return;
    startTransition(async () => {
      await deleteReminder(reminder.id);
      handleClose();
    });
  }

  return (
    <Sheet open={open} onClose={handleClose} title={reminder ? reminder.name : 'New Reminder'} noPadding>
      <form action={handleSave} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 overscroll-contain">
          <Field label="Reminder">
            <input
              name="name"
              defaultValue={reminder?.name ?? ''}
              required
              placeholder="e.g. Service HVAC filters"
            />
          </Field>

          <Field label="Season">
            <div className="grid grid-cols-3 gap-1.5">
              {SEASONS.map(({ value, label }) => (
                <label
                  key={value}
                  className="relative flex items-center justify-center py-2.5 rounded-xl text-sm cursor-pointer"
                  style={{ background: 'var(--surface-raised)' }}
                >
                  <input
                    type="radio"
                    name="season"
                    value={value}
                    defaultChecked={reminder ? reminder.season === value : value === 'spring'}
                    className="sr-only peer"
                  />
                  <span
                    className="peer-checked:font-semibold transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {label}
                  </span>
                  <div
                    className="absolute inset-0 rounded-xl ring-1 ring-transparent peer-checked:ring-[var(--accent)] peer-checked:bg-[var(--accent)]/10 pointer-events-none"
                  />
                </label>
              ))}
            </div>
          </Field>

          <Field label="Timing (optional)">
            <div className="flex gap-2">
              {([['', 'Any time'], ['beginning', 'Beginning'], ['end', 'End']] as const).map(([value, label]) => (
                <label
                  key={value}
                  className="relative flex-1 flex items-center justify-center py-2 rounded-xl text-sm cursor-pointer"
                  style={{ background: 'var(--surface-raised)' }}
                >
                  <input
                    type="radio"
                    name="season_position"
                    value={value}
                    defaultChecked={
                      value === '' ? !reminder?.season_position : reminder?.season_position === value
                    }
                    className="sr-only peer"
                  />
                  <span className="peer-checked:font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </span>
                  <div className="absolute inset-0 rounded-xl ring-1 ring-transparent peer-checked:ring-[var(--accent)] peer-checked:bg-[var(--accent)]/10 pointer-events-none" />
                </label>
              ))}
            </div>
          </Field>

          <Field label="Notes (optional)">
            <textarea
              name="notes"
              defaultValue={reminder?.notes ?? ''}
              rows={3}
              placeholder="Any details..."
            />
          </Field>
        </div>
        <div className="shrink-0 px-5 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <FormActions
            onCancel={handleClose}
            onDelete={reminder?.id ? handleDelete : undefined}
            pending={isPending}
          />
        </div>
      </form>
    </Sheet>
  );
}
