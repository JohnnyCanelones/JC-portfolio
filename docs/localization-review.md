# Localization review

## Delivered model

English and Spanish use the same routes. The EN/ES control changes keyed copy in place and stores the explicit choice as `portfolio-locale`. There is no `/es`, automatic detection, redirect, cookie, runtime i18n package or framework island. English remains visible and functional without JavaScript.

The homepage, fixed navigation, theme control, experience, expertise, about, contact and footer are localized. All six published project cases have separate Spanish Content Collection entries connected to English through `translationId`. Project technology, public URLs and imagery remain shared facts; editorial descriptions, roles, alternative text, headings and bodies are localized. The résumé remains the verified English PDF and is identified as such in Spanish.

Blog outlines remain unpublished English drafts. No translation changes their publication state, and no blog route is added to production.

## Technical decisions

- `src/i18n/translations/en.ts` defines the dictionary contract; Spanish must satisfy the same deep shape.
- `Intl.DateTimeFormat` formats employment dates at build time with `en-US` and `es-EC`.
- Case routes are generated only from published English entries, then paired with Spanish entries by `translationId`.
- Localized case bodies and TOCs are present in the same static document; only the selected language is exposed to users and assistive technology.
- The switch updates `html.lang`, visible copy, accessible labels, image alternatives, page title and meta description.
- Existing homepage anchors, transition curtain, scroll reveals, theme preference and static publication boundaries are preserved.

## Validation

- `pnpm validate`: passed formatting, lint, Astro and strict TypeScript checks, production build, content-policy tests and nine output tests.
- Static output: 12 pages; no `/es` pages and no published blog.
- In-app browser: verified the homepage switching from English to Spanish without URL change; title, navigation, theme labels, hero, project summaries, localized dates and footer updated.
- In-app browser: navigated to `/projects/wealthos/` with the Spanish preference persisted; verified Spanish breadcrumbs, metadata, TOC, long-form body and related work on the same case URL.
- Responsive automation: 36 route/viewport checks passed at 320, 390, 768, 1024, 1440 and 1920 CSS pixels, with both themes, Spanish text expansion, theme persistence, native TOC, keyboard skip link and no-JavaScript navigation.
- Visual review: inspected English and Spanish mobile/desktop captures in light and dark output. The Purple Editorial layout remained stable with longer Spanish copy and no horizontal overflow.

## Known limitations

- Same-route localization cannot provide independent Spanish canonicals, reciprocal `hreflang`, Spanish sitemap URLs or Spanish rendering without JavaScript. This is the explicit tradeoff of the owner's requested URL model.
- Static crawlers receive the English document and metadata. Do not claim independent Spanish SEO coverage.
- A physical iOS device, screen reader, Firefox and WebKit automation were not available in this review.
- The configured domain is still `https://example.com`; the site remains deliberately `noindex` until launch information is supplied.

## Future review

If independent Spanish search visibility becomes a priority, restore locale routes (`/es`) and reciprocal alternates as a deliberate product change. Do not combine that model with browser-language redirects. Before launch, configure the real domain, rerun Lighthouse and cross-browser checks, and review the public résumé.
