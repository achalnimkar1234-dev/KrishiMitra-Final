import { useEffect, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Pencil, ArrowRight, ArrowLeft, CheckCircle, FileText, Loader2, Sparkles, ShieldAlert } from 'lucide-react';
import { Card, SectionTitle, Button, StatusPill, Loading } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { StepProgress } from '@/components/StepProgress';
import { ToastProvider, useToast } from '@/components/Toast';
import { useSession } from '@/components/SessionContext';
import { getSoilReport, updateSoilReport } from '@/services/api';
import { useTranslation } from '@/i18n/LanguageContext';
import { calculateParamLevel, recalculateSoilParameter } from '@/utils/soilUtils';
import { processSoilReportOCR } from '@/utils/ocrUtils';
import type { SoilReport, SoilParameter } from '@/types';

function SoilHealthInner() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { selectedPlotId } = useSession();
  const { t } = useTranslation();

  const [report, setReport] = useState<SoilReport | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [manualOpen, setManualOpen] = useState(false);
  const [ocrOpen, setOcrOpen] = useState(false);

  // Manual Edit form state
  const [editPh, setEditPh] = useState('');
  const [editEc, setEditEc] = useState('');
  const [editOc, setEditOc] = useState('');
  const [editNutrients, setEditNutrients] = useState<Record<string, string>>({});

  // OCR state
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrExtracted, setOcrExtracted] = useState<Record<string, string> | null>(null);
  const [ocrFileName, setOcrFileName] = useState('');

  useEffect(() => {
    if (!selectedPlotId) {
      navigate('/plots');
      return;
    }
    (async () => {
      setLoading(true);
      const r = await getSoilReport(selectedPlotId);
      if (r) {
        setReport(r);
        initFormState(r);
      }
      setLoading(false);
    })();
  }, [selectedPlotId, navigate]);

  const initFormState = (r: SoilReport) => {
    setEditPh(r.ph.toString());
    setEditEc(r.ec.toString());
    setEditOc(r.organicCarbon.toString());
    const nutMap: Record<string, string> = {};
    r.parameters.forEach((p) => {
      nutMap[p.name] = p.value;
    });
    setEditNutrients(nutMap);
  };

  if (loading) return <Loading label={t('soil.loading')} />;
  if (!report) return <div className="py-12 text-center text-gray-500">{t('soil.noReport')}</div>;

  // Recalculate basic parameter statuses
  const phStatus = calculateParamLevel('ph', report.ph);
  const ecStatus = calculateParamLevel('ec', report.ec);
  const ocStatus = calculateParamLevel('organicCarbon', report.organicCarbon);

  // Save manual updates
  const handleSaveManual = async () => {
    const newPh = parseFloat(editPh) || report.ph;
    const newEc = parseFloat(editEc) || report.ec;
    const newOc = parseFloat(editOc) || report.organicCarbon;

    const updatedParams: SoilParameter[] = report.parameters.map((p) => {
      const valStr = editNutrients[p.name] !== undefined ? editNutrients[p.name] : p.value;
      return recalculateSoilParameter(p, valStr);
    });

    const updatedReport: SoilReport = {
      ...report,
      ph: newPh,
      ec: newEc,
      organicCarbon: newOc,
      parameters: updatedParams,
      summary: `Updated soil parameters: pH ${newPh}, EC ${newEc} dS/m, Organic Carbon ${newOc}%.`,
    };

    const saved = await updateSoilReport(report.plotId, updatedReport);
    setReport(saved);
    setManualOpen(false);
    showToast(t('soil.saveChanges') + ' — ' + t('common.save'), 'success');
  };

  // Handle image upload for OCR
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrFileName(file.name);
    setOcrProcessing(true);
    setOcrExtracted(null);

    try {
      const res = await processSoilReportOCR(file);
      if (res.success) {
        const extractedMap: Record<string, string> = {
          pH: res.ph || '7.1',
          'Electrical Conductivity': res.ec || '0.45',
          'Organic Carbon': res.organicCarbon || '0.58',
          ...res.nutrients,
        };
        setOcrExtracted(extractedMap);
        showToast(t('soil.ocrSuccess'), 'success');
      } else {
        showToast(t('soil.ocrWarning'), 'error');
      }
    } catch {
      showToast(t('soil.ocrWarning'), 'error');
    } finally {
      setOcrProcessing(false);
    }
  };

  // Apply OCR Extracted & Reviewed Values
  const handleApplyOcr = async () => {
    if (!ocrExtracted) return;

    const newPh = parseFloat(ocrExtracted['pH'] || ocrExtracted['ph']) || report.ph;
    const newEc = parseFloat(ocrExtracted['Electrical Conductivity'] || ocrExtracted['ec']) || report.ec;
    const newOc = parseFloat(ocrExtracted['Organic Carbon'] || ocrExtracted['oc']) || report.organicCarbon;

    const updatedParams: SoilParameter[] = report.parameters.map((p) => {
      const extractedVal = ocrExtracted[p.name];
      if (extractedVal !== undefined) {
        return recalculateSoilParameter(p, extractedVal);
      }
      return p;
    });

    const updatedReport: SoilReport = {
      ...report,
      ph: newPh,
      ec: newEc,
      organicCarbon: newOc,
      parameters: updatedParams,
      summary: `OCR scanned soil parameters: pH ${newPh}, EC ${newEc} dS/m, OC ${newOc}%.`,
    };

    const saved = await updateSoilReport(report.plotId, updatedReport);
    setReport(saved);
    initFormState(saved);
    setOcrOpen(false);
    setOcrExtracted(null);
    showToast(t('soil.ocrSuccess'), 'success');
  };

  return (
    <div>
      <StepProgress current={2} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <SectionTitle
          title={t('soil.title')}
          subtitle={`${t('soil.testDate')}: ${report.testDate}`}
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setOcrOpen(true)}>
            <Upload className="h-4 w-4" /> {t('soil.scanReport')}
          </Button>
          <Button variant="primary" size="sm" onClick={() => { initFormState(report); setManualOpen(true); }}>
            <Pencil className="h-4 w-4" /> {t('soil.editValues')}
          </Button>
        </div>
      </div>

      {/* Table 1 — Basic Soil Parameters */}
      <Card className="mb-6 overflow-hidden p-0 shadow-card">
        <div className="border-b border-gray-100 bg-cream-50/80 px-5 py-3.5 flex items-center justify-between">
          <h3 className="font-serif font-semibold text-gray-800 text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand-600" />
            {t('soil.basicParameters')}
          </h3>
          <span className="text-xs text-gray-400 font-medium">Standard Test Protocol</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50/60 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">{t('soil.parameter')}</th>
                <th className="px-5 py-3 text-right">{t('soil.measuredValue')}</th>
                <th className="px-5 py-3">{t('soil.unit')}</th>
                <th className="px-5 py-3">{t('soil.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white font-medium text-gray-700">
              {/* pH */}
              <tr className="hover:bg-cream-50/50 transition-colors">
                <td className="px-5 py-3.5 text-gray-900 font-semibold">{t('soil.ph')}</td>
                <td className="px-5 py-3.5 text-right text-base font-bold text-gray-800">{report.ph}</td>
                <td className="px-5 py-3.5 text-gray-400 font-normal">—</td>
                <td className="px-5 py-3.5">
                  <StatusPill status={phStatus.level} label={t(phStatus.labelKey)} />
                </td>
              </tr>
              {/* EC */}
              <tr className="hover:bg-cream-50/50 transition-colors">
                <td className="px-5 py-3.5 text-gray-900 font-semibold">{t('soil.electricalConductivity')}</td>
                <td className="px-5 py-3.5 text-right text-base font-bold text-gray-800">{report.ec}</td>
                <td className="px-5 py-3.5 text-gray-500 font-normal">dS/m</td>
                <td className="px-5 py-3.5">
                  <StatusPill status={ecStatus.level} label={t(ecStatus.labelKey)} />
                </td>
              </tr>
              {/* Organic Carbon */}
              <tr className="hover:bg-cream-50/50 transition-colors">
                <td className="px-5 py-3.5 text-gray-900 font-semibold">{t('soil.organicCarbon')}</td>
                <td className="px-5 py-3.5 text-right text-base font-bold text-gray-800">{report.organicCarbon}</td>
                <td className="px-5 py-3.5 text-gray-500 font-normal">%</td>
                <td className="px-5 py-3.5">
                  <StatusPill status={ocStatus.level} label={t(ocStatus.labelKey)} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Table 2 — Nutrient Parameters */}
      <Card className="mb-6 overflow-hidden p-0 shadow-card">
        <div className="border-b border-gray-100 bg-cream-50/80 px-5 py-3.5 flex items-center justify-between">
          <h3 className="font-serif font-semibold text-gray-800 text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-600" />
            {t('soil.nutrientParameters')}
          </h3>
          <span className="text-xs text-gray-400 font-medium">{report.parameters.length} Nutrients Measured</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50/60 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">{t('soil.nutrient')}</th>
                <th className="px-5 py-3 text-right">{t('soil.measuredValue')}</th>
                <th className="px-5 py-3">{t('soil.unit')}</th>
                <th className="px-5 py-3">{t('soil.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white font-medium text-gray-700">
              {report.parameters.map((p) => {
                const statusInfo = calculateParamLevel(p.name, parseFloat(p.value));
                return (
                  <tr key={p.name} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-5 py-3 text-gray-800">
                      {p.name} <span className="text-xs text-brand-600 font-normal ml-1">({p.marathiName})</span>
                    </td>
                    <td className="px-5 py-3 text-right text-base font-semibold text-gray-900">{p.value}</td>
                    <td className="px-5 py-3 text-gray-500 font-normal">{p.unit}</td>
                    <td className="px-5 py-3">
                      <StatusPill status={statusInfo.level} label={t(statusInfo.labelKey)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bottom Action Bar */}
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => navigate('/plots')}>
          <ArrowLeft className="h-4 w-4" /> {t('soil.back')}
        </Button>
        <Button variant="outline" onClick={() => { initFormState(report); setManualOpen(true); }}>
          <Pencil className="h-4 w-4" /> {t('soil.editValues')}
        </Button>
        <Button onClick={() => navigate('/crop')} className="ml-auto">
          {t('soil.continueToCrop')} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Manual Edit Modal */}
      <Modal
        open={manualOpen}
        onClose={() => setManualOpen(false)}
        title={t('soil.editValues')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setManualOpen(false)}>{t('soil.cancel')}</Button>
            <Button onClick={handleSaveManual}>{t('soil.saveChanges')}</Button>
          </>
        }
      >
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          <p className="text-xs text-gray-500">{t('soil.reviewNotice')}</p>

          {/* Basic Params */}
          <div className="rounded-lg border border-gray-200 bg-cream-50/50 p-3 space-y-3">
            <h4 className="font-semibold text-xs text-brand-700 uppercase tracking-wider">{t('soil.basicParameters')}</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('soil.ph')}</label>
                <input
                  type="number"
                  step="0.1"
                  value={editPh}
                  onChange={(e) => setEditPh(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('soil.electricalConductivity')} (dS/m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editEc}
                  onChange={(e) => setEditEc(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('soil.organicCarbon')} (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editOc}
                  onChange={(e) => setEditOc(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Nutrients */}
          <div className="rounded-lg border border-gray-200 bg-white p-3 space-y-3">
            <h4 className="font-semibold text-xs text-brand-700 uppercase tracking-wider">{t('soil.nutrientParameters')}</h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {report.parameters.map((p) => (
                <div key={p.name}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {p.name} <span className="text-[10px] text-gray-400">({p.unit})</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editNutrients[p.name] !== undefined ? editNutrients[p.name] : p.value}
                    onChange={(e) => setEditNutrients({ ...editNutrients, [p.name]: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* OCR Scan Modal */}
      <Modal
        open={ocrOpen}
        onClose={() => { setOcrOpen(false); setOcrExtracted(null); }}
        title={t('soil.scanReport')}
        footer={
          ocrExtracted ? (
            <>
              <Button variant="ghost" onClick={() => { setOcrExtracted(null); setOcrOpen(false); }}>{t('soil.cancel')}</Button>
              <Button onClick={handleApplyOcr}>{t('soil.applyToCard')}</Button>
            </>
          ) : (
            <Button variant="ghost" onClick={() => setOcrOpen(false)}>{t('soil.close')}</Button>
          )
        }
      >
        <div className="space-y-4">
          {!ocrExtracted && !ocrProcessing && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-300 bg-brand-50/20 py-10 text-center">
              <Upload className="mb-3 h-10 w-10 text-brand-600" />
              <p className="text-sm font-medium text-gray-700">{t('soil.dropFile')}</p>
              <p className="mt-1 text-xs text-gray-400">Supports JPG, JPEG, PNG, WEBP soil laboratory reports</p>
              <label className="mt-4 cursor-pointer inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 transition-colors">
                <Upload className="h-4 w-4" /> {t('soil.chooseFile')}
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          )}

          {ocrProcessing && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="mb-3 h-10 w-10 animate-spin text-brand-600" />
              <p className="font-semibold text-gray-800 text-sm">{t('soil.readingReport')}</p>
              <p className="mt-1 text-xs text-gray-400">Extracting pH, EC, Organic Carbon & Nutrients from {ocrFileName}...</p>
            </div>
          )}

          {ocrExtracted && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div className="flex items-center justify-between rounded-lg bg-brand-50 p-3 border border-brand-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-brand-600" />
                  <div>
                    <p className="font-semibold text-xs text-brand-800">{t('soil.extractedParameters')}</p>
                    <p className="text-[11px] text-gray-600">{t('soil.reviewNotice')}</p>
                  </div>
                </div>
              </div>

              {/* Extracted Values Review Form */}
              <div className="rounded-lg border border-gray-200 p-3 space-y-3 bg-white">
                <h4 className="font-semibold text-xs text-gray-700 uppercase tracking-wider">{t('soil.basicParameters')}</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-gray-500 mb-1">{t('soil.ph')}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={ocrExtracted['pH'] || ''}
                      onChange={(e) => setOcrExtracted({ ...ocrExtracted, pH: e.target.value })}
                      className="w-full rounded border border-gray-300 p-1.5 text-sm font-semibold focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">EC (dS/m)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={ocrExtracted['Electrical Conductivity'] || ''}
                      onChange={(e) => setOcrExtracted({ ...ocrExtracted, 'Electrical Conductivity': e.target.value })}
                      className="w-full rounded border border-gray-300 p-1.5 text-sm font-semibold focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">OC (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={ocrExtracted['Organic Carbon'] || ''}
                      onChange={(e) => setOcrExtracted({ ...ocrExtracted, 'Organic Carbon': e.target.value })}
                      className="w-full rounded border border-gray-300 p-1.5 text-sm font-semibold focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <h4 className="font-semibold text-xs text-gray-700 uppercase tracking-wider pt-2 border-t border-gray-100">{t('soil.nutrientParameters')}</h4>
                <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                  {report.parameters.map((p) => (
                    <div key={p.name}>
                      <label className="block text-gray-500 mb-1">{p.name} ({p.unit})</label>
                      <input
                        type="number"
                        step="0.01"
                        value={ocrExtracted[p.name] !== undefined ? ocrExtracted[p.name] : p.value}
                        onChange={(e) => setOcrExtracted({ ...ocrExtracted, [p.name]: e.target.value })}
                        className="w-full rounded border border-gray-300 p-1.5 text-sm font-semibold focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export function SoilHealthPage() {
  return (
    <ToastProvider>
      <SoilHealthInner />
    </ToastProvider>
  );
}
