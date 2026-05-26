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
      <form action={handleSave} className="sheet-form">
        <div className="sheet-body">
          <div className="form-fields">
            <Field label="Reminder">
              <input
                name="name"
                defaultValue={reminder?.name ?? ''}
                required
                placeholder="e.g. Service HVAC filters"
                className="input"
              />
            </Field>

            <Field label="Season">
              <div className="pill-group pill-group--5" style={{ '--pill-cols': 5 } as React.CSSProperties}>
                {SEASONS.map(({ value, label }) => (
                  <label key={value} className="pill">
                    <input
                      type="radio"
                      name="season"
                      value={value}
                      defaultChecked={reminder ? reminder.season === value : value === 'spring'}
                    />
                    <span className="pill-label">{label}</span>
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Timing (optional)">
              <div className="pill-group pill-group--2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {([['', 'Any time'], ['beginning', 'Beginning'], ['end', 'End']] as const).map(([value, label]) => (
                  <label key={value} className="pill">
                    <input
                      type="radio"
                      name="season_position"
                      value={value}
                      defaultChecked={
                        value === '' ? !reminder?.season_position : reminder?.season_position === value
                      }
                    />
                    <span className="pill-label">{label}</span>
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
                className="input textarea"
              />
            </Field>
          </div>
        </div>
        <div className="sheet-footer">
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
