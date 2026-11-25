// The live demo of each module page. Every demo plays by itself and stops when the visitor takes over (see mod3.js).
import { icon } from "./icons.mjs";
import { who, people } from "./cast.mjs";
import { movieSection, daySection } from "./home2.mjs";

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
    <div class="dmx__away"><small>Also away this month</small><ul><li><i>OM</i><span>Omar<em>3 to 4 Apr</em></span></li><li><i>RA</i><span>Ravi<em>14 Apr</em></span></li><li><i>NA</i><span>Nadia<em>28 to 29 Apr</em></span></li></ul></div>
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
    <div class="dmx__run"><div class="dmx__runhead"><b>Payroll run, April</b><span data-runtxt>Step 0 of 4</span></div>
      <ol data-run><li><i>${icon("check", "ic")}</i>Attendance locked</li><li><i>${icon("check", "ic")}</i>Overtime approved</li><li><i>${icon("check", "ic")}</i>Deductions checked</li><li><i>${icon("check", "ic")}</i>Payslips released</li></ol>
      <div class="dmx__runbar"><i data-runbar></i></div></div>
  </div>
  <div class="dmx__r dmx__slip">
    <div class="dmx__sliphead"><span>${icon("wallet", "ic")}</span><div><b>Salary slip, April</b><small>Aisha Khan · EMP-0142</small></div></div>
    <ul data-lines></ul>
    <div class="dmx__net"><span>Net pay</span><b data-net>0</b></div>
    <div class="dmx__split" data-split><i></i><i></i><i></i></div>
    <div class="dmx__legend2"><span><i class="a"></i>Basic</span><span><i class="b"></i>Allowances</span><span><i class="c"></i>Overtime and bonus</span></div>
    <button class="dmx__send dmx__send--s" type="button" data-release>Release payslips ${icon("send", "ic")}</button>
  </div>
  <div class="dmx__who" aria-hidden="true"><span class="dmx__say" data-dsay>Let me check my slip.</span><div class="dmx__ppl">${who(byName["Aisha"], 1, "")}</div></div>`);

const chart = (d) => wrap(d, "chart", `
  <div class="dmx__l dmx__chartbox">
    <div class="dmx__pills" data-pills role="group" aria-label="Question"><button type="button" data-k="0" aria-pressed="true">Who is late?</button><button type="button" data-k="1" aria-pressed="false">Attendance this month</button><button type="button" data-k="2" aria-pressed="false">What does payroll cost?</button></div>
    <div class="dmx__chart" data-chart></div>
    <div class="dmx__axis" data-axis></div>
    <div class="dmx__kpis" data-kpis></div>
  </div>
  <div class="dmx__r dmx__insight">
    <div class="dmx__insighthead"><b data-ititle>Late arrivals by weekday</b><span class="dmx__live">${icon("check", "ic")}Live data</span></div>
    <p data-itext>Mondays and Fridays are the worst. Share the report with department heads.</p>
    <div class="dmx__chips" data-ichips></div>
    <div class="dmx__acts"><small>What do you want to do with it?</small>
      <button type="button" data-act><i>${icon("users", "ic")}</i><span>Share with department heads</span><em>Share</em></button>
      <button type="button" data-act><i>${icon("repeat", "ic")}</i><span>Email it every Monday</span><em>Schedule</em></button>
      <button type="button" data-act><i>${icon("file", "ic")}</i><span>Download as PDF or Excel</span><em>Export</em></button>
    </div>
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

const field = (d) => wrap(d, "field", `
  <div class="dmx__l dmx__map">
    <div class="dmx__mapbox">
      <svg viewBox="0 0 600 290" role="img" aria-label="Ravi's route across three sites">
        <defs><pattern id="fhatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="9" stroke="currentColor" stroke-width="2" opacity=".18"/></pattern></defs>
        <g class="fmap-roads"><path d="M0 210H600M0 70H600M120 0V290M300 0V290M470 0V290"/><path d="M0 150C150 130 300 190 600 120" /></g>
        <g data-zone class="fmap-zone"><ellipse cx="365" cy="160" rx="82" ry="58" fill="url(#fhatch)"/><text x="365" y="228" text-anchor="middle">No signal</text></g>
        <path data-path class="fmap-route" d="M62 232C130 236 150 98 232 90S338 196 380 170 470 62 540 70"/>
        <path data-trail class="fmap-trail" d="M62 232C130 236 150 98 232 90S338 196 380 170 470 62 540 70"/>
        <g data-sites></g>
        <g data-pin class="fmap-pin"><circle class="pulse" r="16"/><circle r="9"/><circle r="3.4" fill="#fff"/></g>
      </svg>
      <span class="dmx__nets" data-net-badge><i></i><i></i><i></i><i></i></span>
    </div>
    <div class="dmx__stops" data-stops role="group" aria-label="Stops of the day">${d.stops.map((s, i) => `<button type="button" data-st="${i}" aria-pressed="${i === 0}"><b>${esc(s[0])}</b><span>${esc(s[1])}</span></button>`).join("")}</div>
  </div>
  <div class="dmx__r dmx__fphone">
    <div class="dmx__fscr"><div class="dmx__fbar"><b>SublimeHR</b><span class="dmx__sig" data-sig><i></i><i></i><i></i><i></i></span></div>
      <h3 data-fh>Clocked in at the depot</h3>
      <ul data-frows></ul>
      <div class="dmx__fcta" data-fcta>Clocked in</div></div>
    <div class="dmx__fcount"><span><b data-km>0</b>km</span><span><b data-vis>0</b>visits</span><span><b data-hrs>0:00</b>worked</span></div>
  </div>
  <div class="dmx__who" aria-hidden="true"><span class="dmx__say" data-dsay>Off to the depot.</span><div class="dmx__ppl">${who(byName["Ravi"], 1, "ppl--wave")}</div></div>`);

const DAY = [["08:45", "Clock in", "Selfie and GPS match, so the day starts on time.", "clock"], ["10:30", "Leave request", "Approved in one tap and the balance updates itself.", "calendar"], ["13:00", "Shift swap", "Two colleagues trade and the rota fixes itself.", "repeat"], ["16:00", "Overtime", "Logged and approved before it is worked.", "alert"], ["18:05", "Clock out", "Hours add up and nobody types anything.", "check"], ["Month end", "Payslip", "One run, and every phone has its payslip.", "wallet"]];
const dial = (d) => wrap(d, "dial", `
  <div class="dmx__l dmx__dialbox">
    <div class="dmx__dial">
      <svg viewBox="0 0 300 300" aria-hidden="true">
        <circle class="ring" cx="150" cy="150" r="112"/>
        <circle class="arc" data-darc cx="150" cy="150" r="112" transform="rotate(-90 150 150)"/>
        ${DAY.map((s, i) => `<circle class="dot" data-ddot="${i}" cx="${(150 + 112 * Math.cos((i * 60 - 90) * Math.PI / 180)).toFixed(1)}" cy="${(150 + 112 * Math.sin((i * 60 - 90) * Math.PI / 180)).toFixed(1)}" r="7"/>`).join("")}
        <g class="spin" data-dpin><g class="pface" data-dface><circle cx="150" cy="38" r="17"/><text x="150" y="42.5" text-anchor="middle">AK</text></g></g>
      </svg>
      <div class="dmx__dialc"><span class="dmx__dicon">${DAY.map((s, i) => `<i data-dic="${i}">${icon(s[3], "ic")}</i>`).join("")}</span><small data-dtime>08:45</small><b data-dtitle>Clock in</b></div>
    </div>
  </div>
  <div class="dmx__r dmx__daylist" data-dlist>${DAY.map((s, i) => `<button type="button" data-di="${i}" aria-pressed="${i === 0}"><em>${esc(s[0])}</em><span><b>${esc(s[1])}</b><small>${esc(s[2])}</small></span></button>`).join("")}</div>
  <div class="dmx__who" aria-hidden="true"><span class="dmx__say" data-dsay>Good morning!</span><div class="dmx__ppl">${who(byName["Aisha"], 1, "ppl--wave")}</div></div>`);

export function demoSection(m, d) {
  if (m.slug === "employee-self-service") return `<div class="cast mhome" id="try">${movieSection()}</div>`;
  if (m.slug === "mobile-workforce") return dial({ title: "One day, from clock-in to payslip.", lead: "Follow Aisha through a working day. Every stop is something your team does today with paper, chat or spreadsheets." });
  return ({ punch, leave, payroll, chart, phone, roles, roster, visitor })[d.type](d);
}
