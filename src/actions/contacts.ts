'use server';

import { revalidatePath } from 'next/cache';
import getDb from '@/lib/db';

export type ContactRow = {
  id: number;
  name: string;
  company: string | null;
  trade: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  rating: number | null;
  last_used_date: string | null;
  notes: string | null;
  is_favorite: number;
  tags: string;
};

export async function getContacts(): Promise<ContactRow[]> {
  const db = getDb();
  return db.prepare(`
    SELECT
      c.*,
      GROUP_CONCAT(ct.tag, ',') as tags
    FROM contacts c
    LEFT JOIN contact_tags ct ON c.id = ct.contact_id
    GROUP BY c.id
    ORDER BY c.is_favorite DESC, c.name
  `).all() as ContactRow[];
}

export async function saveContact(data: {
  id?: number;
  name: string;
  company: string;
  trade: string;
  phone: string;
  email: string;
  website: string;
  rating: string;
  last_used_date: string;
  notes: string;
  is_favorite: string;
  tags: string;
}) {
  const db = getDb();
  const rating = data.rating ? parseInt(data.rating) : null;
  const isFav = data.is_favorite === '1' ? 1 : 0;
  const tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);

  if (data.id) {
    db.prepare(`
      UPDATE contacts SET name=?, company=?, trade=?, phone=?, email=?, website=?,
        rating=?, last_used_date=?, notes=?, is_favorite=?
      WHERE id=?
    `).run(
      data.name, data.company || null, data.trade || null, data.phone || null,
      data.email || null, data.website || null, rating,
      data.last_used_date || null, data.notes || null, isFav, data.id
    );
    db.prepare('DELETE FROM contact_tags WHERE contact_id=?').run(data.id);
    const insertTag = db.prepare('INSERT INTO contact_tags (contact_id, tag) VALUES (?, ?)');
    for (const tag of tags) insertTag.run(data.id, tag);
  } else {
    const result = db.prepare(`
      INSERT INTO contacts (name, company, trade, phone, email, website, rating, last_used_date, notes, is_favorite)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.name, data.company || null, data.trade || null, data.phone || null,
      data.email || null, data.website || null, rating,
      data.last_used_date || null, data.notes || null, isFav
    );
    const newId = result.lastInsertRowid as number;
    const insertTag = db.prepare('INSERT INTO contact_tags (contact_id, tag) VALUES (?, ?)');
    for (const tag of tags) insertTag.run(newId, tag);
  }
  revalidatePath('/contacts');
}

export async function toggleFavorite(id: number, current: number) {
  const db = getDb();
  db.prepare('UPDATE contacts SET is_favorite=? WHERE id=?').run(current ? 0 : 1, id);
  revalidatePath('/contacts');
}

export async function deleteContact(id: number) {
  const db = getDb();
  db.prepare('DELETE FROM contacts WHERE id=?').run(id);
  revalidatePath('/contacts');
}
