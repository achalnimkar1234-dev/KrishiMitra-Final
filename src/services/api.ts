// Service layer — all data is local mock for the prototype.
// In production, each function here would call a FastAPI backend.
// Keeping API calls behind this layer makes future backend swap easier.

import type {
  Farmer,
  Plot,
  SoilReport,
  Crop,
  CropSuitability,
  CropId,
  MarketData,
  Profitability,
  Mandi,
  ApmcMarket,
  Advisory,
} from '@/types';
import {
  farmers,
  plots,
  soilReports,
  crops,
  cropSuitability,
  marketData,
  profitability,
  mandis,
  officialMspData,
  districtCropProductivity,
  districtApmcs,
  defaultAdvisory,
  preseededAdvisories,
} from '@/data/mockData';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const SOIL_STORAGE_PREFIX = 'krishimitra_soil_report_';

export async function getFarmer(farmerId: string): Promise<Farmer | null> {
  await delay(300);
  return farmers.find((f) => f.id === farmerId) ?? null;
}

export async function getPlots(farmerId: string): Promise<Plot[]> {
  await delay(300);
  return plots.filter((p) => p.farmerId === farmerId);
}

export async function getSoilReport(plotId: string): Promise<SoilReport | null> {
  await delay(200);
  try {
    const raw = localStorage.getItem(SOIL_STORAGE_PREFIX + plotId);
    if (raw) {
      return JSON.parse(raw) as SoilReport;
    }
  } catch {
    // ignore
  }
  const defaultReport = soilReports.find((r) => r.plotId === plotId) ?? soilReports[0];
  return defaultReport ?? null;
}

export async function updateSoilReport(plotId: string, updated: SoilReport): Promise<SoilReport> {
  await delay(200);
  try {
    localStorage.setItem(SOIL_STORAGE_PREFIX + plotId, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

export async function getCrops(): Promise<Crop[]> {
  await delay(200);
  return crops;
}

export async function getSuitability(cropId: CropId, plotId?: string): Promise<CropSuitability> {
  await delay(400);
  
  const baseSuitability = cropSuitability[cropId] ?? cropSuitability.soybean;
  const targetPlot = plotId ? plots.find((p) => p.id === plotId) : plots[0];
  const crop = crops.find((c) => c.id === cropId);

  if (!targetPlot || !crop) {
    return baseSuitability;
  }

  // Retrieve latest saved soil report for plot
  const activeSoilReport = await getSoilReport(targetPlot.id);

  const { hasIrrigation, waterReserve } = targetPlot;
  const { waterRequirement } = crop;

  // Dynamic calculation combining Soil Health + Water Reserve + Irrigation Availability
  let score = baseSuitability.score;
  const positiveFactors = [...baseSuitability.positiveFactors];
  const limitations = [...baseSuitability.limitations];
  let status = baseSuitability.status;
  let explanation = baseSuitability.explanation;

  // Evaluate latest Nitrogen and Organic Carbon from active soil report
  if (activeSoilReport) {
    const nitroParam = activeSoilReport.parameters.find((p) => p.name.toLowerCase().includes('nitrogen'));
    const oc = activeSoilReport.organicCarbon;

    if (nitroParam) {
      const nitroVal = parseFloat(nitroParam.value);
      if (!isNaN(nitroVal) && nitroVal >= 280) {
        // Nitrogen is adequate/high -> remove nitrogen limitation if present
        const idx = limitations.findIndex((l) => l.toLowerCase().includes('nitrogen'));
        if (idx !== -1) limitations.splice(idx, 1);
        positiveFactors.push(`Soil nitrogen is optimal (${nitroVal} kg/ha)`);
        score += 5;
      }
    }

    if (oc >= 0.5) {
      const idx = limitations.findIndex((l) => l.toLowerCase().includes('organic carbon'));
      if (idx !== -1) limitations.splice(idx, 1);
      positiveFactors.push(`Organic carbon is healthy (${oc}%)`);
      score += 5;
    }
  }

  if (waterRequirement === 'high') {
    if (waterReserve === 'high' && hasIrrigation) {
      score = Math.max(78, score);
      status = 'Suitable based on soil health & high water reserve';
      explanation = `${crop.name} has a high water requirement, which is fully sustained by your High water reserve and functional irrigation.`;
    } else if (waterReserve === 'medium') {
      score = hasIrrigation ? 62 : 52;
      status = 'Moderate — caution with water availability';
      limitations.unshift('High water requirement may face stress under moderate water reserve');
      explanation = `Moderate soil suitability, but high water requirement may present risk under moderate water reserve.`;
    } else {
      // Low water reserve
      score = hasIrrigation ? 45 : 35;
      status = 'Not recommended due to low water reserve';
      limitations.unshift('High water demand exceeds available low water reserve');
      explanation = `High water requirement crop. Not recommended with the current low water reserve and risk of moisture deficit.`;
    }
  } else if (waterRequirement === 'medium') {
    if (waterReserve === 'high' || waterReserve === 'medium') {
      score = Math.min(95, Math.max(82, score));
      status = 'Suitable based on soil health & available water';
      explanation = `Suitable based on soil health and available water reserve. Balanced water requirement fits the plot.`;
    } else {
      // Low water reserve
      score = hasIrrigation ? 60 : 50;
      status = 'Moderate — requires moisture conservation';
      limitations.unshift('Low water reserve may require supplemental irrigation');
      explanation = `Soil is compatible, but low water reserve requires efficient water management for optimal yield.`;
    }
  } else {
    // Low water requirement
    score = Math.max(85, score);
    status = 'Highly suitable — drought resilient';
    positiveFactors.unshift('Low water requirement is fully resilient against any water constraints');
    explanation = `Ideal fit for plot water condition and soil parameters.`;
  }

  return {
    cropId,
    score: Math.min(100, score),
    status,
    positiveFactors,
    limitations,
    explanation,
  };
}

export async function getMarketData(cropId: string, plotId?: string): Promise<MarketData> {
  await delay(300);
  const targetPlot = plotId ? plots.find((p) => p.id === plotId) : plots[0];
  const farmer = targetPlot ? farmers.find((f) => f.id === targetPlot.farmerId) : farmers[0];
  const crop = crops.find((c) => c.id === cropId) || crops[0];

  const district = farmer?.district || 'Kolhapur';
  const taluka = farmer?.taluka || 'Panhala';
  const plotArea = targetPlot?.areaHectares || 1.2;

  // 1. Lookup District Productivity (Yield in q/ha)
  const districtYieldTable =
    districtCropProductivity[district] ||
    districtCropProductivity['Kolhapur'] ||
    districtCropProductivity.MaharashtraAverage;
  const estYield = districtYieldTable[crop.id] || districtCropProductivity.MaharashtraAverage[crop.id] || 20.0;

  // 2. Production = Est. Yield * Plot Area
  const estProduction = Number((estYield * plotArea).toFixed(1));

  // 3. Official MSP / Pricing Info
  const mspInfo = officialMspData[crop.id] || {
    cropId: crop.id,
    hasMsp: false,
    mspPerQuintal: null,
    season: '2025–26',
    marketPricePerQuintal: 2500,
    cacpCostPerQuintal: null,
  };

  const hasMsp = mspInfo.hasMsp;
  const mspValue = mspInfo.mspPerQuintal;
  const marketPrice = mspInfo.marketPricePerQuintal;
  const season = mspInfo.season;

  // Effective price used for Gross Value
  const effectivePrice = hasMsp && mspValue ? mspValue : marketPrice;
  const estGrossValue = Math.round(estProduction * effectivePrice);

  // 4. Cultivation Cost & Net Return
  const cacpCostPerQuintal = mspInfo.cacpCostPerQuintal;
  let estCultivationCost: number | null = null;
  let estNetReturn: number | null = null;
  let isCostReliable = false;

  if (cacpCostPerQuintal !== null && cacpCostPerQuintal !== undefined) {
    estCultivationCost = Math.round(estProduction * cacpCostPerQuintal);
    estNetReturn = Math.round(estGrossValue - estCultivationCost);
    isCostReliable = true;
  } else {
    estCultivationCost = null;
    estNetReturn = null;
    isCostReliable = false;
  }

  return {
    cropId: crop.id as CropId,
    cropName: crop.name,
    marathiCropName: crop.marathiName,
    hasMsp,
    mspValue,
    marketPrice,
    season,
    district,
    taluka,
    plotArea,
    estYield,
    estProduction,
    estGrossValue,
    cacpCostPerQuintal,
    estCultivationCost,
    estNetReturn,
    isCostReliable,
    mspSource: 'Government of India / CACP (2025–26)',
    yieldSource: 'Maharashtra Department of Agriculture',
    currentModalPrice: effectivePrice,
    harvestPriceLow: Math.round(effectivePrice * 0.92),
    harvestPriceHigh: Math.round(effectivePrice * 1.06),
    mostLikelyPrice: effectivePrice,
    forecastConfidence: hasMsp ? 'Government MSP' : 'Local APMC Estimate',
    priceVolatility: hasMsp ? 'Protected' : 'Market Variable',
    dataSource: 'Government of India CACP MSP 2025–26 & Maharashtra Agriculture Dept',
  };
}

export async function getProfitability(cropId?: string, plotId?: string): Promise<Profitability> {
  await delay(200);
  const targetPlot = plotId ? plots.find((p) => p.id === plotId) : plots[0];
  const market = await getMarketData(cropId || 'soybean', plotId);

  return {
    areaHectares: market.plotArea,
    yieldPerHectare: market.estYield,
    estimatedRevenue: market.estGrossValue,
    cultivationCost: market.estCultivationCost || Math.round(market.estGrossValue * 0.6),
    estimatedNetProfit: market.estNetReturn || Math.round(market.estGrossValue * 0.4),
    scenarios: [
      {
        label: 'CACP Cost Benchmark',
        price: market.cacpCostPerQuintal || Math.round(market.marketPrice * 0.65),
        profit: 0,
      },
      {
        label: market.hasMsp ? 'Official MSP 2025–26' : 'Estimated Market Price',
        price: market.hasMsp && market.mspValue ? market.mspValue : market.marketPrice,
        profit: market.estNetReturn || Math.round(market.estGrossValue * 0.4),
      },
      {
        label: 'Local APMC Expected Modal',
        price: Math.round((market.hasMsp && market.mspValue ? market.mspValue : market.marketPrice) * 1.05),
        profit: Math.round((market.estNetReturn || market.estGrossValue * 0.4) * 1.1),
      },
    ],
  };
}

export async function getApmcs(plotId?: string): Promise<ApmcMarket[]> {
  await delay(200);
  const targetPlot = plotId ? plots.find((p) => p.id === plotId) : plots[0];
  const farmer = targetPlot ? farmers.find((f) => f.id === targetPlot.farmerId) : farmers[0];
  const district = farmer?.district || 'Kolhapur';

  return districtApmcs[district] || districtApmcs['Kolhapur'] || [];
}

export async function getMandis(plotId?: string): Promise<Mandi[]> {
  await delay(200);
  const apmcs = await getApmcs(plotId);
  return apmcs.map((a) => ({
    id: a.id,
    name: a.name,
    marathiName: a.marathiName,
    location: a.location,
    district: a.district,
    distanceKm: a.distanceKm,
    majorCommodities: a.majorCommodities,
    marathiCommodities: a.marathiCommodities,
    modalPrice: 5328,
    trend: 'stable' as const,
    transportCost: a.distanceKm * 25,
    lat: 16.7 + a.distanceKm * 0.01,
    lng: 74.2 + a.distanceKm * 0.01,
  }));
}

export async function getDefaultAdvisory(cropId?: CropId): Promise<Advisory> {
  await delay(300);
  const crop = crops.find((c) => c.id === cropId);
  if (crop) {
    return {
      ...defaultAdvisory,
      crop: crop.name,
    };
  }
  return defaultAdvisory;
}

// localStorage-backed saved advisories
const STORAGE_KEY = 'krishimitra_saved_advisories';

export function getSavedAdvisories(): Advisory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Advisory[];
  } catch {
    // ignore
  }
  // seed with pre-seeded demo advisories on first load
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preseededAdvisories));
  return preseededAdvisories;
}

export function saveAdvisory(advisory: Advisory): void {
  const existing = getSavedAdvisories();
  const filtered = existing.filter((a) => a.id !== advisory.id);
  const updated = [{ ...advisory, date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) }, ...filtered];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteSavedAdvisory(id: string): void {
  const existing = getSavedAdvisories();
  const updated = existing.filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
