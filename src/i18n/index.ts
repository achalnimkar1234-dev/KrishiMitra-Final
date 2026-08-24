import { en } from './translations/en';
import { mr } from './translations/mr';
import { hi } from './translations/hi';

export type TranslationType = typeof en;

export const translations = {
  en,
  mr,
  hi
};

// Helper function to resolve dot-notation string keys
export function getNestedTranslation(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => {
    return acc && acc[part] !== undefined ? acc[part] : undefined;
  }, obj) as unknown as string;
}
