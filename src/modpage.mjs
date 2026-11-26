// Module pages built from the home page itself: same shell, same head, same hero stage, same flip cards,
// same module tiles, same "Ask Subi" chat, same closing crowd and footer. Only the content changes.
import { site, modules, industries as INDS, plans, compare, integrations as INTS, customAreas, process as PROC, faqs as FAQG, reports as REPS } from "./data.mjs";
import { icon } from "./icons.mjs";
import { navMenu, themeFab } from "./navparts.mjs";
import { who, people } from "./cast.mjs";
import { homeFooter, V } from "./home2.mjs";
import { CONF, iconFor } from "./modconf.mjs";
import { demoSection } from "./moddemo.mjs";

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

function head(m, path, description, title) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title || `${m.name} Software — ${m.tagline} | SublimeHR`)}</title>
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
<link rel="stylesheet" href="/assets/css/mod7.css?v=${V}">
<link rel="stylesheet" href="/assets/css/mod8.css?v=${V}">
<link rel="stylesheet" href="/assets/css/mod9.css?v=${V}">
<link rel="stylesheet" href="/assets/css/mod10.css?v=${V}">
<link rel="stylesheet" href="/assets/css/system.css?v=${V}">
<script>try{if(localStorage.getItem("shr-theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}</script>
</head>`;
}

const slot = (name, i, x, y, s, extra = "") => `<div class="slot" style="--x:${x}px;--y:${y}px;--s:${s};--z:${Math.round(y / 3)};--par:${s < 1 ? 5 : 12}" data-slot="${i}"><div class="say" data-say aria-live="polite"></div>${who(byName[name], i, extra)}</div>`;
const tagx = (name, role, i, x, y, s) => `<span class="tagx" style="--x:${x}px;--y:${y}px;--s:${s}"><b>${name}</b><em>${role}</em></span>`;

function hero(m) {
  const rows = m.features.slice(0, 4);
  const hc = m._hero || CONF[m.slug]?.hero;
  const pos = m._pos || [[60, 116, .84], [250, 344, 1], [560, 412, 1]];
  const cast = (hc ? hc.cast : [["Omar", "HR manager"], ["Priya", "HR partner"], ["Sara", "New joiner"]]).map(([n, r], i) => [n, r, ...pos[i]]);
  const who3 = hc ? hc.who : ["SN", "Sara Nasser", "New joiner · Senior Accountant"];
  const chips = hc ? hc.chips : [["users", "3 joined today"], ["file", "Offer letter sent"], ["check", "All records in sync"]];
  return `<section class="hero mhero" aria-labelledby="h1" data-hero data-tip="Watch the office work. Each line is something this module does.">
  <div class="hero__wrap">
    <div class="hero__main">
      <div class="hero__copy">
        <h1 id="h1">${esc(m.tagline)}</h1>
        <p class="hero__lead">${esc(m.summary)}</p>
        <div class="hero__cta">${m._cta ? m._cta : `<a class="btn btn--on btn--lg" href="/book-demo/?module=${m.slug}">Book a free demo</a><a class="link" href="#try">Play with it live</a>`}</div>
      </div>
      <div class="stage" data-stage aria-label="${esc(m.name)}: a small office showing what it does">
        <div class="stage__floor" aria-hidden="true"></div>
        ${m._stage ? m._stage : `        <div class="mwin" data-mwin>
          <div class="mwin__top"><i>${icon(m.icon, "ic")}</i><b>${esc(m.name)}</b><em><span></span>Live</em></div>
          <div class="mwin__who"><span class="mwin__av">${esc(who3[0])}</span><span><b>${esc(who3[1])}</b><small>${esc(who3[2])}</small></span><strong data-pct>25%</strong></div>
          <ul>${rows.map((f, i) => `<li data-row="${i}"><i>${icon("check", "ic")}</i><span>${esc(f)}</span></li>`).join("")}</ul>
          <div class="mwin__bar"><i data-bar></i></div>
        </div>
        <div class="mchips" aria-hidden="true">
          ${chips.map(([ic, tx], i) => `<span class="mchip mc-${i + 1}"><i>${icon(ic, "ic")}</i><b>${esc(tx)}</b></span>`).join("")}
        </div>
`}
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
  const bc = CONF[m.slug]?.before;
  const pains = bc ? bc.problems.slice(0, 3) : ["Spreadsheets & paper forms", "Manual re-keying between systems", "The same HR questions, every day"];
  const fixes = bc ? bc.problems : ["Final_v7.xlsx", "Who has the form?", "Re-type it", "Wrong salary?", "Lost the letter", "Duplicate entry", "No audit trail"];
  const rec = bc ? bc.rec.rows : ["Profile", "Offer letter", "Salary", "Documents", "Timeline", "Access card", "Audit log"];
  const L = bc ? { say: bc.say, ask: bc.ask, done: bc.done, doneG: bc.doneG, av: bc.rec.av, name: bc.rec.name, sub: bc.rec.sub } : { say: "Where is that file again?", ask: "Subi, can you find Sara's offer letter?", done: "Found it. Thank you, Subi!", doneG: "All done. Everything is on her record.", av: "SN", name: "Sara Nasser", sub: "Employee record" };
  return `<section class="mba" aria-labelledby="h-ba" data-mba data-state="before" data-l0="${esc(L.say)}" data-l1="${esc(L.ask)}" data-l2="${esc(L.done)}" data-l3="${esc(L.doneG)}" data-tip="Watch Subi come over and fix her day.">
  <div class="mba__pin" data-pin><div class="mba__sticky">
  <div class="mba__head"><h2 id="h-ba">What changes for your HR team.</h2>
    <div class="mba__tabs" role="group" aria-label="Before and after"><button type="button" data-s="before" aria-pressed="true">Before</button><button type="button" data-s="after" aria-pressed="false">With SublimeHR</button></div></div>
  <div class="mba__stage">
    <div class="mba__card">
      <div class="mba__pane is-b"><small>The old way</small><p>${esc(m.problem)}</p><ul>${pains.map((x) => `<li>${icon("close", "ic")}${x}</li>`).join("")}</ul>
        <div class="mba__strip"><div class="mba__stat"><b>${fixes.length}</b><span>things that go wrong</span></div><div class="mba__stat"><b>${m.features.length}</b><span>jobs done by hand</span></div><button class="mba__cta" type="button" data-s="after">See the fix ${icon("arrow", "ic")}</button></div></div>
      <div class="mba__pane is-a"><small>With SublimeHR</small><p>${esc(m.solution)}</p><ul>${m.benefits.slice(0, 3).map((x) => `<li>${icon("check", "ic")}${esc(x)}</li>`).join("")}</ul>
        <div class="mba__strip"><div class="mba__stat"><b>0</b><span>left to chase</span></div><div class="mba__stat"><b>${m.features.length}</b><span>features on one record</span></div><a class="mba__cta" href="#try">Try the live demo ${icon("arrow", "ic")}</a></div></div>
    </div>
    <div class="mba__scene cast">
      <div class="mba__chaos" aria-hidden="true"><span class="mba__tiles"></span>${fixes.map((bad, i) => `<span class="ch ch${i % 7} k${i}"><i></i><b>${esc(bad)}</b></span>`).join("")}</div>
      <div class="mba__clean" aria-hidden="true">
      <div class="mba__record" aria-hidden="true"><div class="mba__rechead"><i>${esc(L.av)}</i><span><b>${esc(L.name)}</b><small>${esc(L.sub)}</small></span><em>100%</em></div><ul>${rec.map((x, i) => `<li><i>${icon("check", "ic")}</i><span class="recp">${esc(fixes[i] || x)}</span><span class="recs">${esc(m.features[i] || x)}</span></li>`).join("")}</ul></div>
      </div>
      <span class="mba__say" data-bsay>${esc(L.say)}</span>
      <div class="mba__lady" aria-hidden="true">${who(byName["Priya"], 3)}</div>
      <ul class="mba__cards" aria-hidden="true">${fixes.map((bad, i) => `<li class="k${i}"><span class="bf"><i></i>${bad}</span></li>`).join("")}</ul>
      <span class="mba__prog" data-prog aria-hidden="true">Waiting for the file…</span>
      <span class="mba__floor"></span>
    </div>
  </div>
  </div></div>
</section>`;
}

function caps(m) {
  const ex = EXTRA[m.slug]?.caps;
  const ce = CONF[m.slug]?.caps;
  const list = m.features.map((f, i) => ex ? ex[i] || [f, "", "file", "hold"] : [f, ce ? ce[i] || "" : "", iconFor(f), ["hold", "point", "hold", "type"][i % 4]]);
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
  <div class="mods__grid">${rel.map((r, i) => `<a class="md md--${i % 5}" href="/software/${r.slug}/"><i class="md__ic">${icon(r.icon, "ic")}</i><b>${r.name}</b><span>${r.short}</span><p class="md__d">${r.summary}</p><ul>${r.features.slice(0, 3).map((f) => `<li>${f}</li>`).join("")}</ul><em class="md__go">Read more</em></a>`).join("")}</div>
</section>`;
}

function ask(m) {
  return `<section class="ask" id="ask" aria-labelledby="h-ask" data-ask data-tip="Ask me anything about ${esc(m.name)}.">
  <div class="ask__copy">
    <h2 id="h-ask">Ask Subi anything.</h2>
    <p>Pick a question or type your own. Subi answers instantly.</p>
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

const navActive = (p) => (/^\/(software|features)\//.test(p) ? "features" : /^\/industries\//.test(p) ? "industries" : /^\/(pricing|get-pricing)\//.test(p) ? "pricing" : /^\/integrations\//.test(p) ? "integrations" : /^\/(about|contact|faq|custom-development)\//.test(p) ? "company" : "");
export function modulePage(m, faqItems, ldExtra = "", o = {}) {
  const path = o.path || `/software/${m.slug}/`;
  const description = o.description || `${m.summary} Try a live demo of SublimeHR ${m.name.toLowerCase()}.`.slice(0, 300);
  return `${head(m, path, description, o.title)}
<body class="lo mpage${o.noHero ? " nohero" : ""}" data-w="it" data-ft="3">
<script>try{var w=localStorage.getItem("shr-world");if(w)document.body.setAttribute("data-w",w)}catch(e){}</script>
<script type="application/json" id="mod-story">${JSON.stringify([m.benefits[0], m.benefits[1], m.benefits[2], m.features[3] || m.features[0]].filter(Boolean)).replace(/</g, "\u003c")}</script>
<script type="application/json" id="mod-data">${JSON.stringify({ faq: faqItems.map(([q, a]) => [q, a]), icons: Object.fromEntries(["file", "folder", "users", "clock", "shield", "calendar", "wallet", "repeat", "chart", "lock", "fingerprint", "camera", "layers", "send", "search", "bot", "dollar", "sparkles", "check", "message", "call", "pin", "dashboard", "alert"].map((k) => [k, icon(k, "ic")])) }).replace(/</g, "\\u003c")}</script>
<a class="skip" href="#main">Skip to content</a>
<header class="nav${o.noHero ? " solid" : " onhero"}" data-nav>
  <a class="nav__brand" href="/"><i class="nav__logo" style="--logo:url(${site.logo})" aria-hidden="true"></i><span>Sublime<b>HR</b></span></a>
  ${navMenu(o.active || navActive(path))}
</header>
<main id="main">
${o.main ? o.main(m) : `${hero(m)}
${m.slug === "employee-management" ? letterDemo() : CONF[m.slug]?.demo ? demoSection(m, CONF[m.slug].demo) : ""}
${before(m)}
${caps(m)}
${scen(m)}
${mods(m)}
${ask(m)}
${meet(m)}`}
</main>
${homeFooter()}
<div class="guide" data-guide>
  <div class="guide__say" data-guide-say aria-live="polite"></div>
  <div class="guide__menu" data-guide-menu hidden role="menu" aria-label="Ask Subi to show you something">
    <b>What should I show you?</b>
    ${(o.menu || [["try", "file", m.slug === "employee-management" ? "Watch a letter write itself" : "Try the live demo"], ["ba", "repeat", "Before and after"], ["cap", "layers", "What it does"], ["ask", "message", "Ask a question"]]).map(([k, ic, tt]) => `<button type="button" role="menuitem" data-show="${k}">${icon(ic, "ic")}${tt}</button>`).join("")}
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
<script src="/assets/js/mod11.js?v=${V}" defer></script>
<script src="/assets/js/mod3.js?v=${V}" defer></script>
<script src="/assets/js/navmenu.js?v=${V}" defer></script>
</body>
</html>
`;
}


/* ================= the industries page: the original content, in the new design ================= */
const bySlugM = Object.fromEntries(modules.map((x) => [x.slug, x]));
const TONE = ["yellow", "blue", "dark", "mint", "coral"];

function indStack() {
  return `<section class="istk" id="try" aria-labelledby="h-istk" data-tip="Pick your industry. Each card shows what fits it.">
  <div class="istk__head"><h2 id="h-istk">HR software for every kind of workforce.</h2></div>
  <nav class="istk__nav" data-spy aria-label="Industries">${INDS.map((i, k) => `<a href="#${i.id}"${k === 0 ? ' aria-current="true"' : ""}><i>${icon(i.icon, "ic")}</i>${esc(i.name)}</a>`).join("")}</nav>
  <div class="istk__cards">${INDS.map((i, k) => `<article class="istk__c istk__c--${TONE[k % 5]}" id="${i.id}" style="--k:${k}" aria-label="${esc(i.name)}">
    <div class="istk__copy"><span class="istk__tag"><i>${icon(i.icon, "ic")}</i>${esc(i.name)}</span><h3>HR software for ${esc(/^[A-Z]{2}/.test(i.name) ? i.name : i.name.toLowerCase())}</h3><p>${esc(i.blurb)}</p>
      <ul>${i.how.map((h) => `<li>${icon("check", "ic")}${esc(h)}</li>`).join("")}</ul>
      <a class="istk__go" href="/book-demo/?industry=${encodeURIComponent(i.name)}">Get a ${esc(i.name)} demo ${icon("arrow", "ic")}</a></div>
    <div class="istk__scene"><span class="istk__big" aria-hidden="true">${icon(i.icon, "ic")}</span><small>Recommended modules</small>
      ${i.modules.map((s) => `<a class="istk__mod" href="/software/${s}/"><i>${icon(bySlugM[s].icon, "ic")}</i><span><b>${esc(bySlugM[s].name)}</b><em>${esc(bySlugM[s].short)}</em></span>${icon("arrow", "ic")}</a>`).join("")}</div>
  </article>`).join("")}</div>
</section>`;
}

function indGlance() {
  return `<section class="iglance" aria-labelledby="h-ig" data-tip="Nine industries. One platform.">
  <div class="iglance__head"><h2 id="h-ig">Nine industries. One platform.</h2></div>
  <div class="iglance__grid">${INDS.map((i, k) => `<a class="iglance__c iglance__c--${k % 5}" href="#${i.id}"><i>${icon(i.icon, "ic")}</i><b>${esc(i.name)}</b><p>${esc(i.blurb)}</p><em>See how ${icon("arrow", "ic")}</em></a>`).join("")}</div>
</section>`;
}

function indCta() {
  return `<section class="mbk" aria-labelledby="h-meet" data-tip="Tell us how your teams work.">
  <div class="mbk__wrap">
    <div class="mbk__in">
      <h2 id="h-meet">Don't see your industry?</h2>
      <p>Our rules engine and custom development cover almost any workforce. Tell us how your teams work.</p>
      <div class="mbk__act"><a class="mbk__go" href="/contact/">Talk to an HR expert ${icon("arrow", "ic")}</a><a class="mbk__go mbk__go--alt" href="/custom-development/">Custom development ${icon("arrow", "ic")}</a></div>
      <small class="mbk__note">We reply within one business day.</small>
    </div>
    <div class="mbk__who cast" aria-hidden="true"><span class="mbk__say">Tell us about your teams!</span><div class="mbk__ppl" data-bkppl>${who(byName["Aisha"], 5, "ppl--wave")}</div></div>
  </div>
</section>
<script>(function(){var l=[].slice.call(document.querySelectorAll('[data-spy] a')),s=l.map(function(a){return document.querySelector(a.getAttribute('href'))});if(!('IntersectionObserver' in window))return;var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var i=s.indexOf(e.target);l.forEach(function(a,k){if(k===i)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});var a=l[i];if(a&&a.parentNode.scrollTo)a.parentNode.scrollTo({left:a.offsetLeft-24,behavior:'smooth'})}})},{rootMargin:'-35% 0px -55% 0px'});s.forEach(function(x){if(x)io.observe(x)})})();</script>`;
}

export function industriesModulePage(faqItems, ldExtra = "") {
  const m = {
    slug: "industries", name: "Industries", icon: "building", tagline: "Built for the way you work.",
    summary: "From shop floors to hospital wards, SublimeHR adapts to your shifts, sites and policies.",
    features: INDS.map((i) => i.name), benefits: ["Shift rosters that fit each plant and ward", "Leave and pay rules set per industry", "Live in days, not months"], useCases: [],
    _hero: { who: ["9", "9 industries", "One platform, configured for each"], cast: [["Karan", "Plant manager"], ["Nadia", "Ward nurse"], ["Ravi", "Field engineer"]], chips: [["factory", "3-shift plants"], ["health", "24/7 wards"], ["truck", "Field crews"]] }
  };
  return modulePage(m, faqItems, ldExtra, {
    path: "/industries/", title: "HR Software by Industry — Manufacturing, Healthcare, Retail & More | SublimeHR",
    description: "SublimeHR for manufacturing, healthcare, IT, education, hospitality, retail, logistics, professional services and construction.",
    menu: [["try", "building", "Browse the industries"]],
    main: (mm) => `${hero(mm)}\n${indStack()}\n${indGlance()}\n${indCta()}`
  });
}


/* ================= the pricing page: the original content, in the new design ================= */
const PRATE = { Starter: 4, Professional: 8 };
const PHREF = { Starter: "/get-pricing/?plan=Starter", Professional: "/book-demo/?plan=Professional", Enterprise: "/get-pricing/?plan=Enterprise" };
const PICON = ["rocket", "zap", "building"];

function priceCalc() {
  return `<section class="pcalc" id="try" aria-label="Estimate your monthly cost" data-price data-tip="Slide your team size. Every plan below updates.">
  <div class="pcalc__card">
    <div class="pcalc__l"><small>Your team size</small><div class="pcalc__num"><output data-pn>120</output><span>employees</span></div><div class="pcalc__avs" data-avs aria-hidden="true"></div></div>
    <div class="pcalc__r">
      <label class="vh" for="emp">Number of employees</label><input id="emp" type="range" data-r="emp" min="5" max="1000" step="5" value="120">
      <div class="pcalc__quick" role="group" aria-label="Quick pick">${[10, 50, 100, 250, 500, 1000].map((n) => `<button type="button" data-n="${n}" aria-pressed="false">${n === 1000 ? "1000+" : n}</button>`).join("")}</div>
      <p class="pcalc__note">${icon("arrow", "ic")}Estimated monthly cost updates on every plan below</p>
    </div>
  </div>
  <h2 class="vh">Plans</h2>
  <div class="pplans">${plans.map((pl, i) => `<article class="pplan${pl.featured ? " pplan--pop" : ""}" style="--i:${i}">
    ${pl.featured ? `<span class="pplan__rib">★ Most loved</span>` : ""}
    <h3><i>${icon(PICON[i], "ic")}</i>${esc(pl.name)}</h3>
    <p class="pplan__desc">${esc(pl.desc)}</p>
    <div class="pplan__price"><strong>${esc(pl.price)}</strong><span>${esc(pl.unit)}</span></div>
    <div class="pplan__est" data-est="${PRATE[pl.name] || 0}" data-cap="${pl.name === "Starter" ? 50 : 0}">${PRATE[pl.name] ? "" : "Tailored quote for your team"}</div>
    <a class="pplan__go" href="${PHREF[pl.name]}">${esc(pl.cta[0])} ${icon("arrow", "ic")}</a>
    <p class="pplan__inc">${esc(pl.includes || "What's included")}</p>
    <ul>${pl.items.map((x) => `<li>${icon("check", "ic")}${esc(x)}</li>`).join("")}</ul>
  </article>`).join("")}</div>
  <p class="pcalc__fine">Prices in USD per active user per month. Local currency and annual billing available on request.</p>
</section>`;
}

function priceTable() {
  const cell = (v) => v === 1 ? `<td class="yes" aria-label="Included">${icon("check", "ic")}</td>` : v === 0 ? `<td class="no" aria-label="Not included">—</td>` : `<td class="txt">${esc(v)}</td>`;
  return `<section class="ptab" aria-labelledby="h-pt" data-tip="Every detail, side by side.">
  <div class="ptab__head"><h2 id="h-pt">Every detail, side by side.</h2></div>
  <div class="ptab__wrap"><table><thead><tr><th>Feature</th><th>Starter</th><th class="hl">Professional<em>Most loved</em></th><th>Enterprise</th></tr></thead>
  <tbody>${compare.map(([f, a, b, c]) => `<tr><th scope="row">${esc(f)}</th>${cell(a)}${cell(b).replace("<td ", '<td data-hl="1" ')}${cell(c)}</tr>`).join("")}</tbody></table></div>
</section>`;
}

function closeBand(o) {
  return `<section class="mbk" aria-labelledby="h-meet" data-tip="${esc(o.title)}">
  <div class="mbk__wrap">
    <div class="mbk__in"><h2 id="h-meet">${esc(o.title)}</h2><p>${esc(o.lead)}</p>
      <div class="mbk__act">${o.links.map(([tx, href, alt]) => `<a class="mbk__go${alt ? " mbk__go--alt" : ""}" href="${href}">${esc(tx)} ${icon("arrow", "ic")}</a>`).join("")}</div>
      <small class="mbk__note">${esc(o.small)}</small></div>
    <div class="mbk__who cast" aria-hidden="true"><span class="mbk__say">${esc(o.say)}</span><div class="mbk__ppl" data-bkppl>${who(byName["Aisha"], 5, "ppl--wave")}</div></div>
  </div>
</section>`;
}

export function pricingModulePage(faqItems, ldExtra = "") {
  const m = {
    slug: "pricing", name: "Pricing", icon: "wallet", tagline: "Simple pricing. No surprises.",
    summary: "Pay only for active employees. Free onboarding and data migration on every plan. Cancel anytime.",
    features: ["Starter, $4 per user", "Professional, $8 per user", "Enterprise, tailored to you", "Free onboarding and migration"], benefits: ["Pay only for active employees", "Free onboarding and data migration", "Cancel anytime"], useCases: [],
    _hero: { who: ["$", "Your estimate", "Updates with your team size"], cast: [["Karan", "Finance"], ["Priya", "HR partner"], ["Sara", "Founder"]], chips: [["check", "Free onboarding"], ["repeat", "Free data migration"], ["lock", "Cancel anytime"]] }
  };
  return modulePage(m, faqItems, ldExtra, {
    path: "/pricing/", title: "Pricing — HR & Payroll Software from $4 per User | SublimeHR",
    description: "SublimeHR pricing: Starter $4/user/month, Professional $8/user/month, Enterprise custom. Estimate your cost instantly. Free onboarding and migration.",
    menu: [["try", "wallet", "Estimate my cost"], ["ask", "message", "Ask about pricing"]],
    main: (mm) => `${hero(mm)}\n${priceCalc()}\n${priceTable()}\n${ask(mm)}\n${closeBand({ title: "Start with the plan that fits today.", lead: "Upgrade any time as your team grows. Your data and settings move with you.", say: "Pick a plan!", card: "Ready when you are", links: [["Get a custom quote", "/get-pricing/"], ["Chat on WhatsApp", site.whatsapp, true]], small: "We reply within one business day." })}`
  });
}


/* ================= the integrations page: the original content, in the new design ================= */
const GICON = { Productivity: "layers", Communication: "message", Hardware: "fingerprint", Developer: "code", Accounting: "wallet", ERP: "building", Security: "lock" };
const ICOL = ["#2F72B8", "#2A9C93", "#E9805F", "#7A6FD0", "#D9A21B", "#4A86C8", "#C2577A", "#4C9A5B", "#5F7389", "#3FBDB3", "#245C97", "#8F6BD6"];
const ALLI = INTS.flatMap((g) => g.items.map((it) => [...it, g.group]));
const SHORTN = { "Google Workspace": "Google", "Microsoft 365": "Microsoft 365", "Microsoft Teams": "Teams", "Biometric Devices": "Biometrics", "REST APIs": "REST API", "Okta / SAML SSO": "Okta SSO", "SAP ERP": "SAP", "Oracle ERP": "Oracle" };

function intgHub() {
  const groups = [...new Set(ALLI.map((x) => x[3]))];
  const tool = ([, n, d, g], i) => `<button type="button" class="ig__t" data-t="${i}" data-g="${g}" aria-pressed="false" style="--c:${ICOL[i % ICOL.length]}"><i>${icon(GICON[g], "ic")}</i><span><b>${esc(n)}</b><em>${esc(d)}</em><small>${g}</small></span><u aria-hidden="true">${icon("check", "ic")}</u></button>`;
  return `<section class="ig" id="try" data-dm="intg" aria-labelledby="h-ig" data-tip="Tap a tool to plug it into the hub, or watch them connect one by one.">
  <div class="ig__head"><h2 id="h-ig">12 native integrations + an open REST API</h2><p>Tap a tool to plug it into your HR hub, or pick a category and plug in the whole group. It plays by itself until you take over.</p></div>
  <div class="ig__filter" role="group" aria-label="Filter integrations"><button type="button" data-f="all" aria-pressed="false">All</button>${groups.map((g) => `<button type="button" data-f="${g}" aria-pressed="false">${g}</button>`).join("")}</div>
  <div class="ig__scene" data-scene>
    <svg class="ig__wires" aria-hidden="true"></svg>
    <div class="ig__col ig__col--l">${ALLI.slice(0, 6).map((x, i) => tool(x, i)).join("")}</div>
    <div class="ig__hub" aria-live="polite">
      <div class="ig__orb"><svg viewBox="0 0 160 160" aria-hidden="true"><circle class="ig__rb" cx="80" cy="80" r="68"/><circle class="ig__rp" data-ring cx="80" cy="80" r="68" transform="rotate(-90 80 80)"/></svg>
        <div class="ig__core"><img src="${site.logo}" alt="" width="40" height="36"><div class="ig__count"><strong data-cn>0</strong><span>/ 12</span></div></div></div>
      <b>Your HR hub</b><small>tools connected</small>
    </div>
    <div class="ig__col ig__col--r">${ALLI.slice(6, 12).map((x, i) => tool(x, i + 6)).join("")}</div>
  </div>
  <p class="ig__note">${icon("code", "ic")}Anything else plugs in through the open REST API.</p>
</section>`;
}

export function integrationsModulePage(ldExtra = "") {
  const m = {
    slug: "integrations", name: "Integrations", icon: "layers", tagline: "Plays nicely with your stack.",
    summary: "SublimeHR sits at the centre of your HR stack, syncing with the chat, identity, accounting and ERP tools your team already uses.",
    features: ["Google Workspace and Microsoft 365", "Slack, Teams and Zoom", "QuickBooks, Tally, SAP and Oracle", "Biometric devices and an open REST API"], benefits: ["Sync with the tools you already use", "Single sign-on with Okta and SAML", "An open REST API for the rest"], useCases: [],
    _hero: { who: ["HR", "Your HR hub", "At the centre of your stack"], cast: [["Ravi", "IT admin"], ["Priya", "HR partner"], ["Karan", "Finance"]], chips: [["message", "Slack alerts"], ["fingerprint", "Biometric devices"], ["code", "Open REST API"]] }
  };
  return modulePage(m, [], ldExtra, {
    path: "/integrations/", title: "Integrations — Slack, Teams, Google, Microsoft 365, Tally, SAP & More | SublimeHR",
    description: "SublimeHR integrates with Google Workspace, Microsoft 365, Slack, Teams, Zoom, biometric devices, QuickBooks, Tally, SAP, Oracle, Okta/SAML SSO and any system via REST API.",
    menu: [["try", "layers", "Browse the integrations"]],
    main: (mm) => `${hero(mm)}\n${intgHub()}\n${closeBand({ title: "Need another tool?", lead: "We build custom integrations to any REST-based system, legacy ERPs, LMS and internal tools included.", say: "We can connect it!", card: "Missing something?", links: [["Request an integration", "/contact/?topic=Integration"]], small: "We reply within one business day." })}`
  });
}



const cfSide = (side, say) => side === "L"
  ? `<div class="cf__ch cf__ch--l cast" aria-hidden="true"><span class="cf__say" data-cfsay data-def="${esc(say)}">${esc(say)}</span><div class="cf__ppl">${who(byName["Aisha"], 3, "ppl--wave")}</div></div>`
  : `<div class="cf__ch cf__ch--r cast" aria-hidden="true"><div class="cf__ppl">${who(byName["Omar"], 4, "")}</div></div>`;
const cfWho = (say) => `<div class="cf__stage cast" aria-hidden="true"><span class="cf__say" data-cfsay data-def="${esc(say)}">${esc(say)}</span><div class="cf__ppl">${who(byName["Aisha"], 3, "ppl--wave")}</div></div>`;

/* ================= the contact page: the original content and form, in the new design ================= */
const CCODES = [["+91", "🇮🇳 +91"], ["+971", "🇦🇪 +971"], ["+966", "🇸🇦 +966"], ["+974", "🇶🇦 +974"], ["+965", "🇰🇼 +965"], ["+968", "🇴🇲 +968"], ["+973", "🇧🇭 +973"], ["+44", "🇬🇧 +44"], ["+1", "🇺🇸 +1"]];
const TOPICS = ["General question", "Sales", "Support", "Custom development", "Integration", "Partnership"];

function contactSection() {
  return `<section class="ctc" id="try" aria-label="Contact us">
  <div class="cfh"><span class="cfh__b cfh__b--1" aria-hidden="true"></span><span class="cfh__b cfh__b--2" aria-hidden="true"></span><i class="cfh__d cfh__d--l" aria-hidden="true">${icon("message", "ic")}</i><i class="cfh__d cfh__d--r" aria-hidden="true">${icon("phone", "ic")}</i><h1>Let's <span class="cfh__sq">talk.</span></h1><p>Questions, support, partnerships or anything else, we reply within 1 business day.</p><div class="cfh__chips"><span><i>${icon("clock", "ic")}</i>Reply in 1 business day</span><span><i>${icon("message", "ic")}</i>Instant on WhatsApp</span><span><i>${icon("phone", "ic")}</i>Call us</span></div></div>
  <div class="cf__wrap">
    ${cfSide("L", "How can we help?")}
    <div class="cf-card">
      <form id="contact-form" novalidate data-endpoint="${site.formEndpoint}" aria-describedby="form-note">
        <input type="hidden" name="intent" value="contact_sales">
        <h2>Send us a message</h2><p class="cf__sub">We'll get back to you by email or phone.</p>
        <div class="cf__fields">
          <div class="cf-field" data-validate><label for="f-name">Your name <b>*</b></label><input id="f-name" name="name" required autocomplete="name" placeholder="Full name"><span class="cf-err">Please enter your name.</span></div>
          <div class="cf-field" data-validate><label for="f-email">Work email <b>*</b></label><input id="f-email" name="email" type="email" required autocomplete="email" placeholder="you@company.com"><span class="cf-err">Please enter a valid email.</span></div>
          <div class="cf-field" data-validate><label for="f-phone">Phone <b>*</b></label><div class="cf-tel"><select name="cc" aria-label="Country code">${CCODES.map(([v, l]) => `<option value="${v}">${l}</option>`).join("")}</select><input id="f-phone" name="phone" type="tel" required autocomplete="tel-national" inputmode="tel" placeholder="98765 43210"></div><span class="cf-err">Please enter a valid phone number.</span></div>
          <div class="cf-field"><label for="f-company">Company</label><input id="f-company" name="company" autocomplete="organization" placeholder="Company name"></div>
          <div class="cf-field cf-field--full"><span class="cf-lbl">Topic</span><div class="cf-topics">${TOPICS.map((tp, i) => `<label><input type="radio" name="topic" value="${tp}"${i === 0 ? " checked" : ""}><span>${tp}</span></label>`).join("")}</div></div>
          <div class="cf-field cf-field--full" data-validate><label for="f-msg">Your message <b>*</b></label><textarea id="f-msg" name="message" required placeholder="How can we help?"></textarea><span class="cf-err">Please write a short message.</span></div>
          <div style="position:absolute;left:-9999px" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
        </div>
        <div class="form-error" id="form-error" role="alert" tabindex="-1" hidden></div>
        <button class="cf__send" type="submit"><span data-submit-label>Send message</span>${icon("send", "ic")}</button>
        <p class="cf__hint" id="form-note">By submitting, you agree to our <a href="/privacy/">Privacy Policy</a>.</p>
      </form>
      <div class="cf-ok" id="form-success" role="status" aria-live="polite">
        <span class="cf-ok__i">${icon("check", "ic")}</span>
        <h2>You're all set! 🎉</h2>
        <p id="success-msg">An HR specialist will reach out within 1 business day. We've also sent a confirmation to your email.</p>
        <div class="cf-ok__a"><a class="cf__send" id="wa-followup" href="${site.whatsapp}" target="_blank" rel="noopener">Message us on WhatsApp${icon("message", "ic")}</a><a class="cf__alt" href="/">Back to home</a></div>
      </div>
    </div>
    ${cfSide("R", "")}
  </div>
</section>
<section class="cfr" aria-label="More ways to reach us"><div class="cfr__grid"><a class="cf__line cf__line--call" href="${site.phoneHref}"><i>${icon("phone", "ic")}</i><span><small>Call us</small><b>${site.phone}</b></span>${icon("arrow", "ic")}</a>
      <a class="cf__line cf__line--wa" href="${site.whatsapp}" target="_blank" rel="noopener"><i>${icon("message", "ic")}</i><span><small>Chat with us</small><b>WhatsApp</b></span>${icon("arrow", "ic")}</a>
      <div class="cf__short"><p>Looking for something specific?</p><div>
        <a href="/book-demo/"><i>${icon("play", "ic")}</i><b>Book a demo</b><small>30-min tour</small></a>
        <a href="/get-pricing/"><i>${icon("wallet", "ic")}</i><b>Get pricing</b><small>Team quote</small></a>
        <a href="/faq/"><i>${icon("message", "ic")}</i><b>FAQ</b><small>50 answers</small></a>
      </div></div></div></section>
<script src="/assets/js/form.js?v=${V}" defer></script>`;
}

export function contactModulePage(ldExtra = "") {
  const m = {
    slug: "contact", name: "Contact", icon: "message", tagline: "Let's talk.",
    summary: "Questions, support, partnerships or anything else. We reply within 1 business day.",
    features: ["Questions and support", "Sales and demos", "Partnerships", "Custom development"], benefits: ["We reply within 1 business day", "Chat instantly on WhatsApp", "Call us any working day"], useCases: [],
    _hero: { who: ["HR", "SublimeHR team", "Replies within 1 business day"], cast: [["Aisha", "Support"], ["Priya", "HR partner"], ["Omar", "Sales"]], chips: [["clock", "Reply in 1 business day"], ["message", "Instant WhatsApp"], ["phone", "Call us"]] }
  };
  return modulePage(m, [], ldExtra, {
    path: "/contact/", title: "Contact SublimeHR | SublimeHR",
    description: "Contact SublimeHR for questions, support or partnerships. Call +91-7976117684 or chat on WhatsApp. We reply within 1 business day.",
    menu: [["try", "message", "Write to us"]],
    noHero: true, main: () => `${contactSection()}`
  });
}


/* ================= the about page: the original content, in the new design ================= */
const OFFER = [["clock", "Attendance management"], ["calendar", "Leave & holidays"], ["repeat", "Shift scheduling"], ["users", "Employee directory"], ["wallet", "Payroll support"], ["chart", "Reports & analytics"], ["lock", "Role-based access"], ["phone", "Mobile accessibility"], ["cloud", "Secure cloud platform"]];
const REASONS = ["Simple and intuitive user experience", "Designed for businesses of all sizes", "Secure cloud infrastructure", "Scalable as your organization grows", "Reliable customer support", "Continuous product improvements"];
const OTONE = ["#3558F5", "#FF8A70", "#F5B500", "#45C4B0", "#7A5CF0"];

function aboutStory() {
  return `<section class="abt" id="try" aria-labelledby="h-abt" data-tip="Our story, in numbers.">
  <div class="abt__copy"><h2 id="h-abt">One platform for the work behind your people.</h2>
    <p class="abt__lead">SublimeHR helps businesses streamline attendance, leave, shift scheduling, employee records, payroll and day-to-day HR operations through a single, intuitive platform.</p>
    <p>Whether you're a growing startup, a mid-sized business or a large enterprise, our goal is to eliminate manual processes, reduce admin overhead, and give your team more time for what matters most: growing your business.</p></div>
  <div class="abt__stats" data-count-box>
    <div class="abt__s abt__s--0"><strong data-count="70" data-suffix="+">70+</strong><span>Feature areas</span><span class="abt__toss" aria-hidden="true"><i style="--d:0.00s;--x:-26px">7</i><i style="--d:-1.05s;--x:6px">0</i><i style="--d:-2.10s;--x:30px">+</i></span></div>
    <div class="abt__s abt__s--1"><strong data-count="13">13</strong><span>Report types</span><span class="abt__toss" aria-hidden="true"><i style="--d:0.00s;--x:-26px">1</i><i style="--d:-1.05s;--x:6px">3</i><i style="--d:-2.10s;--x:30px">%</i></span></div>
    <div class="abt__s abt__s--2"><strong data-count="9">9</strong><span>Industries</span><span class="abt__toss" aria-hidden="true"><i style="--d:0.00s;--x:-26px">9</i><i style="--d:-1.05s;--x:6px">+</i><i style="--d:-2.10s;--x:30px">1</i></span><span class="abt__jg cast" aria-hidden="true"><span class="abt__jgp">${who(byName["Sara"], 3, "ppl--wave")}</span></span></div>
    <div class="abt__s abt__s--3"><strong>EN·AR</strong><span>Languages</span><span class="abt__toss" aria-hidden="true"><i style="--d:0.00s;--x:-26px">A</i><i style="--d:-1.05s;--x:6px">ع</i><i style="--d:-2.10s;--x:30px">E</i></span></div>
  </div>
</section>
<script>(function(){var b=document.querySelector('[data-count-box]');if(!b)return;var els=[].slice.call(b.querySelectorAll('[data-count]'));function run(){els.forEach(function(e){var to=+e.getAttribute('data-count'),sf=e.getAttribute('data-suffix')||'',t0=performance.now();(function s(n){var p=Math.min(1,(n-t0)/1400),v=Math.round(to*(1-Math.pow(1-p,3)));e.textContent=v+sf;if(p<1)requestAnimationFrame(s)})(t0)})}if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){io.disconnect();run()}},{threshold:.4});io.observe(b)}})();</script>`;
}

const VIS = [
  `<span class="v-feed"><b><i></i><u></u><em>On time</em></b><b><i></i><u></u><em>On time</em></b><b><i></i><u></u><em class="l">Late</em></b></span>`,
  `<span class="v-cal">${Array.from({ length: 14 }, (_, k) => `<i class="${k === 8 || k === 9 ? "s" : ""}"></i>`).join("")}</span>`,
  `<span class="v-ros">${["M", "E", "N", "E", "M", "O", "M", "N", "E"].map((x) => `<i class="${x.toLowerCase()}">${x}</i>`).join("")}</span>`,
  `<span class="v-av"><i style="background:#FF8A70">A</i><i style="background:#45C4B0">R</i><i style="background:#7A5CF0">S</i><i style="background:#F5B500">+</i></span>`,
  `<span class="v-pay"><b>4,940</b><u></u><u></u><u></u></span>`,
  `<span class="v-bars"><i style="--h:40%"></i><i style="--h:62%"></i><i style="--h:48%"></i><i style="--h:84%"></i><i style="--h:70%"></i></span>`,
  `<span class="v-sw"><i class="on"></i><i class="on"></i><i></i></span>`,
  `<span class="v-ph"><i></i><b></b><b></b></span>`,
  `<span class="v-cl"><i></i><i></i><i></i></span>`
];
const OFFER_HREF = ["/software/attendance-management/", "/software/leave-management/", "/software/shift-scheduling/", "/software/employee-management/", "/software/payroll/", "/software/reports-analytics/", "/software/security-access/", "/software/mobile-workforce/", "/features/"];
const OFFER_BG = ["#3558F5", "#FFD05A", "#CFF3E4", "#FFD9CC", "#14213D", "#E4DEFF", "#CFE3FF", "#FFE9A8", "#3558F5"];
function aboutOffer() {
  return `<section class="aoff" aria-labelledby="h-aoff" data-tip="The essentials to run your workforce. Each one opens its page.">
  <div class="aoff__head"><h2 id="h-aoff">The essentials to run your workforce.</h2></div>
  <div class="aoff__bento">${OFFER.map(([ic, tt], i) => `<a class="aoff__t aoff__t--${i}" href="${OFFER_HREF[i]}" style="--bg:${OFFER_BG[i]}"><span class="aoff__v" aria-hidden="true">${VIS[i]}</span><i>${icon(ic, "ic")}</i><b>${esc(tt)}</b><em>${icon("arrow", "ic")}</em></a>`).join("")}</div>
</section>`;
}

const ABOUT_STAGE = `<div class="abh" aria-hidden="true">
  <div class="abh__orb"><i class="abh__r1"></i><i class="abh__r2"></i><span><img src="${site.logo}" alt="" width="64" height="58"></span></div>
  <div class="abh__st abh__st--1"><strong>70+</strong><span>feature areas</span></div>
  <div class="abh__st abh__st--2"><strong>13</strong><span>report types</span></div>
  <div class="abh__st abh__st--3"><strong>9</strong><span>industries</span></div>
  <div class="abh__st abh__st--4"><strong>EN·AR</strong><span>languages</span></div>
</div>`;

function aboutWhy() {
  return `<section class="awhy" aria-label="Why SublimeHR, our mission and our vision">
  <article class="awhy__c awhy__c--why"><span class="abt__tag"><i></i>Why SublimeHR</span><h3>Built to help you move faster, with confidence.</h3><ul>${REASONS.map((r) => `<li>${icon("check", "ic")}${esc(r)}</li>`).join("")}</ul></article>
  <article class="awhy__c awhy__c--mis"><span class="awhy__big" aria-hidden="true">${icon("target", "ic")}</span><i class="awhy__ic">${icon("target", "ic")}</i><h3>Our mission</h3><p>To simplify workforce management with reliable, secure and easy-to-use technology that improves productivity, transparency and operational efficiency.</p></article>
  <article class="awhy__c awhy__c--vis"><span class="awhy__big" aria-hidden="true">${icon("eye", "ic")}</span><i class="awhy__ic">${icon("eye", "ic")}</i><h3>Our vision</h3><p>To become a trusted workforce management solution that empowers organizations worldwide to build more connected, efficient and productive workplaces.</p></article>
</section>`;
}

export function aboutModulePage(ldExtra = "") {
  const m = {
    slug: "about", name: "About", icon: "users", tagline: "Workforce management, made simple.",
    summary: "At SublimeHR, we believe managing your workforce should be simple, efficient, and accessible from anywhere.",
    features: ["Attendance and leave", "Shift scheduling", "Employee records", "Payroll and reports"], benefits: ["Simple and intuitive", "Secure cloud platform", "Scalable as you grow"], useCases: [],
    _stage: ABOUT_STAGE, _pos: [[70, 334, .95], [300, 350, 1], [560, 334, 1]], _hero: { who: ["SH", "SublimeHR team", "One platform for your workforce"], cast: [["Priya", "HR partner"], ["Omar", "Product"], ["Sara", "Support"]], chips: [["target", "Our mission"], ["eye", "Our vision"], ["building", "Businesses of all sizes"]] }
  };
  return modulePage(m, [], ldExtra, {
    path: "/about/", title: "About SublimeHR — Our Mission & Vision | SublimeHR",
    description: "SublimeHR is a modern workforce management platform that streamlines attendance, leave, shift scheduling, employee records and payroll. Learn about our mission and vision.",
    menu: [["try", "users", "Read our story"]],
    main: (mm) => `${hero(mm)}\n${aboutStory()}\n${aboutOffer()}\n${aboutWhy()}\n${closeBand({ title: "Let's talk about your workforce.", lead: "Interested in learning more or scheduling a demo? We reply within one business day.", say: "Let's talk!", card: "Ready when you are", links: [["Book a demo", "/book-demo/"], ["Contact us", "/contact/", true]], small: "We reply within one business day." })}`
  });
}


/* ================= the custom development page: the original content, in the new design ================= */
const CDV = {
  workflow: `<span class="cdv cdv-flow"><i></i><u></u><i></i><u></u><i></i></span>`,
  form: `<span class="cdv cdv-form"><b></b><b></b><b class="s"></b></span>`,
  dollar: `<span class="cdv cdv-rate"><b>+12%</b><b class="n">-3%</b><b>x1.5</b></span>`,
  clock: `<span class="cdv cdv-time"><i>22:00</i><u></u><i>06:00</i></span>`,
  repeat: `<span class="cdv cdv-cyc"><i></i><i></i><i></i></span>`,
  plug: `<span class="cdv cdv-plug"><i></i><u></u><i></i></span>`,
  dashboard: `<span class="cdv cdv-dash"><i></i><i></i><i></i><i></i></span>`,
  split: `<span class="cdv cdv-split"><i></i><b></b><b></b><b></b></span>`,
  cpu: `<span class="cdv cdv-ai"><i>Anomaly</i><i>Attrition</i></span>`
};
const CDTONE = ["#3558F5", "#FF8A70", "#F5B500", "#45C4B0", "#7A5CF0", "#3558F5", "#FF8A70", "#45C4B0", "#7A5CF0"];

const CUSTOM_STAGE = `<div class="cdh" aria-hidden="true">
  <svg class="cdh__w" viewBox="0 0 740 330" preserveAspectRatio="none"><path d="M150 70C250 70 250 150 330 150" /><path d="M330 150C430 150 430 80 520 80" /><path d="M330 150C400 150 420 230 520 230" /></svg>
  <div class="cdh__n cdh__n--1"><i>${icon("workflow", "ic")}</i><b>Custom approvals</b></div>
  <div class="cdh__n cdh__n--2"><i>${icon("code", "ic")}</i><b>Built for you</b></div>
  <div class="cdh__n cdh__n--3"><i>${icon("dollar", "ic")}</i><b>Payroll rules</b></div>
  <div class="cdh__n cdh__n--4"><i>${icon("plug", "ic")}</i><b>Legacy ERP sync</b></div>
  <div class="cdh__fix"><small>How we work</small>Fixed price, demo every 2 weeks</div>
</div>`;

function cdAreas() {
  return `<section class="cda" id="try" aria-labelledby="h-cda" data-tip="Nine places we customize.">
  <div class="cda__head"><h2 id="h-cda">Built around how you actually work.</h2></div>
  <div class="cda__grid">${customAreas.map(([ic, tt, d], i) => `<article class="cda__c" style="--c:${CDTONE[i]}"><div class="cda__v">${CDV[ic] || CDV.workflow}</div><i>${icon(ic, "ic")}</i><h3>${esc(tt)}</h3><p>${esc(d)}</p></article>`).join("")}</div>
</section>`;
}

function cdProcess() {
  return `<section class="cdp" aria-labelledby="h-cdp" data-tip="From idea to go-live, in four stops.">
  <div class="cdp__head"><h2 id="h-cdp">From idea to go-live, in four stops.</h2><p>Fixed pricing, transparent milestones and a demo every two weeks.</p></div>
  <ol class="cdp__road" data-road><i class="cdp__line" aria-hidden="true"><u></u></i>${PROC.map(([tt, d], i) => `<li><span class="cdp__pin">0${i + 1}</span><h3>${esc(tt)}</h3><p>${esc(d)}</p></li>`).join("")}</ol>
</section>
<script>(function(){var r=document.querySelector('[data-road]');if(!r)return;var li=[].slice.call(r.querySelectorAll('li')),bar=r.querySelector('.cdp__line u'),tm,vis=false,k=0;function step(){if(!vis)return;if(k>li.length){li.forEach(function(x){x.classList.remove('on')});bar.style.width='0%';k=0;tm=setTimeout(step,900);return}li.forEach(function(x,i){x.classList.toggle('on',i<k)});bar.style.width=(k<=0?0:(k-1)/(li.length-1)*100)+'%';k++;tm=setTimeout(step,k>li.length?2600:1300)}if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;clearTimeout(tm);if(vis)step()},{threshold:.4}).observe(r);else{vis=true;step()}})();</script>`;
}

export function customDevModulePage(faqItems, ldExtra = "") {
  const m = {
    slug: "custom-development", name: "Custom development", icon: "code", tagline: "Your HR is unique. So is ours.",
    summary: "Every organization has quirks off-the-shelf software can't solve. We ship custom modules, workflows and integrations that fit, not force, your process.",
    features: ["Custom approval workflows", "Bespoke forms", "Payroll rules", "Attendance policies"], benefits: ["Fixed pricing", "A demo every two weeks", "Fits your process"], useCases: [],
    _stage: CUSTOM_STAGE, _pos: [[70, 334, .95], [300, 350, 1], [560, 334, 1]],
    _cta: `<a class="btn btn--on btn--lg" href="/contact/?topic=Custom%20development">Request a custom feature</a><a class="link" href="/book-demo/">Book a consultation</a>`,
    _hero: { who: ["C", "Custom build", "Fixed price"], cast: [["Ravi", "Engineer"], ["Priya", "HR partner"], ["Karan", "Finance"]], chips: [] }
  };
  return modulePage(m, faqItems, ldExtra, {
    path: "/custom-development/", title: "Custom HRMS Development — Workflows, Payroll Rules & Integrations | SublimeHR",
    description: "Custom HR software development by SublimeHR: approval workflows, payroll rules, attendance policies, dashboards, integrations and AI automation with fixed pricing.",
    menu: [["try", "code", "See where we customize"], ["ask", "message", "Ask a question"]],
    main: (mm) => `${hero(mm)}\n${cdAreas()}\n${cdProcess()}\n${ask(mm)}\n${closeBand({ title: "Tell us about the workflow you need.", lead: "Get a solution design with a timeline and fixed pricing.", say: "Let's design it!", card: "Start the conversation", links: [["Schedule a consultation", "/book-demo/"], ["Describe your workflow", "/contact/?topic=Custom%20development", true]], small: "We reply within one business day." })}`
  });
}


/* ================= the FAQ page: the original content, in the new design ================= */
function faqExplorer() {
  const data = FAQG.map((g) => ({ id: g.id, title: g.title, items: g.items.map(([q, a]) => [q, a]) }));
  return `<section class="fqx" id="try" data-dm="faq" data-faq="${esc(JSON.stringify(data)).replace(/"/g, "&quot;")}" aria-label="Frequently asked questions" data-tip="Pick a topic, then ask. Subi answers.">
  <div class="fqx__grid">
    <nav class="fqx__rail" aria-label="FAQ topics">${FAQG.map((g, i) => `<button type="button" data-ft="${i}" aria-pressed="${i === 0}"><i>${icon(g.icon, "ic")}</i><b>${esc(g.title)}</b><em>${g.items.length}</em></button>`).join("")}</nav>
    <div class="fqx__qs"><small data-ftitle>${esc(FAQG[0].title)}</small><ul data-fq></ul></div>
    <div class="chat fqx__chat">
      <div class="chat__top"><span class="chat__av"><span class="s-head"><span class="s-scr"><b></b><b></b></span></span></span><b>Subi</b><em>Online</em></div>
      <div class="chat__log" data-flog aria-live="polite"><div class="msg bot">Hi, I'm Subi. Pick a topic, then a question, or type your own.</div></div>
      <form class="chat__foot" data-fform><label class="vh" for="fq-in">Ask a question</label><input id="fq-in" placeholder="For example: How quickly can we go live?" autocomplete="off"><button type="submit" aria-label="Send">${icon("send", "ic")}</button></form>
    </div>
  </div>
</section>`;
}

export function faqModulePage(all, ldExtra = "") {
  const m = {
    slug: "faq", name: "FAQ", icon: "message", tagline: "Ask us anything.",
    summary: `${all.length} answers on features, security, pricing and more. Pick a topic, then ask our HR assistant.`,
    features: FAQG.slice(0, 4).map((g) => g.title), benefits: ["Answers on every module", "Ask in your own words", "A real person replies within one business day"], useCases: [],
    _hero: { who: ["?", "Frequently asked", `${all.length} answers`], cast: [["Aisha", "Support"], ["Priya", "HR partner"], ["Omar", "Product"]], chips: [["message", "Pick a topic"], ["bot", "Ask Subi"], ["check", `${all.length} answers`]] }
  };
  return modulePage(m, [], ldExtra, {
    path: "/faq/", title: "FAQ — SublimeHR Questions & Answers | SublimeHR",
    description: `Answers to ${all.length} questions about SublimeHR: getting started, attendance, leave, payroll, reports, security, custom development, pricing, implementation, mobile and integrations.`,
    menu: [["try", "message", "Browse the answers"]],
    main: (mm) => `${hero(mm)}\n${faqExplorer()}\n${closeBand({ title: "Still have questions?", lead: "Talk to a real HR expert. We usually reply within one business day, or instantly on WhatsApp.", say: "Ask away!", card: "We're here", links: [["Contact us", "/contact/"], ["Chat on WhatsApp", site.whatsapp, true]], small: "We reply within one business day." })}`
  });
}


/* ================= the book a demo page: the original content and form, in the new design ================= */
const AGENDA = [["0–5", "Your goals & current process"], ["5–20", "Live tour tailored to your team"], ["20–25", "Pricing & rollout plan"], ["25–30", "Your questions, answered"]];
function demoBookSection() {
  return `<section class="ctc" id="try" aria-label="Book a demo">
  <div class="cfh"><span class="cfh__b cfh__b--1" aria-hidden="true"></span><span class="cfh__b cfh__b--2" aria-hidden="true"></span><i class="cfh__d cfh__d--l" aria-hidden="true">${icon("play", "ic")}</i><i class="cfh__d cfh__d--r" aria-hidden="true">${icon("clock", "ic")}</i><h1>See SublimeHR <span class="cfh__sq">live.</span></h1><p>A personalized 30-minute walkthrough with your policies, your shifts and your questions.</p><div class="cfh__chips"><span><i>${icon("clock", "ic")}</i>30-minute walkthrough</span><span><i>${icon("check", "ic")}</i>No credit card</span><span><i>${icon("users", "ic")}</i>Built around your team</span></div></div>
  <div class="cf__wrap">
    ${cfSide("L", "Let's book your demo!")}
    <div class="cf-card">
      <form id="contact-form" novalidate data-endpoint="${site.formEndpoint}" aria-describedby="form-note">
        <input type="hidden" name="intent" value="book_demo">
        <h2>Book your demo</h2><p class="cf__sub">Pick a day. We'll confirm the exact time by email or WhatsApp.</p>
        <div class="cf__fields">
          <div class="cf-field" data-validate><label for="f-name">Your name <b>*</b></label><input id="f-name" name="name" required autocomplete="name" placeholder="Full name"><span class="cf-err">Please enter your name.</span></div>
          <div class="cf-field" data-validate><label for="f-company">Company <b>*</b></label><input id="f-company" name="company" required autocomplete="organization" placeholder="Company name"><span class="cf-err">Please enter your company.</span></div>
          <div class="cf-field" data-validate><label for="f-email">Work email <b>*</b></label><input id="f-email" name="email" type="email" required autocomplete="email" placeholder="you@company.com"><span class="cf-err">Please enter a valid email.</span></div>
          <div class="cf-field" data-validate><label for="f-phone">Phone <b>*</b></label><div class="cf-tel"><select name="cc" aria-label="Country code">${CCODES.map(([v, l]) => `<option value="${v}">${l}</option>`).join("")}</select><input id="f-phone" name="phone" type="tel" required autocomplete="tel-national" inputmode="tel" placeholder="98765 43210"></div><span class="cf-err">Please enter a valid phone number.</span></div>
          <div class="cf-field"><label for="f-size">Employees</label><select id="f-size" name="size"><option value="">Select size</option>${["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map((v) => `<option>${v}</option>`).join("")}</select></div>
          <div class="cf-field"><label for="f-industry">Industry</label><select id="f-industry" name="industry"><option value="">Select industry</option>${INDS.map((i) => `<option>${esc(i.name)}</option>`).join("")}<option>Other</option></select></div>
          <div class="cf-field"><label for="f-date">Preferred date</label><input id="f-date" name="demo_date" type="date"></div>
          <div class="cf-field"><span class="cf-lbl">Preferred time</span><div class="cf-topics" role="radiogroup" aria-label="Preferred time">${["Morning", "Afternoon", "Evening"].map((v, i) => `<label><input type="radio" name="slot" value="${v}"${i === 0 ? " checked" : ""}><span>${v}</span></label>`).join("")}</div></div>
          <div class="cf-field cf-field--full"><span class="cf-lbl">What would you like to see? (optional)</span><div class="cf-topics">${modules.map((mm) => `<label><input type="checkbox" name="modules" value="${mm.slug}"><span>${esc(mm.name)}</span></label>`).join("")}</div></div>
          <div class="cf-field cf-field--full"><label for="f-msg">Anything we should prepare? (optional)</label><textarea id="f-msg" name="message" placeholder="Locations, current HR software, special workflows…"></textarea></div>
          <div style="position:absolute;left:-9999px" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
        </div>
        <div class="form-error" id="form-error" role="alert" tabindex="-1" hidden></div>
        <button class="cf__send" type="submit"><span data-submit-label>Book my demo</span>${icon("send", "ic")}</button>
        <p class="cf__hint" id="form-note">By submitting, you agree to our <a href="/privacy/">Privacy Policy</a>.</p>
      </form>
      <div class="cf-ok" id="form-success" role="status" aria-live="polite">
        <span class="cf-ok__i">${icon("check", "ic")}</span>
        <h2>You're all set! 🎉</h2>
        <p id="success-msg">An HR specialist will reach out within 1 business day. We've also sent a confirmation to your email.</p>
        <div class="cf-ok__a"><a class="cf__send" id="wa-followup" href="${site.whatsapp}" target="_blank" rel="noopener">Message us on WhatsApp${icon("message", "ic")}</a><a class="cf__alt" href="/">Back to home</a></div>
      </div>
    </div>
    ${cfSide("R", "")}
  </div>
</section>
<section class="cfr" aria-label="More ways to reach us"><div class="cfr__grid"><div class="cf__agenda"><p>Your 30 minutes</p><ol>${AGENDA.map(([tm, tx], i) => `<li style="--i:${i}"><b>${tm}</b><span>${esc(tx)}</span></li>`).join("")}</ol></div>
      <div class="cf__incl"><p>Included on every plan</p><ul><li>${icon("check", "ic")}Free onboarding & data migration</li><li>${icon("check", "ic")}Admin & employee training</li><li>${icon("check", "ic")}No credit card to start</li></ul></div>
      <a class="cf__line cf__line--call" href="${site.phoneHref}"><i>${icon("phone", "ic")}</i><span><small>Call us</small><b>${site.phone}</b></span>${icon("arrow", "ic")}</a>
      <a class="cf__line cf__line--wa" href="${site.whatsapp}" target="_blank" rel="noopener"><i>${icon("message", "ic")}</i><span><small>Chat with us</small><b>WhatsApp</b></span>${icon("arrow", "ic")}</a></div></section>
<script src="/assets/js/form.js?v=${V}" defer></script>`;
}

export function demoModulePage(ldExtra = "") {
  const m = {
    slug: "book-demo", name: "Book a demo", icon: "play", tagline: "See SublimeHR live.",
    summary: "A personalized 30-minute walkthrough with your policies, your shifts and your questions.",
    features: ["Your goals and current process", "A live tour for your team", "Pricing and rollout plan", "Your questions, answered"], benefits: ["30 minutes", "Built around your policies", "No credit card to start"], useCases: [],
    _cta: `<a class="btn btn--on btn--lg" href="#try">Book my demo</a><a class="link" href="/get-pricing/">Get pricing</a>`,
    _hero: { who: ["30", "Your 30 minutes", "Tailored to your team"], cast: [["Priya", "HR partner"], ["Aisha", "Demo host"], ["Omar", "Product"]], chips: [["clock", "30-minute walkthrough"], ["check", "No credit card"], ["users", "Built around your team"]] }
  };
  return modulePage(m, [], ldExtra, {
    path: "/book-demo/", title: "Book a Demo — See SublimeHR Live | SublimeHR",
    description: "Book a free 30-minute SublimeHR demo tailored to your workforce: attendance, leave, payroll and self-service.",
    menu: [["try", "play", "Book my demo"]],
    noHero: true, main: () => `${demoBookSection()}`
  });
}


/* ================= the get pricing page: the original content and form, in the new design ================= */
function quoteSection() {
  const sel = (id, name, label, opts, ph, req) => `<div class="cf-field"${req ? " data-validate" : ""}><label for="${id}">${label}${req ? " <b>*</b>" : ""}</label><select id="${id}" name="${name}"${req ? " required" : ""}><option value="">${ph}</option>${opts.map((v) => `<option>${esc(v)}</option>`).join("")}</select>${req ? `<span class="cf-err">Please choose your team size.</span>` : ""}</div>`;
  return `<section class="ctc" id="try" aria-label="Get pricing">
  <div class="cfh"><span class="cfh__b cfh__b--1" aria-hidden="true"></span><span class="cfh__b cfh__b--2" aria-hidden="true"></span><i class="cfh__d cfh__d--l" aria-hidden="true">${icon("wallet", "ic")}</i><i class="cfh__d cfh__d--r" aria-hidden="true">${icon("check", "ic")}</i><h1>Get a quote for <span class="cfh__sq">your team.</span></h1><p>Tell us your team size and the modules you need, we'll send a clear, all-inclusive quote.</p><div class="cfh__chips"><span><i>${icon("check", "ic")}</i>No commitment</span><span><i>${icon("lock", "ic")}</i>No spam</span><span><i>${icon("clock", "ic")}</i>Takes a minute</span></div></div>
  <div class="cf__wrap">
    ${cfSide("L", "Let's get you a quote!")}
    <div class="cf-card">
      <form id="contact-form" novalidate data-endpoint="${site.formEndpoint}" aria-describedby="form-note">
        <input type="hidden" name="intent" value="request_quote">
        <h2>Request your quote</h2><p class="cf__sub">Takes about a minute. No commitment, no spam.</p>
        <div class="cf__fields">
          <div class="cf-field" data-validate><label for="f-name">Your name <b>*</b></label><input id="f-name" name="name" required autocomplete="name" placeholder="Full name"><span class="cf-err">Please enter your name.</span></div>
          <div class="cf-field" data-validate><label for="f-company">Company <b>*</b></label><input id="f-company" name="company" required autocomplete="organization" placeholder="Company name"><span class="cf-err">Please enter your company.</span></div>
          <div class="cf-field" data-validate><label for="f-email">Work email <b>*</b></label><input id="f-email" name="email" type="email" required autocomplete="email" placeholder="you@company.com"><span class="cf-err">Please enter a valid email.</span></div>
          <div class="cf-field" data-validate><label for="f-phone">Phone <b>*</b></label><div class="cf-tel"><select name="cc" aria-label="Country code">${CCODES.map(([v, l]) => `<option value="${v}">${l}</option>`).join("")}</select><input id="f-phone" name="phone" type="tel" required autocomplete="tel-national" inputmode="tel" placeholder="98765 43210"></div><span class="cf-err">Please enter a valid phone number.</span></div>
          ${sel("f-size", "size", "Employees", ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"], "Select size", true)}
          <div class="cf-field"><label for="f-industry">Industry</label><select id="f-industry" name="industry"><option value="">Select industry</option>${INDS.map((i) => `<option>${esc(i.name)}</option>`).join("")}<option>Other</option></select></div>
          <div class="cf-field cf-field--full"><span class="cf-lbl">Plan you're considering</span><div class="cf-plans" role="radiogroup" aria-label="Plan">${plans.map((pl, i) => `<label><input type="radio" name="plan" value="${esc(pl.name)}"${i === 1 ? " checked" : ""}><span><b>${esc(pl.name)}</b><small>${["$4/user", "$8/user", "Custom"][i]}</small></span></label>`).join("")}</div></div>
          <div class="cf-field cf-field--full"><span class="cf-lbl">Modules you need</span><div class="cf-topics">${modules.map((mm) => `<label><input type="checkbox" name="modules" value="${mm.slug}"><span>${esc(mm.name)}</span></label>`).join("")}</div></div>
          <div class="cf-field cf-field--full"><label for="f-custom">Customization needed?</label><select id="f-custom" name="customization"><option value="">Select</option>${["No", "Minor changes", "Significant customization", "Not sure yet"].map((v) => `<option>${v}</option>`).join("")}</select></div>
          <div class="cf-field cf-field--full"><label for="f-msg">Anything else for the quote? (optional)</label><textarea id="f-msg" name="message" placeholder="Branches, billing currency, integrations…"></textarea></div>
          <div style="position:absolute;left:-9999px" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
        </div>
        <div class="form-error" id="form-error" role="alert" tabindex="-1" hidden></div>
        <button class="cf__send" type="submit"><span data-submit-label>Get my quote</span>${icon("send", "ic")}</button>
        <p class="cf__hint" id="form-note">By submitting, you agree to our <a href="/privacy/">Privacy Policy</a>.</p>
      </form>
      <div class="cf-ok" id="form-success" role="status" aria-live="polite">
        <span class="cf-ok__i">${icon("check", "ic")}</span>
        <h2>You're all set! 🎉</h2>
        <p id="success-msg">An HR specialist will reach out within 1 business day. We've also sent a confirmation to your email.</p>
        <div class="cf-ok__a"><a class="cf__send" id="wa-followup" href="${site.whatsapp}" target="_blank" rel="noopener">Message us on WhatsApp${icon("message", "ic")}</a><a class="cf__alt" href="/">Back to home</a></div>
      </div>
    </div>
    ${cfSide("R", "")}
  </div>
</section>
<section class="cfr" aria-label="More ways to reach us"><div class="cfr__grid"><div class="cf__agenda"><p>Plans at a glance</p><div class="cf__plans">${plans.map((pl) => `<span><b>${esc(pl.name)}</b><small>${esc(pl.price)} ${esc(pl.unit)}</small></span>`).join("")}</div><a class="cf__cmp" href="/pricing/">Compare plans ${icon("arrow", "ic")}</a></div>
      <div class="cf__incl"><p>Every quote includes</p><ul><li>${icon("check", "ic")}Pay only for active employees</li><li>${icon("check", "ic")}Free onboarding & data migration</li><li>${icon("check", "ic")}Monthly or annual billing</li></ul></div>
      <a class="cf__line cf__line--call" href="${site.phoneHref}"><i>${icon("phone", "ic")}</i><span><small>Call us</small><b>${site.phone}</b></span>${icon("arrow", "ic")}</a>
      <a class="cf__line cf__line--wa" href="${site.whatsapp}" target="_blank" rel="noopener"><i>${icon("message", "ic")}</i><span><small>Chat with us</small><b>WhatsApp</b></span>${icon("arrow", "ic")}</a></div></section>
<script src="/assets/js/form.js?v=${V}" defer></script>`;
}

export function quoteModulePage(ldExtra = "") {
  const m = {
    slug: "get-pricing", name: "Get pricing", icon: "wallet", tagline: "Get a quote for your team.",
    summary: "Tell us your team size and the modules you need. We'll send a clear, all-inclusive quote.",
    features: ["Starter, $4 per user", "Professional, $8 per user", "Enterprise, tailored to you", "Free onboarding and migration"], benefits: ["Pay only for active employees", "Free onboarding and data migration", "Monthly or annual billing"], useCases: [],
    _cta: `<a class="btn btn--on btn--lg" href="#try">Get my quote</a><a class="link" href="/pricing/">Compare plans</a>`,
    _hero: { who: ["$", "Your quote", "A clear, all-inclusive price"], cast: [["Karan", "Finance"], ["Priya", "HR partner"], ["Sara", "Founder"]], chips: [["check", "No commitment"], ["lock", "No spam"], ["clock", "Takes a minute"]] }
  };
  return modulePage(m, [], ldExtra, {
    path: "/get-pricing/", title: "Get Pricing — Request a SublimeHR Quote | SublimeHR",
    description: "Request a SublimeHR quote for your team size and modules. Pay only for active employees, with free onboarding and migration.",
    menu: [["try", "wallet", "Get my quote"]],
    noHero: true, main: () => `${quoteSection()}`
  });
}


/* ================= the features hub: the original content, in the new design ================= */
function modGrid(title, lead) {
  return `<section class="mods" id="try" aria-labelledby="h-mods" data-tip="Ten modules, one employee record.">
  <div class="mods__head"><h2 id="h-mods">${esc(title)}</h2><p class="mods__lead">${esc(lead)}</p></div>
  <div class="mods__grid">${modules.map((r, i) => `<a class="md md--${i % 5}" href="#${r.slug}"><i class="md__ic">${icon(r.icon, "ic")}</i><b>${r.name}</b><span>${r.short}</span><p class="md__d">${r.summary}</p><ul>${r.features.slice(0, 3).map((f) => `<li>${f}</li>`).join("")}</ul><em class="md__go">Read more</em></a>`).join("")}</div>
</section>`;
}
function featRows() {
  return `<section class="frows" aria-labelledby="h-fr" data-tip="Everything each module does.">
  <div class="frows__head"><h2 id="h-fr">What each module does.</h2></div>
  ${modules.map((m, i) => `<article class="frow frow--${i % 5}" id="${m.slug}">
    <div class="frow__ic"><i>${icon(m.icon, "ic")}</i></div>
    <div class="frow__main"><h3>${esc(m.name)}</h3><p class="frow__tag">${esc(m.tagline)}</p><p>${esc(m.summary)}</p>
      <ul class="frow__ben">${m.benefits.map((b) => `<li>${icon("check", "ic")}${esc(b)}</li>`).join("")}</ul></div>
    <div class="frow__feat"><b>Includes</b><ul>${m.features.slice(0, 5).map((f) => `<li>${esc(f)}</li>`).join("")}</ul><a class="frow__go" href="/software/${m.slug}/">Try the live demo ${icon("arrow", "ic")}</a></div>
  </article>`).join("")}
</section>`;
}
function featReports() {
  return `<section class="frep" id="reports" aria-labelledby="h-rep" data-tip="Thirteen reports, ready on day one.">
  <div class="frows__head"><h2 id="h-rep">13 report types, ready on day one.</h2></div>
  <div class="frep__grid">${REPS.map(([r, p], i) => `<div class="frep__c"><i>${i + 1}</i><b>${esc(r)}</b><span>${esc(p)}</span></div>`).join("")}</div>
</section>`;
}
export function featuresModulePage(ldExtra = "") {
  const m = {
    slug: "features", name: "Features", icon: "layers", tagline: "Ten modules. One record.",
    summary: "Every module shares the same employee data, so nothing is entered twice. Each one has a live demo you can try.",
    features: modules.map((x) => x.name), benefits: ["One employee record behind every module", "A live demo for each module", "Add modules as you grow"], useCases: [],
    _hero: { who: ["10", "10 modules", "One employee record"], cast: [["Priya", "HR partner"], ["Karan", "Finance"], ["Aisha", "Developer"]], chips: [["users", "One record"], ["clock", "Live attendance"], ["wallet", "Payroll"]] }
  };
  return modulePage(m, [], ldExtra, {
    path: "/features/", title: "HR Software Features — Attendance, Leave, Payroll & More | SublimeHR",
    description: "All SublimeHR modules with live demos: employee management, attendance, leave, payroll, reports, self-service, mobile, security, shift scheduling and visitor management.",
    menu: [["try", "layers", "Browse the modules"]],
    main: (mm) => `${hero(mm)}
${modGrid("Ten modules, one record.", "Pick a module to see what it does.")}
${featRows()}
${featReports()}
${closeBand({ title: "Have a workflow we don't cover yet?", lead: "We build custom modules, approvals and integrations that fit, not force, your process.", say: "Let's build it!", card: "Talk to us", links: [["Explore custom development", "/custom-development/"], ["Talk to our team", "/contact/", true]], small: "We reply within one business day." })}`
  });
}
