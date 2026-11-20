// Home design option B — "Daylight". Built from the user's Dribbble references:
// light & airy gradient wash · big centred headline with italic-serif accent · realistic dashboard hero with floating cards ·
// real people photos · bento of mini-UIs · photo + benefits split · numbered steps · integrations hub · FAQ · gradient CTA.
import { site, modules, industries, integrations, findFaq, homeFaqIds } from "./data.mjs";
import { icon } from "./icons.mjs";

const V = Date.now().toString(36);
const arrow = icon("arrow");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// Free-to-use photos (Unsplash licence), served from Unsplash's CDN at the size we need
const U = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;
const P = {
  aisha: "1573497019940-1c28c88b4f3e", omar: "1531750026848-8ada78f641c2", sara: "1494790108377-be9c29b29330",
  ravi: "1507003211169-0a1dd7228f2d", priya: "1580489944761-15a19d654956", karan: "1651684215020-f7a5b6610f23",
  nadia: "1607990283143-e81e7a2c9349", john: "1576558656222-ba66febe3dec",
  team: "1600880292203-757bb62b4baf", crew: "1758691737492-48e8fdd336f7"
};
const face = (k, s = 80) => `<img src="${U(P[k], s * 2, s * 2)}" alt="" width="${s}" height="${s}" loading="lazy">`;
const faqList = homeFaqIds.slice(0, 6).map(findFaq).filter(Boolean);
const ints = integrations.flatMap((g) => g.items.map(([m, n]) => [m, n]));

export function home2() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SublimeHR — HR that runs itself (design option B)</title>
<meta name="description" content="${esc(site.description)}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${site.url}/">
<meta name="theme-color" content="#FFFFFF">
<link rel="icon" type="image/png" href="${site.logo}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/home2.css?v=${V}">
</head>
<body class="dl">
<a class="skip" href="#main">Skip to content</a>

<header class="nav" data-nav>
  <div class="nav__in">
    <a class="brand" href="/home-v2/" aria-label="SublimeHR home"><img src="${site.logo}" alt="" width="32" height="29"><span>Sublime<b>HR</b></span></a>
    <nav class="nav__links" aria-label="Main"><a href="/features/">Product</a><a href="/industries/">Industries</a><a href="/pricing/">Pricing</a><a href="/integrations/">Integrations</a><a href="/about/">Company</a></nav>
    <div class="nav__act"><a class="nav__login" href="https://${site.appUrl}" rel="noopener">Log in</a><a class="btn dark sm" href="/book-demo/"><span>Book a demo</span>${arrow}</a>
      <button class="nav__menu" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu" data-menu><i></i><i></i></button></div>
  </div>
</header>
<div class="menu" id="menu" hidden><a href="/features/">Product</a><a href="/industries/">Industries</a><a href="/pricing/">Pricing</a><a href="/integrations/">Integrations</a><a href="/about/">Company</a><a href="/contact/">Contact</a><a class="btn dark lg" href="/book-demo/"><span>Book a free demo</span>${arrow}</a></div>

<main id="main">
  <!-- 1. HERO -->
  <section class="hero">
    <div class="hero__wash" aria-hidden="true"><i class="w1"></i><i class="w2"></i><i class="w3"></i><span class="grid"></span></div>
    <div class="hero__inner">
      <a class="social" href="/industries/" data-rv><span class="stack">${face("aisha", 30)}${face("ravi", 30)}${face("priya", 30)}${face("omar", 30)}</span><span>Built for teams across <b>9 industries</b></span>${icon("arrow")}</a>
      <h1 data-rv>HR that runs itself,<br>so you can lead <em class="serif">people.</em></h1>
      <p class="hero__lead" data-rv>Attendance, leave, payroll and self-service on one calm, connected platform — set up in days, loved by employees.</p>
      <form class="capture" action="/book-demo/" method="get" data-rv>
        <label class="vh" for="hemail">Work email</label>
        <span class="capture__ic">${icon("mail")}</span><input id="hemail" name="email" type="email" placeholder="Your work email" autocomplete="email">
        <button class="btn dark" type="submit"><span>Book a free demo</span>${arrow}</button>
      </form>
      <p class="hero__meta" data-rv>${icon("check")}No card needed<span></span>${icon("check")}Live in days<span></span>${icon("check")}English &amp; العربية</p>

      <span class="pchip pc1" aria-hidden="true">${face("sara", 44)}<span><b>Sara Nasser</b><small>Leave approved ✓</small></span></span>
      <span class="pchip pc2" aria-hidden="true">${face("karan", 44)}<span><b>Karan J.</b><small>Clocked in · 08:58</small></span></span>
    </div>

    <div class="stage" data-tilt>
      <div class="browser">
        <div class="browser__bar"><span class="dots"><i></i><i></i><i></i></span><span class="url">${icon("lock")}app.sublimehr.com/dashboard</span></div>
        <div class="app">
          <aside class="app__side"><img src="${site.logo}" alt="" width="26" height="23">${[["dashboard", "Overview", 1], ["users", "People"], ["clock", "Attendance"], ["calendar", "Leave"], ["wallet", "Payroll"], ["chart", "Reports"]].map(([ic, t, on]) => `<span class="${on ? "on" : ""}">${icon(ic)}<em>${t}</em></span>`).join("")}</aside>
          <div class="app__main">
            <div class="app__top"><div><small>Thursday, 09:41</small><b>Good morning, Nadia</b></div><span class="who">${face("nadia", 32)}</span></div>
            <div class="kpis">
              <div class="kpi"><small>Present today</small><b data-cnt="396">0</b><span class="up">↑ 2.1% vs last week</span></div>
              <div class="kpi"><small>On leave</small><b data-cnt="11">0</b><span>3 requests pending</span></div>
              <div class="kpi"><small>March payroll</small><b>1.23M</b><span class="up">Ready to run</span></div>
            </div>
            <div class="app__grid">
              <div class="panel"><div class="panel__h"><b>Attendance this week</b><small>Mon – Fri</small></div>
                <div class="cols">${[["Mon", 74], ["Tue", 88], ["Wed", 66], ["Thu", 97], ["Fri", 82]].map(([d, v], i) => `<span style="--h:${v}%;--d:${i * 90}ms"><i></i><small>${d}</small></span>`).join("")}</div>
              </div>
              <div class="panel"><div class="panel__h"><b>Live check-ins</b><small class="livedot">Live</small></div>
                <ul class="feed" data-feed>
                  <li>${face("aisha", 30)}<span><b>Aisha K.</b><small>Selfie + GPS</small></span><em class="ok">08:52</em></li>
                  <li>${face("ravi", 30)}<span><b>Ravi V.</b><small>Biometric · Plant 2</small></span><em class="ok">08:57</em></li>
                  <li>${face("priya", 30)}<span><b>Priya S.</b><small>Mobile · field</small></span><em class="warn">09:12</em></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="float f1"><span class="fi blue">${icon("wallet")}</span><span><small>Payroll processed</small><b>412 payslips sent</b></span></div>
      <div class="float f2"><span class="ring" style="--v:.96"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15"/><circle class="v" cx="18" cy="18" r="15" pathLength="100"/></svg><b>96%</b></span><span><small>On-time today</small><b>396 of 412</b></span></div>
      <div class="float f3"><span class="fstack">${face("omar", 28)}${face("john", 28)}${face("nadia", 28)}</span><span><small>Who's out today</small><b>Omar, John +9</b></span></div>
    </div>
  </section>

  <!-- 2. TRUST STRIP -->
  <section class="trust" aria-label="Industries we serve">
    <p>Trusted by HR teams in every kind of workplace</p>
    <div class="trust__mask"><div class="trust__track">${[...industries, ...industries].map((i) => `<span>${icon(i.icon)}${i.name}</span>`).join("")}</div></div>
  </section>

  <!-- 3. BENTO -->
  <section class="sec" id="product">
    <div class="head" data-rv><span class="tag">The platform</span><h2>Everything your people team needs.<br><em class="serif">Nothing it doesn't.</em></h2></div>
    <div class="bento">
      <a class="b b-att" href="/software/attendance-management/" data-rv>
        <div class="b__txt"><span class="bi">${icon("fingerprint")}</span><h3>Attendance that tracks itself</h3><p>Selfie, GPS, geofence and biometric punches. Late marks and overtime calculate automatically.</p></div>
        <div class="b__ui punch">${[["aisha", "Aisha K.", "08:52", "On time", "ok"], ["karan", "Karan J.", "08:58", "On time", "ok"], ["priya", "Priya S.", "09:12", "Grace", "warn"]].map(([k, n, t, s, c], i) => `<div class="pl" style="--d:${i * 140}ms">${face(k, 34)}<span><b>${n}</b><small>${t} · Selfie + GPS</small></span><em class="${c}">${s}</em></div>`).join("")}</div>
      </a>
      <a class="b b-leave" href="/software/leave-management/" data-rv>
        <div class="b__txt"><span class="bi teal">${icon("calendar")}</span><h3>Leave in two taps</h3><p>Balances update instantly; managers approve with the team calendar.</p></div>
        <div class="b__ui cal">${Array.from({ length: 21 }, (_, i) => `<span class="${[9, 10].includes(i) ? "on" : i % 7 > 4 ? "we" : ""}">${i + 1}</span>`).join("")}</div>
      </a>
      <a class="b b-pay" href="/software/payroll/" data-rv>
        <div class="b__txt"><span class="bi violet">${icon("wallet")}</span><h3>Payroll in one click</h3><p>Attendance, leave and overtime flow straight in.</p></div>
        <div class="b__ui pay"><small>March payroll</small><b>1,230,360</b><div class="bar"><i></i></div><span>${icon("check")} 412 payslips sent</span></div>
      </a>
      <a class="b b-ess" href="/software/employee-self-service/" data-rv>
        <div class="b__txt"><span class="bi peach">${icon("phone")}</span><h3>An app employees actually open</h3><p>Clock in, apply leave, download payslips — on any phone.</p></div>
        <div class="b__ui phone"><div class="ph">${face("sara", 40)}<b>Hi, Sara</b><small>Finance · Dubai</small><span class="phbtn">${icon("fingerprint")} Clock in</span><div class="phrow"><i>Leave · 14 days</i><i>Payslip ↓</i></div></div></div>
      </a>
      <a class="b b-shift" href="/software/shift-scheduling/" data-rv>
        <div class="b__txt"><span class="bi">${icon("repeat")}</span><h3>Shifts without spreadsheets</h3><p>Rotations, swaps and coverage in one planner.</p></div>
        <div class="b__ui roster">${["Morning", "Evening", "Night"].map((s, r) => `<div><small>${s}</small>${Array.from({ length: 5 }, (_, i) => `<i class="t${(i + r) % 3}"></i>`).join("")}</div>`).join("")}</div>
      </a>
      <a class="b b-rep" href="/software/reports-analytics/" data-rv>
        <div class="b__txt"><span class="bi teal">${icon("chart")}</span><h3>13 reports, ready for Monday</h3><p>Attendance, leave, payroll and headcount — export in a click.</p></div>
        <div class="b__ui rep"><svg viewBox="0 0 300 100" preserveAspectRatio="none"><defs><linearGradient id="rg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3FBDB3" stop-opacity=".35"/><stop offset="1" stop-color="#3FBDB3" stop-opacity="0"/></linearGradient></defs><path class="area" d="M0 84 C40 76 70 70 100 60 S170 50 200 40 S260 20 300 14 V100 H0Z"/><path class="line" d="M0 84 C40 76 70 70 100 60 S170 50 200 40 S260 20 300 14" pathLength="100"/></svg><span class="chip">Headcount +4.2%</span></div>
      </a>
    </div>
    <p class="more-mods" data-rv><a href="/features/">See all 10 modules ${arrow}</a></p>
  </section>

  <!-- 4. PEOPLE SPLIT -->
  <section class="sec split">
    <div class="split__img" data-rv>
      <img class="photo" src="${U(P.team, 1100, 1250)}" alt="Two colleagues reviewing work together on a laptop" width="550" height="625" loading="lazy">
      <div class="sticker s1"><span class="fi teal">${icon("check")}</span><span><b>Leave approved</b><small>in 12 seconds</small></span></div>
      <div class="sticker s2"><span class="fi blue">${icon("file")}</span><span><b>Payslip delivered</b><small>to 412 phones</small></span></div>
    </div>
    <div class="split__txt">
      <span class="tag" data-rv>Why SublimeHR</span>
      <h2 data-rv>Built for the <em class="serif">humans</em><br>in Human Resources.</h2>
      <p class="split__lead" data-rv>Less chasing approvals and fixing spreadsheets. More time for the conversations that actually matter.</p>
      <ul class="benefits">
        <li data-rv><span class="bi">${icon("users")}</span><span><b>One record for every employee</b><small>Ten modules share it — nothing typed twice, nothing lost.</small></span></li>
        <li data-rv><span class="bi teal">${icon("rocket")}</span><span><b>Live in days, not months</b><small>White-glove setup and data migration, no code on your side.</small></span></li>
        <li data-rv><span class="bi violet">${icon("shield")}</span><span><b>Secure by default</b><small>MFA, role-based access and full audit trails.</small></span></li>
      </ul>
      <div class="stats">${[["70", "+", "feature areas"], ["13", "", "built-in reports"], ["2", "", "languages"]].map(([n, s, l]) => `<div data-rv><b><span data-cnt="${n}">0</span>${s}</b><small>${l}</small></div>`).join("")}</div>
    </div>
  </section>

  <!-- 5. HOW IT WORKS -->
  <section class="sec how">
    <div class="head" data-rv><span class="tag">How it works</span><h2>From first call to go-live <em class="serif">in days.</em></h2></div>
    <ol class="steps">
      ${[["01", "Tell us how you work", "A 30-minute call to map your policies, shifts and payroll rules.", "message"], ["02", "We set it all up", "Data migration and configuration, done for you — no code needed.", "sliders"], ["03", "Your team goes live", "Admins on the web, employees on the app. Support is one message away.", "rocket"]]
        .map(([n, t, d, ic]) => `<li class="step" data-rv><span class="step__n">${n}</span><span class="bi">${icon(ic)}</span><h3>${t}</h3><p>${d}</p></li>`).join("")}
    </ol>
  </section>

  <!-- 6. INTEGRATIONS HUB -->
  <section class="sec hub">
    <div class="hub__txt" data-rv><span class="tag">Integrations</span><h2>Connects with the tools <em class="serif">you already use.</em></h2><p>Identity, chat, accounting, ERP and biometric devices — plus an open REST API.</p><a class="btn dark" href="/integrations/"><span>Explore integrations</span>${arrow}</a></div>
    <div class="hub__map" aria-hidden="true">
      <span class="orb o1"></span><span class="orb o2"></span><span class="orb o3"></span>
      <span class="hub__core"><img src="${site.logo}" alt="" width="64" height="57"></span>
      <div class="hub__spin" data-hub>${ints.slice(0, 10).map(([m, n], i) => `<span class="intg" style="--i:${i};--n:10"><b>${m}</b><small>${n}</small></span>`).join("")}</div>
    </div>
  </section>

  <!-- 7. FAQ -->
  <section class="sec faq">
    <div class="faq__side" data-rv><span class="tag">FAQ</span><h2>Questions, <em class="serif">answered.</em></h2><p>Can't find it here? <a href="/faq/">Browse all answers</a> or <a href="${site.whatsapp}" target="_blank" rel="noopener">chat with us on WhatsApp</a>.</p></div>
    <div class="faq__list">${faqList.map(([q, a], i) => `<div class="qa${i === 0 ? " open" : ""}" data-rv><button type="button" aria-expanded="${i === 0}"><span>${esc(q)}</span><i aria-hidden="true"></i></button><div class="qa__a"><div><p>${esc(a)}</p></div></div></div>`).join("")}</div>
  </section>

  <!-- 8. CTA -->
  <section class="sec">
    <div class="cta" data-rv>
      <div class="cta__txt"><h2>Give your HR team <em class="serif">hours back</em> every week.</h2><p>See SublimeHR with your own policies in a 30-minute demo.</p>
        <form class="capture light" action="/book-demo/" method="get"><label class="vh" for="cemail">Work email</label><span class="capture__ic">${icon("mail")}</span><input id="cemail" name="email" type="email" placeholder="Your work email" autocomplete="email"><button class="btn" type="submit"><span>Book a demo</span>${arrow}</button></form>
        <p class="cta__alt"><a href="/get-pricing/">Get pricing</a> · <a href="${site.phoneHref}">${site.phone}</a></p></div>
      <div class="cta__pics" aria-hidden="true"><img class="cp1" src="${U(P.crew, 700, 520)}" alt="" width="350" height="260" loading="lazy">${face("aisha", 70).replace("<img", '<img class="cp2"')}${face("omar", 62).replace("<img", '<img class="cp3"')}${face("sara", 56).replace("<img", '<img class="cp4"')}</div>
    </div>
  </section>
</main>

<footer class="foot">
  <div class="foot__in">
    <div class="foot__brand"><a class="brand" href="/home-v2/"><img src="${site.logo}" alt="" width="32" height="29"><span>Sublime<b>HR</b></span></a><p>The HR platform your team will actually enjoy using.</p></div>
    <nav aria-label="Product"><b>Product</b>${modules.slice(0, 5).map((m) => `<a href="/software/${m.slug}/">${m.name}</a>`).join("")}</nav>
    <nav aria-label="Company"><b>Company</b><a href="/about/">About</a><a href="/pricing/">Pricing</a><a href="/industries/">Industries</a><a href="/faq/">FAQ</a></nav>
    <nav aria-label="Contact"><b>Talk to us</b><a href="${site.phoneHref}">${site.phone}</a><a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a><a href="/contact/">Contact</a><a href="/book-demo/">Book a demo</a></nav>
  </div>
  <div class="foot__bar"><span>© <span data-y>2026</span> SublimeHR. All rights reserved.</span><span><a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a> · Photos: Unsplash</span></div>
</footer>
<a class="optB" href="/">Design option B · view current home</a>
<script src="/assets/js/home2.js?v=${V}" defer></script>
</body>
</html>`;
}
