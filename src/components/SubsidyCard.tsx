import { useState } from 'react';
import {
  Sprout,
  Droplets,
  ExternalLink,
  Building2,
  Sparkles,
  BadgePercent,
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle2,
  Sun,
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';
import type { GovernmentSubsidy } from '@/types';
import { useTranslation } from '@/i18n/LanguageContext';

interface SubsidyCardProps {
  scheme: GovernmentSubsidy;
  isRelevant?: boolean;
  onApplyRedirect?: (scheme: GovernmentSubsidy) => void;
}

export function SubsidyCard({ scheme, isRelevant, onApplyRedirect }: SubsidyCardProps) {
  const { t, language } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const localizedName =
    language === 'mr' ? scheme.marathiName : language === 'hi' ? scheme.hindiName : scheme.name;

  const localizedDescription =
    language === 'mr'
      ? scheme.marathiDescription
      : language === 'hi'
      ? scheme.hindiDescription
      : scheme.shortDescription;

  const localizedBenefit =
    language === 'mr'
      ? scheme.marathiBenefit
      : language === 'hi'
      ? scheme.hindiBenefit
      : scheme.benefit;

  const localizedEligibleFor =
    language === 'mr'
      ? scheme.marathiEligibleFor
      : language === 'hi'
      ? scheme.hindiEligibleFor
      : scheme.eligibleFor;

  const localizedEligibilitySummary =
    language === 'mr'
      ? scheme.marathiEligibilitySummary
      : language === 'hi'
      ? scheme.hindiEligibilitySummary
      : scheme.eligibilitySummary;

  const localizedDocs =
    language === 'mr'
      ? scheme.marathiDocuments
      : language === 'hi'
      ? scheme.hindiDocuments
      : scheme.documents;

  const handleOpenPortal = () => {
    if (onApplyRedirect) {
      onApplyRedirect(scheme);
    } else {
      window.open(scheme.officialUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const isSolar = scheme.id.includes('solar');
  const isMicroIrrigation = scheme.id.includes('pmksy');

  return (
    <Card className="flex flex-col justify-between p-5 border border-gray-200 transition-all hover:shadow-cardhover hover:border-brand-300">
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                scheme.category === 'inputs'
                  ? 'bg-emerald-50 text-emerald-700'
                  : isSolar
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-sky-50 text-sky-700'
              }`}
            >
              {scheme.category === 'inputs' ? (
                <Sprout className="h-5 w-5" />
              ) : isSolar ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Droplets className="h-5 w-5" />
              )}
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                {scheme.category === 'inputs' ? t('subsidy.catInputs') : t('subsidy.catIrrigation')}
              </span>
              <h4 className="font-semibold text-gray-900 text-base leading-snug">{scheme.name}</h4>
              {language !== 'en' && localizedName !== scheme.name && (
                <p className="text-xs text-brand-700 font-medium mt-0.5">{localizedName}</p>
              )}
            </div>
          </div>

          {isRelevant && (
            <Badge color="green" className="flex items-center gap-1 flex-shrink-0">
              <Sparkles className="h-3 w-3 inline text-brand-700" />
              {t('subsidy.relevantToFarm')}
            </Badge>
          )}
        </div>

        {/* Short Description */}
        <p className="mt-3 text-xs leading-relaxed text-gray-600">{localizedDescription}</p>

        {/* Benefit Summary Box */}
        <div className="mt-3.5 rounded-lg bg-cream-50/80 p-3 border border-cream-200/60">
          <div className="flex items-start gap-2">
            <BadgePercent className="h-4 w-4 text-brand-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-900 block">
                {t('subsidy.benefit')}
              </span>
              <p className="text-xs font-medium text-gray-800 leading-snug mt-0.5">{localizedBenefit}</p>
            </div>
          </div>
        </div>

        {/* Expandable Details Section */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" /> {t('common.close')} {t('subsidy.whoCanApply')}
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" /> {t('subsidy.whoCanApply')} & {t('subsidy.documentsNeeded')}
              </>
            )}
          </button>

          {expanded && (
            <div className="mt-2.5 space-y-2.5 rounded-lg bg-gray-50/80 p-3 text-xs border border-gray-100 animate-fadeIn">
              <div>
                <span className="font-semibold text-gray-700 block mb-0.5">{t('subsidy.whoCanApply')}:</span>
                <p className="text-gray-600">{localizedEligibleFor}</p>
                <p className="text-gray-600 mt-1 italic">{localizedEligibilitySummary}</p>
              </div>

              <div className="border-t border-gray-200/60 pt-2">
                <span className="font-semibold text-gray-700 block mb-1 flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-gray-600" />
                  {t('subsidy.documentsNeeded')}:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-gray-600">
                  {localizedDocs.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-brand-600 flex-shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-gray-600 mt-1.5">{t('subsidy.documentsNote')}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer Row with Official Source & Apply Button */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
          <Building2 className="h-3.5 w-3.5 flex-shrink-0 text-gray-600" />
          <span className="truncate max-w-[200px] sm:max-w-[260px]">{scheme.sourceName}</span>
        </div>

        <Button
          size="sm"
          onClick={handleOpenPortal}
          className="flex items-center gap-1 text-xs"
        >
          {t('subsidy.checkEligibility')}
          <ExternalLink className="h-3.5 w-3.5 ml-0.5" />
        </Button>
      </div>
    </Card>
  );
}
