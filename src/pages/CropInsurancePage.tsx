import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowLeft, Umbrella, Award, CloudRain, HelpCircle, PhoneCall, ExternalLink, CheckCircle } from 'lucide-react';
import { Card, SectionTitle, Button, Badge } from '@/components/ui';
import { useTranslation } from '@/i18n/LanguageContext';

export function CropInsurancePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div>
      <SectionTitle
        title={t('insurance.title')}
        subtitle={t('insurance.subtitle')}
      />

      {/* Hero Overview Banner */}
      <Card className="mb-6 border-l-4 border-l-brand-600 bg-gradient-to-r from-brand-50/80 via-white to-brand-50/30 p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
              <Umbrella className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-800 text-base">{t('insurance.whyInsurance')}</h3>
                <Badge color="green">PMFBY Protected</Badge>
              </div>
              <p className="mt-1 text-sm text-gray-600 leading-relaxed max-w-3xl">
                {t('insurance.whyInsuranceDesc')}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 2x2 Feature Grid */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {/* Coverage Details */}
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="font-semibold text-gray-800">{t('insurance.coverage')}</h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{t('insurance.coverageDesc')}</p>
          <ul className="mt-3 space-y-1.5 text-xs text-gray-500 border-t border-gray-100 pt-3">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-brand-600" /> Pre-sowing and prevented planting coverage
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-brand-600" /> Standing crop (sowing to harvesting) yield loss
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-brand-600" /> Post-harvest losses up to 14 days for spread crops
            </li>
          </ul>
        </Card>

        {/* Eligible Crops */}
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Award className="h-5 w-5" />
            </div>
            <h4 className="font-semibold text-gray-800">{t('insurance.eligibleCrops')}</h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{t('insurance.eligibleCropsDesc')}</p>
          <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
            <span className="rounded-md bg-cream-50 px-2.5 py-1 text-xs font-medium text-gray-700">Soybean</span>
            <span className="rounded-md bg-cream-50 px-2.5 py-1 text-xs font-medium text-gray-700">Cotton</span>
            <span className="rounded-md bg-cream-50 px-2.5 py-1 text-xs font-medium text-gray-700">Onion</span>
            <span className="rounded-md bg-cream-50 px-2.5 py-1 text-xs font-medium text-gray-700">Tomato</span>
            <span className="rounded-md bg-cream-50 px-2.5 py-1 text-xs font-medium text-gray-700">Pulses & Grains</span>
          </div>
        </Card>

        {/* Weather & Climate Hazards */}
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mustard-50 text-mustard-600">
              <CloudRain className="h-5 w-5" />
            </div>
            <h4 className="font-semibold text-gray-800">{t('insurance.weatherRisks')}</h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{t('insurance.weatherRisksDesc')}</p>
          <ul className="mt-3 space-y-1.5 text-xs text-gray-500 border-t border-gray-100 pt-3">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-mustard-600" /> Deficit rain / prolonged dry spell
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-mustard-600" /> Unseasonal heavy precipitation & flooding
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-mustard-600" /> Hailstorm and localized storm damage
            </li>
          </ul>
        </Card>

        {/* Claim Process & Helpline */}
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-soil-50 text-soil-600">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h4 className="font-semibold text-gray-800">{t('insurance.claimProcess')}</h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{t('insurance.claimProcessDesc')}</p>
          <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 text-xs">
            <div className="flex items-center justify-between text-gray-600">
              <span className="flex items-center gap-1.5"><PhoneCall className="h-3.5 w-3.5 text-brand-600" />{t('insurance.helpline')}</span>
              <span className="font-semibold text-brand-700">Toll-Free 24x7</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span className="flex items-center gap-1.5"><ExternalLink className="h-3.5 w-3.5 text-sky-600" />{t('insurance.pmfbyLink')}</span>
              <span className="font-medium text-gray-500">Kharif & Rabi</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Subsidized Premium Highlight Card */}
      <Card className="mb-6 p-4 bg-brand-50/50 border border-brand-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-brand-800">{t('insurance.premium')}</p>
            <p className="text-xs text-gray-600 mt-0.5">{t('insurance.premiumDesc')}</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => window.open('https://pmfby.gov.in', '_blank')}>
            <ExternalLink className="h-3.5 w-3.5 mr-1" /> {t('insurance.pmfbyLink')}
          </Button>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => navigate('/overview')}>
          <ArrowLeft className="h-4 w-4" /> {t('common.back')}
        </Button>
        <Button onClick={() => navigate('/advisory')} className="ml-auto">
          {t('market.continueToAdvisory')} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
