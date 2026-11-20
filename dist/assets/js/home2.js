/* SublimeHR — Home design option B: "Daylight" */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var U = function (id) { return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=60&h=60&q=70"; };

  /* mobile menu */
  var mb = $("[data-menu]"), menu = $("#menu");
  function setMenu(open) { mb.setAttribute("aria-expanded", String(open)); mb.setAttribute("aria-label", open ? "Close menu" : "Open menu"); menu.hidden = !open; document.documentElement.classList.toggle("menu-open", open); }
  if (mb) {
    mb.addEventListener("click", function () { setMenu(mb.getAttribute("aria-expanded") !== "true"); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 980) setMenu(false); });
  }

  /* count-up */
  function count(el) {
    var to = +el.getAttribute("data-cnt"), t0 = null;
    if (reduce) { el.textContent = to; return; }
    requestAnimationFrame(function f(t) { if (t0 === null) t0 = t; var q = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - q, 3))); if (q < 1) requestAnimationFrame(f); });
  }

  /* scroll: reveals, dashboard tilt, chart, counters */
  var rv = $$("[data-rv]"), stage = $("[data-tilt]"), cnts = $$("[data-cnt]"), drawn = false;
  function onScroll() {
    var h = window.innerHeight;
    rv = rv.filter(function (el) { if (el.getBoundingClientRect().top < h * .92) { el.classList.add("in"); return false; } return true; });
    cnts = cnts.filter(function (el) { if (el.getBoundingClientRect().top < h * .95) { count(el); return false; } return true; });
    if (stage) {
      var r = stage.getBoundingClientRect();
      if (!reduce) stage.style.setProperty("--t", Math.min(1, Math.max(0, (r.top - h * .14) / (h * .5))).toFixed(3));
      if (!drawn && r.top < h * .8) { drawn = true; stage.classList.add("drawn"); }
    }
  }
  var ticking = false;
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; onScroll(); }); } }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll(); setTimeout(onScroll, 300);
  if (reduce) $$("[data-rv]").forEach(function (el) { el.classList.add("in"); });

  /* live check-ins in the hero dashboard */
  var feed = $("[data-feed]");
  if (feed && !reduce) {
    var people = [["1651684215020-f7a5b6610f23", "Karan J.", "Selfie + GPS"], ["1494790108377-be9c29b29330", "Sara N.", "Mobile app"], ["1576558656222-ba66febe3dec", "John D.", "Biometric"], ["1607990283143-e81e7a2c9349", "Nadia R.", "Web clock-in"]];
    var k = 0, mins = 13, present = $(".kpi b[data-cnt]");
    setInterval(function () {
      var p = people[k++ % people.length]; mins = mins >= 29 ? 13 : mins + 2;
      var li = document.createElement("li"); li.className = "new";
      li.innerHTML = '<img src="' + U(p[0]) + '" alt="" width="30" height="30"><span><b>' + p[1] + '</b><small>' + p[2] + '</small></span><em class="ok">09:' + (mins < 10 ? "0" : "") + mins + '</em>';
      feed.insertBefore(li, feed.firstChild);
      while (feed.children.length > 3) feed.removeChild(feed.lastChild);
      if (present && drawn) present.textContent = String(Math.min(412, (+present.textContent || 396) + 1));
    }, 3200);
  }

  /* FAQ */
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
