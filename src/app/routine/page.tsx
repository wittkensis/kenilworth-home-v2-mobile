import BottomNav from '@/components/BottomNav';
import RoutineView from '@/components/maintenance/RoutineView';
import { getReminders } from '@/actions/routineReminders';

export const dynamic = 'force-dynamic';

export default async function RoutinePage() {
  const reminders = await getReminders();
  return (
    <div className="page">
      <div className="page-body-nav">
        <RoutineView reminders={reminders} />
      </div>
      <BottomNav />
    </div>
  );
}
