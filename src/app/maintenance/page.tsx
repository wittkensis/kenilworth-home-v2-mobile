import BottomNav from '@/components/BottomNav';
import MaintenanceView from '@/components/maintenance/MaintenanceView';
import { getReminders } from '@/actions/routineReminders';
import { getLogEntries } from '@/actions/maintenanceLog';
import { getAssets } from '@/actions/assets';

export const dynamic = 'force-dynamic';

export default async function MaintenancePage() {
  const [reminders, logEntries, assets] = await Promise.all([
    getReminders(),
    getLogEntries(),
    getAssets(),
  ]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="flex-1 pb-24 overflow-y-auto">
        <MaintenanceView reminders={reminders} logEntries={logEntries} assets={assets} />
      </div>
      <BottomNav />
    </div>
  );
}
