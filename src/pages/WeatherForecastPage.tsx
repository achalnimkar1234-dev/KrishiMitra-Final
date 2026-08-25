import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CloudSun,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Droplets,
  Wind,
  Thermometer,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sprout,
  MapPin,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Card, SectionTitle, Button, Badge, Loading } from '@/components/ui';
import { ToastProvider, useToast } from '@/components/Toast';
import { useSession } from '@/components/SessionContext';
import { useTranslation } from '@/i18n/LanguageContext';
import { getWeatherForecast } from '@/services/weatherService';
import { crops, plots } from '@/data/mockData';
import type { CropId, WeatherConditionType, WeatherForecastData } from '@/types';

// Helper component to render weather icons
function WeatherIcon({ condition, className = 'h-6 w-6' }: { condition: WeatherConditionType; className?: string }) {
  switch (condition) {
    case 'clear':
      return <Sun className={`${className} text-amber-500`} />;
    case 'partly_cloudy':
      return <CloudSun className={`${className} text-amber-500`} />;
    case 'cloudy':
      return <Cloud className={`${className} text-gray-400`} />;
    case 'light_rain':
      return <CloudRain className={`${className} text-sky-500`} />;
    case 'moderate_rain':
      return <CloudRain className={`${className} text-blue-500`} />;
    case 'heavy_rain':
      return <CloudRain className={`${className} text-blue-700`} />;
    case 'thunderstorm':
      return <CloudLightning className={`${className} text-purple-600`} />;
    default:
      return <CloudSun className={`${className} text-amber-500`} />;
  }
}

function WeatherForecastInner() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { selectedPlotId, selectedCrop, setSelectedCrop } = useSession();
  const { t } = useTranslation();

  const [data, setData] = useState<WeatherForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCropFilter, setSelectedCropFilter] = useState<CropId | null>(selectedCrop);

  const activePlot = plots.find((p) => p.id === selectedPlotId) || plots[0];

  const fetchWeather = async (cropOverride?: CropId | null) => {
    setLoading(true);
    setError(false);
    try {
      const activeCrop = cropOverride !== undefined ? cropOverride : selectedCropFilter;
      const res = await getWeatherForecast(selectedPlotId || undefined, activeCrop);
      setData(res);
    } catch {
      setError(true);
      showToast(t('weather.temporaryUnavailable'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedCrop);
    setSelectedCropFilter(selectedCrop);
  }, [selectedPlotId, selectedCrop]);

  const handleCropChange = (cId: CropId | null) => {
    setSelectedCropFilter(cId);
    setSelectedCrop(cId);
    fetchWeather(cId);
  };

  if (loading && !data) {
    return <Loading label={t('common.loading')} />;
  }

  if (error || !data) {
    return (
      <div className="py-12 text-center">
        <Card className="mx-auto max-w-md p-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">{t('weather.temporaryUnavailable')}</h3>
          <Button onClick={() => fetchWeather(selectedCropFilter)} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-1.5" />
            {t('weather.retry')}
          </Button>
        </Card>
      </div>
    );
  }

  const { sowingRecommendation, forecast, location, totalWeeklyRainfallMm, avgTemp, avgHumidity } = data;

  // Status configuration for recommendation hero card
  const statusConfig = {
    suitable: {
      color: 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-emerald-400',
      badgeColor: 'green' as const,
      badgeText: `✓ ${t('weather.statusSuitable')}`,
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      bannerBg: 'bg-gradient-to-r from-emerald-500/10 via-brand-50 to-emerald-50/50',
    },
    wait: {
      color: 'bg-amber-50 text-amber-800 border-amber-300 ring-amber-400',
      badgeColor: 'yellow' as const,
      badgeText: `⚠ ${t('weather.statusWait')}`,
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      bannerBg: 'bg-gradient-to-r from-amber-500/10 via-mustard-50 to-amber-50/50',
    },
    avoid: {
      color: 'bg-red-50 text-red-800 border-red-300 ring-red-400',
      badgeColor: 'red' as const,
      badgeText: `✕ ${t('weather.statusAvoid')}`,
      icon: XCircle,
      iconColor: 'text-red-600',
      bannerBg: 'bg-gradient-to-r from-red-500/10 via-rose-50 to-red-50/50',
    },
  };

  const currentStatus = statusConfig[sowingRecommendation.status] || statusConfig.suitable;
  const StatusIcon = currentStatus.icon;

  const currentCropObj = crops.find((c) => c.id === selectedCropFilter);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Plot Location Info */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <SectionTitle
            title={t('weather.title')}
            subtitle={`${location.village}, ${location.taluka}, ${location.district}`}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 shadow-xs">
            <MapPin className="h-3.5 w-3.5 text-brand-600" />
            <span className="font-medium text-gray-800">{location.plotId}</span>
            <span className="text-gray-400">({location.areaHectares} ha)</span>
          </div>
          <button
            onClick={() => fetchWeather(selectedCropFilter)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-brand-50 hover:text-brand-700 transition-colors shadow-xs"
            title={t('weather.lastUpdated')}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{data.generatedAt}</span>
          </button>
        </div>
      </div>

      {/* Interactive Crop Selection Filter Ribbon */}
      <Card className="p-4 bg-cream-50/70 border-brand-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-brand-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {t('weather.cropHeading')}
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {currentCropObj ? (t(`cropNames.${currentCropObj.id}`) || currentCropObj.name) : t('weather.noCropSelected')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => handleCropChange(null)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                selectedCropFilter === null
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {t('weather.noCropSelected')}
            </button>
            {crops.slice(0, 5).map((c) => (
              <button
                key={c.id}
                onClick={() => handleCropChange(c.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  selectedCropFilter === c.id
                    ? 'bg-brand-600 text-white shadow-xs ring-2 ring-brand-300'
                    : 'bg-white text-gray-700 hover:bg-brand-50 hover:text-brand-700 border border-gray-200'
                }`}
              >
                {t(`cropNames.${c.id}`) || c.name}
              </button>
            ))}
            <button
              onClick={() => navigate('/crop')}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-brand-700 hover:bg-brand-50 transition-colors"
            >
              <span>{t('weather.changeCrop')}</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </Card>

      {/* ─── HERO CARD: RECOMMENDED SOWING TIME (IMPORTANT FEATURE) ─── */}
      <Card className="overflow-hidden border-2 border-brand-200 shadow-md">
        {/* Banner with status badge */}
        <div className={`p-5 sm:p-6 ${currentStatus.bannerBg} border-b border-gray-200/80`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                <StatusIcon className={`h-7 w-7 ${currentStatus.iconColor}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
                    {t('weather.recommendedSowingTime')}
                  </span>
                  <Badge color={currentStatus.badgeColor} className="font-semibold text-xs px-2.5 py-0.5">
                    {currentStatus.badgeText}
                  </Badge>
                </div>
                <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  {sowingRecommendation.recommendedWindow}
                </h3>
              </div>
            </div>

            {selectedCropFilter && (
              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200">
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                  {t('weather.cropHeading')}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-brand-100/80 px-2.5 py-1 text-xs font-semibold text-brand-800">
                  <Sprout className="h-3.5 w-3.5" />
                  {currentCropObj ? (t(`cropNames.${currentCropObj.id}`) || currentCropObj.name) : sowingRecommendation.cropName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Why / Agronomic Reason */}
        <div className="p-5 sm:p-6 bg-white space-y-5">
          <div>
            <h4 className="flex items-center gap-2 font-serif text-base font-semibold text-gray-900">
              <Sparkles className="h-4 w-4 text-brand-600" />
              {t('weather.whyHeading')}
            </h4>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-700 font-normal bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/80">
              {sowingRecommendation.reasonKey ? t(sowingRecommendation.reasonKey) : sowingRecommendation.reason}
            </p>
          </div>

          {/* Integrated 3-Layer Decision Matrix */}
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <h4 className="flex items-center gap-2 font-serif text-sm font-semibold text-gray-900">
                <Layers className="h-4 w-4 text-brand-600" />
                {t('weather.overallDecision')}
              </h4>
              <span className="hidden sm:inline text-[11px] font-medium text-gray-400">
                {t('weather.decisionFormula')}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {/* Layer 1: Soil & Water */}
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-gray-500">{t('weather.soilWaterLayer')}</span>
                  <Badge color="green" className="text-[10px] py-0">
                    {activePlot.waterReserve === 'high' ? t('overview.high') : t('overview.medium')}
                  </Badge>
                </div>
                <p className="text-xs font-medium text-gray-800">
                  {sowingRecommendation.soilWaterSuitability === 'suitable' ? t('weather.statusSuitable') : t('weather.statusModerate')}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                  {activePlot.hasIrrigation ? `${t('overview.irrigation')}: ${t('overview.yes')}` : t('overview.no')}
                </p>
              </div>

              {/* Layer 2: 7-Day Weather */}
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-gray-500">{t('weather.weatherLayer')}</span>
                  <Badge color="green" className="text-[10px] py-0">
                    {totalWeeklyRainfallMm} mm
                  </Badge>
                </div>
                <p className="text-xs font-medium text-gray-800">
                  {sowingRecommendation.weatherSuitability === 'suitable' ? t('weather.statusSuitable') : t('weather.statusModerate')}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                  {t('weather.dryingOptimal')}
                </p>
              </div>

              {/* Layer 3: Final Verdict */}
              <div className={`rounded-xl border p-3 shadow-xs ${currentStatus.color}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold">{t('weather.verdictLayer')}</span>
                  <StatusIcon className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs font-bold">
                  {sowingRecommendation.status === 'suitable'
                    ? t('weather.decisionGoodWindow')
                    : sowingRecommendation.status === 'wait'
                      ? t('weather.decisionWait')
                      : t('weather.decisionAvoid')}
                </p>
                <p className="text-[11px] opacity-85 mt-0.5 leading-tight">
                  {sowingRecommendation.recommendedWindow}
                </p>
              </div>
            </div>
          </div>

          {/* Farmer Advisory Tips */}
          {sowingRecommendation.farmerAdvice.length > 0 && (
            <div className="rounded-xl border border-brand-200/80 bg-brand-50/40 p-4">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-900 mb-2">
                <ShieldCheck className="h-4 w-4 text-brand-700" />
                {t('weather.importantAdvice')}
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {sowingRecommendation.farmerAdvice.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-brand-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* ─── 7-DAY WEATHER FORECAST VISUALIZATION (CARDS) ─── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand-600" />
            <h3 className="font-serif text-lg font-semibold text-gray-900">
              {t('weather.forecast7Days')}
            </h3>
          </div>
          <span className="text-xs text-gray-500">
            {t('weather.weeklyRainfall')}: <strong className="text-brand-700 font-bold">{totalWeeklyRainfallMm} mm</strong>
          </span>
        </div>

        {/* Responsive Grid for 7 Days */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
          {forecast.map((day, idx) => {
            const isWindowDay = idx === 2 || idx === 3;
            const dayConditionKey = `weather.${day.condition}`;

            return (
              <Card
                key={idx}
                className={`relative flex flex-col justify-between p-3.5 transition-all hover:shadow-cardhover ${
                  isWindowDay
                    ? 'border-2 border-brand-500 bg-brand-50/30 ring-2 ring-brand-300/40'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {/* Sowing window banner badge */}
                {isWindowDay && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
                    ★ {t('weather.bestSowingWindow')}
                  </div>
                )}

                {/* Day & Date */}
                <div className="text-center pb-2 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-800">{day.dayName}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{day.date}</p>
                </div>

                {/* Condition Icon & Label */}
                <div className="my-3 flex flex-col items-center text-center">
                  <div className="mb-1.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-50 shadow-xs">
                    <WeatherIcon condition={day.condition} className="h-7 w-7" />
                  </div>
                  <p className="text-xs font-semibold text-gray-700 line-clamp-1">
                    {t(dayConditionKey)}
                  </p>
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs">
                  {/* Temperature */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">{t('weather.temperature')}</span>
                    <span className="font-semibold text-gray-800">
                      {day.minTemp}° – {day.maxTemp}°C
                    </span>
                  </div>

                  {/* Rain Chance */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">{t('weather.rainChance')}</span>
                    <span className={`font-semibold ${day.rainProbability > 50 ? 'text-blue-600' : 'text-gray-700'}`}>
                      {day.rainProbability}%
                    </span>
                  </div>

                  {/* Rainfall mm */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">{t('weather.rainfall')}</span>
                    <span className={`font-semibold ${day.rainfallMm > 0 ? 'text-blue-700' : 'text-gray-500'}`}>
                      {day.rainfallMm} mm
                    </span>
                  </div>

                  {/* Wind / Humidity */}
                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                    <span className="inline-flex items-center gap-0.5">
                      <Wind className="h-3 w-3" /> {day.windSpeedKmh} km/h
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                      <Droplets className="h-3 w-3" /> {day.humidityPercent}%
                    </span>
                  </div>
                </div>

                {/* Sowing Suitability Pill */}
                <div className="mt-3 pt-2 text-center border-t border-gray-100">
                  <span
                    className={`inline-block w-full rounded-md py-1 text-[10px] font-bold ${
                      day.sowingFit === 'suitable'
                        ? 'bg-emerald-100 text-emerald-800'
                        : day.sowingFit === 'moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {day.sowingFit === 'suitable'
                      ? `✓ ${t('weather.statusSuitable')}`
                      : day.sowingFit === 'moderate'
                        ? `~ ${t('weather.statusModerate')}`
                        : `✕ ${t('weather.statusAvoid')}`}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ─── AGRO-METEOROLOGICAL SUMMARY CARD ─── */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
            <Droplets className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">{t('weather.weeklyRainfall')}</p>
            <p className="text-lg font-bold text-gray-900">{totalWeeklyRainfallMm} mm</p>
            <p className="text-[10px] text-gray-400">{t('weather.moistureOptimal')}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 flex-shrink-0">
            <Thermometer className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">{t('weather.avgTempLabel')}</p>
            <p className="text-lg font-bold text-gray-900">{avgTemp}°C</p>
            <p className="text-[10px] text-gray-400">Min 22°C — Max 33°C</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 flex-shrink-0">
            <Wind className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">{t('weather.avgHumidityLabel')}</p>
            <p className="text-lg font-bold text-gray-900">{avgHumidity}%</p>
            <p className="text-[10px] text-gray-400">Moderate breeze (10–16 km/h)</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 flex-shrink-0">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">{t('weather.soilMoisture')}</p>
            <p className="text-lg font-bold text-brand-700">{t('weather.moistureOptimal')}</p>
            <p className="text-[10px] text-gray-400">60–70% Field Capacity</p>
          </div>
        </Card>
      </div>

      {/* Navigation action helper */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button variant="outline" onClick={() => navigate('/crop')}>
          ← {t('weather.goToCropDecision')}
        </Button>
        <Button variant="primary" onClick={() => navigate('/suitability')}>
          {t('common.continue')} →
        </Button>
      </div>
    </div>
  );
}

export function WeatherForecastPage() {
  return (
    <ToastProvider>
      <WeatherForecastInner />
    </ToastProvider>
  );
}
