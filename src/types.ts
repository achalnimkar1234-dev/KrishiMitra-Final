export type Language = 'marathi' | 'hindi' | 'english';

export type SoilLevel = 'low' | 'medium' | 'high' | 'adequate';

export type WaterReserveLevel = 'low' | 'medium' | 'high';

export type WaterRequirement = 'low' | 'medium' | 'high';

export interface Farmer {
  id: string;
  name: string;
  village: string;
  taluka: string;
  district: string;
  language: Language;
  phone: string;
}

export interface Plot {
  id: string;
  farmerId: string;
  village: string;
  areaHectares: number;
  hasIrrigation: boolean;
  waterReserve: WaterReserveLevel;
  soilStatus: string;
  lastSoilTest: string;
  recommended?: boolean;
}

export interface SoilParameter {
  name: string;
  marathiName: string;
  value: string;
  level: SoilLevel;
  unit: string;
  recommendation?: string;
}

export interface SoilReport {
  plotId: string;
  testDate: string;
  summary: string;
  parameters: SoilParameter[];
  ph: number;
  ec: number;
  organicCarbon: number;
}

export type CropId =
  | 'soybean'
  | 'onion'
  | 'tomato'
  | 'cotton'
  | 'rice'
  | 'wheat'
  | 'maize'
  | 'jowar'
  | 'bajra'
  | 'groundnut'
  | 'chana'
  | 'tur'
  | 'sunflower'
  | 'sugarcane'
  | 'potato'
  | (string & {});

export interface Crop {
  id: CropId;
  name: string;
  marathiName: string;
  hindiName?: string;
  waterRequirement: WaterRequirement;
  growingPeriod: string;
  suitabilityHint: string;
  icon: string;
  isPreferred?: boolean;
}

export interface CropSuitability {
  cropId: CropId;
  score: number;
  status: string;
  positiveFactors: string[];
  limitations: string[];
  explanation: string;
}

export interface CropComparisonRow {
  crop: string;
  soilFit: 'good' | 'moderate' | 'poor';
  waterNeed: 'low' | 'medium' | 'high';
  profitPotential: 'low' | 'medium' | 'high';
  risk: 'low' | 'medium' | 'high';
}

export interface PricePoint {
  year: number;
  price: number;
}

export interface MonthlyPrice {
  month: string;
  price: number;
}

export interface ForecastPoint {
  label: string;
  price: number;
  lower?: number;
  upper?: number;
}

export interface CropMspInfo {
  cropId: CropId;
  hasMsp: boolean;
  mspPerQuintal: number | null;
  season: string;
  marketPricePerQuintal: number;
  cacpCostPerQuintal: number | null;
  isEstimatedCost?: boolean;
}

export interface MarketData {
  cropId: CropId;
  cropName: string;
  marathiCropName?: string;
  hasMsp: boolean;
  mspValue: number | null;
  marketPrice: number;
  season: string;
  district: string;
  taluka?: string;
  plotArea: number;
  estYield: number;
  estProduction: number;
  estGrossValue: number;
  cacpCostPerQuintal: number | null;
  estCultivationCost: number | null;
  estNetReturn: number | null;
  isCostReliable: boolean;
  mspSource: string;
  yieldSource: string;
  currentModalPrice?: number;
  harvestPriceLow?: number;
  harvestPriceHigh?: number;
  mostLikelyPrice?: number;
  forecastConfidence?: string;
  priceVolatility?: string;
  dataSource?: string;
  yearlyPrices?: PricePoint[];
  monthlyPrices?: MonthlyPrice[];
  forecast?: ForecastPoint[];
}

export interface Profitability {
  areaHectares: number;
  yieldPerHectare: number;
  estimatedRevenue: number;
  cultivationCost: number;
  estimatedNetProfit: number;
  scenarios: {
    label: string;
    price: number;
    profit: number;
  }[];
}

export interface Mandi {
  id: string;
  name: string;
  marathiName?: string;
  location?: string;
  district?: string;
  distanceKm: number;
  majorCommodities?: string;
  marathiCommodities?: string;
  modalPrice: number;
  trend: 'stable' | 'increasing' | 'decreasing';
  transportCost: number;
  lat: number;
  lng: number;
}

export interface ApmcMarket {
  id: string;
  name: string;
  marathiName: string;
  location: string;
  district: string;
  distanceKm: number;
  majorCommodities: string;
  marathiCommodities: string;
}

export interface Advisory {
  id: string;
  crop: string;
  plotId: string;
  plotLabel: string;
  date: string;
  risk: 'low' | 'medium' | 'high';
  expectedProfit: number;
  suitabilityScore: number;
  decision: string;
  weather: string;
  sections: {
    title: string;
    marathiTitle: string;
    items: string[];
  }[];
  whyRecommendation: {
    label: string;
    value: string;
  }[];
}

export type SubsidyCategory = 'inputs' | 'irrigation';

export interface GovernmentSubsidy {
  id: string;
  name: string;
  marathiName: string;
  hindiName: string;
  category: SubsidyCategory;
  shortDescription: string;
  marathiDescription: string;
  hindiDescription: string;
  benefit: string;
  marathiBenefit: string;
  hindiBenefit: string;
  eligibleFor: string;
  marathiEligibleFor: string;
  hindiEligibleFor: string;
  eligibilitySummary: string;
  marathiEligibilitySummary: string;
  hindiEligibilitySummary: string;
  documents: string[];
  marathiDocuments: string[];
  hindiDocuments: string[];
  sourceName: string;
  portalName: string;
  officialUrl: string;
  state: string;
  targetCrops?: string[];
  irrigationRelevance?: 'needed' | 'existing' | 'any';
  minAreaHectares?: number;
  maxAreaHectares?: number;
}
