# Johnny Canelones — portfolio

A static, editorial portfolio for a full-stack software engineer. The homepage and six technical cases support English and Spanish on the same public URLs; professional pages cover experience, background and contact.

Phase 2 is complete locally. The production build passed `pnpm validate` and scored 100 / 100 / 100 / 66 in a mobile Lighthouse lab run (Performance / Accessibility / Best Practices / SEO). The SEO score reflects deliberate `noindex` protection before a real domain is configured; see [docs/web-standards.md](docs/web-standards.md) for measurements and test limits.

## Stack

- Astro 7 with strict TypeScript 6 and static generation
- Tailwind CSS 4 through the Vite plugin, plus focused native CSS
- Content Collections for projects and blog infrastructure
- Manrope, Newsreader, and IBM Plex Mono, served locally; licenses in `licenses/fonts/`
- Biome for supported files and Astro Check for `.astro`
- React, Lucide, and Motion remain installed from Phase 1 but are not hydrated or used by the homepage

## Local development

Requires Node 24 (supported range `>=22.12.0 <27`) and pnpm 11.23.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

| Command | Purpose |
| --- | --- |
| `pnpm build` | Generate the static site in `dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm check` | Astro and TypeScript checks |
| `pnpm lint` | Biome lint and import checks |
| `pnpm format` | Format supported files |
| `pnpm format:check` | Check formatting |
| `pnpm validate` | Run format, lint, check, and build |

This Codex desktop environment's bundled Node binary restricts native addons. Local validation here uses an ad hoc signed copy of the same binary in `/tmp`; normal installations do not need that workaround.

## Content architecture

- `src/config/site.ts`: verified identity, availability, URLs, and SEO defaults. No visible placeholder GitHub link is emitted.
- `src/content.config.ts` and `src/content/projects/`: validated English and Spanish project entries linked by `translationId`.
- `src/content/blog/`: validated drafts only; no blog route yet.
- `src/data/experience.ts` and `src/data/expertise.ts`: factual resumeand capability data separate from markup.
- `src/components/`: static Astro layout and section components; one native theme select has a small script.
- `src/assets/johnny-portrait.png`: Johnny's supplied profile photo, rendered in About as responsive WebP images.
- `public/favicon.svg`: Johnny's `&lt;/&gt;` tattoo symbol, matching the `JC&lt;/&gt;` header wordmark.
- `src/layouts/BaseLayout.astro`: document metadata, font preload, color scheme initialization, and skip link.
- `src/styles/global.css`: light and dark semantic tokens, Tailwind bridge, typography, and editorial layout.
- `src/i18n/`: typed domain dictionaries, date formatters and same-route locale helpers.

Employment facts come from Johnny's supplied résumé. WealthOS details were supplied in the Phase 2 brief; Johnny supplied its sign-in screenshot and public URL. He also supplied two screenshots and URLs for Green Jurisdictions Database and Tropical Fire Observatory, which appear as one project with two linked gallery slides. TTB and ISM are grouped as the most recent selected-work entry, with separate public links. Breeze and GlobalFinances have their supplied public links.

## Design and browser behavior

Read [DESIGN.md](DESIGN.md) for art direction and [docs/web-standards.md](docs/web-standards.md) for Modern Web Guidance, browser support, fallbacks, and performance budgets. The site is static first and uses no React island. Navigation remains visible and usable without scripting.

The fixed header links to sections of the same page. With motion enabled, anchor navigation uses a brief two-layer purple transition. Section titles reveal vertically and selected images wipe horizontally as they reach the viewport; body text remains stable. Reduced-motion users and browsers without animation support retain ordinary hash navigation and visible content.

The first visit follows the operating system theme. The compact select lets users save an explicit light or dark choice, or return to system. The head script applies a saved override before rendering; if JavaScript or storage is unavailable, the system theme remains usable.

The EN/ES control switches keyed interface copy and localized case-study content without changing the URL. The explicit preference is stored as `portfolio-locale`; there is no browser-language detection, redirect, cookie, framework hydration or i18n package. English is the static fallback when JavaScript is disabled. This owner-selected model deliberately does not emit locale `hreflang` links because both languages share one canonical URL.

## Deployment boundary

The output is static `dist/`, suitable for Vercel static hosting. CI validates pull requests and pushes to `main`; it does not deploy. Before deploying:

1. Replace `https://example.com` in `src/config/site.ts` with the real domain.
2. Provide a verified GitHub URL if it should appear.
3. Review the downloadable resumeat `public/resume.pdf`; it contains a phone number.
4. Replace the provisional social sharing image, add real screenshots for remaining projects where permitted, and review content with Johnny.
5. Remove the homepage's temporary `noindex` condition and review `public/robots.txt`, which currently disallows crawling.

No deployment has been performed.

## Phase 3 content workflow

Published project routes live under `/projects/`; professional pages are `/experience/`, `/about/`, and `/contact/`. Markdown is stored in `src/content/`. The shared editorial layout derives headings and reading time at build time. Employment dates come from `src/data/experience.ts`.

Blog entries default to drafts. Preview locally at `/blog/_draft/<slug>/`. No `/blog/` route or navigation entry is generated until an owner-reviewed article is published. Keep route slugs unique per language; filename IDs are independent. Consult `docs/content-review.md` before adding professional claims.

Run `pnpm validate` (format, lint, types, build and output tests), then `pnpm test:publishing` for isolated content-schema/publication fixtures. Tests require Node 24 and Python 3. Browser checks are optional and use an existing Playwright installation; see `docs/phase3-validation.md`. No browser-testing package is shipped to visitors.

The domain remains provisional, and indexing remains disabled. Do not deploy or enable indexing without the owner's explicit launch approval.
