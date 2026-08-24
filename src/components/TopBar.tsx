import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sprout, LogOut } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui';
import { useSession } from '@/components/SessionContext';
import { useTranslation } from '@/i18n/LanguageContext';
import { farmers } from '@/data/mockData';
import type { Language } from '@/types';

const languageLabels: Record<Language, string> = {
  marathi: 'मराठी',
  hindi: 'हिन्दी',
  english: 'English',
};

export function TopBar() {
  const { farmerId, farmer, language, setLanguage, setFarmer, resetSession } = useSession();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Don't show top bar on login screen
  if (location.pathname === '/login' || location.pathname === '/') return null;

  // Auto-resolve farmer info from ID if not yet loaded
  const currentFarmer = farmer || farmers.find((f) => f.id === farmerId) || null;

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    resetSession();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2.5 md:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold leading-tight text-brand-700">KrishiMitra</h1>
              <p className="hidden text-[10px] leading-tight text-gray-400 sm:block">{t('welcome.tagline')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentFarmer && (
              <div className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <p className="text-sm font-medium text-gray-800 leading-tight">{currentFarmer.name}</p>
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-1 focus:ring-red-400"
                    title={t('common.logout')}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{t('common.logout')}</span>
                  </button>
                </div>
                <p className="text-xs text-gray-400 leading-tight mt-0.5">
                  {currentFarmer.village}, {currentFarmer.district}
                </p>
              </div>
            )}

            <select
              value={language}
              onChange={(e) => {
                const lang = e.target.value as Language;
                setLanguage(lang);
                if (farmerId) {
                  const f = farmers.find((x) => x.id === farmerId);
                  if (f) setFarmer({ ...f, language: lang });
                }
              }}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-600 focus:border-brand-400 focus:outline-none"
            >
              <option value="english">{languageLabels.english}</option>
              <option value="marathi">{languageLabels.marathi}</option>
              <option value="hindi">{languageLabels.hindi}</option>
            </select>

            {!farmerId && (
              <button
                onClick={() => navigate('/login')}
                className="text-xs text-brand-600 hover:text-brand-700"
              >
                {t('nav.login')}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <Modal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title={t('common.logout')}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowLogoutConfirm(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5 mr-1" />
              {t('common.logout')}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600 py-1">
          {t('common.confirmLogout')}
        </p>
      </Modal>
    </>
  );
}
