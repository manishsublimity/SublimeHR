// Home option B — "Living Office".
// The page behaves like a living person: characters breathe, blink and follow the cursor, the whole page
// takes on the colour of the industry you pick, and HR events keep happening around you.
import { site } from "./data.mjs";
import { icon } from "./icons.mjs";

const V = Date.now().toString(36);

// ---- content: one entry per industry -------------------------------------------------------------
export const industries = [
  {
    key: "it", name: "IT company", icon: "laptop", color: "#3558F5", on: "#FFFFFF",
    lead: "In IT the workday has no address, so clock-in follows people home.",
    roles: ["Developer", "Designer", "QA lead", "Team manager", "HR partner", "Finance", "Intern"],
    props: ["laptop", "palette", "shield", "users", "headset", "wallet", "bulb"],
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
  }
];

// seven people, same across every industry; only their job, prop and lines change
const people = [
  { n: "Aisha", skin: "#E8B48C", hair: "#2B1B17", style: "long", shirt: "#FF8A70", x: 40, y: 318, s: 1 },
  { n: "Omar", skin: "#B97D52", hair: "#1C1410", style: "cap", shirt: "#FFD05A", x: 170, y: 96, s: .84 },
  { n: "Sara", skin: "#F1CBA6", hair: "#6B3A22", style: "bun", shirt: "#9B8CFF", x: 230, y: 318, s: 1 },
  { n: "Ravi", skin: "#9A6238", hair: "#120D0B", style: "curls", shirt: "#45C4B0", x: 470, y: 96, s: .84 },
  { n: "Priya", skin: "#D49A6E", hair: "#1A1210", style: "hijab", hijab: "#F7F3FF", shirt: "#7FB4FF", x: 600, y: 318, s: 1 },
  { n: "Karan", skin: "#8A5530", hair: "#17100C", style: "cap", shirt: "#FF9FC0", x: 320, y: 96, s: .84 },
  { n: "Nadia", skin: "#F3D2B3", hair: "#B5651D", style: "long", shirt: "#B8E986", x: 420, y: 318, s: 1 }
];

const who = (p, i, extra = "") => `<div class="ppl s-${p.style} ${extra}" style="--skin:${p.skin};--hair:${p.hair};--shirt:${p.shirt};--hijab:${p.hijab || p.hair};--d:${(i * -0.7).toFixed(1)}s" data-i="${i}">
  <div class="ppl__fig">
    <div class="ppl__head"><i class="hr"></i><i class="fc"><span class="eye l"><b></b></span><span class="eye r"><b></b></span><span class="ck l"></span><span class="ck r"></span><span class="mo"></span></i></div>
    <div class="ppl__body"><i class="arm l"></i><i class="arm r"></i><span class="chest" data-prop></span></div>
    <div class="ppl__legs"><i></i><i></i></div>
  </div>
</div>`;

const iconSet = {};
for (const ind of industries) { iconSet[ind.icon] = icon(ind.icon, "ic"); ind.props.forEach((k) => (iconSet[k] = icon(k, "ic"))); ind.needs.forEach((n) => (iconSet[n[0]] = icon(n[0], "ic"))); }
const roleViews = [
  ["Employee", 0, "Clock in with a selfie. Ask for leave in two taps. See your balance. Open your payslip."],
  ["Manager", 3, "Approve in one tap. See who is in, late or away. Swap shifts without a phone call."],
  ["HR", 4, "Every record in one place. A policy for each leave type. Reports ready for the audit."],
  ["Finance", 5, "Payroll built from real attendance. Allowances and deductions you can trace. Export in a click."]
];
const peeks = [
  ["What happens when someone works on a holiday?", "Comp-off lands in their balance on its own, with an expiry date. Nobody keeps a spreadsheet.", "+1 comp-off day", "sun"],
  ["Who covers when someone takes emergency leave?", "One tap raises the leave, alerts the manager and shows who is free to cover that shift.", "Cover found: Sara", "lilac"],
  ["How do you stop one person punching in for another?", "Every clock-in takes a selfie and checks the GPS fence. The face and the place both have to match.", "Face match 98%", "mint"],
  ["Paid, unpaid or comp-off: which one is it?", "Each leave type follows its own policy for accrual, carry-forward and half-days. Balances stay right.", "Paid 12 / Unpaid 2 / Comp-off 1", "coral"],
  ["What if payroll was ready before the month ended?", "Attendance, leave and overtime flow in as they happen. Run it once and every phone gets a payslip.", "412 payslips sent", "ink"],
  ["Who is in the building right now?", "Staff and visitors, live. Badges print at the door and hosts get a ping the moment a guest arrives.", "In the building: 38", "white"]
];

export function home2() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SublimeHR: HR that is alive</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/png" href="${site.logo}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Unbounded:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/home2.css?v=${V}">
</head>
<body class="lo" data-w="${industries[0].key}">
<script type="application/json" id="lo-data">${JSON.stringify({ industries, people: people.map((p) => p.n), icons: iconSet }).replace(/</g, "\\u003c")}</script>

<header class="nav">
  <a class="nav__brand" href="/home-v2/"><img src="${site.logo}" alt="" width="30" height="27"><span>Sublime<b>HR</b></span></a>
  <nav class="nav__links" aria-label="Main"><a href="/features/">Product</a><a href="/industries/">Industries</a><a href="/pricing/">Pricing</a><a href="/about/">Company</a></nav>
  <a class="btn btn--on" href="/book-demo/">Book a demo</a>
</header>

<main>
<section class="hero" aria-labelledby="h1" data-hero>
  <div class="hero__copy">
    <h1 id="h1">Your people are alive. Your HR should be too.</h1>
    <p class="hero__lead" data-lead>${industries[0].lead}</p>
    <p class="hero__ask" id="pick-lbl">Pick your industry and watch the office change.</p>
    <div class="chips" role="group" aria-labelledby="pick-lbl" data-chips>
      ${industries.map((d, i) => `<button class="chip" type="button" data-k="${d.key}" aria-pressed="${i === 0}">${icon(d.icon, "ic")}<span>${d.name}</span></button>`).join("")}
    </div>
    <div class="hero__cta"><a class="btn btn--on btn--lg" href="/book-demo/">Book a free demo</a><a class="link" href="/features/">Explore the features</a></div>
  </div>

  <div class="stage" data-stage aria-label="A live office where people clock in, take leave and get paid">
    <div class="stage__rug" aria-hidden="true"></div>
    <div class="wall" aria-hidden="true">
      <svg class="clock" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46"/><line class="hh" x1="50" y1="50" x2="50" y2="28"/><line class="mh" x1="50" y1="50" x2="50" y2="17"/><line class="sh" x1="50" y1="56" x2="50" y2="12"/><circle class="pin" cx="50" cy="50" r="3"/></svg>
    </div>
    ${people.map((p, i) => `<div class="slot" style="--x:${p.x}px;--y:${p.y}px;--s:${p.s};--z:${Math.round(p.y / 3)};--par:${p.s < 1 ? 5 : 12}" data-slot="${i}"><div class="say" data-say aria-live="polite"></div>${who(p, i)}<span class="tag"><b>${p.n}</b><em data-role></em></span></div>`).join("")}
    <div class="tally" aria-label="Today at a glance">
      <span><b data-t="in">412</b> in today</span><span><b data-t="leave">9</b> on leave</span><span><b data-t="swap">3</b> swaps done</span>
    </div>
  </div>
  <div class="pulse" aria-hidden="true"></div>
</section>

<section class="rhythm" aria-labelledby="h-rhythm" data-rhythm>
  <div class="rhythm__copy">
    <h2 id="h-rhythm">Every industry has its own rhythm.</h2>
    <p class="rhythm__lead" data-lead2>${industries[0].lead}</p>
    <p class="rhythm__hint">Touch any need and listen to what it says.</p>
    <div class="chips chips--ink" role="group" aria-label="Industry" data-chips>
      ${industries.map((d, i) => `<button class="chip" type="button" data-k="${d.key}" aria-pressed="${i === 0}">${icon(d.icon, "ic")}<span>${d.name}</span></button>`).join("")}
    </div>
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
    ${roleViews.map(([t, pi, line], i) => `<article class="vw vw--${i + 1}" tabindex="0">
      <div class="vw__who">${who(people[pi], pi, "ppl--bust")}</div>
      <h3>${t}</h3><p>${line}</p></article>`).join("")}
  </div>
</section>

<section class="meet" aria-labelledby="h-meet">
  <div class="meet__in">
    <h2 id="h-meet">Meet your workforce.</h2>
    <p>A 30-minute walkthrough, built around how your industry really works.</p>
    <div class="hero__cta"><a class="btn btn--on btn--lg" href="/book-demo/">Book a free demo</a><a class="link" href="/pricing/">See pricing</a></div>
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
