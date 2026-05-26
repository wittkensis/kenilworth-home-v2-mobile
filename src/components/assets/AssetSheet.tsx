'use client';

import { useState, useTransition } from 'react';
import Sheet from '@/components/Sheet';
import { Field, FormActions } from '@/components/Field';
import { saveAsset, deleteAsset, type AssetRow, type AreaGroup, type AreaItem } from '@/actions/assets';

type Props = {
  asset: AssetRow | null;
  areaGroups: AreaGroup[];
  areaItems: AreaItem[];
  open: boolean;
  onClose: () => void;
};

export default function AssetSheet({ asset, areaGroups, areaItems, open, onClose }: Props) {
  const [selectedGroupId, setSelectedGroupId] = useState(asset?.resolved_area_group_id?.toString() ?? '');
  const [isPending, startTransition] = useTransition();

  const filteredItems = areaItems.filter(
    (i) => !selectedGroupId || i.group_id === parseInt(selectedGroupId)
  );

  function handleClose() {
    setSelectedGroupId('');
    onClose();
  }

  async function handleSave(formData: FormData) {
    startTransition(async () => {
      await saveAsset({
        id: asset?.id,
        name: formData.get('name') as string,
        brand: formData.get('brand') as string,
        model: formData.get('model') as string,
        purchase_date: formData.get('purchase_date') as string,
        warranty_expires: formData.get('warranty_expires') as string,
        manual_url: formData.get('manual_url') as string,
        notes: formData.get('notes') as string,
        area_group_id: formData.get('area_group_id') as string,
        area_item_id: formData.get('area_item_id') as string,
      });
      handleClose();
    });
  }

  async function handleDelete() {
    if (!asset?.id || !confirm('Delete this asset?')) return;
    startTransition(async () => {
      await deleteAsset(asset.id);
      handleClose();
    });
  }

  // Reset area_item when group changes
  function handleGroupChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedGroupId(e.target.value);
  }

  const title = asset ? asset.name : 'New Asset';

  return (
    <Sheet open={open} onClose={handleClose} title={title}>
      <form action={handleSave} className="space-y-4">
        <Field label="Name">
          <input name="name" defaultValue={asset?.name ?? ''} required placeholder="e.g. Furnace" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Brand">
            <input name="brand" defaultValue={asset?.brand ?? ''} placeholder="e.g. Lennox" />
          </Field>
          <Field label="Model">
            <input name="model" defaultValue={asset?.model ?? ''} placeholder="Optional" />
          </Field>
        </div>

        <Field label="Location">
          <select
            name="area_group_id"
            value={selectedGroupId}
            onChange={handleGroupChange}
          >
            <option value="">No area</option>
            {areaGroups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </Field>

        {selectedGroupId && filteredItems.length > 0 && (
          <Field label="Sub-area">
            <select name="area_item_id" defaultValue={asset?.area_item_id?.toString() ?? ''}>
              <option value="">None</option>
              {filteredItems.map((i) => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </Field>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Purchase Date">
            <input name="purchase_date" type="date" defaultValue={asset?.purchase_date ?? ''} />
          </Field>
          <Field label="Warranty Expires">
            <input name="warranty_expires" type="date" defaultValue={asset?.warranty_expires ?? ''} />
          </Field>
        </div>

        <Field label="Manual URL">
          <input name="manual_url" type="url" defaultValue={asset?.manual_url ?? ''} placeholder="https://..." />
        </Field>

        <Field label="Notes">
          <textarea name="notes" defaultValue={asset?.notes ?? ''} placeholder="Optional notes" />
        </Field>

        <FormActions
          onCancel={handleClose}
          onDelete={asset?.id ? handleDelete : undefined}
          pending={isPending}
        />
      </form>
    </Sheet>
  );
}
