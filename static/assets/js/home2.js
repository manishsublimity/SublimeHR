/* SublimeHR — Hero lab interactions */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- B · Thread: draw the line, light each stop, then a glowing runner travels the day ---------- */
  var th = $("[data-thread]");
  if (th) {
    var path = $(".ghost", th), svg = $("svg", th), runner = $("[data-runner]", th), stops = $$(".stop", th);
    var total = path.getTotalLength(), VBW = 700, VBH = 620, started = false;
    function pt(p) { var q = path.getPointAtLength(total * p), r = svg.getBoundingClientRect(); return [q.x * r.width / VBW, q.y * r.height / VBH]; }
    function placeStops() { stops.forEach(function (s) { var xy = pt(+s.getAttribute("data-at") / 100); s.style.left = xy[0] + "px"; s.style.top = xy[1] + "px"; }); }
    placeStops(); window.addEventListener("resize", placeStops);
    function run() {
      if (started) return; started = true;
      if (reduce) { th.style.setProperty("--off", "0"); stops.forEach(function (s) { s.classList.add("hit"); }); return; }
      var t0 = performance.now(), D = 3600;
      (function draw(t) {
        var p = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - p, 2);
        th.style.setProperty("--off", String(100 - e * 100));
        var xy = pt(e); runner.style.transform = "translate(" + xy[0] + "px," + xy[1] + "px)"; runner.classList.add("on");
        stops.forEach(function (s) { if (e * 100 >= +s.getAttribute("data-at")) s.classList.add("hit"); });
        if (p < 1) requestAnimationFrame(draw); else loop();
      })(t0);
    }
    function loop() {   // after the first draw, the runner keeps flowing through the day
      var t0 = performance.now(), D = 7000;
      (function f(t) { var p = ((t - t0) % D) / D; var xy = pt(p); runner.style.transform = "translate(" + xy[0] + "px," + xy[1] + "px)"; requestAnimationFrame(f); })(t0);
    }
    var check = function () { var r = th.getBoundingClientRect(); if (r.top < window.innerHeight * .8 && r.bottom > 0) run(); };
    window.addEventListener("scroll", check, { passive: true }); check();
  }

  /* ---------- C · Deck: auto-shuffle + mouse tilt ---------- */
  var deck = $("[data-deck]");
  if (deck) {
    var cards = $$(".dk", deck), order = cards.map(function (c, i) { return i; });
    var pose = [
      "translate3d(0,0,60px) rotate(0deg)",
      "translate3d(46px,22px,0) rotate(6deg) scale(.95)",
      "translate3d(-48px,34px,-40px) rotate(-7deg) scale(.9)",
      "translate3d(14px,56px,-80px) rotate(11deg) scale(.85)"
    ];
    function lay() { order.forEach(function (ci, slot) { var c = cards[ci]; c.style.zIndex = String(10 - slot); c.style.transform = pose[slot]; c.style.filter = slot ? "saturate(.85) brightness(.97)" : "none"; }); }
    lay();
    function shuffle() {
      var top = cards[order[0]];
      top.style.transform = "translate3d(-130%, -8%, 80px) rotate(-22deg)";
      setTimeout(function () { order.push(order.shift()); lay(); }, 520);
    }
    if (!reduce) setInterval(function () { if (!deck.matches(":hover")) shuffle(); }, 2800);
    deck.addEventListener("click", shuffle);
    deck.addEventListener("pointermove", function (e) {
      var r = deck.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      deck.style.transform = "rotateY(" + (x * 16) + "deg) rotateX(" + (-y * 12) + "deg)";
    });
    deck.addEventListener("pointerleave", function () { deck.style.transform = ""; });
    deck.style.transformStyle = "preserve-3d"; deck.style.transition = "transform .4s cubic-bezier(.22,.8,.24,1)";
  }

  /* ---------- switcher highlight ---------- */
  var sw = $$("[data-sw]"), heroes = sw.map(function (a) { return document.getElementById(a.getAttribute("data-sw")); });
  function active() {
    var mid = window.innerHeight / 2, cur = 0;
    heroes.forEach(function (h, i) { var r = h.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) cur = i; });
    sw.forEach(function (a, i) { a.classList.toggle("on", i === cur); });
  }
  window.addEventListener("scroll", active, { passive: true }); active();
})();
