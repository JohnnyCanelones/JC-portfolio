export const site = {
  fullName: 'YOUR NAME',
  professionalTitle: 'YOUR PROFESSIONAL TITLE',
  description: 'A software engineering portfolio. Replace this description before publishing.',
  url: 'https://example.com',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'es'],
  contactEmail: 'you@example.com',
  githubUrl: 'https://github.com/YOUR_USERNAME',
  linkedInUrl: 'https://www.linkedin.com/in/YOUR_USERNAME/',
  resumeUrl: '/resume.pdf',
  availability: 'unknown',
  seo: {
    titleTemplate: '%s | YOUR NAME',
    defaultTitle: 'YOUR NAME | Software Engineer',
    defaultDescription:
      'A software engineering portfolio. Replace this description before publishing.',
    socialImage: '/images/social-placeholder.svg',
  },
} as const;

export type SiteConfig = typeof site;
