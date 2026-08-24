import { Check } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageContext';

export function StepProgress({ current }: { current: number }) {
  const { t } = useTranslation();

  const steps = [
    { label: t('steps.farmerId'), path: '/plots' },
    { label: t('steps.plot'), path: '/plots' },
    { label: t('steps.soil'), path: '/soil' },
    { label: t('steps.crop'), path: '/crop' },
    { label: t('steps.suitability'), path: '/suitability' },
    { label: t('steps.market'), path: '/market' },
    { label: t('steps.advisory'), path: '/advisory' },
  ];

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex items-center gap-1 min-w-max">
        {steps.map((step, idx) => {
          const completed = idx < current;
          const active = idx === current;
          return (
            <div key={idx} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-medium transition-colors ${
                    completed
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : active
                        ? 'border-brand-600 bg-white text-brand-600'
                        : 'border-gray-200 bg-white text-gray-400'
                  }`}
                >
                  {completed ? <Check className="h-4 w-4" /> : idx + 1}
                </div>
                <span className={`mt-1 text-[10px] ${active ? 'font-medium text-brand-600' : completed ? 'text-gray-500' : 'text-gray-300'}`}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`mx-1 h-0.5 w-4 md:w-8 ${completed ? 'bg-brand-600' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
