# Phase 3 validation

Date: 2026-11-25. No deployment performed.

## Production and content checks

- `pnpm validate`: formatter, lint, Astro/TypeScript checks, static build and 11 automated assertions/tests passed. No type errors or warnings. Twelve HTML pages including 404, plus sitemap; no public blog while all articles are drafts.
- `pnpm test:publishing`: passed in an isolated temporary copy. An explicitly published fixture generates blog index/detail, syntax highlighting, scoped table headers, TOC, navigation and sitemap. Other drafts stay excluded. Duplicate slugs (including a draft collision) and reversed publication/update dates reject the build. Real content is unchanged.
- Output tests cover required routes, one main/h1, unique titles, metadata, structured JSON-LD, existing social assets, internal links and anchor targets, intrinsic image sizes, optional imagery, sitemap, draft exclusion and compressed JS budget.
- CI runs the output tests and isolated publication tests after build. Node 24 and Python 3 are required. There was no prior automated browser suite to extend.

## Browser checks

Playwright Chromium tested production preview at `127.0.0.1:4322`. Six routes × widths 320, 390, 768, 1024, 1440 and 1920 passed page-overflow checks. Light/dark theme selection was checked across those routes, including persistence on navigation/reload and system-theme changes. Native TOC offsets clear the fixed header. Keyboard skip-to-content, code-region focus/scrolling, forced-colors focus and JavaScript-disabled content/navigation checks passed. Draft article previews were tested separately on the development server at port 4321.

Manual in-app browser review covered projects, WealthOS, Green Jurisdictions, experience, about and the unpublished article layout in mobile/desktop and both themes. A refinement pass removed duplicate introductions, made the mobile TOC compact, constrained desktop TOC height, and removed an empty related-writing section. Screenshot review also checked the portrait, diagram, technical table and code overflow. Full-page captures wait for image decoding; capturing before decode had produced an empty portrait in an early test artifact.

Reproduce optional browser checks with an existing Playwright installation:

```sh
pnpm preview --host 0.0.0.0 --port 4322
# In another terminal; install/use Playwright separately from shipped dependencies.
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/browser-check.mjs
```

`QA_URL` and `QA_OUTPUT` can override the preview address and screenshot directory. The run generated 24 production full-page screenshots at `/tmp/portfolio-phase3-qa`, plus article and forced-colors captures. Selected durable captures:

- [Project directory, desktop dark](qa/projects-desktop-dark.png)
- [Unpublished article, mobile dark](qa/blog-draft-mobile-dark.png)

## Production lab measurements

Lighthouse mobile-default runs against the static preview, not development or field traffic:

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| WealthOS case | 100 | 100 | 100 | 69 | 0.9 s | 0 | 0 ms |
| Projects directory, final | 100 | 100 | 100 | 69 | 1.8 s | 0 | 0 ms |

WealthOS LCP is the text introduction (`.article-deck`). The directory LCP is its featured WealthOS image: the measured candidate was changed from lazy loading to eager loading with high fetch priority on that route only. The final LCP discovery audit passes. The homepage still lazy-loads its below-fold project image. Gallery accessible names now include visible labels; the final label/name audit passes.

SEO is intentionally below target because `site.url` is still `https://example.com` and indexing is disabled. No scores are promised for a future deployed origin. INP requires interaction/field evidence and was not measured; TBT is reported separately, not as an INP substitute.

Initial direct JavaScript, gzip-compressed including inline executable scripts: homepage 3,128 bytes; directory 2,479 bytes; WealthOS/about 1,823 bytes each. All are below 30 KB. No React hydration, client router, runtime Markdown or diagram runtime was added. Final build with cached optimized images took approximately 0.7 seconds; this is a local build timing, not a runtime performance claim.

Raw lab JSON files: `/tmp/phase3-lighthouse-wealthos.json` and `/tmp/phase3-lighthouse-projects-final.json`.

## Practical limits

- Firefox and WebKit binaries were unavailable; these engines and real iOS/Android devices were not tested. Browser compatibility is based on conservative native features, not a claim of a complete device matrix.
- Reflow was tested down to 320px; actual browser-menu 200% zoom and a dedicated screen-reader session remain manual release checks.
- Lighthouse accessibility and keyboard/semantics review are not a WCAG certification.
- WealthOS source was inspected, but its own tests, live integrations and deployment configuration were not audited.
- Final domain, verified GitHub URL, additional authorized project imagery and deeper employer architecture details remain pending in `content-review.md`.

## Changed areas and dependencies

Created editorial/page layouts; project directory/details; experience/about/contact; conditional blog routes; sitemap endpoint; content policy/helpers; prose styles; six draft outlines; long-form project content; output/publication/browser QA scripts; social PNG/SVG; content and validation documentation. Updated collection schemas, navigation, homepage project links, experience IDs, Astro syntax-highlighting config, site social metadata, package scripts and CI checks, plus AGENTS/PLAN/README/DESIGN/web standards.

No dependencies were added or removed in Phase 3. Existing Astro image tooling generated the committed PNG. Existing external Playwright and Lighthouse installations were used only for QA. Earlier Phase 2 dependency changes in the working tree were preserved.

Phase 4 recommendation: translate owner-reviewed content using the existing language/translation IDs, keep stable route slugs, and add locale navigation plus hreflang only when corresponding translated pages exist. Deployment remains a separate approved phase.

## Owner-requested navigation restoration

Global navigation again targets homepage sections. Verified all four transition curtains in Chromium at 390px and 1440px without document reloads (unchanged performance time origin), prepared scroll-reveal animations, case-page return to `/#about`, reduced-motion native anchors, and JavaScript-disabled navigation. Both themes were visually checked. Output regression tests now require fragment links on the homepage and `/#…` links on case-study pages. Dedicated content pages remain secondary destinations, not global-navigation replacements.
