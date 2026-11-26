# Skills report, SublimeHR (2026-11-26)

## 1. What is in this project now
- `CLAUDE.md`: rules every session reads first (skills to use, what the owner rejects, engineering rules, git rules).
- `design-system/MASTER.md`: typography, spacing scale, layout, components, colour, motion tokens, with the drift found today.
- `design-system/components.md`: registry of reusable components and their known debts.
- `.claude/skills/`: project copies of `web-design-system-director`, `website-ui-qa-audit`, `frontend-design`.

## 2. Emil Kowalski, taste-skill, Impeccable: what is needed
They are not installed in Claude Code on this computer (checked: the session skill list, `~/.claude/skills`, installed plugins). A skill added in the claude.ai account is not the same as a skill installed in Claude Code. Install routes found on the public pages (verify against each GitHub repo before running):

| Skill | Install |
|---|---|
| Impeccable (Paul Bakaus) | `npx impeccable install` or `npx skills add pbakaus/impeccable` or `/plugin marketplace add pbakaus/impeccable`; then `/impeccable init`. Needs Node 18.19+. |
| taste-skill (Leonxlnx) | `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"` |
| Emil Kowalski (emil-design-eng) | `npx skills add emilkowalski/skills --skill emil-design-eng` (one source gives the singular repo name `emilkowalski/skill`; check the repo) |

Each command downloads third-party code, so it needs the owner's yes. After installing, start a new session; the skills then show up in the skill list and `CLAUDE.md` tells Claude to use them.

## 3. Audit against `web-design-system-director` (definition of done)
| Check | Result |
|---|---|
| Font sizes map to one role each | Fails: H1 46.4 / 37.6px, H2 41.6 / 47.5 / 49px, H3 18 / 24 / 31.7px |
| Gaps and padding from one scale | Fails: 21 section padding pairs; majority 70/70 |
| Repeated sections identical | Mostly passes for module cards (one component now); buttons fail (17 variants, 33 to 58px) |
| Cards in a row equal height, buttons bottom aligned | Passes for module cards, before/after tiles |
| Same left and right edges | Passes (content starts at 56px on every section) |
| No justify, no overflow at 320px, no overlap | Overflow fails on about 18 of 23 pages at 320px, 8 pages at 390px; no justified text found; overlaps in the before/after scene measured zero |
| Heading semantics | Fails on 5 pages (h2 to h5, h1 to h3) |
| Hover-only essential content | Fixed on module cards (description and button visible; features are extra) |
| Body text weight | Paragraphs use 500, should be 400 |
| Reduced motion | Lamp, before/after, ticker respect it; the rest was not checked |
| Dark mode | Not token based; coloured cards patched; most pages not checked |

Full list with selectors: `qa-audit-report.md`.

## 4. Proposed order of work (nothing changed yet)
1. Phone overflow fixes (critical, measured, small changes).
2. Button system (52 / 44 / 36px), one primary per view.
3. Section rhythm (72px) and type scale (H1 44, H2 40, H3 20, body 400).
4. Motion tokens (three curves, press 0.97, no overshoot on colour).
5. Heading semantics, 768px nav, tap targets, text under 12px.
6. Real dark mode tokens, then Privacy, Terms and 404.
After each step: audit at 1440, 1024, 768, 390, 320 and show before and after numbers.
