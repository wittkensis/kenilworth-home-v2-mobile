'use server';

import { revalidatePath } from 'next/cache';
import getDb from '@/lib/db';

export type TaskWithStatus = {
  id: number;
  name: string;
  frequency_days: number;
  frequency_label: string | null;
  estimated_minutes: number | null;
  notes: string | null;
  last_completed_date: string | null;
  status: 'overdue' | 'due-soon' | 'upcoming';
  days_since: number | null;
  days_until_due: number | null;
};

export async function getTasks(): Promise<TaskWithStatus[]> {
  const db = getDb();
  return db.prepare(`
    SELECT
      mt.id, mt.name, mt.frequency_days, mt.frequency_label,
      mt.estimated_minutes, mt.notes,
      MAX(ml.completed_date) as last_completed_date,
      CASE
        WHEN MAX(ml.completed_date) IS NULL THEN 'overdue'
        WHEN CAST(julianday('now') - julianday(MAX(ml.completed_date)) AS INTEGER) >= mt.frequency_days THEN 'overdue'
        WHEN CAST(julianday('now') - julianday(MAX(ml.completed_date)) AS INTEGER) >= mt.frequency_days * 0.8 THEN 'due-soon'
        ELSE 'upcoming'
      END as status,
      CASE
        WHEN MAX(ml.completed_date) IS NULL THEN NULL
        ELSE CAST(julianday('now') - julianday(MAX(ml.completed_date)) AS INTEGER)
      END as days_since,
      CASE
        WHEN MAX(ml.completed_date) IS NULL THEN NULL
        ELSE mt.frequency_days - CAST(julianday('now') - julianday(MAX(ml.completed_date)) AS INTEGER)
      END as days_until_due
    FROM maintenance_tasks mt
    LEFT JOIN maintenance_logs ml ON mt.id = ml.task_id
    GROUP BY mt.id
    ORDER BY
      CASE status WHEN 'overdue' THEN 1 WHEN 'due-soon' THEN 2 ELSE 3 END,
      days_until_due ASC NULLS FIRST,
      mt.name
  `).all() as TaskWithStatus[];
}

export async function logCompletion(taskId: number, date: string, notes: string) {
  const db = getDb();
  db.prepare(`
    INSERT INTO maintenance_logs (task_id, completed_date, notes)
    VALUES (?, ?, ?)
  `).run(taskId, date, notes || null);
  revalidatePath('/maintenance');
}

export async function saveTask(data: {
  id?: number;
  name: string;
  frequency_days: number;
  frequency_label: string;
  estimated_minutes: string;
  notes: string;
}) {
  const db = getDb();
  const mins = data.estimated_minutes ? parseInt(data.estimated_minutes) : null;

  if (data.id) {
    db.prepare(`
      UPDATE maintenance_tasks SET name=?, frequency_days=?, frequency_label=?, estimated_minutes=?, notes=?
      WHERE id=?
    `).run(data.name, data.frequency_days, data.frequency_label || null, mins, data.notes || null, data.id);
  } else {
    db.prepare(`
      INSERT INTO maintenance_tasks (name, frequency_days, frequency_label, estimated_minutes, notes)
      VALUES (?, ?, ?, ?, ?)
    `).run(data.name, data.frequency_days, data.frequency_label || null, mins, data.notes || null);
  }
  revalidatePath('/maintenance');
}

export async function deleteTask(id: number) {
  const db = getDb();
  db.prepare('DELETE FROM maintenance_tasks WHERE id=?').run(id);
  revalidatePath('/maintenance');
}

export async function getTaskLogs(taskId: number) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM maintenance_logs WHERE task_id=? ORDER BY completed_date DESC LIMIT 10
  `).all(taskId) as Array<{ id: number; task_id: number; completed_date: string; notes: string | null }>;
}
