// Module pages built from the home page itself: same shell, same head, same hero stage, same flip cards,
// same module tiles, same "Ask Subi" chat, same closing crowd and footer. Only the content changes.
import { site, modules } from "./data.mjs";
import { icon } from "./icons.mjs";
import { navMenu, themeFab } from "./navparts.mjs";
import { who, people } from "./cast.mjs";
import { homeFooter, V } from "./home2.mjs";

const byName = Object.fromEntries(people.map((p) => [p.n, p]));
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------- per-module content that cannot be derived from the data file ---------- */
const EXTRA = {
  "employee-management": {
    caps: [
      ["Active & separated employee lists", "Everyone who works here, and everyone who used to, in two clean lists.", "clipboard", "type"],
      ["Multi-section employee profiles", "One profile with tabs: personal, job, salary, documents. No hunting through files.", "tablet", "point"],
      ["Employment type configuration", "Permanent, contract, intern: each type gets its own rules.", "folder", "hold"],
      ["Personal details & family relations", "Emergency contacts, dependants and family details, kept private and in order.", "tablet", "type"],
      ["Job role & position history", "Every promotion and transfer, dated and in one timeline.", "clipboard", "point"],
      ["Documents with dynamic fields", "Contracts and certificates that fill in the employee's own details.", "folder", "hold"],
      ["Education, assets & access cards", "Degrees, laptops and door cards, tracked against the person.", "box", "reach"],
      ["Salary details & employee notes", "Pay history and private HR notes, visible only to those who should see them.", "tablet", "think"],
      ["Warning letters & disciplinary tracking", "A fair paper trail: who, when, why and what was agreed.", "clipboard", "hips"],
      ["Employment timeline (journey) visualization", "Join date to today, drawn as one line you can scroll through.", "tablet", "point"],
      ["Employee status & policy assignment", "Active, on notice or exited: the right policies follow the status.", "folder", "hold"],
      ["Shift assignment & monthly roster", "Assign shifts once, see the whole month at a glance.", "clipboard", "type"],
      ["Biometric / device registration", "Link a fingerprint or face to the record in one step.", "phone", "hold"],
      ["Drag-and-drop offer letter builder", "Build a letter by dragging blocks. No design skills needed.", "laptop", "type"],
      ["Custom letter template library", "Your own wording, saved once and used by the whole team.", "folder", "reach"],
      ["Dynamic token insertion from employee data", "Names, salary and dates drop into the letter by themselves.", "laptop", "point"]
    ],
    peeks: [
      ["Where is the signed offer letter for someone who joined three years ago?", "Open the profile, open Documents. Every letter, contract and certificate sits on the person, with its date.", "Found in 2 clicks", "sun"],
      ["Who got promoted last year, and when?", "Every role and position change is a dated line on the employee timeline. Filter, scroll, done.", "Promoted: 14 Mar", "lilac"],
      ["How do you write fifty offer letters in an afternoon?", "Pick a template, choose the people. Names, salary and dates fill in from the record, and each one goes out for e-signature.", "50 letters sent", "mint"],
      ["What happens to the record when someone leaves?", "They move to the separated list. Nothing is deleted, so audits and references stay possible.", "Record kept: 7 years", "coral"],
      ["Who changed this salary, and who approved it?", "Every edit is logged with the person, the time and the old value. Audits stop being a search party.", "Change logged", "ink"],
      ["Which laptop did Sara take home?", "Assets and access cards are recorded on the employee, so exits and handovers start from a list, not a hunt.", "Laptop #214: Sara", "white"]
    ]
  }
};

const lineFor = (m, i) => [m.benefits[0], m.benefits[1], m.benefits[2], m.features[3] || m.features[0]][i % 4];

function head(m, path, description) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(m.name)} Software — ${esc(m.tagline)} | SublimeHR</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${site.url}${path}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="theme-color" content="#3558F5">
<link rel="icon" type="image/png" href="${site.logo}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Unbounded:wght@500;600;700&family=DM+Sans:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/home2.css?v=${V}">
<link rel="stylesheet" href="/assets/css/navmenu.css?v=${V}">
<link rel="stylesheet" href="/assets/css/mod2.css?v=${V}">
<link rel="stylesheet" href="/assets/css/mod3.css?v=${V}">
<link rel="stylesheet" href="/assets/css/mod4.css?v=${V}">
<link rel="stylesheet" href="/assets/css/mod5.css?v=${V}">
<link rel="stylesheet" href="/assets/css/mod6.css?v=${V}">
<script>try{if(localStorage.getItem("shr-theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}</script>
</head>`;
}

const slot = (name, i, x, y, s, extra = "") => `<div class="slot" style="--x:${x}px;--y:${y}px;--s:${s};--z:${Math.round(y / 3)};--par:${s < 1 ? 5 : 12}" data-slot="${i}"><div class="say" data-say aria-live="polite"></div>${who(byName[name], i, extra)}</div>`;
const tagx = (name, role, i, x, y, s) => `<span class="tagx" style="--x:${x}px;--y:${y}px;--s:${s}"><b>${name}</b><em>${role}</em></span>`;

function hero(m) {
  const rows = m.features.slice(0, 4);
  const cast = [["Omar", "HR manager", 60, 116, .84], ["Priya", "HR partner", 250, 344, 1], ["Sara", "New joiner", 560, 330, 1]];
  return `<section class="hero mhero" aria-labelledby="h1" data-hero data-tip="Watch the office work. Each line is something this module does.">
  <div class="hero__wrap">
    <div class="hero__main">
      <div class="hero__copy">
        <h1 id="h1">${esc(m.tagline)}</h1>
        <p class="hero__lead">${esc(m.summary)}</p>
        <div class="hero__cta"><a class="btn btn--on btn--lg" href="/book-demo/?module=${m.slug}">Book a free demo</a><a class="link" href="#try">Play with it live</a></div>
      </div>
      <div class="stage" data-stage aria-label="${esc(m.name)}: a small office showing what it does">
        <div class="stage__floor" aria-hidden="true"></div>
        <div class="mwin" data-mwin>
          <div class="mwin__top"><i>${icon(m.icon, "ic")}</i><b>${esc(m.name)}</b><em><span></span>Live</em></div>
          <div class="mwin__who"><span class="mwin__av">SN</span><span><b>Sara Nasser</b><small>New joiner · Senior Accountant</small></span><strong data-pct>25%</strong></div>
          <ul>${rows.map((f, i) => `<li data-row="${i}"><i>${icon("check", "ic")}</i><span>${esc(f)}</span></li>`).join("")}</ul>
          <div class="mwin__bar"><i data-bar></i></div>
        </div>
        <div class="mchips" aria-hidden="true">
          <span class="mchip mc-1"><i>${icon("users", "ic")}</i><b>3 joined today</b></span>
          <span class="mchip mc-2"><i>${icon("file", "ic")}</i><b>Offer letter sent</b></span>
          <span class="mchip mc-3"><i>${icon("check", "ic")}</i><b>All records in sync</b></span>
        </div>
        ${cast.map(([n, r, x, y, s], i) => slot(n, i, x, y, s, i === 1 ? "ppl--wave" : "")).join("")}
        ${cast.map(([n, r, x, y, s]) => tagx(n, r, 0, x, y, s)).join("")}
      </div>
    </div>
  </div>
</section>`;
}

/* a full-width demo that plays by itself, inside one panel */
function letterDemo() {
  return `<section class="mdemo" id="try" aria-labelledby="h-try" data-tip="This letter writes itself. Take over any time.">
  <div class="mdemo__head"><h2 id="h-try">An offer letter, written while you watch.</h2><p>Pick a person and the letter fills in from their record. It then goes out for e-signature. Nobody types it twice.</p></div>
  <div class="mdemo__panel cast" data-letter>
    <div class="mform">
      <div class="mform__tabs" data-tpl role="group" aria-label="Letter type"><button type="button" data-t="offer" aria-pressed="true">Offer letter</button><button type="button" data-t="exp" aria-pressed="false">Experience</button><button type="button" data-t="warn" aria-pressed="false">Warning</button></div>
      <label>Employee name<input data-in="name" value="Sara Nasser" maxlength="40" autocomplete="off"></label>
      <label>Position<select data-in="pos"><option>Senior Accountant</option><option>HR Executive</option><option>Plant Supervisor</option><option>Staff Nurse</option></select></label>
      <div class="mform__two"><label>Monthly salary<input data-in="sal" type="number" value="5200" step="100"></label><label>Effective date<input data-in="date" type="date" value="2026-05-04"></label></div>
      <button class="mform__send" type="button" data-send>Send for e-signature ${icon("send", "ic")}</button>
    </div>
    <div class="mpaper" aria-live="polite">
      <div class="mpaper__head"><span><img src="${site.logo}" alt="" width="22" height="20">ACME INDUSTRIES · HR</span><em>REF-2026-0142</em></div>
      <div class="mpaper__body"><h3 data-title>Offer of employment</h3><div data-body></div><p class="mpaper__sig">— People Team</p><svg class="mpaper__ink" viewBox="0 0 160 50" aria-hidden="true"><path d="M6 34c14-26 22-26 18-6-3 14 10 10 20-6 8-12 12-4 8 6-3 8 8 8 22-6 8-8 10 0 12 4 4 6 16 0 36-8" pathLength="100"/></svg><span class="mpaper__stamp">SENT ✓</span></div>
      <div class="mpaper__toast" data-toast>${icon("check", "ic")}<span>Sent for e-signature</span></div>
    </div>
    <div class="mdemo__who" aria-hidden="true"><span class="mdemo__say" data-dsay>Writing the letter…</span><div class="mdemo__ppl" data-hold>${who(byName["Sara"], 1, "")}</div><span class="mdemo__floor"></span></div>
  </div>
</section>`;
}

function before(m) {
  const pains = ["Spreadsheets & paper forms", "Manual re-keying between systems", "The same HR questions, every day"];
  const fixes = [["Final_v7.xlsx", "One employee record"], ["Who has the form?", "On her profile"], ["Re-type it", "Filled in for her"], ["Wrong salary?", "Checked, correct"], ["Lost the letter", "Found, signed"], ["Duplicate entry", "No duplicates"], ["No audit trail", "Every change logged"]];
  return `<section class="mba" aria-labelledby="h-ba" data-mba data-state="before" data-tip="Watch Subi come over and fix her day.">
  <div class="mba__head"><h2 id="h-ba">What changes for your HR team.</h2>
    <div class="mba__tabs" role="group" aria-label="Before and after"><button type="button" data-s="before" aria-pressed="true">Before</button><button type="button" data-s="after" aria-pressed="false">With SublimeHR</button></div></div>
  <div class="mba__stage">
    <div class="mba__card">
      <div class="mba__pane is-b"><small>The old way</small><p>${esc(m.problem)}</p><ul>${pains.map((x) => `<li>${icon("close", "ic")}${x}</li>`).join("")}</ul></div>
      <div class="mba__pane is-a"><small>With SublimeHR</small><p>${esc(m.solution)}</p><ul>${m.benefits.slice(0, 3).map((x) => `<li>${icon("check", "ic")}${esc(x)}</li>`).join("")}</ul></div>
    </div>
    <div class="mba__scene cast">
      <span class="mba__dots" aria-hidden="true"></span><span class="mba__glow" aria-hidden="true"></span>
      <span class="mba__papers" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <span class="mba__sparks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>
      <span class="mba__say" data-bsay>Where is that file again?</span>
      <div class="mba__lady" aria-hidden="true">${who(byName["Priya"], 3)}</div>
      <ul class="mba__cards" aria-hidden="true">${fixes.map(([bad, good], i) => `<li class="k${i}" style="--d:${i * 0.16}s"><span class="bf"><i>${icon("close", "ic")}</i>${bad}</span><span class="af"><i>${icon("check", "ic")}</i>${good}</span></li>`).join("")}</ul>
      <span class="mba__prog" data-prog aria-hidden="true">Waiting for the file…</span>
      <span class="mba__floor"></span>
    </div>
  </div>
</section>`;
}

function caps(m) {
  const ex = EXTRA[m.slug]?.caps;
  const list = m.features.map((f, i) => ex ? ex[i] || [f, "", "file", "hold"] : [f, "", "file", "hold"]);
  return `<section class="mcap" aria-labelledby="h-cap" data-mcap data-tip="One capability at a time. Hover any tile to jump to it.">
  <div class="mcap__head"><h2 id="h-cap">${m.features.length} things it does for you.</h2><p>Configured to your policies. No code, no add-ons.</p></div>
  <div class="mcap__grid">
    <div class="mcap__stage cast">
      <span class="mcap__grid2" aria-hidden="true"></span><span class="mcap__ring"></span><span class="mcap__ring r2"></span>
      <span class="mcap__float f1"><i>${icon("check", "ic")}</i>Profile</span><span class="mcap__float f2"><b>SN</b></span><span class="mcap__float f3"><em></em><em></em><em></em></span><span class="mcap__float f4"><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="5"/><circle cx="18" cy="18" r="14" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="64 100" stroke-linecap="round" transform="rotate(-90 18 18)"/></svg></span><span class="mcap__float f5">${icon("sparkles", "ic")}</span><span class="mcap__float f6">New</span>
      <div class="mcap__card" data-card><b data-t>${esc(list[0][0])}</b><p data-d>${esc(list[0][1])}</p></div>
      ${who(byName["Aisha"], 4, "")}
      <span class="mcap__floor"></span>
    </div>
    <ul class="mcap__list">${list.map(([t, d, item, pose], i) => `<li data-i="${i}" data-it="${item}" data-ps="${pose}" data-d="${esc(d)}"${i === 0 ? ' class="on"' : ""}><span class="mck">${icon("check", "ic")}</span><span>${esc(t)}</span></li>`).join("")}</ul>
  </div>
</section>`;
}

function scen(m) {
  const ic = ["building", "users", "zap"];
  return `<section class="msc" aria-labelledby="h-sc" data-tip="Where this module earns its keep.">
  <div class="msc__head"><h2 id="h-sc">Where ${esc(m.name.toLowerCase())} shines.</h2><p>Three situations where teams reach for it first.</p></div>
  <div class="msc__grid">${m.useCases.slice(0, 3).map((u, i) => `<article class="msc__c msc__c--${i}"><span class="msc__n" aria-hidden="true">0${i + 1}</span><i class="msc__ic">${icon(ic[i], "ic")}</i><p>${esc(u)}</p><ul>${[m.features[(i * 4) % m.features.length], m.features[(i * 4 + 2) % m.features.length]].map((f) => `<li>${icon("check", "ic")}${esc(f)}</li>`).join("")}</ul></article>`).join("")}</div>
</section>`;
}

function mods(m) {
  const idx = modules.indexOf(m), rel = [1, 2, 3, 4, 5].map((k) => modules[(idx + k) % modules.length]);
  return `<section class="mods" aria-labelledby="h-mods" data-tip="Works better together.">
  <div class="mods__head"><h2 id="h-mods">Works better together.</h2><a class="link link--ink" href="/features/">See all features</a></div>
  <div class="mods__grid">${rel.map((r, i) => `<a class="md md--${i % 5}" href="/software/${r.slug}/"><i class="md__ic">${icon(r.icon, "ic")}</i><b>${r.name}</b><span>${r.short}</span><em class="md__go">Try the demo ${icon("arrow", "ic")}</em><ul>${r.features.slice(0, 3).map((f) => `<li>${f}</li>`).join("")}</ul></a>`).join("")}</div>
</section>`;
}

function ask(m) {
  return `<section class="ask" id="ask" aria-labelledby="h-ask" data-ask data-tip="Ask me anything about ${esc(m.name)}.">
  <div class="ask__copy">
    <h2 id="h-ask">Ask Subi anything.</h2>
    <p>Pick a question or type your own. Subi answers instantly, and a real person replies within one business day.</p>
    <div class="ask__qs" data-qs></div>
  </div>
  <div class="chat">
    <div class="chat__top"><span class="chat__av"><span class="s-head"><span class="s-scr"><b></b><b></b></span></span></span><b>Subi</b><em>Online</em></div>
    <div class="chat__log" data-log aria-live="polite"><div class="msg bot">Hi, I'm Subi. Pick a question on the left or type your own.</div>
      <div class="chat__hint"><b>Popular right now</b><div><button type="button" data-hq="0"></button><button type="button" data-hq="1"></button><button type="button" data-hq="2"></button></div><p>Or ask in your own words below. A real person replies within one business day.</p></div></div>
    <form class="chat__foot" data-ask-form><label class="vh" for="ask-in">Ask a question</label><input id="ask-in" placeholder="For example: Do you support biometric devices?" autocomplete="off"><button type="submit" aria-label="Send">${icon("send", "ic")}</button></form>
  </div>
</section>`;
}

function meet(m) {
  const times = ["10:00", "11:30", "14:00", "16:30"];
  return `<section class="mbk" aria-labelledby="h-meet" data-tip="Pick a time. It takes thirty minutes.">
  <div class="mbk__wrap">
    <div class="mbk__in">
      <h2 id="h-meet">See ${esc(m.name)} with your own data.</h2>
      <p>A 30-minute walkthrough, built around your workforce and your policies.</p>
      <ul class="mbk__pts"><li>${icon("check", "ic")}Free, no commitment</li><li>${icon("check", "ic")}Built around your industry</li><li>${icon("check", "ic")}Live in days</li></ul>
      <p class="mbk__alt">Prefer to talk first? <a class="link" href="/contact/">Contact us</a> or see <a class="link" href="/pricing/">pricing</a>.</p>
    </div>
    <div class="mbk__who cast" aria-hidden="true"><span class="mbk__say">See you at ${times[1]}!</span><div class="mbk__ppl" data-bkppl>${who(byName["Aisha"], 5, "ppl--wave")}</div></div>
    <div class="mbk__card" data-bk>
      <b>Pick a time</b>
      <div class="mbk__days" data-days></div>
      <div class="mbk__times" data-times>${times.map((x, i) => `<button type="button" data-time="${x}"${i === 1 ? ' aria-pressed="true"' : ' aria-pressed="false"'}>${x}</button>`).join("")}</div>
      <a class="mbk__go" href="/book-demo/?module=${m.slug}" data-go>Book this slot ${icon("arrow", "ic")}</a>
      <small>Your local time. We confirm by email.</small>
    </div>
  </div>
</section>`;
}

export function modulePage(m, faqItems, ldExtra = "") {
  const path = `/software/${m.slug}/`;
  const description = `${m.summary} Try a live demo of SublimeHR ${m.name.toLowerCase()}.`.slice(0, 300);
  return `${head(m, path, description)}
<body class="lo mpage" data-w="it" data-ft="3">
<script>try{var w=localStorage.getItem("shr-world");if(w)document.body.setAttribute("data-w",w)}catch(e){}</script>
<script type="application/json" id="mod-story">${JSON.stringify([m.benefits[0], m.benefits[1], m.benefits[2], m.features[3] || m.features[0]].filter(Boolean)).replace(/</g, "\u003c")}</script>
<script type="application/json" id="mod-data">${JSON.stringify({ faq: faqItems.map(([q, a]) => [q, a]), icons: Object.fromEntries(["file", "folder", "users", "clock", "shield", "calendar", "wallet", "repeat", "chart", "lock", "fingerprint", "camera", "layers", "send", "search", "bot", "dollar", "sparkles", "check", "message", "call", "pin", "dashboard", "alert"].map((k) => [k, icon(k, "ic")])) }).replace(/</g, "\\u003c")}</script>
<a class="skip" href="#main">Skip to content</a>
<header class="nav onhero" data-nav>
  <a class="nav__brand" href="/"><i class="nav__logo" style="--logo:url(${site.logo})" aria-hidden="true"></i><span>Sublime<b>HR</b></span></a>
  ${navMenu("features")}
</header>
<main id="main">
${hero(m)}
${m.slug === "employee-management" ? letterDemo() : ""}
${before(m)}
${caps(m)}
${scen(m)}
${mods(m)}
${ask(m)}
${meet(m)}
</main>
${homeFooter()}
<div class="guide" data-guide>
  <div class="guide__say" data-guide-say aria-live="polite"></div>
  <div class="guide__menu" data-guide-menu hidden role="menu" aria-label="Ask Subi to show you something">
    <b>What should I show you?</b>
    ${[["try", "file", "Watch a letter write itself"], ["ba", "repeat", "Before and after"], ["cap", "layers", "What it does"], ["ask", "message", "Ask a question"]].map(([k, ic, tt]) => `<button type="button" role="menuitem" data-show="${k}">${icon(ic, "ic")}${tt}</button>`).join("")}
  </div>
  <button class="subi__bot" type="button" data-guide-bot aria-label="Ask Subi, the page helper" aria-expanded="false"><i class="s-ant"></i><span class="s-head"><span class="s-scr"><b></b><b></b></span></span><span class="s-body"><i class="s-core"></i></span><i class="s-ar l"></i><i class="s-ar r"></i><i class="s-jet"></i></button>
  <span class="subi__lbl">Ask Subi</span>
</div>
<button class="fab" type="button" data-sound aria-pressed="false" aria-label="Turn sound on"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path class="w1" d="M16.5 9a4 4 0 0 1 0 6"/><path class="w2" d="M19 6.5a8 8 0 0 1 0 11"/><path class="x" d="M17 9l5 6M22 9l-5 6"/></svg><span>Sound off</span></button>
<div class="nudge" data-nudge hidden>Turn the sound on for the full demo.</div>
${themeFab()}
<button class="topbtn" type="button" data-top aria-label="Back to top">${icon("arrow-up", "ic")}</button>
${ldExtra}
<script src="/assets/js/mod2.js?v=${V}" defer></script>
<script src="/assets/js/navmenu.js?v=${V}" defer></script>
</body>
</html>
`;
}
