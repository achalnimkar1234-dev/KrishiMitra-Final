import { useState, useEffect } from 'react';
import {
  Sun,
  Power,
  Zap,
  Droplets,
  Radio,
  Clock,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Building2,
  ArrowRight,
  RefreshCw,
  Info,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { Card, SectionTitle, Button, Badge } from '@/components/ui';
import { useToast } from '@/components/Toast';
import { useSession } from '@/components/SessionContext';
import { farmers, plots } from '@/data/mockData';
import { useTranslation } from '@/i18n/LanguageContext';

interface ActivityRecord {
  id: string;
  time: string;
  action: string;
  status: string;
}

export function SolarPumpPage() {
  const { farmerId, selectedPlotId } = useSession();
  const { t, language } = useTranslation();
  const { showToast } = useToast();

  const farmer = farmers.find((f) => f.id === farmerId);
  const selectedPlot = plots.find((p) => p.id === selectedPlotId) || plots[0];

  // Connection flow state (persisted in localStorage for smooth demo testing)
  const [isConnected, setIsConnected] = useState<boolean>(() => {
    return localStorage.getItem('km_pump_connected') === 'true';
  });

  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [selectedCompany, setSelectedCompany] = useState('Oswal');
  const [otp, setOtp] = useState(['1', '1', '1', '1', '1', '1']);
  const [connecting, setConnecting] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Pump control state
  const [isPumpOn, setIsPumpOn] = useState<boolean>(() => {
    const saved = localStorage.getItem('km_pump_status');
    return saved === null ? true : saved === 'true';
  });
  const [isSwitching, setIsSwitching] = useState(false);

  // Recent Activity Feed
  const [activities, setActivities] = useState<ActivityRecord[]>([
    {
      id: 'act-1',
      time: '02:10 PM',
      action: t('solarPump.actionSwitchedOn'),
      status: t('solarPump.statusSuccess'),
    },
    {
      id: 'act-2',
      time: '11:45 AM',
      action: t('solarPump.actionSwitchedOff'),
      status: t('solarPump.statusSuccess'),
    },
    {
      id: 'act-3',
      time: '08:30 AM',
      action: t('solarPump.actionSwitchedOn'),
      status: t('solarPump.statusSuccess'),
    },
    {
      id: 'act-4',
      time: '08:00 AM',
      action: t('solarPump.actionConnected'),
      status: t('solarPump.statusSuccess'),
    },
  ]);

  useEffect(() => {
    localStorage.setItem('km_pump_connected', isConnected ? 'true' : 'false');
  }, [isConnected]);

  useEffect(() => {
    localStorage.setItem('km_pump_status', isPumpOn ? 'true' : 'false');
  }, [isPumpOn]);

  // Handle OTP send
  const handleSendOtp = () => {
    if (!mobileNumber.trim() || mobileNumber.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    setStep('otp');
    setOtp(['1', '1', '1', '1', '1', '1']);
    setOtpError('');
    showToast('Demo OTP 111111 sent to ' + mobileNumber, 'info');
  };

  // Handle OTP verification & Connection
  const handleVerifyConnect = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp !== '111111') {
      setOtpError(t('solarPump.invalidOtp'));
      return;
    }
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setIsConnected(true);
      setStep('form');
      showToast('Solar pump connected successfully!', 'success');
    }, 600);
  };

  // Handle Disconnect
  const handleDisconnect = () => {
    setIsConnected(false);
    setStep('form');
    showToast('Pump disconnected from session', 'info');
  };

  // Toggle Pump Power
  const handleTogglePump = () => {
    setIsSwitching(true);
    const newStatus = !isPumpOn;

    setTimeout(() => {
      setIsPumpOn(newStatus);
      setIsSwitching(false);

      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const actionText = newStatus ? t('solarPump.actionSwitchedOn') : t('solarPump.actionSwitchedOff');

      setActivities((prev) => [
        {
          id: 'act-' + Date.now(),
          time: timeString,
          action: actionText,
          status: t('solarPump.statusSuccess'),
        },
        ...prev.slice(0, 5),
      ]);

      showToast(
        newStatus ? t('solarPump.switchedOnSuccess') : t('solarPump.switchedOffSuccess'),
        newStatus ? 'success' : 'info'
      );
    }, 600);
  };

  const companies = [
    { id: 'Oswal', name: 'Oswal Pumps' },
    { id: 'Shakti', name: 'Shakti Pumps' },
    { id: 'CRI', name: 'CRI Pumps' },
    { id: 'Kirloskar', name: 'Kirloskar Brothers' },
    { id: 'Other', name: 'Other PM-KUSUM Approved Brand' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-120px)] -m-4 md:-m-6 p-4 md:p-6 pb-12 overflow-hidden">
      {/* 1. Full-width responsive solar pump agricultural background */}
      <div
        className="absolute inset-0 bg-cover bg-[center_20%] bg-no-repeat pointer-events-none select-none"
        style={{ backgroundImage: "url('/solar-pump-bg.jpg')" }}
      />

      {/* 2. Soft translucent gradient overlay matching KrishiMitra cream-100 theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-100/75 via-cream-100/85 to-cream-100/95 backdrop-blur-[1px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-cream-100/80 via-transparent to-cream-100/80 pointer-events-none" />

      {/* 3. Primary Page Content Layer (elevated above background) */}
      <div className="relative z-10 space-y-6">
        <SectionTitle title={t('solarPump.title')} subtitle={t('solarPump.subtitle')} />

        {/* Concept & Demo Notice Banner */}
        <Card className="p-4 bg-gradient-to-r from-amber-50/90 via-cream-50/90 to-emerald-50/85 border border-amber-200/90 backdrop-blur-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5 max-w-3xl">
              <Sun className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {t('solarPump.conceptDesc')}
                </p>
                <p className="text-gray-600 mt-0.5 text-xs">
                  {t('solarPump.manufacturerNote')}
                </p>
              </div>
            </div>
            <Badge color="yellow" className="font-medium">
              <Info className="h-3 w-3 mr-1" /> {t('solarPump.demoNotice')}
            </Badge>
          </div>
        </Card>

      {!isConnected ? (
        /* ────────────────── 1. CONNECT PUMP SECTION ────────────────── */
        <div className="grid gap-6 md:grid-cols-2">
          {/* Connection Card */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Sun className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-base">
                  {t('solarPump.connectTitle')}
                </h3>
                <p className="text-xs text-gray-500">
                  {t('solarPump.connectSubtitle')}
                </p>
              </div>
            </div>

            {step === 'form' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t('solarPump.mobileNumber')}
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder={t('solarPump.mobilePlaceholder')}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t('solarPump.selectCompany')}
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <select
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <Button onClick={handleSendOtp} className="w-full">
                    {t('solarPump.sendOtp')} <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t('solarPump.enterOtp')}
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    {t('solarPump.otpSentTo')}: <span className="font-semibold text-gray-700">{mobileNumber}</span>
                  </p>

                  <div className="flex justify-center gap-2 mb-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value;
                          const next = [...otp];
                          next[i] = val;
                          setOtp(next);
                        }}
                        className="h-11 w-11 rounded-lg border border-gray-300 text-center text-lg font-bold text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <Badge color="yellow">{t('solarPump.demoOtpHint')}</Badge>
                  </div>

                  {otpError && (
                    <p className="text-xs text-red-600 text-center mt-2">{otpError}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep('form')}
                    className="flex-1"
                  >
                    {t('solarPump.changeDetails')}
                  </Button>
                  <Button
                    onClick={handleVerifyConnect}
                    disabled={connecting}
                    className="flex-1"
                  >
                    {connecting ? t('solarPump.verifying') : t('solarPump.verifyConnect')}
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* How It Works Explainer */}
          <Card className="p-6 bg-cream-50/70 border border-gray-200">
            <h3 className="font-semibold text-gray-900 text-base mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-600" />
              {t('solarPump.howItWorks')}
            </h3>
            <div className="space-y-3 text-xs text-gray-700">
              <div className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-gray-100 shadow-2xs">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-[11px]">
                  1
                </span>
                <p>{t('solarPump.step1')}</p>
              </div>
              <div className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-gray-100 shadow-2xs">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-[11px]">
                  2
                </span>
                <p>{t('solarPump.step2')}</p>
              </div>
              <div className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-gray-100 shadow-2xs">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-[11px]">
                  3
                </span>
                <p>{t('solarPump.step3')}</p>
              </div>
              <div className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-gray-100 shadow-2xs">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-[11px]">
                  4
                </span>
                <p>{t('solarPump.step4')}</p>
              </div>
              <div className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-gray-100 shadow-2xs">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-[11px]">
                  5
                </span>
                <p>{t('solarPump.step5')}</p>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        /* ────────────────── 2. CONNECTED PUMP DASHBOARD ────────────────── */
        <div className="space-y-6">
          {/* Main Pump Status & Control Card */}
          <Card className="p-6 border-brand-200">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Sun className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {selectedCompany} Solar Submersible Pump (5 HP)
                    </h3>
                    <Badge color="green" className="flex items-center gap-1 text-[11px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      {t('solarPump.connectedOnline')}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t('solarPump.pumpId')}: <span className="font-mono font-medium text-gray-700">OSW-DEMO-001</span> • {t('solarPump.location')}: {farmer?.village || 'Demo Village'}, Panhala, Kolhapur
                  </p>
                </div>
              </div>

              <Button size="sm" variant="ghost" onClick={handleDisconnect} className="text-xs text-gray-500 hover:text-red-600">
                {t('solarPump.disconnect')}
              </Button>
            </div>

            {/* Prominent ON / OFF Control Panel */}
            <div className="grid gap-6 lg:grid-cols-12 items-center bg-gradient-to-r from-gray-50 via-cream-50 to-gray-50 p-6 rounded-2xl border border-gray-200">
              <div className="lg:col-span-7 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                {/* Glowing status circle indicator */}
                <div
                  className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full transition-all duration-500 shadow-md ${
                    isPumpOn
                      ? 'bg-emerald-500 text-white ring-8 ring-emerald-100 shadow-emerald-200'
                      : 'bg-gray-300 text-gray-600 ring-8 ring-gray-100'
                  }`}
                >
                  <Power className={`h-9 w-9 ${isPumpOn ? 'animate-pulse' : ''}`} />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {t('solarPump.pumpStatus')}
                  </span>
                  <h4
                    className={`text-2xl font-extrabold mt-0.5 tracking-tight ${
                      isPumpOn ? 'text-emerald-700' : 'text-gray-700'
                    }`}
                  >
                    {isPumpOn ? t('solarPump.statusOn') : t('solarPump.statusOff')}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 flex items-center justify-center sm:justify-start gap-2">
                    <Droplets className={`h-4 w-4 ${isPumpOn ? 'text-sky-500 animate-bounce' : 'text-gray-400'}`} />
                    <span>
                      {isPumpOn ? 'Pumping water at ~180 L/min' : 'Water discharge stopped'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Large Action Button */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <button
                  type="button"
                  onClick={handleTogglePump}
                  disabled={isSwitching}
                  className={`flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md active:scale-98 ${
                    isPumpOn
                      ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 ring-2 ring-emerald-400 ring-offset-2'
                  }`}
                >
                  {isSwitching ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      {isPumpOn ? t('solarPump.turningOff') : t('solarPump.turningOn')}
                    </>
                  ) : (
                    <>
                      <Power className="h-5 w-5" />
                      {isPumpOn ? t('solarPump.turnOff') : t('solarPump.turnOn')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </Card>

          {/* Telemetry Information Cards */}
          <div>
            <h4 className="font-semibold text-gray-900 text-base mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand-600" />
              {t('solarPump.pumpInfo')}
            </h4>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <Sun className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('solarPump.solarGeneration')}</p>
                    <p className="text-base font-bold text-gray-900 mt-0.5">18.4 kWh</p>
                    <p className="text-[11px] text-emerald-600">Peak radiation (850 W/m²)</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('solarPump.capacity')}</p>
                    <p className="text-base font-bold text-gray-900 mt-0.5">5 HP (3.7 kW)</p>
                    <p className="text-[11px] text-gray-500">AC Submersible Motor</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('solarPump.operatingDuration')}</p>
                    <p className="text-base font-bold text-gray-900 mt-0.5">3 hrs 45 mins</p>
                    <p className="text-[11px] text-gray-500">Since 08:30 AM</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                    <Radio className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('solarPump.signalStrength')}</p>
                    <p className="text-base font-bold text-gray-900 mt-0.5">{t('solarPump.goodSignal')}</p>
                    <p className="text-[11px] text-gray-500">RMS SIM: 8991...4521</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Recent Activity Table */}
          <Card className="p-5">
            <h4 className="font-semibold text-gray-900 text-base mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-600" />
              {t('solarPump.recentActivity')}
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="pb-2 font-medium">{t('solarPump.time')}</th>
                    <th className="pb-2 font-medium">{t('solarPump.action')}</th>
                    <th className="pb-2 font-medium text-right">{t('solarPump.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {activities.map((act) => (
                    <tr key={act.id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 font-medium text-gray-500">{act.time}</td>
                      <td className="py-2.5 font-semibold text-gray-900">{act.action}</td>
                      <td className="py-2.5 text-right">
                        <Badge color="green" className="font-medium text-[10px]">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> {act.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}
