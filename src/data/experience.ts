import { formatMonth, type Locale, type MonthValue } from '@i18n';

const facts = [
  {
    id: 'ttb-ism',
    company: 'ISM / TTB / Pixegon via Jobsity',
    start: { year: 2025, month: 4 },
    end: { year: 2026, month: 11 },
    technologies: 'Angular · Ionic · TypeScript',
  },
  {
    id: 'gjd',
    company: 'Earth Innovation Institute',
    start: { year: 2023, month: 11 },
    end: { year: 2025, month: 4 },
    technologies: 'Next.js · React · Laravel · PostgreSQL',
  },
  {
    id: 'brikmate',
    company: 'Brikmate via Jobsity',
    start: { year: 2022, month: 10 },
    end: { year: 2023, month: 11 },
    technologies: 'Next.js · TypeScript · PostgreSQL',
  },
  {
    id: 'breeze-airways',
    company: 'Breeze Airways via BairesDev',
    start: { year: 2022, month: 11 },
    end: { year: 2023, month: 9 },
    technologies: 'Angular · Ionic · GraphQL · TypeScript',
  },
  {
    id: 'globalfinances',
    company: 'GlobalFinances',
    start: { year: 2019, month: 10 },
    end: { year: 2022, month: 11 },
    technologies: 'Angular · Laravel · PostgreSQL',
  },
] as const satisfies readonly {
  id: string;
  company: string;
  start: MonthValue;
  end: MonthValue;
  technologies: string;
}[];

const copy = {
  en: {
    'ttb-ism': [
      'Full-Stack Developer',
      'Built and maintained an administrative dashboard, a progressive web app, and mobile experiences for audio, reading, and content discovery.',
      'Worked on audio player architecture, an EPUB reader, navigation and deep linking, and Android app stability.',
    ],
    gjd: [
      'Full-Stack Developer',
      'Developed environmental data platforms, including the Green Jurisdictions Database, with interactive maps, search, and data exports.',
      'Built frontend features and Laravel APIs, and maintained Docker-based development and GitHub Actions workflows.',
    ],
    brikmate: [
      'Full-Stack Developer',
      'Built PDF reading and document chat interactions that linked answers back to the relevant lease sections.',
      null,
    ],
    'breeze-airways': [
      'Frontend Developer',
      'Contributed to mobile booking, account, and passenger notification experiences for an airline.',
      null,
    ],
    globalfinances: [
      'Full-Stack Developer / Tech Lead',
      'Helped build accounting software and an invoicing module that handled more than 80,000 invoices per month.',
      'Led a team of three developers.',
    ],
  },
  es: {
    'ttb-ism': [
      'Desarrollador Full-Stack',
      'Construí y mantuve un panel administrativo, una aplicación web progresiva y experiencias móviles para audio, lectura y descubrimiento de contenido.',
      'Trabajé en la arquitectura del reproductor de audio, un lector EPUB, navegación y deep links, y estabilidad de la aplicación Android.',
    ],
    gjd: [
      'Desarrollador Full-Stack',
      'Desarrollé plataformas de datos ambientales, incluida Green Jurisdictions Database, con mapas interactivos, búsqueda y exportación de datos.',
      'Construí funcionalidades frontend y APIs en Laravel, y mantuve entornos con Docker y flujos de GitHub Actions.',
    ],
    brikmate: [
      'Desarrollador Full-Stack',
      'Construí experiencias de lectura de PDF y chat documental que enlazaban las respuestas con las secciones relevantes de los contratos.',
      null,
    ],
    'breeze-airways': [
      'Desarrollador Frontend',
      'Contribuí a experiencias móviles de reservas, cuentas y notificaciones a pasajeros para una aerolínea.',
      null,
    ],
    globalfinances: [
      'Desarrollador Full-Stack / Líder técnico',
      'Ayudé a construir software contable y un módulo de facturación que procesaba más de 80.000 facturas al mes.',
      'Lideré un equipo de tres desarrolladores.',
    ],
  },
} as const;

export function getExperience(locale: Locale) {
  return facts.map((fact) => {
    const [role, summary, detail] = copy[locale][fact.id];
    return {
      ...fact,
      role,
      summary,
      detail,
      period: `${formatMonth(locale, fact.start)} — ${formatMonth(locale, fact.end)}`,
    };
  });
}

export const experience = getExperience('en');
