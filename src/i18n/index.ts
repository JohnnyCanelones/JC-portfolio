import { type Locale, localeConfig } from './config';
import { en } from './translations/en';
import { es } from './translations/es';
import type { TranslationShape } from './types';

export * from './config';
export * from './formatters';
export * from './routing';

export type Messages = TranslationShape<typeof en>;
export const translations: Record<Locale, Messages> = { en, es };

export function useTranslations(locale: Locale): Messages {
  return translations[locale];
}

export function intlLocale(locale: Locale) {
  return localeConfig[locale].intl;
}
