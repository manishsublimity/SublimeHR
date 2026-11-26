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
      <div class="nav__mega sm">${feat("Company", "Say hello.", "Ask about demos, support or partnerships.", "Contact us", "/contact/", who(omar, 1))}
        <div class="nm__list">${row("/about/", "building", "About us", "Mission &amp; vision")}${row("/custom-development/", "code", "Custom development", "Built around your workflow")}${row("/faq/", "message", "FAQ", "Ask our HR assistant")}${row("/contact/", "call", "Contact", "We reply within 1 business day")}</div></div></div>
  </nav>
  <a class="btn btn--on" href="/book-demo/">Book a demo</a>`;
}

/* Day / night switch: the little pull-cord lamp that hangs from the top of the page. Pull it and the lights go to night. */
export function themeFab() {
  return `<div class="lamp" data-lamp role="group" aria-label="Day and night lamp">
  <button class="lamp__cord" type="button" data-lcord aria-label="Bulb options" aria-expanded="false"></button>
  <div class="lamp__body">
    <button class="lamp__shade" type="button" data-lface aria-label="Play with the lamp: tickle it, or pull it down"><i class="le lL"></i><i class="le lR"></i><i class="lm"></i><i class="lch lL"></i><i class="lch lR"></i></button>
    <button class="lamp__bulb" type="button" data-lbulb aria-label="Take the bulb out or put it back"></button><span class="lamp__beam" aria-hidden="true"></span>
    <button class="lamp__chain" type="button" data-lpull aria-label="Pull the chain: day or night"><i></i></button>
    <span class="lamp__tip" aria-hidden="true"><b class="d">Pull for night</b><b class="n">Pull for day</b></span>
    <span class="lamp__say" data-lsay aria-live="polite"></span>
  </div>
  <div class="lamp__menu" data-lmenu hidden role="dialog" aria-label="Lamp options">
    <b>Pick a bulb</b>
    <div class="lamp__sw"><button type="button" data-lc="255,200,70|#FFFBE0|#FFC233" style="--c:#FFC233" aria-label="Warm"></button><button type="button" data-lc="255,255,255|#FFFFFF|#E8EEF8" style="--c:#E8EEF8" aria-label="White"></button><button type="button" data-lc="255,120,170|#FFE3EE|#FF8FB8" style="--c:#FF8FB8" aria-label="Pink"></button><button type="button" data-lc="90,170,255|#E3F1FF|#6FB4FF" style="--c:#6FB4FF" aria-label="Blue"></button><button type="button" data-lc="70,220,150|#E0FFF0|#4FD69C" style="--c:#4FD69C" aria-label="Green"></button></div>
    <button type="button" data-lact="bulb" class="lamp__act">Take the bulb out</button>
    <button type="button" data-lact="swing" class="lamp__act">Give it a swing</button>
  </div>
</div>
<script src="/assets/js/lamp.js?v=${Date.now().toString(36)}" defer></script>`;
}

