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
  `);
}

export default getDb;
