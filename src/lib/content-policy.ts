export function assertUniqueRoutes(entries: { data: { slug: string; language: string } }[]) {
  const seen = new Set<string>();
  for (const { data } of entries) {
    const key = `${data.language}/${data.slug}`;
    if (seen.has(key)) throw new Error(`Duplicate content route: ${key}`);
    seen.add(key);
  }
}
export function assertUniqueTranslations(
  entries: { data: { translationId: string; language: string } }[],
) {
  const seen = new Set<string>();
  for (const { data } of entries) {
    const key = `${data.language}/${data.translationId}`;
    if (seen.has(key)) throw new Error(`Duplicate content translation: ${key}`);
    seen.add(key);
  }
}
export function readingTime(body = '') {
  const words = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]*>/g, '')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}
