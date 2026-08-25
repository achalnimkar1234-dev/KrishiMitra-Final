import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, MapPin, FlaskConical, Sprout, LineChart, ShieldCheck, Bookmark, Building2, Sun, CloudSun } from 'lucide-react';
import { useSession } from '@/components/SessionContext';
import { useTranslation } from '@/i18n/LanguageContext';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { farmerId, selectedPlotId } = useSession();
  const { t } = useTranslation();

  // Don't render sidebar if no farmer is logged in
  if (!farmerId) return null;

  const navItems = [
    { path: '/overview', label: t('nav.overview'), icon: LayoutGrid },
    { path: '/plots', label: t('nav.myPlots'), icon: MapPin },
    { path: '/soil', label: t('nav.soilHealth'), icon: FlaskConical },
    { path: '/crop', label: t('nav.cropDecision'), icon: Sprout },
    { path: '/market', label: t('nav.marketPrices'), icon: LineChart },
    { path: '/insurance', label: t('nav.cropInsurance'), icon: ShieldCheck },
    { path: '/saved', label: t('nav.savedAdvice'), icon: Bookmark },
    { path: '/subsidy', label: t('nav.governmentSubsidy'), icon: Building2 },
    { path: '/solar-pump', label: t('nav.solarPump'), icon: Sun },
    { path: '/weather', label: t('nav.weatherForecast'), icon: CloudSun },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleNav = (path: string) => {
    // Guard: soil/crop/market require a selected plot
    const plotRequired = ['/soil', '/crop', '/market'];
    if (plotRequired.includes(path) && !selectedPlotId) {
      navigate('/plots');
      return;
    }
    navigate(path);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 flex-shrink-0 border-r border-gray-200 bg-cream-50 md:flex md:flex-col">
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  active ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-white hover:text-brand-700'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{item.label}</p>
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-gray-200 bg-white px-1 py-1.5 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`flex flex-col items-center gap-0.5 rounded-md px-2 py-1 ${active ? 'text-brand-600' : 'text-gray-400'}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-medium">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
