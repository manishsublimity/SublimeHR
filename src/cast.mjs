import { icon } from "./icons.mjs";
/* The home page characters, shared with the inner pages. */
export const people = [
  { n: "Aisha", skin: "#E8B48C", hair: "#2B1B17", style: "long", shirt: "#E5566D", pants: "#33415F", bw: 80, bh: 98, lean: -2, x: 40, y: 344, s: 1 },
  { n: "Omar", skin: "#B97D52", hair: "#1C1410", style: "cap", shirt: "#FFD05A", pants: "#2F3B52", bw: 92, bh: 92, lean: 2, beard: 1, x: 170, y: 96, s: .84 },
  { n: "Sara", skin: "#F1CBA6", hair: "#6B3A22", style: "bun", shirt: "#9B8CFF", pants: "#3C3A55", bw: 82, bh: 96, lean: -1, glasses: 1, x: 230, y: 344, s: 1 },
  { n: "Ravi", skin: "#9A6238", hair: "#120D0B", style: "curls", shirt: "#45C4B0", pants: "#27324A", bw: 84, bh: 104, lean: 1.5, x: 470, y: 96, s: .84 },
  { n: "Priya", skin: "#D49A6E", hair: "#1A1210", style: "hijab", hijab: "#F7F3FF", shirt: "#7FB4FF", pants: "#35405E", bw: 82, bh: 94, lean: -1.5, x: 600, y: 344, s: 1 },
  { n: "Karan", skin: "#8A5530", hair: "#17100C", style: "cap", shirt: "#FF9FC0", pants: "#2B3350", bw: 90, bh: 94, lean: 2.5, glasses: 1, x: 320, y: 96, s: .84 },
  { n: "Nadia", skin: "#F3D2B3", hair: "#B5651D", style: "long", shirt: "#B8E986", pants: "#3A4565", bw: 78, bh: 96, lean: -2.5, x: 420, y: 344, s: 1 }
];

export const who = (p, i, extra = "") => `<div class="ppl s-${p.style}${p.glasses ? " has-gl" : ""}${p.beard ? " has-bd" : ""} ${extra}" data-hat="none" data-pose="rest" data-item="none" data-outfit="none" style="--skin:${p.skin};--hair:${p.hair};--shirt:${p.shirt};--hijab:${p.hijab || p.hair};--pants:${p.pants};--bw:${p.bw}px;--bh:${p.bh}px;--lean:${p.lean}deg;--d:${(i * -0.7).toFixed(1)}s" data-i="${i}">
  <div class="ppl__fig">
    <div class="ppl__head"><i class="hr"></i><i class="fc"><span class="eye l"><b></b></span><span class="eye r"><b></b></span><i class="gl"></i><span class="ck l"></span><span class="ck r"></span><i class="bd"></i><span class="mo"></span></i><i class="hat"></i></div>
    <div class="ppl__body"><i class="ofit"></i><i class="item"></i></div>
    <i class="arm l"><i class="fa"></i></i><i class="arm r"><i class="fa"></i></i><span class="chest" data-prop></span>
    <div class="ppl__legs"><i></i><i></i></div>
  </div>
</div>`;

/* --- scenes built from the home page characters, for the inner pages --- */
const byName = Object.fromEntries(people.map((p) => [p.n, p]));
const tag = (n, role) => `<span class="ctag"><b>${n}</b> ${role}</span>`;

/* the little office in a page hero: a perspective floor, two or three people with name tags, sticky notes, a wall clock */
export function heroCast(cast, notes = [], clock = true) {
  const slots = cast.map(([name, role, extra = ""], i) => {
    const p = byName[name];
    return `<div class="cslot cs-${i}">${who(p, i, extra)}${tag(name, role)}</div>`;
  }).join("");
  const sticky = notes.map((n, i) => `<span class="cnote cn-${i}">${n}</span>`).join("");
  const clk = clock ? '<span class="cclock" aria-hidden="true"><i class="h"></i><i class="m"></i></span>' : "";
  return `<div class="cast cscene" aria-hidden="true"><span class="cfloor"></span>${clk}${sticky}${slots}</div>`;
}

/* a crowd for the closing band */
export function crowd(names = ["Aisha", "Omar", "Sara", "Ravi", "Priya", "Karan", "Nadia"]) {
  return `<div class="cast ccrowd" aria-hidden="true">${names.map((n, i) => `<div class="cpal cp-${i}">${who(byName[n], i + 2)}</div>`).join("")}<span class="cground"></span></div>`;
}


/* before / after as one living card: a switch, a card that changes colour, and a person who is stressed and then relieved */
export function baSwitch(m) {
  const pains = ["Spreadsheets & paper forms", "Manual re-keying between systems", "The same HR questions, every day"];
  return `<div class="bax cast" data-bax data-state="before">
  <div class="bax__tabs" role="group" aria-label="Before and after"><button type="button" data-s="before" aria-pressed="true">Before</button><button type="button" data-s="after" aria-pressed="false">With SublimeHR</button><i aria-hidden="true"></i></div>
  <div class="bax__stage">
    <div class="bax__card">
      <div class="bax__pane is-before"><h3>The old way</h3><p>${m.problem}</p><ul>${pains.map((x) => `<li>${icon("close")}<span>${x}</span></li>`).join("")}</ul></div>
      <div class="bax__pane is-after"><h3>With SublimeHR</h3><p>${m.solution}</p><ul>${m.benefits.slice(0, 3).map((x) => `<li>${icon("check")}<span>${x}</span></li>`).join("")}</ul></div>
    </div>
    <div class="bax__who" aria-hidden="true">
      <span class="bax__say"><b class="b">Where is that file again?</b><b class="a">Found it. One click.</b></span>
      <span class="bnote bn-0">Final_v7.xlsx</span><span class="bnote bn-1">Who has the form?</span><span class="bnote bn-2">Re-type it</span>
      <span class="bspark bs-0"></span><span class="bspark bs-1"></span><span class="bspark bs-2"></span>
      ${who(byName["Priya"], 3)}
      <span class="bax__floor"></span>
    </div>
  </div>
  <script>(function(){var r=document.currentScript.parentNode,t=r.querySelectorAll("[data-s]"),iv;function set(s){r.setAttribute("data-state",s);t.forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.s===s))})}t.forEach(function(b){b.addEventListener("click",function(){clearInterval(iv);set(b.dataset.s)})});if(!matchMedia("(prefers-reduced-motion: reduce)").matches)iv=setInterval(function(){set(r.getAttribute("data-state")==="before"?"after":"before")},4800)})();</script>
</div>`;
}
