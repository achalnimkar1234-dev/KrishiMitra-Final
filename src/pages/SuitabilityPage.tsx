import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, BarChart3 } from 'lucide-react';
import { Card, SectionTitle, Button, Badge, Loading } from '@/components/ui';
import { StepProgress } from '@/components/StepProgress';
import { ToastProvider, useToast } from '@/components/Toast';
import { useSession } from '@/components/SessionContext';
import { getSuitability } from '@/services/api';
import { cropComparison, crops } from '@/data/mockData';
import type { CropSuitability, CropComparisonRow } from '@/types';
import { useTranslation } from '@/i18n/LanguageContext';

const fitColor: Record<string, string> = {
  good: 'text-brand-600',
  moderate: 'text-mustard-600',
  poor: 'text-red-600',
  low: 'text-brand-600',
  medium: 'text-mustard-600',
  high: 'text-red-600',
};

function SuitabilityInner() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { selectedCrop, selectedPlotId } = useSession();
  const [data, setData] = useState<CropSuitability | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedCrop) {
      navigate('/crop');
      return;
    }
    (async () => {
      setLoading(true);
      const s = await getSuitability(selectedCrop, selectedPlotId || undefined);
      setData(s);
      setLoading(false);
    })();
  }, [selectedCrop, selectedPlotId, navigate]);

  if (loading) return <Loading label={t('suitability.loading')} />;
  if (!data) return <div className="py-12 text-center text-gray-500">{t('suitability.noData')}</div>;

  const crop = crops.find((c) => c.id === selectedCrop);
  const scoreColor = data.score >= 75 ? 'bg-brand-500' : data.score >= 60 ? 'bg-mustard-400' : 'bg-red-500';

  return (
    <div>
      <StepProgress current={4} />
      <SectionTitle title={t('suitability.title')} />

      {/* Selected crop banner */}
      <Card className="mb-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400">{t('suitability.selectedCrop')}</p>
            <h3 className="font-serif text-2xl font-semibold text-gray-800">
              {crop ? (t(`cropNames.${crop.id}`) || crop.name) : 'Soybean'}{' '}
              {crop?.marathiName && (
                <span className="text-base text-brand-600 font-sans font-normal">({crop.marathiName})</span>
              )}
            </h3>
          </div>
          <Badge color={data.score >= 75 ? 'green' : data.score >= 60 ? 'yellow' : 'red'}>{data.status}</Badge>
        </div>

        {/* Score bar */}
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-gray-500">{t('suitability.score')}</span>
            <span className="font-semibold text-gray-700">{data.score}/100</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div className={`h-full rounded-full ${scoreColor}`} style={{ width: `${data.score}%` }} />
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-gray-600">{data.explanation}</p>
      </Card>

      {/* Positive factors and limitations */}
      <div className="mb-5 grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-brand-700">
            <CheckCircle2 className="h-5 w-5" /> {t('suitability.positiveFactors')}
          </h3>
          <ul className="space-y-2">
            {data.positiveFactors.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
                {f}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-mustard-700">
            <AlertTriangle className="h-5 w-5" /> {t('suitability.limitations')}
          </h3>
          <ul className="space-y-2">
            {data.limitations.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-mustard-500" />
                {f}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Crop comparison table */}
      <Card className="mb-5 p-5">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-700">
          <BarChart3 className="h-4 w-4 text-brand-600" /> {t('suitability.cropComparison')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs text-gray-400">
                <th className="pb-2 pr-4 font-medium">{t('suitability.cropCol')}</th>
                <th className="pb-2 pr-4 font-medium">{t('suitability.soilFit')}</th>
                <th className="pb-2 pr-4 font-medium">{t('suitability.waterNeed')}</th>
                <th className="pb-2 pr-4 font-medium">{t('suitability.profitPotential')}</th>
                <th className="pb-2 font-medium">{t('suitability.risk')}</th>
              </tr>
            </thead>
            <tbody>
              {cropComparison.map((row: CropComparisonRow) => (
                <tr key={row.crop} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-gray-700">{row.crop}</td>
                  <td className={`py-2.5 pr-4 capitalize ${fitColor[row.soilFit]}`}>{row.soilFit}</td>
                  <td className={`py-2.5 pr-4 capitalize ${fitColor[row.waterNeed]}`}>{row.waterNeed}</td>
                  <td className={`py-2.5 pr-4 capitalize ${fitColor[row.profitPotential]}`}>{row.profitPotential}</td>
                  <td className={`py-2.5 capitalize ${fitColor[row.risk]}`}>{row.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => navigate('/crop')}>
          <ArrowLeft className="h-4 w-4" /> {t('common.back')}
        </Button>
        <Button variant="outline" onClick={() => navigate('/crop')}>
          {t('suitability.changeCrop')}
        </Button>
        <Button onClick={() => navigate('/market')} className="ml-auto">
          {t('suitability.viewProfitEstimate')} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function SuitabilityPage() {
  return (
    <ToastProvider>
      <SuitabilityInner />
    </ToastProvider>
  );
}
