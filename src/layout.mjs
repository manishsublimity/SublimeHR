import { site, modules } from "./data.mjs";
import { icon } from "./icons.mjs";
import { navMenu, themeFab } from "./navparts.mjs";

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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Unbounded:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap">
<link rel="stylesheet" href="/assets/css/styles.css?v=${V}">
<link rel="stylesheet" href="/assets/css/site2.css?v=${V}">
<link rel="stylesheet" href="/assets/css/site3.css?v=${V}">
<link rel="stylesheet" href="/assets/css/site4.css?v=${V}">
<link rel="stylesheet" href="/assets/css/site5.css?v=${V}">
<link rel="stylesheet" href="/assets/css/navhome.css?v=${V}">
<link rel="stylesheet" href="/assets/css/navmenu.css?v=${V}">
<link rel="stylesheet" href="/assets/css/system.css?v=${V}">
<link rel="stylesheet" href="/assets/css/cast.css?v=${V}">
<link rel="alternate" type="text/plain" title="LLM summary" href="/llms.txt">
<script>try{if(sessionStorage.getItem("shr-intro")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-skip")}catch(e){}</script>
<script type="application/ld+json">${JSON.stringify(graph)}</script>
</head>`;
}

/* ---------------- Header ---------------- */
const TONES = ["", "mint", "butter", "peach", "lilac"];
const WORLD = { "/": "it", "/features/": "it", "/industries/": "school", "/pricing/": "it", "/integrations/": "hotel", "/custom-development/": "logistics", "/about/": "school", "/faq/": "it", "/contact/": "hospital", "/book-demo/": "it", "/get-pricing/": "retail", "/privacy/": "bank", "/terms/": "bank", "/404.html": "it",
  "/software/attendance-management/": "hospital", "/software/employee-management/": "it", "/software/leave-management/": "logistics", "/software/payroll/": "retail", "/software/shift-scheduling/": "school", "/software/reports-analytics/": "bank", "/software/employee-self-service/": "hotel", "/software/visitor-management/": "restaurant", "/software/security-access/": "bank", "/software/mobile-workforce/": "it" };
export function nav2(active) {
  const cur = (k) => (active === k ? ' aria-current="page"' : "");
  return `<a class="skip" href="#main">Skip to content</a>
<header class="nav onhero" data-nav>
  <a class="nav__brand" href="/"><i class="nav__logo" style="--logo:url(${site.logo})" aria-hidden="true"></i><span>Sublime<b>HR</b></span></a>
  ${navMenu(active)}
</header>
<div class="bar-progress" aria-hidden="true"></div>`;
}
const header = nav2;

/* ---------------- Footer ---------------- */
function footer() {
  const col = (t, links) => `<div><h2>${t}</h2><ul>${links.map(([n, h]) => `<li><a href="${h}">${n}</a></li>`).join("")}</ul></div>`;
  return `<footer class="foot2">
  <div class="container">
    <div class="foot2__grid">
      <div class="foot2__about">
        <a class="brand2" href="/" aria-label="SublimeHR home"><img src="${site.logo}" alt="SublimeHR logo" width="38" height="34" loading="lazy"><span>Sublime<b>HR</b></span></a>
        <p>Powering your worklife: attendance, leave, payroll and self-service in one friendly platform.</p>
        <div class="foot2__contact"><a href="${site.phoneHref}"><i>${icon("call")}</i><span><small>Call us</small><b>${site.phone}</b></span></a><a href="${site.whatsapp}" target="_blank" rel="noopener"><i>${icon("message")}</i><span><small>WhatsApp</small><b>Chat with us</b></span></a></div>
      </div>
      ${col("Product", [["Features", "/features/"], ["Pricing", "/pricing/"], ["Integrations", "/integrations/"], ["Mobile app", "/software/mobile-workforce/"], ["Custom development", "/custom-development/"]])}
      ${col("Software", [["Attendance", "/software/attendance-management/"], ["Payroll", "/software/payroll/"], ["Leave", "/software/leave-management/"], ["Self service", "/software/employee-self-service/"], ["HR analytics", "/software/reports-analytics/"]])}
      ${col("Industries", [["Manufacturing", "/industries/#manufacturing"], ["Healthcare", "/industries/#healthcare"], ["IT &amp; Software", "/industries/#it-software"], ["Retail", "/industries/#retail"], ["Hospitality", "/industries/#hospitality"]])}
      ${col("Company", [["About", "/about/"], ["FAQ", "/faq/"], ["Contact", "/contact/"], ["Book a demo", "/book-demo/"], ["Home", "/"]])}
    </div>
    <div class="foot2__bar"><span>&copy; <span data-year>2026</span> SublimeHR. All rights reserved.</span><nav aria-label="Legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/sitemap.xml">Sitemap</a></nav></div>
  </div>
  <div class="foot2__word" aria-hidden="true">SublimeHR</div>
</footer>
${themeFab()}
<button class="top-btn" type="button" aria-label="Back to top">${icon("arrow-up")}</button>
<script src="/assets/js/main.js?v=${V}" defer></script>
<script src="/assets/js/navhome.js?v=${V}" defer></script>
<script src="/assets/js/live.js?v=${V}" defer></script>`;
}

export function page({ title, description, path, active, ld, noindex, body, world }) {
  const w = world || WORLD[path] || "it";
  return `${head({ title, description, path, ld, noindex })}
<body class="v2" data-w="it">
<script>try{var w=localStorage.getItem("shr-world");if(w)document.body.setAttribute("data-w",w)}catch(e){}</script>
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
  secondary = ["Get pricing", "/get-pricing/"],
  aside = ""
} = {}) {
  return `<section class="section tight">
  <div class="container">
    <div class="cta rv pop${aside ? " has-crowd" : ""}">
      <span class="deco d1" aria-hidden="true"></span>
      <div><h2>${title}</h2><p>${lead}</p></div>${aside}
      <div class="hero__cta">${btn(primary[0], primary[1])}${btn(secondary[0], secondary[1], { alt: true, ic: secondary[1].startsWith("http") ? "message" : "arrow", blank: secondary[1].startsWith("http") })}</div>
    </div>
  </div>
</section>`;
}

export { icon, TONES };
