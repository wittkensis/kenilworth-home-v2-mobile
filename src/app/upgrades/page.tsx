import BottomNav from '@/components/BottomNav';
import UpgradeList from '@/components/upgrades/UpgradeList';
import { getUpgrades } from '@/actions/upgrades';

export const dynamic = 'force-dynamic';

export default async function UpgradesPage() {
  const upgrades = await getUpgrades();

  return (
    <div className="page">
      <div className="page-body-nav">
        <UpgradeList upgrades={upgrades} />
      </div>
      <BottomNav />
    </div>
  );
}
