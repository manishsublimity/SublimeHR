# SublimeHR design system, MASTER

Single source of truth. Extracted from the live CSS on 2026-11-26 (home, payroll, pricing, about at 1440px), then locked to one value per role. New values go in this file first.

## Typography (desktop / mobile)

| Role | Size | Weight | Line height | Family | Where |
|---|---|---|---|---|---|
| H1 | 44 / 32px | 600 | 1.12 | Unbounded | one per page |
| H2 | 40 / 28px | 600 | 1.15 | Unbounded | section title |
| H3 | 20 / 18px | 600 | 1.25 | Unbounded | card, row title |
| H4 | 16px | 600 | 1.3 | Unbounded | inside-card sub title |
| Body-L | 18 / 16px | 400 | 1.6 | Figtree | intro paragraph |
| Body | 16px | 400 | 1.6 | Figtree | default |
| Small | 13px | 500 | 1.45 | Figtree | meta, captions (never under 12px) |

Max two families (Unbounded for headings, Figtree for everything else). Paragraph line length 60 to 75ch.

### Drift found today (to be fixed, not yet changed)
- H1: 46.4px on home, 37.6px on every inner page.
- H2: 41.6px, 47.5px, 49px depending on page.
- H3: 18px, 24px, 31.7px depending on page.
- Body paragraphs use weight 500 (should be 400); text under 12px on home, About, ESS, Shift pages.

## Spacing scale (only these values)

4, 8, 12, 16, 24, 32, 48, 72, 96

- Section padding: 72px desktop, 56px tablet, 40px mobile (top equals bottom). Hero top 96px. Tight section 48px.
- Section header to content: 48px. Grid gap: 16 to 24px. Card padding 22 to 24px.
- Today there are 21 different section padding pairs (70/70 is the majority, 13 of 21). Examples that break the rhythm: 84/18, 86/0, 150/20, 50/130, 34/20.

## Layout
- Container: content width 1313px at a 1440 viewport, gutter 56px desktop, 24px tablet, 16px mobile. Same left edge (56px) on every section.
- Breakpoints to test: 320, 360, 390, 768, 1024, 1280, 1440.

## Components (summary, details in components.md)
- Buttons: 3 sizes only. Large 52px, medium 44px, small 36px; pill radius; verb plus object labels. One primary per view. Today: 17 variants from 33 to 58px.
- Card (`.md`): icon and name in one row, 13.5px description (4 lines max), one pill button at the bottom. Equal heights per row. Hover slides the feature list up at its own height; the only copy of a text is never hover-only.
- Radius signature: large corners 28px with one 8px corner that rotates by position (`md--0` to `md--4`).
- Icons: one SVG set, 24 / 40 / 56px.

## Colour (semantic)
- `--ink` #14213D (text, primary buttons), `--ink2` #46526B (secondary text).
- `--world` and `--on` change with the industry (it #3558F5, hospital #0E9F8A, retail #F2593B, factory #FFB81F with dark text, school #7A4DF0, hotel #0B8FB5, construction #A66A2B, logistics #2F9E44, restaurant #D6336C, bank #2B2F77).
- Problem colour #D6336C, caution yellow #FFD05A.
- Contrast: body text 4.5:1, large text 3:1. Check every text and icon in dark mode.
- Dark mode today is made by inverting sections. Coloured cards are put back with `.dk-undo`. A real token-based dark mode is on the to-do list.

## Motion tokens
- `--ease-out` cubic-bezier(.2,.75,.25,1) 180ms: colour, opacity, hover.
- `--ease-spring` cubic-bezier(.34,1.56,.64,1) 420ms: reveal, press release. Never on colour or opacity.
- `--ease-snap` cubic-bezier(.3,.9,.3,1) 120ms: toggles, chips.
- Press: scale 0.97 in 100ms. Never animate from scale 0 (start from 0.94 or more).
- Today: plain `ease` 1172 uses, overshoot curve 798 uses, including colour changes.
- Respect `prefers-reduced-motion` (lamp, before/after and ticker already do; the rest is not checked).

## Spacing rules that prevent big gaps
1. Reset margins on h1 to h6, p, ul, ol, figure.
2. The parent owns the gap (flex column plus `gap`). No margin on children, no spacer elements, no fixed height on text boxes.
3. Never mix `gap` and child margins. Check the computed value, not the source.
4. Class names must be unique: a `.go`, `.nudge`, `.menu`, `.rb`, `.k0` clash has already broken the site four times. Prefix new classes by component (`mba__`, `lamp__`, `frow__`).
