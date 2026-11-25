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

/* Day / night switch: a little magic lamp. Rub it and a smiling sun or moon puffs out of the spout. */
export function themeFab() {
  return `<button class="gen" type="button" data-theme-toggle aria-label="Switch to dark theme" title="Rub the lamp: day or night">
  <span class="gen__glow" aria-hidden="true"></span>
  <svg viewBox="0 0 150 156" width="132" height="138" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE08A"/><stop offset=".55" stop-color="#F0B53A"/><stop offset="1" stop-color="#B9741A"/></linearGradient>
      <linearGradient id="gs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C98C22"/><stop offset=".5" stop-color="#FFD66B"/><stop offset="1" stop-color="#C98C22"/></linearGradient>
    </defs>
    <g class="gen__smoke"><circle cx="22" cy="58" r="3.4"/><circle cx="27" cy="50" r="2.6"/><circle cx="33" cy="44" r="2"/></g>
    <g class="gen__puff gen__sun" transform="translate(-4 -2)"><g class="rays" fill="#FFB81F"><rect x="37" y="-2" width="3" height="7" rx="1.5" transform="rotate(0 38.5 22)"/><rect x="37" y="-2" width="3" height="7" rx="1.5" transform="rotate(45 38.5 22)"/><rect x="37" y="-2" width="3" height="7" rx="1.5" transform="rotate(90 38.5 22)"/><rect x="37" y="-2" width="3" height="7" rx="1.5" transform="rotate(135 38.5 22)"/><rect x="37" y="-2" width="3" height="7" rx="1.5" transform="rotate(180 38.5 22)"/><rect x="37" y="-2" width="3" height="7" rx="1.5" transform="rotate(225 38.5 22)"/><rect x="37" y="-2" width="3" height="7" rx="1.5" transform="rotate(270 38.5 22)"/><rect x="37" y="-2" width="3" height="7" rx="1.5" transform="rotate(315 38.5 22)"/></g><circle cx="38.5" cy="22" r="15" fill="#FFCF3E" stroke="#E69A00" stroke-width="2"/><circle class="eye" cx="32" cy="21" r="2.4" fill="#14213D"/><circle class="eye" cx="44" cy="21" r="2.4" fill="#14213D"/><path d="M32.5 28q5.5 5 11 0" stroke="#14213D" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="27" cy="26" r="2.2" fill="#FF8E7A" opacity=".55"/><circle cx="49" cy="26" r="2.2" fill="#FF8E7A" opacity=".55"/></g>
    <g class="gen__puff gen__moon" transform="translate(-4 -2)"><circle cx="38.5" cy="22" r="16" fill="#EEF2FF" stroke="#A9B6EE" stroke-width="2"/><circle cx="47" cy="14" r="3.4" fill="#D3DAFA"/><circle cx="29" cy="31" r="2.6" fill="#D3DAFA"/><circle class="eye" cx="32" cy="21" r="2.4" fill="#14213D"/><circle class="eye" cx="44" cy="21" r="2.4" fill="#14213D"/><path d="M32.5 28q5.5 5 11 0" stroke="#14213D" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="27" cy="26" r="2.2" fill="#FF8E7A" opacity=".55"/><circle cx="49" cy="26" r="2.2" fill="#FF8E7A" opacity=".55"/><path class="zz" d="M58 6h8l-8 8h8" stroke="#BFD0FF" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
    <g class="gen__lamp">
      <path d="M52 140h46l-7-12H59z" fill="#A9681A"/>
      <path d="M22 102c0-22 24-32 53-32s53 10 53 32c0 15-13 25-31 27H53c-18-2-31-12-31-27z" fill="url(#gb)" stroke="#9A6215" stroke-width="2.5"/>
      <path d="M40 76c8-4 22-6 35-6" stroke="#fff" stroke-opacity=".6" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M45 78c0-8 13-14 30-14s30 6 30 14" fill="url(#gs)" stroke="#9A6215" stroke-width="2.2"/>
      <rect x="70" y="56" width="10" height="10" rx="3" fill="#C98C22"/><circle cx="75" cy="52" r="6.5" fill="url(#gs)" stroke="#9A6215" stroke-width="2"/>
      <path d="M28 96C10 92 6 72 17 60" stroke="url(#gs)" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M28 96C10 92 6 72 17 60" stroke="#9A6215" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"/>
      <path d="M126 96c22-6 26 14 14 26-4 4-9 5-14 4" stroke="url(#gs)" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M56 104c6 7 14 10 22 8" stroke="#fff" stroke-opacity=".45" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>
  </svg>
  <span class="gen__tip" aria-hidden="true"><b class="d">Rub for night</b><b class="n">Rub for day</b></span>
</button>`;
}
