import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Farmer, Language, CropId } from '@/types';

interface AppSession {
  farmerId: string | null;
  farmer: Farmer | null;
  language: Language;
  selectedPlotId: string | null;
  selectedCrop: CropId | null;
  setFarmerId: (id: string | null) => void;
  setFarmer: (f: Farmer | null) => void;
  setLanguage: (l: Language) => void;
  setSelectedPlotId: (id: string | null) => void;
  setSelectedCrop: (c: CropId | null) => void;
  resetSession: () => void;
}

const SessionContext = createContext<AppSession | undefined>(undefined);

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [farmerId, setFarmerIdState] = useState<string | null>(() => localStorage.getItem('km_farmerId'));
  const [farmer, setFarmerState] = useState<Farmer | null>(null);
  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem('km_language') as Language) || 'marathi');
  const [selectedPlotId, setSelectedPlotIdState] = useState<string | null>(() => localStorage.getItem('km_plotId'));
  const [selectedCrop, setSelectedCropState] = useState<CropId | null>(() => (localStorage.getItem('km_crop') as CropId) || null);

  useEffect(() => {
    if (farmerId) localStorage.setItem('km_farmerId', farmerId);
    else localStorage.removeItem('km_farmerId');
  }, [farmerId]);

  useEffect(() => {
    localStorage.setItem('km_language', language);
  }, [language]);

  useEffect(() => {
    if (selectedPlotId) localStorage.setItem('km_plotId', selectedPlotId);
    else localStorage.removeItem('km_plotId');
  }, [selectedPlotId]);

  useEffect(() => {
    if (selectedCrop) localStorage.setItem('km_crop', selectedCrop);
    else localStorage.removeItem('km_crop');
  }, [selectedCrop]);

  const setFarmerId = (id: string | null) => setFarmerIdState(id);
  const setFarmer = (f: Farmer | null) => setFarmerState(f);
  const setLanguage = (l: Language) => setLanguageState(l);
  const setSelectedPlotId = (id: string | null) => setSelectedPlotIdState(id);
  const setSelectedCrop = (c: CropId | null) => setSelectedCropState(c);

  const resetSession = () => {
    setFarmerIdState(null);
    setFarmerState(null);
    setSelectedPlotIdState(null);
    setSelectedCropState(null);
    localStorage.removeItem('km_farmerId');
    localStorage.removeItem('km_plotId');
    localStorage.removeItem('km_crop');
  };

  return (
    <SessionContext.Provider
      value={{
        farmerId,
        farmer,
        language,
        selectedPlotId,
        selectedCrop,
        setFarmerId,
        setFarmer,
        setLanguage,
        setSelectedPlotId,
        setSelectedCrop,
        resetSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
