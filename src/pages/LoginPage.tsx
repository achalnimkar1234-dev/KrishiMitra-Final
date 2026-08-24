import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowRight, Shield, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui';
import { ToastProvider, useToast } from '@/components/Toast';
import { useSession } from '@/components/SessionContext';
import { getFarmer } from '@/services/api';
import type { Language } from '@/types';

// ─── Lightweight inline translations for login (before full i18n loads) ───

const loginText: Record<Language, {
  welcomeTitle: string;
  welcomeSubtitle: string;
  tagline: string;
  aadhaarNumber: string;
  aadhaarPlaceholder: string;
  sendOtp: string;
  invalidAadhaar: string;
  aadhaarRequired: string;
  verifyMobile: string;
  otpInstructions: string;
  otpSentTo: string;
  verifyAndContinue: string;
  verifying: string;
  resendOtp: string;
  changeAadhaar: string;
  invalidOtp: string;
  otpResent: string;
  otpRequired: string;
  resendIn: string;
  seconds: string;
  signingIn: string;
  loginSuccess: string;
  preferredLanguage: string;
}> = {
  english: {
    welcomeTitle: 'Welcome to KrishiMitra',
    welcomeSubtitle: 'Your intelligent farming companion, from soil information to farm action.',
    tagline: 'From soil information to farm action',
    aadhaarNumber: 'Aadhaar Number',
    aadhaarPlaceholder: 'Enter 12-digit Aadhaar number',
    sendOtp: 'Send OTP',
    invalidAadhaar: 'Please enter a valid 12-digit Aadhaar number.',
    aadhaarRequired: 'Aadhaar number is required.',
    verifyMobile: 'Verify your mobile number',
    otpInstructions: 'Enter the 6-digit OTP sent to your registered mobile number.',
    otpSentTo: 'OTP sent to your registered mobile number',
    verifyAndContinue: 'Verify & Continue',
    verifying: 'Verifying...',
    resendOtp: 'Resend OTP',
    changeAadhaar: '← Change Aadhaar number',
    invalidOtp: 'Invalid OTP. Please enter the correct 6-digit OTP.',
    otpResent: 'OTP resent successfully.',
    otpRequired: 'Please enter the 6-digit OTP.',
    resendIn: 'Resend OTP in',
    seconds: 'seconds',
    signingIn: 'Signing in...',
    loginSuccess: 'Login successful. Welcome to KrishiMitra.',
    preferredLanguage: 'Preferred Language',
  },
  marathi: {
    welcomeTitle: 'कृषिमित्रामध्ये आपले स्वागत',
    welcomeSubtitle: 'मातीच्या माहितीपासून शेतीच्या कृतीपर्यंत — तुमचा हुशार शेती सोबती.',
    tagline: 'मातीच्या माहितीपासून शेतीच्या कृतीपर्यंत',
    aadhaarNumber: 'आधार क्रमांक',
    aadhaarPlaceholder: '१२ अंकी आधार क्रमांक टाका',
    sendOtp: 'OTP पाठवा',
    invalidAadhaar: 'कृपया वैध १२ अंकी आधार क्रमांक टाका.',
    aadhaarRequired: 'आधार क्रमांक आवश्यक आहे.',
    verifyMobile: 'तुमचा मोबाईल क्रमांक सत्यापित करा',
    otpInstructions: 'तुमच्या नोंदणीकृत मोबाईल क्रमांकावर पाठवलेला ६ अंकी OTP टाका.',
    otpSentTo: 'तुमच्या नोंदणीकृत मोबाईल क्रमांकावर OTP पाठवला',
    verifyAndContinue: 'सत्यापित करा आणि पुढे जा',
    verifying: 'सत्यापन होत आहे...',
    resendOtp: 'OTP पुन्हा पाठवा',
    changeAadhaar: '← आधार क्रमांक बदला',
    invalidOtp: 'चुकीचा OTP. कृपया योग्य ६ अंकी OTP टाका.',
    otpResent: 'OTP पुन्हा पाठवला.',
    otpRequired: 'कृपया ६ अंकी OTP टाका.',
    resendIn: 'OTP पुन्हा पाठवा',
    seconds: 'सेकंदांत',
    signingIn: 'लॉगिन होत आहे...',
    loginSuccess: 'लॉगिन यशस्वी. कृषिमित्रामध्ये स्वागत.',
    preferredLanguage: 'भाषा निवडा',
  },
  hindi: {
    welcomeTitle: 'कृषिमित्र में आपका स्वागत है',
    welcomeSubtitle: 'मिट्टी की जानकारी से खेती की कार्रवाई तक — आपका बुद्धिमान कृषि साथी.',
    tagline: 'मिट्टी की जानकारी से खेती की कार्रवाई तक',
    aadhaarNumber: 'आधार नंबर',
    aadhaarPlaceholder: '12 अंकों का आधार नंबर दर्ज करें',
    sendOtp: 'OTP भेजें',
    invalidAadhaar: 'कृपया एक वैध 12 अंकों का आधार नंबर दर्ज करें.',
    aadhaarRequired: 'आधार नंबर आवश्यक है.',
    verifyMobile: 'अपना मोबाइल नंबर सत्यापित करें',
    otpInstructions: 'आपके पंजीकृत मोबाइल नंबर पर भेजा गया 6 अंकों का OTP दर्ज करें.',
    otpSentTo: 'आपके पंजीकृत मोबाइल नंबर पर OTP भेजा गया',
    verifyAndContinue: 'सत्यापित करें और आगे बढ़ें',
    verifying: 'सत्यापन हो रहा है...',
    resendOtp: 'OTP दोबारा भेजें',
    changeAadhaar: '← आधार नंबर बदलें',
    invalidOtp: 'गलत OTP. कृपया सही 6 अंकों का OTP दर्ज करें.',
    otpResent: 'OTP दोबारा भेजा गया.',
    otpRequired: 'कृपया 6 अंकों का OTP दर्ज करें.',
    resendIn: 'OTP दोबारा भेजें',
    seconds: 'सेकंड में',
    signingIn: 'लॉगिन हो रहा है...',
    loginSuccess: 'लॉगिन सफल. कृषिमित्र में स्वागत है.',
    preferredLanguage: 'भाषा चुनें',
  },
};

const CORRECT_OTP = '111111';
const MASKED_PHONE = '••••••4321';

// ─── Aadhaar formatting helpers ───

function formatAadhaar(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(0, 12);
  if (d.length <= 4) return d;
  if (d.length <= 8) return `${d.slice(0, 4)} ${d.slice(4)}`;
  return `${d.slice(0, 4)} ${d.slice(4, 8)} ${d.slice(8)}`;
}

function rawDigits(formatted: string): string {
  return formatted.replace(/\D/g, '');
}

// ─── Main Login Component ───

function LoginInner() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setFarmerId, setFarmer, setLanguage, language, setSelectedPlotId } = useSession();

  const [step, setStep] = useState<'aadhaar' | 'otp'>('aadhaar');
  const [aadhaarDisplay, setAadhaarDisplay] = useState('');
  const [aadhaarError, setAadhaarError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [selectedLang, setSelectedLang] = useState<Language>(language);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const aadhaarRef = useRef<HTMLInputElement>(null);

  const t = loginText[selectedLang];

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // ─── Aadhaar handlers ───

  const handleAadhaarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
    setAadhaarDisplay(formatAadhaar(digits));
    if (aadhaarError) setAadhaarError('');
  };

  const handleAadhaarKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Allow navigation, delete, backspace
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
    if (allowed.includes(e.key)) return;
    // Allow Ctrl+A, Ctrl+C, Ctrl+V etc
    if (e.ctrlKey || e.metaKey) return;
    // Only allow digits
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }
    // Prevent more than 12 digits
    const currentDigits = rawDigits(aadhaarDisplay);
    if (currentDigits.length >= 12 && !e.currentTarget.selectionStart) {
      e.preventDefault();
    }
  };

  const handleSendOtp = () => {
    const digits = rawDigits(aadhaarDisplay);
    if (digits.length === 0) {
      setAadhaarError(t.aadhaarRequired);
      return;
    }
    if (digits.length < 12) {
      setAadhaarError(t.invalidAadhaar);
      return;
    }
    // Update language in session
    setLanguage(selectedLang);
    setStep('otp');
    setCountdown(30);
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  // ─── OTP handlers ───

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (otpError) setOtpError('');

    // Auto-advance to next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 0) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || '';
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setOtpError(t.otpRequired);
      return;
    }
    if (enteredOtp !== CORRECT_OTP) {
      setOtpError(t.invalidOtp);
      return;
    }
    // OTP is correct — log in with mock farmer
    setSubmitting(true);
    try {
      const farmer = await getFarmer('MH-DEMO-FR-0001');
      if (farmer) {
        setFarmerId('MH-DEMO-FR-0001');
        setFarmer({ ...farmer, language: selectedLang });
        setLanguage(selectedLang);
        // Pre-select the recommended demo plot
        setSelectedPlotId('MH-DEMO-PLOT-0001');
      }
      showToast(t.loginSuccess, 'success');
      navigate('/overview');
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = () => {
    setCountdown(30);
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    showToast(t.otpResent, 'info');
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleChangeAadhaar = () => {
    setStep('aadhaar');
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    setCountdown(0);
    setTimeout(() => aadhaarRef.current?.focus(), 100);
  };

  const handleLanguageChange = (lang: Language) => {
    setSelectedLang(lang);
    // Don't update session language yet — only on OTP send
  };

  // ─── Render ───

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-8"
      style={{ backgroundImage: "url('/login-bg.jpg')" }}
    >
      {/* Subtle translucent overlay: balances image visibility with pristine text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900/25 via-cream-50/75 to-cream-100/85 backdrop-blur-[1.5px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Welcome */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg ring-4 ring-white/60">
            <Sprout className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-brand-900 drop-shadow-xs">
            KrishiMitra
          </h1>
          <h2 className="mt-2 font-serif text-lg font-semibold text-gray-900">
            {t.welcomeTitle}
          </h2>
          <p className="mt-1 max-w-xs text-sm font-medium text-gray-700">
            {t.welcomeSubtitle}
          </p>
        </div>

        {/* Language selector */}
        <div className="mb-5 flex items-center justify-center gap-1.5">
          {([
            { key: 'english' as Language, label: 'English' },
            { key: 'marathi' as Language, label: 'मराठी' },
            { key: 'hindi' as Language, label: 'हिन्दी' },
          ]).map((lang) => (
            <button
              key={lang.key}
              onClick={() => handleLanguageChange(lang.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all shadow-xs ${
                selectedLang === lang.key
                  ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-300'
                  : 'bg-white/90 text-gray-700 hover:bg-white hover:text-brand-700 border border-gray-200/80 backdrop-blur-xs'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-white/80 bg-white/95 p-6 md:p-7 shadow-xl backdrop-blur-md">
          {step === 'aadhaar' ? (
            <>
              {/* Aadhaar Input Step */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-5 w-5 text-brand-600" />
                  <h3 className="font-semibold text-gray-800">{t.aadhaarNumber}</h3>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {t.aadhaarNumber}
                  </label>
                  <input
                    ref={aadhaarRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={aadhaarDisplay}
                    onChange={handleAadhaarChange}
                    onKeyDown={handleAadhaarKeyDown}
                    placeholder={t.aadhaarPlaceholder}
                    className={`w-full rounded-lg border px-3 py-2.5 text-base tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white ${
                      aadhaarError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    maxLength={14} // 12 digits + 2 spaces
                  />
                  {aadhaarError && (
                    <p className="mt-1.5 text-xs text-red-600">{aadhaarError}</p>
                  )}
                </div>

                <Button
                  type="button"
                  size="lg"
                  onClick={handleSendOtp}
                  className="w-full shadow-md"
                >
                  {t.sendOtp} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* OTP Verification Step */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone className="h-5 w-5 text-brand-600" />
                  <h3 className="font-semibold text-gray-800">{t.verifyMobile}</h3>
                </div>
                <p className="mt-1 text-sm text-gray-600">{t.otpInstructions}</p>
                <p className="mt-2 text-xs text-gray-500 font-medium">
                  {t.otpSentTo} {MASKED_PHONE}
                </p>
              </div>

              {/* OTP boxes */}
              <div className="mb-4 flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`h-12 w-12 rounded-lg border text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white ${
                      otpError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>

              {otpError && (
                <p className="mb-3 text-center text-xs text-red-600">{otpError}</p>
              )}

              <Button
                type="button"
                size="lg"
                onClick={handleVerify}
                disabled={submitting}
                className="w-full mb-4 shadow-md"
              >
                {submitting ? t.verifying : <>{t.verifyAndContinue} <ArrowRight className="h-4 w-4" /></>}
              </Button>

              {/* Resend & Change Aadhaar */}
              <div className="flex flex-col items-center gap-2 text-sm">
                {countdown > 0 ? (
                  <p className="text-gray-500 font-medium text-xs">
                    {t.resendIn} {countdown} {t.seconds}
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="text-brand-700 hover:text-brand-800 font-medium text-xs"
                  >
                    {t.resendOtp}
                  </button>
                )}
                <button
                  onClick={handleChangeAadhaar}
                  className="text-gray-600 hover:text-gray-800 text-xs"
                >
                  {t.changeAadhaar}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Subtle footer */}
        <p className="mt-6 text-center text-xs font-semibold text-gray-800 drop-shadow-xs">
          {t.tagline}
        </p>
      </div>
    </div>
  );
}

export function LoginPage() {
  return (
    <ToastProvider>
      <LoginInner />
    </ToastProvider>
  );
}
