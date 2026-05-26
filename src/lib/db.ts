import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), 'data', 'home.db');

declare global {
  // eslint-disable-next-line no-var
  var _homeDb: Database.Database | undefined;
}

function getDb(): Database.Database {
  if (global._homeDb) return global._homeDb;

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  runMigrations(db);

  global._homeDb = db;
  return db;
}

function runMigrations(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS maintenance_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL REFERENCES maintenance_tasks(id) ON DELETE CASCADE,
      completed_date TEXT NOT NULL DEFAULT (date('now')),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_maintenance_logs_task ON maintenance_logs(task_id);
    CREATE INDEX IF NOT EXISTS idx_maintenance_logs_date ON maintenance_logs(completed_date);

    CREATE TABLE IF NOT EXISTS routine_reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      season TEXT NOT NULL CHECK(season IN ('spring','summer','fall','winter','year-round')),
      season_position TEXT CHECK(season_position IN ('beginning','end')),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_routine_reminders_season ON routine_reminders(season);

    CREATE TABLE IF NOT EXISTS maintenance_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL DEFAULT (date('now')),
      asset_id INTEGER REFERENCES assets(id) ON DELETE SET NULL,
      contractor TEXT,
      cost REAL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_maintenance_log_date ON maintenance_log(date DESC);
    CREATE INDEX IF NOT EXISTS idx_maintenance_log_asset ON maintenance_log(asset_id);
  `);

  // Migration 14: seed routine_reminders and maintenance_log from legacy maintenance_tasks
  const already = db.prepare(
    `SELECT COUNT(*) as n FROM schema_migrations WHERE version = 14`
  ).get() as { n: number };

  if (already.n === 0) {
    db.exec(`
      -- Recurring tasks → routine_reminders (season mapped from frequency_label)
      INSERT INTO routine_reminders (name, season, season_position, notes)
      SELECT
        name,
        CASE
          WHEN frequency_label LIKE '%March%' OR frequency_label LIKE '%April%' THEN 'spring'
          WHEN frequency_label LIKE '%May%'   THEN 'spring'
          WHEN frequency_label LIKE '%June%' OR frequency_label LIKE '%July%' OR frequency_label LIKE '%August%' THEN 'summer'
          WHEN frequency_label LIKE '%September%' OR frequency_label LIKE '%October%' THEN 'fall'
          WHEN frequency_label LIKE '%November%' OR frequency_label LIKE '%December%' THEN 'winter'
          WHEN frequency_label LIKE '%January%' OR frequency_label LIKE '%February%' THEN 'winter'
          ELSE 'year-round'
        END AS season,
        CASE
          WHEN frequency_label LIKE '%March%' OR frequency_label LIKE '%April%'    THEN 'beginning'
          WHEN frequency_label LIKE '%May%'                                        THEN 'end'
          WHEN frequency_label LIKE '%June%'                                       THEN 'beginning'
          WHEN frequency_label LIKE '%September%'                                  THEN 'beginning'
          WHEN frequency_label LIKE '%October%'                                    THEN 'end'
          WHEN frequency_label LIKE '%November%'                                   THEN 'beginning'
          WHEN frequency_label LIKE '%January%'                                    THEN 'beginning'
          WHEN frequency_label LIKE '%February%'                                   THEN 'end'
          ELSE NULL
        END AS season_position,
        notes
      FROM maintenance_tasks
      WHERE frequency_days > 0;

      -- One-time completed tasks → maintenance_log (skip placeholders)
      INSERT INTO maintenance_log (name, date, notes)
      SELECT
        name,
        date(created_at),
        notes
      FROM maintenance_tasks
      WHERE frequency_days = 0
        AND name NOT LIKE '%Placeholder%';

      -- Historical completion logs → maintenance_log
      INSERT INTO maintenance_log (name, date, notes)
      SELECT
        mt.name,
        ml.completed_date,
        ml.notes
      FROM maintenance_logs ml
      JOIN maintenance_tasks mt ON ml.task_id = mt.id;

      INSERT INTO schema_migrations (version) VALUES (14);
    `);
  }
}

export default getDb;
