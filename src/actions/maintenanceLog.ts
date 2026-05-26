'use server';

import { revalidatePath } from 'next/cache';
import getDb from '@/lib/db';

export type MaintenanceLogEntry = {
  id: number;
  name: string;
  date: string;
  asset_id: number | null;
  asset_name: string | null;
  contractor: string | null;
  cost: number | null;
  notes: string | null;
  created_at: string;
};

export async function getLogEntries(limit = 50): Promise<MaintenanceLogEntry[]> {
  const db = getDb();
  return db.prepare(`
    SELECT ml.*, a.name as asset_name
    FROM maintenance_log ml
    LEFT JOIN assets a ON ml.asset_id = a.id
    ORDER BY ml.date DESC, ml.created_at DESC
    LIMIT ?
  `).all(limit) as MaintenanceLogEntry[];
}

export async function saveLogEntry(data: {
  id?: number;
  name: string;
  date: string;
  asset_id: string;
  contractor: string;
  cost: string;
  notes: string;
}) {
  const db = getDb();
  const assetId = data.asset_id ? parseInt(data.asset_id) : null;
  const cost = data.cost ? parseFloat(data.cost) : null;

  if (data.id) {
    db.prepare(`
      UPDATE maintenance_log SET name=?, date=?, asset_id=?, contractor=?, cost=?, notes=? WHERE id=?
    `).run(
      data.name, data.date, assetId,
      data.contractor || null, cost, data.notes || null,
      data.id
    );
  } else {
    db.prepare(`
      INSERT INTO maintenance_log (name, date, asset_id, contractor, cost, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      data.name, data.date, assetId,
      data.contractor || null, cost, data.notes || null
    );
  }
  revalidatePath('/maintenance');
}

export async function deleteLogEntry(id: number) {
  const db = getDb();
  db.prepare('DELETE FROM maintenance_log WHERE id=?').run(id);
  revalidatePath('/maintenance');
}
