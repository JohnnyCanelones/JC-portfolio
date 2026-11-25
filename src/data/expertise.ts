import type { Locale } from '@i18n';

const expertise = {
  en: [
    {
      title: 'Frontend engineering',
      description:
        'Responsive interfaces, navigation, data visualization, and cross-platform experiences.',
      technologies: 'TypeScript · Angular · React · Next.js · Ionic · Astro',
    },
    {
      title: 'Backend & data',
      description: 'APIs, background processing, document workflows, and relational data systems.',
      technologies: 'Laravel · PHP · Node.js · PostgreSQL · MongoDB · MySQL',
    },
    {
      title: 'Delivery & practice',
      description: 'Architecture, testing, technical leadership, and reliable release workflows.',
      technologies: 'Docker · GitHub Actions · AWS · Automated testing · CI/CD',
    },
  ],
  es: [
    {
      title: 'Ingeniería frontend',
      description:
        'Interfaces responsivas, navegación, visualización de datos y experiencias multiplataforma.',
      technologies: 'TypeScript · Angular · React · Next.js · Ionic · Astro',
    },
    {
      title: 'Backend y datos',
      description:
        'APIs, procesamiento en segundo plano, flujos documentales y sistemas de datos relacionales.',
      technologies: 'Laravel · PHP · Node.js · PostgreSQL · MongoDB · MySQL',
    },
    {
      title: 'Entrega y práctica',
      description: 'Arquitectura, pruebas, liderazgo técnico y flujos de entrega confiables.',
      technologies: 'Docker · GitHub Actions · AWS · Pruebas automatizadas · CI/CD',
    },
  ],
} as const;

export function getExpertise(locale: Locale) {
  return expertise[locale];
}
