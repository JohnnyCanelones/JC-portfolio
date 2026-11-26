# Web standards decisions

## Guidance consulted

Modern Web Guidance was queried before frontend implementation. Retrieved guides: `css-layout`, `fluid-scaling`, `typography`, `dark-mode`, `dark-mode-toggle`, `navbar`, `html`, `optimize-image-priority`, `optimize-script-priority`, `responsive-design`, `form-factor-adaptation`, `visually-stable-font-fallbacks`, `improve-text-layout-and-legibility`, `size-aware-styling`, `accessibility`, and `motion`. The Green Jurisdictions gallery also used the `carousel` guide. The WealthOS screenshot update consulted `optimize-image-priority` and `responsive-design`; the portrait update consulted `html` and `optimize-image-priority`. Fixed navigation and motion changes additionally consulted `shrinking-header-on-scroll`, `directional-navigation-transitions`, `same-document-transitions`, and `scrollytelling`. The skill's local instruction file is older than the CLI's latest guide version; the CLI returned the current guides.

The personal `&lt;/&gt;` mark update additionally consulted `icons` and `accessibility`: the favicon uses simple high-contrast SVG paths, while the visible header symbol is decorative and the containing home link retains a localized accessible name.

## Browser policy

Baseline Widely Available is the default. The site must remain usable in current Chrome, Edge, Firefox, Safari, iOS Safari, and Android Chrome. Newly Available features are progressive enhancements with usable fallbacks. Limited-availability features never carry essential content or navigation.

## Applied features

| Feature | Purpose | Compatibility and fallback |
| --- | --- | --- |
| CSS Grid, Flexbox, logical properties, `minmax(0, 1fr)` | Editorial layout and reflow | Widely available; content is in logical DOM order. |
| `clamp()` with rem limits | Fluid type and spacing | Widely available; rem limits preserve zoom behavior. |
| `prefers-color-scheme`, root `color-scheme`, color-scheme meta | System-first light/dark themes and native UI | Works without JavaScript. CSS custom-property overrides cover explicit preferences. |
| Inline head initialization plus `localStorage` | Apply saved explicit theme before first paint | Storage failures leave system theme usable. Selector is hidden without JavaScript. |
| Native `<select>` | Explicit system, light, dark options | Keyboard and touch behavior come from the browser. |
| `font-size-adjust: from-font` | More stable fallback metrics | Optional `@supports`; conventional font stacks remain usable elsewhere. |
| `text-wrap: balance` and `pretty` | Short headings and long about paragraphs | Ignored where unsupported; normal wrapping remains readable. |
| `prefers-reduced-motion` | Avoid spatial motion and smooth scrolling when requested | Static content never depends on animation. |
| Fixed header, `scroll-padding-block-start`, `ResizeObserver` | Keep navigation visible and anchor targets clear | CSS header-height defaults work without script; the observer adjusts for wrapping and zoom. |
| Web Animations API | Layered directional anchor navigation | Feature detected; ordinary hash links work without JavaScript or animation support. |
| `IntersectionObserver` plus Web Animations API | Start editorial entrance sequences when content reaches the reading area | Both are feature detected; content remains static and readable without script or motion support. |
| `forced-colors` | Preserve visible artwork boundaries and links | System colors provide an explicit fallback. |

The mobile Lighthouse run identified the introductory paragraph as LCP, not an image. Its Newsreader regular WOFF2 is the only font preload. The portrait and project screenshots use Astro Image with responsive WebP sources, intrinsic dimensions, and lazy loading below the fold. None is marked high priority because the hero text remains the measured LCP candidate. Future images should receive high priority only if measurement identifies one as the LCP candidate. The SVG favicon is local and requires no script or image request from a third party.

Page JavaScript handles early saved-theme initialization, the native selector, gallery controls, header measurement, directional anchor transitions, and scroll-triggered entrance sequences. The gallery is natively scrollable without JavaScript, using CSS scroll snap. Scroll motion uses one observer and no scroll listener. There are no React islands, animation libraries, analytics scripts, or external font requests. No script fetch-priority override is needed.

## Intentional omissions

- No popover or dialog for the mobile navigation: the four links fit as a wrapping row and work without scripting.
- No container query: the current components occupy the page grid, so ordinary media queries are clearer. Add a container query when a component is reused at different widths.
- No `light-dark()` token dependency: custom-property overrides and a system media query keep the explicit theme implementation straightforward across browsers.
- No anchor positioning or animation polyfills. Native same-document View Transitions were tested for anchor jumps, but the fixed header disappeared briefly during the snapshot transition. A small Web Animations sequence keeps it visible.
- No scroll listener or parallax. Native CSS scroll timelines were tested first, but their subtle, continuous effect did not make section arrivals apparent. The requested behavior is an entrance sequence when a block enters the viewport, so `IntersectionObserver` starts a short Web Animations sequence once per block. The observer disconnects from each target before its transform starts, preventing intersection feedback and repeated cancellation. No initial hidden state is set in CSS.
- No fabricated application images or decorative high-priority media.

## Verification policy

Check 320, 390, 768, 1024, 1440, and 1920 CSS-pixel widths, both color schemes, keyboard access, zoom, and forced colors where tools permit. Run `pnpm validate`, inspect a production build, and report measured lab results separately from field Core Web Vitals. Targets are Lighthouse performance ≥95, accessibility 100 where practical, best practices ≥95, SEO 100 after the real domain is configured, LCP ≤2.5s, INP ≤200ms, CLS ≤0.1, and initial compressed JavaScript ≤30KB. These are targets, not claims.

## Phase 2 measurements

The production build was served locally and tested with Lighthouse in mobile mode. These are laboratory measurements, not real-user field data.

| Measurement | Result |
| --- | --- |
| Lighthouse Performance / Accessibility / Best Practices / SEO | 100 / 100 / 100 / 66 |
| First Contentful Paint | 0.8 s |
| Largest Contentful Paint | 0.8 s (`p.hero-intro`) |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0.001 |
| Initial compressed JavaScript | 519 B gzip (inline theme scripts) |

Lighthouse does not provide a field INP value in this local test. The historical SEO score was below target because that build used a placeholder domain, `noindex`, and a restrictive `robots.txt`. The production domain is now configured and page-level `noindex` has been removed, but `robots.txt` still blocks indexing pending explicit launch approval. No image was the measured LCP candidate. React's client bundle is emitted by the installed Astro integration but is not referenced by this homepage.

The initial Phase 2 visual review included 1440-pixel desktop and 390-pixel mobile screenshots in both themes and two refinement passes. A DOM overflow check passed at 320, 390, 768, 1024, 1440, and 1920 CSS pixels. Keyboard navigation and the theme selector were exercised in the browser. Automated accessibility and Lighthouse audits passed; a physical iOS device, screen reader, JavaScript-disabled browser, Firefox, and WebKit were not available in that run. The measurements above predate the supplied project screenshots and navigation motion and should be rerun before launch. The later navigation review confirmed a fixed header and unobscured anchor targets at 1280 and 390 CSS pixels, including the layered transition in dark mode.

The current production HTML contains five inline scripts totaling approximately 3 KB when each is gzip-compressed separately. It references no external JavaScript bundle. This build-size check is not a replacement for a new Lighthouse run or field INP measurement. In the in-app browser, scrolling into Work and WealthOS visibly triggered the entrance sequence; the same trigger ran at 390 CSS pixels without horizontal overflow.

The current scroll treatment uses clip-path reveals on headings (650ms, 16px translation) and selected images (850ms horizontal wipe). Paragraphs and experience rows stay static. Each target is unobserved before animation, preventing retriggers. Focusing a heading cancels its reveal so its focus outline is not clipped. Reduced-motion users receive static content. Desktop and 390px browser review showed the image wipe completing with no residual clipping or horizontal overflow. Previous bundle and performance measurements predate this revision.

Reveal initialization now prepares and pauses each offscreen target at its first keyframe before observing it. Intersection plays that same animation, eliminating the visible-image-then-hide flash. Initially visible targets are skipped; disabled JavaScript leaves normal visible markup. Reduced motion cancels both pending and running animations.

## Phase 3 — editorial content

Guidance searched with `modern-web-guidance@latest search "accessible responsive technical articles and editorial case studies"`. Retrieved relevant guides: `typography`, `css-layout`, `accessibility`, `responsive-table`, `scrollspy`, `navbar`, `html`, `optimize-image-priority`, and `cross-document-transitions`.

Selected patterns: 68ch prose, rem-bounded fluid headings, logical properties, `minmax(0, 1fr)` grids, sticky desktop TOC with native anchors, compact mobile TOC, build-time Shiki highlighting, native overflow for code and tables, semantic figure/figcaption diagrams, and responsive Astro images. The existing project container query remains; page-level breakpoints use ordinary media queries. Current-page navigation uses an underline plus `aria-current`.

Baseline Widely Available remains the default. Unsupported `text-wrap: pretty`/`balance` falls back to normal wrapping. No essential feature needs a polyfill. Navigation, article text, related work and TOCs work without JavaScript. Theme persistence uses the existing small script with OS fallback. Native full-page navigation is retained without a client router or additional route animations; TOC clicks do not use the homepage transition curtain.

Intentionally avoided: active-scroll tracking, dialogs/lightboxes, runtime Markdown or Mermaid, copy-code scripting, new animation packages, search/filter controls for six projects, SSR and CMS services. Static galleries already provide the necessary evidence. Cross-document transitions were reviewed and not adopted because immediate document navigation is sufficient for this reading-focused phase.

Astro 7 uses its native Markdown processor. No legacy remark/rehype processor was installed just for wrapping tables. Author technical tables with native table/caption/th elements in a `.table-scroll` region with a descriptive accessible label and `tabindex="0"`. Shiki's build-time transformer gives code blocks keyboard scrolling and a region label. The unpublished Astro outline demonstrates both patterns. Dark syntax styles override Shiki's generated inline colors deliberately.

Content IDs use filenames independently of frontmatter route slugs, preventing the loader from silently overwriting duplicates before validation. Route collisions fail the build, including draft collisions within a language. Schema refinement checks image alternative text and chronological dates. Publication helpers govern every public listing, route, related list and sitemap. Language/translation identifiers prepare Phase 4 without publishing Spanish routes.

The shared social image is an original typographic 1200×630 PNG, with editable SVG source. It contains no application mockup. Only the critical serif font is preloaded; article screenshots below the fold are lazy-loaded. The measured directory LCP image is eager/high-priority only on that route. See `phase3-validation.md` for measured results and remaining platform/device checks.

## Homepage navigation correction

Restored owner-preferred section navigation after Phase 3. Consulted `scrollspy` guidance for native fragment links; no active-scroll tracker was needed. On the homepage, fragment-only links reuse the existing transition curtain and scroll reveals. On case-study pages, `/#…` links return to the matching homepage section. Reduced-motion and no-JavaScript visitors use native anchors. No animation library or client router was introduced.

## Phase 4 — same-route localization

Modern Web Guidance was searched for accessible multilingual navigation and internationalized typography. Retrieved `accessibility`, `typography`, `navbar`, and `responsive-design`. Applied guidance includes a correct dynamic document `lang`, native buttons with exposed pressed state, rem-bounded typography, wrapping navigation, visible focus, and layouts tolerant of text expansion. Official Astro internationalization documentation and MDN guidance for `lang` and alternate link relationships were also reviewed.

The initial specification requested unprefixed English plus `/es`. The owner subsequently required the same URL with keyed copy. The final architecture therefore uses one static document per content route, English as the no-JavaScript fallback, typed build-time dictionaries, localized Content Collection entries embedded in the corresponding case, and a small script that updates copy, document language, title, description, alternative text and localized content visibility. The explicit setting is stored in `localStorage`; storage failure affects persistence only.

No browser-language detection, automatic redirect, cookie, locale library, React island or duplicated `/es` route is used. Because two locale-specific resources do not exist, emitting `hreflang` values pointing to the same URL would misrepresent the document relationship and is intentionally avoided. This trades independent Spanish indexing and Spanish no-JavaScript rendering for the owner's preferred stable URLs. Canonical URLs remain single and English metadata remains the static crawler fallback. The production domain is configured; launch indexing remains intentionally blocked only by `public/robots.txt` until approval.

## Phase 6 certification interface

Modern Web Guidance guides consulted: `forms`, `html`, `css-layout` and `accessibility`. The implementation uses a semantic `<search>` region, visible labels, native search/select/button controls, a semantic list, logical properties, intrinsic Grid tracks and a size container query for credential rows. `<search>`, container queries, Grid and Flexbox are Baseline Widely Available for the supported browser policy.

The complete archive is server rendered. Client JavaScript only filters and reorders existing list items; it performs no network request and injects no external HTML. Without JavaScript the controls are hidden and every credential remains available in recent-first order. Dynamic result counts use a polite status region after direct user input. Focus relies on the existing high-contrast `:focus-visible` treatment.

Features intentionally avoided include custom selects, hydrated React, browser-side Platzi requests, certificate artwork, pagination that hides content, popovers, masonry and animated filtering. The compact list avoids layout shift and introduces no images or third-party scripts.
