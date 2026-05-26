'use server';

import { revalidatePath } from 'next/cache';
import getDb from '@/lib/db';

export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'year-round';
export type SeasonPosition = 'beginning' | 'end' | null;

export type RoutineReminder = {
  id: number;
  name: string;
  season: Season;
  season_position: SeasonPosition;
  notes: string | null;
  created_at: string;
};

const SEASON_ORDER: Season[] = ['spring', 'summer', 'fall', 'winter', 'year-round'];

export async function getReminders(): Promise<RoutineReminder[]> {
  const db = getDb();
  const rows = db.prepare(`
    SELECT * FROM routine_reminders ORDER BY created_at
  `).all() as RoutineReminder[];

  return rows.sort((a, b) => {
    const si = SEASON_ORDER.indexOf(a.season) - SEASON_ORDER.indexOf(b.season);
    if (si !== 0) return si;
    const posOrder = (p: SeasonPosition) => p === 'beginning' ? 0 : p === 'end' ? 2 : 1;
    return posOrder(a.season_position) - posOrder(b.season_position);
  });
}

export async function saveReminder(data: {
  id?: number;
  name: string;
  season: Season;
  season_position: SeasonPosition;
  notes: string;
}) {
  const db = getDb();
  if (data.id) {
    db.prepare(`
      UPDATE routine_reminders SET name=?, season=?, season_position=?, notes=? WHERE id=?
    `).run(data.name, data.season, data.season_position || null, data.notes || null, data.id);
  } else {
    db.prepare(`
      INSERT INTO routine_reminders (name, season, season_position, notes) VALUES (?, ?, ?, ?)
    `).run(data.name, data.season, data.season_position || null, data.notes || null);
  }
  revalidatePath('/maintenance');
}

export async function deleteReminder(id: number) {
  const db = getDb();
  db.prepare('DELETE FROM routine_reminders WHERE id=?').run(id);
  revalidatePath('/maintenance');
}
