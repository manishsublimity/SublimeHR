/* SublimeHR — Home design option B ("Calm Aurora") interactions */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var vh = function () { return window.innerHeight || 800; };

  /* Nav shadow + mobile menu */
  var nav = $("[data-nav]"), mb = $("[data-menu]"), menu = $("#menu");
  function setMenu(open) {
    mb.setAttribute("aria-expanded", String(open)); mb.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open; document.documentElement.classList.toggle("menu-open", open);
  }
  if (mb) {
    mb.addEventListener("click", function () { setMenu(mb.getAttribute("aria-expanded") !== "true"); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 980) setMenu(false); });
  }

  /* Count-up */
  function count(el) {
    if (el._done) return; el._done = true;
    var to = +el.getAttribute("data-cnt");
    if (reduce) { el.textContent = to; return; }
    var t0 = null;
    requestAnimationFrame(function f(t) {
      if (t0 === null) t0 = t;
      var q = Math.min(1, (t - t0) / 1500);
      el.textContent = Math.round(to * (1 - Math.pow(1 - q, 3)));
      if (q < 1) requestAnimationFrame(f);
    });
  }

  /* Scroll-driven: reveals, dashboard tilt, drawn lines, counters, lit statement */
  var rv = $$("[data-rv]"), stage = $("[data-tilt]"), drawables = $$(".chart, .steps"), cnts = $$("[data-cnt]");
  var say = $("[data-say]"), words = say ? $$("span", say) : [];
  function onScroll() {
    var h = vh();
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 10);
    rv = rv.filter(function (el) { if (el.getBoundingClientRect().top < h * 0.92) { el.classList.add("in"); return false; } return true; });
    if (stage && !reduce) {
      var r = stage.getBoundingClientRect();
      var t = Math.min(1, Math.max(0, (r.top - h * 0.12) / (h * 0.55)));
      stage.style.setProperty("--t", t.toFixed(3));
    }
    drawables = drawables.filter(function (el) { if (el.getBoundingClientRect().top < h * 0.85) { el.classList.add("drawn"); return false; } return true; });
    cnts = cnts.filter(function (el) { if (el.getBoundingClientRect().top < h * 0.95) { count(el); return false; } return true; });
    if (words.length) {
      var sr = say.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (h * 0.85 - sr.top) / (sr.height + h * 0.35)));
      var n = Math.round(p * words.length);
      words.forEach(function (w, i) { w.classList.toggle("lit", reduce || i < n); });
    }
  }
  var ticking = false;
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; onScroll(); }); } }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll(); setTimeout(onScroll, 250);
  if (reduce) $$("[data-rv]").forEach(function (el) { el.classList.add("in"); });

  /* Hero requests: statuses flip to "Approved" one by one, then reset */
  var reqs = $$("[data-reqs] .st");
  if (reqs.length && !reduce) {
    var k = 0;
    reqs.forEach(function (s) { s.textContent = "Pending"; });
    setInterval(function () {
      if (k >= reqs.length) { reqs.forEach(function (s) { s.classList.remove("done"); s.textContent = "Pending"; }); k = 0; return; }
      reqs[k].classList.add("done"); reqs[k].textContent = k === 2 ? "Reviewed" : "Approved"; k++;
    }, 1600);
  } else reqs.forEach(function (s) { s.classList.add("done"); });

  /* Cursor spotlight on cards */
  $$(".spot").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px"); el.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* Module showcase: tabs + auto-advance every 6s (pauses on hover) */
  var show = $("[data-show]");
  if (show) {
    var tabs = $$("[data-tab]", show), panels = $$("[data-panel]", show), cur = 0, timer = null, hover = false;
    var go = function (i) {
      cur = (i + tabs.length) % tabs.length;
      tabs.forEach(function (t, j) { t.setAttribute("aria-selected", String(j === cur)); var bar = $(".tp i", t); if (bar) { bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = ""; } });
      panels.forEach(function (p, j) { p.classList.toggle("on", j === cur); var c = $(".spark", p); if (c && j === cur) { c.classList.remove("drawn"); void c.offsetWidth; c.classList.add("drawn"); } });
    };
    var arm = function () { clearInterval(timer); if (!reduce) timer = setInterval(function () { if (!hover) go(cur + 1); }, 6000); };
    tabs.forEach(function (t, i) { t.addEventListener("click", function () { go(i); arm(); }); });
    show.addEventListener("mouseenter", function () { hover = true; }); show.addEventListener("mouseleave", function () { hover = false; });
    go(0); arm();
  }

  /* FAQ accordion */
  $$(".qa").forEach(function (qa) {
    var b = $("button", qa);
    b.addEventListener("click", function () {
      var open = !qa.classList.contains("open");
      $$(".qa.open").forEach(function (o) { if (o !== qa) { o.classList.remove("open"); $("button", o).setAttribute("aria-expanded", "false"); } });
      qa.classList.toggle("open", open); b.setAttribute("aria-expanded", String(open));
    });
  });

  var y = $("[data-y]"); if (y) y.textContent = new Date().getFullYear();
})();
