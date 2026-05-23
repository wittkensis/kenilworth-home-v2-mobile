'use server';

import { revalidatePath } from 'next/cache';
import getDb from '@/lib/db';

export type UpgradeRow = {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  priority: string | null;
  phase: string;
  estimated_cost_low: number | null;
  estimated_cost_high: number | null;
  actual_cost: number | null;
  target_date: string | null;
  started_date: string | null;
  completed_date: string | null;
  notes: string | null;
};

export async function getUpgrades(): Promise<UpgradeRow[]> {
  const db = getDb();
  return db.prepare(`
    SELECT id, name, description, category, priority, phase,
      estimated_cost_low, estimated_cost_high, actual_cost,
      target_date, started_date, completed_date, notes
    FROM upgrades
    ORDER BY
      CASE phase WHEN 'in_progress' THEN 1 WHEN 'planning' THEN 2 WHEN 'idea' THEN 3 WHEN 'completed' THEN 4 ELSE 5 END,
      CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 ELSE 5 END,
      name
  `).all() as UpgradeRow[];
}

export async function saveUpgrade(data: {
  id?: number;
  name: string;
  description: string;
  category: string;
  priority: string;
  phase: string;
  estimated_cost_low: string;
  estimated_cost_high: string;
  actual_cost: string;
  target_date: string;
  started_date: string;
  completed_date: string;
  notes: string;
}) {
  const db = getDb();
  const toNum = (v: string) => (v ? parseFloat(v) : null);
  const toDate = (v: string) => v || null;

  if (data.id) {
    db.prepare(`
      UPDATE upgrades SET name=?, description=?, category=?, priority=?, phase=?,
        estimated_cost_low=?, estimated_cost_high=?, actual_cost=?,
        target_date=?, started_date=?, completed_date=?, notes=?,
        updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `).run(
      data.name, data.description || null, data.category || null, data.priority || null, data.phase,
      toNum(data.estimated_cost_low), toNum(data.estimated_cost_high), toNum(data.actual_cost),
      toDate(data.target_date), toDate(data.started_date), toDate(data.completed_date),
      data.notes || null, data.id
    );
  } else {
    db.prepare(`
      INSERT INTO upgrades (name, description, category, priority, phase,
        estimated_cost_low, estimated_cost_high, actual_cost,
        target_date, started_date, completed_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.name, data.description || null, data.category || null, data.priority || null, data.phase || 'idea',
      toNum(data.estimated_cost_low), toNum(data.estimated_cost_high), toNum(data.actual_cost),
      toDate(data.target_date), toDate(data.started_date), toDate(data.completed_date),
      data.notes || null
    );
  }
  revalidatePath('/upgrades');
}

export async function deleteUpgrade(id: number) {
  const db = getDb();
  db.prepare('DELETE FROM upgrades WHERE id=?').run(id);
  revalidatePath('/upgrades');
}
