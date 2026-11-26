import { readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  type CertificationDataset,
  sortCertifications,
  validateDataset,
} from '../../src/lib/certifications/schema.ts';
import { assertPublicProfile, fetchPlatziCredentials, platziSource } from './platzi-adapter.ts';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const datasetPath = resolve(scriptDirectory, '../../src/data/certifications/platzi.json');
const dryRun = process.argv.includes('--dry-run');

function log(event: string, details: Record<string, unknown> = {}) {
  process.stdout.write(`${JSON.stringify({ event, ...details })}\n`);
}

async function request(url: string, accept = 'application/json'): Promise<Response> {
  const attempts = 3;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    try {
      const response = await fetch(url, {
        headers: { Accept: accept, 'User-Agent': 'johnnycanelones.dev-certification-sync/1.0' },
        signal: controller.signal,
      });
      if (response.ok) return response;
      if ([401, 403, 404, 429].includes(response.status))
        throw new Error(`Request denied with HTTP ${response.status}: ${url}`);
      if (attempt === attempts)
        throw new Error(`Request failed with HTTP ${response.status}: ${url}`);
    } catch (error) {
      if (attempt === attempts) throw error;
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 400 * 2 ** (attempt - 1)));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error(`Unable to request ${url}`);
}

export function planDataset(
  existing: CertificationDataset,
  discovered: CertificationDataset,
): { dataset: CertificationDataset; additions: number; changes: number; preserved: number } {
  const previous = new Map(existing.credentials.map((credential) => [credential.id, credential]));
  const next = new Map(discovered.credentials.map((credential) => [credential.id, credential]));
  let additions = 0;
  let changes = 0;
  for (const [id, credential] of next) {
    const old = previous.get(id);
    if (!old) additions += 1;
    else if (JSON.stringify(old) !== JSON.stringify(credential)) changes += 1;
  }
  let preserved = 0;
  for (const [id, credential] of previous) {
    if (!next.has(id)) {
      next.set(id, credential);
      preserved += 1;
    }
  }
  return {
    dataset: validateDataset({
      ...discovered,
      credentials: sortCertifications([...next.values()]),
    }),
    additions,
    changes,
    preserved,
  };
}

async function main() {
  const existing = validateDataset(JSON.parse(await readFile(datasetPath, 'utf8')) as unknown);
  log('sync-start', { source: platziSource.profileUrl, dryRun });
  const profileResponse = await request(platziSource.profileUrl, 'text/html');
  assertPublicProfile(await profileResponse.text());
  const result = await fetchPlatziCredentials(async (url) => {
    const response = await request(url);
    return response.json() as Promise<unknown>;
  });
  if (result.credentials.length === 0 && existing.credentials.length > 0)
    throw new Error('Empty retrieval refused; the previous dataset remains unchanged.');
  const discovered = validateDataset({
    schemaVersion: 1,
    sourceUrl: platziSource.profileUrl,
    extractionStrategy: 'public-profile-and-anonymous-pagination',
    profileSummary: {
      courseCount: result.courseCount,
      learningPathCount: result.learningPathCount,
    },
    credentials: result.credentials,
  });
  const plan = planDataset(existing, discovered);
  const serialized = `${JSON.stringify(plan.dataset, null, 2)}\n`;
  const current = `${JSON.stringify(existing, null, 2)}\n`;
  const changed = serialized !== current;
  log('sync-plan', {
    changed,
    additions: plan.additions,
    metadataChanges: plan.changes,
    preservedForReview: plan.preserved,
    credentials: plan.dataset.credentials.length,
  });
  if (!dryRun && changed) {
    const temporaryPath = resolve(dirname(datasetPath), `.platzi.json.${process.pid}.tmp`);
    await writeFile(temporaryPath, serialized, 'utf8');
    await rename(temporaryPath, datasetPath);
    log('sync-write', { path: datasetPath });
  }
  log('sync-complete', { changed: changed && !dryRun, dryRun });
}

const entry = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (import.meta.url === entry) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    log('sync-error', { message });
    process.exitCode = 1;
  });
}
