# Portfolio plan

| Phase | Scope | Status |
| --- | --- | --- |
| 1. Foundation | Astro, TypeScript, Tailwind, tokens, theme, content schemas, i18n, SEO, CI, temporary preview | Complete |
| 2. Portfolio | Final visual design, navigation, footer, real homepage, project and blog pages, accessible theme control | Not started |
| 3. Content and launch | Real biography and work samples, translations, image optimization, accessibility and performance review, deployment | Not started |

## Phase 1 decisions

- Static generation only; no backend or service credentials.
- English routes are unprefixed; Spanish routing is prepared under `/es` without duplicating pages yet.
- Dark is the initial theme. A future control can store `light`, `dark`, or `system` under `portfolio-theme`.
- Draft content entries exist only to validate schemas and are not routed.
- Placeholder profile data, example domain, résumé path, and social image must be replaced before launch.
