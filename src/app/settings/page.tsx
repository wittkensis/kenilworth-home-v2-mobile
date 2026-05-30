import BottomNav from '@/components/BottomNav';
import SettingsView from '@/components/settings/SettingsView';

export default function SettingsPage() {
  return (
    <div className="page">
      <div className="page-body-nav">
        <SettingsView />
      </div>
      <BottomNav />
    </div>
  );
}
