// Design option B for the home page — "A workday, scrolled".
// Standalone page (own fonts, palette, buttons, sections). Built to /home-v2/ and kept out of the sitemap.
import { site, modules, industries, findFaq, homeFaqIds } from "./data.mjs";
import { icon } from "./icons.mjs";

const V = Date.now().toString(36);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const arrow = icon("arrow");

const chapters = [
  {
    t: "08:55", tag: "Morning rush", sky: "dawn", p: 0.08,
    h: "412 people clock in.<br><em>Zero queues.</em>",
    d: "Selfie, GPS and geofence checks happen in one tap. Late arrivals are flagged on their own, so nobody has to watch the door.",
    ui: `<div class="ui ui-punch">
      <div class="ui__bar"><span>${icon("fingerprint")} Live attendance</span><b class="tick" data-live-count>389</b></div>
      <ul>
        <li><i style="--c:#3FBDB3">AK</i><span><b>Aisha K.</b><small>Selfie · GPS · 08:52</small></span><em class="ok">On time</em></li>
        <li><i style="--c:#2F72B8">RV</i><span><b>Ravi V.</b><small>Biometric · Plant 2 · 08:57</small></span><em class="ok">On time</em></li>
        <li><i style="--c:#F07C52">PS</i><span><b>Priya S.</b><small>Mobile · Field · 09:16</small></span><em class="late">Grace</em></li>
      </ul></div>`
  },
  {
    t: "10:30", tag: "Mid-morning", sky: "morning", p: 0.3,
    h: "Leave requested.<br><em>Approved before the coffee cools.</em>",
    d: "Employees apply from the app, balances update instantly and managers approve in a tap — with team calendars to avoid clashes.",
    ui: `<div class="ui ui-leave">
      <div class="ui__bar"><span>${icon("calendar")} Leave request</span><b>2 days</b></div>
      <div class="lv2"><i style="--c:#7A6FD0">OM</i><div><b>Omar M.</b><small>Annual leave · 23–24 Apr</small><small class="bal">Balance after: 12 days</small></div></div>
      <div class="lv2__act"><span class="b2 sm ghost">Decline</span><span class="b2 sm ink approve"><span class="a1">Approve</span><span class="a2">${icon("check")} Approved</span></span></div>
    </div>`
  },
  {
    t: "13:15", tag: "Lunch break", sky: "noon", p: 0.5,
    h: "A shift swap,<br><em>sorted over lunch.</em>",
    d: "Rosters, rotations and swaps live in one planner. Coverage stays visible, and overtime flows straight into payroll.",
    ui: `<div class="ui ui-swap">
      <div class="ui__bar"><span>${icon("repeat")} Night shift · Thu</span><b>Swap</b></div>
      <div class="sw2"><div class="sw2__slot a"><i style="--c:#2F72B8">RV</i><b>Ravi</b><small>22:00–06:00</small></div><span class="sw2__icon">${icon("repeat")}</span><div class="sw2__slot b"><i style="--c:#3FBDB3">KJ</i><b>Karan</b><small>22:00–06:00</small></div></div>
      <p class="ui__note">${icon("check")} Coverage OK · manager notified</p>
    </div>`
  },
  {
    t: "15:40", tag: "Afternoon", sky: "afternoon", p: 0.7,
    h: "A visitor at reception.<br><em>Badge already printed.</em>",
    d: "Pre-registered guests check in at the desk, hosts get pinged, and every entry lands in a searchable log.",
    ui: `<div class="ui ui-badge">
      <div class="bdg2"><div class="bdg2__top">VISITOR</div><div class="bdg2__face">JD</div><b>John D.</b><small>Host: HR team · 15:40</small><div class="bdg2__qr" aria-hidden="true"></div></div>
      <p class="ui__note">${icon("message")} Host notified on Slack</p>
    </div>`
  },
  {
    t: "17:30", tag: "Golden hour", sky: "sunset", p: 0.88,
    h: "Payroll for 412.<br><em>One click.</em>",
    d: "Attendance, leave and overtime are already in. Run payroll, review the variances and send branded payslips to every phone.",
    ui: `<div class="ui ui-pay">
      <div class="ui__bar"><span>${icon("wallet")} March payroll</span><b data-pay-pct>0%</b></div>
      <div class="pay2"><span data-pay-bar></span></div>
      <ul class="pay2__rows"><li><span>Gross</span><b>1,284,600</b></li><li><span>Overtime</span><b>42,180</b></li><li><span>Deductions</span><b>−96,420</b></li></ul>
      <p class="ui__note" data-pay-done>${icon("check")} 412 payslips sent</p>
    </div>`
  },
  {
    t: "18:05", tag: "Lights out", sky: "night", p: 1,
    h: "Everyone goes home.<br><em>Your reports don't.</em>",
    d: "13 built-in reports — attendance, leave, payroll, headcount — ready for audits and the Monday meeting.",
    ui: `<div class="ui ui-rep">
      <div class="ui__bar"><span>${icon("chart")} This week</span><b>96.4% present</b></div>
      <div class="rep2">${[62, 78, 70, 88, 96].map((v, i) => `<span style="--h:${v}%;--d:${i * 90}ms"><i></i><small>${["Mon", "Tue", "Wed", "Thu", "Fri"][i]}</small></span>`).join("")}</div>
    </div>`
  }
];

const bentoSpan = ["w2 h2", "", "", "w2", "", "h2", "", "w2", "", ""];
const bentoTone = ["ink", "", "teal", "", "blue", "", "", "sun", "", "ink"];
const faqList = homeFaqIds.slice(0, 6).map(findFaq).filter(Boolean);

export function home2() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SublimeHR — A workday, handled (design option B)</title>
<meta name="description" content="${esc(site.description)}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${site.url}/">
<meta name="theme-color" content="#F4EFE7">
<link rel="icon" type="image/png" href="${site.logo}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;1,9..144,500;1,9..144,700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/home2.css?v=${V}">
</head>
<body class="h2">
<a class="skip2" href="#main">Skip to content</a>

<header class="nav2" data-nav>
  <a class="nav2__brand" href="/home-v2/" aria-label="SublimeHR home"><img src="${site.logo}" alt="" width="34" height="30"><span>Sublime<b>HR</b></span></a>
  <nav class="nav2__links" aria-label="Main">
    <a href="/features/">Product</a><a href="/industries/">Industries</a><a href="/pricing/">Pricing</a><a href="/integrations/">Integrations</a><a href="/about/">Company</a>
  </nav>
  <div class="nav2__act">
    <a class="nav2__login" href="https://${site.appUrl}" rel="noopener">Log in</a>
    <a class="b2 ink" href="/book-demo/">Book a demo ${arrow}</a>
    <button class="nav2__menu" type="button" aria-expanded="false" aria-controls="m2" data-menu>Menu</button>
  </div>
</header>
<div class="m2" id="m2" hidden>
  <a href="/features/">Product</a><a href="/industries/">Industries</a><a href="/pricing/">Pricing</a><a href="/integrations/">Integrations</a><a href="/about/">Company</a><a href="/contact/">Contact</a>
  <a class="b2 ink lg" href="/book-demo/">Book a demo ${arrow}</a>
</div>

<main id="main">
  <!-- HERO -->
  <section class="hero2">
    <p class="kick2"><span class="dot2"></span>Cloud HR · Attendance · Leave · Payroll</p>
    <h1 class="hero2__h">Every workday,<br><em>handled</em> <span class="clockpill" aria-hidden="true"><i class="clockpill__face"><i class="hh"></i><i class="mm"></i></i><b data-now>09:41</b></span><br>from first punch to payslip.</h1>
    <div class="hero2__row">
      <p class="hero2__lead">SublimeHR runs attendance, leave, shifts, payroll and self-service on one employee record — so your HR team stops chasing and starts leading.</p>
      <div class="hero2__cta">
        <a class="b2 ink lg" href="/book-demo/">Book a free demo ${arrow}</a>
        <a class="b2 lg" href="#day">Scroll the workday ${icon("arrow")}</a>
      </div>
    </div>
    <div class="crowd" aria-label="Live check-in demo">
      <div class="crowd__faces" data-crowd>${["AK", "RV", "PS", "OM", "SN", "JL", "KJ", "MA", "TR", "NB", "HZ", "LC", "DW", "FA"].map((n, i) => `<span style="--i:${i}"><i>${n}</i><b>${icon("check")}</b></span>`).join("")}</div>
      <p class="crowd__txt"><b data-crowd-n>0</b> of 14 clocked in this morning <span>· sample team</span></p>
    </div>
  </section>

  <!-- MARQUEE -->
  <div class="tape" aria-hidden="true"><div class="tape__track">${[...modules, ...modules].map((m) => `<span>${icon(m.icon)}${m.name}</span>`).join("")}</div></div>

  <!-- THE DAY -->
  <section class="day" id="day" aria-label="A workday with SublimeHR">
    <div class="day__intro">
      <p class="kick2">One workday · six moments</p>
      <h2 class="h2xl">Scroll from <em>sunrise</em> to <em>sign-off</em>.</h2>
    </div>
    <div class="day__grid">
      <div class="sky" data-sky data-mode="dawn" aria-hidden="true">
        <div class="sky__arc"></div>
        <div class="sky__sun" data-sun></div>
        <div class="sky__hills"><i></i><i></i></div>
        <div class="sky__time"><small data-sky-tag>Morning rush</small><b data-sky-time>08:55</b></div>
        <div class="sky__prog"><span data-sky-prog></span></div>
      </div>
      <ol class="chaps">
        ${chapters.map((c, i) => `<li class="chap" data-chap data-t="${c.t}" data-tag="${esc(c.tag)}" data-sky="${c.sky}" data-p="${c.p}">
          <div class="chap__txt"><span class="chap__time">${c.t}</span><h3>${c.h}</h3><p>${c.d}</p></div>
          ${c.ui}
        </li>`).join("")}
      </ol>
    </div>
  </section>

  <!-- BENTO -->
  <section class="bento2" id="modules">
    <div class="sec2__head"><p class="kick2">Ten modules · one record</p><h2 class="h2xl">Pick a piece. <em>Get the whole.</em></h2></div>
    <div class="bento2__grid">
      ${modules.map((m, i) => `<a class="tile ${bentoSpan[i] || ""} ${bentoTone[i] || ""}" href="/software/${m.slug}/">
        <span class="tile__n">${String(i + 1).padStart(2, "0")}</span>
        <span class="tile__ic">${icon(m.icon)}</span>
        <b class="tile__name">${m.name}</b>
        <span class="tile__tag">${m.tagline}</span>
        <span class="tile__go">${arrow}</span>
      </a>`).join("")}
    </div>
  </section>

  <!-- NUMBERS -->
  <section class="nums2" aria-label="SublimeHR in numbers">
    <div><b data-count2="70">0</b><i>+</i><span>feature areas</span></div>
    <div><b data-count2="13">0</b><span>built-in reports</span></div>
    <div><b data-count2="10">0</b><span>connected modules</span></div>
    <div><b data-count2="2">0</b><span>languages · EN &amp; AR</span></div>
  </section>

  <!-- INDUSTRIES -->
  <section class="ind2" id="industries">
    <div class="sec2__head"><p class="kick2">Industries</p><h2 class="h2xl">Built for how <em>your</em> people work.</h2></div>
    <ul class="ind2__list">
      ${industries.map((ind, i) => `<li class="ind2__row" data-ind>
        <button type="button" class="ind2__btn" aria-expanded="false"><span class="ind2__n">${String(i + 1).padStart(2, "0")}</span><span class="ind2__name">${ind.name}</span><span class="ind2__ic">${icon(ind.icon)}</span><span class="ind2__plus" aria-hidden="true"></span></button>
        <div class="ind2__more"><div><p>${ind.blurb}</p><ul>${(ind.how || []).slice(0, 3).map((h) => `<li>${icon("check")}${h}</li>`).join("")}</ul><a class="b2 sm" href="/industries/#${ind.id}">See ${ind.name.toLowerCase()} ${arrow}</a></div></div>
      </li>`).join("")}
    </ul>
  </section>

  <!-- FAQ -->
  <section class="faq2" id="faq">
    <div class="faq2__side"><p class="kick2">Questions</p><h2 class="h2xl">Asked. <em>Answered.</em></h2><p>Still curious? <a href="/faq/">Browse all 50 answers</a> or <a href="${site.whatsapp}" target="_blank" rel="noopener">chat on WhatsApp</a>.</p></div>
    <div class="faq2__list">
      ${faqList.map(([q, a], i) => `<details${i === 0 ? " open" : ""}><summary><span>${esc(q)}</span><i aria-hidden="true"></i></summary><p>${esc(a)}</p></details>`).join("")}
    </div>
  </section>

  <!-- FINAL CTA -->
  <section class="end2" aria-label="Book a demo">
    <div class="end2__in">
      <h2>Ready to<br><em>clock in?</em></h2>
      <p>A 30-minute walkthrough, tailored to your team. No card, no pressure.</p>
      <a class="hold" href="/book-demo/" data-hold aria-label="Book a demo — press and hold, or press Enter">
        <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="bg" cx="60" cy="60" r="54"/><circle class="fg" cx="60" cy="60" r="54" pathLength="100"/></svg>
        <span class="hold__in">${icon("fingerprint")}<b data-hold-label>Hold to book</b></span>
      </a>
      <p class="end2__alt">or <a href="/get-pricing/">get pricing</a> · <a href="${site.phoneHref}">${site.phone}</a></p>
    </div>
  </section>
</main>

<footer class="foot2">
  <div class="foot2__word" aria-hidden="true">Sublime<em>HR</em></div>
  <div class="foot2__row">
    <nav aria-label="Footer"><a href="/features/">Product</a><a href="/pricing/">Pricing</a><a href="/industries/">Industries</a><a href="/faq/">FAQ</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav>
    <p>© <span data-y2>2026</span> SublimeHR · <a href="${site.phoneHref}">${site.phone}</a></p>
  </div>
</footer>

<a class="optB" href="/">Design option B · <u>view current home</u></a>
<script src="/assets/js/home2.js?v=${V}" defer></script>
</body>
</html>`;
}
