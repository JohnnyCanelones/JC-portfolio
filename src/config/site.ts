export const site = {
  fullName: 'Johnny Canelones',
  location: 'Ecuador',
  url: 'https://example.com',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'es'] as const,
  contactEmail: 'johnnyjose13@gmail.com',
  githubUrl: null,
  linkedInUrl: 'https://www.linkedin.com/in/johnny-canelones-73a86a154/',
  resume: { url: '/resume.pdf', language: 'en' },
  seo: { socialImage: '/images/social.png' },
} as const;

export type SiteConfig = typeof site;
