import { type CollectionEntry, getCollection } from 'astro:content';
import type { Locale } from '@i18n';

import { assertUniqueRoutes, assertUniqueTranslations } from './content-policy';

export { readingTime } from './content-policy';

export async function publishedProjects(locale: Locale = 'en') {
  const entries = await getCollection('projects');
  assertUniqueRoutes(entries);
  assertUniqueTranslations(entries);
  return entries
    .filter(({ data }) => !data.draft && data.language === locale)
    .sort((a, b) => a.data.order - b.data.order);
}
export async function publishedPosts(locale: Locale = 'en') {
  const entries = await getCollection('blog');
  assertUniqueRoutes(entries);
  assertUniqueTranslations(entries);
  return entries
    .filter(({ data }) => !data.draft && data.language === locale)
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}
export function translationOf<T extends 'projects' | 'blog'>(
  current: CollectionEntry<T>,
  entries: CollectionEntry<T>[],
  locale: Locale,
) {
  return entries.find(
    (entry) =>
      !entry.data.draft &&
      entry.data.language === locale &&
      entry.data.translationId === current.data.translationId,
  );
}
export function relatedProjects(
  current: CollectionEntry<'projects'>,
  entries: CollectionEntry<'projects'>[],
) {
  return entries
    .filter(
      (entry) =>
        entry.id !== current.id &&
        !entry.data.draft &&
        entry.data.language === current.data.language,
    )
    .sort(
      (a, b) =>
        Number(b.data.projectType === current.data.projectType) -
          Number(a.data.projectType === current.data.projectType) || a.data.order - b.data.order,
    )
    .slice(0, 2);
}
