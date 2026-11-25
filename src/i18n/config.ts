export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeConfig = {
  en: { label: 'English', shortLabel: 'EN', htmlLang: 'en', intl: 'en-US', ogLocale: 'en_US' },
  es: { label: 'Español', shortLabel: 'ES', htmlLang: 'es', intl: 'es-EC', ogLocale: 'es_EC' },
} as const satisfies Record<
  Locale,
  { label: string; shortLabel: string; htmlLang: string; intl: string; ogLocale: string }
>;

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}
