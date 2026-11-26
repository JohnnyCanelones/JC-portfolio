# Certifications and Platzi synchronization

## Feasibility decision

Johnny's public profile at `https://platzi.com/p/johnnyCanelones/` is server rendered and publicly identifies 32 approved courses and one completed learning path. Its embedded application state includes the first course page. The public profile's own client loads subsequent pages anonymously from `https://api.platzi.com/students/v1/diplomas/{username}/` and learning paths from the corresponding `learning-paths` resource.

Platzi does not document these personal-profile resources as a supported public API. The documented Platzi Business API requires business credentials and is not applicable to a personal portfolio. The integration therefore treats the anonymous profile resources as a fragile public extraction mechanism, not as a contractual API.

Research performed on 2026-11-25 found:

- The profile and diploma verification links are accessible without a session.
- The profile exposes exact completion dates, course IDs, slugs and public diploma URLs.
- The public pagination resources return the complete 32-course and one-path history.
- `platzi.com/robots.txt` does not disallow `/p/` or the `/students/v1/` path used here. It does disallow internal `*/api/*` routes, which this integration does not request.
- `api.platzi.com/robots.txt` returned an empty JSON object rather than crawler directives.
- Platzi's terms grant personal, non-commercial use and prohibit bypassing access controls and interfering with the service. This integration uses only anonymous GET requests, low frequency, strict limits and no protected course content.

Because the pagination resource is undocumented, Platzi may change or withdraw it. If policy or access changes, disable the scheduled workflow and maintain `manual.json`; do not add cookies, tokens, browser automation or anti-bot workarounds.

## Architecture

`src/data/certifications/platzi.json` is generated and version controlled. `manual.json` is owner maintained. `overrides.json` contains editorial choices such as featured status, categories, technologies, hidden records and verified replacement URLs. Synchronization never writes either manual file.

The shared schema in `src/lib/certifications/schema.ts` validates HTTPS URLs, dates, supported credential types, verification states, duplicate IDs and deterministic ordering. `repository.ts` combines generated and manual data and applies overrides for Astro pages.

Credential types remain explicit:

- `course-completion`
- `learning-path`
- `certificate`
- `professional-certification`

Platzi courses are labeled course completions. They are not represented as degrees, licenses or independent professional certifications.

## Commands

```sh
pnpm sync:platzi --dry-run
pnpm sync:platzi
pnpm test:certifications
pnpm validate
```

The sync script first confirms that the expected public profile is present. Requests use a 12-second timeout, at most three attempts with exponential backoff, a ten-page ceiling and pagination-loop detection. Authentication and access-denied responses fail explicitly. Empty or incomplete retrieval never replaces the current dataset.

Records missing from an otherwise complete response are preserved and reported for manual review. Writes use a temporary file followed by an atomic rename. Dry-run reports additions and metadata changes without writing.

## Manual management

Add non-Platzi or fallback records to `manual.json` using the same schema. Use a stable provider-prefixed ID. Run `pnpm validate` before committing. Add presentation changes to `overrides.json` so future synchronization cannot erase them.

Featured credentials are opt-in through `featured: true` in overrides. The current selection emphasizes Git/GitHub, Next.js, Angular API work and Docker. Categories and technology tags are editorial metadata, not data supplied by Platzi.

## GitHub Actions and deployment

`.github/workflows/sync-platzi.yml` runs daily at 07:23 UTC and on manual dispatch. It uses Node 24, pnpm 11.23.0, a frozen lockfile, the sync command and the full validation suite. Concurrency prevents overlapping runs. Minimal write permissions allow `peter-evans/create-pull-request` to open an update branch only when `platzi.json` changes.

Repository or organization policy may prevent pull-request creation with `GITHUB_TOKEN`. If that happens, grant the workflow the documented repository-level pull-request permission or run the sync manually; do not weaken branch protection.

Vercel remains connected through the repository. The workflow does not call Vercel. A validated pull request deploys only after it reaches the production branch under the repository's existing policy.

## Presentation and localization

`/certifications/` is statically generated and uses the portfolio's same-route EN/ES model. The owner previously rejected `/es` routes, so `/es/certifications` is intentionally not generated. Original credential titles remain unchanged; interface labels, dates, categories, filters and empty states switch in place.

All credentials are present in the HTML. JavaScript adds search, category/type/year filters and sorting. With JavaScript disabled, filters are hidden and the complete recent-first archive remains readable.

## Failure recovery and maintenance

1. Inspect the failed workflow log and HTTP status.
2. Confirm the public profile manually.
3. If markup or anonymous pagination changed, update sanitized fixtures and the adapter together.
4. Run dry-run, certification tests and full validation.
5. If public extraction is no longer permitted or reliable, disable the schedule and maintain manual data.

The Actions run history is the record of last successful synchronization. A timestamp is intentionally not committed, preventing no-content commits and unnecessary deployments.
