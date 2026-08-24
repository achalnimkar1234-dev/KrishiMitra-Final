import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Droplets, Clock, ArrowRight, ArrowLeft, Lightbulb, Waves, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
import { Card, SectionTitle, Button, Badge, Loading } from '@/components/ui';
import { StepProgress } from '@/components/StepProgress';
import { ToastProvider, useToast } from '@/components/Toast';
import { useSession } from '@/components/SessionContext';
import { getCrops } from '@/services/api';
import { plots as allPlots } from '@/data/mockData';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Crop, CropId } from '@/types';

const cropIcons: Record<string, typeof Sprout> = {
  Sprout,
  CircleDot: Sprout,
  Apple: Sprout,
  Cloud: Sprout,
};

function CropSelectionInner() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { selectedPlotId, selectedCrop, setSelectedCrop } = useSession();
  const { t } = useTranslation();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState('Pre-sowing');
  const [budget, setBudget] = useState<'low' | 'medium' | 'high'>('medium');

  const plot = allPlots.find((p) => p.id === selectedPlotId);

  useEffect(() => {
    if (!selectedPlotId) {
      navigate('/plots');
      return;
    }
    (async () => {
      setLoading(true);
      const c = await getCrops();
      setCrops(c);
      // Preselect Soybean for the demo if none is selected yet
      if (!selectedCrop) setSelectedCrop('soybean');
      setLoading(false);
    })();
  }, [selectedPlotId, navigate, selectedCrop, setSelectedCrop]);

  if (loading) return <Loading label={t('crop.loading')} />;

  const preferredCrops = crops.filter((c) => c.isPreferred !== false);
  const otherCrops = crops.filter((c) => c.isPreferred === false);

  const handleContinue = () => {
    if (!selectedCrop) {
      showToast(t('crop.selectFirst'), 'error');
      return;
    }
    navigate('/suitability');
  };

  const getWaterLabel = (waterReq: string) => {
    if (waterReq === 'high') return t('overview.high');
    if (waterReq === 'medium') return t('overview.medium');
    return t('overview.low');
  };

  return (
    <div>
      <StepProgress current={3} />
      <SectionTitle
        title={t('crop.title')}
        subtitle={t('crop.subtitle')}
      />

      {/* Context fields */}
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-5">
          <div>
            <p className="text-xs text-gray-400">{t('crop.cropStage')}</p>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
            >
              <option value="Pre-sowing">{t('crop.preSowing')}</option>
              <option value="Sowing">{t('crop.sowing')}</option>
              <option value="Vegetative">{t('crop.vegetative')}</option>
              <option value="Flowering">{t('crop.flowering')}</option>
              <option value="Harvest">{t('crop.harvest')}</option>
            </select>
          </div>
          <div>
            <p className="text-xs text-gray-400">{t('overview.irrigation')}</p>
            <p className="mt-1.5 font-medium text-gray-700">
              {plot?.hasIrrigation ? t('overview.yes') : t('overview.no')}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">{t('overview.waterReserve')}</p>
            <p className="mt-1.5 font-medium text-brand-700 flex items-center gap-1">
              <Waves className="h-3.5 w-3.5" />
              {plot?.waterReserve === 'high'
                ? t('overview.high')
                : plot?.waterReserve === 'medium'
                  ? t('overview.medium')
                  : t('overview.low')}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">{t('crop.budget')}</p>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value as 'low' | 'medium' | 'high')}
              className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm capitalize"
            >
              <option value="low">{t('soil.low')}</option>
              <option value="medium">{t('soil.medium')}</option>
              <option value="high">{t('soil.high')}</option>
            </select>
          </div>
          <div>
            <p className="text-xs text-gray-400">{t('overview.area')}</p>
            <p className="mt-1.5 font-medium text-gray-700">{plot?.areaHectares || 1.2} ha</p>
          </div>
        </div>
      </Card>

      {/* 1. Preferred Crops Section */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            {t('crop.preferredCrops')}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{t('crop.preferredSubtitle')}</p>
        </div>
        <Badge color="green">KrishiMitra Recommendations</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {preferredCrops.map((crop) => {
          const isSelected = selectedCrop === crop.id;
          const Icon = cropIcons[crop.icon] || Sprout;
          const waterReqLabel = getWaterLabel(crop.waterRequirement);
          const localizedName = t(`cropNames.${crop.id}`) || crop.name;

          return (
            <Card
              key={crop.id}
              className={`cursor-pointer p-5 transition-all ${
                isSelected ? 'ring-2 ring-brand-500 bg-brand-50/20' : 'hover:shadow-cardhover'
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedCrop(crop.id as CropId)}
                className="w-full text-left"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  {isSelected && <Badge color="green">{t('plots.selected')}</Badge>}
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-gray-800">{localizedName}</h3>
                  {crop.marathiName && localizedName !== crop.marathiName && (
                    <span className="text-xs text-brand-600 font-normal">({crop.marathiName})</span>
                  )}
                </div>
                <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
                  <p className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Droplets className="h-3.5 w-3.5 text-sky-500" />
                    {t('crop.water')}: <span className="font-medium text-gray-700">{waterReqLabel}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    {crop.growingPeriod}
                  </p>
                </div>
                <p className="mt-2 text-xs text-gray-400 line-clamp-2">{crop.suitabilityHint}</p>
              </button>
            </Card>
          );
        })}
      </div>

      {/* 2. Other Crops Section */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Layers className="h-4 w-4 text-brand-600" />
              {t('crop.otherCrops')}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{t('crop.otherCropsDesc')}</p>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
            {otherCrops.length} {t('crop.otherCrops').toLowerCase()}
          </span>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
        {otherCrops.map((crop) => {
          const isSelected = selectedCrop === crop.id;
          const Icon = cropIcons[crop.icon] || Sprout;
          const waterReqLabel = getWaterLabel(crop.waterRequirement);
          const localizedName = t(`cropNames.${crop.id}`) || crop.name;

          return (
            <button
              key={crop.id}
              type="button"
              onClick={() => setSelectedCrop(crop.id as CropId)}
              className={`group relative flex items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/70 ring-2 ring-brand-500 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-brand-300 hover:bg-gray-50/80 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-brand-600 text-white'
                      : 'bg-brand-50 text-brand-700 group-hover:bg-brand-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">
                    {localizedName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {crop.growingPeriod}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    crop.waterRequirement === 'high'
                      ? 'bg-sky-100 text-sky-700'
                      : crop.waterRequirement === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  <Droplets className="h-2.5 w-2.5" />
                  {waterReqLabel}
                </span>
                {isSelected && (
                  <span className="flex items-center text-[10px] font-semibold text-brand-700">
                    <CheckCircle2 className="mr-0.5 h-3 w-3 text-brand-600" />
                    {t('plots.selected')}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex flex-wrap gap-2 pt-2 border-t border-gray-100">
        <Button variant="ghost" onClick={() => navigate('/soil')}>
          <ArrowLeft className="h-4 w-4" /> {t('soil.back')}
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            showToast(
              'Select any preferred or other crop to evaluate its suitability against your soil & water reserve.',
              'info'
            )
          }
        >
          <Lightbulb className="h-4 w-4" /> {t('crop.exploreSuitable')}
        </Button>
        <Button onClick={handleContinue} className="ml-auto">
          {t('crop.checkSuitability')} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function CropSelectionPage() {
  return (
    <ToastProvider>
      <CropSelectionInner />
    </ToastProvider>
  );
}

