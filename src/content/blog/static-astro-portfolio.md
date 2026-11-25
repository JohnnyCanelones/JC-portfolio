---
title: "Building a static-first portfolio with Astro"
slug: static-astro-portfolio
translationId: static-astro-portfolio
description: "An unpublished outline about content collections and build-time rendering."
publishedAt: 2026-11-25
tags: [Engineering]
language: en
draft: true
---
## Outline

- Describe draft exclusion and typed content.
- Explain native navigation and semantic article layouts.
- Add measured production results after review.

## Review before publication

This is an editorial outline. It needs owner review, original examples, and checked claims before publication.

## Original example

This isolated TypeScript example illustrates a publication filter.

```ts
type Entry = { draft: boolean; language: string };
const isPublished = (entry: Entry) => !entry.draft && entry.language === 'en';
```

## Rendering checklist

<div class="table-scroll" tabindex="0" role="region" aria-label="Publication checks">
<table>
<caption>Checks before publishing an article</caption>
<thead><tr><th scope="col">Concern</th><th scope="col">Build-time check</th></tr></thead>
<tbody>
<tr><th scope="row">Drafts</th><td>Exclude from route generation</td></tr>
<tr><th scope="row">Links</th><td>Validate local destinations</td></tr>
<tr><th scope="row">Article headings</th><td>Generate a native table of contents</td></tr>
</tbody>
</table>
</div>
