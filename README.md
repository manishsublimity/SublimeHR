# SublimeHR — Marketing Website

A static, multi-page marketing site. A small Node generator builds every page from shared templates, so the header, footer, design tokens and the phone bottom bar are the same everywhere.

## Commands

```bash
node build.mjs                                      # builds ./dist
python -m http.server 4321 --directory dist         # preview at http://localhost:4321
```

Deploy by uploading the contents of `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, cPanel, S3). `dist/` is committed, so always run `node build.mjs` before committing.

## Pages (23)

Home, Features, 10 module pages (`/software/<slug>/`), Industries, Pricing, Integrations, Custom development, About, FAQ, Contact, Book a demo, Get pricing, Privacy, Terms, plus `404.html`, `sitemap.xml`, `robots.txt`, `llms.txt` and `site.webmanifest`.

## Where things live

| Path | What it is |
|---|---|
| `build.mjs` | Builds `dist/` from `src/` and copies `static/` |
| `src/data.mjs` | All content: modules, pricing, FAQ, industries, integrations, contact info |
| `src/home2.mjs` | The home page and the shared footer |
| `src/modpage.mjs` | Module pages, About, Industries, Features, Custom development, Contact and Book a demo templates |
| `src/pages.mjs` | Page entry points used by the build |
| `src/layout.mjs`, `src/navparts.mjs` | `<head>` (meta, Open Graph, JSON-LD), header, mega menu, burger menu |
| `src/widgets.mjs`, `src/moddemo.mjs`, `src/cast.mjs`, `src/modconf.mjs` | Interactive demos, characters and per-module configuration |
| `src/icons.mjs` | Inline SVG icon set |
| `static/assets/css/` | Style layers, loaded in order; `system.css` overrides, `mobile.css` (phone and tablet) is last |
| `static/assets/js/` | `home2.js` (home), `mod2.js` + `mod11.js` (module pages), `main.js` + `live.js` + `form.js` (FAQ, forms, legal pages), `navburger.js` + `mobilefix.js` (burger menu, bottom bar, sound switch), `aboutfx.js`, `lamp.js` |
| `static/assets/img/` | Logo and share image |
| `design-system/` | `MASTER.md` (tokens and rules) and `components.md` (component registry) |
| `backend/` | Google Apps Script that can receive the form submissions |

## How it behaves

- **Phone and tablet (up to 1080px):** burger menu with a sound switch inside, a bottom bar with a notch and round badge that moves to the active tab, no floating sound or back-to-top buttons.
- **Page changes:** cross-document view transitions (supported browsers); the header, bottom bar and Subi stay in place.
- **Forms:** validated in the browser. Without a `data-endpoint` they open WhatsApp with the details; with an endpoint they post JSON to it.
- **Motion:** `prefers-reduced-motion` is respected.

## Working rules

See `CLAUDE.md`. In short: commit on the `production` branch, push only when asked, read `design-system/` before touching a section, keep class names unique per component, and do not change approved designs unless asked.
