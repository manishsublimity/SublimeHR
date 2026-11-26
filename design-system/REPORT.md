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

## 5. Done on 2026-11-26 (system layer, `static/assets/css/system.css`)
Measured on 23 pages with iframes at 320, 390, 768, 1024 and 1440 (viewports reported 305, 375, 753, 1009, 1425).

| Item | Before | After |
|---|---|---|
| Page wider than the screen | about 18 pages at 320, 8 at 390, 3 at 1024, nav 2px at 768 | 0 pages at all five widths |
| Button variants | 17 (33 to 58px) | 3 sizes: 52 / 44 / 36px (chips, filters and icon buttons are separate components) |
| H1 size | 46.4px home, 37.6px inner | 43.9px everywhere at 1440 |
| H2 size | 41.6 / 47.5 / 49px | 40px everywhere |
| Motion on buttons | overshoot curve on colour, no press state | ease-out 160 to 200ms, press scale .97, hover lift only on devices that hover, reduced motion respected |

Fixes behind the overflow numbers: gutter 56px becomes 32px under 1024 and 18px under 760; two-column grids (`.rhythm`, `.movie__grid`, `.prod`, `.roles__grid`, `.pplans`, `.abt__stats`, section heads) become one column; the day timeline becomes a vertical list under 820px; the 600px orbit scales with `zoom`; `.rec` chips wrap.

## 6. Not done, and why
- Phone layouts are not designed. "No overflow" does not mean "looks right": the home hero and the nav still use the desktop structure on a phone (no burger menu, hero content is clipped by the hero's `overflow: hidden`). The browser pane's phone emulation reported a 683px width, so phone screenshots could not be trusted; real-phone checking is needed.
- Section padding is still 21 different pairs. Changing it globally needs a visual check of each page, because several sections rely on 0 or 20px bottom padding to join the next section.
- H3 sizes (18 / 24 / 31.7px), paragraph weight 500 and sub-12px text are not changed yet.
- Headings semantics (h2 to h5, h1 to h3 on 5 pages) are not changed yet; they change markup, not CSS.
- Dark mode tokens, keyboard focus styles and `transition: all` clean-up are not done.
- Emil Kowalski's rules were applied to buttons (curves, press feedback, hover gating). Taste-skill and Impeccable were not run yet.

## 7. Skills fixes applied on 2026-11-26 (Impeccable detector, taste-skill copy-lint, Emil motion)
Impeccable detector over 24 pages and 4 CSS files: 1234 findings before, 774 after.

| Finding | Before | After | What was done |
|---|---|---|---|
| Undersized text (below 11px) | 113 | 0 | every font size below 11px raised to 11px (home, module demos, old pages) |
| Bounce easing | 132 | 6 (lamp only) | overshoot curves replaced by `cubic-bezier(.23,1,.32,1)`; `--spring` renamed `--ease-pop` and no longer overshoots |
| Pulsing dots | 202 | 79 | only the Subi antenna keeps a glow; other status dots rest |
| Gradient text | 52 | 0 | footer word and marks are solid colour |
| Skipped heading levels | 5 pages | 0 | phone mock titles h5 to h3, demo screens h4 to h3, hidden "Plans" h2 on Pricing |
| Broken images | 3 | 0 | scanner image has a placeholder source |
| Low contrast (real values) | grey #9aa3b5, #98a0b0, #6b7488, red #c2381f, green #198754, rust #b4502b, white at 65 to 88% | darker or full white | tokens raised in `home2.css`, `mod10.css` |
| copy-lint (taste-skill) | 1 FAIL, 6 WARN | 0 FAIL, 3 WARN | removed "effortless", "powerful", "Enterprise-grade", "calm", "actually", most em dashes, response-time promises |
| Hero | slogan, no category | h1 "Attendance, leave and payroll in one HR system." plus one fact line | slogan idea kept in the industry line |
| Section padding | 21 pairs | plain sections 72/72 on desktop | joined sections keep their own values |

### Findings left on purpose (reasons)
- Low contrast, about 254: the detector reads the white navigation links against the page background, but on every page they sit over the coloured hero. False positive.
- Side-tab (162), pulsing dots left (79), glow (24), radial halo (24), stripes (24), grid background (20): these are the characters' art (badge strip, Subi's antenna, night-sky stars, tiled floor) and the hero floor. They are the brand's illustration, not UI decoration.
- Nested cards (47): the demos are product mock screens, a card inside a card is what the real app looks like.
- Icon tile above heading (27) and cramped padding (27): card layouts that need a design pass per card; not changed.
- Marquee (33): kept, now pauses on hover and focus and stops under reduced motion.
- Lamp: playful overshoot kept on purpose (chain, bulb).
- copy-lint WARN left: stat strips and the names Priya and Aisha are mock data and the mascot cast.

### taste-skill browser check (consistency.mjs, home at 1440 and 390)
Result: 306 FAIL, 185 WARN. The checker measures against its own template (one section per screen, equal edges, no tilt, real photographs, no scroll reveal), so most of it describes the site's illustrated, animated brand rather than faults. Real items it found and what was done:
- Keyboard focus ring missing: added a visible 3px ring for every link, button and field (white on coloured grounds).
- Tap targets under 44px on a phone (footer links, logo): footer links now 44px tall under 760px.
- Not done: phone navigation (nav runs past the screen at 320, no burger menu), visible labels on some form fields, real-format phone number on the page (the owner's own number, kept), the one-section-per-screen and equal-edge rules (design decisions, not defects), tilt on characters and notes.
