import type { Locale } from './config';

function normalize(path: string) {
  const clean = `/${path.replace(/^\/+|\/+$/g, '')}`;
  return clean === '/' ? '/' : `${clean}/`;
}

export function localePath(_locale: Locale, path = '/') {
  const normalized = normalize(path);
  return normalized;
}

export function sectionPath(locale: Locale, id: string, currentPath = '/') {
  const home = localePath(locale);
  return currentPath === home ? `#${id}` : `${home}#${id}`;
}

export function alternatePath(path: string, locale: Locale) {
  return localePath(locale, path);
}

export function routeAlternates(path: string) {
  return [
    { locale: 'en' as const, href: alternatePath(path, 'en') },
    { locale: 'es' as const, href: alternatePath(path, 'es') },
  ];
}
