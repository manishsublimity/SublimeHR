// The live demo of each module page. Every demo plays by itself and stops when the visitor takes over (see mod3.js).
import { icon } from "./icons.mjs";
import { who, people } from "./cast.mjs";

const byName = Object.fromEntries(people.map((p) => [p.n, p]));
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const head = (d) => `<div class="mdemo__head"><h2 id="h-try">${esc(d.title)}</h2><p>${esc(d.lead)}</p></div>`;
const wrap = (d, type, inner, extra = "") => `<section class="mdemo" id="try" aria-labelledby="h-try" data-tip="This demo plays by itself. Take over any time.">${head(d)}<div class="dmx cast" data-dm="${type}"${extra}>${inner}</div></section>`;

const punch = (d) => wrap(d, "punch", `
  <div class="dmx__l">
    <article class="lc lc--clock mlc">
      <div class="modes" role="radiogroup" aria-label="Punch method"><button type="button" role="radio" aria-checked="true" data-mode="fp">Fingerprint</button><button type="button" role="radio" aria-checked="false" data-mode="selfie">Selfie</button><button type="button" role="radio" aria-checked="false" data-mode="gps">GPS only</button></div>
      <div class="clk">
        <div class="clk__l">
          <button class="scanner" type="button" data-scan data-m="fp" aria-label="Press to clock in">
            <span class="sc sc--fp">${icon("fingerprint", "ic")}<i class="thumb"></i></span>
            <span class="sc sc--selfie"><img class="scanner__img" data-scan-img alt="" hidden><i class="silh"></i><i class="crn"></i><b class="cnt" data-cnt></b><i class="flash"></i></span>
            <span class="sc sc--gps"><i class="grid"></i><i class="gfence"></i><i class="radar"></i><i class="pin" data-pin></i></span>
            <i class="scanner__beam"></i>
          </button>
          <span class="scanner__lbl" data-scan-lbl>Press to clock in</span>
          <div class="clk__acts"><button type="button" class="mini-link" data-sample hidden>Use a sample face</button></div>
        </div>
        <div class="clk__r">
          <ul class="checks" data-checks><li><span data-c0>Fingerprint matched</span><i>${icon("check", "ic")}</i></li><li><span data-c1>GPS 12 m, inside Head Office</span><i>${icon("check", "ic")}</i></li><li><span data-status>Waiting</span><i>${icon("check", "ic")}</i></li></ul>
          <label class="geo"><span>I am at the office</span><button class="sw" type="button" role="switch" aria-checked="true" data-geo aria-label="I am at the office"></button></label>
          <div class="arr"><label for="arr-${d.type}">Arrival</label><b data-arr-out>08:52</b><input id="arr-${d.type}" type="range" min="510" max="600" value="532" data-arr aria-label="Arrival time"></div>
          <p class="note">Shift starts 09:00. Grace until 09:15.</p>
        </div>
      </div>
      <div class="hist"><small>This week</small><ul><li><span>Mon</span><b>08:49</b><em class="ok">On time</em></li><li><span>Tue</span><b>09:07</b><em class="gr">Grace</em></li><li><span>Wed</span><b>08:52</b><em class="ok">On time</em></li><li data-today><span>Today</span><b>--:--</b><em>Waiting</em></li></ul></div>
    </article>
  </div>
  <div class="dmx__r">
    <div class="dmx__boardhead"><b>Live board</b><span class="dmx__live">${icon("check", "ic")}Head Office</span></div>
    <div class="dmx__stats"><span><b data-n="in">38</b>in today</span><span><b data-n="late">2</b>late</span><span><b data-n="out">0</b>rejected</span></div>
    <ul class="dmx__feed" data-feed></ul>
  </div>
  <div class="dmx__who" aria-hidden="true"><span class="dmx__say" data-dsay>Good morning!</span><div class="dmx__ppl">${who(byName["Aisha"], 1, "ppl--wave")}</div></div>`);

const leave = (d) => wrap(d, "leave", `
  <div class="dmx__l dmx__lcal">
    <div class="dmx__calhead"><b>April</b><span><i class="we"></i>Weekend<i class="ho"></i>Holiday<i class="sel"></i>Your leave</span></div>
    <div class="dmx__cal" data-cal></div>
  </div>
  <div class="dmx__r dmx__lv">
    <div class="dmx__types" role="group" aria-label="Leave type">
      <button type="button" data-k="Annual" aria-pressed="true"><small>Annual</small><b data-lb>14</b><span>days left</span><u><i data-lbar></i></u></button>
      <button type="button" data-k="Sick" aria-pressed="false"><small>Sick</small><b data-lb>6</b><span>days left</span><u><i data-lbar></i></u></button>
      <button type="button" data-k="Comp-off" aria-pressed="false"><small>Comp-off</small><b data-lb>2</b><span>days left</span><u><i data-lbar></i></u></button>
    </div>
    <div class="dmx__sum">
      <div><small data-s-type>Annual leave</small><b data-s-dates>No dates yet</b></div>
      <div class="dmx__nums"><span><b data-s-days>0</b>working days</span><span><b data-s-after>14</b>left after</span></div>
      <div class="dmx__sbar"><i data-sbar></i></div>
    </div>
    <ol class="dmx__chain" aria-label="Approval flow">
      <li data-ch><i>${icon("send", "ic")}</i><b>Sent</b><small>You</small></li>
      <li data-ch><i>${icon("check", "ic")}</i><b>Approved</b><small>Priya, manager</small></li>
      <li data-ch><i>${icon("wallet", "ic")}</i><b>Synced</b><small>Payroll and calendar</small></li>
    </ol>
    <div class="dmx__away"><small>Also away this month</small><ul><li><i>OM</i><span>Omar<em>3 to 4 Apr</em></span></li><li><i>RA</i><span>Ravi<em>14 Apr</em></span></li><li><i>NA</i><span>Nadia<em>28 to 29 Apr</em></span></li></ul></div>
    <div class="dmx__sendrow"><p class="dmx__msg" data-lmsg>Pick a start and an end date.</p><button class="dmx__send dmx__send--s" type="button" data-apply>Send request ${icon("send", "ic")}</button></div>
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
