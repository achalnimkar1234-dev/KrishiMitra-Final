import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Sprout,
  Droplets,
  Search,
  ArrowLeft,
  Info,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Card, SectionTitle, Button, Badge } from '@/components/ui';
import { SubsidyCard } from '@/components/SubsidyCard';
import { useSession } from '@/components/SessionContext';
import { plots, crops } from '@/data/mockData';
import {
  governmentSubsidies,
  isSchemeRelevantToFarm,
} from '@/data/governmentSubsidies';
import type { SubsidyCategory, GovernmentSubsidy } from '@/types';
import { useTranslation } from '@/i18n/LanguageContext';

export function GovernmentSubsidyPage() {
  const navigate = useNavigate();
  const { selectedPlotId, selectedCrop } = useSession();
  const { t, language } = useTranslation();

  const [activeCategory, setActiveCategory] = useState<SubsidyCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedPlot = plots.find((p) => p.id === selectedPlotId);
  const crop = crops.find((c) => c.id === selectedCrop);

  // Filter schemes based on category and search query
  const filteredSchemes = governmentSubsidies.filter((scheme) => {
    // 1. Category filter
    if (activeCategory !== 'all' && scheme.category !== activeCategory) {
      return false;
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName =
        scheme.name.toLowerCase().includes(q) ||
        scheme.marathiName.toLowerCase().includes(q) ||
        scheme.hindiName.toLowerCase().includes(q);
      const matchDesc =
        scheme.shortDescription.toLowerCase().includes(q) ||
        scheme.benefit.toLowerCase().includes(q);
      const matchCrops = scheme.targetCrops?.some((c) => c.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchCrops) return false;
    }

    return true;
  });

  const relevantCount = governmentSubsidies.filter((s) =>
    isSchemeRelevantToFarm(s, selectedPlot, selectedCrop)
  ).length;

  return (
    <div className="space-y-6">
      <SectionTitle title={t('subsidy.title')} subtitle={t('subsidy.subtitle')} />

      {/* Plot Context Banner */}
      {selectedPlot && (
        <Card className="p-4 bg-gradient-to-r from-brand-50/70 to-cream-50/70 border border-brand-200">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600 flex-shrink-0" />
              <span className="font-semibold text-gray-800">
                Active Plot Context:
              </span>
              <span className="text-gray-600">
                {selectedPlot.id} ({selectedPlot.areaHectares} ha) • {selectedPlot.hasIrrigation ? 'Irrigated' : 'Rainfed'} • Water: {selectedPlot.waterReserve}
                {crop && ` • Crop: ${crop.name}`}
              </span>
            </div>
            <Badge color="green">
              {relevantCount} schemes recommended for your farm
            </Badge>
          </div>
        </Card>
      )}

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'all'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('subsidy.allCategories')} ({governmentSubsidies.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('inputs')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'inputs'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sprout className="h-3.5 w-3.5" />
            {t('subsidy.catInputs')}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('irrigation')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'irrigation'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Droplets className="h-3.5 w-3.5" />
            {t('subsidy.catIrrigation')}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('subsidy.searchPlaceholder')}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Scheme Cards Grid */}
      {filteredSchemes.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          <Building2 className="mx-auto h-8 w-8 text-gray-300 mb-2" />
          <p className="text-sm font-medium text-gray-700">{t('subsidy.noSchemesFound')}</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSchemes.map((scheme) => (
            <SubsidyCard
              key={scheme.id}
              scheme={scheme}
              isRelevant={isSchemeRelevantToFarm(scheme, selectedPlot, selectedCrop)}
            />
          ))}
        </div>
      )}

      {/* How to Apply Guidance Box */}
      <Card className="p-5 bg-cream-50/70 border border-gray-200">
        <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-brand-600" />
          Official Application Procedure via MahaDBT Portal
        </h4>
        <div className="grid gap-3 sm:grid-cols-4 text-xs text-gray-600 mt-3">
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-2xs">
            <span className="font-bold text-brand-700 block mb-1">Step 1: Registration</span>
            <p>Register using your 12-digit Aadhaar number and OTP on the official MahaDBT portal.</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-2xs">
            <span className="font-bold text-brand-700 block mb-1">Step 2: Choose Scheme</span>
            <p>Under 'Farmer Schemes', select Agriculture Department and choose your desired component.</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-2xs">
            <span className="font-bold text-brand-700 block mb-1">Step 3: Document Upload</span>
            <p>Upload 7/12 & 8-A land record, bank passbook, and authorized quotation where required.</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-2xs">
            <span className="font-bold text-brand-700 block mb-1">Step 4: DBT Subsidy</span>
            <p>Upon lottery selection and field verification, subsidy is directly credited to your Aadhaar-linked bank account.</p>
          </div>
        </div>
      </Card>

      {/* Official Government Portals Reference */}
      <Card className="p-4 bg-gray-50/80 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <Info className="h-4 w-4 text-brand-600 flex-shrink-0" />
            <span>{t('subsidy.officialPortalNotice')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open('https://mahadbt.maharashtra.gov.in/', '_blank')}
            >
              MahaDBT Portal <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open('https://krishi.maharashtra.gov.in/', '_blank')}
            >
              Krishi Vibhag <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open('https://www.mahadiscom.in/solar_mskpy/', '_blank')}
            >
              Solar MSKPY Portal <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Back Button */}
      <div>
        <Button variant="ghost" onClick={() => navigate('/overview')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> {t('common.back')}
        </Button>
      </div>
    </div>
  );
}
