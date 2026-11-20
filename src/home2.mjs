// Home design option B — "Calm Aurora": a familiar, easy-to-read layout with premium, relaxing motion.
// Standalone page at /home-v2/ (noindex, not in sitemap). Own fonts, palette, buttons and motion system.
import { site, modules, industries, findFaq, homeFaqIds } from "./data.mjs";
import { icon } from "./icons.mjs";

const V = Date.now().toString(36);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const arrow = icon("arrow");
const faqList = homeFaqIds.slice(0, 6).map(findFaq).filter(Boolean);
const featured = ["attendance-management", "leave-management", "payroll", "shift-scheduling", "employee-self-service", "reports-analytics"]
  .map((s) => modules.find((m) => m.slug === s)).filter(Boolean);

/* Small product previews used in the module showcase (pure HTML/CSS) */
const previews = {
  "attendance-management": `<div class="pv pv-att"><div class="pv-row"><b>Today</b><span class="chip ok">96% present</span></div>
    <div class="ring" style="--v:.96"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50"/><circle class="v" cx="60" cy="60" r="50" pathLength="100"/></svg><span><b>396</b><small>of 412 in</small></span></div>
    <ul class="pv-list"><li><i class="av" style="--c:#3FBDB3">AK</i>Aisha · 08:52<span class="chip ok">On time</span></li><li><i class="av" style="--c:#F2A27B">PS</i>Priya · 09:16<span class="chip warn">Grace</span></li></ul></div>`,
  "leave-management": `<div class="pv pv-leave"><div class="pv-row"><b>April</b><span class="chip">Team calendar</span></div>
    <div class="cal7">${Array.from({ length: 28 }, (_, i) => `<span class="${[8, 9].includes(i) ? "on" : [15, 16, 17].includes(i) ? "on2" : i % 7 > 4 ? "we" : ""}">${i + 1}</span>`).join("")}</div>
    <div class="pv-row sm"><span><i class="dot" style="--c:#2F72B8"></i>Omar · annual</span><span><i class="dot" style="--c:#3FBDB3"></i>Sara · sick</span></div></div>`,
  payroll: `<div class="pv pv-pay"><div class="pv-row"><b>March payroll</b><span class="chip ok">Ready</span></div>
    <div class="bars">${[48, 62, 55, 70, 66, 84].map((h, i) => `<i style="--h:${h}%;--d:${i * 70}ms"></i>`).join("")}</div>
    <div class="pv-row"><span class="muted">412 payslips</span><b>1,230,360</b></div></div>`,
  "shift-scheduling": `<div class="pv pv-shift"><div class="pv-row"><b>Week roster</b><span class="chip">3 shifts</span></div>
    ${["Morning", "Evening", "Night"].map((s, r) => `<div class="sh"><small>${s}</small>${Array.from({ length: 5 }, (_, i) => `<i class="t${(i + r) % 3}"></i>`).join("")}</div>`).join("")}</div>`,
  "employee-self-service": `<div class="pv pv-ess"><div class="phone2"><div class="ph-top"><b>Hi, Sara</b><small>Finance · Dubai</small></div>
    <div class="ph-grid"><span>${icon("clock")}<small>Clock in</small></span><span>${icon("calendar")}<small>Leave</small></span><span>${icon("file")}<small>Payslip</small></span><span>${icon("message")}<small>Requests</small></span></div>
    <div class="ph-card"><small>Leave balance</small><b>14 days</b></div></div></div>`,
  "reports-analytics": `<div class="pv pv-rep"><div class="pv-row"><b>Headcount</b><span class="chip ok">+4.2%</span></div>
    <svg class="spark" viewBox="0 0 300 110" preserveAspectRatio="none"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3FBDB3" stop-opacity=".35"/><stop offset="1" stop-color="#3FBDB3" stop-opacity="0"/></linearGradient></defs><path class="area" d="M0 90 C40 80 60 60 100 64 S160 40 200 42 S260 18 300 14 V110 H0Z"/><path class="line" d="M0 90 C40 80 60 60 100 64 S160 40 200 42 S260 18 300 14" pathLength="100"/></svg>
    <div class="pv-row sm"><span>13 reports</span><span>Export · PDF · Excel</span></div></div>`
};

export function home2() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SublimeHR — HR that feels effortless (design option B)</title>
<meta name="description" content="${esc(site.description)}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${site.url}/">
<meta name="theme-color" content="#FBFCFE">
<link rel="icon" type="image/png" href="${site.logo}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/home2.css?v=${V}">
</head>
<body class="ca">
<a class="skip" href="#main">Skip to content</a>
<div class="aurora" aria-hidden="true"><i class="a1"></i><i class="a2"></i><i class="a3"></i></div>

<header class="nav" data-nav>
  <div class="nav__in">
    <a class="brand" href="/home-v2/" aria-label="SublimeHR home"><img src="${site.logo}" alt="" width="32" height="29"><span>Sublime<b>HR</b></span></a>
    <nav class="nav__links" aria-label="Main"><a href="/features/">Product</a><a href="/industries/">Industries</a><a href="/pricing/">Pricing</a><a href="/integrations/">Integrations</a><a href="/about/">Company</a></nav>
    <div class="nav__act"><a class="nav__link" href="/contact/">Contact</a><a class="btn sm" href="/book-demo/"><span>Book a demo</span>${arrow}</a>
      <button class="nav__menu" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu" data-menu><i></i><i></i></button></div>
  </div>
</header>
<div class="menu" id="menu" hidden>
  <a href="/features/">Product</a><a href="/industries/">Industries</a><a href="/pricing/">Pricing</a><a href="/integrations/">Integrations</a><a href="/about/">Company</a><a href="/contact/">Contact</a>
  <a class="btn lg" href="/book-demo/"><span>Book a free demo</span>${arrow}</a>
</div>

<main id="main">
  <!-- 1. HERO -->
  <section class="hero">
    <a class="pillnote" href="/software/mobile-workforce/" data-rv><span class="pillnote__tag">New</span>Mobile clock-in with selfie &amp; geofence ${arrow}</a>
    <h1 data-rv>HR that feels <span class="grad">effortless</span>.</h1>
    <p class="hero__lead" data-rv>Attendance, leave, payroll and self-service — beautifully connected on one employee record, so your team spends less time on admin and more time on people.</p>
    <div class="hero__cta" data-rv>
      <a class="btn lg" href="/book-demo/"><span>Book a free demo</span>${arrow}</a>
      <a class="btn lg ghost" href="#showcase"><span>Explore the product</span></a>
    </div>
    <p class="hero__meta" data-rv>${icon("check")}No card needed ${icon("check")}Live in days ${icon("check")}English &amp; العربية</p>

    <div class="stage" data-tilt>
      <div class="dash">
        <aside class="dash__side"><span class="logo-dot"></span>${["dashboard", "users", "clock", "calendar", "wallet", "chart"].map((n, i) => `<i class="${i === 0 ? "on" : ""}">${icon(n)}</i>`).join("")}</aside>
        <div class="dash__main">
          <div class="dash__top"><div><small>Good morning, HR team</small><b>Thursday overview</b></div><span class="search">${icon("search")}Search people…</span></div>
          <div class="kpis">
            <div class="kpi"><small>Present today</small><b data-cnt="396">0</b><span class="up">+2.1%</span></div>
            <div class="kpi"><small>On leave</small><b data-cnt="11">0</b><span>3 pending</span></div>
            <div class="kpi"><small>Payroll status</small><b>Ready</b><span class="up">412 slips</span></div>
          </div>
          <div class="dash__grid">
            <div class="panel"><div class="panel__h"><b>Attendance · this week</b><small>Mon–Fri</small></div>
              <svg class="chart" viewBox="0 0 320 120" preserveAspectRatio="none"><defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F72B8" stop-opacity=".28"/><stop offset="1" stop-color="#2F72B8" stop-opacity="0"/></linearGradient></defs><path class="area" d="M0 84 C40 70 70 78 110 58 S180 44 220 50 S280 22 320 26 V120 H0Z"/><path class="line" d="M0 84 C40 70 70 78 110 58 S180 44 220 50 S280 22 320 26" pathLength="100"/></svg>
            </div>
            <div class="panel"><div class="panel__h"><b>Requests</b><small>Live</small></div>
              <ul class="reqs" data-reqs>
                <li><i class="av" style="--c:#7A6FD0">OM</i><span><b>Omar</b><small>Annual leave · 2d</small></span><em class="st">Approved</em></li>
                <li><i class="av" style="--c:#3FBDB3">KJ</i><span><b>Karan</b><small>Shift swap · Thu</small></span><em class="st">Approved</em></li>
                <li><i class="av" style="--c:#F2A27B">PS</i><span><b>Priya</b><small>Late punch · 09:16</small></span><em class="st">Reviewed</em></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="float f1">${icon("check")}<span><b>Payroll processed</b><small>412 employees</small></span></div>
      <div class="float f2">${icon("fingerprint")}<span><b>Aisha clocked in</b><small>Selfie · GPS · 08:52</small></span></div>
      <div class="float f3">${icon("calendar")}<span><b>Leave approved</b><small>in 12 seconds</small></span></div>
    </div>
  </section>

  <!-- 2. TRUST STRIP -->
  <section class="strip" aria-label="Industries we serve">
    <p>Trusted by teams across every kind of workplace</p>
    <div class="strip__mask"><div class="strip__track">${[...industries, ...industries].map((i) => `<span>${icon(i.icon)}${i.name}</span>`).join("")}</div></div>
  </section>

  <!-- 3. FEATURE TRIO -->
  <section class="sec" id="features">
    <div class="head" data-rv><span class="eyebrow">Why SublimeHR</span><h2>Everything HR, <span class="grad">beautifully connected</span>.</h2><p>Three everyday jobs, finally effortless — and all of them share one employee record.</p></div>
    <div class="trio">
      <article class="card spot" data-rv>
        <div class="art art-clock"><div class="clk"><i class="h"></i><i class="m"></i></div><span class="ripple"></span><span class="ripple r2"></span></div>
        <h3>Attendance that runs itself</h3><p>Selfie, GPS, geofence and biometric punches — late marks and overtime calculated automatically.</p>
        <a class="more" href="/software/attendance-management/">Explore attendance ${arrow}</a>
      </article>
      <article class="card spot" data-rv>
        <div class="art art-cal"><div class="mini">${Array.from({ length: 21 }, (_, i) => `<i class="${i === 9 || i === 10 ? "sel" : ""}" style="--d:${i * 40}ms"></i>`).join("")}</div><span class="tick">${icon("check")}</span></div>
        <h3>Leave in two taps</h3><p>Apply from the app, see balances instantly and approve with team calendars that prevent clashes.</p>
        <a class="more" href="/software/leave-management/">Explore leave ${arrow}</a>
      </article>
      <article class="card spot" data-rv>
        <div class="art art-pay"><div class="slip s3"></div><div class="slip s2"></div><div class="slip s1"><b>Payslip</b><i></i><i></i><i class="short"></i><span>${icon("check")}</span></div></div>
        <h3>Payroll without the panic</h3><p>Attendance, leave and overtime flow straight in. Review, run and send branded payslips in one click.</p>
        <a class="more" href="/software/payroll/">Explore payroll ${arrow}</a>
      </article>
    </div>
  </section>

  <!-- 4. HOW IT WORKS -->
  <section class="sec soft" id="how">
    <div class="head" data-rv><span class="eyebrow">How it works</span><h2>Live in days, <span class="grad">not months</span>.</h2></div>
    <div class="steps" data-steps>
      <svg class="steps__line" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true"><path d="M20 20 C 180 -10, 320 50, 500 20 S 820 -10, 980 20" pathLength="100"/></svg>
      ${[["message", "Tell us how you work", "A 30-minute call to map your policies, shifts and payroll rules."], ["layers", "We set it up for you", "White-glove data migration and configuration — no code on your side."], ["rocket", "Your team goes live", "Admins on the web, employees on the app. Support is a message away."]]
        .map(([ic, t, d], i) => `<div class="step" data-rv><span class="step__n">${icon(ic)}<i>${i + 1}</i></span><h3>${t}</h3><p>${d}</p></div>`).join("")}
    </div>
  </section>

  <!-- 5. MODULE SHOWCASE -->
  <section class="sec" id="showcase">
    <div class="head" data-rv><span class="eyebrow">The product</span><h2>One platform. <span class="grad">Ten modules.</span></h2><p>Start with what you need — everything works together from day one.</p></div>
    <div class="show" data-show>
      <div class="show__tabs" role="tablist" aria-label="Modules">
        ${featured.map((m, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-tab="${i}"><span class="ti">${icon(m.icon)}</span><span class="tt"><b>${m.name}</b><small>${m.tagline}</small></span><span class="tp"><i></i></span></button>`).join("")}
        <a class="show__all" href="/features/">See all 10 modules ${arrow}</a>
      </div>
      <div class="show__view">
        ${featured.map((m, i) => `<div class="show__panel${i === 0 ? " on" : ""}" role="tabpanel" data-panel="${i}">${previews[m.slug] || ""}<div class="show__cap"><p>${m.summary}</p><a class="more" href="/software/${m.slug}/">Learn more ${arrow}</a></div></div>`).join("")}
      </div>
    </div>
  </section>

  <!-- 6. STATEMENT (scroll-lit words) -->
  <section class="say" aria-label="Our promise">
    <p data-say>${"Less chasing. Less paperwork. Fewer spreadsheets. More time for the people who make your company work."
      .split(" ").map((w) => `<span>${w}</span>`).join(" ")}</p>
  </section>

  <!-- 7. NUMBERS -->
  <section class="sec nums">
    <div class="nums__grid">
      ${[["70", "+", "Feature areas", "layers"], ["13", "", "Built-in reports", "chart"], ["10", "", "Connected modules", "workflow"], ["2", "", "Languages · EN & AR", "globe"]]
        .map(([n, s, l, ic]) => `<div class="num spot" data-rv><span class="num__ic">${icon(ic)}</span><b><span data-cnt="${n}">0</span>${s}</b><small>${esc(l)}</small></div>`).join("")}
    </div>
  </section>

  <!-- 8. INDUSTRIES -->
  <section class="sec soft" id="industries">
    <div class="head" data-rv><span class="eyebrow">Industries</span><h2>Made for how <span class="grad">your people</span> work.</h2></div>
    <div class="inds">
      ${industries.map((ind) => `<a class="ind spot" href="/industries/#${ind.id}" data-rv><span class="ind__ic">${icon(ind.icon)}</span><b>${ind.name}</b><small>${ind.blurb}</small><span class="ind__go">${arrow}</span></a>`).join("")}
    </div>
  </section>

  <!-- 9. FAQ -->
  <section class="sec" id="faq">
    <div class="faq">
      <div class="faq__side" data-rv><span class="eyebrow">FAQ</span><h2>Questions, <span class="grad">answered</span>.</h2><p>Can't find what you need? <a href="/faq/">Browse all answers</a> or <a href="${site.whatsapp}" target="_blank" rel="noopener">chat with us</a>.</p></div>
      <div class="faq__list">
        ${faqList.map(([q, a], i) => `<div class="qa${i === 0 ? " open" : ""}" data-rv><button type="button" aria-expanded="${i === 0}"><span>${esc(q)}</span><i aria-hidden="true"></i></button><div class="qa__a"><div><p>${esc(a)}</p></div></div></div>`).join("")}
      </div>
    </div>
  </section>

  <!-- 10. CTA -->
  <section class="sec">
    <div class="cta" data-rv>
      <div class="orbits" aria-hidden="true"><i class="o1"><b></b></i><i class="o2"><b></b></i><i class="o3"><b></b></i><img src="${site.logo}" alt="" width="64" height="57"></div>
      <div class="cta__txt"><h2>Ready for HR that feels effortless?</h2><p>See SublimeHR with your own policies in a 30-minute demo.</p>
        <div class="hero__cta"><a class="btn lg light" href="/book-demo/"><span>Book a free demo</span>${arrow}</a><a class="btn lg glass" href="/get-pricing/"><span>Get pricing</span></a></div></div>
    </div>
  </section>
</main>

<footer class="foot">
  <div class="foot__in">
    <div class="foot__brand"><a class="brand" href="/home-v2/"><img src="${site.logo}" alt="" width="32" height="29"><span>Sublime<b>HR</b></span></a><p>The HR platform your team will actually enjoy using.</p></div>
    <nav aria-label="Footer"><b>Product</b><a href="/features/">Features</a><a href="/pricing/">Pricing</a><a href="/integrations/">Integrations</a></nav>
    <nav aria-label="Company"><b>Company</b><a href="/about/">About</a><a href="/faq/">FAQ</a><a href="/contact/">Contact</a></nav>
    <nav aria-label="Get in touch"><b>Talk to us</b><a href="${site.phoneHref}">${site.phone}</a><a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a><a href="/book-demo/">Book a demo</a></nav>
  </div>
  <div class="foot__bar"><span>© <span data-y>2026</span> SublimeHR. All rights reserved.</span><span><a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a></span></div>
</footer>

<a class="optB" href="/">Design option B · view current home</a>
<script src="/assets/js/home2.js?v=${V}" defer></script>
</body>
</html>`;
}
