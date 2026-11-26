# SublimeHR — UI/UX QA audit (http://localhost:4321/)

Tested: 23 pages (everything in `dist/` except 404) × 4 viewports (1440, 1024, 768, 390, 320 — measured widths 1425 / 1009 / 753 / 375 / 305 because the page scrollbar takes ~15px). Method: every page loaded in an iframe at that width, scrolled top to bottom, then the measurement script was run. Nothing on the site was changed.

## Summary
- Critical: horizontal page overflow on phones (about 20 of 23 pages at 320px, 7 pages at 390px) and 3 pages at 1024px.
- High: nav row overflows by 2px at 768px on every page; 5th module card (`.md--4`) pokes out at 320px.
- Medium: heading levels skipped on 5 pages; unequal card heights on the home "why" cards; very large icon→title gaps in "About / what we offer" cards.
- Minor: text under 11px, tap targets under 40px (phones).
- 1440px: no horizontal overflow on any page.

## Critical
| Page | Viewport | Element | Evidence | Fix |
|---|---|---|---|---|
| `/` | 390 | `ul.pains` / `li` inside `.rhythm__copy` | scrollWidth 768 vs 375 (li right edge 768px) | give `.pains li` and `.rhythm__sub` `min-width:0; max-width:100%`, stack the row on phones |
| `/pricing/` | 390 | `.pcalc__r` (input), `.pcalc__l`, `.pcalc__avs` | scrollWidth 447 vs 375 | `.pcalc__card` to one column under 560px, `min-width:0` on children |
| `/about/` | 390 | `.abt__copy`, `.abt__stats` | scrollWidth 436 vs 375 | one-column `.abt` grid and `min-width:0` on `.abt__copy` under 600px |
| `/contact/`, `/book-demo/`, `/get-pricing/` | 390 | `span.cfh__b--2` (floating chip in header), `.cf__line` rows in `.cfr__grid` | scrollWidth 436–442 vs 375 | `overflow:hidden` on `.cfh`; `.cfr__grid` one column on phones; hide `.cfh__b--2` under 600px |
| same three form pages | 1024 | `span.cfh__b--2` | scrollWidth 1057 vs 1009 | same fix |
| `/` | 1024 | page | scrollWidth 1049 vs 1009 | find the hero stage element wider than the column (likely `.stage`), clamp with `max-width:100%` |
| `/software/employee-self-service/` | 390 / 320 | `p` in `.movie__head`, `.movie__stage` | scrollWidth 399 / 382 | `min-width:0` and one-column `.movie__grid` under 600px |
| all 10 module pages + `/features/` | 320 | `a.md.md--4` (5th module card) | right edge 340px vs 305px | the card grid needs `grid-template-columns:repeat(auto-fill,minmax(min(100%,230px),1fr))` under 480px |
| `/industries/` | 320 | `article.istk__c` (all cards) | right 352px vs 305px | `.istk__cards` one column, `min-width:0` |

## High
- **Nav at 768px:** `nav.nav__links` right edge 755px vs 753px on all pages, and the nav's "Book a demo" button reaches 762px on `/faq/`, `/privacy/`, `/terms/`. Fix: reduce nav gaps between 700–820px or switch to the menu button earlier (breakpoint 820px).
- **Nav links at ≤390px** report right edge 755px on every page. This is the off-canvas menu panel; it is normal only if it is truly hidden — worth a visual check on a phone.
- `/` at 768: scrollWidth 785 vs 753. Same hero stage cause as at 1024.

## Medium
- Heading order: `/` and `/software/employee-self-service/` go h2→h5; `/software/mobile-workforce/` h2→h4; `/pricing/` h1→h3. Use real h3 (or a styled `div`) in those places.
- Home "why" cards (`.wy`): heights 538 / 271 / 271 in one row at 1024, 768, 1440 — the first is a deliberate big card; confirm it is intended.
- About "what we offer" cards (`.aoff__t`): 78–82px gap between the icon and the title at 1024+ (51px for the 4th) — much larger than the same pairs elsewhere (about 14px). Fix: align `justify-content:flex-start` and remove `margin-top:auto` on the title.
- Gaps >48px inside `.mscr` (ESS phone mock, 76px between "resend" and the keypad) and `.dmx__ps` (mobile workforce, 133px) — demo mocks; trim by moving the button up.

## Minor
- Text smaller than 11px on home, About, ESS and Shift pages (3 items per page).
- Tap targets under 40px on phones on every page (3 reported each; mostly small icon chips and the footer links).

## Design-system consistency
- Module cards (`.md`) are now one component on home, features hub and related-modules: equal heights in a row, button 22px from the bottom — verified.
- The measured "overlap" values the script produced inside flex rows (icon next to label) were side-by-side children and are not bugs; I filtered them out.

## Not tested
- Screenshots / visual review of every viewport (pane screenshots lag; only measurement was done).
- Console errors and failed network requests.
- Keyboard Tab flow and focus visibility, 200% zoom, dark-mode pages, axe-core.
- 414, 360, 1920 viewports; form validation; hover states on every card.
- 404 page (not part of the sitemap build).
