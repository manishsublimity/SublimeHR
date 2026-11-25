import { modules } from "./data.mjs";
import { icon } from "./icons.mjs";

const TONES = ["", "mint", "butter", "peach", "lilac"];
const sun = '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const moon = '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
const item = (href, ic, tone, name, small) => `<a href="${href}"><span class="ni ${tone}">${icon(ic)}</span><span><strong>${name}</strong><small>${small}</small></span></a>`;

/* The header links (with the Product and Company drop-downs), the theme switch and the two buttons. */
export function navMenu(active = "") {
  const cur = (k) => (active === k ? ' aria-current="page"' : "");
  return `<nav class="nav__links" aria-label="Main">
    <div class="nav__item"><a href="/features/"${cur("features")}>Product ${icon("chevron", "chev")}</a>
      <div class="nav__mega">${modules.map((m, i) => item(`/software/${m.slug}/`, m.icon, TONES[i % 5], m.name, m.short.replace(/&/g, "&amp;"))).join("")}
        <div class="nav__foot"><span>✨ Every module has a live demo you can play with.</span><a href="/features/">All features ${icon("arrow")}</a></div></div></div>
    <a href="/industries/"${cur("industries")}>Industries</a><a href="/pricing/"${cur("pricing")}>Pricing</a><a href="/integrations/"${cur("integrations")}>Integrations</a>
    <div class="nav__item"><a href="/about/"${cur("company")}>Company ${icon("chevron", "chev")}</a>
      <div class="nav__mega sm">${item("/about/", "building", "", "About us", "Mission &amp; vision")}${item("/custom-development/", "code", "mint", "Custom development", "Built around your workflow")}${item("/faq/", "message", "butter", "FAQ", "Ask our HR assistant")}${item("/contact/", "call", "peach", "Contact", "We reply within 1 business day")}</div></div>
  </nav>
  <button class="nav__tg" type="button" data-theme-toggle aria-label="Switch to dark theme" title="Light / dark">${sun}${moon}</button>
  <a class="btn nav__alt" href="/get-pricing/">Get pricing</a>
  <a class="btn btn--on" href="/book-demo/">Book a demo</a>`;
}
