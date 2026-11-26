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
            <span class="sc sc--selfie"><img class="scanner__img" data-scan-img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="" hidden><i class="silh"></i><i class="crn"></i><b class="cnt" data-cnt></b><i class="flash"></i></span>
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
    <div class="dmx__lsum">
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

const ROLES = ["Employee", "Manager", "HR", "Admin"], AREAS = [["Attendance", "Live punches and corrections", "clock"], ["Leave", "Requests and balances", "calendar"], ["Payroll", "Salary runs and payslips", "wallet"], ["Reports", "Dashboards and exports", "chart"], ["Settings", "Policies and access", "shield"]];
const roles = (d) => wrap(d, "roles", `
  <div class="dmx__l dmx__matrix">
    <div class="dmx__pills" data-pills role="group" aria-label="Role">${ROLES.map((r, i) => `<button type="button" data-k="${i}" aria-pressed="${i === 0}">${r}</button>`).join("")}</div>
    <ul class="dmx__perms" data-perms>${AREAS.map((a, i) => `<li data-a="${i}"><i>${icon(a[2], "ic")}</i><span><b>${a[0]}</b><small>${a[1]}</small></span><button type="button" class="sw" role="switch" aria-checked="false" aria-label="${a[0]}"><i></i></button></li>`).join("")}</ul>
  </div>
  <div class="dmx__r dmx__sum"><div class="dmx__shead"><span class="dmx__badge" data-badge>${icon("lock", "ic")}</span><div><b data-stitle>Employee</b><p data-stext></p></div></div><div class="dmx__chips" data-schips></div><div class="dmx__can"><small>What this role does</small><ul data-scan></ul></div></div>
  <div class="dmx__who" aria-hidden="true"><span class="dmx__say" data-dsay>Who can see what?</span><div class="dmx__ppl">${who(byName["Priya"], 1, "")}</div></div>`);

const roster = (d) => wrap(d, "roster", `
  <div class="dmx__l dmx__rosterbox">
    <p class="legend"><span class="M">M</span>Morning<span class="E">E</span>Evening<span class="N">N</span>Night<span class="O">O</span>Day off<span class="cvk">2</span>people needed on every morning</p>
    <div class="roster" data-grid></div>
  </div>
  <div class="dmx__r dmx__insight"><b data-ctitle>Coverage is fine</b><p data-ctext>Every day has at least two people on the morning shift.</p><div class="dmx__tiles" data-tiles></div><span class="dmx__live">${icon("repeat", "ic")}Linked to attendance and pay.</span></div>
  <div class="dmx__who" aria-hidden="true"><span class="dmx__say" data-dsay>Swap?</span><div class="dmx__ppl">${who(byName["Omar"], 1, "")}</div></div>`);

const visitor = (d) => wrap(d, "visitor", `
  <div class="dmx__l dmx__vform">
    <div class="dmx__vfields">
      <label class="full">Visitor name<input data-v="name" value="" placeholder="Full name" autocomplete="off"></label>
      <label>Here to see<select data-v="host"><option>Priya Shah</option><option>Omar Mansour</option><option>Karan Mehta</option></select></label>
      <label>Purpose<select data-v="why"><option>Interview</option><option>Meeting</option><option>Delivery</option><option>Audit</option></select></label>
    </div>
    <button class="dmx__send" type="button" data-checkin>Check in ${icon("check", "ic")}</button>
    <div class="dmx__vstatus">
      <div class="dmx__host" data-host><i>${icon("bot", "ic")}</i><span><b data-hostt>Host will be told</b><small data-hosts>A message goes out the moment you check in</small></span></div>
      <ul class="dmx__vsteps" data-vsteps><li><i>${icon("check", "ic")}</i>Photo taken</li><li><i>${icon("check", "ic")}</i>Host told</li><li><i>${icon("check", "ic")}</i>Badge printed</li></ul>
    </div>
  </div>
  <div class="dmx__r dmx__badgebox">
    <div class="dmx__badge2" data-badge2>
      <div class="dmx__bside"><span>VISITOR</span><div class="dmx__bphoto" data-bav>JL</div><em data-btime>09:12</em></div>
      <div class="dmx__bmain"><small>Guest pass · Head Office</small><b data-bname>Your visitor</b><div class="dmx__vmeta"><span data-bwho>Priya Shah</span><span data-bwhy>Interview</span></div>
        <div class="dmx__bgrid"><div><small>Date</small><b data-bdate>Today</b></div><div><small>Valid until</small><b>18:00</b></div><div><small>Floor</small><b>3</b></div></div>
        <div class="dmx__bfoot"><div class="dmx__qr"></div><small class="dmx__valid">Show this pass at reception<br>and wear it while inside</small></div></div>
    </div>
  </div>
  <div class="dmx__who" aria-hidden="true"><span class="dmx__say" data-dsay>Welcome!</span><div class="dmx__ppl">${who(byName["Nadia"], 1, "ppl--wave")}</div></div>`);

const DAY = [["08:45", "Clock in", "Selfie and GPS match, so the day starts on time.", "clock"], ["10:30", "Leave request", "Approved in one tap and the balance updates itself.", "calendar"], ["13:00", "Shift swap", "Two colleagues trade and the rota fixes itself.", "repeat"], ["16:00", "Overtime", "Logged and approved before it is worked.", "alert"], ["18:05", "Clock out", "Hours add up and nobody types anything.", "check"], ["Month end", "Payslip", "One run, and every phone has its payslip.", "wallet"]];
const dial = (d) => wrap(d, "dial", `
  <div class="dmx__l dmx__skybox">
    <div class="dmx__sky" data-sky>
      <svg viewBox="0 0 700 170" aria-hidden="true">
        <path class="sk-ground" d="M0 150H700V170H0Z"/>
        <path class="sk-path" data-spath d="M40 150Q350 -80 660 150"/>
        <path class="sk-trail" data-strail d="M40 150Q350 -80 660 150"/>
        <g data-smk></g>
        <g class="sk-sun" data-ssun><circle class="halo" r="28"/><circle class="core" r="14"/></g>
      </svg>
    </div>
    <div class="dmx__notes" role="group" aria-label="Aisha's day">${DAY.map((s, i) => `<button type="button" data-sc="${i}" aria-pressed="${i === 0}"><i>${icon(s[3], "ic")}</i><span><small>SublimeHR · ${esc(s[0])}</small><b>${esc(s[1])}</b><em>${esc(s[2])}</em></span></button>`).join("")}</div>
  </div>
  <div class="dmx__who" aria-hidden="true"><span class="dmx__say" data-dsay>Good morning!</span><div class="dmx__ppl">${who(byName["Aisha"], 1, "ppl--wave")}</div></div>`);

const FLOW = [["lock", "Sign in", "Email, username or employee code"], ["shield", "Verify OTP", "MFA keeps HR data safe"], ["dashboard", "Home", "Balances and shift at a glance"], ["fingerprint", "Clock in", "Selfie and GPS, one tap"], ["calendar", "Apply leave", "Pick dates, done"], ["file", "Payslip", "Download it any time"]];
const fstep = (s, i) => `<button type="button" data-fs="${i}" aria-pressed="${i === 0}"><i>${icon(s[0], "ic")}</i><span><b>${s[1]}</b><small>${s[2]}</small></span><u></u></button>`;
const flow = (d) => wrap(d, "flow", `
  <div class="dmx__l dmx__flow">
    <div class="dmx__fcol">${FLOW.slice(0, 3).map((s, i) => fstep(s, i)).join("")}</div>
    <div class="dmx__pbody"><div class="dmx__pscreen"><span class="dmx__pnotch"></span><div class="dmx__pbar"><b>9:41</b><span class="dmx__sig s4"><i></i><i></i><i></i><i></i></span></div>
      <div class="dmx__ps on" data-ps="0"><div class="dmx__plogo">${icon("bot", "ic")}</div><h3>Welcome back</h3><small>Sign in to your workspace</small><div class="dmx__pf"><small>Employee code</small><span data-ftype></span></div><div class="dmx__pf"><small>Password</small><span>••••••••</span></div><div class="dmx__pcta" data-pcta>Continue</div></div>
      <div class="dmx__ps" data-ps="1"><h3>Enter OTP</h3><small>Sent to +91 •••• 7684</small><div class="dmx__otp" data-otp><span></span><span></span><span></span><span></span></div><div class="dmx__pcta" data-pcta>Verify</div><small class="dmx__resend">MFA keeps your HR data safe</small></div>
      <div class="dmx__ps" data-ps="2"><small>Good morning</small><h3>Aisha Khan</h3><div class="dmx__pshift"><small>Today's shift</small><b>09:00 to 18:00</b><span>Head Office</span></div><div class="dmx__pbal"><span><b>14</b>Annual</span><span><b>6</b>Sick</span><span><b>2</b>Comp-off</span></div><div class="dmx__pnews">${icon("sparkles", "ic")}<span>Office closed on 30 March</span></div></div>
      <div class="dmx__ps dmx__ps--c" data-ps="3"><div class="dmx__pscan" data-pscan>${icon("fingerprint", "ic")}<i></i></div><b data-pclock>Hold to clock in</b><div class="dmx__pgeo">${icon("pin", "ic")}Inside geofence, 12 m</div><div class="dmx__ptimes"><span><small>In</small><b data-pin2>--:--</b></span><span><small>Out</small><b>--:--</b></span></div></div>
      <div class="dmx__ps" data-ps="4"><h3>Apply leave</h3><div class="dmx__pdays" data-pdays>${["M", "T", "W", "T", "F"].map((x, k) => `<span><small>${x}</small><b>${20 + k}</b></span>`).join("")}</div><div class="dmx__psum" data-psum>Pick your dates</div><div class="dmx__pappr"><i>PS</i><span><b>Priya Shah</b>Approves your request</span></div><div class="dmx__pcta" data-pcta>Submit request</div></div>
      <div class="dmx__ps" data-ps="5"><h3>April payslip</h3><div class="dmx__pnet"><small>Net pay</small><b>4,940</b><span>Paid on 1 May</span></div><div class="dmx__pslip"><div><span>Basic</span><b>4,200</b></div><div><span>Allowance</span><b>1,050</b></div><div class="neg"><span>Deductions</span><b>- 310</b></div></div><div class="dmx__pcta" data-pcta>Download PDF</div></div>
    </div></div>
    <div class="dmx__fcol">${FLOW.slice(3).map((s, i) => fstep(s, i + 3)).join("")}</div>
  </div>
  <div class="dmx__who" aria-hidden="true"><span class="dmx__say" data-dsay>Sign in first.</span><div class="dmx__ppl">${who(byName["Aisha"], 1, "ppl--wave")}</div></div>`);

export function demoSection(m, d) {
  if (m.slug === "employee-self-service") return `<div class="cast mhome" id="try">${movieSection()}</div>`;
  if (m.slug === "mobile-workforce") return flow({ title: "Go on, take it for a spin.", lead: "A working mini version of the real thing. No sign-up needed. Sign in, clock in, ask for leave and open a payslip, all from one phone." });
  return ({ punch, leave, payroll, chart, phone, roles, roster, visitor })[d.type](d);
}
