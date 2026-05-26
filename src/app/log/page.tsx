import BottomNav from '@/components/BottomNav';
import LogView from '@/components/maintenance/LogView';
import { getLogEntries } from '@/actions/maintenanceLog';
import { getAssets } from '@/actions/assets';

export const dynamic = 'force-dynamic';

export default async function LogPage() {
  const [logEntries, assets] = await Promise.all([getLogEntries(), getAssets()]);
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="flex-1 pb-24 overflow-y-auto">
        <LogView logEntries={logEntries} assets={assets} />
      </div>
      <BottomNav />
    </div>
  );
}
