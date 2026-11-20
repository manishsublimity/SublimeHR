/* SublimeHR — Home design option B interactions */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };

  /* Mobile menu */
  var menuBtn = $("[data-menu]"), menu = $("#m2");
  function setMenu(open) {
    if (!menuBtn) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Close" : "Menu";
    menu.hidden = !open;
    document.documentElement.classList.toggle("m2-open", open);
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 980) setMenu(false); });
  }

  /* Live clock pill in the headline */
  var now = $("[data-now]"), face = $(".clockpill__face");
  function tick() {
    var d = new Date();
    if (now) now.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes());
    if (face && reduce) return;
  }
  tick(); setInterval(tick, 15000);

  /* Hero crowd: people clock in one by one, then the morning restarts */
  var crowd = $("[data-crowd]"), crowdN = $("[data-crowd-n]");
  if (crowd) {
    var faces = $$("span", crowd), k = 0;
    var step = function () {
      if (k >= faces.length) {
        setTimeout(function () { faces.forEach(function (f) { f.classList.remove("in"); }); k = 0; crowdN.textContent = "0"; }, 2600);
        return setTimeout(step, 3400);
      }
      faces[k].classList.add("in"); k++; crowdN.textContent = String(k);
      setTimeout(step, 380 + Math.random() * 520);
    };
    if (reduce) { faces.forEach(function (f) { f.classList.add("in"); }); crowdN.textContent = String(faces.length); }
    else setTimeout(step, 900);
  }

  /* The day: chapters drive the sticky sky (time, colours, sun position, progress) */
  var sky = $("[data-sky]"), sun = $("[data-sun]"), skyTime = $("[data-sky-time]"), skyTag = $("[data-sky-tag]"), skyProg = $("[data-sky-prog]");
  var chaps = $$("[data-chap]"), shown = null;
  function placeSun(p) {
    if (!sun) return;
    var a = Math.PI * (1 - p);                       // left horizon → right horizon
    var narrow = sky && sky.offsetWidth < 600;
    var x = narrow ? 76 + Math.cos(a) * 18 : 50 + Math.cos(a) * 40;   // % across (right side on phones)
    var y = narrow ? 62 - Math.sin(a) * 34 : 72 - Math.sin(a) * 52;   // % down
    sun.style.left = x + "%"; sun.style.top = y + "%";
  }
  function animateNumber(el, to, ms, suffix) {
    if (!el) return;
    if (reduce) { el.textContent = to + (suffix || ""); return; }
    var t0 = null;
    function f(t) { if (!t0) t0 = t; var q = Math.min(1, (t - t0) / ms); el.textContent = Math.round(to * (1 - Math.pow(1 - q, 3))) + (suffix || ""); if (q < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  function activate(c) {
    if (shown === c) return;
    shown = c;
    chaps.forEach(function (x) { x.classList.toggle("on", x === c); });
    var p = parseFloat(c.getAttribute("data-p"));
    if (sky) sky.setAttribute("data-mode", c.getAttribute("data-sky"));
    if (skyTime) skyTime.textContent = c.getAttribute("data-t");
    if (skyTag) skyTag.textContent = c.getAttribute("data-tag");
    if (skyProg) skyProg.style.width = Math.max(8, p * 100) + "%";
    placeSun(Math.min(.96, Math.max(.04, p)));
    var live = $("[data-live-count]", c); if (live) animateNumber(live, 412, 1600);
    var pct = $("[data-pay-pct]", c), bar = $("[data-pay-bar]", c);
    if (bar) { bar.style.width = "0"; requestAnimationFrame(function () { requestAnimationFrame(function () { bar.style.width = "100%"; }); }); animateNumber(pct, 100, 1800, "%"); }
  }
  if (chaps.length) {
    activate(chaps[0]);
    var pick = function () {
      var mid = window.innerHeight * 0.55, best = null, bestD = 1e9;
      chaps.forEach(function (c) { var r = c.getBoundingClientRect(); var d = Math.abs((r.top + r.bottom) / 2 - mid); if (r.bottom > 0 && r.top < window.innerHeight && d < bestD) { bestD = d; best = c; } });
      if (best) activate(best);
    };
    var ticking = false;
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; pick(); }); } }, { passive: true });
    window.addEventListener("resize", pick);
    pick();
  }

  /* Count-up numbers */
  var counted = false, nums = $$("[data-count2]");
  function countAll() {
    if (counted || !nums.length) return;
    var r = nums[0].getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9) { counted = true; nums.forEach(function (n) { animateNumber(n, +n.getAttribute("data-count2"), 1400); }); }
  }
  window.addEventListener("scroll", countAll, { passive: true }); countAll();

  /* Industries accordion */
  $$("[data-ind]").forEach(function (row) {
    var b = $(".ind2__btn", row);
    b.addEventListener("click", function () {
      var open = !row.classList.contains("open");
      $$("[data-ind].open").forEach(function (o) { if (o !== row) { o.classList.remove("open"); $(".ind2__btn", o).setAttribute("aria-expanded", "false"); } });
      row.classList.toggle("open", open); b.setAttribute("aria-expanded", String(open));
    });
  });

  /* Hold-to-book button (press & hold fills the ring; Enter/click with keyboard goes straight through) */
  var hold = $("[data-hold]");
  if (hold) {
    var fg = $(".fg", hold), label = $("[data-hold-label]", hold), raf = null, start = 0, DUR = 1100, pointerUsed = false, done = false;
    var setP = function (p) { fg.style.strokeDashoffset = String(100 - p * 100); };
    var stop = function () { cancelAnimationFrame(raf); hold.classList.remove("holding"); if (!done) { setP(0); label.textContent = "Hold to book"; } };
    var frame = function (t) {
      var p = Math.min(1, (t - start) / DUR); setP(p);
      if (p < 1) raf = requestAnimationFrame(frame);
      else { done = true; hold.classList.remove("holding"); hold.classList.add("done"); label.textContent = "Booked in!"; setTimeout(function () { window.location.href = hold.getAttribute("href"); }, 450); }
    };
    hold.addEventListener("pointerdown", function (e) {
      pointerUsed = true; if (done) return;
      if (reduce) return; e.preventDefault();
      hold.classList.add("holding"); label.textContent = "Keep holding…"; start = performance.now(); raf = requestAnimationFrame(frame);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) { hold.addEventListener(ev, stop); });
    hold.addEventListener("click", function (e) { if (pointerUsed && !reduce && !done) { e.preventDefault(); pointerUsed = false; } });
    hold.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  }

  /* Reveal on scroll */
  var rv = $$(".hero2__row, .crowd, .sec2__head, .tile, .nums2 > div, .ind2__row, .faq2__list details, .end2__in");
  if (!reduce) {
    rv.forEach(function (el, i) { el.classList.add("rv2"); el.style.transitionDelay = (i % 4) * 70 + "ms"; });
    var reveal = function () {
      var h = window.innerHeight * 0.94;
      rv = rv.filter(function (el) { if (el.getBoundingClientRect().top < h) { el.classList.add("in"); return false; } return true; });
    };
    window.addEventListener("scroll", reveal, { passive: true }); window.addEventListener("resize", reveal);
    reveal(); setTimeout(reveal, 300);
  }

  var y = $("[data-y2]"); if (y) y.textContent = new Date().getFullYear();
})();
