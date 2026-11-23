/* SublimeHR — Timecard hero: punch the card → stamp lands → paper becomes the app */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme toggle (shares the main site's storage key) ---------- */
  var root = document.documentElement, tg = $("[data-theme-toggle]");
  function syncTheme() { if (tg) tg.setAttribute("aria-label", root.getAttribute("data-theme") === "dark" ? "Switch to light theme" : "Switch to dark theme"); }
  if (tg) {
    tg.addEventListener("click", function () {
      var dark = root.getAttribute("data-theme") !== "dark";
      if (dark) root.setAttribute("data-theme", "dark"); else root.removeAttribute("data-theme");
      try { localStorage.setItem("shr-theme", dark ? "dark" : "light"); } catch (e) {}
      syncTheme();
    });
    syncTheme();
  }

  /* ---------- 02 · leave: when scrolled into view the slip is stamped, then becomes the app ---------- */
  (function () {
    var sec = $("[data-leave]"), st = $("[data-lv-stage]"); if (!sec || !st) return;
    var bar = $("[data-lv-bar]", st), days = $("[data-lv-days]", st), done = false;
    function go() {
      if (done) return; done = true; sec.classList.add("in");
      var d = reduce ? 0 : 1;
      setTimeout(function () { st.classList.add("stamped"); }, 500 * d);
      setTimeout(function () {
        st.classList.add("digital");
        if (bar) bar.style.setProperty("--w", "70%");
        if (days) { var n = 16, t = setInterval(function () { n--; days.textContent = n; if (n <= 14) clearInterval(t); }, reduce ? 1 : 420); }
      }, 1700 * d);
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { go(); o.disconnect(); } }, { threshold: 0.35 }).observe(st);
    } else go();
    st.addEventListener("click", function () { if (!done) go(); });
  })();

  /* ---------- 03 · shifts: pencil swap on the rota, then the live scheduler does the same swap ---------- */
  (function () {
    var sec = $("[data-shifts]"), st = $("[data-sh-stage]"); if (!sec || !st) return;
    var paper = Array.prototype.slice.call(st.querySelectorAll(".rota [data-sw]")),
        app = Array.prototype.slice.call(st.querySelectorAll(".sh__app [data-app-sw]")),
        toast = $("[data-sh-toast]", st), done = false;
    var cls = { M: "m", E: "e", N: "n" };
    function setCell(el, v) { el.textContent = v; el.className = "c " + cls[v]; }
    function go() {
      if (done) return; done = true; sec.classList.add("in");
      var d = reduce ? 0 : 1;
      // the pencil scribble, then each cell is rubbed out and rewritten with the other person's shift
      setTimeout(function () { st.classList.add("swap"); }, 400 * d);
      setTimeout(function () {
        paper.forEach(function (c, i) { c.setAttribute("data-new", paper[1 - i].textContent.trim()); c.classList.add("swapped"); });
      }, 1100 * d);
      setTimeout(function () { paper.forEach(function (c) { c.classList.add("rewritten"); }); }, 1700 * d);
      // the product appears and performs the same swap
      setTimeout(function () { st.classList.add("digital"); }, 2900 * d);
      setTimeout(function () { app.forEach(function (c) { c.classList.add("lift"); }); }, 3900 * d);
      setTimeout(function () {
        var a = app[0].textContent.trim(), b = app[1].textContent.trim();
        setCell(app[0], b); setCell(app[1], a);
      }, 4500 * d);
      setTimeout(function () { app.forEach(function (c) { c.classList.remove("lift"); }); if (toast) toast.classList.add("on"); }, 5000 * d);
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { go(); o.disconnect(); } }, { threshold: 0.35 }).observe(st);
    } else go();
    st.addEventListener("click", function () { if (!done) go(); });
  })();

  /* ---------- 04 · payroll: slip slides out, is stamped PAID, tears off, then lands on the phone as a live figure ---------- */
  (function () {
    var sec = $("[data-payroll]"), st = $("[data-pr-stage]"); if (!sec || !st) return;
    var out = $("[data-pr-count]", st), done = false, TARGET = 5215;
    function fmt(n) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
    function count() {
      if (reduce) { out.textContent = fmt(TARGET); return; }
      var t0 = performance.now(), D = 1300;
      (function f(t) { var p = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - p, 3); out.textContent = fmt(TARGET * e); if (p < 1) requestAnimationFrame(f); })(t0);
    }
    function go() {
      if (done) return; done = true; sec.classList.add("in");
      var d = reduce ? 0 : 1;
      setTimeout(function () { st.classList.add("out"); }, 300 * d);
      setTimeout(function () { st.classList.add("paid"); }, 1300 * d);
      setTimeout(function () { st.classList.add("tear"); }, 2100 * d);
      setTimeout(function () { st.classList.add("digital"); count(); }, 2800 * d);
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { go(); o.disconnect(); } }, { threshold: 0.35 }).observe(st);
    } else go();
    st.addEventListener("click", function () { if (!done) go(); });
  })();

  /* ---------- 05 · visitors: logbook is crossed out, guest types in on the kiosk, badge prints and hangs ---------- */
  (function () {
    var sec = $("[data-visitors]"), st = $("[data-vs-stage]"); if (!sec || !st) return;
    var typ = $("[data-vs-type]", st), done = false;
    var now = new Date(), t = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    Array.prototype.forEach.call(st.querySelectorAll("[data-vs-time],[data-vs-time2]"), function (e) { e.textContent = t; });
    function type() {
      var s = typ.getAttribute("data-text"), i = 0;
      if (reduce) { typ.textContent = s; return; }
      var iv = setInterval(function () { i++; typ.textContent = s.slice(0, i); if (i >= s.length) clearInterval(iv); }, 70);
    }
    function go() {
      if (done) return; done = true; sec.classList.add("in");
      var d = reduce ? 0 : 1;
      setTimeout(function () { st.classList.add("struck"); }, 500 * d);
      setTimeout(function () { st.classList.add("digital"); }, 1400 * d);
      setTimeout(type, 2300 * d);
      setTimeout(function () { st.classList.add("done"); }, 3500 * d);
      setTimeout(function () { st.classList.add("printed"); }, 3900 * d);
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { go(); o.disconnect(); } }, { threshold: 0.35 }).observe(st);
    } else go();
    st.addEventListener("click", function () { if (!done) go(); });
  })();

  /* ---------- 06 · closing: the pile of blank forms falls away ---------- */
  (function () {
    var sec = $("[data-end]"); if (!sec) return;
    function go() { sec.classList.add("in"); }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { setTimeout(go, reduce ? 0 : 700); o.disconnect(); } }, { threshold: 0.4 }).observe(sec);
    } else go();
  })();

  /* ---------- the punch ---------- */
  var stage = $("[data-stage]"); if (!stage) return;
  var card = $("[data-card]", stage), inCell = $("[data-in]", stage), stamp = $("[data-stamp]", stage),
      phone = $("[data-phone]", stage), clock = $("[data-clock]", stage), again = $("[data-again]", stage), cta = $("[data-punch-cta]");
  var busy = false, timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, reduce ? 0 : ms)); }
  function hhmm(d) { return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); }

  // the slot clock ticks with the visitor's real time
  function tick() { if (clock) clock.textContent = hhmm(new Date()); }
  tick(); setInterval(tick, 15000);

  function punch() {
    if (busy) return; busy = true;
    var t = hhmm(new Date());
    stage.classList.add("punching", "flash");
    later(function () {
      stage.classList.remove("punching", "flash");
      stage.classList.add("printed");
      inCell.textContent = t; inCell.classList.add("printed");
      stamp.classList.add("on");
    }, 520);
    later(function () {
      stage.classList.add("digital");
      var b = $(".phone__bar span", phone), d = $(".phone__done b", phone);
      if (b) b.textContent = t; if (d) d.textContent = t;
      phone.classList.add("on");
      again.hidden = false; busy = false;
    }, 1500);
  }

  function reset() {
    timers.forEach(clearTimeout); timers = [];
    stage.classList.remove("punching", "printed", "digital", "flash");
    phone.classList.remove("on"); stamp.classList.remove("on");
    inCell.textContent = ""; inCell.classList.remove("printed");
    again.hidden = true; busy = false;
  }

  card.addEventListener("click", function () { if (!stage.classList.contains("digital")) punch(); });
  card.setAttribute("tabindex", "0"); card.setAttribute("role", "button");
  card.setAttribute("aria-label", "Punch the timecard: click to clock Aisha in");
  card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!stage.classList.contains("digital")) punch(); } });
  again.addEventListener("click", reset);
  if (cta) cta.addEventListener("click", function () {
    var r = stage.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) stage.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    if (stage.classList.contains("digital")) reset();
    later(punch, 350);
  });

  // gentle invitation: if the visitor hasn't punched after a few seconds, punch it for them once
  if (!reduce) later(function () { if (!stage.classList.contains("digital") && !busy && document.visibilityState === "visible") punch(); }, 5200);
})();
