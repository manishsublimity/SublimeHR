// Interactive product demos ("try it" widgets). Markup only — behaviour lives in main.js (data-w="...").
import { icon } from "./icons.mjs";
import { faqs, homeFaqIds, findFaq } from "./data.mjs";

const top = (ic, title, tone = "", right = "") =>
  `<div class="w__top"><b><span class="ico ${tone}">${icon(ic)}</span>${title}</b>${right}</div>`;
const hint = (t) => `<span class="w__hint">${icon("pointer")}${t}</span>`;
const toast = `<div class="toast" role="status" aria-live="polite">${icon("sparkles")}<span></span></div>`;
const range = (name, label, min, max, step, val, fmt = "") =>
  `<div class="range"><label for="r-${name}-{{id}}">${label}<output data-out="${name}" data-fmt="${fmt}">${val}</output></label><input id="r-${name}-{{id}}" type="range" data-r="${name}" min="${min}" max="${max}" step="${step}" value="${val}"></div>`;
let uid = 0;
const finish = (html) => html.replace(/\{\{id\}\}/g, String(++uid));

/* ------------------------------------------------------------------ */
export function clockW({ slider = false } = {}) {
  return finish(`<div class="w" data-w="clock"${slider ? ' data-sim="1"' : ""}>
  ${top("clock", "Web clock-in", "", `<span class="chip white">${icon("pin")}Head Office</span>`)}
  <div class="w__body clk">
    <div class="clk__time num" data-time>09:02</div>
    <div class="clk__date" data-date>Shift 09:00 – 18:00 · 15 min grace</div>
    ${slider ? `<div class="mt2" style="max-width:320px;margin-inline:auto;text-align:left">${range("arr", "Your arrival time", 510, 600, 1, 542, "time")}</div>` : ""}
    <button class="clk__btn" type="button" data-punch aria-label="Clock in">
      <svg class="ringsvg" viewBox="0 0 176 176" aria-hidden="true"><circle cx="88" cy="88" r="85"/></svg>
      <span class="inner">${icon("fingerprint")}<span data-label>Clock in</span></span>
    </button>
    <div class="clk__foot">
      <div class="clk__checks"><span class="chip" data-chk="cam">${icon("camera")}<span class="t">Selfie</span></span><span class="chip" data-chk="gps">${icon("pin")}<span class="t">GPS</span></span><span class="chip" data-chk="fence">${icon("shield")}<span class="t">Geofence</span></span></div>
      <div class="clk__status" data-status><span class="chip sky">Tap the fingerprint</span></div>
    </div>
    <ul class="clk__log" data-log aria-live="polite"></ul>
  </div>
  ${toast}
</div>`);
}

export function leaveW() {
  return finish(`<div class="w" data-w="leave">
  ${top("calendar", "Leave planner", "mint", hint("Click a start & end date"))}
  <div class="w__body lv">
    <div>
      <div class="cal__head"><b>April 2026</b>
        <div class="pills" role="group" aria-label="Weekend policy"><button type="button" class="pill" data-we="sat" aria-pressed="true">Sat–Sun off</button><button type="button" class="pill" data-we="fri" aria-pressed="false">Fri–Sat off</button></div>
      </div>
      <div class="cal" data-cal role="grid" aria-label="April 2026"></div>
      <div class="cal-legend"><span><i style="background:var(--blue)"></i>Your leave</span><span><i style="background:var(--butter)"></i>Holiday</span><span><i style="background:var(--cream-2)"></i>Weekend</span></div>
    </div>
    <div class="bal">
      <div class="pills" role="group" aria-label="Leave type"><button type="button" class="pill" data-type="annual" aria-pressed="true">Annual</button><button type="button" class="pill" data-type="sick" aria-pressed="false">Sick</button><button type="button" class="pill" data-type="wfh" aria-pressed="false">WFH</button></div>
      <div class="stat"><small>Balance after request</small><strong data-bal>14</strong> <span class="xs muted">/ <span data-cap>14</span> days</span><div class="meter mt1"><span data-meter style="width:100%"></span></div></div>
      <div class="stat"><small>Working days selected</small><strong data-days>0</strong><div class="xs muted" data-excl>Weekends & holidays are skipped automatically.</div></div>
      <button class="btn block sm" type="button" data-apply disabled>Apply leave <span class="bub">${icon("send")}</span></button>
      <div class="req-card" data-req></div>
      <button class="btn text sm" type="button" data-reset>${icon("refresh")} Reset</button>
    </div>
  </div>
  ${toast}
</div>`);
}

export function payrollW() {
  return finish(`<div class="w" data-w="pay">
  ${top("wallet", "Payroll simulator", "butter", hint("Drag the sliders"))}
  <div class="w__body pay">
    <div class="pay__ctrl">
      ${range("basic", "Basic salary", 2000, 12000, 100, 4200, "money")}
      ${range("allow", "Housing allowance", 0, 40, 1, 25, "pct")}
      ${range("ot", "Overtime hours (1.25×)", 0, 40, 1, 6, "hrs")}
      ${range("late", "Late days (¼ day penalty)", 0, 10, 1, 1, "days")}
      <label class="switch"><input type="checkbox" data-adv><span></span>Advance salary repayment</label>
    </div>
    <div>
      <div class="slip" aria-live="polite">
        <div class="slip__h"><span>SALARY SLIP · APRIL</span><span class="mono">EMP-0142</span></div>
        <div class="slip__l" data-l="basic"><span>Basic</span><span>0</span></div>
        <div class="slip__l" data-l="allow"><span>Housing allowance</span><span>0</span></div>
        <div class="slip__l" data-l="ot"><span>Overtime</span><span>0</span></div>
        <div class="slip__l neg" data-l="late"><span>Late penalty</span><span>0</span></div>
        <div class="slip__l neg" data-l="adv"><span>Advance repayment</span><span>0</span></div>
        <div class="slip__net"><span class="sm muted">Net pay</span><b data-net>0</b></div>
        <div class="stack" aria-hidden="true"><span data-bar="earn" style="background:var(--teal)"></span><span data-bar="ded" style="background:var(--coral)"></span></div>
      </div>
      <button class="btn alt block sm mt2" type="button" data-pdf>Generate branded payslip <span class="bub">${icon("file")}</span></button>
    </div>
  </div>
  ${toast}
</div>`);
}

const PERM_MODS = [["users", "Employees"], ["clock", "Attendance"], ["calendar", "Leave"], ["wallet", "Payroll"], ["chart", "Reports"]];
export function permW() {
  const box = (m, a) => `<label class="box"><input type="checkbox" data-m="${m}" data-a="${a}" aria-label="${PERM_MODS[m][1]} ${["view", "add", "edit", "delete"][a]}"><span>${icon("check")}</span></label>`;
  return finish(`<div class="w" data-w="perm">
  ${top("shield", "Role permissions", "lilac", hint("Toggle the boxes"))}
  <div class="w__body">
    <div class="pills mb0" role="group" aria-label="Role" style="margin-bottom:12px"><button type="button" class="pill" data-role="admin" aria-pressed="true">HR Admin</button><button type="button" class="pill" data-role="mgr" aria-pressed="false">Manager</button><button type="button" class="pill" data-role="emp" aria-pressed="false">Employee</button></div>
    <div class="perm">
      <table class="matrix"><thead><tr><th>Module</th><th>View</th><th>Add</th><th>Edit</th><th>Del</th></tr></thead>
      <tbody>${PERM_MODS.map(([, n], m) => `<tr><td>${n}</td>${[0, 1, 2, 3].map((a) => `<td>${box(m, a)}</td>`).join("")}</tr>`).join("")}</tbody></table>
      <div class="preview" aria-live="polite"><span class="xs muted" style="font-weight:700">What this role sees</span>
        ${PERM_MODS.map(([ic, n], m) => `<div class="pv-item" data-pv="${m}">${icon(ic)}${n}<span class="acts"><i>V</i><i>A</i><i>E</i><i>D</i></span></div>`).join("")}
      </div>
    </div>
  </div>
  ${toast}
</div>`);
}

const PEOPLE = [["AK", "Aisha", 528, "#2EA79D"], ["OM", "Omar", 535, "#4A86C8"], ["PR", "Priya", 541, "#E9805F"], ["JL", "James", 548, "#7A6FD0"], ["SN", "Sara", 552, "#2F72B8"], ["RM", "Rahul", 559, "#D9A21B"], ["LM", "Lina", 563, "#3FBDB3"], ["KP", "Karan", 571, "#5F7389"], ["FA", "Fatima", 577, "#C2577A"], ["DT", "David", 584, "#4C9A5B"], ["NS", "Nora", 596, "#8F6BD6"], ["YH", "Yusuf", 612, "#E07B3A"]];
export function hereW() {
  return finish(`<div class="w" data-w="here" data-people='${JSON.stringify(PEOPLE)}'>
  ${top("chart", "Who is here — live", "", hint("Scrub through the morning"))}
  <div class="w__body">
    ${range("t", "Time of day", 510, 630, 1, 545, "time")}
    <div class="here mt2" data-grid>${PEOPLE.map(([i, n, , c]) => `<div class="p" data-p><span class="a" style="background:${c}">${i}</span>${n}</div>`).join("")}</div>
    <div class="grid g3 mt2" style="gap:8px"><div class="stat"><small>Present</small><strong data-s="in">0</strong></div><div class="stat"><small>Late (after 9:15)</small><strong data-s="late" style="color:var(--coral-ink)">0</strong></div><div class="stat"><small>Not in yet</small><strong data-s="out">0</strong></div></div>
  </div>
</div>`);
}

export function rosterW() {
  const staff = [["Aisha", "MMEE-NN"], ["Omar", "EE--MMM"], ["Priya", "NNMM-EE"], ["James", "-MMEENN"]];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const names = { M: "Morning", E: "Evening", N: "Night", "-": "Off" };
  return finish(`<div class="w" data-w="roster">
  ${top("repeat", "Weekly roster", "mint", hint("Click a shift to change it"))}
  <div class="w__body" style="overflow-x:auto">
    <table class="roster"><thead><tr><th></th>${days.map((d) => `<th>${d}</th>`).join("")}</tr></thead>
    <tbody>${staff.map(([n, s]) => `<tr><td>${n}</td>${[...s].map((c, i) => `<td><button type="button" data-s="${c}" aria-label="${n} ${days[i]}: ${names[c]}">${c === "-" ? "Off" : c}</button></td>`).join("")}</tr>`).join("")}
    <tr class="cov"><td class="xs muted">On duty</td>${days.map(() => "<td>0</td>").join("")}</tr></tbody></table>
    <div class="row xs muted mt1"><span class="chip sky">M · Morning</span><span class="chip mint">E · Evening</span><span class="chip" style="background:var(--lilac);color:var(--lilac-ink)">N · Night</span><span>Minimum 3 on duty</span></div>
  </div>
  ${toast}
</div>`);
}

export function letterW() {
  return finish(`<div class="w" data-w="letter">
  ${top("file", "Letter generator", "peach", hint("Type — watch the letter write itself"))}
  <div class="lsteps" aria-hidden="true"><span class="done" data-ls="0"><i>1</i>Fill details</span><span class="on" data-ls="1"><i>2</i>Letter auto-generated</span><span data-ls="2"><i>3</i>Send for e-sign</span></div>
  <div class="w__body letter">
    <div class="form-grid" style="grid-template-columns:1fr;gap:10px">
      <div class="pills" role="group" aria-label="Template" data-tpl><button type="button" class="pill" data-t="offer" aria-pressed="true">Offer letter</button><button type="button" class="pill" data-t="exp" aria-pressed="false">Experience</button><button type="button" class="pill" data-t="warn" aria-pressed="false">Warning</button></div>
      <div class="field"><label for="lt-n-{{id}}">Employee name</label><input class="input" id="lt-n-{{id}}" data-in="name" value="Sara Nasser" maxlength="40"></div>
      <div class="field"><label for="lt-p-{{id}}">Position</label><select class="select" id="lt-p-{{id}}" data-in="pos"><option>Senior Accountant</option><option>HR Executive</option><option>Plant Supervisor</option><option>Staff Nurse</option></select></div>
      <div class="form-grid" style="gap:10px">
        <div class="field"><label for="lt-s-{{id}}">Monthly salary</label><input class="input" id="lt-s-{{id}}" data-in="sal" type="number" value="5200" min="0" step="100"></div>
        <div class="field"><label for="lt-d-{{id}}">Effective date</label><input class="input" id="lt-d-{{id}}" data-in="date" type="date" value="2026-05-04"></div>
      </div>
      <button class="btn block sm" type="button" data-send>Send for e-signature <span class="bub">${icon("send")}</span></button>
    </div>
    <div class="paper" aria-live="polite">
      <div class="paper__head"><span><img src="/assets/img/sublimehr-logo.png" alt="" width="22" height="20">ACME INDUSTRIES · HR</span><span class="mono">REF-2026-0142</span></div>
      <div class="paper__body">
        <h5 data-title>Offer of employment</h5>
        <div data-body></div>
        <div class="sig">— People Team</div>
        <span class="stamp">SENT ✓</span>
      </div>
    </div>
  </div>
  ${toast}
</div>`);
}

export function visitorW() {
  return finish(`<div class="w" data-w="visitor">
  ${top("badge", "Visitor desk", "sky", hint("Check someone in"))}
  <div class="w__body vis">
    <div class="form-grid" style="grid-template-columns:1fr">
      <div class="field"><label for="v-n-{{id}}">Visitor name</label><input class="input" id="v-n-{{id}}" data-in="name" placeholder="e.g. John Davis" maxlength="30"></div>
      <div class="field"><label for="v-h-{{id}}">Host</label><select class="select" id="v-h-{{id}}" data-in="host"><option>HR Team</option><option>Facilities</option><option>Finance</option><option>Plant 2</option></select></div>
      <div class="pills" role="group" aria-label="Purpose" data-purpose><button type="button" class="pill" aria-pressed="true">Meeting</button><button type="button" class="pill" aria-pressed="false">Interview</button><button type="button" class="pill" aria-pressed="false">Contractor</button></div>
      <button class="btn block sm" type="button" data-checkin>Check in &amp; print badge <span class="bub">${icon("printer")}</span></button>
    </div>
    <div>
      <div class="idcard" data-badge>
        <span class="idcard__clip" aria-hidden="true"></span>
        <div class="idcard__top"><span>VISITOR PASS</span><img src="/assets/img/sublimehr-logo.png" alt="" width="20" height="18"></div>
        <div class="idcard__body"><span class="ph" data-ini>?</span><div><b data-bn>Your visitor</b><small data-bm>Fill the form and check in — the badge prints here.</small></div></div>
        <div class="idcard__foot"><span data-bp>MEETING</span><span class="qr" aria-hidden="true"></span></div>
      </div>
      <p class="vlist-h"><span>On site now</span><b data-cnt>0</b></p>
      <ul class="vlist" data-list aria-live="polite"></ul>
    </div>
  </div>
</div>`);
}

/* Phone mini-movie */
export const storySteps = [
  ["Sign in", "Email, username or employee code"],
  ["Verify OTP", "MFA keeps HR data safe"],
  ["Home", "Balances & shift at a glance"],
  ["Clock in", "Selfie + GPS, one tap"],
  ["Apply leave", "Pick dates, done"],
  ["Payslip", "Download it any time"]
];
export function storyW({ intro = "" } = {}) {
  const ics = ["lock", "shield", "dashboard", "fingerprint", "calendar", "file"];
  return finish(`<div class="movie" data-w="story">
  <div class="movie__intro">
    ${intro}
    <div class="movie__steps" role="tablist" aria-label="App walkthrough">
      ${storySteps.map(([t, s], i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-go="${i}" class="${i === 0 ? "on" : ""}"><span class="si">${icon(ics[i])}</span><span><b>${t}</b><small>${s}</small></span><span class="bar"></span></button>`).join("")}
    </div>
  </div>
  <div class="stage-card">
    <div class="phone" aria-label="Animated walkthrough of the SublimeHR mobile app" role="img">
      <div class="screen">
        <span class="tapdot" data-tap></span>
        <div class="sbar" aria-hidden="true"><span>9:41</span><i><b style="height:4px"></b><b style="height:6px"></b><b style="height:8px"></b><b style="height:10px"></b></i></div>
        <div class="scr on" data-scr="0"><img src="/assets/img/sublimehr-logo.png" alt="" width="54" height="48"><h5>Welcome back</h5><span class="xs muted">Sign in to SublimeHR</span><div class="fld" data-type="EMP-0142"><span data-txt></span><span class="caret"></span></div><div class="fld" style="letter-spacing:3px">••••••••</div><div class="fbtn" data-btn>Sign in</div></div>
        <div class="scr" data-scr="1"><h5>Enter OTP</h5><span class="xs muted">Sent to +91 •••• 7684</span><div class="otp"><span></span><span></span><span></span><span></span></div><div class="fbtn" data-btn>Verify</div></div>
        <div class="scr" data-scr="2"><div class="apphead"><img src="/assets/img/sublimehr-logo.png" alt="" width="20" height="18">SublimeHR<span>SN</span></div><span class="xs muted">Good morning</span><h5>Sara 👋</h5><div class="mini-kpi"><div>Leave balance<b>14 d</b></div><div>Shift<b>09:00</b></div><div>This month<b>21 / 22</b></div><div>Payslip<b>Ready</b></div></div><div class="fbtn" data-btn>Clock in</div></div>
        <div class="scr" data-scr="3" style="align-items:center;text-align:center"><span class="chip mint">${icon("pin")}Inside geofence</span><div style="width:150px;height:150px;border-radius:50%;display:grid;place-items:center;background:var(--teal);color:#fff;box-shadow:0 0 0 12px var(--mint);margin:18px 0" data-ring><span style="font-family:var(--font-d);font-weight:700;font-size:1.1rem" data-ringtxt>Clocking in…</span></div><b style="color:var(--ink)" data-ok>&nbsp;</b></div>
        <div class="scr" data-scr="4"><h5>Apply leave</h5><div class="pills"><span class="pill" aria-pressed="true">Annual</span><span class="pill">Sick</span></div><div class="cal" style="gap:4px" data-mcal></div><div class="fbtn" data-btn>Submit · 2 days</div></div>
        <div class="scr" data-scr="5"><h5>April payslip</h5><div class="slip"><div class="slip__l"><span>Basic</span><span>4,200</span></div><div class="slip__l"><span>Allowance</span><span>1,050</span></div><div class="slip__l neg"><span>Deductions</span><span>-35</span></div><div class="slip__net"><span class="xs muted">Net</span><b data-pnet>0</b></div></div><div class="fbtn" data-btn>Download PDF</div></div>
      </div>
    </div>
  </div>
</div>`);
}

export function chatW(items, { title = "Ask SublimeHR", suggest = 6, inline = false } = {}) {
  const qa = (cls) => items.map(([q, a, cat], i) => `<button class="${cls}" type="button" data-q="${i}" data-cat="${cat || ""}" aria-pressed="false"${i >= suggest ? " hidden" : ""}>${cls === "chat__q" ? `<span class="n">${String(i + 1).padStart(2, "0")}</span>` : ""}<span>${q}</span></button><div class="chat__a" hidden data-a="${i}">${a}</div>`).join("");
  const more = items.length > suggest ? `<button class="btn text sm" type="button" data-more>Show more questions</button>` : "";
  const win = (extra) => `<div class="chat__win">
    <div class="w__top"><b><span class="ico">${icon("bot")}</span>${title}</b><span class="chip white"><span style="width:8px;height:8px;border-radius:50%;background:var(--teal)"></span>Online</span></div>
    <div class="chat__log" data-log aria-live="polite"><div class="msg bot">Hi! 👋 ${inline ? "Pick a topic on the left — I'll suggest questions right here" : "Pick a question on the left"}, or type your own.</div></div>
    ${extra}
    <form class="chat__foot" data-ask><label class="vh" for="ask-{{id}}">Ask a question</label><input class="input" id="ask-{{id}}" placeholder="e.g. Do you support biometric devices?" autocomplete="off"><button class="btn sm no-bub" type="submit" aria-label="Send">${icon("send")}</button></form>
  </div>`;
  if (inline) return finish(`<div class="chat chat--inline" data-w="chat" data-inline="1" data-suggest="${suggest}"><div class="src-qs" data-qs>${qa("sugg")}</div>${win("")}</div>`);
  return finish(`<div class="chat" data-w="chat" data-suggest="${suggest}">
  <div><div class="chat__qs" data-qs>${qa("chat__q")}</div>${more ? `<div class="mt1">${more}</div>` : ""}</div>
  ${win("")}
</div>`);
}

export const homeFaqItems = () => homeFaqIds.map(findFaq).filter(Boolean).concat(faqs.find((g) => g.id === "security").items.slice(0, 2));

/* Without vs With comparison */
export function vsCompare(m) {
  const pains = ["Spreadsheets & paper forms", "Manual re-keying between systems", "The same HR questions, every day"];
  return `<div class="ba2 rv">
  <div class="ba2__note"><span class="ba2__stamp">BEFORE</span><h3>The old way</h3><p>${m.problem}</p>
    <ul>${pains.map((x) => `<li>${icon("close")}<span>${x}</span></li>`).join("")}</ul></div>
  <div class="ba2__arrow" aria-hidden="true">
    <svg class="curve" viewBox="0 0 130 70"><path d="M6 52 C 40 4, 86 4, 118 40"/><path class="head" d="M106 38 L119 41 L116 28"/></svg>
    <span>Switch to SublimeHR</span>
  </div>
  <div class="ba2__app"><div class="ba2__bar"><i></i><i></i><i></i><img src="/assets/img/sublimehr-logo.png" alt="" width="18" height="16">SublimeHR<em>● Live</em></div>
    <div class="ba2__body"><p>${m.solution}</p><ul>${m.benefits.slice(0, 3).map((x) => `<li><span class="tg" aria-hidden="true"></span>${x}</li>`).join("")}</ul></div></div>
</div>`;
}

/* Hero art for module pages */
export function heroArt(m, idx) {
  const f = m.features;
  return `<div class="art t${idx % 5}" aria-hidden="true">
  <span class="sticker a1" style="--rot:-4deg"><span class="dot" style="background:var(--teal)">${icon("check")}</span>${f[0]}</span>
  <span class="sticker a2" style="--rot:3deg"><span class="dot" style="background:var(--blue)">${icon("zap")}</span>${f[1]}</span>
  <span class="sticker a3" style="--rot:-2deg"><span class="dot" style="background:var(--coral)">${icon("star")}</span>${f[2]}</span>
  <div class="art__core">${icon(m.icon)}</div>
  <div class="stat-bub"><small>Outcome</small>${m.benefits[0]}</div>
</div>`;
}

/* Which widget belongs to which module */
export const moduleWidget = {
  "employee-management": letterW,
  "attendance-management": () => clockW({ slider: true }),
  "leave-management": leaveW,
  payroll: payrollW,
  "reports-analytics": hereW,
  "employee-self-service": storyW,
  "mobile-workforce": storyW,
  "security-access": permW,
  "shift-scheduling": rosterW,
  "visitor-management": visitorW
};
