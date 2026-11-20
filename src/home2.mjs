// Hero lab for home design option B — three bold hero directions on one page to pick from.
// A · Kinetic (colour block + photo-in-type + rolling word) · B · Thread (one glowing line through the workday) · C · Deck (shuffling photo cards)
import { site } from "./data.mjs";
import { icon } from "./icons.mjs";

const V = Date.now().toString(36);
const arrow = icon("arrow");
const U = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;
const P = {
  aisha: "1573497019940-1c28c88b4f3e", omar: "1531750026848-8ada78f641c2", sara: "1494790108377-be9c29b29330",
  ravi: "1507003211169-0a1dd7228f2d", priya: "1580489944761-15a19d654956", karan: "1651684215020-f7a5b6610f23",
  nadia: "1607990283143-e81e7a2c9349", john: "1576558656222-ba66febe3dec"
};
const img = (k, w, h, cls = "") => `<img${cls ? ` class="${cls}"` : ""} src="${U(P[k], w * 2, h * 2)}" alt="" width="${w}" height="${h}">`;
const nav = (v) => `<nav class="hn hn-${v}" aria-label="Main"><a class="hn__brand" href="/home-v2/"><img src="${site.logo}" alt="" width="30" height="27"><span>Sublime<b>HR</b></span></a><span class="hn__links"><a href="/features/">Product</a><a href="/industries/">Industries</a><a href="/pricing/">Pricing</a><a href="/about/">Company</a></span><a class="hn__cta" href="/book-demo/">Book a demo ${arrow}</a></nav>`;

const events = [["aisha", "Aisha clocked in", "08:52 · Selfie + GPS"], ["omar", "Leave approved", "Omar · 2 days"], ["karan", "Shift swapped", "Karan ⇄ Ravi"], ["sara", "Payslip delivered", "Sara · March"], ["priya", "Late, within grace", "Priya · 09:12"], ["john", "Visitor checked in", "John · Reception"], ["nadia", "New hire onboarded", "Nadia · Finance"]];

export function home2() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SublimeHR — Hero options A · B · C</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/png" href="${site.logo}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@112..125,700..900&family=Geist:wght@400;500;600;700&family=Instrument+Serif:ital@1&family=Sora:wght@500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/home2.css?v=${V}">
</head>
<body class="lab">

<!-- ================= A · KINETIC ================= -->
<section class="hero hA" id="a" aria-label="Option A">
  ${nav("a")}
  <div class="hA__bgword" aria-hidden="true"><span>SUBLIMEHR · SUBLIMEHR · SUBLIMEHR · SUBLIMEHR ·</span></div>
  <div class="hA__in">
    <p class="hA__kick"><i></i>HR · Attendance · Leave · Payroll</p>
    <h1 class="hA__h">
      <span class="ln">Hire ${img("aisha", 150, 84, "pill p1")} people,</span>
      <span class="ln">run <span class="roll"><span class="roll__in" data-roll><b>attendance</b><b>leave</b><b>payroll</b><b>shifts</b><b>attendance</b></span></span></span>
      <span class="ln">in one place ${img("omar", 110, 84, "pill p2")}<span class="burst">${icon("check")}</span></span>
    </h1>
    <div class="hA__row">
      <p>The HR platform that clocks people in, approves their leave and pays them right — while your team gets its week back.</p>
      <div class="hA__cta"><a class="bA" href="/book-demo/">Book a free demo ${arrow}</a><a class="bA ghost" href="/features/">See the product</a></div>
    </div>
  </div>
  <div class="stk s1"><b>412</b><small>payslips sent</small></div>
  <div class="stk s2"><b>96%</b><small>on time today</small></div>
  <div class="belt" aria-hidden="true"><div class="belt__track">${[...events, ...events].map(([k, t, s]) => `<span class="ev">${img(k, 36, 36)}<span><b>${t}</b><small>${s}</small></span><i>${icon("check")}</i></span>`).join("")}</div></div>
  <span class="tagopt">A · Kinetic</span>
</section>

<!-- ================= B · THREAD ================= -->
<section class="hero hB" id="b" aria-label="Option B">
  ${nav("b")}
  <div class="hB__in">
    <div class="hB__copy">
      <p class="hB__kick">One record · one flow · one platform</p>
      <h1 class="hB__h">Every step of the workday, <em>connected.</em></h1>
      <p class="hB__p">From the first punch to the last payslip, SublimeHR carries each employee's day along one living thread — nothing typed twice, nothing lost.</p>
      <div class="hB__cta"><a class="bB" href="/book-demo/">Book a free demo ${arrow}</a><span class="hB__av">${img("aisha", 34, 34)}${img("ravi", 34, 34)}${img("sara", 34, 34)}${img("karan", 34, 34)}<small>Built for teams in 9 industries</small></span></div>
    </div>
    <div class="thread" data-thread>
      <svg class="thread__svg" viewBox="0 0 700 620" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2F72B8"/><stop offset=".5" stop-color="#3FBDB3"/><stop offset="1" stop-color="#7B6CF0"/></linearGradient>
        <filter id="tglow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter></defs>
        <path class="ghost" d="M20 70 C 220 40, 260 170, 140 230 S 120 400, 330 380 S 620 300, 560 450 S 420 600, 690 600"/>
        <path class="glow" d="M20 70 C 220 40, 260 170, 140 230 S 120 400, 330 380 S 620 300, 560 450 S 420 600, 690 600" filter="url(#tglow)" pathLength="100"/>
        <path class="line" data-path d="M20 70 C 220 40, 260 170, 140 230 S 120 400, 330 380 S 620 300, 560 450 S 420 600, 690 600" pathLength="100"/>
      </svg>
      <span class="runner" data-runner aria-hidden="true"></span>
      ${[["08:52", "aisha", "Aisha clocked in", "Selfie + GPS · on time", "clock", 12], ["10:30", "omar", "Leave approved", "Omar · 2 days annual", "calendar", 38], ["17:30", "nadia", "Payroll processed", "412 employees · March", "wallet", 64], ["18:00", "sara", "Payslip on every phone", "Sara opened hers", "file", 90]]
        .map(([t, k, b, s, ic, at], i) => `<div class="stop st${i + 1}" data-at="${at}"><span class="node"><i>${icon(ic)}</i></span><div class="card">${img(k, 42, 42)}<span><small>${t}</small><b>${b}</b><em>${s}</em></span></div></div>`).join("")}
    </div>
  </div>
  <span class="tagopt">B · Thread</span>
</section>

<!-- ================= C · DECK ================= -->
<section class="hero hC" id="c" aria-label="Option C">
  ${nav("c")}
  <div class="hC__big" aria-hidden="true">412</div>
  <div class="hC__in">
    <div class="hC__copy">
      <p class="hC__kick"><span>412 people</span> · one record</p>
      <h1 class="hC__h">Every employee.<br><span>Every detail.</span><br>Handled.</h1>
      <p class="hC__p">Profiles, punches, leave and pay — always up to date, always in their pocket. HR stops chasing and starts leading.</p>
      <div class="hC__cta"><a class="bC" href="/book-demo/">Book a free demo ${arrow}</a><a class="bC alt" href="/pricing/">See pricing</a></div>
      <div class="hC__proof"><span class="stack">${img("aisha", 36, 36)}${img("karan", 36, 36)}${img("priya", 36, 36)}${img("john", 36, 36)}</span><span><b>English &amp; العربية</b><small>Web + iOS + Android</small></span></div>
    </div>
    <div class="deck" data-deck>
      <div class="dk"><div class="dk__photo">${img("sara", 300, 190)}<span class="badge">Employee</span></div><div class="dk__b"><b>Sara Nasser</b><small>Finance · Dubai · since 2023</small><div class="dk__stats"><span><b>14</b>days leave</span><span><b>98%</b>on time</span><span><b>12</b>payslips</span></div></div></div>
      <div class="dk"><div class="dk__photo">${img("omar", 300, 190)}<span class="badge ok">Approved ✓</span></div><div class="dk__b"><b>Leave · Omar M.</b><small>Annual · 23–24 Apr · 2 days</small><div class="dk__cal">${Array.from({ length: 14 }, (_, i) => `<i class="${i === 8 || i === 9 ? "on" : ""}"></i>`).join("")}</div></div></div>
      <div class="dk"><div class="dk__photo">${img("ravi", 300, 190)}<span class="badge">Payslip · March</span></div><div class="dk__b"><b>Ravi V. · Net pay</b><small>Sent to his phone · 17:30</small><div class="dk__pay">5,215.00</div></div></div>
      <div class="dk"><div class="dk__photo">${img("aisha", 300, 190)}<span class="badge ok">Clocked in</span></div><div class="dk__b"><b>Aisha K. · 08:52</b><small>Selfie + GPS + geofence ✓</small><div class="dk__bar"><i></i></div></div></div>
    </div>
  </div>
  <span class="tagopt">C · Deck</span>
</section>

<nav class="switch" aria-label="Hero options"><a href="#a" data-sw="a">A · Kinetic</a><a href="#b" data-sw="b">B · Thread</a><a href="#c" data-sw="c">C · Deck</a></nav>
<a class="back" href="/">← Current home</a>
<script src="/assets/js/home2.js?v=${V}" defer></script>
</body>
</html>`;
}
