import { useNavigate } from 'react-router-dom';
import { Users, MapPin, FlaskConical, Sprout, ShieldCheck, Bookmark, ArrowRight, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { Card, SectionTitle, Button, Badge } from '@/components/ui';
import { adminStats } from '@/data/mockData';
import { useTranslation } from '@/i18n/LanguageContext';

export function AdminDemoPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const formatRupee = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  const stats = [
    { icon: Users, label: 'Demo farmers', value: adminStats.demoFarmers, color: 'text-brand-600 bg-brand-50' },
    { icon: MapPin, label: 'Demo plots', value: adminStats.demoPlots, color: 'text-soil-600 bg-soil-50' },
    { icon: FlaskConical, label: 'Soil reports processed', value: adminStats.soilReportsProcessed, color: 'text-sky-600 bg-sky-50' },
    { icon: Sprout, label: 'Crop decisions generated', value: adminStats.cropDecisionsGenerated, color: 'text-brand-600 bg-brand-50' },
    { icon: ShieldCheck, label: 'Insurance queries', value: adminStats.cropInsuranceInquiries, color: 'text-soil-600 bg-soil-50' },
    { icon: Bookmark, label: 'Saved advisories', value: adminStats.savedAdvisories, color: 'text-mustard-600 bg-mustard-50' },
  ];

  const pipeline = ['Farmer ID', 'Plot', 'Soil', 'Crop', 'Suitability', 'Market', 'Advisory'];

  return (
    <div>
      <SectionTitle
        title="Admin / Judge overview"
        subtitle="Prototype demonstration metrics — all values are synthetic."
      />

      {/* Stat cards */}
      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-semibold text-gray-800">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Secondary metrics */}
      <div className="mb-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Sprout className="h-4 w-4 text-brand-600" /> Most selected crops
          </h3>
          <div className="space-y-2">
            {adminStats.mostSelectedCrops.map((c) => (
              <div key={c.crop} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{c.crop}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-brand-400" style={{ width: `${(c.count / 4) * 100}%` }} />
                  </div>
                  <span className="font-medium text-gray-700">{c.count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <TrendingUp className="h-4 w-4 text-brand-600" /> Averages
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Average suitability score</span>
              <span className="font-semibold text-brand-700">{adminStats.averageSuitabilityScore}/100</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Average estimated profit</span>
              <span className="font-semibold text-brand-700">{formatRupee(adminStats.averageEstimatedProfit)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <AlertTriangle className="h-4 w-4 text-mustard-600" /> Risk distribution
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Medium/high-risk decisions</span>
              <Badge color="yellow">{adminStats.mediumHighRiskDecisions}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total decisions</span>
              <span className="font-semibold text-gray-700">{adminStats.cropDecisionsGenerated}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Risk rate</span>
              <span className="font-semibold text-mustard-700">{Math.round((adminStats.mediumHighRiskDecisions / adminStats.cropDecisionsGenerated) * 100)}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Pipeline diagram */}
      <Card className="mb-5 p-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">Demo flow pipeline</h3>
        <div className="flex flex-wrap items-center gap-2">
          {pipeline.map((step, i, arr) => (
            <div key={step} className="flex items-center gap-2">
              <div className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-medium text-brand-700">
                {step}
              </div>
              {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-gray-300" />}
            </div>
          ))}
        </div>
      </Card>

      {/* Technical note */}
      <Card className="mb-5 border-l-4 border-l-sky-400 bg-sky-50 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 flex-shrink-0 text-sky-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-800">Technical note</p>
            <p className="text-sm text-gray-600">Current prototype integrates soil health, water availability, and market estimates with government crop insurance schemas. Production deployment would connect with PMFBY and Soil Health Card APIs.</p>
          </div>
        </div>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate('/login')}>{t('common.back')}</Button>
        <Button onClick={() => navigate('/overview')} className="ml-auto">{t('overview.title')}</Button>
      </div>
    </div>
  );
}
