import type { SoilLevel, SoilParameter } from '@/types';

export function calculateParamLevel(name: string, numValue: number): { level: SoilLevel; labelKey: string } {
  const n = name.toLowerCase();

  if (n.includes('ph')) {
    if (numValue < 6.5) return { level: 'low', labelKey: 'soil.acidic' };
    if (numValue <= 7.5) return { level: 'adequate', labelKey: 'soil.suitable' };
    return { level: 'medium', labelKey: 'soil.mildlyAlkaline' };
  }

  if (n.includes('electrical') || n.includes('ec')) {
    if (numValue < 1.0) return { level: 'adequate', labelKey: 'soil.normal' };
    return { level: 'high', labelKey: 'soil.saline' };
  }

  if (n.includes('carbon') || n.includes('oc')) {
    if (numValue < 0.5) return { level: 'low', labelKey: 'soil.low' };
    if (numValue <= 0.75) return { level: 'medium', labelKey: 'soil.medium' };
    return { level: 'high', labelKey: 'soil.high' };
  }

  if (n.includes('nitrogen') || n === 'n') {
    if (numValue < 250) return { level: 'low', labelKey: 'soil.low' };
    if (numValue <= 500) return { level: 'medium', labelKey: 'soil.medium' };
    return { level: 'high', labelKey: 'soil.high' };
  }

  if (n.includes('phosphorus') || n === 'p') {
    if (numValue < 15) return { level: 'low', labelKey: 'soil.low' };
    if (numValue <= 30) return { level: 'medium', labelKey: 'soil.medium' };
    return { level: 'high', labelKey: 'soil.high' };
  }

  if (n.includes('potassium') || n === 'k') {
    if (numValue < 150) return { level: 'low', labelKey: 'soil.low' };
    if (numValue <= 300) return { level: 'medium', labelKey: 'soil.medium' };
    return { level: 'high', labelKey: 'soil.high' };
  }

  if (n.includes('sulphur') || n.includes('sulfur') || n === 's') {
    if (numValue < 10) return { level: 'low', labelKey: 'soil.low' };
    if (numValue <= 20) return { level: 'medium', labelKey: 'soil.medium' };
    return { level: 'high', labelKey: 'soil.high' };
  }

  if (n.includes('zinc') || n === 'zn') {
    if (numValue < 0.6) return { level: 'low', labelKey: 'soil.low' };
    if (numValue <= 1.2) return { level: 'medium', labelKey: 'soil.medium' };
    return { level: 'adequate', labelKey: 'soil.adequate' };
  }

  if (n.includes('iron') || n === 'fe') {
    if (numValue < 4.5) return { level: 'low', labelKey: 'soil.low' };
    if (numValue <= 9.0) return { level: 'medium', labelKey: 'soil.medium' };
    return { level: 'adequate', labelKey: 'soil.adequate' };
  }

  if (n.includes('copper') || n === 'cu') {
    if (numValue < 0.4) return { level: 'low', labelKey: 'soil.low' };
    if (numValue <= 0.8) return { level: 'medium', labelKey: 'soil.medium' };
    return { level: 'adequate', labelKey: 'soil.adequate' };
  }

  if (n.includes('manganese') || n === 'mn') {
    if (numValue < 3.5) return { level: 'low', labelKey: 'soil.low' };
    if (numValue <= 7.0) return { level: 'medium', labelKey: 'soil.medium' };
    return { level: 'adequate', labelKey: 'soil.adequate' };
  }

  if (n.includes('boron') || n === 'b') {
    if (numValue < 0.5) return { level: 'low', labelKey: 'soil.low' };
    if (numValue <= 1.0) return { level: 'medium', labelKey: 'soil.medium' };
    return { level: 'adequate', labelKey: 'soil.adequate' };
  }

  return { level: 'medium', labelKey: 'soil.medium' };
}

export function recalculateSoilParameter(param: SoilParameter, newValueStr: string): SoilParameter {
  const numVal = parseFloat(newValueStr);
  if (isNaN(numVal)) {
    return { ...param, value: newValueStr };
  }
  const { level } = calculateParamLevel(param.name, numVal);
  return {
    ...param,
    value: newValueStr,
    level,
  };
}
