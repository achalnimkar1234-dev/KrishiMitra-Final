import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, IndianRupee, MapPin, Info, Building2, HelpCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card, SectionTitle, Button, Badge, Loading } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { StepProgress } from '@/components/StepProgress';
import { useSession } from '@/components/SessionContext';
import { getMarketData, getApmcs } from '@/services/api';
import { crops } from '@/data/mockData';
import type { MarketData, ApmcMarket } from '@/types';
import { useTranslation } from '@/i18n/LanguageContext';

export function MarketPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedPlotId, selectedCrop } = useSession();
  const [market, setMarket] = useState<MarketData | null>(null);
  const [apmcs, setApmcs] = useState<ApmcMarket[]>([]);
  const [selectedApmc, setSelectedApmc] = useState<ApmcMarket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedPlotId) {
      navigate('/plots');
      return;
    }
    (async () => {
      setLoading(true);
      const [m, a] = await Promise.all([
        getMarketData(selectedCrop || 'soybean', selectedPlotId),
        getApmcs(selectedPlotId),
      ]);
      setMarket(m);
      setApmcs(a);
      setLoading(false);
    })();
  }, [selectedPlotId, selectedCrop, navigate]);

  if (loading) return <Loading label={t('market.loading')} />;
  if (!market) return <div className="py-12 text-center text-gray-500">{t('market.noData')}</div>;

  const formatRupee = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  const crop = crops.find((c) => c.id === (selectedCrop || 'soybean'));
  const localizedCropName = t(`cropNames.${market.cropId}`) || market.cropName;

  return (
    <div>
      <StepProgress current={5} />
      <SectionTitle
        title={t('market.title')}
        subtitle={`${t('market.crop')}: ${localizedCropName} ${crop?.marathiName ? `(${crop.marathiName})` : ''}`}
      />

      {/* 1. Four Top Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: MSP / Market Price */}
        <Card className="p-4 border-l-4 border-l-brand-600 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium">
              {market.hasMsp ? t('market.mspValue') : t('market.marketPrice')}
            </p>
            {market.hasMsp ? (
              <Badge color="green">Govt MSP</Badge>
            ) : (
              <Badge color="yellow">Market Rate</Badge>
            )}
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-800">
            {market.hasMsp && market.mspValue ? formatRupee(market.mspValue) : formatRupee(market.marketPrice)}
            <span className="text-xs font-normal text-gray-400">/{t('market.perQuintal')}</span>
          </p>
          <p className="mt-1 text-xs text-brand-700 font-medium truncate">
            {market.hasMsp ? market.season : t('market.noMsp')}
          </p>
        </Card>

        {/* Card 2: Est. Yield */}
        <Card className="p-4 border-l-4 border-l-sky-500 bg-white">
          <p className="text-xs text-gray-400 font-medium">{t('market.estYield')}</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">
            {market.estYield} <span className="text-xs font-normal text-gray-500">quintal/ha</span>
          </p>
          <p className="mt-1 text-xs text-sky-700 font-medium">
            {market.district} district average
          </p>
        </Card>

        {/* Card 3: Est. Production */}
        <Card className="p-4 border-l-4 border-l-mustard-500 bg-white">
          <p className="text-xs text-gray-400 font-medium">{t('market.estProduction')}</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">
            {market.estProduction} <span className="text-xs font-normal text-gray-500">quintals</span>
          </p>
          <p className="mt-1 text-xs text-mustard-700 font-medium">
            For {market.plotArea} ha plot
          </p>
        </Card>

        {/* Card 4: Estimated Gross Value */}
        <Card className="p-4 border-l-4 border-l-emerald-600 bg-emerald-50/30">
          <p className="text-xs text-gray-500 font-medium">
            {t('market.estGrossValue')}
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-800">
            {formatRupee(market.estGrossValue)}
          </p>
          <p className="mt-1 text-xs text-emerald-700 font-medium">
            {t('market.estGrossValue')}
          </p>
        </Card>
      </div>

      {/* 2. Profitability Estimate Breakdown Table */}
      <Card className="mb-6 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800 text-base">
            <IndianRupee className="h-5 w-5 text-brand-600" />
            {t('market.profitabilityEstimate')}
          </h3>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
            {market.district} • {market.plotArea} ha
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-semibold text-gray-500 bg-gray-50/70">
                <th className="py-2.5 px-4 rounded-l-lg">{t('market.item')}</th>
                <th className="py-2.5 px-4 text-right rounded-r-lg">{t('market.estimate')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 px-4 text-gray-600">{t('market.crop')}</td>
                <td className="py-3 px-4 text-right font-medium text-gray-800">
                  {localizedCropName} {crop?.marathiName ? `(${crop.marathiName})` : ''}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">{t('market.plotArea')}</td>
                <td className="py-3 px-4 text-right font-medium text-gray-800">{market.plotArea} ha</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">{t('market.district')}</td>
                <td className="py-3 px-4 text-right font-medium text-gray-800">{market.district}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">{t('market.estYield')}</td>
                <td className="py-3 px-4 text-right font-medium text-gray-800">
                  {market.estYield} quintal/ha
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">{t('market.estProduction')}</td>
                <td className="py-3 px-4 text-right font-semibold text-gray-800">
                  {market.estProduction} quintals <span className="text-xs text-gray-400 font-normal">({market.estYield} q/ha × {market.plotArea} ha)</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">{t('market.mspOrPrice')}</td>
                <td className="py-3 px-4 text-right font-medium text-gray-800">
                  {market.hasMsp && market.mspValue ? (
                    <span className="text-brand-700 font-semibold">
                      {formatRupee(market.mspValue)}/quintal <span className="text-xs text-gray-500 font-normal">({market.season})</span>
                    </span>
                  ) : (
                    <span className="text-amber-700 font-semibold">
                      {formatRupee(market.marketPrice)}/quintal <span className="text-xs text-gray-400 font-normal">({t('market.noMsp')})</span>
                    </span>
                  )}
                </td>
              </tr>
              <tr className="bg-brand-50/60 font-semibold text-brand-900">
                <td className="py-3.5 px-4 text-brand-900 font-semibold">{t('market.estGrossValue')}</td>
                <td className="py-3.5 px-4 text-right text-lg font-bold text-brand-700">
                  {formatRupee(market.estGrossValue)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* 3. How this is calculated Card */}
      <Card className="mb-6 p-5 bg-gradient-to-r from-cream-50/70 to-white border border-gray-200">
        <h4 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-gray-800">
          <HelpCircle className="h-4 w-4 text-brand-600" />
          {t('market.howCalculated')}
        </h4>
        <div className="grid gap-2 text-xs text-gray-600 sm:grid-cols-2">
          <div className="rounded-lg bg-white p-3 border border-gray-100 shadow-2xs">
            <span className="font-semibold text-gray-700 block mb-1">1. {t('market.estProduction')}</span>
            <p>{t('market.calcProductionFormula')}</p>
            <p className="mt-1 text-gray-400 font-mono">({market.estYield} q/ha × {market.plotArea} ha = {market.estProduction} q)</p>
          </div>
          <div className="rounded-lg bg-white p-3 border border-gray-100 shadow-2xs">
            <span className="font-semibold text-gray-700 block mb-1">2. {t('market.estGrossValue')}</span>
            <p>{market.hasMsp ? t('market.calcGrossFormula') : t('market.calcGrossFormula')}</p>
            <p className="mt-1 text-gray-400 font-mono">
              ({market.estProduction} q × {formatRupee(market.hasMsp && market.mspValue ? market.mspValue : market.marketPrice)} = {formatRupee(market.estGrossValue)})
            </p>
          </div>
        </div>
      </Card>

      {/* 4. Nearest Agricultural Produce Market Committees (APMCs) */}
      <div className="mb-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-gray-800 text-base">
              <Building2 className="h-5 w-5 text-brand-600" />
              {t('market.nearestApmcs')}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Agricultural Produce Market Committee (APMC) yards serving {market.district} district
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => navigate('/map')}>
            <MapPin className="h-3.5 w-3.5 mr-1" /> {t('market.viewNearby')}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {apmcs.map((apmc) => (
            <Card key={apmc.id} className="p-4 hover:shadow-cardhover transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 font-semibold text-xs">
                    APMC
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                    <MapPin className="h-3 w-3 text-brand-600" />
                    {t('market.approxDistance')}: {apmc.distanceKm} km
                  </span>
                </div>

                <h4 className="mt-2.5 font-semibold text-gray-800 text-sm leading-snug">{apmc.name}</h4>
                {apmc.marathiName && (
                  <p className="text-xs text-brand-600 font-normal mt-0.5">{apmc.marathiName}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{apmc.location}</p>

                <div className="mt-3 border-t border-gray-100 pt-2.5 text-xs">
                  <span className="font-medium text-gray-700 block mb-0.5">{t('market.majorCommodities')}:</span>
                  <p className="text-gray-500 line-clamp-2">{apmc.majorCommodities}</p>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">e-NAM Enabled</span>
                <Button size="sm" variant="outline" onClick={() => setSelectedApmc(apmc)}>
                  {t('market.viewDetails')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. Official Data Source Citation & Farmer Disclaimer */}
      <Card className="mb-6 p-4 bg-gray-50/70 border border-gray-200">
        <div className="space-y-1.5 text-xs text-gray-500">
          <p className="flex items-center gap-1.5 font-medium text-gray-700">
            <ShieldCheck className="h-4 w-4 text-brand-600 flex-shrink-0" />
            {t('market.sourceMsp')}
          </p>
          <p className="flex items-center gap-1.5 font-medium text-gray-700">
            <CheckCircle2 className="h-4 w-4 text-sky-600 flex-shrink-0" />
            {t('market.sourceYield')}
          </p>
          <p className="text-[11px] text-gray-400 pt-1 border-t border-gray-200/60 leading-relaxed">
            {t('market.priceDisclaimer')}
          </p>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => navigate('/suitability')}>
          <ArrowLeft className="h-4 w-4" /> {t('common.back')}
        </Button>
        <Button variant="outline" onClick={() => navigate('/map')}>
          <MapPin className="h-4 w-4" /> {t('market.viewNearby')}
        </Button>
        <Button onClick={() => navigate('/advisory')} className="ml-auto">
          {t('market.continueToAdvisory')} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* APMC Details Modal */}
      {selectedApmc && (
        <Modal
          open={!!selectedApmc}
          onClose={() => setSelectedApmc(null)}
          title={selectedApmc.name}
          footer={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedApmc(null)}>
                {t('common.close')}
              </Button>
              <Button onClick={() => { setSelectedApmc(null); navigate('/map'); }}>
                <MapPin className="h-4 w-4 mr-1" /> {t('market.viewNearby')}
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-gray-400 font-medium">Regional Name</p>
              <p className="font-semibold text-brand-700 text-base">{selectedApmc.marathiName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Market Location</p>
              <p className="text-gray-700">{selectedApmc.location}, {selectedApmc.district} District</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Approximate Distance</p>
              <p className="text-gray-700 font-medium">{selectedApmc.distanceKm} km from your plot</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Major Commodities Traded</p>
              <p className="text-gray-700">{selectedApmc.majorCommodities}</p>
              {selectedApmc.marathiCommodities && (
                <p className="text-xs text-brand-600 mt-0.5">({selectedApmc.marathiCommodities})</p>
              )}
            </div>
            <div className="rounded-lg bg-cream-50 p-3 text-xs text-gray-600">
              <p className="font-medium text-gray-700">Market Operational Hours</p>
              <p>Trading & Auctions: Mon–Sat, 08:00 AM – 05:00 PM</p>
              <p>Payment: Same-day RTGS / Direct Bank Transfer under APMC norms</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

