import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Sprout, MapPin, IndianRupee, AlertTriangle, ArrowRight, Trash2, FileText } from 'lucide-react';
import { Card, SectionTitle, Button, Badge, EmptyState } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { ToastProvider, useToast } from '@/components/Toast';
import { getSavedAdvisories, deleteSavedAdvisory } from '@/services/api';
import type { Advisory } from '@/types';
import { useTranslation } from '@/i18n/LanguageContext';

function SavedAdviceInner() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [openAdvisory, setOpenAdvisory] = useState<Advisory | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    setAdvisories(getSavedAdvisories());
  }, []);

  const handleDelete = (id: string) => {
    deleteSavedAdvisory(id);
    setAdvisories(getSavedAdvisories());
    showToast(t('saved.toastRemoved'), 'info');
  };

  const formatRupee = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  const riskBadge = (r: string) => (r === 'low' ? 'green' : r === 'medium' ? 'yellow' : 'red') as 'green' | 'yellow' | 'red';

  return (
    <div>
      <SectionTitle title={t('saved.title')} subtitle={t('saved.subtitle')} />

      {advisories.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={<Bookmark className="h-6 w-6" />}
            title={t('saved.emptyTitle')}
            message={t('saved.emptyMessage')}
            action={<Button onClick={() => navigate('/crop')}>{t('saved.startPlanning')}</Button>}
          />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {advisories.map((a) => (
            <Card key={a.id} className="p-5">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-brand-600" />
                    <h3 className="font-semibold text-gray-800">{a.crop}</h3>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="h-3 w-3" />{a.plotLabel}
                  </p>
                </div>
                <Badge color={riskBadge(a.risk)}>{a.risk} risk</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">{t('saved.date')}</p>
                  <p className="font-medium text-gray-700 text-xs">{a.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">{t('saved.expProfit')}</p>
                  <p className="font-semibold text-brand-700 text-xs">{formatRupee(a.expectedProfit)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">{t('saved.score')}</p>
                  <p className="font-medium text-gray-700">{a.suitabilityScore}/100</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" onClick={() => setOpenAdvisory(a)}>
                  <FileText className="h-3.5 w-3.5" /> {t('saved.openAdvisory')}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(a.id)}>
                  <Trash2 className="h-3.5 w-3.5" /> {t('saved.remove')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Open advisory modal */}
      <Modal
        open={!!openAdvisory}
        onClose={() => setOpenAdvisory(null)}
        title={openAdvisory ? `${openAdvisory.crop} — ${openAdvisory.plotLabel}` : ''}
        footer={<Button onClick={() => setOpenAdvisory(null)}>{t('common.close')}</Button>}
      >
        {openAdvisory && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">{t('saved.date')}</span><span className="font-medium text-gray-700">{openAdvisory.date}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">{t('saved.decision')}</span><span className="font-medium text-gray-700">{openAdvisory.decision}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">{t('saved.expectedProfit')}</span><span className="font-semibold text-brand-700">{formatRupee(openAdvisory.expectedProfit)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">{t('saved.risk')}</span><Badge color={riskBadge(openAdvisory.risk)}>{openAdvisory.risk}</Badge></div>
            <div className="flex justify-between"><span className="text-gray-500">{t('saved.weather')}</span><span className="font-medium text-gray-700 text-xs">{openAdvisory.weather}</span></div>

            {openAdvisory.sections.length > 0 && (
              <div className="border-t border-gray-100 pt-3">
                {openAdvisory.sections.map((s, i) => (
                  <div key={i} className="mb-3">
                    <p className="font-medium text-gray-700">{s.title} <span className="text-xs text-brand-600">{s.marathiTitle}</span></p>
                    <ul className="mt-1 space-y-1">
                      {s.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-brand-400" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <Button size="sm" onClick={() => { setOpenAdvisory(null); navigate('/advisory'); }}>
                {t('saved.goToAdvisory')} <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export function SavedAdvicePage() {
  return (
    <ToastProvider>
      <SavedAdviceInner />
    </ToastProvider>
  );
}
