import BottomNav from '@/components/BottomNav';
import AssetList from '@/components/assets/AssetList';
import { getAssets, getAreaGroups, getAreaItems } from '@/actions/assets';

export const dynamic = 'force-dynamic';

export default async function AssetsPage() {
  const [assets, areaGroups, areaItems] = await Promise.all([
    getAssets(), getAreaGroups(), getAreaItems(),
  ]);

  return (
    <div className="page">
      <div className="page-body-nav">
        <AssetList assets={assets} areaGroups={areaGroups} areaItems={areaItems} />
      </div>
      <BottomNav />
    </div>
  );
}
