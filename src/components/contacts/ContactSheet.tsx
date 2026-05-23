'use client';

import { useTransition } from 'react';
import Sheet from '@/components/Sheet';
import { Field, FormActions } from '@/components/Field';
import { saveContact, deleteContact, type ContactRow } from '@/actions/contacts';

type Props = {
  contact: ContactRow | null;
  open: boolean;
  onClose: () => void;
};

const TRADES = ['electrician', 'plumber', 'HVAC', 'general', 'landscaping', 'painting', 'roofing', 'pest control', 'appliance', 'cleaning', 'other'];
const RATINGS = [1, 2, 3, 4, 5];

export default function ContactSheet({ contact, open, onClose }: Props) {
  const [isPending, startTransition] = useTransition();

  async function handleSave(formData: FormData) {
    startTransition(async () => {
      await saveContact({
        id: contact?.id,
        name: formData.get('name') as string,
        company: formData.get('company') as string,
        trade: formData.get('trade') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        website: formData.get('website') as string,
        rating: formData.get('rating') as string,
        last_used_date: formData.get('last_used_date') as string,
        notes: formData.get('notes') as string,
        is_favorite: formData.get('is_favorite') as string,
        tags: formData.get('tags') as string,
      });
      onClose();
    });
  }

  async function handleDelete() {
    if (!contact?.id || !confirm('Delete this contact?')) return;
    startTransition(async () => {
      await deleteContact(contact.id);
      onClose();
    });
  }

  const title = contact ? contact.name : 'New Contact';

  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <form action={handleSave} className="space-y-4">
        <Field label="Name">
          <input name="name" defaultValue={contact?.name ?? ''} required placeholder="Full name" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Company">
            <input name="company" defaultValue={contact?.company ?? ''} placeholder="Optional" />
          </Field>
          <Field label="Trade">
            <select name="trade" defaultValue={contact?.trade ?? ''}>
              <option value="">Select trade</option>
              {TRADES.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone">
            <input name="phone" type="tel" defaultValue={contact?.phone ?? ''} placeholder="(555) 555-5555" />
          </Field>
          <Field label="Email">
            <input name="email" type="email" defaultValue={contact?.email ?? ''} placeholder="Optional" />
          </Field>
        </div>

        <Field label="Website">
          <input name="website" type="url" defaultValue={contact?.website ?? ''} placeholder="https://..." />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Rating">
            <select name="rating" defaultValue={contact?.rating?.toString() ?? ''}>
              <option value="">No rating</option>
              {RATINGS.map((r) => (
                <option key={r} value={r}>{'★'.repeat(r)} {r}/5</option>
              ))}
            </select>
          </Field>
          <Field label="Last Used">
            <input name="last_used_date" type="date" defaultValue={contact?.last_used_date ?? ''} />
          </Field>
        </div>

        <Field label="Favorite">
          <select name="is_favorite" defaultValue={contact?.is_favorite ? '1' : '0'}>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </Field>

        <Field label="Tags (comma separated)">
          <input name="tags" defaultValue={contact?.tags ?? ''} placeholder="e.g. trusted, expensive" />
        </Field>

        <Field label="Notes">
          <textarea name="notes" defaultValue={contact?.notes ?? ''} placeholder="Optional notes" />
        </Field>

        <FormActions
          onCancel={onClose}
          onDelete={contact?.id ? handleDelete : undefined}
          pending={isPending}
        />
      </form>
    </Sheet>
  );
}
