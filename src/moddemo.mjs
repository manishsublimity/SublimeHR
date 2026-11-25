// The live demo of each module page. Every demo plays by itself and stops when the visitor takes over (see mod3.js).
import { icon } from "./icons.mjs";
import { who, people } from "./cast.mjs";

const byName = Object.fromEntries(people.map((p) => [p.n, p]));
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const head = (d) => `<div class="mdemo__head"><h2 id="h-try">${esc(d.title)}</h2><p>${esc(d.lead)}</p></div>`;
const wrap = (d, type, inner, extra = "") => `<section class="mdemo" id="try" aria-labelledby="h-try" data-tip="This demo plays by itself. Take over any time.">${head(d)}<div class="dmx cast" data-dm="${type}"${extra}>${inner}</div></section>`;

const punch = (d) => wrap(d, "punch", `
  <div class="dmx__l">
    <div class="dmx__pills" data-pills role="group" aria-label="Punch method"><button type="button" data-k="Fingerprint" aria-pressed="true">Fingerprint</button><button type="button" data-k="Selfie" aria-pressed="false">Selfie</button><button type="button" data-k="Camera + GPS" aria-pressed="false">Camera + GPS</button></div>
    <button class="dmx__big" type="button" data-punch><span class="dmx__ring"></span><span>${icon("fingerprint", "ic")}</span><b data-pl>Clock in</b></button>
    <p class="dmx__hint" data-phint>Fingerprint matched. Head Office.</p>
  </div>
  <div class="dmx__r">
    <div class="dmx__stats"><span><b data-n="in">38</b>in today</span><span><b data-n="late">2</b>late</span><span><b data-n="out">0</b>pending</span></div>
    <ul class="dmx__feed" data-feed></ul>
  </div>
  <div class="dmx__who" aria-hidden="true"><span class="dmx__say" data-dsay>Good morning!</span><div class="dmx__ppl">${who(byName["Aisha"], 1, "ppl--wave")}</div></div>`);

const leave = (d) => wrap(d, "leave", `
  <div class="dmx__l">
    <div class="dmx__pills" data-pills role="group" aria-label="Leave type"><button type="button" data-k="Annual" data-b="14" aria-pressed="true">Annual</button><button type="button" data-k="Sick" data-b="6" aria-pressed="false">Sick</button><button type="button" data-k="Comp-off" data-b="2" aria-pressed="false">Comp-off</button></div>
    <div class="dmx__cal" data-cal></div>
  </div>
  <div class="dmx__r dmx__bal">
    <div class="dmx__balance"><b data-bal>14</b><span>days left</span><div class="bar"><i data-bar></i></div></div>
    <p class="dmx__msg" data-lmsg>Pick a start and an end date.</p>
    <button class="dmx__send" type="button" data-apply>Send request ${icon("send", "ic")}</button>
    <div class="dmx__stamp" data-stamp>APPROVED ✓</div>
  </div>
  <div class="dmx__who" aria-hidden="true"><span class="dmx__say" data-dsay>Planning a trip?</span><div class="dmx__ppl">${who(byName["Sara"], 1, "ppl--wave")}</div></div>`);

const payroll = (d) => wrap(d, "payroll", `
  <div class="dmx__l dmx__sliders">
    <label>Basic salary <output data-o="0"></output><input type="range" data-s="0" min="2000" max="9000" step="100" value="4200"></label>
    <label>Overtime hours <output data-o="1"></output><input type="range" data-s="1" min="0" max="30" step="1" value="6"></label>
    <label>Unpaid leave days <output data-o="2"></output><input type="range" data-s="2" min="0" max="6" step="1" value="1"></label>
    <p class="dmx__hint">Allowances are 25% of basic. Overtime is paid at 1.25 times.</p>
  </div>
  <div class="dmx__r dmx__slip">
    <div class="dmx__sliphead"><span>${icon("wallet", "ic")}</span><div><b>Salary slip, April</b><small>Aisha Khan · EMP-0142</small></div></div>
    <ul data-lines></ul>
    <div class="dmx__net"><span>Net pay</span><b data-net>0</b></div>
    <div class="dmx__split" data-split><i></i><i></i><i></i></div>
  </div>
  <div class="dmx__who" aria-hidden="true"><span class="dmx__say" data-dsay>Let me check my slip.</span><div class="dmx__ppl">${who(byName["Aisha"], 1, "")}</div></div>`);

const chart = (d) => wrap(d, "chart", `
  <div class="dmx__l dmx__chartbox">
    <div class="dmx__pills" data-pills role="group" aria-label="Question"><button type="button" data-k="0" aria-pressed="true">Who is late?</button><button type="button" data-k="1" aria-pressed="false">Attendance this month</button><button type="button" data-k="2" aria-pressed="false">What does payroll cost?</button></div>
    <div class="dmx__chart" data-chart></div>
    <div class="dmx__axis" data-axis></div>
  </div>
  <div class="dmx__r dmx__insight">
    <b data-ititle>Late arrivals by weekday</b>
    <p data-itext>Mondays and Fridays are the worst. Share the report with department heads.</p>
    <div class="dmx__chips" data-ichips></div>
    <span class="dmx__live">${icon("check", "ic")}Live data. Tamper-proof history.</span>
  </div>
  <div class="dmx__who" aria-hidden="true"><span class="dmx__say" data-dsay>What do the numbers say?</span><div class="dmx__ppl">${who(byName["Karan"], 1, "")}</div></div>`);

const phone = (d) => wrap(d, "phone", `
  <div class="dmx__l dmx__steps" data-steps>${d.screens.map((s, i) => `<button type="button" data-st="${i}" aria-pressed="${i === 0}"><i>${i + 1}</i><span>${esc(s.tab)}</span></button>`).join("")}</div>
  <div class="dmx__phone" aria-live="polite"><div class="dmx__notch"></div>
    ${d.screens.map((s, i) => `<div class="dmx__scr${i === 0 ? " on" : ""}" data-sc="${i}"><div class="dmx__app"><span>${icon("bot", "ic")}</span>SublimeHR</div><h3>${esc(s.h)}</h3><ul>${s.rows.map(([a, b]) => `<li><span>${esc(a)}</span><em>${esc(b)}</em></li>`).join("")}</ul><button type="button" class="dmx__cta" data-cta>${esc(s.cta)}</button><p class="dmx__done" data-done>${esc(s.done)}</p></div>`).join("")}
    <span class="dmx__tap" data-tap></span>
  </div>
  <div class="dmx__who" aria-hidden="true"><span class="dmx__say" data-dsay>Tap a step.</span><div class="dmx__ppl">${who(byName["Sara"], 1, "ppl--wave")}</div></div>`, ` data-screens="${esc(JSON.stringify(d.screens.map((s) => s.done)))}"`);

const ROLES = ["Employee", "Manager", "HR", "Admin"], AREAS = ["Attendance", "Leave", "Payroll", "Reports", "Settings"];
const roles = (d) => wrap(d, "roles", `
  <div class="dmx__l dmx__matrix">
    <div class="dmx__pills" data-pills role="group" aria-label="Role">${ROLES.map((r, i) => `<button type="button" data-k="${i}" aria-pressed="${i === 0}">${r}</button>`).join("")}</div>
    <ul class="dmx__perms" data-perms>${AREAS.map((a, i) => `<li data-a="${i}"><span>${a}</span><button type="button" class="sw" role="switch" aria-checked="false" aria-label="${a}"><i></i></button></li>`).join("")}</ul>
  </div>
  <div class="dmx__r dmx__sum"><span class="dmx__badge" data-badge>${icon("lock", "ic")}</span><b data-stitle>Employee</b><p data-stext></p><div class="dmx__chips" data-schips></div></div>
  <div class="dmx__who" aria-hidden="true"><span class="dmx__say" data-dsay>Who can see what?</span><div class="dmx__ppl">${who(byName["Priya"], 1, "")}</div></div>`);

const roster = (d) => wrap(d, "roster", `
  <div class="dmx__l dmx__rosterbox">
    <div class="dmx__legend"><span class="m">M</span>Morning<span class="e">E</span>Evening<span class="n">N</span>Night<span class="o">O</span>Off</div>
    <div class="dmx__grid" data-grid></div>
    <div class="dmx__cover" data-cover></div>
  </div>
  <div class="dmx__r dmx__insight"><b data-ctitle>Coverage is fine</b><p data-ctext>Every day has at least two people on the morning shift.</p><span class="dmx__live">${icon("repeat", "ic")}Linked to attendance and pay.</span></div>
  <div class="dmx__who" aria-hidden="true"><span class="dmx__say" data-dsay>Swap?</span><div class="dmx__ppl">${who(byName["Omar"], 1, "")}</div></div>`);

const visitor = (d) => wrap(d, "visitor", `
  <div class="dmx__l dmx__vform">
    <label>Visitor name<input data-v="name" value="" placeholder="Full name" autocomplete="off"></label>
    <label>Who are they here to see?<select data-v="host"><option>Priya Shah</option><option>Omar Mansour</option><option>Karan Mehta</option></select></label>
    <label>Purpose<select data-v="why"><option>Interview</option><option>Meeting</option><option>Delivery</option><option>Audit</option></select></label>
    <button class="dmx__send" type="button" data-checkin>Check in ${icon("check", "ic")}</button>
  </div>
  <div class="dmx__r dmx__badgebox">
    <div class="dmx__badge2" data-badge2><div class="dmx__bhead"><span>VISITOR</span><em data-btime>09:12</em></div><div class="dmx__bphoto" data-bav>JL</div><b data-bname>Your visitor</b><small data-bhost>Host will be notified</small><div class="dmx__qr"></div></div>
    <ul class="dmx__feed" data-vfeed></ul>
  </div>
  <div class="dmx__who" aria-hidden="true"><span class="dmx__say" data-dsay>Welcome!</span><div class="dmx__ppl">${who(byName["Nadia"], 1, "ppl--wave")}</div></div>`);

export function demoSection(m, d) {
  return ({ punch, leave, payroll, chart, phone, roles, roster, visitor })[d.type](d);
}
