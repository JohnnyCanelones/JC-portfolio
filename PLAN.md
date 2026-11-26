# Portfolio plan

| Phase | Scope | Status |
| --- | --- | --- |
| 1. Foundation | Astro, TypeScript, Tailwind, tokens, theme, content schemas, i18n, SEO, CI, temporary preview | Complete |
| 2. Portfolio | Purple editorial identity, navigation, theme control, homepage, selected work, experience, expertise, about, contact | Complete |
| 3. Professional content | Static case studies, professional pages, editorial/blog infrastructure, SEO, content verification and QA | Complete; documented QA limitations |
| 4. Internationalization | Typed English/Spanish copy, same-route language control, localized professional content and QA | Complete; same-URL owner override documented |
| 5. Launch | Final domain, indexing and deployment approval | Not started |
| 6. Certifications | Validated credential archive, public Platzi synchronization, filters and scheduled PR workflow | Complete locally; workflow requires repository permission verification |

## Phase 1 decisions

- Static generation only; no backend or service credentials.
- English routes are unprefixed; Spanish routing is prepared under `/es` without duplicating pages yet.
- Dark is the initial theme. A future control can store `light`, `dark`, or `system` under `portfolio-theme`.
- Draft content entries exist only to validate schemas and are not routed.
- The supplied CV populated the verified profile fields and résumé. GitHub URL, site domain, social image, and curated project content remain pending before launch.

## Phase 2 decisions

- Phase 2 established a single editorial homepage. Phase 3 adds the requested professional routes and native global navigation.
- The header is fixed. Anchor navigation uses layered directional motion while preserving native hash links; key editorial blocks animate once when they enter the reading area during scrolling. Reduced-motion and unsupported browsers remain static.
- Verified projects live in Content Collections. Professional experience and expertise data live in `src/data/`.
- A mobile Lighthouse run identified the introduction as LCP, so only its Newsreader font is preloaded. WealthOS uses Johnny's sign-in screenshot and public link. The Green Jurisdictions project uses two screenshots, each linked to its public domain.
- TTB and ISM are shown together as Johnny's most recent selected work. Breeze and GlobalFinances now use the URLs he supplied.
- Johnny's supplied portrait appears in About. The favicon uses his `&lt;/&gt;` tattoo as an authentic personal mark; the header pairs it with his initials as `JC&lt;/&gt;`.
- The system color scheme is now the first-visit default. Explicit light and dark choices are persisted.
- GitHub is omitted from visible links until its URL is verified.
- Production Lighthouse mobile lab results: Performance 100, Accessibility 100, Best Practices 100, SEO 66. SEO remains below target because the site is deliberately `noindex` while its configured domain is a placeholder and `robots.txt` disallows crawling.
- Visual review covered desktop and mobile in both themes, with two refinement passes. Responsive overflow checks passed at 320, 390, 768, 1024, 1440, and 1920 CSS pixels.

## Phase 3 delivery

- [x] Audit existing foundation and run baseline validation.
- [x] Consult Modern Web Guidance and preserve Purple Editorial identity.
- [x] Extend schemas, publication helpers, stable slugs, language IDs and draft isolation.
- [x] Shared editorial layout, native TOC, reading time, syntax highlighting, tables and static diagrams.
- [x] Project directory and six published cases, including owner-requested TTB & ISM.
- [x] Verify WealthOS against frontend and API source; distinguish code from deployment evidence.
- [x] Experience, about and contact pages; centralized dates and genuine portrait.
- [x] Conditional blog infrastructure and six unpublished outlines.
- [x] Sitemap, structured data, metadata and social image.
- [x] Automated publication tests, isolated published-blog fixture and responsive visual review.
- [x] Content review and architecture documentation.

Missing optional material and launch prerequisites are tracked in `docs/content-review.md`. QA results and platform limitations are recorded in `docs/phase3-validation.md`.

- Owner preference: global Work/Experience/About/Contact navigation uses homepage anchors (`/#work`, `/#experience`, `/#about`, `/#contact`). Preserve the homepage section-transition and scroll-reveal animations. Case-study pages remain secondary links from project titles, not replacements for the one-page navigation.

## Phase 4 delivery

- [x] Typed domain dictionaries with compile-time English/Spanish parity.
- [x] Same-URL EN/ES control with persisted explicit preference and English no-JavaScript fallback.
- [x] Homepage, experience, expertise, about, contact, theme, navigation and footer copy localized.
- [x] Six independently authored Spanish project entries linked by `translationId`.
- [x] Localized case headings, TOC, metadata, related work, dates and résumé labeling.
- [x] Blog drafts remain drafts and were not automatically translated or published.
- [x] Browser review verified homepage and WealthOS switching without changing routes.
- [x] `pnpm validate` passes with the static twelve-page output.

The original `/es` routing requirement was superseded by the owner's explicit request to keep one route and switch keyed copy in place. This removes locale-specific canonicals and `hreflang`; English remains the crawlable static fallback. See `docs/localization-review.md`.

## Phase 6 delivery

- [x] Researched the public profile, anonymous pagination, documented Business API, terms and robots directives.
- [x] Imported 32 course completions and one learning path with public diploma verification URLs.
- [x] Added validated generated, manual and override data layers with stable IDs and atomic synchronization.
- [x] Added dry-run, bounded retries, timeouts, pagination limits, incomplete-response protection and preservation of missing records.
- [x] Added same-route bilingual `/certifications/`, native search/filter/sort controls and JavaScript-disabled fallback.
- [x] Added four explicitly configured featured credentials and a compact homepage preview.
- [x] Added static metadata, structured credential data and sitemap integration.
- [x] Added daily/manual GitHub Actions automation that validates and opens a content PR only on change.
- [x] Added fixture-based extraction, validation, override and idempotency tests.

The requested `/es/certifications` route was not created because the owner-established permanent localization convention requires the same URL for both languages. The undocumented Platzi personal-profile endpoint is isolated behind an adapter and documented as a maintenance risk.
