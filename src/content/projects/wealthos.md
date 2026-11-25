---
slug: wealthos
translationId: wealthos
projectType: personal
title: WealthOS
description: A personal finance management platform focused on transaction tracking and intelligent financial automation.
category: Personal project / Financial technology
technologies: [Next.js, NestJS, TypeScript, PostgreSQL, PWA]
coverAlt: WealthOS sign-in screen with a burgundy introduction and dark login form.
coverImage: ../../assets/projects/wealthos-sign-in.png
demoUrl: https://wealth-os-pwa.vercel.app/
featured: true
order: 1
presentation: feature
language: en
draft: false
---
## The product

WealthOS is my personal finance application for tracking accounts, transactions, categories, budgets, and goals. Its engineering focus is keeping useful financial workflows available when connectivity changes, while giving automation explicit boundaries.

This case study describes the inspected application source. It distinguishes implemented code from deployment configuration and does not claim that every integration is enabled in the public deployment.

## Architecture

The frontend uses Next.js App Router, React, and TypeScript. TanStack Query handles remote data, Zustand holds application state, and Dexie provides an IndexedDB database for user-scoped local records and pending operations. A separate NestJS API uses Prisma with PostgreSQL.

<figure class="architecture">
<figcaption>WealthOS system boundaries — simplified from the inspected source</figcaption>
<ol>
<li><strong>Browser application</strong><br />Next.js / React UI ↔ Dexie local records and outbox. The service worker stores public application shells and assets.</li>
<li><strong>API boundary</strong><br />REST requests, session refresh, idempotency keys, and record versions connect the browser to the separate NestJS service.</li>
<li><strong>Persistent data</strong><br />NestJS services use Prisma to access PostgreSQL. Financial amounts use decimal database fields.</li>
<li><strong>Optional ingestion</strong><br />The API connects to Gmail through OAuth. Matching rules extract candidate transactions; an optional DeepSeek fallback is gated by configuration.</li>
</ol>
</figure>

The frontend and backend can evolve independently, but that separation requires a deliberate API contract. The browser must represent pending writes, rejected operations, and conflicts instead of assuming that a successful local edit is already committed remotely.

## Writing while offline

A transaction edit updates local storage and appends an outbox operation. The queued operation retains its owner, payload, idempotency key, base version, and retry state. Operations can also express dependencies on earlier writes.

The synchronization loop runs on connectivity recovery, window focus, and a periodic timer. It claims pending operations before sending them, so an edit made while synchronization is active does not silently replace the payload being processed.

### Retries and duplicate operations

Retries send the same idempotency key. Transient failures use exponential backoff with jitter. Pending edits can be coalesced, and creating then deleting an unsynchronized record can remove the pending creation instead of sending both operations.

This adds local state and reconciliation logic, but allows the interface to acknowledge a local change without requiring a successful round trip for every action.

### Concurrent edits

Updates send the base record version through `If-Match`. On a conflict, the client compares the original snapshot, local changes, and server state. Non-overlapping changes can be retried with a refreshed version; conflicting fields remain available for explicit resolution.

The trade-off is intentional: automatic merging handles independent edits, while meaningful disagreements require a decision. The source contains controls for choosing local or server values rather than silently overwriting every conflict.

## Keeping the offline shell separate from financial data

The production service worker precaches route shells, scripts, styles, icons, and fonts. It excludes API responses, mutation requests, tokens, and React Server Component requests from that cache.

Financial records and pending operations live in user-scoped IndexedDB stores. Signing in for the first time still requires connectivity. Offline dashboard and report snapshots depend on having loaded that information online previously.

This boundary keeps the application shell available without treating an HTTP response cache as the financial database. It also makes origin identity important: changing the application's domain or port does not automatically migrate the browser's local data.

## Email-based transaction ingestion

The backend includes a Gmail integration with OAuth, per-connection bank rules, import records, and synchronization runs. It first reads message metadata, matches enabled rules, and then extracts a candidate transaction from matching messages.

Duplicate detection includes the provider's message identifier. Candidates retain extraction metadata, warnings, and confidence alongside their import status.

### Approval and automation

Manual approval is the schema default. Automatic mode is a separate user setting, and automatic import is conditional on the extraction checks in the service. The implementation does not treat every detected email as a valid financial transaction.

The DeepSeek extraction fallback exists in the source, but is configuration-gated. The deployment instructions keep it disabled until the relevant data-processing requirements are approved. Its existence in code is not evidence that AI processing is enabled in production.

## Validation and privacy boundaries

Financial values use decimal fields in PostgreSQL. Frontend validation uses Zod, and the API includes DTO validation, authorization checks, and optimistic version handling.

Access tokens remain in memory, while refresh sessions use HttpOnly cookies. API-key administration is an online workflow: complete credentials are shown only when created and are kept out of the offline mutation queue and persisted frontend caches.

These are implementation boundaries, not a claim of a completed external security audit. The screenshot below shows the supplied sign-in screen and contains no financial account data.

## Deployment and current status

The public frontend link is hosted on Vercel. The API repository documents Render for the service and Neon for PostgreSQL, including separate migration commands. Those hosting instructions were inspected; the live backend configuration was not audited.

The codebase includes unit and browser tests for areas such as offline reopen, queued writes, transaction editing, and API-key management. Their presence supports the intended behavior, but this portfolio review did not rerun the application's full test suite or measure its production reliability.

## Engineering takeaways

The central trade-off is between an immediate local experience and the complexity of reconciling it with a shared backend. The outbox, version checks, and conflict state make that complexity explicit.

A next step is to measure recovery behavior under realistic network interruptions and document the operational state of the ingestion pipeline. That would complement the source-level account here with production evidence.
