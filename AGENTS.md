# Repository instructions

- Prefer Astro components for static content. Use React only when client-side interactivity is necessary.
- Use strict TypeScript and avoid `any`.
- Prefer semantic HTML and follow accessibility best practices.
- Use the centralized design tokens in `src/styles/global.css`; do not hardcode component colors.
- Keep content in Content Collections and configuration, separate from presentation.
- Minimize client-side JavaScript, dependencies, and premature abstractions.
- Never fabricate professional information or expose secrets or confidential information.
- Run `pnpm validate` before completing a task.
- Do not modify unrelated files.
- Do not deploy without explicit approval.

## Permanent frontend conventions

- Keep the site static first. Use Astro for page structure and native browser controls before adding client-side frameworks.
- Search and retrieve relevant Modern Web Guidance guides before frontend work; apply only patterns that solve a real need.
- Target Baseline Widely Available features. Use newer features as progressive enhancements with a usable fallback; do not require polyfills for decoration.
- Preserve the Purple Editorial identity: warm neutrals, deep plum, selective lavender, Manrope, Newsreader, and IBM Plex Mono. Avoid generic SaaS composition, gradients, fake interfaces, and repetitive card grids.
- Keep navigation and content usable without JavaScript. Theme overrides may use a small script; default to the operating system preference.
- Check keyboard operation, visible focus, contrast, reflow, reduced motion, and forced-colors behavior when changing UI.
- Use authentic work descriptions and real assets. Omit unverified links and never invent product screenshots.
- Visually inspect both themes on desktop and mobile after meaningful design changes, then run `pnpm validate`.

## Editorial content conventions

- Route slugs and internal collection IDs must remain separate. Reject duplicate language/slug pairs, including drafts, before route generation.
- Use publication helpers for routes, indexes, related content and sitemap. Blog outlines require owner review before changing `draft` to false.
- Keep development draft previews `noindex` and exclude them entirely from production output.
- Reuse `src/data/experience.ts` for employment dates. Never infer day-level dates or product status from employment dates.
- Use the shared editorial layout and build-time headings/reading time. Native TOC anchors must clear the fixed header and work without JavaScript.
- Author technical tables with caption, scoped headers and a labeled keyboard-scrollable `.table-scroll` wrapper. Use fenced code for build-time syntax highlighting.
- Record evidence and pending claims in `docs/content-review.md`. Distinguish source-implemented integrations from enabled production services.
- Run `pnpm validate` and `pnpm test:publishing` after content infrastructure changes. Optional browser QA is documented in `docs/phase3-validation.md`.

- Owner preference: global Work/Experience/About/Contact navigation uses homepage anchors (`/#work`, `/#experience`, `/#about`, `/#contact`). Preserve the homepage section-transition and scroll-reveal animations. Case-study pages remain secondary links from project titles, not replacements for the one-page navigation.

## Localization conventions

- English and Spanish share the same public URL. Do not add `/es` routes unless the owner explicitly reverses this decision.
- Store interface copy in the typed domain dictionaries under `src/i18n/translations/`; Spanish must satisfy the English dictionary shape at compile time.
- Persist only the explicit `en`/`es` interface preference under `portfolio-locale`. Do not infer language from the browser, redirect visitors, use cookies, or add an i18n runtime dependency.
- English is the static and no-JavaScript fallback. Language switching may progressively enhance the same document with minimal client JavaScript.
- Keep long-form project translations as separate Content Collection entries linked by `translationId`. Do not publish a Spanish blog translation merely because its English source is published.
- Translate controls, metadata, dates, alternative text, and document titles—not only visible paragraphs. Label the existing résumé as English in Spanish UI.
- Because both languages share one canonical document, do not emit misleading reciprocal `hreflang` URLs. Record this owner-selected SEO tradeoff in localization documentation.

## Certification conventions

- Treat external credential data as untrusted. Validate dates, HTTPS URLs, stable IDs, supported types and duplicates before writing or rendering.
- Keep generated Platzi data, manual credentials and editorial overrides separate. Synchronization may update only `src/data/certifications/platzi.json`.
- Never label a course completion or learning path as an accredited professional certification. Preserve original credential titles and omit unavailable metadata.
- Do not add Platzi credentials, cookies or private tokens. Stop automated extraction if the anonymous public mechanism becomes restricted or unreliable.
- Keep the certifications archive static and complete without JavaScript; search and filtering are progressive enhancements.
