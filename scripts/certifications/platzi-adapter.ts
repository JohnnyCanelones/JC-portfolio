import type { Certification } from '../../src/lib/certifications/schema.ts';

const profileUrl = 'https://platzi.com/p/johnnyCanelones/';
const apiBase = 'https://api.platzi.com';

type JsonRequest = (url: string) => Promise<unknown>;

interface Diploma {
  diploma_url?: string;
  approved_date?: string;
  linkedin_share?: string;
}

interface Course {
  id: number;
  title: string;
  slug: string;
  diploma?: Diploma;
}

interface LearningPath {
  id: number;
  title: string;
  slug: string;
  url?: string;
  diploma?: Diploma;
}

interface PageMetadata {
  count: number;
  pages: number;
  current_page: number;
}

function object(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new TypeError(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function text(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.trim() === '')
    throw new TypeError(`${label} must be a non-empty string.`);
  return value.trim().replace(/\s+/g, ' ');
}

function integer(value: unknown, label: string): number {
  if (!Number.isInteger(value) || Number(value) < 0)
    throw new TypeError(`${label} must be a non-negative integer.`);
  return Number(value);
}

function optionalText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim().replace(/\s+/g, ' ') : undefined;
}

function parseDiploma(value: unknown): Diploma | undefined {
  if (!value) return undefined;
  const input = object(value, 'diploma');
  return {
    diploma_url: optionalText(input.diploma_url),
    approved_date: optionalText(input.approved_date),
    linkedin_share: optionalText(input.linkedin_share),
  };
}

function parseMetadata(value: unknown): PageMetadata {
  const input = object(value, 'metadata');
  return {
    count: integer(input.count, 'metadata.count'),
    pages: integer(input.pages, 'metadata.pages'),
    current_page: integer(input.current_page, 'metadata.current_page'),
  };
}

function credentialId(linkedinShare?: string): string | undefined {
  if (!linkedinShare) return undefined;
  try {
    return new URL(linkedinShare).searchParams.get('certId') ?? undefined;
  } catch {
    return undefined;
  }
}

export function normalizeCourse(course: Course): Certification {
  return {
    id: `platzi-course-${course.id}`,
    provider: 'Platzi',
    title: text(course.title, 'course.title'),
    slug: text(course.slug, 'course.slug'),
    technologies: [],
    completedAt: course.diploma?.approved_date,
    courseUrl: `https://platzi.com/cursos/${course.slug}/`,
    certificateUrl: course.diploma?.diploma_url,
    credentialId: credentialId(course.diploma?.linkedin_share),
    credentialType: 'course-completion',
    verificationStatus: course.diploma?.diploma_url ? 'publicly-verifiable' : 'unverified',
    featured: false,
    sourceUrl: profileUrl,
  };
}

export function normalizeLearningPath(path: LearningPath): Certification {
  return {
    id: `platzi-learning-path-${path.id}`,
    provider: 'Platzi',
    title: text(path.title, 'learningPath.title'),
    slug: text(path.slug, 'learningPath.slug'),
    technologies: [],
    completedAt: path.diploma?.approved_date,
    courseUrl: path.url,
    certificateUrl: path.diploma?.diploma_url,
    credentialType: 'learning-path',
    verificationStatus: path.diploma?.diploma_url ? 'publicly-verifiable' : 'unverified',
    featured: false,
    sourceUrl: profileUrl,
  };
}

function parseCoursePage(value: unknown): { items: Course[]; metadata: PageMetadata } {
  const input = object(value, 'coursePage');
  const data = object(input.data, 'coursePage.data');
  if (!Array.isArray(data.courses))
    throw new TypeError('coursePage.data.courses must be an array.');
  const items = data.courses.map((entry, index) => {
    const course = object(entry, `course[${index}]`);
    return {
      id: integer(course.id, `course[${index}].id`),
      title: text(course.title, `course[${index}].title`),
      slug: text(course.slug, `course[${index}].slug`),
      diploma: parseDiploma(course.diploma),
    };
  });
  return { items, metadata: parseMetadata(input.metadata) };
}

function parseLearningPathPage(value: unknown): { items: LearningPath[]; metadata: PageMetadata } {
  const input = object(value, 'learningPathPage');
  const data = object(input.data, 'learningPathPage.data');
  if (!Array.isArray(data.learning_paths))
    throw new TypeError('learningPathPage.data.learning_paths must be an array.');
  const items = data.learning_paths.map((entry, index) => {
    const path = object(entry, `learningPath[${index}]`);
    return {
      id: integer(path.id, `learningPath[${index}].id`),
      title: text(path.title, `learningPath[${index}].title`),
      slug: text(path.slug, `learningPath[${index}].slug`),
      url: optionalText(path.url),
      diploma: parseDiploma(path.diploma),
    };
  });
  return { items, metadata: parseMetadata(input.metadata) };
}

async function collectPages<T>(
  request: JsonRequest,
  endpoint: (page: number) => string,
  parse: (value: unknown) => { items: T[]; metadata: PageMetadata },
  maximumPages = 10,
): Promise<{ items: T[]; count: number }> {
  const items: T[] = [];
  const visited = new Set<number>();
  let expectedCount = 0;
  let page = 1;
  while (page <= maximumPages) {
    if (visited.has(page)) throw new Error(`Pagination loop detected at page ${page}.`);
    visited.add(page);
    const parsed = parse(await request(endpoint(page)));
    if (parsed.metadata.current_page !== page)
      throw new Error(`Unexpected pagination response for page ${page}.`);
    expectedCount = parsed.metadata.count;
    items.push(...parsed.items);
    if (page >= parsed.metadata.pages) break;
    page += 1;
  }
  if (page > maximumPages)
    throw new Error(`Pagination exceeded the ${maximumPages}-page safety limit.`);
  if (items.length !== expectedCount)
    throw new Error(
      `Incomplete public response: expected ${expectedCount}, received ${items.length}.`,
    );
  return { items, count: expectedCount };
}

export async function fetchPlatziCredentials(request: JsonRequest) {
  const courses = await collectPages(
    request,
    (page) => `${apiBase}/students/v1/diplomas/johnnyCanelones/?page=${page}&page_size=12`,
    parseCoursePage,
  );
  const paths = await collectPages(
    request,
    (page) => `${apiBase}/students/v1/learning-paths/johnnyCanelones/?page=${page}&page_size=12`,
    parseLearningPathPage,
  );
  return {
    credentials: [...courses.items.map(normalizeCourse), ...paths.items.map(normalizeLearningPath)],
    courseCount: courses.count,
    learningPathCount: paths.count,
  };
}

export function assertPublicProfile(html: string): void {
  if (!html.includes('johnnyCanelones') || !html.includes('Perfil de Estudiante Platzi')) {
    throw new Error('The expected public Platzi profile was not returned.');
  }
}

export const platziSource = { profileUrl, apiBase } as const;
