'use client';

import { useTransition } from 'react';
import Sheet from '@/components/Sheet';
import { Field, FormActions } from '@/components/Field';
import { saveUpgrade, deleteUpgrade, type UpgradeRow } from '@/actions/upgrades';
import { PHASES, PRIORITIES, CATEGORIES } from '@/lib/constants';

type Props = {
  upgrade: UpgradeRow | null;
  open: boolean;
  onClose: () => void;
};

function fmt(v: string): string {
  return v.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function UpgradeSheet({ upgrade, open, onClose }: Props) {
  const [isPending, startTransition] = useTransition();

  async function handleSave(formData: FormData) {
    startTransition(async () => {
      await saveUpgrade({
        id: upgrade?.id,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        priority: formData.get('priority') as string,
        phase: formData.get('phase') as string,
        estimated_cost_low: formData.get('estimated_cost_low') as string,
        estimated_cost_high: formData.get('estimated_cost_high') as string,
        actual_cost: formData.get('actual_cost') as string,
        target_date: formData.get('target_date') as string,
        started_date: formData.get('started_date') as string,
        completed_date: formData.get('completed_date') as string,
        notes: formData.get('notes') as string,
      });
      onClose();
    });
  }

  async function handleDelete() {
    if (!upgrade?.id || !confirm('Delete this upgrade?')) return;
    startTransition(async () => {
      await deleteUpgrade(upgrade.id);
      onClose();
    });
  }

  const title = upgrade ? upgrade.name : 'New Upgrade';

  return (
    <Sheet open={open} onClose={onClose} title={title} noPadding>
      <form action={handleSave} className="sheet-form">
        <div className="sheet-body">
          <div className="form-fields">
            <Field label="Name">
              <input name="name" defaultValue={upgrade?.name ?? ''} required placeholder="e.g. Replace water heater" className="input" />
            </Field>

            <Field label="Description">
              <textarea name="description" defaultValue={upgrade?.description ?? ''} placeholder="Optional details" className="input textarea" />
            </Field>

            <div className="form-fields-row">
              <Field label="Phase">
                <select name="phase" defaultValue={upgrade?.phase ?? 'idea'} className="input select">
                  {PHASES.map((p) => (
                    <option key={p} value={p}>{fmt(p)}</option>
                  ))}
                </select>
              </Field>
              <Field label="Priority">
                <select name="priority" defaultValue={upgrade?.priority ?? 'medium'} className="input select">
                  <option value="">None</option>
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{fmt(p)}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Category">
              <select name="category" defaultValue={upgrade?.category ?? ''} className="input select">
                <option value="">None</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{fmt(c)}</option>
                ))}
              </select>
            </Field>

            <div className="form-fields-row-3">
              <Field label="Est. Low ($)">
                <input name="estimated_cost_low" type="number" min="0" step="100"
                  defaultValue={upgrade?.estimated_cost_low ?? ''} placeholder="0" className="input" />
              </Field>
              <Field label="Est. High ($)">
                <input name="estimated_cost_high" type="number" min="0" step="100"
                  defaultValue={upgrade?.estimated_cost_high ?? ''} placeholder="0" className="input" />
              </Field>
              <Field label="Actual ($)">
                <input name="actual_cost" type="number" min="0" step="100"
                  defaultValue={upgrade?.actual_cost ?? ''} placeholder="0" className="input" />
              </Field>
            </div>

            <div className="form-fields-row">
              <Field label="Target Date">
                <input name="target_date" type="date" defaultValue={upgrade?.target_date ?? ''} className="input" />
              </Field>
              <Field label="Started">
                <input name="started_date" type="date" defaultValue={upgrade?.started_date ?? ''} className="input" />
              </Field>
            </div>

            <Field label="Completed">
              <input name="completed_date" type="date" defaultValue={upgrade?.completed_date ?? ''} className="input" />
            </Field>

            <Field label="Notes">
              <textarea name="notes" defaultValue={upgrade?.notes ?? ''} placeholder="Optional notes" className="input textarea" />
            </Field>
          </div>
        </div>
        <div className="sheet-footer">
          <FormActions
            onCancel={onClose}
            onDelete={upgrade?.id ? handleDelete : undefined}
            pending={isPending}
          />
        </div>
      </form>
    </Sheet>
  );
}
