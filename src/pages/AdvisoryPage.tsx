import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, CloudSun, IndianRupee, AlertTriangle, Volume2, Save, Download, RefreshCw, ArrowLeft, CheckCircle2, Leaf, Droplets, FlaskConical, ShieldCheck, LineChart } from 'lucide-react';
import { Card, SectionTitle, Button, Badge, Loading } from '@/components/ui';
import { StepProgress } from '@/components/StepProgress';
import { ToastProvider, useToast } from '@/components/Toast';
import { useSession } from '@/components/SessionContext';
import { getDefaultAdvisory, saveAdvisory } from '@/services/api';
import { plots } from '@/data/mockData';
import type { Advisory } from '@/types';
import { useTranslation } from '@/i18n/LanguageContext';

const sectionIcons = [Leaf, FlaskConical, Droplets, ShieldCheck, LineChart];

function AdvisoryInner() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { selectedPlotId, selectedCrop, resetSession } = useSession();
  const [advisory, setAdvisory] = useState<Advisory | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const { t } = useTranslation();

  const plot = plots.find((p) => p.id === selectedPlotId);

  useEffect(() => {
    if (!selectedPlotId) {
      navigate('/plots');
      return;
    }
    (async () => {
      setLoading(true);
      const a = await getDefaultAdvisory(selectedCrop || undefined);
      // Adjust for selected plot
      if (plot) {
        a.plotId = plot.id;
        a.plotLabel = `${plot.id} — ${plot.village} (${plot.areaHectares} ha)`;
      }
      setAdvisory(a);
      setLoading(false);
    })();
  }, [selectedPlotId, selectedCrop, navigate, plot]);

  if (loading) return <Loading label={t('advisory.preparing')} />;
  if (!advisory) return <div className="py-12 text-center text-gray-500">{t('advisory.noAdvisory')}</div>;

  const formatRupee = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  const handleSave = () => {
    saveAdvisory(advisory);
    setSaved(true);
    showToast(t('advisory.toastSaved'), 'success');
  };

  const handleDownload = () => {
    const summary = [
      `KrishiMitra — Farm Advisory`,
      `Plot: ${advisory.plotLabel}`,
      `Crop: ${advisory.crop}`,
      `Decision: ${advisory.decision}`,
      `Expected profit: ${formatRupee(advisory.expectedProfit)}`,
      `Risk: ${advisory.risk}`,
      `Weather: ${advisory.weather}`,
      '',
      ...advisory.sections.map((s) => `\n${s.title}:\n${s.items.map((i) => `  - ${i}`).join('\n')}`),
    ].join('\n');
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `krishimitra-advisory-${advisory.plotId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('advisory.toastDownloaded'), 'success');
  };

  const handleStartOver = () => {
    resetSession();
    navigate('/login');
  };

  const riskBadge = advisory.risk === 'low' ? 'green' : advisory.risk === 'medium' ? 'yellow' : 'red';

  return (
    <div>
      <StepProgress current={6} />
      <SectionTitle title={t('advisory.title')} />

      {/* Decision summary */}
      <Card className="mb-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg bg-brand-50 p-3">
            <Sprout className="mb-1 h-4 w-4 text-brand-600" />
            <p className="text-xs text-gray-400">{t('advisory.crop')}</p>
            <p className="font-semibold text-gray-800">{advisory.crop}</p>
          </div>
          <div className="rounded-lg bg-cream-50 p-3">
            <CheckCircle2 className="mb-1 h-4 w-4 text-brand-600" />
            <p className="text-xs text-gray-400">{t('advisory.decision')}</p>
            <p className="font-semibold text-gray-800 text-sm">{advisory.decision}</p>
          </div>
          <div className="rounded-lg bg-brand-50 p-3">
            <IndianRupee className="mb-1 h-4 w-4 text-brand-600" />
            <p className="text-xs text-gray-400">{t('advisory.expectedProfit')}</p>
            <p className="font-semibold text-brand-700">{formatRupee(advisory.expectedProfit)}</p>
          </div>
          <div className="rounded-lg bg-mustard-50 p-3">
            <AlertTriangle className="mb-1 h-4 w-4 text-mustard-600" />
            <p className="text-xs text-gray-400">{t('advisory.overallRisk')}</p>
            <Badge color={riskBadge}>{advisory.risk}</Badge>
          </div>
          <div className="rounded-lg bg-sky-50 p-3">
            <CloudSun className="mb-1 h-4 w-4 text-sky-600" />
            <p className="text-xs text-gray-400">{t('advisory.weather')}</p>
            <p className="font-semibold text-gray-800 text-xs">{advisory.weather}</p>
          </div>
        </div>
      </Card>

      {/* Advisory sections */}
      <div className="mb-5 space-y-4">
        {advisory.sections.map((section, i) => {
          const Icon = sectionIcons[i] || Leaf;
          return (
            <Card key={section.title} className="p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-700">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon className="h-4 w-4" />
                </div>
                {section.title}
                <span className="text-xs font-normal text-brand-600">{section.marathiTitle}</span>
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      {/* Why this recommendation */}
      <Card className="mb-5 p-5">
        <h3 className="mb-3 font-semibold text-gray-700">{t('advisory.whyRecommendation')}</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {advisory.whyRecommendation.map((w, i) => (
            <div key={i} className="rounded-lg border border-gray-100 p-3">
              <p className="text-xs text-gray-400">{w.label}</p>
              <p className="mt-0.5 text-sm font-medium text-gray-700">{w.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => navigate('/market')}>
          <ArrowLeft className="h-4 w-4" /> {t('common.back')}
        </Button>
        <Button variant="outline" onClick={() => showToast(t('advisory.toastVoice'), 'info')}>
          <Volume2 className="h-4 w-4" /> {t('advisory.playInMarathi')}
        </Button>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4" /> {t('advisory.downloadSummary')}
        </Button>
        <Button variant="outline" onClick={handleStartOver}>
          <RefreshCw className="h-4 w-4" /> {t('advisory.startOver')}
        </Button>
        <Button onClick={handleSave} disabled={saved} className="ml-auto">
          <Save className="h-4 w-4" /> {saved ? t('advisory.saved') : t('advisory.saveAdvisory')}
        </Button>
      </div>
    </div>
  );
}

export function AdvisoryPage() {
  return (
    <ToastProvider>
      <AdvisoryInner />
    </ToastProvider>
  );
}
