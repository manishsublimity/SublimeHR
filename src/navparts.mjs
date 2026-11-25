import { modules } from "./data.mjs";
import { icon } from "./icons.mjs";
import { who, people } from "./cast.mjs";

const TONES = ["", "mint", "butter", "peach", "lilac"];
const _sun = '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const _moon = '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
const row = (href, ic, name, small) => `<a class="nm__row" href="${href}"><span class="ni">${icon(ic)}</span><span><strong>${name}</strong><small>${small}</small></span>${icon("arrow", "nm__go")}</a>`;
const feat = (label, title, text, cta, href, who_) => `<div class="nm__feat"><small>${label}</small><b>${title}</b><p>${text}</p><a class="nm__cta" href="${href}">${cta} ${icon("arrow")}</a><div class="cast nm__who" aria-hidden="true">${who_}</div></div>`;
const priya = people.find((p) => p.n === "Priya"), omar = people.find((p) => p.n === "Omar");

/* The header links (with the Product and Company drop-downs), the theme switch and the two buttons. */
export function navMenu(active = "") {
  const cur = (k) => (active === k ? ' aria-current="page"' : "");
  return `<nav class="nav__links" aria-label="Main">
    <div class="nav__item"><a href="/features/"${cur("features")}>Product ${icon("chevron", "chev")}</a>
      <div class="nav__mega">${feat("Product", "Everything behind the people.", "Ten modules that share one employee record, so nothing is typed twice.", "See all features", "/features/", who(priya, 0))}
        <div class="nm__list">${modules.map((m) => row(`/software/${m.slug}/`, m.icon, m.name, m.short.replace(/&/g, "&amp;"))).join("")}</div></div></div>
    <a href="/industries/"${cur("industries")}>Industries</a><a href="/pricing/"${cur("pricing")}>Pricing</a><a href="/integrations/"${cur("integrations")}>Integrations</a>
    <div class="nav__item"><a href="/about/"${cur("company")}>Company ${icon("chevron", "chev")}</a>
      <div class="nav__mega sm">${feat("Company", "Say hello.", "A real person replies within one business day.", "Contact us", "/contact/", who(omar, 1))}
        <div class="nm__list">${row("/about/", "building", "About us", "Mission &amp; vision")}${row("/custom-development/", "code", "Custom development", "Built around your workflow")}${row("/faq/", "message", "FAQ", "Ask our HR assistant")}${row("/contact/", "call", "Contact", "We reply within 1 business day")}</div></div></div>
  </nav>
  <a class="btn btn--on" href="/book-demo/">Book a demo</a>`;
}

/* Day / night switch: an Edison bulb on a little base. Tap it and the filament glows and the page goes to night. */
export function themeFab() {
  return `<button class="edi" type="button" data-theme-toggle aria-label="Switch to dark theme" title="Day / night">
  <span class="edi__halo" aria-hidden="true"></span>
  <svg viewBox="0 0 76 128" width="76" height="128" aria-hidden="true" focusable="false">
    <rect x="18" y="112" width="40" height="11" rx="5" fill="#7D87A2"/><rect x="31" y="92" width="14" height="22" rx="3" fill="#8E98B2"/><path d="M31 99h14M31 105h14" stroke="#6C7691" stroke-width="2"/>
    <path class="glass" d="M38 94C16 94 8 76 12 56 15 38 24 26 38 26s23 12 26 30c4 20-4 38-26 38z"/>
    <path class="hl" d="M20 52c2-12 8-20 14-22" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>
    <path class="fil" d="M30 90V58l8 11 8-11v32M38 69v20"/>
  </svg>
  <span class="edi__tip" aria-hidden="true"><b class="d">Switch to night</b><b class="n">Switch to day</b></span>
</button>`;
}
