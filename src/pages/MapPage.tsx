import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, SectionTitle, Button, Loading, TrendIcon } from '@/components/ui';
import { useSession } from '@/components/SessionContext';
import { getMandis } from '@/services/api';
import { plots } from '@/data/mockData';
import type { Mandi } from '@/types';
import { useTranslation } from '@/i18n/LanguageContext';

export function MapPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedPlotId } = useSession();
  const [mandis, setMandis] = useState<Mandi[]>([]);
  const [loading, setLoading] = useState(true);

  const plot = plots.find((p) => p.id === selectedPlotId);

  useEffect(() => {
    if (!selectedPlotId) {
      navigate('/plots');
      return;
    }
    (async () => {
      setLoading(true);
      const m = await getMandis(selectedPlotId);
      setMandis(m);
      setLoading(false);
    })();
  }, [selectedPlotId, navigate]);

  if (loading) return <Loading label={t('map.loading')} />;

  const formatRupee = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <div>
      <SectionTitle title={t('map.title')} subtitle={t('map.subtitle')} />

      {/* Static map placeholder with markers */}
      <Card className="mb-5 overflow-hidden">
        <div className="relative h-72 bg-gradient-to-br from-brand-50 via-cream-100 to-soil-50 md:h-80">
          {/* Grid lines for map feel */}
          <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2c6244" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Roads */}
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#c2965e" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
            <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#c2965e" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />
          </svg>

          {/* Plot marker (center) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg ring-4 ring-brand-600/20">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="mt-1 rounded bg-white px-2 py-0.5 text-xs font-medium text-brand-700 shadow">{plot?.id || t('map.yourPlot')}</span>
            </div>
          </div>

          {/* Mandi markers */}
          {mandis.map((m, i) => {
            const positions = [
              { left: '20%', top: '30%' },
              { left: '75%', top: '65%' },
              { left: '70%', top: '20%' },
            ];
            const pos = positions[i] || positions[0];
            return (
              <div key={m.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={pos}>
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-soil-500 text-white shadow-md ring-4 ring-soil-500/20">
                    <Navigation className="h-4 w-4" />
                  </div>
                  <span className="mt-1 rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-600 shadow">{m.distanceKm} km</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Mandi cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {mandis.map((m) => (
          <Card key={m.id} className="p-5">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{m.name}</h3>
                <p className="text-xs text-gray-400">{m.distanceKm} km {t('map.fromPlot')}</p>
              </div>
              <TrendIcon trend={m.trend} />
            </div>
            <div className="space-y-2 border-t border-gray-100 pt-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{t('map.modalPrice')}</span>
                <span className="font-semibold text-gray-700">{formatRupee(m.modalPrice)}/q</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('map.transportCost')}</span>
                <span className="font-medium text-gray-700">{formatRupee(m.transportCost)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-50 pt-2">
                <span className="text-gray-500">{t('map.netReturn')}</span>
                <span className="font-bold text-brand-700">{formatRupee(m.modalPrice * profitMultiplier(m.distanceKm) - m.transportCost)}/q</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <Button variant="ghost" onClick={() => navigate('/market')}>
          <ArrowLeft className="h-4 w-4" /> {t('map.backToMarket')}
        </Button>
        <Button onClick={() => navigate('/advisory')} className="ml-auto">
          {t('map.continueToAdvisory')} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function profitMultiplier(km: number): number {
  return 24 - km * 0.05;
}
