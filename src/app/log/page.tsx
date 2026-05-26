import BottomNav from '@/components/BottomNav';
import LogView from '@/components/maintenance/LogView';
import { getLogEntries } from '@/actions/maintenanceLog';
import { getAssets } from '@/actions/assets';

export const dynamic = 'force-dynamic';

export default async function LogPage() {
  const [logEntries, assets] = await Promise.all([getLogEntries(), getAssets()]);
  return (
    <div className="page">
      <div className="page-body-nav">
        <LogView logEntries={logEntries} assets={assets} />
      </div>
      <BottomNav />
    </div>
  );
}
