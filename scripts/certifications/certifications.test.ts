import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { validateDataset, validateOverrides } from '../../src/lib/certifications/schema.ts';
import { assertPublicProfile, fetchPlatziCredentials } from './platzi-adapter.ts';
import { planDataset } from './sync-platzi.ts';

const fixtures = resolve(dirname(fileURLToPath(import.meta.url)), '../../tests/fixtures/platzi');
const fixture = async (name: string) =>
  JSON.parse(await readFile(resolve(fixtures, name), 'utf8')) as unknown;

test('public pagination is normalized without live network access', async () => {
  const result = await fetchPlatziCredentials(async (url) => {
    if (url.includes('learning-paths')) return fixture('learning-paths.json');
    return fixture(url.includes('page=2') ? 'courses-page-2.json' : 'courses-page-1.json');
  });
  assert.equal(result.courseCount, 2);
  assert.equal(result.learningPathCount, 1);
  assert.equal(result.credentials.length, 3);
  assert.equal(result.credentials[0]?.title, 'Curso de Prueba');
  assert.equal(result.credentials[0]?.credentialId, 'credential-10');
  assert.equal(result.credentials[1]?.verificationStatus, 'unverified');
});

test('dataset validation rejects duplicates and unsafe URLs', () => {
  const credential = {
    id: 'one',
    provider: 'Platzi',
    title: 'One',
    slug: 'one',
    technologies: [],
    credentialType: 'course-completion',
    verificationStatus: 'publicly-verifiable',
    featured: false,
    sourceUrl: 'https://platzi.com/p/example/',
  };
  assert.throws(
    () =>
      validateDataset({
        schemaVersion: 1,
        sourceUrl: 'https://platzi.com/p/example/',
        extractionStrategy: 'fixture',
        profileSummary: { courseCount: 2, learningPathCount: 0 },
        credentials: [credential, credential],
      }),
    /Duplicate/,
  );
  assert.throws(
    () =>
      validateDataset({
        schemaVersion: 1,
        sourceUrl: 'http://example.com',
        extractionStrategy: 'fixture',
        profileSummary: { courseCount: 0, learningPathCount: 0 },
        credentials: [],
      }),
    /HTTPS/,
  );
});

test('manual overrides are validated independently', () => {
  assert.deepEqual(
    validateOverrides({ one: { featured: true, technologies: ['Astro', 'Astro'] } }).one
      ?.technologies,
    ['Astro'],
  );
});

test('sync planning is idempotent and preserves missing records', () => {
  const base = validateDataset({
    schemaVersion: 1,
    sourceUrl: 'https://platzi.com/p/example/',
    extractionStrategy: 'fixture',
    profileSummary: { courseCount: 1, learningPathCount: 0 },
    credentials: [
      {
        id: 'one',
        provider: 'Platzi',
        title: 'One',
        slug: 'one',
        technologies: [],
        credentialType: 'course-completion',
        verificationStatus: 'unverified',
        featured: false,
        sourceUrl: 'https://platzi.com/p/example/',
      },
    ],
  });
  const same = planDataset(base, base);
  assert.equal(same.additions, 0);
  assert.equal(same.changes, 0);
  assert.equal(same.preserved, 0);
  const empty = validateDataset({
    ...base,
    profileSummary: { courseCount: 0, learningPathCount: 0 },
    credentials: [],
  });
  assert.equal(planDataset(base, empty).preserved, 1);
});

test('profile guard rejects changed markup', () => {
  assert.doesNotThrow(() =>
    assertPublicProfile('<title>Perfil de Estudiante Platzi</title>johnnyCanelones'),
  );
  assert.throws(
    () => assertPublicProfile('<title>Unexpected</title>'),
    /expected public Platzi profile/,
  );
});
