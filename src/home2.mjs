// Home option B — "Living Office", second pass.
// Professional on the surface, playful underneath: a living office, a real product dashboard, a day timeline,
// try-it demos with optional sound, ten industries, and links into every module.
import { site, modules } from "./data.mjs";
import { icon } from "./icons.mjs";

const V = Date.now().toString(36);
const none = "none";

// ---- content: one entry per industry -------------------------------------------------------------
export const industries = [
  {
    key: "it", name: "IT company", icon: "laptop", color: "#3558F5", on: "#FFFFFF",
    lead: "In IT the workday has no address, so clock-in follows people home.",
    roles: ["Developer", "Designer", "QA lead", "Team manager", "HR partner", "Finance", "Intern"],
    props: ["laptop", "palette", "shield", "users", "headset", "wallet", "bulb"],
    hats: [none, none, none, "tie", "headset", none, none],
    pains: ["Time tracked in three different tools", "Remote check-ins nobody can verify", "Comp-off counted on a spreadsheet"],
    events: [
      [0, "Clocked in from home at 09:02", "in"], [3, "Emergency leave approved in one tap", "leave"], [2, "Comp-off earned for the Saturday release", "other"],
      [1, "Timesheet matches attendance", "other"], [6, "First payslip landed on my phone", "other"], [4, "Leave balance updated: 2 comp-off days", "other"],
      [5, "Payroll ran straight from attendance", "other"], [0, "Swapped sprint-week shift with Omar", "swap"]
    ],
    needs: [
      ["clock", "Clock in from anywhere", "Home, office or a client site. A selfie and GPS keep it honest."],
      ["alert", "Emergency leave", "One tap, the manager is pinged and cover is suggested."],
      ["repeat", "Comp-off", "Weekend deploy? The day off is credited and tracked."],
      ["calendar", "Leave balances", "Paid, unpaid and comp-off, each by its own policy."],
      ["chart", "Timesheets", "Hours worked match attendance, so billing never argues."],
      ["wallet", "Payroll", "Allowances, deductions and payslips from real attendance."]
    ]
  },
  {
    key: "hospital", name: "Hospital", icon: "health", color: "#0E9F8A", on: "#FFFFFF",
    lead: "In a hospital the clock never stops, so every shift needs a name.",
    roles: ["Staff nurse", "Doctor", "Night nurse", "Pharmacist", "Ward manager", "HR officer", "Accounts"],
    props: ["heart", "health", "clock", "briefcase", "users", "headset", "wallet"],
    hats: ["nurse", "scrub", "nurse", none, "tie", "headset", none],
    pains: ["Rosters rebuilt on a group chat every week", "Night allowances worked out by hand", "Expiring registrations noticed too late"],
    events: [
      [2, "Night shift started at 20:00", "in"], [0, "Swap request: Ravi covers my Thursday", "swap"], [1, "On-call allowance added automatically", "other"],
      [4, "Float nurse found for tomorrow's gap", "leave"], [3, "Registration renewal due in 14 days", "other"], [5, "Overtime calculated for the ward", "other"],
      [6, "Payslip includes night allowance", "other"], [0, "Clocked in at the ICU, geofence matched", "in"]
    ],
    needs: [
      ["clock", "Round-the-clock rosters", "Day, evening and night shifts planned in one view."],
      ["repeat", "Shift swaps", "Nurses trade shifts, the ward manager approves in a tap."],
      ["alert", "On-call and emergency", "Float staff are suggested the moment someone calls in."],
      ["wallet", "Night and on-call pay", "Allowances calculated for every hour that qualifies."],
      ["badge", "Licence reminders", "Expiring registrations flagged weeks ahead."],
      ["shield", "Access by ward", "Staff see only their own unit and records stay private."]
    ]
  },
  {
    key: "retail", name: "Retail", icon: "retail", color: "#F2593B", on: "#FFFFFF",
    lead: "In retail the rota changes every week, and so does everything that depends on it.",
    roles: ["Cashier", "Store manager", "Stock clerk", "Merchandiser", "Part-timer", "HR officer", "Accounts"],
    props: ["retail", "building", "truck", "palette", "clock", "headset", "dollar"],
    hats: ["visor", "tie", none, none, "visor", "headset", none],
    pains: ["Rotas that change after they are printed", "Part-timers clocking in from the wrong store", "Commission rechecked at every month end"],
    events: [
      [4, "Clocked in at Store 7, geofence matched", "in"], [1, "Weekend rota published to every phone", "other"], [0, "Swapped Saturday with Karan", "swap"],
      [1, "Leave clash flagged before I approved", "leave"], [3, "Festival overtime approved", "other"], [6, "Commission added to the payslip", "other"],
      [2, "Half-day leave approved", "leave"], [5, "Seasonal staff onboarded in minutes", "other"]
    ],
    needs: [
      ["calendar", "Weekend and festival rotas", "Publish early and let staff see it on their phone."],
      ["pin", "Clock in at the right store", "A geofence per outlet, part-timers included."],
      ["alert", "Short-staffed warnings", "Leave clashes flagged before you approve."],
      ["dollar", "Commission and bonus", "Sales incentives land on the payslip automatically."],
      ["repeat", "Quick swaps", "Two cashiers agree and the rota updates itself."],
      ["users", "Seasonal hiring", "Onboard temps in minutes and offboard them cleanly."]
    ]
  },
  {
    key: "factory", name: "Factory", icon: "factory", color: "#FFB81F", on: "#14213D",
    lead: "On a plant floor every minute counts twice: once for output, once for pay.",
    roles: ["Machine operator", "Supervisor", "Safety officer", "Maintenance", "Contract worker", "HR officer", "Payroll clerk"],
    props: ["factory", "users", "hardhat", "sliders", "fingerprint", "headset", "wallet"],
    hats: ["hard", "hard", "hard", "hard", "hard", "headset", none],
    pains: ["Shift rotations kept on a whiteboard", "Contract workers' hours disputed", "Overtime approved after the fact"],
    events: [
      [4, "Punched in with fingerprint, shift B", "in"], [1, "Shift A rotated to B on schedule", "swap"], [0, "Two hours of overtime approved", "other"],
      [2, "Safety induction completed", "other"], [3, "Late within grace, no deduction", "other"], [6, "Daily wages calculated for 240 workers", "other"],
      [0, "Half-day leave approved", "leave"], [5, "Absenteeism report ready for the morning meeting", "other"]
    ],
    needs: [
      ["repeat", "Shift rotation", "A, B and C shifts rotate on schedule, no whiteboard."],
      ["fingerprint", "Biometric punch", "Contract and daily-wage workers clock in with a touch."],
      ["clock", "Overtime control", "Approvals first and pay calculated after."],
      ["hardhat", "Safety and training", "Induction and certificate dates tracked per worker."],
      ["wallet", "Daily wage payroll", "Pay by day, hour or piece with every deduction shown."],
      ["chart", "Plant reports", "Absenteeism by line and shift, ready each morning."]
    ]
  },
  {
    key: "school", name: "School", icon: "school", color: "#7A4DF0", on: "#FFFFFF",
    lead: "In a school one absence moves a whole timetable.",
    roles: ["Teacher", "Principal", "Office admin", "Bus driver", "Counsellor", "Lab assistant", "Accountant"],
    props: ["school", "briefcase", "file", "truck", "heart", "sliders", "wallet"],
    hats: ["grad", "tie", none, "visor", none, none, none],
    pains: ["Substitutes arranged by phone at 7 a.m.", "Leave balances reset by guesswork", "Staff files scattered across cabinets"],
    events: [
      [3, "Bus driver clocked in at 06:10", "in"], [1, "Substitute assigned for Class 7 maths", "swap"], [0, "Half-day leave approved", "leave"],
      [2, "Term-break leave balance reset", "other"], [5, "Lab assistant clocked in before the bell", "in"], [6, "Salary slips sent on the 1st", "other"],
      [4, "Qualification renewal flagged", "other"], [0, "Emergency leave, cover found in a minute", "leave"]
    ],
    needs: [
      ["users", "Substitute cover", "A teacher is out and the free ones show up instantly."],
      ["calendar", "Term-based leave", "Balances reset with the academic year."],
      ["clock", "Early starts", "Drivers and caretakers clock in before the bell."],
      ["file", "Staff records", "Qualifications, contracts and renewals in one file."],
      ["wallet", "Salary on schedule", "Payslips on the same day every month."],
      ["globe", "Two languages", "English and Arabic, right to left included."]
    ]
  },
  {
    key: "hotel", name: "Hotel", icon: "hotel", color: "#0B8FB5", on: "#FFFFFF",
    lead: "In a hotel the guests see the smiles, and HR sees the shifts behind them.",
    roles: ["Front desk", "Head chef", "Housekeeper", "Concierge", "Duty manager", "HR officer", "Accounts"],
    props: ["hotel", "sparkles", "layers", "globe", "users", "headset", "dollar"],
    hats: ["visor", "chef", none, "visor", "tie", "headset", none],
    pains: ["Split shifts that clash", "Tips share calculated on paper", "Peak-week leave granted blindly"],
    events: [
      [0, "Split shift scheduled: breakfast and dinner", "swap"], [1, "Holiday work credited as comp-off", "other"], [4, "Visitor badge printed at the lobby", "other"],
      [2, "Clocked in at the east wing, geofence matched", "in"], [6, "Tips share added to payroll", "other"], [3, "Night audit shift logged", "in"],
      [5, "Seasonal staff onboarded for peak week", "other"], [0, "Emergency leave covered by the duty manager", "leave"]
    ],
    needs: [
      ["repeat", "Split shifts", "Breakfast and dinner service planned without clashes."],
      ["calendar", "Peak season", "Leave caps for busy weeks and comp-off for holiday work."],
      ["badge", "Guest and visitor check-in", "Badges printed at the door and hosts notified."],
      ["dollar", "Tips and service charge", "Shared fairly and added to payroll."],
      ["clock", "Night audit", "Late shifts tracked with allowances applied."],
      ["globe", "Multilingual teams", "Every screen in the language the staff speak."]
    ]
  },
  {
    key: "construction", name: "Construction", icon: "hardhat", color: "#A66A2B", on: "#FFFFFF",
    lead: "On a building site the crew changes by the day, and every head still has to be counted.",
    roles: ["Site engineer", "Foreman", "Safety officer", "Crane operator", "Subcontractor", "HR officer", "Accounts"],
    props: ["hardhat", "users", "shield", "truck", "briefcase", "headset", "wallet"],
    hats: ["hard", "hard", "hard", "hard", "hard", "headset", "tie"],
    pains: ["Site headcount guessed at lunch", "Subcontractor hours nobody can verify", "Safety certificates found expired on inspection day"],
    events: [
      [1, "Site headcount: 86 present at 07:30", "in"], [4, "Subcontractor crew punched in at Gate 2", "in"], [2, "Safety induction done for 12 new workers", "other"],
      [3, "Overtime approved for the pour", "other"], [0, "Emergency leave covered by the foreman", "leave"], [6, "Daily wages ready for the whole crew", "other"],
      [2, "Certificate expiring in 10 days flagged", "other"], [1, "Night pour moved to Thursday", "swap"]
    ],
    needs: [
      ["pin", "Site-wise attendance", "A geofence for each site and crews counted live."],
      ["users", "Subcontractor crews", "Short contracts onboarded and offboarded in minutes."],
      ["hardhat", "Safety certificates", "Expiry dates tracked per worker and flagged early."],
      ["clock", "Overtime on pours", "Approve the extra hours before the work starts."],
      ["wallet", "Daily wages", "Pay by day or hour with every deduction shown."],
      ["chart", "Site reports", "Headcount and absence by site, every morning."]
    ]
  },
  {
    key: "logistics", name: "Logistics", icon: "truck", color: "#2F9E44", on: "#FFFFFF",
    lead: "In logistics the team is always somewhere else, so HR has to travel with them.",
    roles: ["Driver", "Dispatcher", "Warehouse picker", "Fleet supervisor", "Loader", "HR officer", "Accounts"],
    props: ["truck", "headset", "layers", "users", "sliders", "briefcase", "wallet"],
    hats: ["visor", "headset", "visor", "hard", "hard", "headset", none],
    pains: ["Drivers' hours kept on paper logs", "Depot rotas changing by the hour", "Trip allowances paid late"],
    events: [
      [0, "Driver clocked in at Depot 3, 05:40", "in"], [1, "Night dispatch shift swapped", "swap"], [2, "Peak-week overtime approved", "other"],
      [4, "Loader checked in with fingerprint", "in"], [3, "Trip allowance added to payroll", "other"], [0, "Half-day leave approved, route reassigned", "leave"],
      [6, "Weekly pay ran for 240 drivers", "other"], [5, "Depot absenteeism report ready", "other"]
    ],
    needs: [
      ["pin", "Clock in at the depot", "A geofence per depot and live location for field staff."],
      ["repeat", "Rotating depot rotas", "Early, late and night rotations planned together."],
      ["dollar", "Trip allowances", "Paid per trip or per kilometre, calculated automatically."],
      ["fingerprint", "Quick punches", "Loaders and pickers clock in with a touch."],
      ["alert", "Last-minute cover", "See who is free when a driver calls in sick."],
      ["chart", "Depot reports", "Attendance and overtime by depot and shift."]
    ]
  },
  {
    key: "restaurant", name: "Restaurant", icon: "sparkles", color: "#D6336C", on: "#FFFFFF",
    lead: "In a restaurant the rush decides the rota, and the rota decides the mood.",
    roles: ["Head chef", "Waiter", "Line cook", "Host", "Bartender", "HR officer", "Accounts"],
    props: ["sparkles", "users", "heart", "badge", "layers", "headset", "dollar"],
    hats: ["chef", "visor", "chef", none, "visor", "headset", none],
    pains: ["Closing shifts swapped in a group chat", "Service charge split in arguments", "Staff leaving with no exit record"],
    events: [
      [1, "Closing shift swapped with Ravi", "swap"], [0, "Service charge split calculated", "other"], [2, "Clocked in at 15:55 for dinner prep", "in"],
      [3, "Weekend rota published to every phone", "other"], [4, "Late within grace, no deduction", "other"], [1, "Tips share added to the payslip", "other"],
      [5, "New hire onboarded before Friday service", "other"], [2, "Emergency leave covered in two taps", "leave"]
    ],
    needs: [
      ["repeat", "Closing and opening swaps", "Staff trade shifts and the manager approves in a tap."],
      ["dollar", "Tips and service charge", "Shared by your rules and added to payroll."],
      ["calendar", "Rush-hour rotas", "Heavier staffing on busy nights and lighter on quiet ones."],
      ["clock", "Split shifts", "Lunch and dinner planned without clashes."],
      ["users", "Seasonal staff", "Onboard temporary hands fast and offboard them cleanly."],
      ["file", "Training records", "Food-safety certificates tracked per person."]
    ]
  },
  {
    key: "bank", name: "Bank", icon: "building", color: "#2B2F77", on: "#FFFFFF",
    lead: "In a bank every record has to be right, and every access has to be explained.",
    roles: ["Branch manager", "Teller", "Loan officer", "Compliance", "Relationship manager", "HR officer", "Payroll"],
    props: ["building", "dollar", "file", "shield", "users", "headset", "wallet"],
    hats: ["tie", "tie", none, "tie", "tie", "headset", none],
    pains: ["Attendance audits that take weeks", "Record access not controlled by role", "Branch leave plans out of sync"],
    events: [
      [1, "Teller clocked in at Branch 12, geofence matched", "in"], [3, "Attendance audit report exported", "other"], [0, "Branch leave plan approved, cover assigned", "leave"],
      [2, "Access limited to my team's records", "other"], [4, "Half-day leave approved", "leave"], [6, "Payroll approved with a full audit trail", "other"],
      [5, "Policy acknowledgements 98% complete", "other"], [1, "Shift swap approved between two tellers", "swap"]
    ],
    needs: [
      ["shield", "Role-based access", "Each person sees only what their role allows."],
      ["file", "Audit trail", "Every change recorded with who, what and when."],
      ["calendar", "Branch leave planning", "Cover checked across branches before approval."],
      ["clock", "Attendance audits", "Reports ready in minutes, not weeks."],
      ["wallet", "Payroll controls", "Sign-offs before any payslip goes out."],
      ["globe", "Two languages", "English and Arabic, right to left included."]
    ]
  }
];

// seven people, same across every industry; only job, prop, hat and lines change
const people = [
  { n: "Aisha", skin: "#E8B48C", hair: "#2B1B17", style: "long", shirt: "#FF8A70", x: 40, y: 318, s: 1 },
  { n: "Omar", skin: "#B97D52", hair: "#1C1410", style: "cap", shirt: "#FFD05A", x: 170, y: 96, s: .84 },
  { n: "Sara", skin: "#F1CBA6", hair: "#6B3A22", style: "bun", shirt: "#9B8CFF", x: 230, y: 318, s: 1 },
  { n: "Ravi", skin: "#9A6238", hair: "#120D0B", style: "curls", shirt: "#45C4B0", x: 470, y: 96, s: .84 },
  { n: "Priya", skin: "#D49A6E", hair: "#1A1210", style: "hijab", hijab: "#F7F3FF", shirt: "#7FB4FF", x: 600, y: 318, s: 1 },
  { n: "Karan", skin: "#8A5530", hair: "#17100C", style: "cap", shirt: "#FF9FC0", x: 320, y: 96, s: .84 },
  { n: "Nadia", skin: "#F3D2B3", hair: "#B5651D", style: "long", shirt: "#B8E986", x: 420, y: 318, s: 1 }
];

const who = (p, i, extra = "") => `<div class="ppl s-${p.style} ${extra}" data-hat="none" style="--skin:${p.skin};--hair:${p.hair};--shirt:${p.shirt};--hijab:${p.hijab || p.hair};--d:${(i * -0.7).toFixed(1)}s" data-i="${i}">
  <div class="ppl__fig">
    <div class="ppl__head"><i class="hr"></i><i class="fc"><span class="eye l"><b></b></span><span class="eye r"><b></b></span><span class="ck l"></span><span class="ck r"></span><span class="mo"></span></i><i class="hat"></i></div>
    <div class="ppl__body"><i class="arm l"></i><i class="arm r"></i><span class="chest" data-prop></span></div>
    <div class="ppl__legs"><i></i><i></i></div>
  </div>
</div>`;

const iconSet = {};
const need = (k) => (iconSet[k] = icon(k, "ic"));
for (const ind of industries) { need(ind.icon); ind.props.forEach(need); ind.needs.forEach((n) => need(n[0])); }
["check", "close", "camera", "pin", "shield", "calendar", "clock", "wallet", "repeat", "users", "chart", "file", "sparkles", "alert", "dollar", "layers", "dashboard"].forEach(need);

const roleViews = [
  ["Employee", 0, "Clock in with a selfie. Ask for leave in two taps. See your balance. Open your payslip.", "/software/employee-self-service/"],
  ["Manager", 3, "Approve in one tap. See who is in, late or away. Swap shifts without a phone call.", "/software/shift-scheduling/"],
  ["HR", 4, "Every record in one place. A policy for each leave type. Reports ready for the audit.", "/software/employee-management/"],
  ["Finance", 5, "Payroll built from real attendance. Allowances and deductions you can trace. Export in a click.", "/software/payroll/"]
];
const peeks = [
  ["What happens when someone works on a holiday?", "Comp-off lands in their balance on its own, with an expiry date. Nobody keeps a spreadsheet.", "+1 comp-off day", "sun"],
  ["Who covers when someone takes emergency leave?", "One tap raises the leave, alerts the manager and shows who is free to cover that shift.", "Cover found: Sara", "lilac"],
  ["How do you stop one person punching in for another?", "Every clock-in takes a selfie and checks the GPS fence. The face and the place both have to match.", "Face match 98%", "mint"],
  ["Paid, unpaid or comp-off: which one is it?", "Each leave type follows its own policy for accrual, carry-forward and half-days. Balances stay right.", "Paid 12 / Unpaid 2 / Comp-off 1", "coral"],
  ["What if payroll was ready before the month ended?", "Attendance, leave and overtime flow in as they happen. Run it once and every phone gets a payslip.", "412 payslips sent", "ink"],
  ["Who is in the building right now?", "Staff and visitors, live. Badges print at the door and hosts get a ping the moment a guest arrives.", "In the building: 38", "white"]
];
const stops = [
  [7, "08:45", "Clock in", "Selfie and GPS match, so the day starts on time."],
  [24, "10:30", "Leave request", "Approved in one tap and the balance updates itself."],
  [41, "13:00", "Shift swap", "Two colleagues trade and the rota fixes itself."],
  [58, "16:00", "Overtime", "Logged and approved before it is worked."],
  [75, "18:05", "Clock out", "Hours add up and nobody types anything."],
  [92, "Month end", "Payslip", "One run, and every phone has its payslip."]
];

const chip = (d, i) => `<button class="chip" type="button" data-k="${d.key}" aria-pressed="${i === 0}">${icon(d.icon, "ic")}<span>${d.name}</span></button>`;

export function home2() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SublimeHR: HR that is alive</title>
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="${industries[0].color}">
<link rel="icon" type="image/png" href="${site.logo}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Unbounded:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/home2.css?v=${V}">
</head>
<body class="lo" data-w="${industries[0].key}">
<script type="application/json" id="lo-data">${JSON.stringify({ industries, people: people.map((p) => p.n), icons: iconSet }).replace(/</g, "\\u003c")}</script>
<div class="fx" aria-hidden="true" data-fx></div>

<header class="nav" data-nav>
  <a class="nav__brand" href="/home-v2/"><img src="${site.logo}" alt="" width="30" height="27"><span>Sublime<b>HR</b></span></a>
  <nav class="nav__links" aria-label="Main"><a href="/features/">Product</a><a href="/industries/">Industries</a><a href="/pricing/">Pricing</a><a href="/about/">Company</a></nav>
  <button class="snd" type="button" data-sound aria-pressed="false" aria-label="Turn sound on"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path class="w1" d="M16.5 9a4 4 0 0 1 0 6"/><path class="w2" d="M19 6.5a8 8 0 0 1 0 11"/><path class="x" d="M17 9l5 6M22 9l-5 6"/></svg><span>Sound off</span></button>
  <a class="btn btn--on" href="/book-demo/">Book a demo</a>
  <div class="nudge" data-nudge hidden>Turn the sound on for the full demo.</div>
</header>

<main>
<section class="hero" aria-labelledby="h1" data-hero>
  <div class="hero__main">
    <div class="hero__copy">
      <h1 id="h1">Your people are alive. Your HR should be too.</h1>
      <p class="hero__lead" data-lead>${industries[0].lead}</p>
      <div class="hero__cta"><a class="btn btn--on btn--lg" href="/book-demo/">Book a free demo</a><a class="link" href="/features/">Explore the features</a></div>
      <ul class="facts" aria-label="At a glance"><li><b>70+</b> feature areas</li><li><b>13</b> built-in reports</li><li><b>EN</b> and <b>AR</b>, right to left</li><li><b>Web</b>, iOS and Android</li></ul>
    </div>
    <div class="stage" data-stage aria-label="A live office where people clock in, take leave and get paid">
      <div class="stage__rug" aria-hidden="true"></div>
      <div class="wall" aria-hidden="true">
        <svg class="clock" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46"/><line class="hh" x1="50" y1="50" x2="50" y2="28"/><line class="mh" x1="50" y1="50" x2="50" y2="17"/><line class="sh" x1="50" y1="56" x2="50" y2="12"/><circle class="pin" cx="50" cy="50" r="3"/></svg>
      </div>
      ${people.map((p, i) => `<div class="slot" style="--x:${p.x}px;--y:${p.y}px;--s:${p.s};--z:${Math.round(p.y / 3)};--par:${p.s < 1 ? 5 : 12}" data-slot="${i}"><div class="say" data-say aria-live="polite"></div>${who(p, i)}<span class="tag"><b>${p.n}</b><em data-role></em></span></div>`).join("")}
      <div class="subi" data-subi><div class="subi__say" data-subi-say></div><button class="subi__bot" type="button" aria-label="Say hello to Subi, the office helper"><i class="ant"></i><span class="scr"><b></b><b></b></span><i class="ar l"></i><i class="ar r"></i></button><i class="subi__sh"></i></div>
      <div class="tally" aria-label="Today at a glance">
        <span><b data-t="in">412</b> in today</span><span><b data-t="leave">9</b> on leave</span><span><b data-t="swap">3</b> swaps done</span>
      </div>
    </div>
  </div>
  <div class="dock">
    <p class="dock__lbl" id="pick-lbl">Pick your industry and watch the office change.</p>
    <div class="chips" role="group" aria-labelledby="pick-lbl" data-chips>${industries.map(chip).join("")}</div>
  </div>
  <div class="pulse" aria-hidden="true"></div>
</section>

<section class="prod" aria-labelledby="h-prod" data-prod>
  <div class="prod__copy">
    <h2 id="h-prod">Behind every character, one calm dashboard.</h2>
    <p>Everything the characters just did shows up here, live. HR sees who is in, who is away and what payroll will cost, without chasing anyone.</p>
    <ul class="prod__pts">
      <li>${icon("check", "ic")}<span>Attendance, leave and overtime in one view</span></li>
      <li>${icon("check", "ic")}<span>Alerts for late arrivals, clashes and expiring documents</span></li>
      <li>${icon("check", "ic")}<span>13 built-in reports, ready for the audit</span></li>
    </ul>
    <a class="btn" href="/software/reports-analytics/">See reports and analytics</a>
  </div>
  <div class="win" aria-label="SublimeHR dashboard preview">
    <div class="win__bar"><i></i><i></i><i></i><span>${site.appUrl}/dashboard</span><em data-dash-ind>IT company</em></div>
    <div class="win__body">
      <nav class="win__nav" aria-hidden="true" data-dnav>
        <span class="on">${icon("dashboard", "ic")}</span><span>${icon("clock", "ic")}</span><span>${icon("calendar", "ic")}</span><span>${icon("wallet", "ic")}</span><span>${icon("repeat", "ic")}</span>
      </nav>
      <div class="win__main">
        <div class="win__hi"><b>Good morning, HR team</b><span data-dash-date></span></div>
        <div class="tiles">
          <div class="tile"><small>Present today</small><b data-d="present">0</b><i class="up">+2.4%</i></div>
          <div class="tile"><small>On leave</small><b data-d="leave">0</b><i>planned 7, urgent 2</i></div>
          <div class="tile"><small>Overtime hours</small><b data-d="ot">0</b><i class="up">awaiting 3</i></div>
          <div class="tile"><small>Payroll ready</small><b data-d="pay">0</b><i>%</i></div>
        </div>
        <div class="win__grid">
          <div class="chart"><small>Attendance this week</small><div class="bars" data-bars><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="bars__x"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div>
          <div class="donut"><small>Leave by type</small><div class="donut__ring" data-ring><span data-ring-n>0</span></div><ul class="donut__key"><li class="a">Paid</li><li class="b">Unpaid</li><li class="c">Comp-off</li></ul></div>
        </div>
      </div>
      <aside class="feed" aria-label="Live activity"><small>Live activity</small><ul data-feed></ul></aside>
    </div>
  </div>
</section>

<section class="rhythm" aria-labelledby="h-rhythm" data-rhythm>
  <div class="rhythm__copy">
    <h2 id="h-rhythm">Every industry has its own rhythm.</h2>
    <p class="rhythm__lead" data-lead2>${industries[0].lead}</p>
    <p class="rhythm__sub">The usual headaches</p>
    <ul class="pains" data-pains></ul>
    <p class="rhythm__hint">Touch any need around the character and listen to what it says.</p>
    <a class="link link--ink" href="/industries/">Browse all industries</a>
  </div>
  <div class="orbit" data-orbit>
    <div class="orbit__ring" aria-hidden="true"></div><div class="orbit__ring r2" aria-hidden="true"></div>
    <div class="orbit__core">
      <div class="say say--big" data-say-core aria-live="polite">Hover a need around me.</div>
      ${who(people[2], 2, "ppl--big")}
    </div>
    <ul class="orbit__spin" data-needs></ul>
  </div>
</section>

<section class="day" aria-labelledby="h-day" data-day>
  <div class="day__head"><h2 id="h-day">One day, from clock-in to payslip.</h2><p>Scroll and follow Aisha through a working day. Every stop is something your team does today with paper, chat or spreadsheets.</p></div>
  <div class="day__track" data-track>
    <div class="day__line"><i data-prog></i></div>
    ${stops.map(([l, t, h, p], i) => `<div class="stp ${i % 2 ? "dn" : "up"}" style="--l:${l}%"><div class="stp__c"><small>${t}</small><b>${h}</b><span>${p}</span></div><i class="stp__d"></i></div>`).join("")}
    <div class="walker" data-walker>${who(people[0], 0, "ppl--walk")}</div>
  </div>
</section>

<section class="play" aria-labelledby="h-play" data-play>
  <div class="play__head"><h2 id="h-play">Try it. None of this is a screenshot.</h2><p>Punch a card, request leave, run payroll. The numbers are real arithmetic, and the characters react.</p></div>
  <div class="play__tabs" role="tablist" aria-label="Demos">
    <button role="tab" type="button" aria-selected="true" data-tab="0">Clock in</button>
    <button role="tab" type="button" aria-selected="false" data-tab="1">Request leave</button>
    <button role="tab" type="button" aria-selected="false" data-tab="2">Run payroll</button>
  </div>
  <div class="play__stage">
    <div class="play__panel" data-panel="0">
      <div class="phone">
        <div class="phone__top"><span data-clock-now>09:00</span><i></i></div>
        <p class="phone__hi">Good morning, Aisha</p>
        <div class="punch" data-punch><span class="ring"></span><button class="punch__btn" type="button" data-punch-btn>Punch in</button></div>
        <ul class="checks" data-checks><li data-c="0">${icon("camera", "ic")}<span>Selfie matched</span><i>${icon("check", "ic")}</i></li><li data-c="1">${icon("pin", "ic")}<span>GPS 12 m, inside Head Office</span><i>${icon("check", "ic")}</i></li><li data-c="2">${icon("clock", "ic")}<span data-status>Waiting</span><i>${icon("check", "ic")}</i></li></ul>
      </div>
      <div class="ctl"><label for="arr">When does Aisha arrive?</label><b data-arr-out>08:52</b><input id="arr" type="range" min="510" max="600" step="1" value="532" data-arr><p class="ctl__hint">Shift starts at 09:00. Grace until 09:15.</p></div>
    </div>
    <div class="play__panel" data-panel="1" hidden>
      <div class="phone">
        <div class="phone__top"><span>Leave</span><i></i></div>
        <p class="phone__hi">Request leave</p>
        <div class="types" role="radiogroup" aria-label="Leave type" data-types>
          <button type="button" role="radio" aria-checked="true" data-type="paid">Paid</button><button type="button" role="radio" aria-checked="false" data-type="unpaid">Unpaid</button><button type="button" role="radio" aria-checked="false" data-type="comp">Comp-off</button><button type="button" role="radio" aria-checked="false" data-type="emergency">Emergency</button>
        </div>
        <div class="step"><button type="button" data-dec aria-label="One day less">-</button><span><b data-days>2</b> days</span><button type="button" data-inc aria-label="One day more">+</button></div>
        <div class="bal"><small data-bal-lbl>Paid leave balance</small><div class="bal__bar"><i data-bal-bar></i></div><span data-bal-txt>14 days left</span></div>
        <button class="go" type="button" data-leave-go>Request leave</button>
        <ol class="flow" data-flow><li>Request sent</li><li>Manager notified</li><li data-flow-last>Approved</li></ol>
      </div>
      <div class="ctl"><p class="ctl__big">Four policies, one request.</p><p class="ctl__hint">Pick a type and a length. If the balance runs short, the request goes to HR instead of auto-approving.</p></div>
    </div>
    <div class="play__panel" data-panel="2" hidden>
      <div class="phone phone--wide">
        <div class="phone__top"><span>Payroll, March</span><i></i></div>
        <div class="rows">
          <div><span>Basic</span><b>4,800</b></div><div><span>Allowance</span><b>300</b></div>
          <div><span>Overtime <em data-ot-h>6</em> h</span><b class="plus" data-ot-v>+ 0</b></div><div><span>Unpaid leave <em data-ul-d>1</em> d</span><b class="minus" data-ul-v>- 0</b></div>
        </div>
        <div class="net"><small>Net pay</small><b data-net>0</b></div>
        <div class="split" aria-hidden="true"><i data-s1></i><i data-s2></i><i data-s3></i></div>
        <button class="go" type="button" data-pay-go>Run payroll</button>
        <p class="sent" data-sent aria-live="polite"></p>
      </div>
      <div class="ctl ctl--two">
        <label for="oth">Overtime hours</label><b data-oth-out>6</b><input id="oth" type="range" min="0" max="20" value="6" data-oth>
        <label for="ulv">Unpaid leave days</label><b data-ulv-out>1</b><input id="ulv" type="range" min="0" max="5" value="1" data-ulv>
        <p class="ctl__hint">Overtime is paid at 1.5 times the hourly rate. Each unpaid day removes one thirtieth of the basic.</p>
      </div>
    </div>
    <div class="play__who"><div class="say say--play" data-say-play aria-live="polite">Go on, press something.</div>${who(people[3], 3, "ppl--play")}</div>
  </div>
</section>

<section class="peek" aria-labelledby="h-peek">
  <div class="peek__head">
    <h2 id="h-peek">Things you didn't know HR could do.</h2>
    <p>Each of these is a question your team asks every month. Turn a card over for the answer.</p>
  </div>
  <div class="peek__grid">
    ${peeks.map(([q, a, d, c], i) => `<button class="pk pk--${c} pk--${i + 1}" type="button" aria-pressed="false"><span class="pk__in"><span class="pk__f"><span class="pk__q">${q}</span><i class="pk__m" aria-hidden="true">?</i></span><span class="pk__b"><span class="pk__a">${a}</span><span class="pk__d">${d}</span></span></span></button>`).join("")}
  </div>
</section>

<section class="views" aria-labelledby="h-views">
  <h2 id="h-views">Everyone sees a different company.</h2>
  <div class="views__row">
    ${roleViews.map(([t, pi, line, href], i) => `<a class="vw vw--${i + 1}" href="${href}">
      <div class="vw__who">${who(people[pi], pi, "ppl--bust")}</div>
      <h3>${t}</h3><p>${line}</p></a>`).join("")}
  </div>
</section>

<section class="mods" aria-labelledby="h-mods">
  <div class="mods__head"><h2 id="h-mods">Everything behind the people.</h2><a class="link link--ink" href="/features/">See all features</a></div>
  <div class="mods__grid">
    ${modules.map((m, i) => `<a class="md md--${i % 5}" href="/software/${m.slug}/"><i class="md__ic">${icon(m.icon, "ic")}</i><b>${m.name}</b><span>${m.short}</span></a>`).join("")}
  </div>
</section>

<section class="meet" aria-labelledby="h-meet">
  <div class="meet__in">
    <h2 id="h-meet">Meet your workforce.</h2>
    <p>A 30-minute walkthrough, built around how your industry really works.</p>
    <div class="hero__cta"><a class="btn btn--on btn--lg" href="/book-demo/">Book a free demo</a><a class="link" href="/pricing/">See pricing</a></div>
    <p class="meet__alt">Does your industry look different? <a class="link" href="/contact/">Tell us how your team works</a>.</p>
  </div>
  <div class="crowd" aria-hidden="true">${people.map((p, i) => `<div class="crowd__p" style="--i:${i}">${who(p, i, "ppl--wave")}</div>`).join("")}</div>
</section>
</main>

<footer class="foot">
  <a class="nav__brand" href="/"><img src="${site.logo}" alt="" width="30" height="27"><span>Sublime<b>HR</b></span></a>
  <span class="foot__links"><a href="/features/">Product</a><a href="/industries/">Industries</a><a href="/pricing/">Pricing</a><a href="/about/">Company</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></span>
  <a class="foot__ph" href="${site.phoneHref}">${site.phone}</a>
</footer>

<a class="back" href="/">Current home</a>
<script src="/assets/js/home2.js?v=${V}" defer></script>
</body>
</html>`;
}
