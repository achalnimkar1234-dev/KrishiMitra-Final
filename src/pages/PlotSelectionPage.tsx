import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Droplets, Calendar, Star, ArrowRight, FlaskConical, Waves } from 'lucide-react';
import { Card, SectionTitle, Button, Badge, Loading } from '@/components/ui';
import { StepProgress } from '@/components/StepProgress';
import { useSession } from '@/components/SessionContext';
import { getPlots, getSoilReport } from '@/services/api';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Plot, SoilReport } from '@/types';

export function PlotSelectionPage() {
  const navigate = useNavigate();
  const { farmerId, selectedPlotId, setSelectedPlotId } = useSession();
  const { t } = useTranslation();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [soilMap, setSoilMap] = useState<Record<string, SoilReport | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!farmerId) {
      navigate('/login');
      return;
    }
    (async () => {
      setLoading(true);
      const p = await getPlots(farmerId);
      setPlots(p);
      const soilResults = await Promise.all(p.map((plot) => getSoilReport(plot.id)));
      const map: Record<string, SoilReport | null> = {};
      p.forEach((plot, i) => { map[plot.id] = soilResults[i]; });
      setSoilMap(map);
      setLoading(false);
    })();
  }, [farmerId, navigate]);

  const handleUsePlot = (plotId: string) => {
    setSelectedPlotId(plotId);
    navigate('/soil');
  };

  if (loading) return <Loading label={t('plots.loading')} />;

  return (
    <div>
      <StepProgress current={1} />
      <SectionTitle
        title={t('plots.title')}
        subtitle={t('plots.subtitle')}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {plots.map((plot) => {
          const isSelected = selectedPlotId === plot.id;
          const soil = soilMap[plot.id];
          return (
            <Card key={plot.id} className={`p-5 ${isSelected ? 'ring-2 ring-brand-500' : ''} ${plot.recommended ? 'border-brand-300' : ''}`}>
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-600" />
                    <h3 className="font-semibold text-gray-800">{plot.id}</h3>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">{plot.village}</p>
                </div>
                <div className="flex gap-1.5">
                  {plot.recommended && <Badge color="green"><Star className="mr-1 h-3 w-3" />{t('plots.recommended')}</Badge>}
                  {isSelected && <Badge color="blue">{t('plots.selected')}</Badge>}
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-500"><MapPin className="h-4 w-4 text-gray-400" />{t('overview.area')}</span>
                  <span className="font-medium text-gray-700">{plot.areaHectares} {t('plots.hectares')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-500"><Droplets className="h-4 w-4 text-gray-400" />{t('overview.irrigation')}</span>
                  <span className="font-medium text-gray-700">
                    {plot.hasIrrigation ? t('overview.yes') : t('overview.no')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-500"><Waves className="h-4 w-4 text-gray-400" />{t('overview.waterReserve')}</span>
                  <span className="font-medium text-brand-700">
                    {plot.waterReserve === 'high'
                      ? t('overview.high')
                      : plot.waterReserve === 'medium'
                        ? t('overview.medium')
                        : t('overview.low')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-500"><Calendar className="h-4 w-4 text-gray-400" />{t('plots.lastSoilTest')}</span>
                  <span className="font-medium text-gray-700">{plot.lastSoilTest}</span>
                </div>
                <div className="flex items-start justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-500"><FlaskConical className="h-4 w-4 text-gray-400" />{t('overview.soilStatus')}</span>
                  <span className={`text-right font-medium ${plot.soilStatus.includes('Needs') ? 'text-mustard-700' : 'text-brand-700'}`}>{plot.soilStatus}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setSelectedPlotId(plot.id); navigate('/soil'); }}>
                  {t('plots.viewSoil')}
                </Button>
                <Button size="sm" onClick={() => handleUsePlot(plot.id)} className="flex-1">
                  {t('plots.useThisPlot')} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
              {soil && <p className="mt-2 text-[10px] text-gray-400">{t('plots.soilSummary')}: {soil.summary}</p>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
