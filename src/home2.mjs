// Home design option B — "Timecard: the paperwork, gone."
// The page's visual language is the office paper SublimeHR replaces (registers, leave slips, payslips, rotas).
// Every moment makes the same move: paper becomes the product. This file is the hero.
import { site } from "./data.mjs";
import { icon } from "./icons.mjs";

const V = Date.now().toString(36);
const arrow = icon("arrow");
const photo = (id, s) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${s * 2}&h=${s * 2}&q=70`;
const AISHA = "1573497019940-1c28c88b4f3e";

// The timecard rows: day, in, out. Wednesday is today and is left blank for the visitor to punch.
const week = [["MON", "08:52", "17:31"], ["TUE", "08:49", "17:30"], ["WED", "", ""], ["THU", "", ""], ["FRI", "", ""]];
const replaced = ["Attendance register", "Leave slip", "Payslip envelope", "Shift rota on the wall"];

export function home2() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SublimeHR — The paperwork behind every workday, gone</title>
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#FBF8F1">
<script>try{if(localStorage.getItem("shr-theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}</script>
<link rel="icon" type="image/png" href="${site.logo}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=DM+Sans:opsz,wght@9..40,400..700&family=JetBrains+Mono:wght@400;500;700&family=Caveat:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/home2.css?v=${V}">
</head>
<body class="tc">

<header class="tc-top">
  <div class="tc-form" aria-hidden="true"><span>FORM HR-01</span><span>WORKDAY RECORD</span><span class="hide-s">SUBLIMEHR · REV. 2026</span><span class="hide-s">PAGE 1 OF 1</span></div>
  <nav class="tc-nav" aria-label="Main">
    <a class="tc-brand" href="/home-v2/"><img src="${site.logo}" alt="" width="30" height="27"><span>Sublime<b>HR</b></span></a>
    <span class="tc-links"><a href="/features/">Product</a><a href="/industries/">Industries</a><a href="/pricing/">Pricing</a><a href="/about/">Company</a></span>
    <button class="tc-theme" type="button" data-theme-toggle aria-label="Switch to dark theme"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>
    <a class="tc-btn sm" href="/book-demo/"><span>Book a demo</span><i>${arrow}</i></a>
  </nav>
</header>

<main>
<section class="tc-hero" aria-labelledby="tc-h">
  <div class="tc-copy">
    <p class="tc-kick"><span class="box">01</span>Attendance · Leave · Payroll · Shifts</p>
    <h1 class="tc-h" id="tc-h">The paperwork behind every workday, <span class="gone">gone.<svg class="ul" viewBox="0 0 220 18" preserveAspectRatio="none" aria-hidden="true"><path d="M3 12 C 50 4, 120 3, 217 9"/></svg></span></h1>
    <ul class="tc-strike" aria-label="What SublimeHR replaces">
      ${replaced.map((r, i) => `<li style="--i:${i}"><span>${r}</span><svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 7 C 60 3, 140 10, 198 5"/></svg></li>`).join("")}
    </ul>
    <p class="tc-lead">Registers, leave slips and payslip envelopes become one app your people already carry. Punches, approvals and pay, recorded once and right.</p>
    <div class="tc-cta">
      <a class="tc-btn" href="/book-demo/"><span>Book a free demo</span><i>${arrow}</i></a>
      <button class="tc-link" type="button" data-punch-cta>Punch the card<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 8v9H8"/></svg></button>
    </div>
    <dl class="tc-fields">
      <div><dt>Industries</dt><dd>9</dd></div>
      <div><dt>Apps</dt><dd>Web · iOS · Android</dd></div>
      <div><dt>Languages</dt><dd>English · العربية</dd></div>
    </dl>
  </div>

  <div class="tc-stage" data-stage>
    <div class="slot" aria-hidden="true"><span class="slot__mouth"></span><span class="slot__lbl">TIME RECORDER · <b data-clock>08:51</b></span></div>

    <article class="card" data-card aria-label="Paper timecard for Aisha K., week 47">
      <div class="card__perf" aria-hidden="true"></div>
      <header class="card__hd"><span>TIME CARD</span><span>WEEK 47</span></header>
      <div class="card__name"><small>NAME</small><span class="sig">Aisha K.</span><small>DEPT</small><span class="sig">Finance</span></div>
      <table class="card__tb">
        <thead><tr><th scope="col">DAY</th><th scope="col">IN</th><th scope="col">OUT</th></tr></thead>
        <tbody>${week.map(([d, a, b]) => `<tr${d === "WED" ? ' class="today"' : ""}><th scope="row">${d}</th><td${d === "WED" ? " data-in" : ""}>${a}</td><td>${b}</td></tr>`).join("")}</tbody>
      </table>
      <div class="card__ft"><small>SUPERVISOR</small><span class="sig faint">R. Verma</span></div>
      <span class="stamp" data-stamp aria-hidden="true">ON TIME</span>
      <span class="note" aria-hidden="true">Payslips Friday,<br>collect from HR!</span>
    </article>

    <div class="phone" data-phone aria-label="The same punch in the SublimeHR app">
      <div class="phone__bar"><span>08:52</span><span class="dots"><i></i><i></i><i></i></span></div>
      <div class="phone__me"><img src="${photo(AISHA, 40)}" alt="" width="40" height="40"><span><small>Good morning</small><b>Aisha K.</b></span></div>
      <div class="phone__map" aria-hidden="true">
        <svg viewBox="0 0 200 96"><path class="road" d="M0 70 L80 52 L200 64"/><path class="road" d="M120 0 L104 96"/><circle class="fence" cx="110" cy="52" r="30"/><circle class="me" cx="110" cy="52" r="6"/></svg>
        <span>Head Office · inside geofence</span>
      </div>
      <ul class="phone__checks">
        <li style="--i:0">${icon("camera")}<span>Selfie matched</span><i>${icon("check")}</i></li>
        <li style="--i:1">${icon("pin")}<span>GPS · 12 m</span><i>${icon("check")}</i></li>
        <li style="--i:2">${icon("shield")}<span>Geofence</span><i>${icon("check")}</i></li>
      </ul>
      <div class="phone__done">${icon("check")}<span>Clocked in <b>08:52</b></span></div>
    </div>

    <p class="hand" aria-hidden="true">same punch,<br>no paper<svg viewBox="0 0 80 50"><path d="M4 6 C 30 4, 58 14, 70 40"/><path d="M60 36 L71 42 L74 30"/></svg></p>
    <button class="again" type="button" data-again hidden>Punch again</button>
  </div>
</section>

<div class="tc-tear" aria-hidden="true"><span>✂</span><i></i><span class="txt">tear here · no more paper past this line</span><i></i></div>

<section class="lv" aria-labelledby="lv-h" data-leave>
  <div class="lv__copy">
    <p class="tc-kick"><span class="box">02</span>Leave management</p>
    <h2 class="lv__h" id="lv-h">Leave slips that approve <span class="gone">themselves<svg class="ul" viewBox="0 0 220 18" preserveAspectRatio="none" aria-hidden="true"><path d="M3 12 C 50 4, 120 3, 217 9"/></svg></span> into the system.</h2>
    <p class="tc-lead">No carbon copies, no chasing signatures down the corridor. Employees request from their phone, managers approve in one tap, and the balance and calendar update on their own.</p>
    <ul class="lv__pts">
      <li>${icon("check")}<span>Balances calculated by policy, per leave type</span></li>
      <li>${icon("check")}<span>Approval chain with reminders, never lost in a tray</span></li>
      <li>${icon("check")}<span>Team calendar shows clashes before you approve</span></li>
    </ul>
    <a class="tc-btn" href="/software/leave-management/"><span>Explore leave management</span><i>${arrow}</i></a>
  </div>

  <div class="lv__stage" data-lv-stage>
    <article class="slip" aria-label="Paper leave slip for Omar M.">
      <header><span>LEAVE REQUEST</span><span>No. 0418</span></header>
      <div class="slip__r"><small>EMPLOYEE</small><span class="sig">Omar M.</span></div>
      <div class="slip__r"><small>TYPE</small><span class="sig">Annual leave</span></div>
      <div class="slip__r two"><div><small>FROM</small><span class="sig">23 Apr</span></div><div><small>TO</small><span class="sig">24 Apr</span></div></div>
      <div class="slip__r"><small>REASON</small><span class="sig">Family trip</span></div>
      <div class="slip__sign"><small>MANAGER SIGNATURE</small><span class="sig faint">Priya S.</span></div>
      <span class="stamp lv__stamp" data-lv-stamp aria-hidden="true">APPROVED</span>
      <div class="slip__carbon" aria-hidden="true"><span>CARBON COPY · FILE</span></div>
    </article>

    <div class="lv__phone" data-lv-phone aria-label="The same approval in the SublimeHR app">
      <div class="lv__note">${icon("check")}<span><b>Leave approved</b><small>Omar M. · Annual · 23–24 Apr · 2 days</small></span></div>
      <div class="lv__bal"><small>ANNUAL BALANCE</small><div class="lv__bar"><i data-lv-bar></i></div><span><b data-lv-days>14</b> days left</span></div>
      <div class="lv__cal" aria-hidden="true">${Array.from({ length: 14 }, (_, i) => `<i class="${i === 8 || i === 9 ? "on" : ""}"></i>`).join("")}</div>
    </div>
  </div>
</section>

<section class="sh" aria-labelledby="sh-h" data-shifts>
  <div class="sh__stage" data-sh-stage>
    <article class="rota" aria-label="Paper shift rota on graph paper">
      <header><span>SHIFT ROTA · WEEK 47</span><span class="pencil-note">swap?</span></header>
      <div class="rota__grid" role="table" aria-label="Shifts by person and day">
        <div class="rota__row head" role="row"><span></span>${["MON", "TUE", "WED", "THU", "FRI"].map((d) => `<b>${d}</b>`).join("")}</div>
        ${[
          ["Karan", ["M", "M", "E", "E", "—"]],
          ["Ravi", ["E", "E", "M", "M", "N"]],
          ["Sara", ["N", "—", "M", "E", "E"]]
        ].map(([n, cells], r) => `<div class="rota__row" role="row"><span class="nm">${n}</span>${cells.map((c, i) => `<i class="c ${c === "M" ? "m" : c === "E" ? "e" : c === "N" ? "n" : "off"}"${r < 2 && i === 2 ? ` data-sw="${r}"` : ""}>${c}</i>`).join("")}</div>`).join("")}
      </div>
      <p class="rota__key"><span class="m">M</span> morning · <span class="e">E</span> evening · <span class="n">N</span> night</p>
      <span class="scrib" aria-hidden="true"><svg viewBox="0 0 120 40"><path d="M4 30 C 20 4, 40 4, 56 20 S 90 36, 112 10"/><path d="M104 8 L113 10 L109 19"/></svg></span>
      <span class="eraser" aria-hidden="true">erased &amp; rewritten</span>
    </article>

    <div class="sh__app" data-sh-app aria-label="The same swap in the SublimeHR scheduler">
      <div class="sh__tb"><b>Shift schedule</b><span>Week 47</span></div>
      <div class="sh__g">
        ${[
          ["Karan", ["M", "M", "E", "E", "—"]],
          ["Ravi", ["E", "E", "M", "M", "N"]],
          ["Sara", ["N", "—", "M", "E", "E"]]
        ].map(([n, cells], r) => `<div class="sh__r"><span>${n}</span>${cells.map((c, i) => `<i class="c ${c === "M" ? "m" : c === "E" ? "e" : c === "N" ? "n" : "off"}"${r < 2 && i === 2 ? ` data-app-sw="${r}"` : ""}>${c}</i>`).join("")}</div>`).join("")}
      </div>
      <div class="sh__toast" data-sh-toast>${icon("repeat")}<span><b>Swap approved</b><small>Karan ⇄ Ravi · Wed · both notified</small></span></div>
    </div>
  </div>

  <div class="sh__copy">
    <p class="tc-kick"><span class="box">03</span>Shift scheduling</p>
    <h2 class="lv__h" id="sh-h">Rotas rubbed out in pencil, <span class="gone">rebuilt<svg class="ul" viewBox="0 0 220 18" preserveAspectRatio="none" aria-hidden="true"><path d="M3 12 C 50 4, 120 3, 217 9"/></svg></span> in one drag.</h2>
    <p class="tc-lead">Plan the week once. When someone swaps, the schedule, the attendance rules and everyone's phone update together. No more photographing the wall.</p>
    <ul class="lv__pts">
      <li>${icon("check")}<span>Drag and drop rotas with clash and overtime warnings</span></li>
      <li>${icon("check")}<span>Swap requests approved in a tap, both people notified</span></li>
      <li>${icon("check")}<span>Shifts feed attendance, so late and overtime are automatic</span></li>
    </ul>
    <a class="tc-btn" href="/software/shift-scheduling/"><span>Explore shift scheduling</span><i>${arrow}</i></a>
  </div>
</section>
</main>

<a class="back" href="/">← Current home</a>
<script src="/assets/js/home2.js?v=${V}" defer></script>
</body>
</html>`;
}
