import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assertUniqueRoutes,
  assertUniqueTranslations,
  readingTime,
} from '../src/lib/content-policy.ts';

test('duplicate routes fail even when one entry is a draft', () => {
  assert.throws(
    () =>
      assertUniqueRoutes([
        { data: { slug: 'wealthos', language: 'en', draft: false } },
        { data: { slug: 'wealthos', language: 'en', draft: true } },
      ]),
    /Duplicate content route/,
  );
});
test('translation routes may share a slug across languages', () => {
  assert.doesNotThrow(() =>
    assertUniqueRoutes([
      { data: { slug: 'wealthos', language: 'en' } },
      { data: { slug: 'wealthos', language: 'es' } },
    ]),
  );
});
test('translation IDs remain unique within each language', () => {
  assert.throws(
    () =>
      assertUniqueTranslations([
        { data: { translationId: 'wealthos', language: 'es' } },
        { data: { translationId: 'wealthos', language: 'es' } },
      ]),
    /Duplicate content translation/,
  );
});
test('reading estimates ignore fenced code and tolerate optional body', () => {
  assert.equal(readingTime(), 1);
  assert.equal(readingTime('word '.repeat(441)), 3);
  assert.equal(readingTime(['```ts', 'code '.repeat(1000), '```'].join('\n')), 1);
});
