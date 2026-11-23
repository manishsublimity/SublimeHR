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
</main>

<a class="back" href="/">← Current home</a>
<script src="/assets/js/home2.js?v=${V}" defer></script>
</body>
</html>`;
}
