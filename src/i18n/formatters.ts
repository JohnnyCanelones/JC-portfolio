import { type Locale, localeConfig } from './config';

export interface MonthValue {
  year: number;
  month: number;
}

export function formatMonth(locale: Locale, value: MonthValue) {
  return new Intl.DateTimeFormat(localeConfig[locale].intl, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
    .format(new Date(Date.UTC(value.year, value.month - 1, 1)))
    .replace('.', '');
}

export function formatDate(locale: Locale, date: Date) {
  return new Intl.DateTimeFormat(localeConfig[locale].intl, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
