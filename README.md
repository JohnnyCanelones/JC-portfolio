# Portfolio foundation

Static personal portfolio foundation for a software engineer. Phase 1 provides a temporary design system preview; the final site design and real content belong to Phase 2 and Phase 3.

## Stack and prerequisites

- Node.js 24 (see `.node-version`; supported range is `>=22.12.0 <27`)
- pnpm 11.23.0
- Astro 7, TypeScript 6, Tailwind CSS 4, React 19, MDX, Biome 2
- Self-hosted Geist Sans and Geist Mono
- Lucide React and Motion are installed for future interactive components but are not loaded by the current pages.

## Start and validate

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The dev server prints its local URL. Other commands:

| Command | Purpose |
| --- | --- |
| `pnpm build` | Generate the static site in `dist/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm check` | Astro diagnostics and strict TypeScript check |
| `pnpm lint` | Biome lint and import organization check |
| `pnpm format` | Format supported files with Biome |
| `pnpm format:check` | Check formatting without changing files |
| `pnpm validate` | Run format, lint, check, and build |

Phase 1 verification: `pnpm validate` passed (Astro: 0 errors, 0 warnings, 0 hints; TypeScript, Biome, and static build passed). The local dev server returned HTTP 200 for `/`. In this Codex desktop environment, the bundled Node binary restricts native addons, so validation used an ad hoc signed copy of the same Node binary in `/tmp`; this is an environment workaround, not a project dependency.

## Structure

- `src/config/site.ts`: typed profile and SEO configuration.
- `src/content.config.ts` and `src/content/{projects,blog}`: validated content collections and unpublished schema samples.
- `src/i18n`: typed translation keys and locale-aware URL helper.
- `src/layouts/BaseLayout.astro`: shared metadata, fonts, theme initialization, and skip link.
- `src/styles/global.css`: CSS custom properties and Tailwind theme bridge.
- `src/pages`: temporary homepage and 404 page.
- `public`: static favicon, placeholder social image, and restrictive robots file.

The architecture supports `assets`, `components`, `data`, `lib`, and `types` under `src/` as each gains a real use; empty placeholder directories are intentionally omitted.

## Design and theme

Components use semantic Tailwind utilities such as `bg-surface` and `text-foreground`, backed by custom properties in `global.css`. The root defines typography, spacing, radii, container widths, shadows, durations, and colors. Light theme overrides only semantic colors and shadow. Use semantic token names for new components.

An inline head script applies the saved `portfolio-theme` value before first paint. Accepted values are `light`, `dark`, and `system`. With no saved value, the page starts dark. `system` follows operating-system changes. The theme control UI is planned for Phase 2. CSS sets `color-scheme` on the root so browser controls match. Motion is opt-in for users without a reduced-motion preference.

For a manual preview, set `localStorage.setItem('portfolio-theme', 'light')` in browser developer tools and reload. Repeat with `dark` or `system`.

## Content and languages

Projects and blog posts are local Markdown or MDX files loaded through Astro's Content Layer API. Both schemas validate metadata and mark entries as drafts by default. The included entries are technical schema samples, not public work or articles. When adding routes in a later phase, filter `draft` entries out of production output.

English is the default locale at `/`. Astro is configured for Spanish under `/es`, and `src/i18n` provides typed strings and path generation. Complete translated pages and content are deferred.

## Deployment

The production output is static `dist/`, compatible with Vercel static hosting. Before deploying, replace all `YOUR_*` profile values, `example.com` URLs, résumé path, social image, and the `site` value in `astro.config.mjs`; add real content and review robots.txt. This foundation intentionally sets `noindex` on preview pages and disallows crawling. No deployment is configured in CI.
