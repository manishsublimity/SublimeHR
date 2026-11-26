# Component registry

Reuse before you build. A repeated section is the same class everywhere, variants use modifiers.

| Component | Class / source | Anatomy and spacing | Pages |
|---|---|---|---|
| Module card | `.md` (`src/home2.mjs`, `src/modpage.mjs`, `src/pages.mjs`; CSS in `navmenu.css`, block "round nine") | grid 48px icon + name row; 14px; description (clamp 4); 14px; pill button bottom. Hover: `ul` slides up from the bottom at its own height. 22px padding. | home, features hub, related modules on every module page |
| Module hero | `hero(m)` in `modpage.mjs` | stage with cast, chips, headline, two CTAs | all module pages and the redesigned pages |
| Before / after | `.mba` (`before(m)` in `modpage.mjs`, JS in `mod2.js`, CSS at the end of `mod10.css`) | left card (headline, three pills, two stat tiles, one button); right scene (chaos collage on a tiled floor, thought bubble, Subi tidies, a screen lists problem and solution) | 10 module pages |
| Closing band | `closeBand(o)` / `.mbk` | headline, cast wave, card with 2 links | module and redesigned pages |
| Features rows | `.frow` | icon, title, tagline, summary, benefits, "Includes" box, demo button | features hub |
| Industry stack | `.istk` | pills nav, 9 coloured cards | industries |
| Lamp (day / night) | `.lamp`, `static/assets/js/lamp.js` | fixed top right; unique class prefix `lamp__`, `lfx`; never reuse `nudge`, `menu`, `go` | every page |
| Subi guide | `[data-guide]` | bottom right, bubble, menu | every page |

## Known component debts
- Button variants (17) do not map to the 3-size scale yet.
- Hero scene stage, demos (`dmx__*`) and form pages each carry their own card radius and padding.
- Privacy, Terms and 404 still use the old layout.
