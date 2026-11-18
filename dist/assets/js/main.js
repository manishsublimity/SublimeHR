/* SublimeHR — interactions v3 (vanilla, no dependencies) */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("no-js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var money = function (n) { return Math.round(n).toLocaleString("en-US"); };
  var fmtTime = function (mins) { return pad(Math.floor(mins / 60) % 24) + ":" + pad(mins % 60); };
  var nowTime = function () { var d = new Date(); return pad(d.getHours()) + ":" + pad(d.getMinutes()); };

  /* ---------- Logo intro (once per session) ---------- */
  var intro = $(".intro");
  if (intro && !root.classList.contains("intro-skip")) {
    document.body.classList.add("locked");
    setTimeout(function () {
      intro.classList.add("done");
      document.body.classList.remove("locked");
      try { sessionStorage.setItem("shr-intro", "1"); } catch (e) {}
    }, 1500);
  }

  /* ---------- Header, progress, back-to-top ---------- */
  var header = $("#header"), bar = $(".bar-progress"), topBtn = $(".top-btn"), ticking = false;
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    if (topBtn) topBtn.classList.toggle("show", y > 900);
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();
  if (topBtn) topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ---------- Drawer ---------- */
  var burger = $(".burger"), drawer = $("#drawer");
  function setDrawer(open) {
    if (!burger) return;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    drawer.classList.toggle("open", open);
    document.body.classList.toggle("locked", open);
    $(".i-open", burger).hidden = open; $(".i-close", burger).hidden = !open;
  }
  if (burger) {
    burger.addEventListener("click", function () { setDrawer(burger.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setDrawer(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1080) setDrawer(false); });
    $$("a", drawer).forEach(function (a) { a.addEventListener("click", function () { setDrawer(false); }); });
  }

  /* ---------- Reveal + counters ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "", t0 = null;
    (function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / 1300, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(step); })(performance.now());
  }
  var rvs = $$(".rv, [data-count]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (!e.isIntersecting) return; e.target.classList.add("in"); if (e.target.hasAttribute("data-count")) countUp(e.target); io.unobserve(e.target); });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    rvs.forEach(function (el) { io.observe(el); });
  } else rvs.forEach(function (el) { el.classList.add("in"); });

  /* ---------- Helpers ---------- */
  function confetti(el) {
    if (reduce || !el) return;
    var r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var colors = ["#2F72B8", "#3FBDB3", "#FFC94A", "#FF7A59", "#8F6BD6"];
    for (var i = 0; i < 26; i++) {
      var c = document.createElement("span");
      c.className = "confetti";
      var a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 110;
      c.style.left = cx + "px"; c.style.top = cy + "px";
      c.style.background = colors[i % colors.length];
      c.style.setProperty("--x", Math.cos(a) * d + "px");
      c.style.setProperty("--y", Math.sin(a) * d - 40 + "px");
      c.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
      document.body.appendChild(c);
      setTimeout(function (n) { return function () { n.remove(); }; }(c), 1200);
    }
  }
  function toast(w, msg) {
    var t = $(".toast", w); if (!t) return;
    $("span", t).textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 2400);
  }
  function fill(r) { var p = (r.value - r.min) / (r.max - r.min) * 100; r.style.setProperty("--p", p + "%"); }
  function out(w, name, v) {
    var o = $('[data-out="' + name + '"]', w); if (!o) return;
    var f = o.getAttribute("data-fmt");
    o.textContent = f === "money" ? money(v) : f === "pct" ? v + "%" : f === "hrs" ? v + " h" : f === "days" ? v + " d" : f === "time" ? fmtTime(+v) : v;
  }
  function bindRanges(w, cb) {
    $$("input[type=range]", w).forEach(function (r) {
      fill(r); out(w, r.getAttribute("data-r"), r.value);
      r.addEventListener("input", function () { fill(r); out(w, r.getAttribute("data-r"), r.value); if (cb) cb(r); });
    });
  }
  function pressGroup(btns, onPick) {
    btns.forEach(function (b) { b.addEventListener("click", function () { btns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); if (onPick) onPick(b); }); });
  }
  function animateNum(el, to, dur) {
    var from = parseFloat((el.textContent || "0").replace(/,/g, "")) || 0, t0 = null;
    if (reduce) { el.textContent = money(to); return; }
    (function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / (dur || 400), 1); el.textContent = money(from + (to - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(performance.now());
  }

  /* ---------- Generic tabs ---------- */
  $$('[data-w="tabs"]').forEach(function (w) {
    var tabs = $$('[role="tab"]', w);
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });
    function sel(i, focus) {
      tabs.forEach(function (t, j) { var on = i === j; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; panels[j].hidden = !on; panels[j].classList.toggle("is-on", on); });
      if (focus) tabs[i].focus();
      if (w.hasAttribute("data-hash") && history.replaceState && focus !== null) history.replaceState(null, "", "#" + panels[i].id);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { sel(i); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + tabs.length) % tabs.length;
        if (n !== null) { e.preventDefault(); sel(n, true); }
      });
    });
    if (w.hasAttribute("data-hash")) {
      var openHash = function () { var h = location.hash.slice(1); panels.forEach(function (p, i) { if (p.id === h) { sel(i, null); w.scrollIntoView({ block: "start" }); } }); };
      openHash(); window.addEventListener("hashchange", openHash);
    }
  });

  /* ---------- Widget: Clock-in ---------- */
  $$('[data-w="clock"]').forEach(function (w) {
    var sim = w.hasAttribute("data-sim"), timeEl = $("[data-time]", w), btn = $("[data-punch]", w), body = $(".clk", w);
    var label = $("[data-label]", w), status = $("[data-status]", w), log = $("[data-log]", w), checks = $$("[data-chk]", w);
    var range = $('[data-r="arr"]', w), state = "out", busy = false, inAt = null, inMins = 0, row = null;
    function cur() { return sim ? fmtTime(+range.value) : nowTime(); }
    function setStatus(cls, txt) { status.innerHTML = '<span class="chip ' + cls + '"></span>'; status.firstChild.textContent = txt; }
    if (sim) bindRanges(w, function () { if (state === "out") timeEl.textContent = cur(); });
    timeEl.textContent = cur();
    if (!sim) setInterval(function () { timeEl.textContent = nowTime(); }, 10000);
    function dur(mins) { return Math.floor(mins / 60) + "h " + pad(mins % 60) + "m"; }
    btn.addEventListener("click", function () {
      if (busy) return; busy = true;
      if (state === "out") {
        body.classList.add("scanning"); label.textContent = "Scanning…";
        setStatus("", "Verifying…");
        checks.forEach(function (c, i) { setTimeout(function () { c.classList.add("ok"); }, 300 + i * 350); });
        setTimeout(function () {
          busy = false; state = "in"; body.classList.remove("scanning"); body.classList.add("in");
          label.textContent = "Clock out"; btn.setAttribute("aria-label", "Clock out");
          inAt = Date.now(); inMins = sim ? +range.value : new Date().getHours() * 60 + new Date().getMinutes();
          if (sim) {
            var v = +range.value;
            if (v <= 540) setStatus("mint", "On time ✓");
            else if (v <= 555) setStatus("butter", "In grace period ✓");
            else setStatus("peach", "Late " + (v - 540) + " min · flagged");
          } else setStatus("mint", "Clocked in ✓");
          row = document.createElement("li");
          row.innerHTML = "<b></b><span></span><i class='open'>On shift</i>";
          row.firstChild.textContent = cur(); row.children[1].textContent = "→ …";
          log.insertBefore(row, log.firstChild);
          while (log.children.length > 2) log.removeChild(log.lastChild);
          confetti(btn); toast(w, "Clock-in recorded at " + cur());
        }, 1350);
      } else {
        body.classList.add("leaving"); label.textContent = "Saving…";
        setTimeout(function () {
          busy = false; state = "out"; body.classList.remove("leaving", "in");
          var outMins, worked;
          if (sim) { worked = 540 + Math.round(Math.random() * 12); outMins = inMins + worked; }
          else { worked = Math.max(1, Math.round((Date.now() - inAt) / 60000)); outMins = inMins + worked; }
          var outTxt = fmtTime(outMins % 1440);
          label.textContent = "Clock in"; btn.setAttribute("aria-label", "Clock in");
          checks.forEach(function (c) { c.classList.remove("ok"); });
          if (row) { row.children[1].textContent = "→ " + outTxt; var t = row.children[2]; t.className = ""; t.textContent = dur(worked); }
          setStatus("sky", "Out " + outTxt + " · " + dur(worked));
          toast(w, "Shift saved · " + dur(worked));
        }, 900);
      }
    });
  });

  /* ---------- Widget: Leave planner ---------- */
  $$('[data-w="leave"]').forEach(function (w) {
    var cal = $("[data-cal]", w), START = 2, DAYS = 30, HOL = { 10: "Public holiday", 21: "Company holiday" };
    var caps = { annual: 14, sick: 6, wfh: 8 }, bal = { annual: 14, sick: 6, wfh: 8 }, type = "annual", we = "sat";
    var s = null, e = null, taken = {};
    var balEl = $("[data-bal]", w), capEl = $("[data-cap]", w), meter = $("[data-meter]", w), daysEl = $("[data-days]", w), excl = $("[data-excl]", w), apply = $("[data-apply]", w), req = $("[data-req]", w);
    function isWE(d) { var dow = (START + d - 1) % 7; return we === "sat" ? (dow === 5 || dow === 6) : (dow === 4 || dow === 5); }
    function render() {
      var h = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(function (x) { return '<span class="dow">' + x + "</span>"; }).join("");
      for (var i = 0; i < START; i++) h += "<span></span>";
      for (var d = 1; d <= DAYS; d++) h += '<button type="button" data-d="' + d + '" aria-label="April ' + d + (HOL[d] ? ", " + HOL[d] : "") + '">' + d + "</button>";
      cal.innerHTML = h; paint();
    }
    function working(a, b) { var n = 0, x = 0; for (var d = a; d <= b; d++) { if (isWE(d) || HOL[d]) x++; else n++; } return [n, x]; }
    function paint() {
      $$("button", cal).forEach(function (b) {
        var d = +b.getAttribute("data-d"), lo = s, hi = e || s;
        b.className = (isWE(d) ? "we " : "") + (HOL[d] ? "hol " : "") + (taken[d] ? taken[d] + " " : "");
        if (s && d >= lo && d <= hi) b.classList.add(d === lo || d === hi ? "edge" : "sel");
        b.setAttribute("aria-pressed", String(!!(s && d >= lo && d <= hi)));
      });
      var cnt = s ? working(s, e || s) : [0, 0];
      daysEl.textContent = cnt[0];
      var left = bal[type] - cnt[0];
      balEl.textContent = Math.max(left, 0); capEl.textContent = caps[type];
      meter.style.width = Math.max(left, 0) / caps[type] * 100 + "%";
      excl.textContent = !s ? "Weekends & holidays are skipped automatically." : left < 0 ? "Not enough " + type + " balance for this range." : cnt[1] ? cnt[1] + " weekend/holiday day(s) skipped automatically." : "No weekends or holidays in this range.";
      excl.style.color = left < 0 ? "var(--coral-ink)" : "";
      apply.disabled = !s || cnt[0] === 0 || left < 0;
    }
    cal.addEventListener("click", function (ev) {
      var b = ev.target.closest("button[data-d]"); if (!b) return;
      var d = +b.getAttribute("data-d");
      if (!s || e) { s = d; e = null; } else if (d < s) { s = d; } else { e = d; }
      paint();
    });
    pressGroup($$("[data-we]", w), function (b) { we = b.getAttribute("data-we"); render(); toast(w, "Weekend policy: " + b.textContent); });
    pressGroup($$("[data-type]", w), function (b) { type = b.getAttribute("data-type"); paint(); });
    apply.addEventListener("click", function () {
      var a = s, z = e || s, n = working(a, z)[0];
      for (var d = a; d <= z; d++) if (!isWE(d) && !HOL[d]) taken[d] = "pend";
      bal[type] -= n; s = e = null; paint();
      req.className = "req-card show";
      req.innerHTML = "<b></b><br><span class='chip peach st'>Pending manager approval…</span>";
      req.firstChild.textContent = n + " day" + (n > 1 ? "s" : "") + " of " + type + " leave · Apr " + a + (z !== a ? "–" + z : "");
      setTimeout(function () {
        Object.keys(taken).forEach(function (k) { if (taken[k] === "pend") taken[k] = "appr"; });
        paint(); var st = $(".st", req); st.className = "chip mint st"; st.textContent = "✓ Approved by Omar (Manager)";
        confetti(req); toast(w, "Leave approved — team calendar updated");
      }, 1500);
    });
    $("[data-reset]", w).addEventListener("click", function () { s = e = null; taken = {}; bal = { annual: 14, sick: 6, wfh: 8 }; req.className = "req-card"; paint(); });
    render();
  });

  /* ---------- Widget: Payroll ---------- */
  $$('[data-w="pay"]').forEach(function (w) {
    var v = function (n) { return +$('[data-r="' + n + '"]', w).value; }, adv = $("[data-adv]", w), net = $("[data-net]", w), prev = {};
    function line(k, val, neg) {
      var l = $('[data-l="' + k + '"]', w), span = l.lastElementChild, txt = (neg && val ? "−" : "") + money(val);
      if (prev[k] !== undefined && prev[k] !== txt) { l.classList.remove("flash"); void l.offsetWidth; l.classList.add("flash"); }
      prev[k] = txt; span.textContent = txt;
    }
    function calc() {
      var basic = v("basic"), daily = basic / 22, hourly = daily / 8;
      var allow = basic * v("allow") / 100, ot = v("ot") * hourly * 1.25, late = v("late") * daily * 0.25, a = adv.checked ? 300 : 0;
      var gross = basic + allow + ot, ded = late + a, n = gross - ded;
      line("basic", basic); line("allow", allow); line("ot", ot); line("late", late, true); line("adv", a, true);
      animateNum(net, n, 350);
      $('[data-bar="earn"]', w).style.width = (n / gross * 100) + "%";
      $('[data-bar="ded"]', w).style.width = (ded / gross * 100) + "%";
    }
    bindRanges(w, calc); adv.addEventListener("change", calc); calc();
    $("[data-pdf]", w).addEventListener("click", function () { confetti(this); toast(w, "Branded PDF payslip generated (demo)"); });
  });

  /* ---------- Widget: Permissions ---------- */
  $$('[data-w="perm"]').forEach(function (w) {
    var P = { admin: [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]], mgr: [[1, 0, 0, 0], [1, 1, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0], [1, 0, 0, 0]], emp: [[0, 0, 0, 0], [1, 1, 0, 0], [1, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0]] };
    function box(m, a) { return $('input[data-m="' + m + '"][data-a="' + a + '"]', w); }
    function sync() {
      for (var m = 0; m < 5; m++) {
        var pv = $('[data-pv="' + m + '"]', w), acts = $$(".acts i", pv);
        pv.classList.toggle("off", !box(m, 0).checked);
        for (var a = 0; a < 4; a++) acts[a].classList.toggle("no", !box(m, a).checked);
      }
    }
    function load(role) { P[role].forEach(function (row, m) { row.forEach(function (on, a) { box(m, a).checked = !!on; }); }); sync(); }
    $$("input[data-m]", w).forEach(function (b) {
      b.addEventListener("change", function () {
        var m = b.getAttribute("data-m"), a = +b.getAttribute("data-a");
        if (a > 0 && b.checked) box(m, 0).checked = true;
        if (a === 0 && !b.checked) for (var k = 1; k < 4; k++) box(m, k).checked = false;
        sync();
      });
    });
    pressGroup($$("[data-role]", w), function (b) { load(b.getAttribute("data-role")); toast(w, "Viewing as " + b.textContent); });
    load("admin");
  });

  /* ---------- Widget: Who's here ---------- */
  $$('[data-w="here"]').forEach(function (w) {
    var people = JSON.parse(w.getAttribute("data-people")), cells = $$("[data-p]", w);
    function upd(t) {
      var i = 0, l = 0;
      people.forEach(function (p, k) { var inn = p[2] <= t, late = inn && p[2] > 555; cells[k].classList.toggle("in", inn); cells[k].classList.toggle("late", late); if (inn) i++; if (late) l++; });
      $('[data-s="in"]', w).textContent = i; $('[data-s="late"]', w).textContent = l; $('[data-s="out"]', w).textContent = people.length - i;
    }
    bindRanges(w, function (r) { upd(+r.value); }); upd(+$('[data-r="t"]', w).value);
  });

  /* ---------- Widget: Roster ---------- */
  $$('[data-w="roster"]').forEach(function (w) {
    var order = ["M", "E", "N", "-"], names = { M: "Morning", E: "Evening", N: "Night", "-": "Off" }, days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var rows = $$("tbody tr:not(.cov)", w), cov = $$(".cov td", w).slice(1);
    function coverage(announce) {
      var lows = [];
      for (var d = 0; d < 7; d++) {
        var n = rows.filter(function (r) { return r.querySelectorAll("button")[d].getAttribute("data-s") !== "-"; }).length;
        cov[d].textContent = n; cov[d].classList.toggle("low", n < 3); if (n < 3) lows.push(days[d]);
      }
      if (announce) toast(w, lows.length ? "Heads up: " + lows.join(", ") + " understaffed" : "All days fully covered ✓");
    }
    $$("button[data-s]", w).forEach(function (b) {
      b.addEventListener("click", function () {
        var n = order[(order.indexOf(b.getAttribute("data-s")) + 1) % 4];
        b.setAttribute("data-s", n); b.textContent = n === "-" ? "Off" : n;
        b.setAttribute("aria-label", b.getAttribute("aria-label").replace(/: .*/, ": " + names[n]));
        coverage(true);
      });
    });
    coverage(false);
  });

  /* ---------- Widget: Letter builder ---------- */
  $$('[data-w="letter"]').forEach(function (w) {
    var tpl = "offer", paper = $(".paper", w), bodyEl = $("[data-body]", w), titleEl = $("[data-title]", w), steps = $$("[data-ls]", w);
    var T = {
      offer: ["Offer of employment", "We're delighted to offer you the position of {pos} with a monthly salary of {sal}, starting {date}. Welcome to the team!"],
      exp: ["Experience certificate", "This is to certify that {name} worked with us as {pos}, last drawing a monthly salary of {sal}, until {date}. We wish them every success."],
      warn: ["Warning letter", "This letter records repeated late attendance by {name} ({pos}). Please ensure punctual attendance from {date}. Salary on record: {sal}."]
    };
    function g(k) { return $('[data-in="' + k + '"]', w).value; }
    function render() {
      var d = g("date") ? new Date(g("date") + "T00:00:00") : null;
      var vals = { name: g("name").trim() || "Employee", pos: g("pos"), sal: money(+g("sal") || 0), date: d && !isNaN(d) ? d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "the effective date" };
      titleEl.textContent = T[tpl][0];
      var html = "<p class='mb0'>Dear <span class='tok'></span>,</p><p>" + T[tpl][1].replace(/\{(\w+)\}/g, "<span class='tok' data-k='$1'></span>") + "</p>";
      bodyEl.innerHTML = html;
      bodyEl.querySelector(".tok").textContent = vals.name;
      $$("[data-k]", bodyEl).forEach(function (t) { t.textContent = vals[t.getAttribute("data-k")]; t.classList.add("bump"); });
      paper.classList.remove("sent");
      steps[2].className = ""; steps[1].className = "on";
    }
    $$("[data-in]", w).forEach(function (i) { i.addEventListener("input", render); i.addEventListener("change", render); });
    pressGroup($$("[data-tpl] .pill", w), function (b) { tpl = b.getAttribute("data-t"); render(); });
    $("[data-send]", w).addEventListener("click", function () {
      paper.classList.add("sent"); steps[1].className = "done"; steps[2].className = "done";
      confetti(paper); toast(w, "Sent to " + (g("name").trim() || "employee") + " for e-signature");
    });
    render();
  });

  /* ---------- Widget: Visitor desk ---------- */
  $$('[data-w="visitor"]').forEach(function (w) {
    var purpose = "Meeting", badge = $("[data-badge]", w), list = $("[data-list]", w), cnt = $("[data-cnt]", w), total = 0;
    pressGroup($$("[data-purpose] .pill", w), function (b) { purpose = b.textContent; });
    function count() { cnt.textContent = total; }
    $("[data-checkin]", w).addEventListener("click", function () {
      var nameIn = $('[data-in="name"]', w), name = nameIn.value.trim() || "Guest Visitor", host = $('[data-in="host"]', w).value;
      var ini = name.split(/\s+/).map(function (x) { return x[0]; }).join("").slice(0, 2).toUpperCase();
      $("[data-ini]", w).textContent = ini; $("[data-bn]", w).textContent = name;
      $("[data-bm]", w).textContent = "Host: " + host + " · In " + nowTime();
      $("[data-bp]", w).textContent = purpose.toUpperCase();
      badge.classList.remove("print"); void badge.offsetWidth; badge.classList.add("print");
      var li = document.createElement("li"); li.innerHTML = "<span></span><button type='button'>Check out</button>";
      li.firstChild.textContent = name + " · " + host + " · " + nowTime();
      li.lastChild.addEventListener("click", function () { li.remove(); total = Math.max(0, total - 1); count(); });
      list.insertBefore(li, list.firstChild); total++;
      while (list.children.length > 3) list.removeChild(list.lastChild);
      count(); nameIn.value = ""; confetti(badge);
    });
  });

  /* ---------- Widget: Phone mini-movie ---------- */
  $$('[data-w="story"]').forEach(function (w) {
    var scr = $$("[data-scr]", w), steps = $$("[data-go]", w), screen = $(".screen", w), tapdot = $("[data-tap]", w);
    var DUR = 3400, cur = 0, timers = [], started = false, hover = false;
    w.style.setProperty("--dur", DUR + "ms");
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function clear() { timers.forEach(clearTimeout); timers = []; }
    function tap(el) {
      if (!el) return;
      var r = el.getBoundingClientRect(), s = screen.getBoundingClientRect();
      tapdot.style.left = (r.left - s.left + r.width / 2) + "px"; tapdot.style.top = (r.top - s.top + r.height / 2) + "px";
      tapdot.classList.remove("go"); void tapdot.offsetWidth; tapdot.classList.add("go");
      el.classList.remove("tap"); void el.offsetWidth; el.classList.add("tap");
    }
    var scripts = [
      function (s) { var t = $("[data-txt]", s), str = "EMP-0142"; t.textContent = ""; for (var i = 0; i < str.length; i++) later(function (k) { return function () { t.textContent = str.slice(0, k + 1); }; }(i), 300 + i * 170); later(function () { tap($("[data-btn]", s)); }, 2500); },
      function (s) { var c = $$(".otp span", s), d = "4719"; c.forEach(function (x) { x.textContent = ""; x.classList.remove("f"); }); c.forEach(function (x, i) { later(function () { x.textContent = d[i]; x.classList.add("f"); }, 400 + i * 380); }); later(function () { tap($("[data-btn]", s)); }, 2500); },
      function (s) { later(function () { tap($("[data-btn]", s)); }, 2400); },
      function (s) { var t = $("[data-ringtxt]", s), ok = $("[data-ok]", s); t.textContent = "Clocking in…"; ok.innerHTML = "&nbsp;"; later(function () { t.textContent = "✓ 08:57"; ok.textContent = "On time · GPS verified"; }, 1300); },
      function (s) { var m = $("[data-mcal]", s), h = ""; for (var i = 1; i <= 14; i++) h += "<button type='button' tabindex='-1'>" + (i + 12) + "</button>"; m.innerHTML = h; var b = $$("button", m); later(function () { tap(b[8]); b[8].className = "edge"; }, 600); later(function () { tap(b[9]); b[9].className = "edge"; }, 1200); later(function () { tap($("[data-btn]", s)); }, 2400); },
      function (s) { var n = $("[data-pnet]", s); n.textContent = "0"; later(function () { animateNum(n, 5215, 900); }, 400); later(function () { tap($("[data-btn]", s)); }, 2400); }
    ];
    function go(i) {
      clear();
      scr.forEach(function (s, k) { s.classList.toggle("on", k === i); s.classList.toggle("out", k === cur && k !== i); });
      steps.forEach(function (b, k) { var on = k === i; b.classList.remove("on"); if (on) { void b.offsetWidth; b.classList.add("on"); } b.setAttribute("aria-selected", String(on)); });
      cur = i; scripts[i](scr[i]);
      if (!reduce) later(function () { go((cur + 1) % scr.length); }, DUR);
    }
    steps.forEach(function (b, i) { b.addEventListener("click", function () { go(i); }); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en, o) { if (en[0].isIntersecting && !started) { started = true; go(0); o.disconnect(); } }, { threshold: 0.3 }).observe(w);
    } else go(0);
    void hover;
  });

  /* ---------- Widget: Chat FAQ ---------- */
  $$('[data-w="chat"]').forEach(function (w) {
    var log = $("[data-log]", w), qs = $$("[data-q]", w), more = $("[data-more]", w), N = +w.getAttribute("data-suggest") || 6, cat = "";
    function msg(cls, text, html) { var m = document.createElement("div"); m.className = "msg " + cls; if (html) m.innerHTML = html; else m.textContent = text; log.appendChild(m); log.scrollTop = log.scrollHeight; return m; }
    function answer(qText, aText, prefix, after) {
      msg("me", qText);
      var t = msg("bot", "", "<span class='typing'><i></i><i></i><i></i></span>");
      setTimeout(function () { t.innerHTML = ""; if (prefix) { var b = document.createElement("b"); b.textContent = prefix; t.appendChild(b); t.appendChild(document.createElement("br")); } t.appendChild(document.createTextNode(aText)); var q = document.createElement("div"); q.className = "quick"; q.innerHTML = "<a href='/book-demo/'>Book a demo</a><a href='/get-pricing/'>Get pricing</a><a href='/contact/'>Talk to a human</a>"; var old = $(".quick", log); if (old) old.remove(); log.appendChild(q); log.scrollTop = log.scrollHeight; if (after) after(); }, reduce ? 50 : 650);
    }
    function ans(b) { return $('[data-a="' + b.getAttribute("data-q") + '"]', w).textContent; }
    qs.forEach(function (b) {
      b.addEventListener("click", function () {
        qs.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        answer($("span:last-child", b).textContent, ans(b));
      });
    });
    function visible(showAll) {
      var shown = 0, matches = qs.filter(function (b) { return !cat || b.getAttribute("data-cat") === cat; });
      qs.forEach(function (b) { b.hidden = true; });
      matches.forEach(function (b) { if (showAll || shown < N) { b.hidden = false; shown++; } });
      if (more) more.hidden = showAll || matches.length <= N;
    }
    if (more) more.addEventListener("click", function () { visible(true); });
    w._filter = function (c) { cat = c; visible(false); };
    var inline = w.hasAttribute("data-inline"), asked = {};
    function offer(c, label) {
      var pool = qs.filter(function (b) { return (!c || b.getAttribute("data-cat") === c) && !asked[b.getAttribute("data-q")]; }).slice(0, 6);
      if (!pool.length) { msg("bot", "That's every question in this topic 🎉 Pick another topic on the left, or type your own."); return; }
      if (label) msg("bot", label);
      var box = document.createElement("div"); box.className = "qchips";
      pool.forEach(function (b) {
        var c2 = document.createElement("button"); c2.type = "button"; c2.textContent = $("span:last-child", b).textContent;
        c2.addEventListener("click", function () {
          $$("button", box).forEach(function (x) { x.disabled = true; });
          asked[b.getAttribute("data-q")] = 1;
          answer(c2.textContent, ans(b), null, function () { offer(cat, "Related questions you might ask:"); });
        });
        box.appendChild(c2);
      });
      log.appendChild(box); log.scrollTop = log.scrollHeight;
    }
    if (inline) w._topic = function (c, name) { cat = c; offer(c, "Here are the most asked questions about " + name + " 👇"); };
    w._say = function (t) { msg("bot", t); };
    $("[data-ask]", w).addEventListener("submit", function (ev) {
      ev.preventDefault();
      var inp = $("input", this), q = inp.value.trim(); if (!q) return; inp.value = "";
      var words = q.toLowerCase().split(/\W+/).filter(function (x) { return x.length > 2; }), best = null, score = 0;
      qs.forEach(function (b) {
        var title = $("span:last-child", b).textContent.toLowerCase(), txt = title + " " + ans(b).toLowerCase(), s = 0;
        words.forEach(function (x) { if (txt.indexOf(x) !== -1) s += title.indexOf(x) !== -1 ? 2 : 1; });
        if (s > score) { score = s; best = b; }
      });
      if (best && score > 1) answer(q, ans(best), $("span:last-child", best).textContent);
      else { msg("me", q); setTimeout(function () { msg("bot", "", "I don't have that one yet — our team will happily help. <a href='/contact/'>Ask a specialist →</a>"); }, 600); }
    });
  });
  $$('[data-w="faqcats"]').forEach(function (w) {
    var chat = $('[data-w="chat"]', w);
    pressGroup($$("[data-c]", w), function (b) {
      var name = $("b", b) ? $("b", b).textContent : b.textContent;
      if (chat._topic) { chat._topic(b.getAttribute("data-c"), name); return; }
      if (chat._filter) chat._filter(b.getAttribute("data-c"));
      if (chat._say) chat._say("Here are the most asked questions about " + name + " 👇");
    });
    var first = $('[data-c][aria-pressed="true"]', w);
    if (first && chat._topic) chat._topic(first.getAttribute("data-c"), $("b", first).textContent);
  });

  /* ---------- Before / after, flip cards ---------- */
  $$('[data-w="ba"]').forEach(function (w) {
    var c = $("[data-flip]", w), l = $("[data-lbl]", w);
    c.addEventListener("change", function () { w.classList.toggle("after", c.checked); l.textContent = c.checked ? "Showing the after ✨" : "Show the after"; if (c.checked) confetti(c.nextElementSibling); });
  });
  $$('[data-w="flip"]').forEach(function (b) { b.addEventListener("click", function () { var on = !b.classList.contains("on"); b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); }); });

  /* ---------- Pricing calculator ---------- */
  $$('[data-w="price"]').forEach(function (w) {
    function upd(n) {
      $$("[data-est]", w).forEach(function (el) {
        var rate = +el.getAttribute("data-est"), cap = +el.getAttribute("data-cap");
        if (!rate) return;
        if (cap && n > cap) { el.classList.add("na"); el.textContent = "Starter covers up to " + cap + " employees"; }
        else { el.classList.remove("na"); el.textContent = "≈ $" + money(rate * n) + " / month for " + n + " people"; }
      });
    }
    bindRanges(w, function (r) { upd(+r.value); }); upd(+$('[data-r="emp"]', w).value);
  });

  /* ---------- Integrations filter ---------- */
  $$('[data-w="filter"]').forEach(function (w) {
    pressGroup($$("[data-f]", w), function (b) {
      var f = b.getAttribute("data-f");
      $$("[data-g]", w).forEach(function (c) { var g = c.getAttribute("data-g"); c.hidden = !(f === "all" || g === f || g === "all"); if (!c.hidden) c.classList.add("in"); });
    });
  });

  /* ---------- Form pages (demo / pricing / contact) ---------- */
  var form = $("#contact-form");
  if (form) {
    var params = new URLSearchParams(location.search);
    var mod = params.get("module"); if (mod) { var mb = $('input[name="modules"][value="' + mod + '"]', form); if (mb) mb.checked = true; }
    ["industry", "size", "customization", "topic"].forEach(function (k) { var v = params.get(k), el = $('[name="' + k + '"]', form); if (v && el) el.value = v; });
    var plan = params.get("plan"); if (plan) { var pr = $('input[name="plan"][value="' + plan + '"]', form); if (pr) pr.checked = true; }
    var di = $('input[type="date"]', form); if (di) { var tm = new Date(); tm.setDate(tm.getDate() + 1); di.min = tm.toISOString().slice(0, 10); }

    function ctl(f) { return $("input[required], textarea[required], select[required]", f) || $("input, select, textarea", f); }
    function validate(f) {
      var i = ctl(f); if (!i) return true;
      var ok = i.checkValidity() && (i.type !== "tel" || /^[()\-\s\d]{6,}$/.test(i.value.trim()));
      f.classList.toggle("invalid", !ok); i.setAttribute("aria-invalid", String(!ok)); return ok;
    }
    $$(".field", form).forEach(function (f) { var i = ctl(f); if (!i) return; i.addEventListener("blur", function () { if (i.value && f.hasAttribute("data-validate")) validate(f); }); i.addEventListener("input", function () { if (f.classList.contains("invalid")) validate(f); }); i.addEventListener("change", function () { if (f.classList.contains("invalid")) validate(f); }); });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if ($('[name="website"]', form).value) return;
      var bad = $$(".field[data-validate]", form).filter(function (f) { return !validate(f); });
      if (bad.length) { ctl(bad[0]).focus(); return; }
      var payload = {};
      new FormData(form).forEach(function (v, k) { if (k === "website") return; payload[k] = payload[k] ? payload[k] + ", " + v : v; });
      payload.phone = (payload.cc || "") + " " + (payload.phone || ""); delete payload.cc;
      if (payload.slot) { payload.demo_date = (payload.demo_date || "Any day") + " (" + payload.slot + ")"; delete payload.slot; }
      if (payload.topic) { payload.message = "[" + payload.topic + "] " + (payload.message || ""); }
      payload.page = location.pathname + location.search; payload.referrer = document.referrer || "";
      ["utm_source", "utm_medium", "utm_campaign"].forEach(function (k) { var v = params.get(k); if (v) payload[k] = v; });

      var btn = $('button[type="submit"]', form), lbl = $("[data-submit-label]", form), orig = lbl.textContent;
      btn.disabled = true; btn.setAttribute("aria-busy", "true"); lbl.textContent = "Sending…";
      var endpoint = (form.getAttribute("data-endpoint") || "").trim(), errBox = $("#form-error");
      function done(viaWa) {
        form.classList.add("sent");
        var s = $("#form-success"); if (viaWa) $("#success-msg").textContent = "Please press send in WhatsApp to deliver your details to our team. We'll reply within 1 business day.";
        var wa = $("#wa-followup"); if (wa) wa.href = waLink(payload);
        s.setAttribute("tabindex", "-1"); s.focus(); confetti($(".ok", s));
      }
      function fail(m) {
        btn.disabled = false; btn.removeAttribute("aria-busy"); lbl.textContent = orig;
        errBox.innerHTML = ""; var p = document.createElement("p"); p.className = "mb0";
        p.textContent = (m && m.length ? m.join(" ") : "Sorry, we couldn't send your request.") + " ";
        var a = document.createElement("a"); a.href = waLink(payload); a.target = "_blank"; a.rel = "noopener"; a.textContent = "Send it on WhatsApp instead →";
        p.appendChild(a); errBox.appendChild(p); errBox.hidden = false; errBox.focus();
      }
      if (!endpoint) { done(true); window.open(waLink(payload), "_blank", "noopener"); return; }
      errBox.hidden = true;
      fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload), redirect: "follow" })
        .then(function (r) { return r.json(); })
        .then(function (res) { if (res && res.ok) done(false); else fail(res && res.errors); })
        .catch(function () { fail(); });
    });
  }
  function waLink(p) {
    var names = { book_demo: "Book a demo", request_quote: "Get pricing", contact_sales: "Contact message" };
    var lines = ["Hi SublimeHR, new enquiry from the website:", "Request: " + (names[p.intent] || "-"), "Name: " + (p.name || "-"), "Company: " + (p.company || "-"), "Email: " + (p.email || "-"), "Phone: " + (p.phone || "-"),
      p.size ? "Employees: " + p.size : "", p.industry ? "Industry: " + p.industry : "", p.demo_date ? "Preferred demo: " + p.demo_date : "", p.modules ? "Modules: " + p.modules : "", p.plan ? "Plan: " + p.plan : "", p.customization ? "Customization: " + p.customization : "", p.message ? "Message: " + p.message : ""].filter(Boolean);
    return "https://wa.me/917976117684?text=" + encodeURIComponent(lines.join("\n"));
  }


  /* ---------- Industry carousel (auto-play, arrows, swipe) ---------- */
  $$('[data-w="icar"]').forEach(function (w) {
    var pills = $$("[data-i]", w), cards = $$(".icar__stage > .ind-card", w), stage = $(".icar__stage", w), n = cards.length, cur = 0, timer = null, hovering = false, visible = false;
    function go(i, user) {
      cur = (i + n) % n;
      cards.forEach(function (c, k) { var on = k === cur; c.classList.toggle("is-on", on); c.setAttribute("aria-hidden", String(!on)); });
      pills.forEach(function (p, k) { var on = k === cur; p.setAttribute("aria-selected", String(on)); p.tabIndex = on ? 0 : -1; if (on) { var box = p.parentElement; box.scrollTo({ left: p.offsetLeft - box.clientWidth / 2 + p.clientWidth / 2, behavior: reduce ? "auto" : "smooth" }); } });
      restart(user);
    }
    function restart() {
      clearTimeout(timer); w.classList.remove("run"); void w.offsetWidth;
      var rr = w.getBoundingClientRect(); visible = rr.top < window.innerHeight && rr.bottom > 0;
      if (reduce || !visible) return;
      w.classList.add("run");
      timer = setTimeout(function () { if (!hovering) go(cur + 1); else restart(); }, 6000);
    }
    pills.forEach(function (p, k) { p.addEventListener("click", function () { go(k, true); }); });
    $("[data-prev]", w).addEventListener("click", function () { go(cur - 1, true); });
    $("[data-next]", w).addEventListener("click", function () { go(cur + 1, true); });
    var x0 = null;
    stage.addEventListener("pointerdown", function (e) { x0 = e.clientX; });
    stage.addEventListener("pointerup", function (e) { if (x0 === null) return; var dx = e.clientX - x0; if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1), true); x0 = null; });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) restart(); else { clearTimeout(timer); w.classList.remove("run"); } }, { threshold: .3 }).observe(w);
  });

  /* ---------- Scroll-spy + stacking cards ---------- */
  $$("[data-spy]").forEach(function (nav) {
    var links = $$('a[href^="#"]', nav), targets = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
    function upd() {
      var y = window.innerHeight * 0.45, idx = 0;
      targets.forEach(function (t, k) { if (t && t.getBoundingClientRect().top < y) idx = k; });
      links.forEach(function (a, k) {
        var on = k === idx; if (a.classList.contains("active") === on) return;
        a.classList.toggle("active", on);
        if (on) nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
      });
      targets.forEach(function (t, k) {
        if (!t || !t.classList.contains("stack-card")) return;
        if (window.innerWidth <= 860) { t.style.transform = ""; t.style.opacity = ""; return; }
        var d = idx - k;
        if (d <= 0) { t.style.transform = ""; t.style.opacity = ""; t.style.filter = ""; return; }
        var dd = Math.min(d, 4);
        t.style.transform = "perspective(1400px) translateY(" + (-dd * 16) + "px) scale(" + (1 - dd * 0.045) + ") rotateX(" + (dd * 2) + "deg)";
        t.style.opacity = d > 3 ? "0" : String(1 - dd * 0.28);
        t.style.filter = "";
      });
    }
    window.addEventListener("scroll", function () { requestAnimationFrame(upd); }, { passive: true });
    upd();
  });

  /* ---------- Pricing: quick picks + avatar stack ---------- */
  $$('[data-w="price"]').forEach(function (w) {
    var r = $('[data-r="emp"]', w), avs = $("[data-avs]", w), quick = $$("[data-n]", w), cols = ["#2F72B8", "#3FBDB3", "#E9805F", "#7A6FD0", "#D9A21B", "#4A86C8", "#C2577A"];
    function draw() {
      var n = +r.value, show = Math.min(7, Math.max(1, Math.ceil(n / 40))), h = "";
      for (var i = 0; i < show; i++) h += '<i style="background:' + cols[i] + '">' + String.fromCharCode(65 + i) + "</i>";
      if (n > show) h += '<i class="more">+' + (n - show) + "</i>";
      avs.innerHTML = h;
      quick.forEach(function (q) { q.setAttribute("aria-pressed", String(+q.getAttribute("data-n") === n)); });
    }
    quick.forEach(function (q) { q.addEventListener("click", function () { r.value = q.getAttribute("data-n"); r.dispatchEvent(new Event("input")); }); });
    r.addEventListener("input", draw); draw();
  });

  /* ---------- Wave ribbon: seamless loop ---------- */
  $$(".wave svg").forEach(function (svg) {
    if (reduce && svg.pauseAnimations) { svg.pauseAnimations(); return; }
    $$("textPath", svg).forEach(function (tp) {
      var rep = $(".rep", tp), an = $("animate", tp); if (!rep || !an || !rep.getComputedTextLength) return;
      var L = Math.round(rep.getComputedTextLength()); if (!L) return;
      if (tp.getAttribute("data-dir") === "1") { an.setAttribute("from", "0"); an.setAttribute("to", String(-L)); }
      else { an.setAttribute("from", String(-L)); an.setAttribute("to", "0"); }
      an.setAttribute("dur", Math.round(L / 55) + "s");
    });
  });

  /* ---------- Module dock: auto spotlight hints that tiles are clickable ---------- */
  $$("[data-dock]").forEach(function (d) {
    var items = $$(".dock__item", d), i = 0;
    if (reduce || !items.length) return;
    setInterval(function () {
      if (d.matches(":hover") || d.contains(document.activeElement)) { items.forEach(function (x) { x.classList.remove("lit"); }); return; }
      items.forEach(function (x) { x.classList.remove("lit"); });
      items[i % items.length].classList.add("lit"); i++;
    }, 2300);
  });

  /* ---------- CTA live activity feed ---------- */
  $$("[data-feed]").forEach(function (f) {
    var data = JSON.parse(f.getAttribute("data-feed")), ul = $("ul", f), tpl = $(".fi", ul), i = 3;
    if (reduce || !tpl) return;
    setInterval(function () {
      var d = data[i % data.length]; i++;
      var li = tpl.cloneNode(true);
      li.className = "fi enter";
      var ic = $(".fi__ic", li); ic.className = "fi__ic " + d[3];
      ic.innerHTML = d[0];
      $("b", li).textContent = d[1]; $("small", li).textContent = d[2];
      ul.insertBefore(li, ul.firstChild);
      void li.offsetWidth; li.classList.remove("enter");
      $$(".fi", ul).forEach(function (x, k) { x.classList.toggle("old", k >= 1); });
      var last = ul.children[3];
      if (last) { last.classList.add("leave"); setTimeout(function () { last.remove(); }, 450); }
    }, 2800);
  });

  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
