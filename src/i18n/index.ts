import { site } from '@config/site';

export type Locale = (typeof site.supportedLanguages)[number];

const translations = {
  en: {
    skipToContent: 'Skip to content',
    foundationLabel: 'Foundation preview',
    foundationDescription: 'Temporary design system preview for Phase 1.',
    typography: 'Typography',
    colors: 'Semantic colors',
    surfaces: 'Surfaces and borders',
    themeHint:
      'Use your browser tools to set localStorage portfolio-theme to light, dark, or system.',
    pageNotFound: 'Page not found',
    backHome: 'Back to home',
  },
  es: {
    skipToContent: 'Ir al contenido',
    foundationLabel: 'Vista de cimientos',
    foundationDescription: 'Vista temporal del sistema de diseño para la fase 1.',
    typography: 'Tipografía',
    colors: 'Colores semánticos',
    surfaces: 'Superficies y bordes',
    themeHint:
      'Usa las herramientas del navegador para definir portfolio-theme como light, dark o system.',
    pageNotFound: 'Página no encontrada',
    backHome: 'Volver al inicio',
  },
} as const;

export type TranslationKey = keyof (typeof translations)['en'];

export function isLocale(value: string): value is Locale {
  return site.supportedLanguages.some((locale) => locale === value);
}

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key];
}

export function localePath(locale: Locale, path = '/'): string {
  const normalized = `/${path.replace(/^\/+|\/+$/g, '')}`;
  const localPath = normalized === '/' ? '/' : `${normalized}/`;
  return locale === site.defaultLanguage ? localPath : `/es${localPath}`;
}
