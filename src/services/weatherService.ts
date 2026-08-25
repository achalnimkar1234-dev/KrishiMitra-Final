// Weather Service for KrishiMitra
// Provides 7-day meteorological forecasts, crop-specific sowing recommendations,
// and integrates Soil Health + Water Reserve + Weather Forecast into a unified farmer decision.
// Designed with modular separation so a live backend or external weather API (Open-Meteo/IMD)
// can replace the mock generator effortlessly.

import type {
  CropId,
  DailyForecast,
  SowingRecommendation,
  WeatherForecastData,
} from '@/types';
import { farmers, plots, crops } from '@/data/mockData';
import { getSoilReport } from '@/services/api';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Format relative date labels (e.g., 'Monday, 25 Aug')
function getForecastDates(): { fullDate: string; dayName: string; dayShort: string; isoDate: string }[] {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const result = [];
  const baseDate = new Date(); // Current date

  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);

    const dayName = days[d.getDay()];
    const dayShort = daysShort[d.getDay()];
    const dateNum = d.getDate();
    const monthName = months[d.getMonth()];
    const isoDate = d.toISOString().split('T')[0];

    result.push({
      fullDate: `${dayShort}, ${dateNum} ${monthName}`,
      dayName,
      dayShort,
      isoDate,
    });
  }
  return result;
}

export async function getWeatherForecast(
  plotId?: string,
  cropId?: CropId | null
): Promise<WeatherForecastData> {
  await delay(300);

  const targetPlot = plotId ? plots.find((p) => p.id === plotId) : plots[0];
  const targetFarmer = targetPlot
    ? farmers.find((f) => f.id === targetPlot.farmerId) || farmers[0]
    : farmers[0];

  const dateList = getForecastDates();
  const soilReport = targetPlot ? await getSoilReport(targetPlot.id) : null;

  // 7-day structured meteorological data realistic for Maharashtra farm belt
  const rawDailyData: Omit<DailyForecast, 'date' | 'dayName' | 'dayShort'>[] = [
    {
      condition: 'light_rain',
      minTemp: 23,
      maxTemp: 30,
      rainProbability: 65,
      rainfallMm: 12,
      windSpeedKmh: 14,
      windDirection: 'SW',
      humidityPercent: 82,
      soilMoistureStatus: 'optimal',
      sowingFit: 'moderate',
      advisoryNote: 'Initial showers will replenish seedbed moisture.',
    },
    {
      condition: 'light_rain',
      minTemp: 23,
      maxTemp: 29,
      rainProbability: 45,
      rainfallMm: 6,
      windSpeedKmh: 12,
      windDirection: 'WSW',
      humidityPercent: 78,
      soilMoistureStatus: 'optimal',
      sowingFit: 'moderate',
      advisoryNote: 'Light intermittent showers. Good for soil preparation.',
    },
    {
      condition: 'partly_cloudy',
      minTemp: 22,
      maxTemp: 31,
      rainProbability: 20,
      rainfallMm: 0,
      windSpeedKmh: 10,
      windDirection: 'W',
      humidityPercent: 68,
      soilMoistureStatus: 'optimal',
      sowingFit: 'suitable',
      advisoryNote: 'Ideal soil moisture and clear skies. Excellent for sowing.',
    },
    {
      condition: 'clear',
      minTemp: 22,
      maxTemp: 32,
      rainProbability: 10,
      rainfallMm: 0,
      windSpeedKmh: 9,
      windDirection: 'WNW',
      humidityPercent: 62,
      soilMoistureStatus: 'optimal',
      sowingFit: 'suitable',
      advisoryNote: 'Sunny and warm. Optimal seed germination window.',
    },
    {
      condition: 'clear',
      minTemp: 24,
      maxTemp: 33,
      rainProbability: 15,
      rainfallMm: 0,
      windSpeedKmh: 11,
      windDirection: 'NW',
      humidityPercent: 58,
      soilMoistureStatus: 'moderate',
      sowingFit: 'suitable',
      advisoryNote: 'Good sunshine hours. Seedlings will establish rapidly.',
    },
    {
      condition: 'partly_cloudy',
      minTemp: 24,
      maxTemp: 32,
      rainProbability: 35,
      rainfallMm: 2,
      windSpeedKmh: 13,
      windDirection: 'SW',
      humidityPercent: 66,
      soilMoistureStatus: 'moderate',
      sowingFit: 'suitable',
      advisoryNote: 'Mild cloud cover with moderate humidity.',
    },
    {
      condition: 'moderate_rain',
      minTemp: 23,
      maxTemp: 28,
      rainProbability: 75,
      rainfallMm: 18,
      windSpeedKmh: 16,
      windDirection: 'SSW',
      humidityPercent: 85,
      soilMoistureStatus: 'optimal',
      sowingFit: 'avoid',
      advisoryNote: 'Heavy showers expected. Complete sowing before this date.',
    },
  ];

  const forecast: DailyForecast[] = dateList.map((d, index) => ({
    date: d.fullDate,
    dayName: d.dayName,
    dayShort: d.dayShort,
    ...rawDailyData[index],
  }));

  const totalWeeklyRainfallMm = forecast.reduce((acc, curr) => acc + curr.rainfallMm, 0);
  const avgTemp = Math.round(
    forecast.reduce((acc, curr) => acc + (curr.minTemp + curr.maxTemp) / 2, 0) / forecast.length
  );
  const avgHumidity = Math.round(
    forecast.reduce((acc, curr) => acc + curr.humidityPercent, 0) / forecast.length
  );

  // Compute crop-aware sowing recommendation
  const sowingRecommendation = generateCropSowingRecommendation(
    cropId,
    forecast,
    targetPlot,
    soilReport
  );

  return {
    location: {
      village: targetPlot?.village || targetFarmer.village || 'Demo Village',
      taluka: targetFarmer.taluka || 'Panhala',
      district: targetFarmer.district || 'Kolhapur',
      plotId: targetPlot?.id || 'MH-DEMO-PLOT-0001',
      areaHectares: targetPlot?.areaHectares || 1.2,
    },
    generatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    forecast,
    sowingRecommendation,
    totalWeeklyRainfallMm,
    avgTemp,
    avgHumidity,
  };
}

function generateCropSowingRecommendation(
  cropId: CropId | null | undefined,
  forecast: DailyForecast[],
  plot?: { hasIrrigation: boolean; waterReserve: string } | null,
  soilReport?: { ph: number; organicCarbon: number } | null
): SowingRecommendation {
  const cropObj = crops.find((c) => c.id === cropId);
  const cropName = cropObj ? cropObj.name : 'General';

  // Determine window dates from Day 3 and Day 4 (the optimal 2-day clear window)
  const windowStart = forecast[2]?.date || 'Day 3';
  const windowEnd = forecast[3]?.date || 'Day 4';
  const windowLabel = `${windowStart} – ${windowEnd}`;

  // Soil & Water state
  const hasGoodWater = plot?.waterReserve === 'high' || plot?.hasIrrigation;
  const soilWaterSuitability: 'suitable' | 'moderate' | 'unfavorable' = hasGoodWater ? 'suitable' : 'moderate';
  const soilWaterSummary = hasGoodWater
    ? 'Soil & water reserve: Highly Suitable (Moist seedbed + assured water source)'
    : 'Soil & water reserve: Moderate (Adequate rain moisture available)';

  const weatherSuitability: 'suitable' | 'moderate' | 'unfavorable' = 'suitable';
  const weatherSummary = 'Weather for next 7 days: Suitable (18 mm pre-sowing rain followed by 3 clear germination days)';

  // Crop-specific agronomic logic
  if (cropId === 'soybean') {
    return {
      status: 'suitable',
      statusLabelKey: 'weather.statusSuitable',
      recommendedWindow: windowLabel,
      cropId: 'soybean',
      cropName: 'Soybean',
      reasonKey: 'weather.soybeanReason',
      reason:
        'Moderate rainfall (18 mm) in the first 2 days creates optimum 60–70% soil moisture, followed by 3 consecutive sunny days (22°C–32°C) without heavy downpours, preventing seed rot and ensuring rapid germination.',
      weatherSuitability,
      soilWaterSuitability,
      soilWaterSummary,
      weatherSummary,
      farmerAdvice: [
        'Treat seeds with Rhizobium culture and Trichoderma (5g/kg) before sowing.',
        'Sow at 3–5 cm depth with 45 cm row-to-row spacing in moist soil.',
        'Ensure proper drainage channels to prevent waterlogging from later rain.',
      ],
    };
  }

  if (cropId === 'wheat') {
    return {
      status: 'wait',
      statusLabelKey: 'weather.statusWait',
      recommendedWindow: 'Late October / Post-Monsoon Window',
      cropId: 'wheat',
      cropName: 'Wheat',
      reasonKey: 'weather.wheatReason',
      reason:
        'Wheat is a cool-season rabi crop requiring 18°C–25°C for optimal crown root initiation. Current maximum temperatures (30°C–33°C) are higher than ideal. Wait for cooler post-monsoon weather.',
      weatherSuitability: 'moderate',
      soilWaterSuitability,
      soilWaterSummary,
      weatherSummary: 'Current temperature range is warmer than optimal for wheat germination.',
      farmerAdvice: [
        'Complete field preparation and incorporate well-rotted FYM/compost.',
        'Select recommended heat-tolerant certified seed varieties (e.g. GW-322, HD-2967).',
        'Conserve residual soil moisture with shallow harrowing.',
      ],
    };
  }

  if (cropId === 'cotton') {
    return {
      status: 'suitable',
      statusLabelKey: 'weather.statusSuitable',
      recommendedWindow: windowLabel,
      cropId: 'cotton',
      cropName: 'Cotton',
      reasonKey: 'weather.cottonReason',
      reason:
        'Soil temperature (24°C–32°C) and moisture from initial 18 mm showers provide ideal conditions for cotton emergence. Clear weather in the middle window avoids fungal damping-off.',
      weatherSuitability,
      soilWaterSuitability,
      soilWaterSummary,
      weatherSummary,
      farmerAdvice: [
        'Sow on broad ridges or raised beds with 90 × 60 cm spacing.',
        'Apply bio-fertilizer seed coating for early vigor.',
        'Avoid sowing if continuous heavy downpours are forecast on the sowing day.',
      ],
    };
  }

  if (cropId === 'onion' || cropId === 'tomato') {
    return {
      status: 'suitable',
      statusLabelKey: 'weather.statusSuitable',
      recommendedWindow: windowLabel,
      cropId,
      cropName: cropId === 'onion' ? 'Onion' : 'Tomato',
      reasonKey: 'weather.vegetableReason',
      reason:
        'The upcoming dry, partly-cloudy window (Wed–Thu) with mild temperatures is ideal for transplanting seedlings without causing transplant shock or fungal rot.',
      weatherSuitability,
      soilWaterSuitability,
      soilWaterSummary,
      weatherSummary,
      farmerAdvice: [
        'Transplant seedlings in the late afternoon to reduce transpiration shock.',
        'Dip root seedlings in Trichoderma suspension before field planting.',
        'Maintain light irrigation to establish root contact with soil.',
      ],
    };
  }

  if (cropId === 'rice' || cropId === 'sugarcane') {
    return {
      status: 'suitable',
      statusLabelKey: 'weather.statusSuitable',
      recommendedWindow: windowLabel,
      cropId,
      cropName: cropId === 'rice' ? 'Rice' : 'Sugarcane',
      reasonKey: 'weather.highWaterReason',
      reason:
        'Good cumulative weekly rainfall (38 mm) combined with high water reserves creates ideal puddled / moist soil conditions.',
      weatherSuitability,
      soilWaterSuitability,
      soilWaterSummary,
      weatherSummary,
      farmerAdvice: [
        'Ensure uniform land leveling for optimal standing water distribution.',
        'Maintain 2–3 cm standing water in nursery or transplant field.',
      ],
    };
  }

  if (cropId === 'chana' || cropId === 'tur' || cropId === 'groundnut' || cropId === 'maize' || cropId === 'jowar' || cropId === 'bajra') {
    return {
      status: 'suitable',
      statusLabelKey: 'weather.statusSuitable',
      recommendedWindow: windowLabel,
      cropId,
      cropName: cropObj ? cropObj.name : 'Pulses & Coarse Grains',
      reasonKey: 'weather.pulsesReason',
      reason:
        'Initial light rain softens the seedbed, and 3 subsequent dry, sunny days facilitate fast emergence with zero risk of seed decay.',
      weatherSuitability,
      soilWaterSuitability,
      soilWaterSummary,
      weatherSummary,
      farmerAdvice: [
        'Ensure seed inoculation with Rhizobium culture.',
        'Sow in well-drained furrows to prevent root stagnation.',
      ],
    };
  }

  // Fallback: General recommendation if no crop is selected yet
  return {
    status: 'suitable',
    statusLabelKey: 'weather.statusSuitable',
    recommendedWindow: windowLabel,
    cropId: null,
    cropName: 'General (No crop selected)',
    reasonKey: 'weather.generalReason',
    reason:
      'Moderate rainfall is expected before the sowing window (18 mm), followed by suitable temperatures (22°C–32°C) and 3 sunny days without heavy downpours. Select a specific crop in KrishiMitra to receive tailored crop requirements.',
    weatherSuitability,
    soilWaterSuitability,
    soilWaterSummary,
    weatherSummary,
    farmerAdvice: [
      'Select a crop from Crop Decision to get crop-specific moisture and temperature thresholds.',
      'Check soil moisture with the hand-squeeze test (soil should form a soft ball without dripping water).',
      'Keep drainage channels open in low-lying field sections.',
    ],
  };
}
