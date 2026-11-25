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
          <ul>${rows.map((f, i) => `<li data-row="${i}"><i>${icon("check", "ic")}</i><span>${esc(f)}</span></li>`).join("")}</ul>
          <div class="mwin__bar"><i data-bar></i></div>
        </div>
        <div class="deco" aria-hidden="true"><div class="sticky s1"><b>${esc((m.benefits[0] || "").split(" ").slice(0, 3).join(" "))}</b><i></i></div></div>
        ${cast.map(([n, r, x, y, s], i) => slot(n, i, x, y, s, i === 1 ? "ppl--wave" : "")).join("")}
        ${cast.map(([n, r, x, y, s]) => tagx(n, r, 0, x, y, s)).join("")}
      </div>
    </div>
  </div>
</section>`;
}

/* a full-width demo that plays by itself */
function letterDemo() {
  return `<section class="mdemo" id="try" aria-labelledby="h-try" data-tip="This letter writes itself. Take over any time.">
  <div class="mdemo__head"><h2 id="h-try">An offer letter, written while you watch.</h2><p>Pick a person and the letter fills in from their record. It then goes out for e-signature. Nobody types it twice.</p></div>
  <div class="mdemo__grid" data-letter>
    <div class="mform">
      <div class="mform__tabs" data-tpl role="group" aria-label="Letter type"><button type="button" data-t="offer" aria-pressed="true">Offer letter</button><button type="button" data-t="exp" aria-pressed="false">Experience</button><button type="button" data-t="warn" aria-pressed="false">Warning</button></div>
      <label>Employee name<input data-in="name" value="Sara Nasser" maxlength="40" autocomplete="off"></label>
      <label>Position<select data-in="pos"><option>Senior Accountant</option><option>HR Executive</option><option>Plant Supervisor</option><option>Staff Nurse</option></select></label>
      <div class="mform__two"><label>Monthly salary<input data-in="sal" type="number" value="5200" step="100"></label><label>Effective date<input data-in="date" type="date" value="2026-05-04"></label></div>
      <button class="mform__send" type="button" data-send>Send for e-signature ${icon("send", "ic")}</button>
    </div>
    <div class="mpaper" aria-live="polite">
      <div class="mpaper__head"><span><img src="${site.logo}" alt="" width="22" height="20">ACME INDUSTRIES · HR</span><em>REF-2026-0142</em></div>
      <div class="mpaper__body"><h3 data-title>Offer of employment</h3><div data-body></div><p class="mpaper__sig">— People Team</p><span class="mpaper__stamp">SENT ✓</span></div>
      <div class="mpaper__toast" data-toast>${icon("check", "ic")}<span>Sent for e-signature</span></div>
    </div>
    <div class="mdemo__who cast" aria-hidden="true">${who(byName["Priya"], 1, "ppl--wave")}<span class="mdemo__say" data-dsay>Writing the letter…</span></div>
  </div>
</section>`;
}

function before(m) {
  const pains = ["Spreadsheets & paper forms", "Manual re-keying between systems", "The same HR questions, every day"];
  return `<section class="mba" aria-labelledby="h-ba" data-mba data-state="before" data-tip="Tap the switch. The same office, before and after.">
  <div class="mba__head"><h2 id="h-ba">What changes for your HR team.</h2>
    <div class="mba__tabs" role="group" aria-label="Before and after"><button type="button" data-s="before" aria-pressed="true">Before</button><button type="button" data-s="after" aria-pressed="false">With SublimeHR</button><i aria-hidden="true"></i></div></div>
  <div class="mba__stage">
    <div class="mba__card">
      <div class="mba__pane is-b"><small>The old way</small><p>${esc(m.problem)}</p><ul>${pains.map((x) => `<li>${icon("close", "ic")}${x}</li>`).join("")}</ul></div>
      <div class="mba__pane is-a"><small>With SublimeHR</small><p>${esc(m.solution)}</p><ul>${m.benefits.slice(0, 3).map((x) => `<li>${icon("check", "ic")}${esc(x)}</li>`).join("")}</ul></div>
    </div>
    <div class="mba__who cast" aria-hidden="true">
      <span class="mba__say"><b class="b">Where is that file again?</b><b class="a">Found it. One click.</b></span>
      <span class="bnote bn-0">Final_v7.xlsx</span><span class="bnote bn-1">Who has the form?</span><span class="bnote bn-2">Re-type it</span>
      ${who(byName["Priya"], 3)}
      <span class="mba__bot"><span class="s-head"><span class="s-scr"><b></b><b></b></span></span><em>Subi HR: I'll take it from here.</em></span>
      <span class="mba__floor"></span>
    </div>
  </div>
</section>`;
}

function caps(m) {
  const ex = EXTRA[m.slug]?.caps;
  const list = m.features.map((f, i) => ex ? ex[i] || [f, "", "tablet", "point"] : [f, "", "tablet", "point"]);
  return `<section class="mcap" aria-labelledby="h-cap" data-mcap data-tip="One capability at a time. Hover any tile to jump to it.">
  <div class="mcap__head"><h2 id="h-cap">${m.features.length} things it does for you.</h2><p>Configured to your policies. No code, no add-ons.</p></div>
  <div class="mcap__grid">
    <div class="mcap__stage cast">
      <span class="mcap__ring"></span><span class="mcap__ring r2"></span>
      <div class="mcap__card" data-card><i data-ic></i><b data-t>${esc(list[0][0])}</b><p data-d>${esc(list[0][1])}</p></div>
      ${who(byName["Aisha"], 4, "")}
      <span class="mcap__floor"></span>
    </div>
    <ul class="mcap__list">${list.map(([t, d, item, pose], i) => `<li data-i="${i}" data-it="${item}" data-ps="${pose}" data-d="${esc(d)}"${i === 0 ? ' class="on"' : ""}><span class="mck">${icon("check", "ic")}</span><span>${esc(t)}</span></li>`).join("")}</ul>
  </div>
</section>`;
}

function peek(m) {
  const items = EXTRA[m.slug]?.peeks || m.useCases.map((u, i) => [u, m.features[(i * 3 + 1) % m.features.length], m.name, ["sun", "lilac", "mint"][i]]);
  return `<section class="peek" aria-labelledby="h-peek" data-tip="Flip a card. The curious ones learn the most.">
  <div class="peek__head"><h2 id="h-peek">Things you didn't know ${esc(m.name.toLowerCase())} could do.</h2><p>Each of these is a question your team asks. Turn a card over for the answer.</p></div>
  <div class="peek__grid">${items.map(([q, a, d, c], i) => `<button class="pk pk--${c} pk--${i + 1}" type="button" aria-pressed="false"><span class="pk__in"><span class="pk__f"><span class="pk__q">${esc(q)}</span><i class="pk__m" aria-hidden="true">?</i></span><span class="pk__b"><span class="pk__a">${esc(a)}</span><span class="pk__d">${esc(d)}</span></span></span></button>`).join("")}</div>
</section>`;
}

function mods(m) {
  const idx = modules.indexOf(m), rel = [1, 2, 3, 4, 5].map((k) => modules[(idx + k) % modules.length]);
  return `<section class="mods" aria-labelledby="h-mods" data-tip="Works better together.">
  <div class="mods__head"><h2 id="h-mods">Works better together.</h2><a class="link link--ink" href="/features/">See all features</a></div>
  <div class="mods__grid">${rel.map((r, i) => `<a class="md md--${i % 5}" href="/software/${r.slug}/"><i class="md__ic">${icon(r.icon, "ic")}</i><b>${r.name}</b><span>${r.short}</span><ul>${r.features.slice(0, 3).map((f) => `<li>${f}</li>`).join("")}</ul></a>`).join("")}</div>
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
  return `<section class="meet" aria-labelledby="h-meet" data-tip="Ready? Book a walkthrough.">
  <div class="meet__wrap">
    <div class="meet__in">
      <h2 id="h-meet">See ${esc(m.name)} with your own data.</h2>
      <p>A 30-minute walkthrough, built around how your industry really works.</p>
      <ul class="meet__pts"><li>${icon("check", "ic")}Free, no commitment</li><li>${icon("check", "ic")}Built around your industry</li><li>${icon("check", "ic")}Live in days</li></ul>
      <div class="hero__cta"><a class="btn btn--on btn--lg" href="/book-demo/?module=${m.slug}">Book a free demo</a><a class="link" href="/pricing/">See pricing</a></div>
      <p class="meet__alt">Different industry? <a class="link" href="/contact/">Tell us how your team works</a>.</p>
    </div>
    <div class="crowd" aria-hidden="true"><i class="crowd__floor"></i>
      <span class="pop pop1">${icon("check", "ic")}Leave approved</span><span class="pop pop2">${icon("wallet", "ic")}412 payslips sent</span><span class="pop pop3">${icon("clock", "ic")}98% on time</span>
      ${people.map((p, i) => `<div class="crowd__p" style="--i:${i};--cx:${[4, 15, 27, 61, 73, 38, 50][i]}%;--cy:${[0, 78, 0, 78, 0, 78, 0][i]}px;--cs:${[1.2, 1, 1.2, 1, 1.2, 1, 1.2][i]};--cz:${[2, 1, 2, 1, 2, 1, 2][i]}">${who(p, i, "ppl--wave")}</div>`).join("")}</div>
  </div>
</section>`;
}

export function modulePage(m, faqItems, ldExtra = "") {
  const path = `/software/${m.slug}/`;
  const description = `${m.summary} Try a live demo of SublimeHR ${m.name.toLowerCase()}.`.slice(0, 300);
  return `${head(m, path, description)}
<body class="lo mpage" data-w="it">
<script>try{var w=localStorage.getItem("shr-world");if(w)document.body.setAttribute("data-w",w)}catch(e){}</script>
<script type="application/json" id="mod-story">${JSON.stringify([m.benefits[0], m.benefits[1], m.benefits[2], m.features[3] || m.features[0]].filter(Boolean)).replace(/</g, "\u003c")}</script>
<script type="application/json" id="mod-data">${JSON.stringify({ faq: faqItems.map(([q, a]) => [q, a]) }).replace(/</g, "\\u003c")}</script>
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
${peek(m)}
${mods(m)}
${ask(m)}
${meet(m)}
</main>
${homeFooter()}
${themeFab()}
<button class="topbtn" type="button" data-top aria-label="Back to top">${icon("arrow-up", "ic")}</button>
${ldExtra}
<script src="/assets/js/mod2.js?v=${V}" defer></script>
<script src="/assets/js/navmenu.js?v=${V}" defer></script>
</body>
</html>
`;
}
