import BottomNav from '@/components/BottomNav';
import ContactList from '@/components/contacts/ContactList';
import { getContacts } from '@/actions/contacts';

export const dynamic = 'force-dynamic';

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="flex-1 pb-24 overflow-y-auto">
        <ContactList contacts={contacts} />
      </div>
      <BottomNav />
    </div>
  );
}
