'use client';

import { useTransition } from 'react';
import Sheet from '@/components/Sheet';
import { Field, FormActions } from '@/components/Field';
import { saveLogEntry, deleteLogEntry, type MaintenanceLogEntry } from '@/actions/maintenanceLog';
import type { AssetRow } from '@/actions/assets';

type Props = {
  entry: MaintenanceLogEntry | null;
  assets: AssetRow[];
  open: boolean;
  onClose: () => void;
};

export default function LogSheet({ entry, assets, open, onClose }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClose() { onClose(); }

  async function handleSave(formData: FormData) {
    startTransition(async () => {
      await saveLogEntry({
        id: entry?.id,
        name: formData.get('name') as string,
        date: formData.get('date') as string,
        asset_id: formData.get('asset_id') as string,
        contractor: formData.get('contractor') as string,
        cost: formData.get('cost') as string,
        notes: formData.get('notes') as string,
      });
      handleClose();
    });
  }

  async function handleDelete() {
    if (!entry?.id || !confirm('Delete this log entry?')) return;
    startTransition(async () => {
      await deleteLogEntry(entry.id);
      handleClose();
    });
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <Sheet open={open} onClose={handleClose} title={entry ? entry.name : 'Log Maintenance'} noPadding>
      <form action={handleSave} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 overscroll-contain">
          <Field label="What was done">
            <input
              name="name"
              defaultValue={entry?.name ?? ''}
              required
              placeholder="e.g. HVAC tune-up"
            />
          </Field>

          <Field label="Date">
            <input
              name="date"
              type="date"
              defaultValue={entry?.date ?? today}
              required
            />
          </Field>

          <Field label="Asset (optional)">
            <select
              name="asset_id"
              defaultValue={entry?.asset_id?.toString() ?? ''}
            >
              <option value="">No specific asset</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}{a.area_item_name ? ` (${a.area_item_name})` : ''}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Contractor (optional)">
              <input
                name="contractor"
                defaultValue={entry?.contractor ?? ''}
                placeholder="e.g. ABC Heating"
              />
            </Field>
            <Field label="Cost (optional)">
              <input
                name="cost"
                type="number"
                min="0"
                step="0.01"
                defaultValue={entry?.cost ?? ''}
                placeholder="$0.00"
              />
            </Field>
          </div>

          <Field label="Notes (optional)">
            <textarea
              name="notes"
              defaultValue={entry?.notes ?? ''}
              rows={3}
              placeholder="Any details..."
            />
          </Field>
        </div>
        <div className="shrink-0 px-5 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <FormActions
            onCancel={handleClose}
            onDelete={entry?.id ? handleDelete : undefined}
            pending={isPending}
          />
        </div>
      </form>
    </Sheet>
  );
}
