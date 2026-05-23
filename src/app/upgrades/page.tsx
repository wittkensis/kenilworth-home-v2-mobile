import BottomNav from '@/components/BottomNav';
import UpgradeList from '@/components/upgrades/UpgradeList';
import { getUpgrades } from '@/actions/upgrades';

export const dynamic = 'force-dynamic';

export default async function UpgradesPage() {
  const upgrades = await getUpgrades();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="flex-1 pb-24 overflow-y-auto">
        <UpgradeList upgrades={upgrades} />
      </div>
      <BottomNav />
    </div>
  );
}
