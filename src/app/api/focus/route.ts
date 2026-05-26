import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

function checkAuth(req: NextRequest): boolean {
  const secret = process.env.FOCUS_API_SECRET;
  if (!secret) return false;
  const auth = req.headers.get('authorization') ?? '';
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();

  const reminders = db.prepare(`
    SELECT id, name, season, season_position, notes
    FROM routine_reminders
    ORDER BY
      CASE season WHEN 'spring' THEN 1 WHEN 'summer' THEN 2 WHEN 'fall' THEN 3 WHEN 'winter' THEN 4 ELSE 5 END,
      CASE season_position WHEN 'beginning' THEN 1 WHEN 'end' THEN 3 ELSE 2 END,
      name
  `).all();

  const recentLog = db.prepare(`
    SELECT ml.id, ml.name, ml.date, ml.contractor, ml.cost, ml.notes, a.name as asset_name
    FROM maintenance_log ml
    LEFT JOIN assets a ON ml.asset_id = a.id
    ORDER BY ml.date DESC, ml.created_at DESC
    LIMIT 5
  `).all();

  return NextResponse.json({ reminders, recentLog });
}
