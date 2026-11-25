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

  /* the person in each demo grows to fill the height of its column */
  function fitWho(box) {
    var who = $(".dmx__who", box), pp = $(".dmx__ppl", box), sy = $(".dmx__say", box); if (!who || !pp) return;
    function fit() {
      if (getComputedStyle(who).display === "none") return;
      pp.style.setProperty("--s", 1);
      var h = Math.max.apply(null, $$(".dmx__l, .dmx__r", box).map(function (e) { return e.offsetHeight; })), avail = h - sy.offsetHeight - 36, w = who.clientWidth - 24;
      pp.style.setProperty("--s", Math.max(1, Math.min(avail / 190, w / 120, 2.4)).toFixed(3));
    }
    fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(box); window.addEventListener("resize", fit); setTimeout(fit, 600);
  }

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
      feed.insertBefore(li, feed.firstChild); while (feed.children.length > 4) feed.removeChild(feed.lastChild);
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
    addFeed("Nadia", "GPS", "08:58", "ok", "On time"); addFeed("Priya", "Fingerprint", "08:47", "ok", "On time"); stats();
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
    var now = new Date(), off = new Date(now.getFullYear(), now.getMonth(), 1).getDay(), N = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(), mon = now.toLocaleString("en-US", { month: "short" }), hol = {}, wd = ["S", "M", "T", "W", "T", "F", "S"];
    for (var h = 10; h < 20; h++) if ((off + h - 1) % 7 !== 0 && (off + h - 1) % 7 !== 6) { hol[h] = 1; break; }
    $(".dmx__calhead > b", box).textContent = now.toLocaleString("en-US", { month: "long" }); $$(".dmx__away em", box).forEach(function (e) { e.textContent = e.textContent.replace("Apr", mon); });
    var html = wd.map(function (w) { return "<small>" + w + "</small>"; }).join("");
    for (var i = 0; i < off; i++) html += "<i></i>";
    for (var d = 1; d <= N; d++) { var dow = (off + d - 1) % 7; html += '<button type="button" data-d="' + d + '" class="' + (dow === 0 || dow === 6 ? "we" : hol[d] ? "ho" : "") + '">' + d + "</button>"; }
    cal.innerHTML = html; days = $$("[data-d]", cal);
    function working(x, y) { var c = 0; for (var d = x; d <= y; d++) { var dw = (off + d - 1) % 7; if (dw !== 0 && dw !== 6 && !hol[d]) c++; } return c; }
    function paint() {
      days.forEach(function (e) { var d = +e.dataset.d, on = a && b ? d >= a && d <= b : a === d; e.classList.toggle("sel", !!on); });
      var w = a && b ? working(a, b) : 0, after = Math.max(0, bals[typeIdx] - w);
      cards.forEach(function (c, k) { var left = k === typeIdx ? after : bals[k]; $("[data-lb]", c).textContent = left; $("[data-lbar]", c).style.width = (left / tots[k] * 100) + "%"; });
      sT.textContent = names[typeIdx] + " leave"; sD.textContent = !a ? "No dates yet" : !b ? a + " " + mon + ", then pick the last day" : (a === b ? a + " " + mon : a + " to " + b + " " + mon); sN.textContent = w; sA.textContent = after; sB.style.width = (after / tots[typeIdx] * 100) + "%";
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
    var run = $$("[data-run] li", box), runTxt = $("[data-runtxt]", box), runBar = $("[data-runbar]", box), ri = 0;
    function calc() {
      var basic = +sl[0].value, ot = +sl[1].value, ul = +sl[2].value, bonus = 0, adv = 0, allow = basic * .25, otp = basic / 160 * 1.25 * ot, ded = basic / 26 * ul, total = basic + allow + otp + bonus - ded - adv;
      out[0].textContent = fmt(basic); out[1].textContent = ot + " h"; out[2].textContent = ul + " d";
      lines.innerHTML = [["Basic", fmt(basic)], ["Allowances (25%)", "+" + fmt(allow)], ["Overtime " + ot + " h", "+" + fmt(otp)], ["Unpaid leave " + ul + " d", "-" + fmt(ded)]].map(function (r, i) { return '<li class="' + (i > 2 ? "neg" : "") + '"><span>' + r[0] + "</span><b>" + r[1] + "</b></li>"; }).join("");
      net.textContent = fmt(total); var sum = basic + allow + otp + bonus; split[0].style.width = (basic / sum * 100) + "%"; split[1].style.width = (allow / sum * 100) + "%"; split[2].style.width = ((otp + bonus) / sum * 100) + "%";
    }
    function runTo(k) { ri = k; run.forEach(function (l, i) { l.classList.toggle("on", i < k); }); runBar.style.width = (k / 4 * 100) + "%"; runTxt.textContent = k >= 4 ? "412 payslips sent" : "Step " + k + " of 4"; }
    sl.forEach(function (s) { s.addEventListener("input", calc); }); calc(); runTo(0);
    $("[data-release]", box).addEventListener("click", function () { runTo(4); say(box, "Sent to every phone."); });
    var targets = [[5200, 12, 0, 300, 0], [3800, 4, 2, 0, 400], [6400, 20, 1, 800, 0], [4200, 6, 1, 0, 200]], ti = 0;
    drive(box, function () { var tg = targets[ti++ % targets.length]; var from = sl.map(function (s) { return +s.value; }), t0 = performance.now(); say(box, ["Overtime counted.", "Unpaid leave deducted.", "Slip updated.", "Net pay ready."][ti % 4]); runTo(ti % 5); (function step(now) { var p = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - p, 3); sl.forEach(function (s, i) { s.value = Math.round((from[i] + (tg[i] - from[i]) * e) / (+s.step || 1)) * (+s.step || 1); }); calc(); if (p < 1 && !st.taken) requestAnimationFrame(step); })(t0); }, 2800, st);
  }

  /* ---------- chart ---------- */
  function chart(box) {
    var st = { taken: false }, pills = $$("[data-k]", box), kp = $("[data-kpis]", box), acts = $$("[data-act]", box), ch = $("[data-chart]", box), ax = $("[data-axis]", box), title = $("[data-ititle]", box), txt = $("[data-itext]", box), chips = $("[data-ichips]", box);
    var D = [{ t: "Late arrivals by weekday", x: ["Mon", "Tue", "Wed", "Thu", "Fri"], v: [14, 6, 5, 7, 12], u: "", p: "Mondays and Fridays are the worst. Share the report with department heads.", c: ["Mon +8%", "Fri +5%"], k: [["Worst day", "Monday", "14 late"], ["Average", "9 a day", "2 fewer than March"], ["Total late", "44", "this month"]] }, { t: "Attendance this month, by week", x: ["W1", "W2", "W3", "W4"], v: [94, 96, 93, 97], u: "%", p: "Attendance is steady at 95%. Week 3 dipped around the holiday.", c: ["95% average", "Week 3 dip"], k: [["Best week", "Week 4", "97% present"], ["Average", "95%", "up 1.2 points"], ["Lowest", "Week 3", "93%, holiday week"]] }, { t: "Payroll cost by department", x: ["Ops", "Sales", "IT", "HR", "Fin"], v: [38, 24, 18, 11, 9], u: "k", p: "Operations is 38% of cost. Overtime is the fastest-growing line.", c: ["Ops 38%", "OT +6%"], k: [["Total cost", "100k", "all departments"], ["Biggest", "Operations", "38% of cost"], ["Fastest growing", "Overtime", "up 6% in a quarter"]] }], cur = 0;
    function show(i) {
      cur = i; pills.forEach(function (b, k) { b.setAttribute("aria-pressed", String(k === i)); }); var d = D[i], mx = Math.max.apply(null, d.v);
      ch.innerHTML = d.v.map(function (v, k) { return '<div class="bar"><b>' + v + d.u + '</b><i style="--h:' + (v / mx * 100) + '%;--d:' + (k * 70) + 'ms"></i></div>'; }).join("");
      ax.innerHTML = d.x.map(function (x) { return "<span>" + x + "</span>"; }).join(""); title.textContent = d.t; txt.textContent = d.p; chips.innerHTML = d.c.map(function (c) { return "<em>" + c + "</em>"; }).join("");
      kp.innerHTML = d.k.map(function (r) { return "<div><small>" + r[0] + "</small><b>" + r[1] + "</b><span>" + r[2] + "</span></div>"; }).join(""); acts.forEach(function (a) { a.classList.remove("done"); $("em", a).textContent = a.dataset.l || $("em", a).textContent; });
      ch.classList.remove("dmgo"); void ch.offsetWidth; ch.classList.add("dmgo"); say(box, ["Mondays hurt.", "Looking steady.", "Ops costs most."][i]);
      if (!st.taken) setTimeout(function () { var a = acts[i % 3]; if (!st.taken && cur === i) a.classList.add("done"); }, 1800);
    }
    pills.forEach(function (b, i) { b.addEventListener("click", function () { show(i); }); });
    acts.forEach(function (a) { a.dataset.l = $("em", a).textContent; a.addEventListener("click", function () { a.classList.toggle("done"); }); }); show(0);
    drive(box, function () { show((cur + 1) % 3); }, 4800, st);
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
    var can = $("[data-scan]", box), CAN = [["Clock in and out", "Request leave", "Open own payslips"], ["Approve leave and swaps", "See team attendance", "Run team reports"], ["Edit employee records", "Check payroll runs", "Publish policies"], ["Manage roles and MFA", "Set branch rules", "Read the audit log"]], title = $("[data-stitle]", box), text = $("[data-stext]", box), chips = $("[data-schips]", box), badge = $("[data-badge]", box);
    function paint() {
      var p = perms[cur]; rows.forEach(function (r, i) { var sw = $(".sw", r); sw.setAttribute("aria-checked", String(!!p[i])); r.classList.toggle("on", !!p[i]); });
      var open = A.filter(function (a, i) { return p[i]; }), shut = A.filter(function (a, i) { return !p[i]; });
      title.textContent = R[cur]; text.textContent = "Can open " + open.length + " of 5 areas" + (shut.length ? " and cannot see " + shut.join(", ") + "." : ". Full access.");
      chips.innerHTML = open.map(function (a) { return "<em class='y'>" + a + "</em>"; }).join("") + shut.map(function (a) { return "<em class='n'>" + a + "</em>"; }).join("");
      can.innerHTML = CAN[cur].map(function (c) { return "<li>" + c + "</li>"; }).join(""); badge.classList.toggle("full", cur === 3); say(box, shut.length ? R[cur] + ": limited view." : R[cur] + ": full access.");
    }
    function pick(i) { cur = i; pills.forEach(function (b, k) { b.setAttribute("aria-pressed", String(k === i)); }); paint(); }
    pills.forEach(function (b, i) { b.addEventListener("click", function () { pick(i); }); });
    rows.forEach(function (r, i) { $(".sw", r).addEventListener("click", function () { perms[cur][i] = perms[cur][i] ? 0 : 1; paint(); }); });
    pick(0); drive(box, function () { pick((cur + 1) % 4); }, 3200, st);
  }

  /* ---------- roster ---------- */
  function roster(box) {
    var st = { taken: false }, grid = $("[data-grid]", box), ct = $("[data-ctitle]", box), cx = $("[data-ctext]", box), tiles = $("[data-tiles]", box);
    var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], rp = [["Karan", "#FF9FC0"], ["Ravi", "#45C4B0"], ["Sara", "#9B8CFF"], ["Nadia", "#B8E986"], ["Omar", "#FFD05A"]], seq = ["M", "E", "N", "O"], full = { M: "Morning", E: "Evening", N: "Night", O: "Off" };
    var ICO = { M: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>', E: '<svg viewBox="0 0 24 24"><path d="M17 18a5 5 0 0 0-10 0"/><path d="M12 9V2M4.2 10.2l1.4 1.4M2 18h2M20 18h2M18.4 11.6l1.4-1.4M22 22H2M8 5l4-3 4 3"/></svg>', N: '<svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>', O: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>' };
    var mon = new Date(); mon.setDate(mon.getDate() - ((mon.getDay() + 6) % 7));
    var rs = [["M", "M", "E", "E", "O", "M", "O"], ["E", "E", "M", "M", "M", "O", "M"], ["M", "O", "M", "M", "E", "E", "O"], ["O", "M", "O", "E", "M", "M", "E"], ["N", "N", "M", "O", "E", "O", "M"]], flashAt = null;
    function paint() {
      var h = '<div class="r"><span></span>' + days.map(function (d, i) { var dt = new Date(mon); dt.setDate(mon.getDate() + i); return '<span class="hd">' + d + "<b>" + dt.getDate() + "</b></span>"; }).join("") + "</div>", bad = [];
      rp.forEach(function (p, r) { h += '<div class="r"><span class="nm"><i style="--c:' + p[1] + '">' + p[0].slice(0, 2).toUpperCase() + "</i>" + p[0] + "</span>" + rs[r].map(function (v, d) { return '<button type="button" class="' + v + (flashAt && flashAt[0] === r && flashAt[1] === d ? " flash" : "") + '" data-r="' + r + '" data-d="' + d + '" aria-label="' + p[0] + " " + days[d] + ", shift " + v + '">' + ICO[v] + "<span>" + v + "</span></button>"; }).join("") + "</div>"; });
      h += '<div class="r"><span class="nm">Morning crew</span>' + days.map(function (d, di) { var n = rs.reduce(function (q, row) { return q + (row[di] === "M" ? 1 : 0); }, 0), b = n < 2; if (b) bad.push(d); return '<span class="cv' + (b ? " bad" : "") + '"><i style="--w:' + Math.min(100, n / 2 * 100) + '%"></i><b>' + n + (b ? " of 2" : "") + "</b></span>"; }).join("") + "</div>";
      grid.innerHTML = h; flashAt = null;
      ct.textContent = bad.length ? bad[0] + " is understaffed" : "Coverage is fine"; cx.textContent = bad.length ? "Only one person on the morning shift on " + bad[0] + ". Rotate a shift to fix it." : "Every day has at least two people on the morning shift.";
      var n = { M: 0, E: 0, N: 0, O: 0 }; rs.forEach(function (r) { r.forEach(function (v) { n[v]++; }); });
      tiles.innerHTML = seq.map(function (k) { return '<div class="' + k.toLowerCase() + '"><small><i></i>' + full[k] + "</small><b>" + n[k] + "</b><span>" + (k === "O" ? "days off this week" : "shifts this week") + "</span></div>"; }).join("");
    }
    grid.addEventListener("click", function (e) { var b = e.target.closest("[data-r]"); if (!b) return; var r = +b.dataset.r, d = +b.dataset.d; rs[r][d] = seq[(seq.indexOf(rs[r][d]) + 1) % 4]; flashAt = [r, d]; paint(); });
    paint(); var plan = [[2, 1], [0, 4], [3, 2], [1, 4], [4, 3]], k = 0;
    drive(box, function () { var p = plan[k++ % plan.length]; rs[p[0]][p[1]] = seq[(seq.indexOf(rs[p[0]][p[1]]) + 1) % 4]; flashAt = [p[0], p[1]]; paint(); say(box, rp[p[0]][0] + " moved to " + full[rs[p[0]][p[1]]].toLowerCase() + "."); }, 2600, st);
  }

  /* ---------- visitor ---------- */
  function visitor(box) {
    var st = { taken: false }, name = $('[data-v="name"]', box), host = $('[data-v="host"]', box), why = $('[data-v="why"]', box), btn = $("[data-checkin]", box), badge = $("[data-badge2]", box), bn = $("[data-bname]", box), bh = $("[data-bhost]", box), bt = $("[data-btime]", box), bav = $("[data-bav]", box), vst = $$("[data-vsteps] li", box), hostt = $("[data-hostt]", box), hosts = $("[data-hosts]", box), hostBox = $("[data-host]", box), bwho = $("[data-bwho]", box), bwhy = $("[data-bwhy]", box);
    var people = [["John Lewis", 0, 0], ["Meera Iyer", 1, 1], ["Daniel Reed", 2, 3]], k = 0, t = 9 * 60 + 12, running = false;
    function fmtT() { return String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0"); }
    function ini(s) { return s.split(" ").map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase(); }
    function checkin() {
      var nm = name.value.trim() || "Guest"; t += 4; bn.textContent = nm; if (bh) bh.textContent = "Here to see " + host.value; bt.textContent = fmtT(); bav.textContent = ini(nm); bwho.textContent = host.value; bwhy.textContent = why.value;
      badge.classList.remove("print"); void badge.offsetWidth; badge.classList.add("print");
      hostBox.classList.remove("sent"); hostt.textContent = "Telling " + host.value.split(" ")[0] + "…"; hosts.textContent = nm + " is at the front desk for " + why.value.toLowerCase(); setTimeout(function () { hostBox.classList.add("sent"); hostt.textContent = host.value.split(" ")[0] + " has been told"; }, 1200);
      vst.forEach(function (l, i) { l.classList.remove("on"); setTimeout(function () { l.classList.add("on"); }, 500 + i * 650); });
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

  /* ---------- field: one worker, three sites, a dead zone ---------- */
  function field(box) {
    var st = { taken: false }, path = $("[data-path]", box), trail = $("[data-trail]", box), pin = $("[data-pin]", box), sites = $("[data-sites]", box), chips = $$("[data-st]", box), sig = $("[data-sig]", box), badge = $("[data-net-badge]", box);
    var fh = $("[data-fh]", box), rows = $("[data-frows]", box), cta = $("[data-fcta]", box), len = path.getTotalLength(), pos = 0, cur = -1, raf = 0, ns = "http://www.w3.org/2000/svg";
    var S = [
      { f: 0, h: "Clocked in at the depot", r: [["Punch", "Fingerprint and GPS"], ["Geofence", "Inside, 8 m"], ["Shift", "08:00 to 17:00"]], c: "Clocked in", s: 4, say: "Punching in at the depot.", k: 0, v: 0, w: "0:00" },
      { f: .3, h: "Client visit logged", r: [["Visit", "Client office, Sharjah"], ["Check-in", "GPS verified"], ["Proof", "Site photo added"]], c: "Visit saved", s: 4, say: "Visit logged.", k: 14, v: 1, w: "2:15" },
      { f: .55, h: "No signal. Nothing is lost.", r: [["Network", "No signal"], ["Punch", "Kept on the phone"], ["Queue", "3 items waiting"]], c: "Saved offline", s: 0, say: "No signal, no problem.", k: 22, v: 1, w: "4:30" },
      { f: .68, h: "Back online. Synced.", r: [["Sent", "3 items"], ["Punch time", "Kept as 12:31"], ["Audit", "Logged"]], c: "Synced", s: 3, say: "All synced.", k: 22, v: 2, w: "5:10" },
      { f: .86, h: "Approvals, from the road", r: [["Fuel claim", "Approved"], ["Friday leave", "Approved"], ["Site report", "Sent to HR"]], c: "Done", s: 4, say: "Approved from here.", k: 34, v: 3, w: "8:00" },
      { f: 1, h: "Day closed at 18:05", r: [["Hours", "9 h 05"], ["Overtime", "1 h, sent for approval"], ["Payslip", "Updated"]], c: "Clocked out", s: 4, say: "Day done.", k: 41, v: 3, w: "9:05" }
    ];
    S.forEach(function (x, i) { var p = path.getPointAtLength(len * x.f), g = document.createElementNS(ns, "g"); g.setAttribute("class", "fmap-site"); g.setAttribute("transform", "translate(" + p.x + " " + p.y + ")"); g.innerHTML = '<circle class="fence" r="26"/><circle r="6"/><text y="-32" text-anchor="middle">' + ["Depot", "Client", "", "", "Site B", "Depot"][i] + "</text>"; if (i === 0 || i === 1 || i === 4) sites.appendChild(g); });
    trail.style.strokeDasharray = len; trail.style.strokeDashoffset = len;
    function place(f) { var p = path.getPointAtLength(len * f); pin.setAttribute("transform", "translate(" + p.x + " " + p.y + ")"); trail.style.strokeDashoffset = len * (1 - f); pos = f; }
    function go(i) {
      if (i === cur) return; cur = i; var x = S[i], from = pos, t0 = performance.now(), my = i; cancelAnimationFrame(raf);
      chips.forEach(function (c, k) { c.setAttribute("aria-pressed", String(k === i)); });
      (function step(now) { var p = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - p, 3); place(from + (x.f - from) * e); if (p < 1 && my === cur) raf = requestAnimationFrame(step); })(t0);
      fh.textContent = x.h; rows.innerHTML = x.r.map(function (r) { return "<li><span>" + r[0] + "</span><em>" + r[1] + "</em></li>"; }).join(""); cta.textContent = x.c; cta.classList.remove("hit"); void cta.offsetWidth; cta.classList.add("hit");
      sig.className = "dmx__sig s" + x.s; badge.className = "dmx__nets s" + x.s; box.classList.toggle("is-off", x.s === 0);
      $("[data-km]", box).textContent = x.k; $("[data-vis]", box).textContent = x.v; $("[data-hrs]", box).textContent = x.w; say(box, x.say);
    }
    chips.forEach(function (c, i) { c.addEventListener("click", function () { go(i); }); });
    place(0); go(0);
    drive(box, function () { go((cur + 1) % S.length); }, 4300, st);
  }

  /* ---------- day: the sun crosses the sky while the phone lights up ---------- */
  function dial(box) {
    var st = { taken: false }, sky = $("[data-sky]", box), path = $("[data-spath]", box), trail = $("[data-strail]", box), sun = $("[data-ssun]", box), mk = $("[data-smk]", box), cards = $$("[data-sc]", box), ns = "http://www.w3.org/2000/svg";
    var len = path.getTotalLength(), F = [.07, .24, .41, .58, .75, .93], times = cards.map(function (c) { return $("small", c).textContent.split("· ")[1]; });
    var skies = [["#FFE2C6", "#CFE0FF"], ["#D6E6FF", "#EEF5FF"], ["#DDEBFF", "#FFF1CF"], ["#FFE3BC", "#FFC9A6"], ["#4A4F8F", "#8A6FA8"], ["#222C5C", "#3D4E8C"]];
    var say1 = ["Clocked in on time.", "Leave approved!", "Shift swapped.", "Overtime approved.", "Day closed.", "Payslip is ready."], cur = -1, pos = F[0], col = skies[0].slice(), raf = 0;
    function hx(h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
    function mix(a, b, e) { var x = hx(a), y = hx(b); return "rgb(" + x.map(function (v, i) { return Math.round(v + (y[i] - v) * e); }).join(",") + ")"; }
    F.forEach(function (f, i) { var p = path.getPointAtLength(len * f), g = document.createElementNS(ns, "g"); g.setAttribute("class", "sk-mk"); g.setAttribute("transform", "translate(" + p.x + " " + p.y + ")"); g.innerHTML = '<circle r="6"/><text y="' + (i === 0 || i === 5 ? -34 : 24) + '" text-anchor="middle">' + times[i] + "</text>"; g.addEventListener("click", function () { go(i); }); mk.appendChild(g); });
    trail.style.strokeDasharray = len; trail.style.strokeDashoffset = len;
    function place(f) { var p = path.getPointAtLength(len * f); sun.setAttribute("transform", "translate(" + p.x + " " + p.y + ")"); trail.style.strokeDashoffset = len * (1 - f); pos = f; }
    function go(i) {
      if (i === cur) return; var prev = cur < 0 ? 0 : cur, from = pos, c0 = col.slice(), t0 = performance.now(); cur = i; var my = i; cancelAnimationFrame(raf);
      (function step(now) { var p = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - p, 3); place(from + (F[i] - from) * e); sky.style.setProperty("--s1", mix(c0[0], skies[i][0], e)); sky.style.setProperty("--s2", mix(c0[1], skies[i][1], e)); if (p < 1 && my === cur) raf = requestAnimationFrame(step); else col = skies[i].slice(); })(t0);
      cards.forEach(function (c, k) { c.setAttribute("aria-pressed", String(k === i)); c.classList.toggle("lit", k <= i); }); sky.classList.toggle("night", i >= 4); $$(".sk-mk", mk).forEach(function (m, k) { m.classList.toggle("on", k <= i); });
      say(box, say1[i]);
    }
    cards.forEach(function (c, i) { c.addEventListener("click", function () { go(i); }); });
    place(F[0]); sky.style.setProperty("--s1", skies[0][0]); sky.style.setProperty("--s2", skies[0][1]); go(0);
    drive(box, function () { go((cur + 1) % 6); }, 3600, st);
  }

  var map = { dial: dial, field: field, punch: punch, leave: leave, payroll: payroll, chart: chart, phone: phone, roles: roles, roster: roster, visitor: visitor };
  $$("[data-dm]").forEach(function (b) { var f = map[b.dataset.dm]; if (f) { try { f(b); } catch (e) { console.error(e); } } });
})();
