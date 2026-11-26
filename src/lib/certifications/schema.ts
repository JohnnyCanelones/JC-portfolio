export const credentialTypes = [
  'course-completion',
  'certificate',
  'learning-path',
  'professional-certification',
] as const;

export const verificationStatuses = ['publicly-verifiable', 'self-reported', 'unverified'] as const;

export type CredentialType = (typeof credentialTypes)[number];
export type VerificationStatus = (typeof verificationStatuses)[number];

export interface Certification {
  id: string;
  provider: string;
  title: string;
  slug: string;
  category?: string;
  technologies: string[];
  completedAt?: string;
  courseUrl?: string;
  certificateUrl?: string;
  credentialId?: string;
  credentialType: CredentialType;
  verificationStatus: VerificationStatus;
  featured: boolean;
  sourceUrl: string;
}

export interface CertificationDataset {
  schemaVersion: 1;
  sourceUrl: string;
  extractionStrategy: string;
  profileSummary: {
    courseCount: number;
    learningPathCount: number;
  };
  credentials: Certification[];
}

export interface CertificationOverride {
  featured?: boolean;
  hidden?: boolean;
  category?: string;
  technologies?: string[];
  certificateUrl?: string;
  verificationStatus?: VerificationStatus;
}

export type CertificationOverrides = Record<string, CertificationOverride>;

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function requiredString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.trim() === '')
    throw new TypeError(`${label} must be a non-empty string.`);
  return value.trim().replace(/\s+/g, ' ');
}

function optionalString(value: unknown, label: string): string | undefined {
  return value === undefined || value === null || value === ''
    ? undefined
    : requiredString(value, label);
}

function url(value: unknown, label: string, optional = false): string | undefined {
  const normalized = optionalString(value, label);
  if (!normalized && optional) return undefined;
  try {
    const parsed = new URL(normalized ?? '');
    if (parsed.protocol !== 'https:') throw new Error('HTTPS required');
    return parsed.href;
  } catch {
    throw new TypeError(`${label} must be a valid HTTPS URL.`);
  }
}

function date(value: unknown, label: string): string | undefined {
  const normalized = optionalString(value, label);
  if (!normalized) return undefined;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.valueOf())) throw new TypeError(`${label} must be a valid date.`);
  return parsed.toISOString();
}

function stringList(value: unknown, label: string): string[] {
  if (!Array.isArray(value)) throw new TypeError(`${label} must be an array.`);
  return [...new Set(value.map((entry, index) => requiredString(entry, `${label}[${index}]`)))];
}

export function validateCertification(value: unknown, label = 'credential'): Certification {
  const input = record(value, label);
  const credentialType = requiredString(input.credentialType, `${label}.credentialType`);
  const verificationStatus = requiredString(
    input.verificationStatus,
    `${label}.verificationStatus`,
  );
  if (!credentialTypes.includes(credentialType as CredentialType))
    throw new TypeError(`${label}.credentialType is unsupported.`);
  if (!verificationStatuses.includes(verificationStatus as VerificationStatus))
    throw new TypeError(`${label}.verificationStatus is unsupported.`);

  return {
    id: requiredString(input.id, `${label}.id`),
    provider: requiredString(input.provider, `${label}.provider`),
    title: requiredString(input.title, `${label}.title`),
    slug: requiredString(input.slug, `${label}.slug`),
    category: optionalString(input.category, `${label}.category`),
    technologies: stringList(input.technologies, `${label}.technologies`),
    completedAt: date(input.completedAt, `${label}.completedAt`),
    courseUrl: url(input.courseUrl, `${label}.courseUrl`, true),
    certificateUrl: url(input.certificateUrl, `${label}.certificateUrl`, true),
    credentialId: optionalString(input.credentialId, `${label}.credentialId`),
    credentialType: credentialType as CredentialType,
    verificationStatus: verificationStatus as VerificationStatus,
    featured: input.featured === true,
    sourceUrl: url(input.sourceUrl, `${label}.sourceUrl`) ?? '',
  };
}

export function sortCertifications(credentials: Certification[]): Certification[] {
  return [...credentials].sort((left, right) => {
    const dateOrder = (right.completedAt ?? '').localeCompare(left.completedAt ?? '');
    return dateOrder || left.title.localeCompare(right.title, 'es');
  });
}

export function validateDataset(value: unknown): CertificationDataset {
  const input = record(value, 'dataset');
  const summary = record(input.profileSummary, 'dataset.profileSummary');
  if (input.schemaVersion !== 1) throw new TypeError('dataset.schemaVersion must be 1.');
  if (!Array.isArray(input.credentials))
    throw new TypeError('dataset.credentials must be an array.');
  const credentials = input.credentials.map((entry, index) =>
    validateCertification(entry, `dataset.credentials[${index}]`),
  );
  const ids = new Set<string>();
  for (const credential of credentials) {
    if (ids.has(credential.id)) throw new TypeError(`Duplicate credential id: ${credential.id}`);
    ids.add(credential.id);
  }
  const courseCount = Number(summary.courseCount);
  const learningPathCount = Number(summary.learningPathCount);
  if (
    !Number.isInteger(courseCount) ||
    courseCount < 0 ||
    !Number.isInteger(learningPathCount) ||
    learningPathCount < 0
  ) {
    throw new TypeError('Profile counts must be non-negative integers.');
  }
  return {
    schemaVersion: 1,
    sourceUrl: url(input.sourceUrl, 'dataset.sourceUrl') ?? '',
    extractionStrategy: requiredString(input.extractionStrategy, 'dataset.extractionStrategy'),
    profileSummary: { courseCount, learningPathCount },
    credentials: sortCertifications(credentials),
  };
}

export function validateOverrides(value: unknown): CertificationOverrides {
  const input = record(value, 'overrides');
  const output: CertificationOverrides = {};
  for (const [id, rawOverride] of Object.entries(input)) {
    const override = record(rawOverride, `overrides.${id}`);
    const verificationStatus = optionalString(
      override.verificationStatus,
      `overrides.${id}.verificationStatus`,
    );
    if (
      verificationStatus &&
      !verificationStatuses.includes(verificationStatus as VerificationStatus)
    ) {
      throw new TypeError(`overrides.${id}.verificationStatus is unsupported.`);
    }
    output[id] = {
      featured: typeof override.featured === 'boolean' ? override.featured : undefined,
      hidden: typeof override.hidden === 'boolean' ? override.hidden : undefined,
      category: optionalString(override.category, `overrides.${id}.category`),
      technologies:
        override.technologies === undefined
          ? undefined
          : stringList(override.technologies, `overrides.${id}.technologies`),
      certificateUrl: url(override.certificateUrl, `overrides.${id}.certificateUrl`, true),
      verificationStatus: verificationStatus as VerificationStatus | undefined,
    };
  }
  return output;
}
