'use client';

import { useState } from 'react';
import ContactSheet from './ContactSheet';
import { type ContactRow } from '@/actions/contacts';

function Stars({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return (
    <span className="text-xs" style={{ color: 'var(--accent)' }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

export default function ContactList({ contacts }: { contacts: ContactRow[] }) {
  const [selected, setSelected] = useState<ContactRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const favorites = contacts.filter((c) => c.is_favorite);
  const others = contacts.filter((c) => !c.is_favorite);

  function openNew() {
    setSelected(null);
    setSheetOpen(true);
  }

  function openContact(c: ContactRow) {
    setSelected(c);
    setSheetOpen(true);
  }

  const ContactCard = ({ c }: { c: ContactRow }) => (
    <button
      onClick={() => openContact(c)}
      className="w-full text-left rounded-xl p-4 flex items-center gap-3"
      style={{ background: 'var(--surface)' }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
        style={{ background: 'var(--surface-raised)', color: 'var(--accent)' }}
      >
        {c.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
            {c.name}
          </span>
          {c.is_favorite ? <span style={{ color: 'var(--accent)', fontSize: 12 }}>★</span> : null}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {c.trade && <span className="capitalize">{c.trade}</span>}
          {c.trade && c.phone && <span> · </span>}
          {c.phone && <span>{c.phone}</span>}
        </div>
        <Stars rating={c.rating} />
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--border)', flexShrink: 0 }}>
        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Contacts</h1>
        <button
          onClick={openNew}
          className="w-9 h-9 flex items-center justify-center rounded-full text-xl"
          style={{ background: 'var(--accent)', color: '#1A1A1A' }}
        >
          +
        </button>
      </div>

      <div className="px-4 pb-4 space-y-5">
        {favorites.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wide mb-2 px-1" style={{ color: 'var(--text-muted)' }}>Favorites</p>
            <div className="space-y-2">
              {favorites.map((c) => <ContactCard key={c.id} c={c} />)}
            </div>
          </div>
        )}

        {others.length > 0 && (
          <div>
            {favorites.length > 0 && (
              <p className="text-xs uppercase tracking-wide mb-2 px-1" style={{ color: 'var(--text-muted)' }}>All</p>
            )}
            <div className="space-y-2">
              {others.map((c) => <ContactCard key={c.id} c={c} />)}
            </div>
          </div>
        )}

        {contacts.length === 0 && (
          <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
            No contacts yet. Tap + to add one.
          </p>
        )}
      </div>

      <ContactSheet
        contact={selected}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
