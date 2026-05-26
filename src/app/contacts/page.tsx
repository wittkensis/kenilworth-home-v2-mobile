import BottomNav from '@/components/BottomNav';
import ContactList from '@/components/contacts/ContactList';
import { getContacts } from '@/actions/contacts';

export const dynamic = 'force-dynamic';

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="page">
      <div className="page-body-nav">
        <ContactList contacts={contacts} />
      </div>
      <BottomNav />
    </div>
  );
}
