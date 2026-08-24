import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import { SessionProvider, useSession } from '@/components/SessionContext';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { Layout } from '@/components/Layout';
import { ToastProvider } from '@/components/Toast';
import { LoginPage } from '@/pages/LoginPage';
import { PlotSelectionPage } from '@/pages/PlotSelectionPage';
import { SoilHealthPage } from '@/pages/SoilHealthPage';
import { CropSelectionPage } from '@/pages/CropSelectionPage';
import { SuitabilityPage } from '@/pages/SuitabilityPage';
import { MarketPage } from '@/pages/MarketPage';
import { MapPage } from '@/pages/MapPage';
import { CropInsurancePage } from '@/pages/CropInsurancePage';
import { AdvisoryPage } from '@/pages/AdvisoryPage';
import { SavedAdvicePage } from '@/pages/SavedAdvicePage';
import { OverviewPage } from '@/pages/OverviewPage';
import { GovernmentSubsidyPage } from '@/pages/GovernmentSubsidyPage';
import { SolarPumpPage } from '@/pages/SolarPumpPage';
import { AdminDemoPage } from '@/pages/AdminDemoPage';

function RequireFarmer({ children }: { children: ReactNode }) {
  const { farmerId } = useSession();
  const location = useLocation();
  if (!farmerId) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin-demo" element={<AdminDemoPage />} />
      <Route path="/overview" element={<RequireFarmer><Layout><OverviewPage /></Layout></RequireFarmer>} />
      <Route path="/plots" element={<RequireFarmer><Layout><PlotSelectionPage /></Layout></RequireFarmer>} />
      <Route path="/soil" element={<RequireFarmer><Layout><SoilHealthPage /></Layout></RequireFarmer>} />
      <Route path="/crop" element={<RequireFarmer><Layout><CropSelectionPage /></Layout></RequireFarmer>} />
      <Route path="/suitability" element={<RequireFarmer><Layout><SuitabilityPage /></Layout></RequireFarmer>} />
      <Route path="/market" element={<RequireFarmer><Layout><MarketPage /></Layout></RequireFarmer>} />
      <Route path="/map" element={<RequireFarmer><Layout><MapPage /></Layout></RequireFarmer>} />
      <Route path="/insurance" element={<RequireFarmer><Layout><CropInsurancePage /></Layout></RequireFarmer>} />
      <Route path="/advisory" element={<RequireFarmer><Layout><AdvisoryPage /></Layout></RequireFarmer>} />
      <Route path="/saved" element={<RequireFarmer><Layout><SavedAdvicePage /></Layout></RequireFarmer>} />
      <Route path="/subsidy" element={<RequireFarmer><Layout><GovernmentSubsidyPage /></Layout></RequireFarmer>} />
      <Route path="/government-subsidy" element={<RequireFarmer><Layout><GovernmentSubsidyPage /></Layout></RequireFarmer>} />
      <Route path="/solar-pump" element={<RequireFarmer><Layout><SolarPumpPage /></Layout></RequireFarmer>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <LanguageProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
