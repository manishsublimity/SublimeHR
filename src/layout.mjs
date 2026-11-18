import { site, modules } from "./data.mjs";
import { icon } from "./icons.mjs";

export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const abs = (path) => site.url + path;
const V = Date.now().toString(36); // cache-busting version, changes every build

/* ---------------- Structured data ---------------- */
export const orgLd = {
  "@type": "Organization",
  "@id": site.url + "/#organization",
  name: site.name,
  url: site.url + "/",
  logo: abs(site.logo),
  description: site.description,
  contactPoint: [{ "@type": "ContactPoint", telephone: "+91-7976117684", contactType: "sales", availableLanguage: ["English", "Hindi", "Arabic"] }]
};
export const websiteLd = { "@type": "WebSite", "@id": site.url + "/#website", url: site.url + "/", name: site.name, publisher: { "@id": site.url + "/#organization" }, inLanguage: "en" };
export const softwareLd = {
  "@type": "SoftwareApplication",
  "@id": site.url + "/#software",
  name: "SublimeHR",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Human Resources Management System",
  operatingSystem: "Web, Android, iOS",
  url: site.url + "/",
  description: site.description,
  publisher: { "@id": site.url + "/#organization" },
  inLanguage: ["en", "ar"],
  offers: [
    { "@type": "Offer", name: "Starter", price: "4", priceCurrency: "USD", description: "Per user per month, up to 50 employees" },
    { "@type": "Offer", name: "Professional", price: "8", priceCurrency: "USD", description: "Per user per month, unlimited employees" }
  ],
  featureList: modules.map((m) => m.name).join(", ")
};
export const faqLd = (items) => ({ "@type": "FAQPage", mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
export const crumbLd = (trail) => ({ "@type": "BreadcrumbList", itemListElement: trail.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })) });


/* ---------------- Head ---------------- */
function head({ title, description, path, ld = [], noindex = false }) {
  const full = path === "/" ? title : `${title} | SublimeHR`;
  const graph = { "@context": "https://schema.org", "@graph": [orgLd, websiteLd, ...ld] };
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<script>try{if(localStorage.getItem("shr-theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}</script>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${abs(path)}">
<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1"}">
<meta name="theme-color" content="#FFFFFF">
<meta name="author" content="SublimeHR">
<meta property="og:type" content="website">
<meta property="og:site_name" content="SublimeHR">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(path)}">
<meta property="og:image" content="${abs(site.ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(full)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs(site.ogImage)}">
<link rel="icon" type="image/png" href="/assets/img/sublimehr-logo.png">
<link rel="apple-touch-icon" href="/assets/img/sublimehr-logo.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@500&display=swap">
<link rel="stylesheet" href="/assets/css/styles.css?v=${V}">
<link rel="alternate" type="text/plain" title="LLM summary" href="/llms.txt">
<script>try{if(sessionStorage.getItem("shr-intro")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-skip")}catch(e){}</script>
<script type="application/ld+json">${JSON.stringify(graph)}</script>
</head>`;
}

/* ---------------- Header ---------------- */
const TONES = ["", "mint", "butter", "peach", "lilac"];
function header(active) {
  const cur = (k) => (active === k ? ' aria-current="page"' : "");
  return `<a class="skip" href="#main">Skip to content</a>
<div class="intro" aria-hidden="true"><div class="intro__in"><span class="intro__logo"><img src="${site.logo}" alt="" width="84" height="75"></span><span class="intro__word">${[..."Sublime"].map((c, i) => `<span style="animation-delay:${0.45 + i * 0.04}s">${c}</span>`).join("")}${[..."HR"].map((c, i) => `<span class="t" style="animation-delay:${0.75 + i * 0.05}s">${c}</span>`).join("")}</span></div></div>
<div class="bar-progress" aria-hidden="true"></div>
<header class="header" id="header">
  <div class="container header__in">
    <a class="brand" href="/" aria-label="SublimeHR home"><img src="${site.logo}" alt="SublimeHR logo" width="38" height="34"><span>Sublime<span class="hr">HR</span></span></a>
    <nav class="menu" aria-label="Primary">
      <div class="m-item">
        <a class="menu-link" href="/features/"${cur("features")}>Product ${icon("chevron", "chev")}</a>
        <div class="mega">
          ${modules.map((m, i) => `<a href="/software/${m.slug}/"><span class="ico sm ${TONES[i % 5]}">${icon(m.icon)}</span><span><strong>${m.name}</strong><small>${m.short}</small></span></a>`).join("")}
          <div class="mega-foot"><span>✨ Every module has a live demo you can play with.</span><a class="link" href="/features/">All features ${icon("arrow")}</a></div>
        </div>
      </div>
      <a class="menu-link" href="/industries/"${cur("industries")}>Industries</a>
      <a class="menu-link" href="/pricing/"${cur("pricing")}>Pricing</a>
      <a class="menu-link" href="/integrations/"${cur("integrations")}>Integrations</a>
      <div class="m-item">
        <a class="menu-link" href="/about/"${cur("company")}>Company ${icon("chevron", "chev")}</a>
        <div class="mega sm">
          <a href="/about/"><span class="ico sm">${icon("building")}</span><span><strong>About us</strong><small>Mission &amp; vision</small></span></a>
          <a href="/custom-development/"><span class="ico sm mint">${icon("code")}</span><span><strong>Custom development</strong><small>Built around your workflow</small></span></a>
          <a href="/faq/"><span class="ico sm butter">${icon("message")}</span><span><strong>FAQ</strong><small>Ask our HR assistant</small></span></a>
          <a href="/contact/"><span class="ico sm peach">${icon("call")}</span><span><strong>Contact</strong><small>We reply within 1 business day</small></span></a>
        </div>
      </div>
    </nav>
    <button class="theme-tg" type="button" data-theme-toggle aria-label="Switch to dark theme" title="Toggle dark theme"><svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>
    <div class="header__cta">
      <a class="btn alt sm no-bub" href="/get-pricing/">Get pricing</a>
      <a class="btn sm" href="/book-demo/">Book a demo <span class="bub">${icon("arrow")}</span></a>
    </div>
    <button class="burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Open menu"><span class="i-open">${icon("menu")}</span><span class="i-close" hidden>${icon("close")}</span></button>
  </div>
</header>
<nav class="drawer" id="drawer" aria-label="Mobile">
  <details><summary>Product ${icon("chevron")}</summary><div class="sub"><a class="all" href="/features/"><span class="ico sm">${icon("layers")}</span><strong>All features</strong>${icon("arrow")}</a>${modules.map((m) => `<a href="/software/${m.slug}/"><span class="ico sm">${icon(m.icon)}</span><span>${m.name}</span></a>`).join("")}</div></details>
  <a class="d" href="/industries/">Industries</a><a class="d" href="/pricing/">Pricing</a><a class="d" href="/integrations/">Integrations</a><a class="d" href="/custom-development/">Custom development</a><a class="d" href="/about/">About</a><a class="d" href="/faq/">FAQ</a><a class="d" href="/contact/">Contact</a>
  <button class="d theme-row" type="button" data-theme-toggle aria-label="Switch to dark theme"><span>Dark mode</span><span class="sw" aria-hidden="true"><i></i></span></button>
  <div class="drawer__cta"><a class="btn alt no-bub" href="/get-pricing/">Get pricing</a><a class="btn" href="/book-demo/">Book a demo <span class="bub">${icon("arrow")}</span></a></div>
</nav>`;
}

/* ---------------- Footer ---------------- */
function footer() {
  const col = (t, links) => `<div><h2>${t}</h2><ul>${links.map(([n, h]) => `<li><a href="${h}">${n}</a></li>`).join("")}</ul></div>`;
  return `<footer class="footer">
  <span class="footer__glow g1" aria-hidden="true"></span><span class="footer__glow g2" aria-hidden="true"></span>
  <div class="container">
    <div class="footer__grid">
      <div class="footer__about">
        <a class="brand" href="/" aria-label="SublimeHR home"><img src="${site.logo}" alt="SublimeHR logo" width="38" height="34" loading="lazy"><span>Sublime<span class="hr">HR</span></span></a>
        <p>Powering your worklife — attendance, leave, payroll and self-service in one friendly platform.</p>
        <div class="footer__contact"><a href="${site.phoneHref}">${icon("call")} ${site.phone}</a><a href="${site.whatsapp}" target="_blank" rel="noopener">${icon("message")} Chat on WhatsApp</a></div>
      </div>
      ${col("Product", [["Features", "/features/"], ["Pricing", "/pricing/"], ["Integrations", "/integrations/"], ["Mobile app", "/software/mobile-workforce/"], ["Custom development", "/custom-development/"]])}
      ${col("Software", [["Attendance", "/software/attendance-management/"], ["Payroll", "/software/payroll/"], ["Leave", "/software/leave-management/"], ["Self service", "/software/employee-self-service/"], ["HR analytics", "/software/reports-analytics/"]])}
      ${col("Industries", [["Manufacturing", "/industries/#manufacturing"], ["Healthcare", "/industries/#healthcare"], ["IT &amp; Software", "/industries/#it-software"], ["Retail", "/industries/#retail"], ["Hospitality", "/industries/#hospitality"]])}
      ${col("Company", [["About", "/about/"], ["FAQ", "/faq/"], ["Contact", "/contact/"], ["Book a demo", "/book-demo/"]])}
    </div>
    <div class="footer__bar"><span>&copy; <span data-year>2026</span> SublimeHR. All rights reserved.</span><nav aria-label="Legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/sitemap.xml">Sitemap</a></nav></div>
  </div>
  <div class="footer__word" aria-hidden="true">SublimeHR</div>
</footer>
<button class="top-btn" type="button" aria-label="Back to top">${icon("arrow-up")}</button>
<script src="/assets/js/main.js?v=${V}" defer></script>`;
}

export function page({ title, description, path, active, ld, noindex, body }) {
  return `${head({ title, description, path, ld, noindex })}
<body>
${header(active)}
<main id="main">
${body}
</main>
${footer()}
</body>
</html>
`;
}

const PEOPLE = [["👩‍⚕️", "Aisha", "Staff nurse", "✓ Clocked in"], ["👨‍💼", "Omar", "HR manager", "Approved leave"], ["👩‍💻", "Priya", "Developer", "WFH today"], ["👷", "Ravi", "Plant lead", "Shift swapped"], ["👩‍🏫", "Sara", "Teacher", "Payslip ready"], ["🧑‍🍳", "Leo", "Head chef", "Overtime +2h"], ["👨‍🔧", "Karan", "Technician", "GPS verified"], ["👩‍💼", "Lina", "Finance", "Payroll closed"], ["🧑‍💼", "Yusuf", "Sales", "Visitor checked in"], ["🧑‍✈️", "Nora", "Logistics", "Route punch-in"]];
const personRow = (list) => { const h = list.map(([f, n, r, a]) => `<span class="person"><span class="face">${f}</span><span>${n}<small>${r}</small></span><span class="act">${a}</span></span>`).join(""); return h + h; };
const SK = (d, delay) => d.replace(/<(path|rect|circle|polyline|line)/g, `<$1 pathLength="100" style="animation-delay:${delay}s"`);
const sketchScene = () => `<svg class="sk" viewBox="0 0 1200 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <g transform="translate(70 40)">${SK('<rect x="0" y="0" width="150" height="96" rx="10"/><line x1="-14" y1="112" x2="164" y2="112"/><polyline points="18,74 50,52 78,62 108,30 132,38"/>', 0)}</g>
  <g transform="translate(330 220)">${SK('<circle cx="22" cy="18" r="14"/><path d="M-6 74c4-24 16-34 28-34s24 10 28 34"/><circle cx="82" cy="24" r="12"/><path d="M58 74c3-20 13-28 24-28s21 8 24 28"/>', 1.2)}</g>
  <g transform="translate(560 30)">${SK('<rect x="0" y="0" width="120" height="78" rx="10"/><circle cx="30" cy="34" r="14"/><line x1="56" y1="26" x2="102" y2="26"/><line x1="56" y1="42" x2="92" y2="42"/><line x1="18" y1="62" x2="102" y2="62"/>', 2.2)}</g>
  <g transform="translate(830 50)" class="pie"><circle cx="50" cy="50" r="40"/><circle class="w w1" cx="50" cy="50" r="20" pathLength="100"/><circle class="w w2" cx="50" cy="50" r="20" pathLength="100"/></g>
  <g transform="translate(1010 200)" class="bars"><line class="base" x1="-8" y1="96" x2="132" y2="96" pathLength="100"/><rect x="0" y="40" width="20" height="56" rx="4"/><rect x="34" y="16" width="20" height="80" rx="4"/><rect x="68" y="54" width="20" height="42" rx="4"/><rect x="102" y="4" width="20" height="92" rx="4"/></g>
  <g transform="translate(110 210)">${SK('<rect x="0" y="0" width="112" height="96" rx="10"/><line x1="0" y1="26" x2="112" y2="26"/><line x1="28" y1="-8" x2="28" y2="12"/><line x1="84" y1="-8" x2="84" y2="12"/><polyline points="36,62 50,76 78,46"/>', 3.1)}</g>
  <g transform="translate(720 230)">${SK('<circle cx="40" cy="40" r="36"/><polyline points="40,18 40,40 56,50"/>', 4)}</g>
</svg>`;
const pulseSvg = () => `<svg viewBox="0 0 1200 100" preserveAspectRatio="xMidYMid meet">
  <path id="ctaLine" class="guide" d="M0 70 H120 l10 -16 l10 26 l10 -10 H210 C210 54 216 46 230 46 V40 A12 12 0 1 1 229.99 40 V46 C244 46 250 54 250 70 H340 l10 -32 l12 54 l10 -34 l8 12 H440 V52 H458 V70 H466 V38 H484 V70 H492 V24 H510 V70 H600 V30 H664 V42 H600 V30 H664 V70 H760 l10 -28 l12 46 l10 -30 l8 12 H880 L900 86 L934 36 L948 70 H1200"/>
  <path class="draw" d="M0 70 H120 l10 -16 l10 26 l10 -10 H210 C210 54 216 46 230 46 V40 A12 12 0 1 1 229.99 40 V46 C244 46 250 54 250 70 H340 l10 -32 l12 54 l10 -34 l8 12 H440 V52 H458 V70 H466 V38 H484 V70 H492 V24 H510 V70 H600 V30 H664 V42 H600 V30 H664 V70 H760 l10 -28 l12 46 l10 -30 l8 12 H880 L900 86 L934 36 L948 70 H1200" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"><animate attributeName="stroke-dashoffset" values="100;0;0;100" keyTimes="0;0.68;0.9;1" dur="12s" repeatCount="indefinite"/></path>
  <circle class="tip" r="5"><animateMotion dur="12s" repeatCount="indefinite" keyPoints="0;1;1;0" keyTimes="0;0.68;0.9;1" calcMode="linear"><mpath href="#ctaLine"/></animateMotion></circle>
</svg>`;
const FEED = [["check", "Aisha clocked in", "Camera + GPS · 09:02", "teal"], ["calendar", "Leave approved", "Omar · 2 days annual", "blue"], ["wallet", "Payroll processed", "412 employees · March", "sun"], ["repeat", "Shift swapped", "Ravi ↔ Karan · Night", "lilac"], ["file", "Payslips delivered", "412 PDFs sent", "teal"], ["badge", "Visitor checked in", "John D. · Host: HR", "blue"], ["alert", "Late arrival flagged", "Priya · 09:24", "coral"], ["user-check", "New hire onboarded", "Sara · Finance", "teal"]];
const feedItem = ([ic, t, s, c]) => `<li class="fi"><span class="fi__ic ${c}">${icon(ic)}</span><span><b>${t}</b><small>${s}</small></span><em>now</em></li>`;
/* ---------------- Shared blocks ---------------- */
export const squiggle = (word) => `<span class="squiggle">${word}<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M3 14 C 40 4, 70 18, 105 9 S 165 4, 197 12"/></svg></span>`;
export const btn = (label, href, { alt = false, ic = "arrow", sm = false, blank = false } = {}) =>
  `<a class="btn${alt ? " alt" : ""}${sm ? " sm" : ""}" href="${href}"${blank ? ' target="_blank" rel="noopener"' : ""}>${label} <span class="bub">${icon(ic)}</span></a>`;

export function crumbs(trail) {
  return `<nav aria-label="Breadcrumb"><ol class="crumbs">${trail.map(([n, p], i) => (i === trail.length - 1 ? `<li><span aria-current="page">${esc(n)}</span></li>` : `<li><a href="${p}">${esc(n)}</a></li>`)).join("")}</ol></nav>`;
}

/** Compact light page hero. */
export function phero({ eyebrow, tone = "", title, lead, trail, actions = "", aside = "", extra = "" }) {
  return `<section class="phero${aside ? " dots" : " solo"}">
  <div class="container phero__grid">
    <div>
      ${trail ? crumbs(trail) : ""}
      ${eyebrow ? `<p class="eyebrow ${tone} rv"><i></i>${eyebrow}</p>` : ""}
      <h1 class="rv" style="--d:60ms">${title}</h1>
      ${lead ? `<p class="lead rv" style="--d:120ms">${lead}</p>` : ""}
      ${actions ? `<div class="hero__cta rv" style="--d:180ms">${actions}</div>` : ""}
      ${extra}
    </div>
    ${aside ? `<div class="rv pop" style="--d:160ms">${aside}</div>` : ""}
  </div>
</section>`;
}

export function sHead({ eyebrow, tone = "", title, lead, left = false }) {
  return `<div class="head${left ? " left" : ""} rv">
  ${eyebrow ? `<p class="eyebrow ${tone}"><i></i>${eyebrow}</p>` : ""}
  <h2>${title}</h2>
  ${lead ? `<p class="lead">${lead}</p>` : ""}
</div>`;
}

export function cta({
  title = "Give your HR team hours back — every week.",
  lead = "See how SublimeHR automates attendance, leave and payroll for your workforce. A 30-minute demo is all it takes.",
  primary = ["Book a demo", "/book-demo/"],
  secondary = ["Get pricing", "/get-pricing/"]
} = {}) {
  return `<section class="section tight">
  <div class="container">
    <div class="cta rv pop">
      <span class="deco d1" aria-hidden="true"></span>
      <div><h2>${title}</h2><p>${lead}</p></div>
      <div class="hero__cta">${btn(primary[0], primary[1])}${btn(secondary[0], secondary[1], { alt: true, ic: secondary[1].startsWith("http") ? "message" : "arrow", blank: secondary[1].startsWith("http") })}</div>
    </div>
  </div>
</section>`;
}

export { icon, TONES };
