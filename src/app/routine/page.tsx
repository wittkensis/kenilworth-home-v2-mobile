import BottomNav from '@/components/BottomNav';
import RoutineView from '@/components/maintenance/RoutineView';
import { getReminders } from '@/actions/routineReminders';

export const dynamic = 'force-dynamic';

export default async function RoutinePage() {
  const reminders = await getReminders();
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="flex-1 pb-24 overflow-y-auto">
        <RoutineView reminders={reminders} />
      </div>
      <BottomNav />
    </div>
  );
}
