import { useNavigate } from 'react-router-dom';
import { MapPin, FlaskConical, Sprout, LineChart, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, SectionTitle, Button } from '@/components/ui';
import { useSession } from '@/components/SessionContext';
import { farmers, plots } from '@/data/mockData';
import { useTranslation } from '@/i18n/LanguageContext';

export function OverviewPage() {
  const navigate = useNavigate();
  const { farmerId, selectedPlotId, setSelectedPlotId } = useSession();
  const { t } = useTranslation();

  const farmer = farmers.find((f) => f.id === farmerId);
  const farmerPlots = plots.filter((p) => p.farmerId === farmerId);
  const selectedPlot = farmerPlots.find((p) => p.id === selectedPlotId);

  const quickActions = [
    { icon: FlaskConical, label: t('overview.checkSoilHealth'), path: '/soil', desc: t('overview.viewSoilDesc') },
    { icon: Sprout, label: t('overview.chooseCrop'), path: '/crop', desc: t('overview.chooseCropDesc') },
    { icon: LineChart, label: t('nav.marketPrices'), path: '/market', desc: t('overview.marketPricesDesc') },
    { icon: ShieldCheck, label: t('overview.cropInsurance'), path: '/insurance', desc: t('overview.cropInsuranceDesc') },
  ];

  return (
    <div className="relative min-h-[calc(100vh-120px)] pb-8">
      {/* Primary Dashboard Content (elevated above background) */}
      <div className="relative z-10">
        <SectionTitle title={t('overview.title')} subtitle={t('overview.subtitle')} />

        {/* Farmer summary */}
        {farmer && (
          <Card className="mb-5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-800">{farmer.name}</h3>
                <p className="text-sm text-gray-500">{farmer.village}, {farmer.taluka}, {farmer.district}</p>
                <p className="mt-1 text-xs text-gray-400">{t('overview.farmerId')}: {farmer.id}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-2xl font-semibold text-brand-700">{farmerPlots.length}</p>
                  <p className="text-xs text-gray-500">{t('overview.plotsRegistered')}</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-brand-700">{farmerPlots.reduce((s, p) => s + p.areaHectares, 0).toFixed(1)}</p>
                  <p className="text-xs text-gray-500">{t('overview.totalHectares')}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Selected plot */}
        {selectedPlot ? (
          <Card className="mb-5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-brand-600" />
              <h3 className="font-semibold text-gray-800">{t('overview.currentPlot')}: {selectedPlot.id}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              <div>
                <p className="text-xs text-gray-400">{t('overview.area')}</p>
                <p className="font-medium text-gray-700">{selectedPlot.areaHectares} ha</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">{t('overview.irrigation')}</p>
                <p className="font-medium text-gray-700">
                  {selectedPlot.hasIrrigation ? t('overview.yes') : t('overview.no')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">{t('overview.waterReserve')}</p>
                <p className="font-medium text-brand-700">
                  {selectedPlot.waterReserve === 'high'
                    ? t('overview.high')
                    : selectedPlot.waterReserve === 'medium'
                      ? t('overview.medium')
                      : t('overview.low')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">{t('overview.soilStatus')}</p>
                <p className="font-medium text-gray-700">{selectedPlot.soilStatus}</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="mb-5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{t('overview.noPlotSelected')}</h3>
                <p className="text-sm text-gray-500">{t('overview.selectPlotMessage')}</p>
              </div>
              <Button onClick={() => navigate('/plots')}>{t('overview.selectPlot')}</Button>
            </div>
          </Card>
        )}

        {/* Quick actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Card key={a.path} className="cursor-pointer p-5 transition-shadow hover:shadow-cardhover">
                <button
                  onClick={() => {
                    if (!selectedPlotId && a.path !== '/soil' && a.path !== '/insurance') {
                      navigate('/plots');
                      return;
                    }
                    if (!selectedPlotId) {
                      const p = farmerPlots[0];
                      if (p) setSelectedPlotId(p.id);
                    }
                    navigate(a.path);
                  }}
                  className="text-left w-full"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{a.label}</h3>
                  <p className="mt-1.5 text-xs text-gray-500">{a.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600">
                    {t('overview.open')} <ArrowRight className="h-3 w-3" />
                  </span>
                </button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Seamlessly blended continuous agricultural background visual across bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 left-0 right-0 z-0 hidden select-none sm:flex items-end justify-between overflow-hidden opacity-30 md:opacity-45 lg:opacity-60 xl:opacity-75 transition-opacity duration-300"
        style={{
          height: 'min(360px, 38vh)',
        }}
      >
        {/* Left: Farmer with mobile phone */}
        <div
          className="relative h-full flex-shrink-0"
          style={{
            width: 'min(440px, 45vw)',
          }}
        >
          <img
            src="/farmer-phone.jpg"
            alt=""
            className="h-full w-full object-cover object-[25%_25%]"
            style={{
              maskImage:
                'radial-gradient(ellipse 95% 95% at 15% 92%, black 25%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.2) 75%, transparent 95%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 95% 95% at 15% 92%, black 25%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.2) 75%, transparent 95%)',
            }}
          />
          {/* Subtle multi-edge feathering matching cream-100 */}
          <div className="absolute inset-0 bg-gradient-to-t from-cream-100/10 via-transparent to-cream-100" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-cream-100/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream-100/80" />
        </div>

        {/* Right: Lush green wheat field */}
        <div
          className="relative h-full flex-1 -ml-16 md:-ml-28"
          style={{
            maxWidth: '680px',
          }}
        >
          <img
            src="/wheat-field.jpg"
            alt=""
            className="h-full w-full object-cover object-[50%_65%]"
            style={{
              maskImage:
                'radial-gradient(ellipse 90% 90% at 75% 88%, black 20%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.15) 70%, transparent 95%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 90% 90% at 75% 88%, black 20%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.15) 70%, transparent 95%)',
            }}
          />
          {/* Multi-directional soft feathering to create seamless transition into background */}
          <div className="absolute inset-0 bg-gradient-to-t from-cream-100/10 via-transparent to-cream-100" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-cream-100" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-cream-100/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream-100/80" />
        </div>
      </div>
    </div>
  );
}


