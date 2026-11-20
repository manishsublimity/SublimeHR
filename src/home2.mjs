// Home design option B — "Living Workforce".
// Thousands of particles = your people. They assemble into the SublimeHR logo on every load (from a different
// random formation each time), then morph into HR meaning as you scroll: clock → calendar → payroll → globe → people.
// Followed by a "just ask" command bar demo, a 3D module ring and a magnetic CTA. Standalone page at /home-v2/.
import { site, modules } from "./data.mjs";
import { icon } from "./icons.mjs";

const V = Date.now().toString(36);
const arrow = icon("arrow");

const chapters = [
  { shape: "logo", k: "SublimeHR · Workforce OS", h: "Every person.<br>One pulse.", p: "The HR platform where attendance, leave, payroll and people move as one — on a single living record.", chip: null },
  { shape: "clock", k: "01 · Attendance", h: "Time, captured<br>by itself.", p: "Selfie, GPS, geofence and biometric punches. Late marks and overtime calculate themselves.", chip: "<b data-now>09:41</b><small>live · your time right now</small>" },
  { shape: "calendar", k: "02 · Leave", h: "Time off,<br>in two taps.", p: "Employees apply from the app, balances update instantly, managers approve with team calendars.", chip: "<b>2 days</b><small>approved in 12 seconds</small>" },
  { shape: "bars", k: "03 · Payroll", h: "Payroll,<br>without the panic.", p: "Attendance, leave and overtime flow straight in. Run it, review it, send payslips in one click.", chip: "<b>412</b><small>payslips sent · 0 errors</small>" },
  { shape: "globe", k: "04 · Everywhere", h: "Wherever your<br>people are.", p: "Office, field, remote and multi-branch — on web and native mobile, in English and العربية.", chip: "<b>EN · AR</b><small>multi-branch · mobile</small>" },
  { shape: "people", k: "05 · One record", h: "412 people.<br>One record.", p: "Ten modules share one employee record — so nothing is typed twice and nothing gets lost.", chip: "<b>10</b><small>modules, one source of truth</small>" }
];

const asks = [
  ["approve", "Approve Omar's leave"],
  ["late", "Who's late today?"],
  ["payroll", "Run March payroll"],
  ["headcount", "Headcount by branch"]
];

export function home2() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SublimeHR — Living Workforce (design option B)</title>
<meta name="description" content="${site.description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${site.url}/">
<meta name="theme-color" content="#04070F">
<link rel="icon" type="image/png" href="${site.logo}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/home2.css?v=${V}">
</head>
<body class="lw">
<a class="skip" href="#main">Skip to content</a>
<div class="cursor" aria-hidden="true"><i></i></div>
<div class="grain" aria-hidden="true"></div>

<header class="top">
  <a class="brand" href="/home-v2/" aria-label="SublimeHR home"><img src="${site.logo}" alt="" width="30" height="27"><span>Sublime<b>HR</b></span></a>
  <nav class="top__links" aria-label="Main"><a href="/features/">Product</a><a href="/industries/">Industries</a><a href="/pricing/">Pricing</a><a href="/about/">Company</a></nav>
  <a class="btn" href="/book-demo/" data-magnet><span>Book a demo</span>${arrow}</a>
</header>

<main id="main">
  <!-- 1. LIVING WORKFORCE: sticky particle stage, 6 chapters -->
  <section class="stage" data-stage style="--n:${chapters.length}" aria-label="What SublimeHR does">
    <div class="stage__pin">
      <canvas class="field" data-field aria-hidden="true"></canvas>
      <div class="stage__glow" aria-hidden="true"></div>
      <div class="chapters">
        ${chapters.map((c, i) => `<article class="chap${i === 0 ? " on" : ""}" data-chap="${i}" data-shape="${c.shape}">
          <p class="chap__k">${c.k}</p>
          <h${i === 0 ? 1 : 2} class="chap__h" data-decode>${c.h}</h${i === 0 ? 1 : 2}>
          <p class="chap__p">${c.p}</p>
          ${i === 0 ? `<div class="chap__cta"><a class="btn lg" href="/book-demo/" data-magnet><span>Book a free demo</span>${arrow}</a><a class="btn lg ghost" href="#ask" data-magnet><span>Try it live</span></a></div>` : ""}
          ${c.chip ? `<div class="chip">${c.chip}</div>` : ""}
        </article>`).join("")}
      </div>
      <ol class="dots" aria-hidden="true">${chapters.map((c, i) => `<li class="${i === 0 ? "on" : ""}"><span>${c.k.split("·")[1] ? c.k.split("·")[1].trim() : "Start"}</span></li>`).join("")}</ol>
      <p class="scrollhint" aria-hidden="true"><i></i>Scroll — watch your people move</p>
    </div>
  </section>

  <!-- 2. JUST ASK: command bar demo -->
  <section class="ask" id="ask">
    <div class="ask__head">
      <p class="eyebrow">Try it live · no sign-up</p>
      <h2 data-decode>HR, at the speed<br>of a sentence.</h2>
      <p>Pick a request and watch SublimeHR do the work. This is how simple your Monday becomes.</p>
    </div>
    <div class="cmd" data-cmd>
      <div class="cmd__bar"><span class="cmd__ic">${icon("search")}</span><span class="cmd__input"><span data-cmd-text></span><i class="caret"></i></span><kbd>⌘ K</kbd></div>
      <div class="cmd__sugg" role="group" aria-label="Example requests">${asks.map(([k, t]) => `<button type="button" data-ask="${k}">${t}</button>`).join("")}</div>
      <div class="cmd__out" data-cmd-out aria-live="polite">
        <div class="cmd__idle">${icon("sparkles")}<span>Choose a request above</span></div>
      </div>
    </div>
  </section>

  <!-- 3. MODULE RING: drag to spin -->
  <section class="ring" aria-label="All modules">
    <div class="ring__head"><p class="eyebrow">Ten modules · one orbit</p><h2 data-decode>Everything orbits<br>your people.</h2><p class="ring__hint">${icon("pointer")} Drag to spin · tap a module</p></div>
    <div class="ring__scene" data-ring>
      <div class="ring__core"><img src="${site.logo}" alt="" width="80" height="71"></div>
      <div class="ring__spin" data-spin>
        ${modules.map((m, i) => `<a class="mod" href="/software/${m.slug}/" style="--i:${i};--n:${modules.length}" draggable="false"><span class="mod__ic">${icon(m.icon)}</span><b>${m.name}</b><small>${m.tagline}</small><span class="mod__go">${arrow}</span></a>`).join("")}
      </div>
    </div>
  </section>

  <!-- 4. CTA -->
  <section class="end">
    <canvas class="end__stars" data-stars aria-hidden="true"></canvas>
    <p class="eyebrow">30 minutes · your own policies</p>
    <h2 data-decode>Ready when<br>your people are.</h2>
    <a class="orb" href="/book-demo/" data-magnet data-orb><span class="orb__ring"></span><span class="orb__in"><span>Book a<br>demo ${arrow}</span></span></a>
    <p class="end__alt"><a href="/get-pricing/">Get pricing</a><span>·</span><a href="${site.phoneHref}">${site.phone}</a><span>·</span><a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></p>
  </section>
</main>

<footer class="foot">
  <span>© <span data-y>2026</span> SublimeHR</span>
  <nav aria-label="Footer"><a href="/features/">Features</a><a href="/pricing/">Pricing</a><a href="/faq/">FAQ</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a></nav>
</footer>

<a class="optB" href="/">Design option B · view current home</a>
<script src="/assets/js/home2.js?v=${V}" defer></script>
</body>
</html>`;
}
