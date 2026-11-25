# Purple Editorial — Johnny Canelones

## Direction

The site reads like an independent engineer's publication: a typographic identity, a restrained grid, and factual work presented with different levels of emphasis. The primary audience is recruiters and engineering teams who need to scan experience quickly and still get a sense of individual judgment.

The name is the visual anchor. Manrope carries direct, readable information; Newsreader italic gives the surname and major statements a personal editorial voice; IBM Plex Mono marks dates and technical detail. Purple identifies the person and points of interaction. It does not decorate every surface. Johnny's supplied portrait appears in About, where it adds a personal presence without competing with the typography-first introduction.

## Research principles

- [Paco Coursey](https://paco.me/): compact writing, generous whitespace, and direct project descriptions.
- [Rauno Freiberg](https://rauno.me/): confidence in a personal statement and restraint in interaction.
- [Emil Kowalski](https://emilkowal.ski/): tight hierarchy between current work and selected projects.
- [Brittany Chiang](https://brittanychiang.com/): scannable experience and accessible section structure.
- [Siteinspire](https://www.siteinspire.com/): editorial and typographic portfolio categories as a breadth check.
- [Pixegon](https://www.pixegon.com/): directional movement and layered reveals as interaction references; no layout or artwork was copied.
- Awwwards was unavailable during research, so no design decision depends on it.

These are principles, not copied layouts. The current composition uses Johnny's name, work history, and project mix to establish its own rhythm.

## Palette

| Role | Light | Dark |
| --- | --- | --- |
| Background | `#F8F6F3` | `#121015` |
| Surface | `#EFEBF2` | `#1C1822` |
| Elevated surface | `#FFFFFF` | `#241E2B` |
| Text | `#211B28` | `#F0EDF4` |
| Supporting text | `#62586B` | `#B2A9BC` |
| Border | `#DCD4E3` | `#44374E` |
| Link / focus | `#6941A5` | `#BD9EF5` |

The light theme is warm paper and plum ink. The dark theme is the primary visual exploration: near-black plum, light text, and lavender. WealthOS uses its real sign-in screenshot within a solid purple frame. The values are semantic tokens in `src/styles/global.css`, not component-level color literals.

## Type and layout

The page has a 75rem maximum width and fluid gutters. The hero uses a large two-line name and an offset introduction. Section headings align to a shared grid; content below varies by purpose. Featured WealthOS pairs a real application screenshot with concise copy, Green Jurisdictions has an image-and-text editorial composition with two authentic screenshots, and the remaining projects are compact rows. TTB and ISM appear together because Johnny identified both as part of his most recent work.

Body text uses comfortable line height and bounded reading widths. Sizes use rem-based `clamp()` values so browser zoom remains effective. Font licenses are stored in `licenses/fonts/`; only required Latin weights are loaded. A mobile Lighthouse run identified the introductory paragraph as LCP, so its Newsreader regular WOFF2 is the only font preload.

The identity uses Johnny's `&lt;/&gt;` tattoo rather than an invented mark. The header combines it with his initials as `JC&lt;/&gt;`; the favicon keeps only `&lt;/&gt;` so the three strokes remain recognizable at 16×16 pixels. Simple SVG paths stay sharp across browser densities and retain contrast against light and dark browser chrome.

## Interaction and accessibility

The header is fixed and its measured height reserves space above the page. Navigation wraps on narrow screens, preserving links without JavaScript. The native theme selector offers system, light, and dark when scripting is available. With scripting disabled the system theme and all navigation remain usable.

Anchor navigation uses two solid purple planes moving at different speeds, with a brief editorial title reveal. Work, Experience, About, and Contact each have a different direction, giving the single page a sense of chapters without creating routes. Scroll motion now focuses on section titles and authentic images: titles reveal vertically over 650ms, images wipe horizontally over 850ms. Paragraphs and experience rows remain stable. Each target animates once, with no opacity fade or image zoom. The content remains present without animation support. Reduced-motion users get direct anchor navigation and static content. The fixed header stays visible throughout navigation.

The page uses one main landmark, sequential headings, a skip link, visible focus outlines, semantic links, and decorative artwork hidden from assistive technology. The feature panel, fine rules, and selected typography provide personality without glows, gradients, fake dashboards, or card grids.

## Content boundaries

Project statements and employment dates come from Johnny's supplied resumeor this Phase 2 brief. Johnny provided screenshots and URLs for WealthOS, Green Jurisdictions Database, and Tropical Fire Observatory. The latter two are shown as surfaces of one project. The screenshots show the products without suggesting their entire appearance is Johnny's individual design. Johnny also supplied URLs for TTB, ISM, GlobalFinances, and Breeze; those are direct project links. The repository has no verified GitHub profile URL, so it remains omitted. The resumeis available for download and includes a phone number; review public distribution before deployment.

Image-reveal research: [Codrops, Full Image Reveal Effect](https://tympanus.net/codrops/2018/06/12/full-image-reveal-effect/). Search excerpts informed the direction; the full article returned HTTP 403. The implementation uses native Web Animations, not the reference dependency stack.

## Phase 3 — reading and evidence

Internal pages extend the same Purple Editorial system. Serif headlines establish a clear article opening; restrained mono metadata distinguishes role, period and technology from prose. A left-hand native TOC makes the long WealthOS account scannable while the main column stays near 68 characters. Mobile layouts stack naturally, with a compact two-column TOC where space permits.

Projects remain varied: WealthOS is featured, Green Jurisdictions uses genuine imagery, and professional entries without authorized imagery stay typographic. The directory separates personal work from professional contributions without repeating the homepage introduction. Case-study galleries are static, with captions and public destination links. Experience reuses one data source and its original dates.

Visual refinement removed duplicate directory headings and empty related-writing sections, shortened mobile TOC spacing, corrected breadcrumb duplication in local previews, and bounded the sticky TOC to available viewport height. No new runtime animation or UI dependency was added. The architecture figure describes inspected WealthOS system boundaries using semantic HTML and token-based surfaces.

## Phase 4 — bilingual editorial rhythm

Spanish keeps the same Purple Editorial composition rather than becoming a parallel visual theme. Longer Spanish headings and labels are allowed to wrap within the existing flexible header and fluid type system. The language control is compact typography—not a flag, pill, dropdown, or dashboard control—and uses visible EN/ES abbreviations with `aria-pressed` state.

The user explicitly chose same-route language switching. English remains the static first render; Spanish progressively replaces keyed copy and reveals independently authored localized case-study content. Motion, project hierarchy, imagery and section anchors remain identical across languages, so switching language does not reset the visual identity or create a page transition.
