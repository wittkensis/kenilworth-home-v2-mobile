'use client';

import { useState } from 'react';
import ContactSheet from './ContactSheet';
import { type ContactRow } from '@/actions/contacts';

function Stars({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return (
    <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>
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
      className="row row--tappable"
    >
      <div className="contact-avatar">
        {c.name.charAt(0).toUpperCase()}
      </div>
      <div className="row-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="row-primary">{c.name}</span>
          {c.is_favorite ? <span style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>★</span> : null}
        </div>
        <span className="row-secondary">
          {c.trade && <span style={{ textTransform: 'capitalize' }}>{c.trade}</span>}
          {c.trade && c.phone && <span> · </span>}
          {c.phone && <span>{c.phone}</span>}
        </span>
        <Stars rating={c.rating} />
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--border)', flexShrink: 0 }}>
        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );

  return (
    <>
      <div className="page-header page-header--compact">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="page-title">Contacts</h1>
          <button
            onClick={openNew}
            className="fab"
            style={{ position: 'static', width: 36, height: 36 }}
            aria-label="Add contact"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ padding: '0 0 16px' }}>
        {favorites.length > 0 && (
          <div>
            <p className="category-label">Favorites</p>
            {favorites.map((c) => <ContactCard key={c.id} c={c} />)}
          </div>
        )}

        {others.length > 0 && (
          <div>
            {favorites.length > 0 && <p className="category-label">All</p>}
            {others.map((c) => <ContactCard key={c.id} c={c} />)}
          </div>
        )}

        {contacts.length === 0 && (
          <div className="empty-state">
            <p className="empty-state-title">No contacts yet</p>
            <p className="empty-state-body">Tap + to add your first trade contact.</p>
          </div>
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
