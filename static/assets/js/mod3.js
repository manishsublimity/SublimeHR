/* Live demos for the module pages: each plays by itself, and stops the moment the visitor touches it. */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var esc = function (s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); };
  var fmt = function (n) { return Math.round(n).toLocaleString("en-US"); };
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, reduce ? 0 : ms); }); };

  /* runs tick() every ms while the demo is on screen and nobody has taken over */
  function drive(box, tick, ms, state) {
    var timer, shown = false, idle;
    function start() { clearInterval(timer); if (shown && !state.taken && !reduce) timer = setInterval(tick, ms); }
    function take() { state.taken = true; clearInterval(timer); clearTimeout(idle); idle = setTimeout(function () { state.taken = false; start(); }, 26000); }
    ["pointerdown", "keydown", "focusin"].forEach(function (ev) { box.addEventListener(ev, function (e) { if (e.isTrusted) take(); }); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { shown = es[0].isIntersecting; if (shown) { if (!state.started) { state.started = true; tick(); } start(); } else clearInterval(timer); }, { threshold: .35 }).observe(box);
    else { shown = true; tick(); start(); }
  }
  function say(box, t) { var b = $("[data-dsay]", box); if (b) b.textContent = t; }

  /* ---------- punch: the home clock-in card, playing by itself ---------- */
  function punch(box) {
    var st = { taken: false }, scanner = $("[data-scan]", box), lbl = $("[data-scan-lbl]", box), img = $("[data-scan-img]", box), cntEl = $("[data-cnt]", box), flash = $(".flash", scanner);
    var checks = $$("[data-checks] li", box), status = $("[data-status]", box), c0 = $("[data-c0]", box), c1 = $("[data-c1]", box), arr = $("[data-arr]", box), arrOut = $("[data-arr-out]", box);
    var geo = $("[data-geo]", box), modes = $$("[data-mode]", box), sample = $("[data-sample]", box), feed = $("[data-feed]", box), today = $("[data-today]", box);
    var mode = "fp", has = false, busy = false, n = { in: 38, late: 2, out: 0 }, names = ["Omar", "Sara", "Ravi", "Priya", "Karan", "Nadia", "Aisha", "John"], ni = 0;
    var hm = function (m) { return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };
    var modeMap = { fp: ["Fingerprint matched", "Press to clock in", "Fingerprint"], selfie: ["Selfie matched", "", "Selfie"], gps: ["Location shared", "Check my location", "GPS"] };
    function sampleFace() {
      var cv = document.createElement("canvas"); cv.width = cv.height = 200; var g = cv.getContext("2d");
      g.fillStyle = "#CDE0FF"; g.fillRect(0, 0, 200, 200); g.fillStyle = "#FF8A70"; g.beginPath(); g.ellipse(100, 200, 70, 50, 0, 0, 7); g.fill();
      g.fillStyle = "#2B1B17"; g.beginPath(); g.ellipse(100, 100, 56, 66, 0, 0, 7); g.fill(); g.fillStyle = "#E8B48C"; g.beginPath(); g.ellipse(100, 104, 42, 50, 0, 0, 7); g.fill();
      g.fillStyle = "#2B1B17"; g.beginPath(); g.ellipse(100, 70, 46, 24, 0, Math.PI, 0); g.fill();
      g.fillStyle = "#fff"; [80, 120].forEach(function (x) { g.beginPath(); g.ellipse(x, 104, 9, 10, 0, 0, 7); g.fill(); }); g.fillStyle = "#14213D"; [82, 122].forEach(function (x) { g.beginPath(); g.arc(x, 106, 4.5, 0, 7); g.fill(); });
      g.strokeStyle = "#7A3B30"; g.lineWidth = 4; g.lineCap = "round"; g.beginPath(); g.arc(100, 124, 14, .2, Math.PI - .2); g.stroke(); return cv.toDataURL("image/png");
    }
    function setMode(m) {
      mode = m; modes.forEach(function (x) { x.setAttribute("aria-checked", x.getAttribute("data-mode") === m ? "true" : "false"); });
      scanner.setAttribute("data-m", m); scanner.classList.remove("ok", "bad", "at-in", "at-out", "scan"); c0.textContent = modeMap[m][0]; lbl.textContent = modeMap[m][1];
      sample.hidden = m !== "selfie"; scanner.classList.toggle("has-img", m === "selfie" && has); img.hidden = !(m === "selfie" && has);
    }
    function stats() { $$("[data-n]", box).forEach(function (e) { e.textContent = n[e.dataset.n]; }); }
    function addFeed(nm, how, time, cls, txt) {
      var li = document.createElement("li"); li.innerHTML = "<i>" + nm.slice(0, 2).toUpperCase() + "</i><span><b>" + nm + "</b><small>" + how + "</small></span><em>" + time + '</em><u class="' + cls + '">' + txt + "</u>";
      feed.insertBefore(li, feed.firstChild); while (feed.children.length > 5) feed.removeChild(feed.lastChild);
    }
    function runScan() {
      if (busy) return; busy = true; var m = +arr.value, inside = geo.getAttribute("aria-checked") === "true", selfie = mode === "selfie", d = selfie ? 1500 : 0, who = names[ni++ % names.length];
      checks.forEach(function (c) { c.className = ""; }); status.textContent = "Checking"; scanner.classList.remove("ok", "bad", "at-in", "at-out"); scanner.classList.add("scan"); lbl.textContent = selfie ? "Hold still" : "Scanning...";
      if (selfie) {
        img.hidden = true; [3, 2, 1].forEach(function (k, i) { setTimeout(function () { cntEl.textContent = k; cntEl.classList.remove("on"); void cntEl.offsetWidth; cntEl.classList.add("on"); }, i * 430); });
        setTimeout(function () { cntEl.classList.remove("on"); cntEl.textContent = ""; flash.classList.remove("go"); void flash.offsetWidth; flash.classList.add("go"); img.hidden = false; }, 1290);
      }
      setTimeout(function () { checks[0].classList.add("on"); }, d + 700); setTimeout(function () { checks[1].classList.add("on"); if (!inside) checks[1].classList.add("late"); }, d + 1200);
      setTimeout(function () {
        var cls, txt, lb, em = $("em", today), fcls, ftxt;
        scanner.classList.remove("scan"); scanner.classList.add(inside ? "at-in" : "at-out");
        if (!inside) { cls = "on late"; txt = "Rejected: outside the fence"; lb = "Rejected"; scanner.classList.add("bad"); em.textContent = "Rejected"; em.className = "late"; $("b", today).textContent = "--:--"; fcls = "late"; ftxt = "Rejected"; n.out++; }
        else {
          if (m <= 540) { cls = "on"; txt = "On time, " + hm(m); lb = "On time"; scanner.classList.add("ok"); fcls = "ok"; ftxt = "On time"; }
          else if (m <= 555) { cls = "on grace"; txt = "Within grace, no deduction"; lb = "Grace window"; scanner.classList.add("ok"); fcls = "ok"; ftxt = "Grace"; }
          else { cls = "on late"; txt = "Late by " + (m - 540) + " min"; lb = "Late"; scanner.classList.add("bad"); fcls = "late"; ftxt = "Late"; n.late++; }
          $("b", today).textContent = hm(m); em.textContent = lb; em.className = m <= 540 ? "ok" : m <= 555 ? "gr" : "late"; n.in++; addFeed(who, modeMap[mode][2], hm(m), fcls, ftxt);
        }
        if (!inside) addFeed(who, modeMap[mode][2], hm(m), "late", "Rejected");
        stats(); status.textContent = txt; checks[2].className = cls; lbl.textContent = lb; say(box, who + ": " + txt + "."); today.classList.remove("pulse-in"); void today.offsetWidth; today.classList.add("pulse-in"); busy = false;
      }, d + 1900);
    }
    function press() { if (mode === "selfie" && !has) { img.src = sampleFace(); has = true; scanner.classList.add("has-img"); img.hidden = true; } runScan(); }
    modes.forEach(function (b) { b.addEventListener("click", function () { if (!busy) setMode(b.getAttribute("data-mode")); }); });
    arr.addEventListener("input", function () { arrOut.textContent = hm(+arr.value); }); arrOut.textContent = hm(+arr.value);
    geo.addEventListener("click", function () { var on = geo.getAttribute("aria-checked") !== "true"; geo.setAttribute("aria-checked", on ? "true" : "false"); c1.textContent = on ? "GPS 12 m, inside Head Office" : "GPS 340 m away, outside the fence"; });
    sample.addEventListener("click", function () { img.src = sampleFace(); has = true; scanner.classList.add("has-img"); runScan(); });
    scanner.addEventListener("click", press);
    addFeed("Karan", "Selfie", "09:11", "late", "Late"); addFeed("Nadia", "GPS", "08:58", "ok", "On time"); addFeed("Priya", "Fingerprint", "08:47", "ok", "On time"); stats();
    var plan = [["fp", 532, 1], ["selfie", 541, 1], ["gps", 531, 1], ["gps", 548, 0], ["fp", 566, 1]], pi = 0;
    drive(box, async function () {
      if (busy) return; var p = plan[pi++ % plan.length]; setMode(p[0]); arr.value = p[1]; arrOut.textContent = hm(p[1]);
      geo.setAttribute("aria-checked", p[2] ? "true" : "false"); c1.textContent = p[2] ? "GPS 12 m, inside Head Office" : "GPS 340 m away, outside the fence";
      say(box, p[0] === "fp" ? "Thumb on the scanner." : p[0] === "selfie" ? "Smile for the camera." : p[2] ? "Sharing my location." : "I am at the cafe next door."); await wait(900); if (!st.taken) press();
    }, 6200, st);
  }

  /* ---------- leave ---------- */
  function leave(box) {
    var st = { taken: false }, cal = $("[data-cal]", box), cards = $$("[data-k]", box), msg = $("[data-lmsg]", box), apply = $("[data-apply]", box), stamp = $("[data-stamp]", box), chain = $$("[data-ch]", box);
    var sT = $("[data-s-type]", box), sD = $("[data-s-dates]", box), sN = $("[data-s-days]", box), sA = $("[data-s-after]", box), sB = $("[data-sbar]", box);
    var days = [], a = null, b = null, typeIdx = 0, names = ["Annual", "Sick", "Comp-off"], bals = [14, 6, 2], tots = [14, 8, 4], timers = [];
    var wd = ["S", "M", "T", "W", "T", "F", "S"], off = 3, N = 30, hol = { 10: 1 };
    var html = wd.map(function (w) { return "<small>" + w + "</small>"; }).join("");
    for (var i = 0; i < off; i++) html += "<i></i>";
    for (var d = 1; d <= N; d++) { var dow = (off + d - 1) % 7; html += '<button type="button" data-d="' + d + '" class="' + (dow === 0 || dow === 6 ? "we" : hol[d] ? "ho" : "") + '">' + d + "</button>"; }
    cal.innerHTML = html; days = $$("[data-d]", cal);
    function working(x, y) { var c = 0; for (var d = x; d <= y; d++) { var dw = (off + d - 1) % 7; if (dw !== 0 && dw !== 6 && !hol[d]) c++; } return c; }
    function paint() {
      days.forEach(function (e) { var d = +e.dataset.d, on = a && b ? d >= a && d <= b : a === d; e.classList.toggle("sel", !!on); });
      var w = a && b ? working(a, b) : 0, after = Math.max(0, bals[typeIdx] - w);
      cards.forEach(function (c, k) { var left = k === typeIdx ? after : bals[k]; $("[data-lb]", c).textContent = left; $("[data-lbar]", c).style.width = (left / tots[k] * 100) + "%"; });
      sT.textContent = names[typeIdx] + " leave"; sD.textContent = !a ? "No dates yet" : !b ? a + " Apr, then pick the last day" : (a === b ? a + " Apr" : a + " to " + b + " Apr"); sN.textContent = w; sA.textContent = after; sB.style.width = (after / tots[typeIdx] * 100) + "%";
      msg.textContent = !a ? "Pick a start and an end date." : !b ? "Now pick the last day." : w + " working day" + (w === 1 ? "" : "s") + ". Weekends and holidays are skipped.";
      apply.disabled = !(a && b);
    }
    function reset() { timers.forEach(clearTimeout); timers = []; stamp.classList.remove("on"); chain.forEach(function (c) { c.classList.remove("on"); }); }
    function pick(d) { reset(); if (!a || (a && b)) { a = d; b = null; } else { b = Math.max(a, d); a = Math.min(a, d); } paint(); }
    function setType(i) { typeIdx = i; cards.forEach(function (x, k) { x.setAttribute("aria-pressed", String(k === i)); }); a = b = null; reset(); paint(); }
    days.forEach(function (e) { e.addEventListener("click", function () { pick(+e.dataset.d); }); });
    cards.forEach(function (p, i) { p.addEventListener("click", function () { setType(i); }); });
    apply.addEventListener("click", function () {
      reset(); chain[0].classList.add("on"); msg.textContent = "Request sent to Priya."; say(box, "Sent!");
      timers.push(setTimeout(function () { chain[1].classList.add("on"); msg.textContent = "Priya approved it in one tap."; say(box, "Approved!"); stamp.classList.add("on"); }, 900));
      timers.push(setTimeout(function () { chain[2].classList.add("on"); msg.textContent = "Cover found. Payroll and the team calendar are updated."; }, 1800));
    });
    paint();
    var script = [[7, 9], [16, 17], [22, 24]], si = 0, busy = false;
    drive(box, async function () {
      if (busy) return; busy = true; var s = script[si++ % script.length]; setType(si > 1 ? si % 3 : 0);
      say(box, "Picking dates…"); await wait(700); if (st.taken) { busy = false; return; } pick(s[0]); await wait(900); if (st.taken) { busy = false; return; } pick(s[1]); await wait(1100); if (st.taken) { busy = false; return; } apply.click(); await wait(3600); if (!st.taken) { a = b = null; reset(); paint(); } busy = false;
    }, 9600, st);
  }

  /* ---------- payroll ---------- */
  function payroll(box) {
    var st = { taken: false }, sl = $$("[data-s]", box), out = $$("[data-o]", box), lines = $("[data-lines]", box), net = $("[data-net]", box), split = $$("[data-split] i", box);
    function calc() {
      var basic = +sl[0].value, ot = +sl[1].value, ul = +sl[2].value, allow = basic * .25, otp = basic / 160 * 1.25 * ot, ded = basic / 26 * ul, total = basic + allow + otp - ded;
      out[0].textContent = fmt(basic); out[1].textContent = ot + " h"; out[2].textContent = ul + " d";
      lines.innerHTML = [["Basic", fmt(basic)], ["Allowances (25%)", "+" + fmt(allow)], ["Overtime " + ot + " h", "+" + fmt(otp)], ["Unpaid leave " + ul + " d", "-" + fmt(ded)]].map(function (r, i) { return '<li class="' + (i === 3 ? "neg" : "") + '"><span>' + r[0] + "</span><b>" + r[1] + "</b></li>"; }).join("");
      net.textContent = fmt(total); var sum = basic + allow + otp; split[0].style.width = (basic / sum * 100) + "%"; split[1].style.width = (allow / sum * 100) + "%"; split[2].style.width = (otp / sum * 100) + "%";
    }
    sl.forEach(function (s) { s.addEventListener("input", calc); }); calc();
    var targets = [[5200, 12, 0], [3800, 4, 2], [6400, 20, 1], [4200, 6, 1]], ti = 0;
    drive(box, function () { var tg = targets[ti++ % targets.length]; var from = sl.map(function (s) { return +s.value; }), t0 = performance.now(); say(box, ["Overtime counted.", "Unpaid leave deducted.", "Slip updated.", "Net pay ready."][ti % 4]); (function step(now) { var p = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - p, 3); sl.forEach(function (s, i) { s.value = Math.round((from[i] + (tg[i] - from[i]) * e) / (+s.step || 1)) * (+s.step || 1); }); calc(); if (p < 1 && !st.taken) requestAnimationFrame(step); })(t0); }, 2800, st);
  }

  /* ---------- chart ---------- */
  function chart(box) {
    var st = { taken: false }, pills = $$("[data-k]", box), ch = $("[data-chart]", box), ax = $("[data-axis]", box), title = $("[data-ititle]", box), txt = $("[data-itext]", box), chips = $("[data-ichips]", box);
    var D = [{ t: "Late arrivals by weekday", x: ["Mon", "Tue", "Wed", "Thu", "Fri"], v: [14, 6, 5, 7, 12], u: "", p: "Mondays and Fridays are the worst. Share the report with department heads.", c: ["Mon +8%", "Fri +5%"] }, { t: "Attendance this month, by week", x: ["W1", "W2", "W3", "W4"], v: [94, 96, 93, 97], u: "%", p: "Attendance is steady at 95%. Week 3 dipped around the holiday.", c: ["95% average", "Week 3 dip"] }, { t: "Payroll cost by department", x: ["Ops", "Sales", "IT", "HR", "Fin"], v: [38, 24, 18, 11, 9], u: "k", p: "Operations is 38% of cost. Overtime is the fastest-growing line.", c: ["Ops 38%", "OT +6%"] }], cur = 0;
    function show(i) {
      cur = i; pills.forEach(function (b, k) { b.setAttribute("aria-pressed", String(k === i)); }); var d = D[i], mx = Math.max.apply(null, d.v);
      ch.innerHTML = d.v.map(function (v, k) { return '<div class="bar"><b>' + v + d.u + '</b><i style="--h:' + (v / mx * 100) + '%;--d:' + (k * 70) + 'ms"></i></div>'; }).join("");
      ax.innerHTML = d.x.map(function (x) { return "<span>" + x + "</span>"; }).join(""); title.textContent = d.t; txt.textContent = d.p; chips.innerHTML = d.c.map(function (c) { return "<em>" + c + "</em>"; }).join("");
      ch.classList.remove("dmgo"); void ch.offsetWidth; ch.classList.add("dmgo"); say(box, ["Mondays hurt.", "Looking steady.", "Ops costs most."][i]);
    }
    pills.forEach(function (b, i) { b.addEventListener("click", function () { show(i); }); }); show(0);
    drive(box, function () { show((cur + 1) % 3); }, 4200, st);
  }

  /* ---------- phone ---------- */
  function phone(box) {
    var st = { taken: false }, steps = $$("[data-st]", box), scr = $$("[data-sc]", box), cur = 0, token = 0;
    function show(i, press) {
      cur = i; token++; var t = token; steps.forEach(function (b, k) { b.setAttribute("aria-pressed", String(k === i)); }); scr.forEach(function (s, k) { s.classList.toggle("on", k === i); s.classList.remove("pressed"); });
      say(box, ["Good morning!", "Planning a break.", "It's approved!", "Payslip ready."][i % 4] || "Tap a step.");
      if (press) setTimeout(function () { if (t === token) scr[i].classList.add("pressed"); }, 1400);
    }
    steps.forEach(function (b, i) { b.addEventListener("click", function () { show(i, true); }); });
    scr.forEach(function (s) { $("[data-cta]", s).addEventListener("click", function () { s.classList.add("pressed"); }); });
    show(0, true);
    drive(box, function () { show((cur + 1) % scr.length, true); }, 4200, st);
  }

  /* ---------- roles ---------- */
  function roles(box) {
    var st = { taken: false }, pills = $$("[data-k]", box), rows = $$("[data-a]", box), P = [[1, 1, 0, 0, 0], [1, 1, 0, 1, 0], [1, 1, 1, 1, 0], [1, 1, 1, 1, 1]], R = ["Employee", "Manager", "HR", "Admin"], A = ["Attendance", "Leave", "Payroll", "Reports", "Settings"], cur = 0, perms = P.map(function (x) { return x.slice(); });
    var title = $("[data-stitle]", box), text = $("[data-stext]", box), chips = $("[data-schips]", box), badge = $("[data-badge]", box);
    function paint() {
      var p = perms[cur]; rows.forEach(function (r, i) { var sw = $(".sw", r); sw.setAttribute("aria-checked", String(!!p[i])); r.classList.toggle("on", !!p[i]); });
      var open = A.filter(function (a, i) { return p[i]; }), shut = A.filter(function (a, i) { return !p[i]; });
      title.textContent = R[cur]; text.textContent = "Can open " + open.length + " of 5 areas" + (shut.length ? " and cannot see " + shut.join(", ") + "." : ". Full access.");
      chips.innerHTML = open.map(function (a) { return "<em class='y'>" + a + "</em>"; }).join("") + shut.map(function (a) { return "<em class='n'>" + a + "</em>"; }).join("");
      badge.classList.toggle("full", cur === 3); say(box, shut.length ? R[cur] + ": limited view." : R[cur] + ": full access.");
    }
    function pick(i) { cur = i; pills.forEach(function (b, k) { b.setAttribute("aria-pressed", String(k === i)); }); paint(); }
    pills.forEach(function (b, i) { b.addEventListener("click", function () { pick(i); }); });
    rows.forEach(function (r, i) { $(".sw", r).addEventListener("click", function () { perms[cur][i] = perms[cur][i] ? 0 : 1; paint(); }); });
    pick(0); drive(box, function () { pick((cur + 1) % 4); }, 3200, st);
  }

  /* ---------- roster ---------- */
  function roster(box) {
    var st = { taken: false }, grid = $("[data-grid]", box), cover = $("[data-cover]", box), ct = $("[data-ctitle]", box), cx = $("[data-ctext]", box);
    var names = ["Karan", "Ravi", "Sara", "Nadia", "Omar"], dn = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], S = ["M", "E", "N", "O"];
    var data = [[0, 0, 1, 1, 0, 3, 3], [1, 1, 0, 0, 0, 0, 3], [0, 3, 0, 0, 1, 1, 3], [3, 0, 1, 1, 0, 0, 0], [2, 2, 3, 0, 1, 1, 0]];
    function paint() {
      var h = "<span></span>" + dn.map(function (d) { return "<small>" + d + "</small>"; }).join("");
      data.forEach(function (r, i) { h += "<b>" + names[i] + "</b>" + r.map(function (v, j) { return '<button type="button" class="' + S[v].toLowerCase() + '" data-r="' + i + '" data-c="' + j + '">' + S[v] + "</button>"; }).join(""); });
      grid.innerHTML = h; var low = -1, ch = "<span></span>";
      for (var j = 0; j < 7; j++) { var c = 0; data.forEach(function (r) { if (r[j] === 0) c++; }); if (c < 2 && low < 0) low = j; ch += '<em class="' + (c < 2 ? "low" : "ok") + '">' + c + "</em>"; }
      cover.innerHTML = "<small>Morning crew</small>" + ch.replace("<span></span>", "");
      ct.textContent = low < 0 ? "Coverage is fine" : dn[low] + " is understaffed"; cx.textContent = low < 0 ? "Every day has at least two people on the morning shift." : "Only one person on the morning shift on " + dn[low] + ". Rotate a shift to fix it.";
    }
    grid.addEventListener("click", function (e) { var b = e.target.closest("[data-r]"); if (!b) return; var r = +b.dataset.r, c = +b.dataset.c; data[r][c] = (data[r][c] + 1) % 4; paint(); });
    paint(); var seq = [[2, 1], [0, 5], [3, 2], [1, 4], [4, 3]], k = 0;
    drive(box, function () { var s = seq[k++ % seq.length]; data[s[0]][s[1]] = (data[s[0]][s[1]] + 1) % 4; paint(); var cell = $('[data-r="' + s[0] + '"][data-c="' + s[1] + '"]', grid); if (cell) cell.classList.add("flash"); say(box, names[s[0]] + " moved to " + ["morning", "evening", "night", "a day off"][data[s[0]][s[1]]] + "."); }, 2200, st);
  }

  /* ---------- visitor ---------- */
  function visitor(box) {
    var st = { taken: false }, name = $('[data-v="name"]', box), host = $('[data-v="host"]', box), why = $('[data-v="why"]', box), btn = $("[data-checkin]", box), badge = $("[data-badge2]", box), bn = $("[data-bname]", box), bh = $("[data-bhost]", box), bt = $("[data-btime]", box), bav = $("[data-bav]", box), feed = $("[data-vfeed]", box);
    var people = [["John Lewis", 0, 0], ["Meera Iyer", 1, 1], ["Daniel Reed", 2, 3]], k = 0, t = 9 * 60 + 12, running = false;
    function fmtT() { return String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0"); }
    function ini(s) { return s.split(" ").map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase(); }
    function checkin() {
      var nm = name.value.trim() || "Guest"; t += 4; bn.textContent = nm; bh.textContent = "Here to see " + host.value + " · " + why.value; bt.textContent = fmtT(); bav.textContent = ini(nm);
      badge.classList.remove("print"); void badge.offsetWidth; badge.classList.add("print");
      var li = document.createElement("li"); li.innerHTML = "<i>" + ini(nm) + "</i><span><b>" + esc(nm) + "</b><small>" + esc(host.value) + " · " + esc(why.value) + "</small></span><em>" + fmtT() + "</em>"; feed.insertBefore(li, feed.firstChild); while (feed.children.length > 4) feed.removeChild(feed.lastChild);
      say(box, nm.split(" ")[0] + " is checked in. " + host.value.split(" ")[0] + " has been told.");
    }
    btn.addEventListener("click", checkin);
    async function typeName(s) { name.value = ""; for (var i = 0; i < s.length; i++) { if (st.taken) return false; name.value = s.slice(0, i + 1); await wait(65); } return true; }
    drive(box, async function () {
      if (running) return; running = true; var p = people[k++ % people.length]; say(box, "Registering a visitor…");
      if (await typeName(p[0])) { host.selectedIndex = p[1]; why.selectedIndex = p[2]; await wait(700); if (!st.taken) { btn.click(); await wait(2200); } }
      running = false;
    }, 6200, st);
  }

  var map = { punch: punch, leave: leave, payroll: payroll, chart: chart, phone: phone, roles: roles, roster: roster, visitor: visitor };
  $$("[data-dm]").forEach(function (b) { var f = map[b.dataset.dm]; if (f) { try { f(b); } catch (e) { console.error(e); } } });
})();
