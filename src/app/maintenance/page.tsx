import BottomNav from '@/components/BottomNav';
import MaintenanceList from '@/components/maintenance/MaintenanceList';
import { getTasks } from '@/actions/maintenance';

export const dynamic = 'force-dynamic';

export default async function MaintenancePage() {
  const tasks = await getTasks();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="flex-1 pb-24 overflow-y-auto">
        <MaintenanceList tasks={tasks} />
      </div>
      <BottomNav />
    </div>
  );
}
