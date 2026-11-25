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

/* Day / night switch: a small sun that becomes a moon, breathing and blinking like the characters on the home page. */
const face = '<g class="tf"><ellipse class="te" cx="19" cy="23" rx="2" ry="2.6"/><ellipse class="te" cx="29" cy="23" rx="2" ry="2.6"/><path d="M19.5 29.5c1.4 1.7 7.6 1.7 9 0" fill="none" stroke-width="2" stroke-linecap="round"/><circle class="tc" cx="15" cy="28" r="2"/><circle class="tc" cx="33" cy="28" r="2"/></g>';
export function themeFab() {
  return `<button class="tmode" type="button" data-theme-toggle aria-label="Switch to dark theme" title="Day / night"><span class="tmode__orb">
  <svg class="tmode__sun" viewBox="0 0 48 48" aria-hidden="true"><g class="rays">${Array.from({ length: 8 }, (_, i) => `<rect x="22.4" y="1.5" width="3.2" height="6.5" rx="1.6" transform="rotate(${i * 45} 24 24)"/>`).join("")}</g><circle class="body" cx="24" cy="24" r="12.5"/>${face}</svg>
  <svg class="tmode__moon" viewBox="0 0 48 48" aria-hidden="true"><circle class="body" cx="24" cy="24" r="14"/><circle class="cr" cx="33" cy="17" r="2.6"/><circle class="cr" cx="14.5" cy="31" r="2"/><circle class="cr" cx="31.5" cy="33.5" r="1.5"/><circle class="star" cx="38" cy="12" r="1.6"/><circle class="star" cx="42" cy="21" r="1.1"/>${face}</svg>
  </span><span class="tmode__tip"><b class="d">Night mode</b><b class="n">Day mode</b></span></button>`;
}
