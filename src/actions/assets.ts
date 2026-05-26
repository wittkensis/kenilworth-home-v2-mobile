'use server';

import { revalidatePath } from 'next/cache';
import getDb from '@/lib/db';

export type AssetRow = {
  id: number;
  name: string;
  brand: string | null;
  model: string | null;
  purchase_date: string | null;
  warranty_expires: string | null;
  manual_url: string | null;
  notes: string | null;
  area_group_id: number | null;
  area_item_id: number | null;
  area_group_name: string | null;
  area_item_name: string | null;
  resolved_area_group_id: number | null;
  warranty_status: 'active' | 'expiring' | 'expired' | null;
};

export type AreaGroup = { id: number; name: string };
export type AreaItem = { id: number; group_id: number; name: string };

export async function getAssets(): Promise<AssetRow[]> {
  const db = getDb();
  return db.prepare(`
    SELECT
      a.id, a.name, a.brand, a.model, a.purchase_date, a.warranty_expires,
      a.manual_url, a.notes, a.area_group_id, a.area_item_id,
      ag.name as area_group_name, ai.name as area_item_name,
      ag.id as resolved_area_group_id,
      CASE
        WHEN a.warranty_expires IS NULL THEN NULL
        WHEN date(a.warranty_expires) < date('now') THEN 'expired'
        WHEN date(a.warranty_expires) < date('now', '+90 days') THEN 'expiring'
        ELSE 'active'
      END as warranty_status
    FROM assets a
    LEFT JOIN area_items ai ON a.area_item_id = ai.id
    LEFT JOIN area_groups ag ON COALESCE(a.area_group_id, ai.group_id) = ag.id
    ORDER BY ag.name NULLS LAST, a.name
  `).all() as AssetRow[];
}

export async function getAreaGroups(): Promise<AreaGroup[]> {
  const db = getDb();
  return db.prepare('SELECT id, name FROM area_groups ORDER BY sort_order, name').all() as AreaGroup[];
}

export async function getAreaItems(): Promise<AreaItem[]> {
  const db = getDb();
  return db.prepare('SELECT id, group_id, name FROM area_items ORDER BY sort_order, name').all() as AreaItem[];
}

export async function saveAsset(data: {
  id?: number;
  name: string;
  brand: string;
  model: string;
  purchase_date: string;
  warranty_expires: string;
  manual_url: string;
  notes: string;
  area_group_id: string;
  area_item_id: string;
}) {
  const db = getDb();
  const groupId = data.area_group_id ? parseInt(data.area_group_id) : null;
  const itemId = data.area_item_id ? parseInt(data.area_item_id) : null;

  if (data.id) {
    db.prepare(`
      UPDATE assets SET name=?, brand=?, model=?, purchase_date=?, warranty_expires=?,
        manual_url=?, notes=?, area_group_id=?, area_item_id=?
      WHERE id=?
    `).run(
      data.name, data.brand || null, data.model || null,
      data.purchase_date || null, data.warranty_expires || null,
      data.manual_url || null, data.notes || null,
      groupId, itemId, data.id
    );
  } else {
    db.prepare(`
      INSERT INTO assets (name, brand, model, purchase_date, warranty_expires, manual_url, notes, area_group_id, area_item_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.name, data.brand || null, data.model || null,
      data.purchase_date || null, data.warranty_expires || null,
      data.manual_url || null, data.notes || null,
      groupId, itemId
    );
  }
  revalidatePath('/assets');
}

export async function deleteAsset(id: number) {
  const db = getDb();
  db.prepare('DELETE FROM assets WHERE id=?').run(id);
  revalidatePath('/assets');
}
