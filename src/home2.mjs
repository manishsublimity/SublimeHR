// Home design option B — "Glass Universe".
// 1) Real-time 3D hero (WebGL/three.js): iridescent breathing glass core + glass HR cards orbiting in space, camera flies through on scroll.
// 2) 3D laptop + phone (CSS 3D) that open and turn on scroll, screens auto-play and sync.
// 3) "Just ask" command demo · 4) front-facing module orbit · 5) tilted industries wall + numbers · 6) colour-shifting CTA orb.
import { site, modules, industries } from "./data.mjs";
import { icon } from "./icons.mjs";

const V = Date.now().toString(36);
const arrow = icon("arrow");
const asks = [["approve", "Approve Omar's leave"], ["late", "Who's late today?"], ["payroll", "Run March payroll"], ["headcount", "Headcount by branch"]];
const tabs = [["clock", "Attendance"], ["calendar", "Leave"], ["wallet", "Payroll"], ["chart", "Reports"]];

const screenPanels = `
  <div class="scr__panel on" data-p="0"><div class="scr__kpis"><div><small>Present</small><b data-present>395</b></div><div><small>Late</small><b>4</b></div><div><small>On leave</small><b>11</b></div></div>
    <div class="scr__list" data-feed><div class="li"><i style="--c:#3FBDB3">AK</i><span>Aisha clocked in · Selfie + GPS</span><em>08:52</em></div><div class="li"><i style="--c:#5A93D1">RV</i><span>Ravi clocked in · Biometric</span><em>08:57</em></div><div class="li"><i style="--c:#F29C7B">PS</i><span>Priya · late, within grace</span><em>09:12</em></div></div></div>
  <div class="scr__panel" data-p="1"><div class="scr__cal">${Array.from({ length: 28 }, (_, i) => `<span class="${[9, 10].includes(i) ? "a" : [16, 17, 18].includes(i) ? "b" : i % 7 > 4 ? "w" : ""}">${i + 1}</span>`).join("")}</div><div class="scr__note"><i class="ok">✓</i>Omar · 2 days annual leave approved</div></div>
  <div class="scr__panel" data-p="2"><div class="scr__bars">${[46, 58, 52, 70, 64, 88].map((h) => `<i style="--h:${h}%"></i>`).join("")}</div><div class="scr__note"><i class="ok">✓</i>March payroll · 412 payslips sent</div></div>
  <div class="scr__panel" data-p="3"><svg class="scr__line" viewBox="0 0 300 100" preserveAspectRatio="none"><path d="M0 80 C40 70 70 74 100 56 S170 44 200 40 S260 16 300 12" pathLength="100"/></svg><div class="scr__note"><i class="ok">↗</i>Headcount +4.2% · 13 reports ready</div></div>`;

export function home2() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SublimeHR — Glass Universe (design option B)</title>
<meta name="description" content="${site.description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${site.url}/">
<meta name="theme-color" content="#050813">
<link rel="icon" type="image/png" href="${site.logo}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/home2.css?v=${V}">
<script type="importmap">{ "imports": { "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js", "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/" } }</script>
</head>
<body class="gu">
<a class="skip" href="#main">Skip to content</a>

<header class="top" data-top>
  <a class="brand" href="/home-v2/" aria-label="SublimeHR home"><img src="${site.logo}" alt="" width="30" height="27"><span>Sublime<b>HR</b></span></a>
  <nav class="top__links" aria-label="Main"><a href="/features/">Product</a><a href="/industries/">Industries</a><a href="/pricing/">Pricing</a><a href="/about/">Company</a></nav>
  <a class="btn" href="/book-demo/"><span>Book a demo</span>${arrow}</a>
</header>

<main id="main">
  <!-- 1. 3D HERO -->
  <section class="hero" data-hero>
    <div class="hero__pin">
      <canvas class="gl" data-gl aria-hidden="true"></canvas>
      <div class="gl-fallback" aria-hidden="true"></div>
      <div class="hero__txt" data-hero-txt>
        <p class="kicker"><span class="live"></span>Cloud HR · Attendance · Leave · Payroll</p>
        <h1>HR that's <span class="shine">alive</span>.</h1>
        <p class="lead">Every punch, request and payslip moves through one living record — so your people feel looked after and your HR team finally breathes.</p>
        <div class="cta-row"><a class="btn lg" href="/book-demo/"><span>Book a free demo</span>${arrow}</a><a class="btn lg ghost" href="#see"><span>See it work</span></a></div>
      </div>
      <div class="hero__ticker" aria-hidden="true"><span><i></i><b data-tick>Aisha clocked in · 08:52</b></span></div>
      <p class="scroll-cue" aria-hidden="true"><i></i>Scroll to fly through</p>
    </div>
  </section>

  <!-- 2. 3D LAPTOP + PHONE -->
  <section class="see" id="see" data-see>
    <div class="see__pin">
      <div class="see__copy">
        <p class="kicker">The product, live</p>
        <h2 data-cap>Open it up.</h2>
        <p class="see__sub" data-capsub>Admins run everything from the web. Employees do the rest from their phone — and both stay perfectly in sync.</p>
        <ol class="steps" aria-hidden="true"><li class="on">Open</li><li>Auto-plays</li><li>Phone syncs</li></ol>
      </div>
      <div class="dev" data-dev>
        <div class="lap">
          <div class="lap__lid" data-lid>
            <div class="lap__screen">
              <div class="scr">
                <div class="scr__top"><span class="dots3"><i></i><i></i><i></i></span><b>SublimeHR · Admin</b><span class="scr__toast" data-toast>Sara clocked in from mobile ✓</span></div>
                <div class="scr__body">
                  <nav class="scr__nav">${tabs.map(([ic, t], i) => `<span class="${i === 0 ? "on" : ""}" data-t="${i}">${icon(ic)}${t}</span>`).join("")}</nav>
                  <div class="scr__main">${screenPanels}</div>
                </div>
              </div>
            </div>
            <div class="lap__back"></div>
          </div>
          <div class="lap__base"><i class="pad"></i></div>
        </div>
        <div class="phone" data-phone>
          <div class="phone__in">
            <div class="ph__head"><small>Good morning</small><b>Sara</b></div>
            <button class="ph__btn" type="button" tabindex="-1" data-phbtn>${icon("fingerprint")}<span data-phlabel>Clock in</span></button>
            <div class="ph__row"><span>${icon("calendar")}Leave · 14 days</span><span>${icon("file")}Payslip</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. JUST ASK -->
  <section class="ask" id="ask">
    <div class="ask__head"><p class="kicker">Try it · no sign-up</p><h2>HR at the speed of a sentence.</h2><p>Pick a request and watch SublimeHR do the work.</p></div>
    <div class="cmd" data-cmd>
      <div class="cmd__bar"><span class="cmd__ic">${icon("search")}</span><span class="cmd__input"><span data-cmd-text></span><i class="caret"></i></span><kbd>⌘ K</kbd></div>
      <div class="cmd__sugg" role="group" aria-label="Example requests">${asks.map(([k, t]) => `<button type="button" data-ask="${k}">${t}</button>`).join("")}</div>
      <div class="cmd__out" data-cmd-out aria-live="polite"><div class="cmd__idle">${icon("sparkles")}<span>Choose a request above</span></div></div>
    </div>
  </section>

  <!-- 4. MODULE ORBIT (front-facing) -->
  <section class="orbit" aria-label="All modules">
    <div class="orbit__head"><p class="kicker">Ten modules · one orbit</p><h2>Everything circles your people.</h2><p class="hint">${icon("pointer")} Drag to spin · tap to explore</p></div>
    <div class="orbit__stage" data-orbit>
      <div class="orbit__core"><span class="core-ring"></span><img src="${site.logo}" alt="" width="84" height="75"></div>
      ${modules.map((m, i) => `<a class="planet" href="/software/${m.slug}/" data-planet="${i}" draggable="false"><span class="gico">${icon(m.icon)}</span><b>${m.name}</b><small>${m.tagline}</small></a>`).join("")}
    </div>
  </section>

  <!-- 5. INDUSTRIES WALL + NUMBERS -->
  <section class="wall" aria-label="Industries">
    <div class="wall__head"><p class="kicker">Made for every workplace</p><h2>Nine industries. One platform.</h2></div>
    <div class="wall__tilt" aria-hidden="true">
      <div class="wall__row"><div class="wall__track">${[...industries, ...industries].map((ind) => `<span class="tile"><span class="gico sm">${icon(ind.icon)}</span>${ind.name}</span>`).join("")}</div></div>
      <div class="wall__row rev"><div class="wall__track">${[...industries.slice().reverse(), ...industries.slice().reverse()].map((ind) => `<span class="tile"><span class="gico sm">${icon(ind.icon)}</span>${ind.name}</span>`).join("")}</div></div>
    </div>
    <div class="nums">${[["70", "+", "feature areas"], ["13", "", "built-in reports"], ["10", "", "connected modules"], ["2", "", "languages · EN & AR"]].map(([n, s, l]) => `<div><b><span data-cnt="${n}">0</span>${s}</b><small>${l}</small></div>`).join("")}</div>
  </section>

  <!-- 6. CTA -->
  <section class="end">
    <canvas class="stars" data-stars aria-hidden="true"></canvas>
    <p class="kicker">30 minutes · your own policies</p>
    <h2>Ready when your people are.</h2>
    <a class="orb" href="/book-demo/"><span class="orb__ring"></span><span class="orb__in"><span>Book a demo ${arrow}</span></span></a>
    <p class="end__alt"><a href="/get-pricing/">Get pricing</a><span>·</span><a href="${site.phoneHref}">${site.phone}</a><span>·</span><a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></p>
  </section>
</main>

<footer class="foot"><span>© <span data-y>2026</span> SublimeHR</span><nav aria-label="Footer"><a href="/features/">Features</a><a href="/pricing/">Pricing</a><a href="/faq/">FAQ</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a></nav></footer>
<a class="optB" href="/">Design option B · view current home</a>
<script src="/assets/js/home2.js?v=${V}" defer></script>
<script type="module" src="/assets/js/home2-3d.js?v=${V}"></script>
</body>
</html>`;
}
