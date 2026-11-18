# SublimeHR — Marketing Website

A static, SEO/AEO-friendly multi-page site with no backend. A small Node generator builds every page from one set of templates, so the header, footer and design tokens are the same on every page.

## Commands

```bash
node build.mjs                                      # builds ./dist
python -m http.server 4321 --directory dist         # preview at http://localhost:4321
```

Deploy by uploading the contents of `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, cPanel, S3).

## Structure

| Path | What it is |
|---|---|
| `src/data.mjs` | **All content**: modules, pricing, FAQ, industries, integrations, contact info |
| `src/pages.mjs` | Page templates (home, features, 10 module pages, industries, pricing, integrations, custom dev, about, FAQ, contact, privacy, terms, 404) |
| `src/layout.mjs` | `<head>` (meta, Open Graph, JSON-LD), header, footer, shared blocks |
| `src/icons.mjs` | Inline SVG icon set |
| `static/assets/css/styles.css` | Global design system: colour, type, spacing, radius, borders, form controls |
| `static/assets/js/main.js` | Animations, menu, tabs, counters, FAQ search, contact form |
| `static/assets/img/sublimehr-logo.png` | Original logo (unchanged) |

## Design system "Worklife" (tokens in `styles.css` `:root`)

- **Look:** bright, warm and people-first. Pages use a white and cream base with pastel tints (sky, mint, butter, peach, lilac) from the logo blue and teal, plus hand-drawn underline accents. The only dark area is the footer.
- **Colours:** primary `#2F72B8` (logo blue), secondary `#3FBDB3` (logo teal), tertiary `#FF7A59` (coral, used for status and highlights only), with `#FFC94A` sun as an accent
- **Buttons:** pill buttons with an arrow "bubble" and a fill-sweep hover. There are only two styles: `.btn` (blue) and `.btn.alt` (white).
- **Radius:** 12 (inputs), 20 (cards), 28 (panels and widgets), pill (buttons and chips)
- **Controls:** every input, select, date and tel field is 46px tall with a 12px radius. The phone field has a country-code prefix.
- **Type:** Bricolage Grotesque for headings, DM Sans for body text and JetBrains Mono for numbers
- **Intro:** a logo reveal animation plays once per session and is skipped for visitors who choose reduced motion

## Interactive demos (`src/widgets.mjs` for markup, `main.js` for behaviour)

| Widget | What visitors can do | Used on |
|---|---|---|
| Clock-in | Punch in with a selfie/GPS/geofence animation; the arrival-time slider shows on-time, grace or late | Home hero, Attendance |
| Leave planner | Pick a date range; weekends and holidays are skipped; balance updates; pending → approved | Home, Leave |
| Payroll simulator | Sliders for salary, allowance, overtime and late days; live payslip and net pay | Home, Payroll |
| Permissions | Switch roles and toggle the View/Add/Edit/Delete matrix; a live preview of what the role sees | Home, Security |
| Roster | Click shifts to cycle them; live coverage warnings | Home, Shift Scheduling |
| Who's in | Scrub the morning timeline; the live attendance board fills in | Home, Reports |
| Letter builder | Type details and the offer letter fills itself | Employee Management |
| Visitor desk | Check in a visitor and a badge "prints" | Visitor Management |
| Phone mini-movie | An auto-playing 6-step app walkthrough with pause and jump | Home, Self Service, Mobile |
| Chat FAQ | Pick or type a question and the assistant answers | Home, FAQ, Pricing |
| Pricing calculator | Drag the employee count to see the monthly estimate per plan | Pricing |

## Contact form

Submissions go to a Google Apps Script backend, which saves each lead to a Google Sheet and emails your team and the lead. Setup steps are in [backend/README.md](backend/README.md). Once deployed, paste the web-app URL into `formEndpoint` in `src/data.mjs` and rebuild. While `formEndpoint` is empty, the form opens WhatsApp with the enquiry filled in instead.

## SEO / AEO

- One unique title, meta description and canonical URL per page, plus Open Graph and Twitter cards
- JSON-LD on each page: Organization, WebSite, SoftwareApplication (with prices), FAQPage, BreadcrumbList, Service
- `sitemap.xml`, `robots.txt` (AI crawlers allowed) and `llms.txt` (a plain-text summary for AI answer engines)
- Semantic HTML, a single h1 per page, `<details>` FAQs that crawlers can read, and no JS-only content
- URLs match the current site (`/features`, `/software/<module>`, `/pricing` …)
