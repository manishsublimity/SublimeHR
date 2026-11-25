import { industriesModulePage, pricingModulePage } from "./modpage.mjs";
import { site, modules, reports, why, industries, integrations, plans, compare, customAreas, process, faqs } from "./data.mjs";
import { page, phero, sHead, cta, btn, squiggle, icon, esc, softwareLd, faqLd, crumbLd, TONES } from "./layout.mjs";
import { heroCast, crowd, baSwitch, capSpot, flipCards } from "./cast.mjs";
import { modulePage } from "./modpage.mjs";
import { clockW, leaveW, payrollW, permW, hereW, rosterW, letterW, visitorW, storyW, chatW, homeFaqItems, vsCompare, heroArt, moduleWidget } from "./widgets.mjs";

const more8 = (base, ids) => { const out = [...base], seen = new Set(out.map(([q]) => q)); for (const id of ids) for (const qa of faqs.find((g) => g.id === id).items) { if (out.length >= 8) break; if (!seen.has(qa[0])) { seen.add(qa[0]); out.push(qa); } } return out; };
const bySlug = Object.fromEntries(modules.map((m) => [m.slug, m]));
const GROUP_ICON = { Productivity: "layers", Communication: "message", Hardware: "fingerprint", Developer: "code", Accounting: "wallet", ERP: "building", Security: "lock" };
const allInts = integrations.flatMap((g) => g.items.map((it) => [...it, g.group]));
const INT_COLORS = ["#2F72B8", "#2A9C93", "#E9805F", "#7A6FD0", "#D9A21B", "#4A86C8", "#C2577A", "#4C9A5B", "#5F7389", "#3FBDB3", "#245C97", "#8F6BD6"];
const TINT_C = [["#2F72B8", "#E4EFFC"], ["#17736B", "#DDF5F1"], ["#8A6300", "#FFF2C9"], ["#B9452A", "#FFE8DF"], ["#5847C9", "#EBE7FF"]];

const sticker = (cls, dotBg, ic, text, rot = "-3deg") => `<span class="sticker ${cls}" style="--rot:${rot}" aria-hidden="true"><span class="dot" style="background:${dotBg}">${icon(ic)}</span>${text}</span>`;
const ticker = (words, alt = false) => {
  const run = words.map((w) => `<span>${w}${icon("sparkles")}</span>`).join("");
  return `<div class="ticker${alt ? " alt" : ""}"><div class="ticker__track">${run}${run}</div></div>`;
};
const modCard = (m, i) => `<a class="mod tint-${i % 5} rv" style="--d:${(i % 5) * 50}ms" href="/software/${m.slug}/">
  <span class="ico">${icon(m.icon)}</span><h3>${m.name}</h3><p>${m.tagline}</p>
  <span class="go">Try the demo ${icon("arrow")}</span>
  <span class="more" aria-hidden="true"><strong>${m.name}</strong><ul>${m.features.slice(0, 4).map((f) => `<li>${f}</li>`).join("")}</ul><span class="go">Open live demo ${icon("arrow")}</span></span>
</a>`;

/* Curved, non-crossing wave ribbon */
function waveRibbon() {
  const a = modules.map((m, i) => (i % 3 === 1 ? `<tspan class="y">${m.name}</tspan>` : m.name)).join("  ✦  ") + "  ✦  ";
  const b = ["Hire to retire", "Attendance to payroll", "Admin to self-service", "English & Arabic", "Mobile ready", "Role-based security", "13 reports"].join("  ✦  ") + "  ✦  ";
  const reps = (t, cls) => `<tspan class="rep">${t}</tspan><tspan>${t}</tspan><tspan>${t}</tspan>`;
  return `<div class="wave" aria-hidden="true"><svg viewBox="0 0 1440 230" preserveAspectRatio="xMidYMid slice">
    <defs><path id="wvA" d="M -160 168 C 220 92, 520 92, 760 140 S 1260 188, 1600 116"/><path id="wvB" d="M -160 112 C 220 36, 520 36, 760 84 S 1260 132, 1600 60"/></defs>
    <use href="#wvB" class="rb rb2"/><use href="#wvA" class="rb rb1"/>
    <text class="t2"><textPath href="#wvB" startOffset="-1600" data-dir="-1">${reps(b)}<animate attributeName="startOffset" from="-1600" to="0" dur="34s" repeatCount="indefinite"/></textPath></text>
    <text class="t1"><textPath href="#wvA" startOffset="0" data-dir="1">${reps(a)}<animate attributeName="startOffset" from="0" to="-1600" dur="34s" repeatCount="indefinite"/></textPath></text>
  </svg></div>`;
}

/* ---------------- Home playground ---------------- */
const PG = [
  ["attendance-management", "clock", "Attendance", () => clockW({ slider: true }), "Slide your arrival time, then punch in. Grace periods, late flags and GPS checks happen on their own."],
  ["leave-management", "calendar", "Leave", leaveW, "Pick two dates. Weekends and holidays are skipped, your balance updates, and the approval routes itself."],
  ["payroll", "wallet", "Payroll", payrollW, "Move the sliders and watch attendance, overtime and penalties flow straight into the payslip."],
  ["security-access", "shield", "Permissions", permW, "Switch roles and toggle access. The preview shows exactly what that person can see and do."],
  ["shift-scheduling", "repeat", "Roster", rosterW, "Click shifts to rotate them. Coverage is checked live so no day is ever understaffed."],
  ["reports-analytics", "chart", "Who's in", hereW, "Scrub through the morning and watch your live attendance board fill up."]
];
function playground() {
  return `<div data-w="tabs">
  <div class="pg-tabs rv" role="tablist" aria-label="Product demos">
    ${PG.map(([slug, ic, n], i) => `<button class="pg-tab" role="tab" id="pt-${slug}" aria-controls="pp-${slug}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span class="ico ${TONES[i % 5]}">${icon(ic)}</span>${n}</button>`).join("")}
  </div>
  ${PG.map(([slug, , n, w, blurb], i) => {
    const m = bySlug[slug];
    return `<div class="pg-panel${i === 0 ? " is-on" : ""}" role="tabpanel" id="pp-${slug}" aria-labelledby="pt-${slug}"${i === 0 ? "" : " hidden"}>
      <div><p class="eyebrow ${["", "mint", "butter", "peach"][i % 4]}"><i></i>${n}</p><h3>${m.tagline}.</h3><p class="lead">${blurb}</p><ul class="checks mt2">${m.benefits.slice(0, 3).map((b) => `<li>${b}</li>`).join("")}</ul><div class="hero__cta">${btn(`Explore ${m.name}`, `/software/${slug}/`, { alt: true, sm: true })}</div></div>
      <div>${w()}</div>
    </div>`;
  }).join("")}
</div>`;
}

function indBody(ind) {
  return `<div><span class="eyebrow"><i></i>${ind.name}</span><h3>HR software for ${ind.name.toLowerCase()}</h3><p class="lead">${ind.blurb}</p><ul class="checks mt2">${ind.how.map((h) => `<li>${h}</li>`).join("")}</ul>
      <div class="hero__cta">${btn(`Get a ${ind.name} demo`, `/book-demo/?industry=${encodeURIComponent(ind.name)}`, { sm: true })}</div></div>
    <div class="scene">
      <span class="hero-ico" aria-hidden="true">${icon(ind.icon)}</span>
      <p class="h6">Recommended modules</p>
      ${ind.modules.map((s) => `<a class="mod-link" href="/software/${s}/"><span class="ico sm">${icon(bySlug[s].icon)}</span><span><strong>${bySlug[s].name}</strong><small>${bySlug[s].short}</small></span>${icon("arrow")}</a>`).join("")}
    </div>`;
}
/* Home: auto-playing carousel (swipe, arrows, pills, progress) */
function industryPicker() {
  return `<div class="icar rv" data-w="icar">
  <div class="icar__nav">
    <button class="icar__arrow prev" type="button" data-prev aria-label="Previous industry">${icon("arrow")}</button>
    <div class="icar__pills" role="tablist" aria-label="Industries">
      ${industries.map((ind, i) => `<button class="ind-pill" role="tab" id="it-${ind.id}" aria-controls="ic-${ind.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-i="${i}"><span class="ico ${TONES[i % 5]}">${icon(ind.icon)}</span>${ind.name}</button>`).join("")}
    </div>
    <button class="icar__arrow next" type="button" data-next aria-label="Next industry">${icon("arrow")}</button>
  </div>
  <div class="icar__stage" aria-live="polite">
    ${industries.map((ind, i) => `<section class="ind-card${i === 0 ? " is-on" : ""}" role="tabpanel" id="ic-${ind.id}" aria-labelledby="it-${ind.id}"${i === 0 ? "" : ' aria-hidden="true"'}>${indBody(ind)}</section>`).join("")}
  </div>
  <div class="icar__bar" aria-hidden="true"><span></span></div>
</div>`;
}
/* Industries page: cards stack as you scroll */
function industryStack() {
  return `<div class="istack">
  <nav class="istack__nav" data-spy aria-label="Industries">
    ${industries.map((ind, i) => `<a class="ind-pill" href="#${ind.id}"><span class="ico ${TONES[i % 5]}">${icon(ind.icon)}</span>${ind.name}</a>`).join("")}
  </nav>
  <div class="istack__cards" data-stack>
    ${industries.map((ind) => `<section class="ind-card stack-card" id="${ind.id}" aria-label="${ind.name}">${indBody(ind)}</section>`).join("")}
  </div>
</div>`;
}

/* =====================================================================
   HOME
   ===================================================================== */
export function home() {
  const hf = homeFaqItems();
  const body = `
<section class="hero">
  <div class="container hero__grid">
    <div>
      <p class="eyebrow butter rv"><i></i>HR for people, not paperwork</p>
      <h1 class="hero-title rv" style="--d:60ms">Powering your ${squiggle("worklife")}.</h1>
      <p class="lead rv" style="--d:120ms">A complete HR platform for workforce management — from hire to retire, attendance to payroll, and admin to employee self-service.</p>
      <div class="hero__cta rv" style="--d:180ms">${btn("Book a free demo", "/book-demo/")}${btn("Play with it live", "#playground", { alt: true, ic: "play" })}</div>
      <div class="proof rv" style="--d:240ms">
        <span class="avs" aria-hidden="true"><span style="background:#2EA79D">AK</span><span style="background:#E9805F">PR</span><span style="background:#4A86C8">OM</span><span style="background:#7A6FD0">JL</span></span>
        <p><b>70+ feature areas · 13 reports</b><br>Admin &amp; employee panels · English &amp; العربية</p>
      </div>
    </div>
    <div class="hero__visual rv pop" style="--d:160ms">
      ${clockW()}
      ${sticker("s1", "var(--teal)", "check", "Leave approved", "-4deg")}
      ${sticker("s2", "var(--blue)", "wallet", "Payroll ready · 412", "3deg")}
      ${sticker("s3", "var(--coral)", "alert", "Late? Auto-flagged", "-2deg")}
    </div>
  </div>
</section>
<div class="tickers" aria-hidden="true">
  ${ticker(modules.map((m) => m.name))}
  ${ticker(["Hire to retire", "Attendance to payroll", "Admin to self-service", "English & Arabic", "Mobile ready", "Role-based security", "13 reports"], true)}
</div>

<section class="section" id="movie">
  <div class="container">
    ${storyW({ intro: sHead({ eyebrow: "20-second tour", tone: "peach", title: `A day at work, <span class="mark">minus the admin</span>.`, lead: "Sign in, clock in, apply leave and grab a payslip — all from the employee app.", left: true }) })}
  </div>
</section>

<section class="section cream" id="playground">
  <div class="container">
    ${sHead({ eyebrow: "Live playground", tone: "mint", title: `Don't take our word for it — <span class="mark mint">play with it.</span>`, lead: "These are working mini versions of SublimeHR. Click, drag and toggle away." })}
    ${playground()}
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="stats">
      <div class="stat-card rv">${icon("layers")}<strong data-count="70" data-suffix="+">70+</strong><span>Feature areas</span><small>From hire to retire</small></div>
      <div class="stat-card rv" style="--d:60ms">${icon("chart")}<strong data-count="13">13</strong><span>Built-in reports</span><small>Audit-ready, exportable</small></div>
      <div class="stat-card rv" style="--d:120ms">${icon("users")}<strong data-count="2">2</strong><span>User panels</span><small>Admin / HR &amp; Employee</small></div>
      <div class="stat-card rv" style="--d:180ms">${icon("globe")}<strong>EN·AR</strong><span>Two languages</span><small>Full LTR &amp; RTL</small></div>
    </div>
  </div>
</section>

<section class="section flush">
  <div class="container">
    <div class="head-row">${sHead({ eyebrow: "10 modules", title: `One employee record. <span class="mark sky">Ten superpowers.</span>`, left: true })}${btn("See all features", "/features/", { alt: true })}</div>
    <div class="mods">${modules.map(modCard).join("")}</div>
  </div>
</section>

<section class="section cream">
  <div class="container">
    ${sHead({ eyebrow: "Why teams switch", tone: "butter", title: "Little things that make HR feel effortless." })}
    <div class="grid g3">${why.map(([ic, t, d], i) => `<div class="card hov rv" style="--d:${(i % 3) * 60}ms"><span class="ico ${TONES[i % 5]}">${icon(ic)}</span><h3 class="h4">${t}</h3><p>${d}</p></div>`).join("")}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    ${sHead({ eyebrow: "Industries", title: "Shaped around how your industry works.", lead: "Pick your industry — see the modules and workflows that fit it." })}
    ${industryPicker()}
  </div>
</section>

<section class="section cream">
  <div class="container">
    ${sHead({ eyebrow: "Questions", tone: "peach", title: `Got questions? <span class="mark">Ask away.</span>`, lead: "Our assistant answers instantly — a real human replies within one business day." })}
    ${chatW(hf, { suggest: 8 })}
  </div>
</section>

${cta()}
`;
  return page({
    title: "SublimeHR — Cloud HR, Attendance, Leave & Payroll Software",
    description: "SublimeHR powers your worklife: employee management, attendance, leave, shift scheduling, payroll, reports and self-service in one HR platform. 70+ features, 13 reports, English & Arabic. Try it live.",
    path: "/", active: "home", ld: [softwareLd, faqLd(hf)], body
  });
}

/* =====================================================================
   FEATURES
   ===================================================================== */
export function features() {
  const trail = [["Home", "/"], ["Features", "/features/"]];
  const fw = { ...moduleWidget, "employee-self-service": leaveW, "mobile-workforce": () => clockW() };
  const body = `
${phero({ eyebrow: "Product", title: `Ten modules. ${squiggle("One record.")}`, lead: "Every module shares the same employee data — so nothing is entered twice. Each one below has a live demo you can try.", trail, actions: btn("Book a demo", "/book-demo/") + btn("See pricing", "/pricing/", { alt: true }) })}
<section class="section tight">
  <div class="container"><div class="mods">${modules.map((m, i) => modCard(m, i).replace(`href="/software/${m.slug}/"`, `href="#${m.slug}"`)).join("")}</div></div>
</section>
${modules.map((m, i) => `<section class="section${i % 2 ? "" : " cream"}" id="${m.slug}">
  <div class="container split" style="align-items:start">
    <div class="rv" ${i % 2 ? 'style="order:2"' : ""}>
      <span class="ico ${TONES[i % 5]}">${icon(m.icon)}</span>
      <h2 class="mt2">${m.name}</h2>
      <p class="lead">${m.tagline}. ${m.summary}</p>
      <ul class="checks mt2">${m.benefits.map((b) => `<li>${b}</li>`).join("")}</ul>
      <div class="hero__cta">${btn(`Explore ${m.name}`, `/software/${m.slug}/`, { sm: true })}</div>
    </div>
    <div class="rv pop" style="--d:100ms">${fw[m.slug]()}</div>
  </div>
</section>`).join("")}
<section class="section" id="reports">
  <div class="container narrow">
    ${sHead({ eyebrow: "Reports", tone: "mint", title: "13 report types, ready on day one" })}
    <div class="table-wrap rv"><table class="table"><thead><tr><th>Report</th><th>What it's for</th></tr></thead><tbody>${reports.map(([r, p]) => `<tr><td>${r}</td><td class="muted">${p}</td></tr>`).join("")}</tbody></table></div>
  </div>
</section>
${cta({ title: "Have a workflow we don't cover yet?", lead: "We build custom modules, approvals and integrations that fit — not force — your process.", primary: ["Explore custom development", "/custom-development/"], secondary: ["Talk to our team", "/contact/"] })}
`;
  return page({
    title: "HR Software Features — Attendance, Leave, Payroll & More",
    description: "All SublimeHR modules with live demos: employee management, attendance, leave, payroll, reports, self-service, mobile, security, shift scheduling and visitor management.",
    path: "/features/", active: "features",
    ld: [crumbLd(trail), { "@type": "ItemList", name: "SublimeHR modules", itemListElement: modules.map((m, i) => ({ "@type": "ListItem", position: i + 1, name: m.name, url: `${site.url}/software/${m.slug}/` })) }],
    body
  });
}

/* =====================================================================
   MODULE DETAIL
   ===================================================================== */
const FAQ_MAP = { "employee-management": ["getting-started", "security"], "attendance-management": ["attendance"], "leave-management": ["leave"], payroll: ["payroll"], "reports-analytics": ["reports"], "employee-self-service": ["mobile-integrations", "getting-started"], "mobile-workforce": ["mobile-integrations"], "security-access": ["security"], "shift-scheduling": ["attendance", "implementation"], "visitor-management": ["security", "implementation"] };
export function moduleFaqs(m) {
  const out = [...m.faqs], seen = new Set(out.map(([q]) => q));
  for (const id of [...(FAQ_MAP[m.slug] || []), "getting-started", "implementation", "security"]) for (const qa of faqs.find((g) => g.id === id).items) { if (out.length >= 8) break; if (!seen.has(qa[0])) { seen.add(qa[0]); out.push(qa); } }
  return out;
}
const WIDE = ["leave-management", "payroll", "security-access", "employee-management", "visitor-management", "employee-self-service", "mobile-workforce"];
const CASTS = [
  [["Priya", "HR partner"], ["Sara", "QA lead"], ["Omar", "Designer"]],
  [["Aisha", "Developer"], ["Ravi", "Team manager"], ["Nadia", "Intern"]],
  [["Karan", "Finance"], ["Priya", "HR partner"], ["Omar", "Designer"]],
  [["Sara", "QA lead"], ["Aisha", "Developer"], ["Karan", "Finance"]]
];
function moduleCast(m, idx) {
  const cut = (f) => (f.length > 30 ? f.slice(0, 28).replace(/[\s,&-]+\S*$/, "") + "…" : f);
  const cast = CASTS[idx % CASTS.length].map((c, i) => (i === 0 ? [c[0], c[1], "ppl--wave"] : c));
  return heroCast(cast, [m.features[0], m.features[1]], [cut(m.benefits[0]), cut(m.benefits[1] || m.features[2]), cut(m.benefits[2] || m.features[3])]);
}
export function moduleDetail(m) {
  const path = `/software/${m.slug}/`;
  const trail = [["Home", "/"], ["Features", "/features/"], [m.name, path]];
  const faqItems = moduleFaqs(m);
  const graph = [crumbLd(trail), faqLd(faqItems), { "@type": "Service", name: `${m.name} Software`, serviceType: m.name, provider: { "@id": site.url + "/#organization" }, description: m.summary, url: site.url + path }];
  const ld = `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>`;
  return modulePage(m, faqItems, ld);
}

/* =====================================================================
   INDUSTRIES
   ===================================================================== */
export function industriesPage() {
  const trail = [["Home", "/"], ["Industries", "/industries/"]];
  const ld = `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": [crumbLd(trail)] })}</script>`;
  return industriesModulePage([], ld);
}
export function industriesPageOld() {
  const trail = [["Home", "/"], ["Industries", "/industries/"]];
  const art = `<div class="art t1" aria-hidden="true">
    ${sticker("a1", "var(--blue)", "factory", "3-shift plants")}
    ${sticker("a2", "var(--teal)", "health", "24/7 wards", "3deg")}
    ${sticker("a3", "var(--coral)", "truck", "Field crews", "-2deg")}
    <div class="art__core">${icon("building")}</div>
    <div class="stat-bub"><small>9 industries</small>One platform, configured for each</div>
  </div>`;
  const body = `
${phero({ eyebrow: "Industries", tone: "mint", title: `Built for the way ${squiggle("you work.")}`, lead: "From shop floors to hospital wards, SublimeHR adapts to your shifts, sites and policies.", trail, aside: art })}
<section class="section"><div class="container">${industryStack()}</div></section>
<section class="section cream">
  <div class="container">
    ${sHead({ eyebrow: "At a glance", tone: "butter", title: "Nine industries. One platform." })}
    <div class="grid g3 ind-glance">${industries.map((ind, i) => `<a class="card hov rv" style="--d:${(i % 3) * 60}ms;--c:${TINT_C[i % 5][0]};--cbg:${TINT_C[i % 5][1]}" href="#${ind.id}"><span class="ico">${icon(ind.icon)}</span><h3 class="h4">${ind.name}</h3><p>${ind.blurb}</p><span class="link">See how ${icon("arrow")}</span></a>`).join("")}</div>
  </div>
</section>
${cta({ title: "Don't see your industry?", lead: "Our rules engine and custom development cover almost any workforce. Tell us how your teams work.", primary: ["Talk to an HR expert", "/contact/"], secondary: ["Custom development", "/custom-development/"] })}
`;
  return page({ title: "HR Software by Industry — Manufacturing, Healthcare, Retail & More", description: "SublimeHR for manufacturing, healthcare, IT, education, hospitality, retail, logistics, professional services and construction.", path: "/industries/", active: "industries", ld: [crumbLd(trail)], body });
}

/* =====================================================================
   PRICING
   ===================================================================== */
export function pricing() {
  const trail = [["Home", "/"], ["Pricing", "/pricing/"]];
  const items = more8(faqs.find((g) => g.id === "pricing").items, ["implementation", "getting-started"]);
  const ld = `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": [crumbLd(trail), faqLd(items)] })}</script>`;
  return pricingModulePage(items, ld);
}
export function pricingOld() {
  const trail = [["Home", "/"], ["Pricing", "/pricing/"]];
  const pf = faqs.find((g) => g.id === "pricing").items;
  const cell = (v, hl) => `<td class="c${hl ? " hl" : ""}${v === 1 ? " yes" : v === 0 ? " no" : ""}">${v === 1 ? "✓<span class=\"vh\">Included</span>" : v === 0 ? "—<span class=\"vh\">Not included</span>" : v}</td>`;
  const rate = { Starter: 4, Professional: 8 };
  const ctaHref = { Starter: "/get-pricing/?plan=Starter", Professional: "/book-demo/?plan=Professional", Enterprise: "/get-pricing/?plan=Enterprise" };
  const body = `
${phero({ eyebrow: "Pricing", tone: "butter", title: `Simple pricing. ${squiggle("No surprises.")}`, lead: "Pay only for active employees. Free onboarding and data migration on every plan. Cancel anytime.", trail })}
<section class="section">
  <div class="container" data-w="price">
    <div class="calc2 rv">
      <div>
        <span class="h6">Your team size</span>
        <div class="calc2__num"><output data-out="emp">120</output><span>employees</span><div class="avstack" data-avs aria-hidden="true"></div></div>
      </div>
      <div class="calc2__right">
        <label class="vh" for="emp">Number of employees</label><input id="emp" type="range" data-r="emp" min="5" max="1000" step="5" value="120">
        <div class="calc2__row"><div class="quick pills" role="group" aria-label="Quick pick">${[10, 50, 100, 250, 500, 1000].map((n) => `<button type="button" class="pill" data-n="${n}" aria-pressed="false">${n === 1000 ? "1000+" : n}</button>`).join("")}</div>
        <p class="note mb0"><span style="display:inline-flex;transform:rotate(180deg)">${icon("arrow-up")}</span>Estimated monthly cost updates on every plan below</p></div>
      </div>
    </div>
    <div class="plans">
      ${plans.map((p, i) => `<div class="plan${p.featured ? " pop" : ""} rv" style="--d:${i * 80}ms">
        ${p.featured ? `<span class="ribbon">★ Most loved</span>` : ""}
        <h2><span class="ico sm ${TONES[i]}">${icon(["rocket", "zap", "building"][i])}</span>${p.name}</h2>
        <p class="desc">${p.desc}</p>
        <div class="price"><strong>${p.price}</strong><span>${p.unit}</span></div>
        <div class="est num" data-est="${rate[p.name] || 0}" data-cap="${p.name === "Starter" ? 50 : 0}">${rate[p.name] ? "" : "Tailored quote for your team"}</div>
        <a class="btn${p.featured ? "" : " alt"} block" href="${ctaHref[p.name]}">${p.cta[0]} <span class="bub">${icon("arrow")}</span></a>
        <p class="inc">${p.includes || "What's included"}</p>
        <ul class="checks">${p.items.map((x) => `<li>${x}</li>`).join("")}</ul>
      </div>`).join("")}
    </div>
    <p class="center sm muted mt3">Prices in USD per active user per month. Local currency and annual billing available on request.</p>
  </div>
</section>
<section class="section cream">
  <div class="container">
    ${sHead({ eyebrow: "Compare", title: "Every detail, side by side" })}
    <div class="table-wrap rv"><table class="table"><thead><tr><th>Feature</th><th class="c">Starter</th><th class="c hl">Professional</th><th class="c">Enterprise</th></tr></thead>
    <tbody>${compare.map(([f, a, b, c]) => `<tr><td>${f}</td>${cell(a)}${cell(b, true)}${cell(c)}</tr>`).join("")}</tbody></table></div>
  </div>
</section>
<section class="section">
  <div class="container">
    ${sHead({ eyebrow: "Billing questions", tone: "peach", title: "Ask about pricing" })}
    ${chatW(more8(pf, ["implementation", "getting-started"]), { title: "Pricing assistant", suggest: 8 })}
  </div>
</section>
${cta({ title: "Start with the plan that fits today.", lead: "Upgrade any time as your team grows — your data and settings move with you.", primary: ["Get a custom quote", "/get-pricing/"], secondary: ["Chat on WhatsApp", site.whatsapp] })}
`;
  return page({ title: "Pricing — HR & Payroll Software from $4 per User", description: "SublimeHR pricing: Starter $4/user/month, Professional $8/user/month, Enterprise custom. Estimate your cost instantly. Free onboarding and migration.", path: "/pricing/", active: "pricing", ld: [crumbLd(trail), softwareLd, faqLd(more8(pf, ["implementation", "getting-started"]))], body });
}

/* =====================================================================
   INTEGRATIONS
   ===================================================================== */
export function integrationsPage() {
  const trail = [["Home", "/"], ["Integrations", "/integrations/"]];
  const groups = [...new Set(allInts.map((x) => x[3]))];
  const short = { "Google Workspace": "Google", "Microsoft 365": "Microsoft 365", "Microsoft Teams": "Teams", "Biometric Devices": "Biometrics", "REST APIs": "REST API", "Okta / SAML SSO": "Okta SSO", "SAP ERP": "SAP", "Oracle ERP": "Oracle" };
  const r1 = allInts.slice(0, 6), r2 = allInts.slice(6, 12);
  const orb = (arr, n) => arr.map(([, name, , g], i) => { const a = (i / arr.length) * Math.PI * 2; return `<span class="op" style="left:${50 + 50 * Math.cos(a)}%;top:${50 + 50 * Math.sin(a)}%"><i style="background:${INT_COLORS[(i + n) % INT_COLORS.length]}">${icon(GROUP_ICON[g])}</i>${short[name] || name}</span>`; }).join("");
  const body = `
${phero({ eyebrow: "Integrations", tone: "mint", title: `Plays nicely with ${squiggle("your stack.")}`, lead: "SublimeHR sits at the centre of your HR stack — syncing with the chat, identity, accounting and ERP tools your team already uses.", trail,
  aside: `<div class="orbit" aria-hidden="true"><div class="orbit__ring">${orb(r1, 0)}</div><div class="orbit__ring r2">${orb(r2, 6)}</div><div class="orbit__c"><img src="${site.logo}" alt="" width="54" height="48"><small>Your HR hub</small></div></div>` })}
<section class="section">
  <div class="container" data-w="filter">
    ${sHead({ eyebrow: "Browse by category", title: "12 native integrations + an open REST API" })}
    <div class="int-filter row c rv" role="group" aria-label="Filter integrations"><button type="button" class="pill" data-f="all" aria-pressed="true">All</button>${groups.map((g) => `<button type="button" class="pill" data-f="${g}" aria-pressed="false">${g}</button>`).join("")}</div>
    <div class="grid g3">
      ${allInts.map(([, n, d, g], i) => `<div class="int-card rv" style="--d:${(i % 3) * 50}ms" data-g="${g}"><span class="mk" style="background:${INT_COLORS[i % INT_COLORS.length]}">${icon(GROUP_ICON[g])}</span><div><h3>${n}</h3><p>${d}</p><span class="chip mt1">${g}</span></div></div>`).join("")}
    </div>
    <div class="int-cta rv"><div><b>Need another tool?</b><span>We build custom integrations to any REST-based system — legacy ERPs, LMS and internal tools included.</span></div>${btn("Request an integration", "/contact/?topic=Integration")}</div>
  </div>
</section>
`;
  return page({ title: "Integrations — Slack, Teams, Google, Microsoft 365, Tally, SAP & More", description: "SublimeHR integrates with Google Workspace, Microsoft 365, Slack, Teams, Zoom, biometric devices, QuickBooks, Tally, SAP, Oracle, Okta/SAML SSO and any system via REST API.", path: "/integrations/", active: "integrations", ld: [crumbLd(trail)], body });
}

/* =====================================================================
   CUSTOM DEVELOPMENT
   ===================================================================== */
export function customDev() {
  const trail = [["Home", "/"], ["Custom Development", "/custom-development/"]];
  const cf = faqs.find((g) => g.id === "custom-development").items;
  const art = `<div class="art t4" aria-hidden="true">
    ${sticker("a1", "var(--blue)", "workflow", "Custom approvals")}
    ${sticker("a2", "var(--teal)", "dollar", "Payroll rules", "3deg")}
    ${sticker("a3", "var(--coral)", "plug", "Legacy ERP sync", "-2deg")}
    <div class="art__core">${icon("code")}</div>
    <div class="stat-bub"><small>How we work</small>Fixed price · demo every 2 weeks</div>
  </div>`;
  const body = `
${phero({ eyebrow: "Custom development", tone: "butter", title: `Your HR is unique. ${squiggle("So is ours.")}`, lead: "Every organization has quirks off-the-shelf software can't solve. We ship custom modules, workflows and integrations that fit — not force — your process.", trail, actions: btn("Request a custom feature", "/contact/?topic=Custom%20development") + btn("Book a consultation", "/book-demo/", { alt: true }), aside: art })}
<section class="section">
  <div class="container">
    ${sHead({ eyebrow: "Where we customize", title: "Built around how you actually work." })}
    <div class="grid g3">${customAreas.map(([ic, t, d], i) => `<div class="card hov rv" style="--d:${(i % 3) * 60}ms"><span class="ico ${TONES[i % 5]}">${icon(ic)}</span><h3 class="h4">${t}</h3><p>${d}</p></div>`).join("")}</div>
  </div>
</section>
<section class="section cream">
  <div class="container">
    ${sHead({ eyebrow: "Process", tone: "mint", title: "From idea to go-live, in four stops.", lead: "Fixed pricing, transparent milestones and a demo every two weeks." })}
    <ol class="road rv" data-road>${process.map(([t, d], i) => `<li><span class="pin">0${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join("")}</ol>
  </div>
</section>
<section class="section">
  <div class="container">${sHead({ eyebrow: "Quick answers", tone: "peach", title: "Custom work, answered." })}${chatW(more8(cf, ["implementation", "mobile-integrations"]), { title: "Solutions assistant", suggest: 8 })}</div>
</section>
${cta({ title: "Tell us about the workflow you need.", lead: "Get a solution design with a timeline and fixed pricing.", primary: ["Schedule a consultation", "/book-demo/"], secondary: ["Describe your workflow", "/contact/?topic=Custom%20development"] })}
`;
  return page({ title: "Custom HRMS Development — Workflows, Payroll Rules & Integrations", description: "Custom HR software development by SublimeHR: approval workflows, payroll rules, attendance policies, dashboards, integrations and AI automation with fixed pricing.", path: "/custom-development/", active: "company", ld: [crumbLd(trail), faqLd(more8(cf, ["implementation", "mobile-integrations"]))], body });
}

/* =====================================================================
   ABOUT
   ===================================================================== */
export function about() {
  const trail = [["Home", "/"], ["About", "/about/"]];
  const offer = [["clock", "Attendance management"], ["calendar", "Leave & holidays"], ["repeat", "Shift scheduling"], ["users", "Employee directory"], ["wallet", "Payroll support"], ["chart", "Reports & analytics"], ["lock", "Role-based access"], ["phone", "Mobile accessibility"], ["cloud", "Secure cloud platform"]];
  const reasons = ["Simple and intuitive user experience", "Designed for businesses of all sizes", "Secure cloud infrastructure", "Scalable as your organization grows", "Reliable customer support", "Continuous product improvements"];
  const body = `
${phero({ eyebrow: "About us", tone: "mint", title: `Workforce management, ${squiggle("made simple.")}`, lead: "At SublimeHR, we believe managing your workforce should be simple, efficient, and accessible from anywhere.", trail })}
<section class="section">
  <div class="container split">
    <div class="rv">
      <p class="eyebrow butter"><i></i>Our story</p>
      <h2>One platform for the work behind your people.</h2>
      <p class="lead">SublimeHR helps businesses streamline attendance, leave, shift scheduling, employee records, payroll and day-to-day HR operations — through a single, intuitive platform.</p>
      <p>Whether you're a growing startup, a mid-sized business or a large enterprise, our goal is to eliminate manual processes, reduce admin overhead, and give your team more time for what matters most: growing your business.</p>
    </div>
    <div class="stats rv pop" style="grid-template-columns:1fr 1fr">
      <div class="stat-card"><strong data-count="70" data-suffix="+">70+</strong><span>Feature areas</span></div>
      <div class="stat-card"><strong data-count="13">13</strong><span>Report types</span></div>
      <div class="stat-card"><strong data-count="9">9</strong><span>Industries</span></div>
      <div class="stat-card"><strong>EN·AR</strong><span>Languages</span></div>
    </div>
  </div>
</section>
<section class="section cream">
  <div class="container">
    ${sHead({ eyebrow: "What we offer", title: "The essentials to run your workforce." })}
    <div class="grid g3">${offer.map(([ic, t], i) => `<div class="card hov rv row" style="--d:${(i % 3) * 50}ms;flex-wrap:nowrap;padding:18px"><span class="ico ${TONES[i % 5]}">${icon(ic)}</span><h3 class="h5" style="margin:0">${t}</h3></div>`).join("")}</div>
  </div>
</section>
<section class="section">
  <div class="container grid g3" style="align-items:stretch">
    <div class="card rv"><p class="eyebrow butter"><i></i>Why SublimeHR</p><h3 class="h3">Built to help you move faster, with confidence.</h3><ul class="checks mt2">${reasons.map((r) => `<li>${r}</li>`).join("")}</ul></div>
    <div class="card tint-sky hov rv" style="--d:60ms"><span class="ico">${icon("target")}</span><h3 class="h3">Our mission</h3><p style="font-size:1rem;color:var(--text)">To simplify workforce management with reliable, secure and easy-to-use technology that improves productivity, transparency and operational efficiency.</p></div>
    <div class="card tint-mint hov rv" style="--d:120ms"><span class="ico">${icon("eye")}</span><h3 class="h3">Our vision</h3><p style="font-size:1rem;color:var(--text)">To become a trusted workforce management solution that empowers organizations worldwide to build more connected, efficient and productive workplaces.</p></div>
  </div>
</section>
${cta({ title: "Let's talk about your workforce.", lead: "Interested in learning more or scheduling a demo? We reply within one business day.", primary: ["Book a demo", "/book-demo/"], secondary: ["Contact us", "/contact/"] })}
`;
  return page({ title: "About SublimeHR — Our Mission & Vision", description: "SublimeHR is a modern workforce management platform that streamlines attendance, leave, shift scheduling, employee records and payroll. Learn about our mission and vision.", path: "/about/", active: "company", ld: [crumbLd(trail), { "@type": "AboutPage", name: "About SublimeHR", url: site.url + "/about/", about: { "@id": site.url + "/#organization" } }], body });
}

/* =====================================================================
   FAQ (topic rail + assistant)
   ===================================================================== */
export function faqPage() {
  const trail = [["Home", "/"], ["FAQ", "/faq/"]];
  const all = faqs.flatMap((g) => g.items.map(([q, a]) => [q, a, g.id]));
  const body = `
${phero({ eyebrow: "FAQ", tone: "peach", title: `Ask us ${squiggle("anything.")}`, lead: `${all.length} answers on features, security, pricing and more — pick a topic, then ask our HR assistant.`, trail })}
<section class="section">
  <div class="container faq-wrap" data-w="faqcats">
    <nav class="topics rv" aria-label="FAQ topics">
      ${faqs.map((g, i) => `<button type="button" class="topic" data-c="${g.id}" aria-pressed="${i === 0}"><span class="ico ${TONES[(i + 1) % 5]}">${icon(g.icon)}</span><b>${g.title}</b><em>${g.items.length}</em></button>`).join("")}
    </nav>
    <div class="rv" style="--d:80ms">${chatW(all, { suggest: 12, inline: true })}</div>
  </div>
</section>
${cta({ title: "Still have questions?", lead: "Talk to a real HR expert — we usually reply within one business day, or instantly on WhatsApp.", primary: ["Contact us", "/contact/"], secondary: ["Chat on WhatsApp", site.whatsapp] })}
`;
  return page({ title: "FAQ — SublimeHR Questions & Answers", description: "Answers to 50 questions about SublimeHR: getting started, attendance, leave, payroll, reports, security, custom development, pricing, implementation, mobile and integrations.", path: "/faq/", active: "company", ld: [crumbLd(trail), faqLd(all.map(([q, a]) => [q, a]))], body });
}

/* =====================================================================
   FORM PAGES: Book a demo · Get pricing · Contact
   ===================================================================== */
const CODES = [["+91", "🇮🇳 +91"], ["+971", "🇦🇪 +971"], ["+966", "🇸🇦 +966"], ["+974", "🇶🇦 +974"], ["+965", "🇰🇼 +965"], ["+968", "🇴🇲 +968"], ["+973", "🇧🇭 +973"], ["+44", "🇬🇧 +44"], ["+1", "🇺🇸 +1"]];
const opt = (arr) => arr.map((v) => `<option>${v}</option>`).join("");
const fld = {
  name: `<div class="field" data-validate><label for="f-name">Your name <span class="req">*</span></label><input class="input" id="f-name" name="name" required autocomplete="name" placeholder="Full name"><span class="err">Please enter your name.</span></div>`,
  company: (req = true) => `<div class="field"${req ? " data-validate" : ""}><label for="f-company">Company${req ? ' <span class="req">*</span>' : ""}</label><input class="input" id="f-company" name="company"${req ? " required" : ""} autocomplete="organization" placeholder="Company name"><span class="err">Please enter your company.</span></div>`,
  email: `<div class="field" data-validate><label for="f-email">Work email <span class="req">*</span></label><input class="input" id="f-email" name="email" type="email" required autocomplete="email" placeholder="you@company.com"><span class="err">Please enter a valid email.</span></div>`,
  phone: `<div class="field" data-validate><label for="f-phone">Phone <span class="req">*</span></label><div class="tel"><select class="select" name="cc" aria-label="Country code">${CODES.map(([v, l]) => `<option value="${v}">${l}</option>`).join("")}</select><input class="input" id="f-phone" name="phone" type="tel" required autocomplete="tel-national" inputmode="tel" placeholder="98765 43210"></div><span class="err">Please enter a valid phone number.</span></div>`,
  size: (req = false) => `<div class="field"${req ? " data-validate" : ""}><label for="f-size">Employees${req ? ' <span class="req">*</span>' : ""}</label><select class="select" id="f-size" name="size"${req ? " required" : ""}><option value="">Select size</option>${opt(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"])}</select><span class="err">Please choose your team size.</span></div>`,
  industry: `<div class="field"><label for="f-industry">Industry</label><select class="select" id="f-industry" name="industry"><option value="">Select industry</option>${opt(industries.map((i) => i.name))}<option>Other</option></select></div>`,
  modules: (label) => `<div class="field full"><span class="label">${label}</span><div class="tchips">${modules.map((m) => `<label><input type="checkbox" name="modules" value="${m.slug}"><span>${m.name}</span></label>`).join("")}</div></div>`,
  msg: (label, req = false, ph = "") => `<div class="field full"${req ? " data-validate" : ""}><label for="f-msg">${label}${req ? ' <span class="req">*</span>' : ""}</label><textarea class="textarea" id="f-msg" name="message"${req ? " required" : ""} placeholder="${ph}"></textarea><span class="err">Please write a short message.</span></div>`
};
const switcher = (cur) => `<div class="form-switch rv" style="--d:200ms" aria-label="Other ways to reach us">
  <a href="/book-demo/"${cur === "demo" ? ' aria-current="page"' : ""}><span class="ico">${icon("play")}</span>Book a demo</a>
  <a href="/get-pricing/"${cur === "pricing" ? ' aria-current="page"' : ""}><span class="ico mint">${icon("dollar")}</span>Get pricing</a>
  <a href="/contact/"${cur === "contact" ? ' aria-current="page"' : ""}><span class="ico peach">${icon("message")}</span>Contact us</a>
</div>`;
const success = `<div class="form-success" id="form-success" role="status" aria-live="polite">
  <span class="ok">${icon("check")}</span>
  <h2 class="h3">You're all set! 🎉</h2>
  <p class="muted" id="success-msg">An HR specialist will reach out within 1 business day. We've also sent a confirmation to your email.</p>
  <div class="hero__cta">${btn("Message us on WhatsApp", site.whatsapp, { ic: "message", blank: true }).replace('<a class="btn"', '<a class="btn" id="wa-followup"')}${btn("Back to home", "/", { alt: true })}</div>
</div>`;
const formWrap = (intent, title, sub, fields, submit) => `<div class="form-card rv">
  <form id="contact-form" novalidate data-endpoint="${site.formEndpoint}" aria-describedby="form-note">
    <input type="hidden" name="intent" value="${intent}">
    <h2>${title}</h2><p class="sm muted" style="margin-bottom:16px">${sub}</p>
    <div class="form-grid">
      ${fields}
      <div style="position:absolute;left:-9999px" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>
      <div class="full">
        <div class="form-error" id="form-error" role="alert" tabindex="-1" hidden></div>
        <button class="btn block" type="submit"><span data-submit-label>${submit}</span> <span class="bub">${icon("send")}</span></button>
        <p class="hint center mt1" id="form-note">By submitting, you agree to our <a href="/privacy/">Privacy Policy</a>.</p>
      </div>
    </div>
  </form>
  ${success}
</div>`;
const contactLines = `<a class="c-line rv" href="${site.phoneHref}"><span class="ico">${icon("call")}</span><span><small>Call us</small><strong>${site.phone}</strong></span>${icon("arrow")}</a>
  <a class="c-line rv" style="--d:60ms" href="${site.whatsapp}" target="_blank" rel="noopener"><span class="ico mint">${icon("message")}</span><span><small>Chat with us</small><strong>WhatsApp</strong></span>${icon("arrow")}</a>`;

function formPage({ kind, path, crumb, eyebrow, tone, title, lead, form, side, seo }) {
  const trail = [["Home", "/"], [crumb, path]];
  const body = `
${phero({ eyebrow, tone, title, lead, trail, extra: switcher(kind) })}
<section class="section tight">
  <div class="container fp">
    ${form}
    <aside class="fp-side">${side}</aside>
  </div>
</section>`;
  return page({ title: seo[0], description: seo[1], path, active: "company", ld: [crumbLd(trail), { "@type": "ContactPage", name: seo[0], url: site.url + path }], body });
}

export function bookDemo() {
  return formPage({
    kind: "demo", path: "/book-demo/", crumb: "Book a demo", eyebrow: "Book a demo", tone: "", title: `See SublimeHR ${squiggle("live.")}`,
    lead: "A personalized 30-minute walkthrough with your policies, your shifts and your questions.",
    form: formWrap("book_demo", "Book your demo", "Pick a day — we'll confirm the exact time by email or WhatsApp.",
      `${fld.name}${fld.company()}${fld.email}${fld.phone}${fld.size()}${fld.industry}
      <div class="field"><label for="f-date">Preferred date</label><input class="input" id="f-date" name="demo_date" type="date"></div>
      <div class="field"><span class="label">Preferred time</span><div class="tchips" role="radiogroup" aria-label="Preferred time"><label><input type="radio" name="slot" value="Morning" checked><span>Morning</span></label><label><input type="radio" name="slot" value="Afternoon"><span>Afternoon</span></label><label><input type="radio" name="slot" value="Evening"><span>Evening</span></label></div></div>
      ${fld.modules("What would you like to see? (optional)")}
      ${fld.msg("Anything we should prepare? (optional)", false, "Locations, current HR software, special workflows…")}`, "Book my demo"),
    side: `<div class="card tint-sky rv"><p class="h6" style="color:var(--blue-ink)">Your 30 minutes</p><ol class="agenda"><li><b>0–5</b>Your goals &amp; current process</li><li><b>5–20</b>Live tour tailored to your team</li><li><b>20–25</b>Pricing &amp; rollout plan</li><li><b>25–30</b>Your questions, answered</li></ol></div>
      <div class="card tint-mint rv" style="--d:60ms"><p class="h6" style="color:var(--teal-ink)">Included on every plan</p><ul class="checks"><li>Free onboarding &amp; data migration</li><li>Admin &amp; employee training</li><li>No credit card to start</li></ul></div>
      ${contactLines}`,
    seo: ["Book a Demo — See SublimeHR Live", "Book a free 30-minute SublimeHR demo tailored to your workforce: attendance, leave, payroll and self-service."]
  });
}

export function getPricing() {
  return formPage({
    kind: "pricing", path: "/get-pricing/", crumb: "Get pricing", eyebrow: "Get pricing", tone: "mint", title: `Get a quote ${squiggle("for your team.")}`,
    lead: "Tell us your team size and the modules you need — we'll send a clear, all-inclusive quote.",
    form: formWrap("request_quote", "Request your quote", "Takes about a minute. No commitment, no spam.",
      `${fld.name}${fld.company()}${fld.email}${fld.phone}${fld.size(true)}${fld.industry}
      <div class="field full"><span class="label">Plan you're considering</span><div class="mini-plans" role="radiogroup" aria-label="Plan" style="grid-template-columns:repeat(3,1fr)">${["Starter", "Professional", "Enterprise", "Not sure"].slice(0, 3).map((p, i) => `<label><input type="radio" name="plan" value="${p}"${i === 1 ? " checked" : ""}><span>${p}<small>${["$4/user", "$8/user", "Custom"][i]}</small></span></label>`).join("")}</div></div>
      ${fld.modules("Modules you need")}
      <div class="field full"><label for="f-custom">Customization needed?</label><select class="select" id="f-custom" name="customization"><option value="">Select</option>${opt(["No", "Minor changes", "Significant customization", "Not sure yet"])}</select></div>
      ${fld.msg("Anything else for the quote? (optional)", false, "Branches, billing currency, integrations…")}`, "Get my quote"),
    side: `<div class="card tint-butter rv"><p class="h6" style="color:var(--butter-ink)">Plans at a glance</p><div class="mini-plans">${plans.map((p) => `<span style="display:flex;justify-content:space-between;padding:10px 12px;border-radius:12px;background:var(--glass);font-weight:700;color:var(--ink)">${p.name}<small class="muted">${p.price} ${p.unit}</small></span>`).join("")}</div><a class="link mt2" href="/pricing/">Compare plans ${icon("arrow")}</a></div>
      <div class="card tint-mint rv" style="--d:60ms"><p class="h6" style="color:var(--teal-ink)">Every quote includes</p><ul class="checks"><li>Pay only for active employees</li><li>Free onboarding &amp; data migration</li><li>Monthly or annual billing</li></ul></div>
      ${contactLines}`,
    seo: ["Get Pricing — Request a SublimeHR Quote", "Request a SublimeHR quote for your team size and modules. Pay only for active employees, with free onboarding and migration."]
  });
}

export function contact() {
  return formPage({
    kind: "contact", path: "/contact/", crumb: "Contact", eyebrow: "Contact us", tone: "peach", title: "Let's talk.",
    lead: "Questions, support, partnerships or anything else — we reply within 1 business day.",
    form: formWrap("contact_sales", "Send us a message", "We'll get back to you by email or phone.",
      `${fld.name}${fld.email}${fld.phone}${fld.company(false)}
      <div class="field full"><label for="f-topic">Topic</label><select class="select" id="f-topic" name="topic">${opt(["General question", "Sales", "Support", "Custom development", "Integration", "Partnership"])}</select></div>
      ${fld.msg("Your message", true, "How can we help?")}`, "Send message"),
    side: `${contactLines}
      <div class="shortcuts rv"><p class="h6">Looking for something specific?</p><div class="shortcuts__grid">
        <a href="/book-demo/"><span class="ico">${icon("play")}</span>Book a demo<small>30-min tour</small></a>
        <a href="/get-pricing/"><span class="ico mint">${icon("dollar")}</span>Get pricing<small>Team quote</small></a>
        <a href="/faq/"><span class="ico butter">${icon("message")}</span>FAQ<small>50 answers</small></a>
      </div></div>`,
    seo: ["Contact SublimeHR", "Contact SublimeHR for questions, support or partnerships. Call +91-7976117684 or chat on WhatsApp. We reply within 1 business day."]
  });
}

/* =====================================================================
   LEGAL & 404
   ===================================================================== */
function legal({ title, path, intro, sections, description }) {
  const trail = [["Home", "/"], [title, path]];
  const body = `
${phero({ title, lead: intro, trail })}
<section class="section"><div class="container"><article class="prose">
<p class="sm muted">Last updated: November 2026</p>
${sections.map(([h, ps]) => `<h2>${h}</h2>${ps.map((p) => (Array.isArray(p) ? `<ul>${p.map((x) => `<li>${x}</li>`).join("")}</ul>` : `<p>${p}</p>`)).join("")}`).join("")}
<h2>Contact</h2><p>Questions about this page? Call <a href="${site.phoneHref}">${site.phone}</a> or <a href="/contact/">contact us</a>.</p>
</article></div></section>`;
  return page({ title, description, path, active: "", ld: [crumbLd(trail)], body });
}
export function privacy() {
  return legal({ title: "Privacy Policy", path: "/privacy/", description: "How SublimeHR collects, uses and protects personal information on our website and platform.", intro: "How we collect, use and protect your information.", sections: [
    ["Information we collect", ["When you fill in a form on our website we collect the details you provide, such as your name, company, work email, phone number and message.", "Our customers' HR data processed in the SublimeHR platform is handled under the agreement with each customer."]],
    ["How we use information", [["To respond to demo, quote and sales requests", "To provide, support and improve our services", "To send service-related communication you have asked for"]]],
    ["Data security", ["We use secure cloud infrastructure, encrypted connections, role-based access control, multi-factor authentication and tenant isolation to protect data."]],
    ["Sharing", ["We do not sell personal information. We share it only with service providers who help us operate our services, or where required by law."]],
    ["Your rights", ["You may request access to, correction of, or deletion of your personal information by contacting us."]]] });
}
export function terms() {
  return legal({ title: "Terms & Conditions", path: "/terms/", description: "Terms and conditions for using the SublimeHR website and services.", intro: "The terms that apply when you use our website and services.", sections: [
    ["Use of the website", ["By using this website you agree to these terms. Content is provided for general information about SublimeHR products and services."]],
    ["Subscriptions", ["Use of the SublimeHR platform is governed by the subscription agreement or order form agreed with each customer. Monthly plans are month-to-month; annual plans run for 12 months with auto-renewal."]],
    ["Intellectual property", ["The SublimeHR name, logo, software and website content are the property of SublimeHR and may not be used without permission."]],
    ["Limitation of liability", ["To the extent permitted by law, SublimeHR is not liable for indirect or consequential losses arising from use of this website."]],
    ["Changes", ["We may update these terms from time to time. The latest version will always be available on this page."]]] });
}
export function notFound() {
  const body = `${phero({ eyebrow: "Error 404", tone: "peach", title: `This page is ${squiggle("on leave.")}`, lead: "Its balance says 0 days, but it left anyway. Let's get you somewhere useful.", actions: btn("Back to home", "/") + btn("Try the live demos", "/#playground", { alt: true, ic: "play" }) })}`;
  return page({ title: "Page not found", description: "The page you are looking for could not be found.", path: "/404.html", active: "", noindex: true, body });
}
