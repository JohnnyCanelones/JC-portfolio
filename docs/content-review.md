# Content review — Phase 3

Reviewed 2026-11-25. Sources are the owner-supplied résumé, explicit corrections and assets in this conversation, and read-only source inspection for WealthOS. This document is editorial evidence, not a public claim of independent employment verification.

## Publication decisions

| Project | Verified material published | Remaining information / assets | Status and confidentiality |
| --- | --- | --- | --- |
| WealthOS | Personal finance product; Next.js/React/TypeScript frontend; Dexie outbox and owner-scoped records; NestJS/Prisma/PostgreSQL API; versioning/idempotency; Gmail extraction; manual approval default; optional DeepSeek gate; genuine supplied sign-in image and Vercel URL | Project dates, repository sharing permission, sanitized authenticated screenshots, live Render/Neon configuration, ingestion operational status, production reliability measurements | Published source-based case. No credentials, messages, financial records or private source excerpts. Render/Neon are documented deployment choices, not verified live infrastructure. AI fallback code is distinguished from enabled production processing. |
| Green Jurisdictions Database | Owner-corrected name; Earth Innovation Institute; Nov 2023–Apr 2025; maps/search/exports; Next.js/React/Laravel/PostgreSQL; Docker and GitHub Actions responsibilities; database and Tropical Fire Observatory as one project; supplied screenshots and both domains | Queue design, asynchronous CSV implementation, throughput, partner-directory/notification details, architectural diagram and shareable outcomes | Published verified scope summary. No internal infrastructure or export performance claims. Employer code was not inspected. |
| GlobalFinances | Oct 2019–Nov 2022; Full-Stack Developer / Tech Lead; three-developer team; Angular/Laravel/PostgreSQL; approximately 80,000 monthly invoices as platform-wide workload; supplied public URL | Shareable screenshots; database/infrastructure topology; confirmation of MongoDB/AWS project-specific use; exact personal outcomes | Published verified scope summary. No customer data, accounting rules or proprietary code. |
| Breeze Airways | BairesDev engagement Nov 2022–Sep 2023; frontend contributions to booking/accounts/notifications; Angular/Ionic/TypeScript/GraphQL; supplied URL | Authorized screenshots; specific deep-link/offline recovery work; Cypress usage and coverage; architectural detail | Published verified scope summary. No whole-platform ownership, private API or performance claims. |
| Brikmate | Jobsity engagement Oct 2022–Nov 2023; PDF reader, document chat and navigation back to lease sections; Next.js/TypeScript/PostgreSQL; existing verified public link | Public screenshots, model/integration architecture, project operational status and precise metrics | Published verified scope summary. No leases, internal prompts, AI-model ownership or private code. |
| TTB & ISM | Most recent engagement, Apr 2025–Nov 2026; Jobsity/Pixegon relationship retained from résumé; admin dashboard/PWA/mobile audio/EPUB/deep links/Android stability; Angular/Ionic/TypeScript; owner-supplied TTB and ISM links | Authorized screenshots; shareable implementation specifics and outcomes | Published verified scope summary. Administrative screens and APIs are not disclosed. |

Employment periods are reused from `src/data/experience.ts`, including overlaps. No invented day-level dates or project start/end dates. Product operational status stays `unknown` unless the owner confirms it; completed employment does not establish a product's status.

## WealthOS evidence

Read-only inspection used `/Users/johnny/Documents/ChatGPT/wealth-os-pwa` and its documented API repository `/Users/johnny/Documents/repos/wealth-os-api`. Relevant sources include both package manifests and READMEs, frontend `src/db/database.ts`, synchronization and API client modules, `src/pwa/sw.js`, backend Prisma schema and Gmail synchronization service. No environment-secret files were opened. Neither application repository was modified or deployed, and their test suites were not rerun. The architecture figure summarizes inspected boundaries, not production topology.

## Drafts

Six new outlines remain `draft: true`: WealthOS full-stack architecture, asynchronous CSV exports, Dockerizing Next.js, financial automation, mobile connectivity, and a static Astro portfolio. The original foundation draft remains unpublished as well. Local previews use `/blog/_draft/<slug>/` only in development and carry `noindex`. Production has no blog index, article route, navigation link or sitemap entry until an owner-reviewed article is explicitly published. Build fixtures test the future published state in a temporary copy without modifying actual publication flags.

## Before release

- Confirm the final domain; `example.com`, `noindex`, and crawl blocking are intentionally retained.
- Supply a verified GitHub profile/repository URL if it should be visible.
- Review final editorial wording and approve any additional employer implementation detail before adding it.
- Add authorized screenshots for text-only professional projects and sanitized WealthOS product screens when available.
- Review six writing outlines before publication; their dates are draft metadata, not assertions of a public publication date.
- External links supplied by the owner are not evidence of internal architecture or current service availability.
