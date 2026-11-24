/* SublimeHR — Living Office: characters that breathe, blink and watch you, events that keep happening,
   and a page that takes on the colour of the industry you pick. */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var data; try { data = JSON.parse($("#lo-data").textContent); } catch (e) { return; }
  var inds = data.industries, icons = data.icons;
  var body = document.body, hero = $("[data-hero]"), stage = $("[data-stage]");
  var slots = $$("[data-slot]", stage), cur = 0, userPicked = false, heroVisible = true;
  var leads = [$("[data-lead]"), $("[data-lead2]")];
  var chipBtns = $$("[data-chips] .chip");
  var coreSay = $("[data-say-core]"), core = $(".orbit__core .ppl"), needsEl = $("[data-needs]");
  var tally = { in: 412, leave: 9, swap: 3 }, last = -1, timers = [];

  /* ---------- fit the stage to its column ---------- */
  function fit() {
    var avail = hero.clientWidth - 112 - 470 - 36;
    stage.style.setProperty("--fit", String(Math.max(.5, Math.min(1, avail / 760))));
  }
  fit(); window.addEventListener("resize", fit);

  /* ---------- wall clock follows the real time ---------- */
  var hh = $(".hh", stage), mh = $(".mh", stage), sh = $(".sh", stage);
  function tick() {
    var d = new Date(), s = d.getSeconds(), m = d.getMinutes() + s / 60, h = (d.getHours() % 12) + m / 60;
    if (hh) hh.style.transform = "rotate(" + h * 30 + "deg)"; if (mh) mh.style.transform = "rotate(" + m * 6 + "deg)"; if (sh) sh.style.transform = "rotate(" + s * 6 + "deg)";
  }
  tick(); setInterval(tick, 1000);

  /* ---------- eyes follow the cursor; when nobody moves the mouse they look around ---------- */
  var pointer = null, lastMove = 0, rafId = 0, wander = 0;
  var allPpl = $$(".ppl");
  function look() {
    rafId = 0;
    var idle = performance.now() - lastMove > 2600;
    allPpl.forEach(function (p) {
      var ex, ey;
      if (!idle && pointer) {
        var r = $(".ppl__head", p).getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = pointer.x - cx, dy = pointer.y - cy, dist = Math.sqrt(dx * dx + dy * dy) || 1, k = Math.min(1, dist / 160) * 3.6;
        ex = dx / dist * k; ey = dy / dist * k;
      } else { ex = p._wx || 0; ey = p._wy || 0; }
      p.style.setProperty("--ex", ex.toFixed(2) + "px"); p.style.setProperty("--ey", ey.toFixed(2) + "px");
    });
  }
  function queueLook() { if (!rafId) rafId = requestAnimationFrame(look); }
  document.addEventListener("pointermove", function (e) {
    pointer = { x: e.clientX, y: e.clientY }; lastMove = performance.now(); queueLook();
    if (hero && e.clientY < hero.getBoundingClientRect().bottom) stage.style.setProperty("--px", ((e.clientX / window.innerWidth - .5) * 2).toFixed(3));
  }, { passive: true });
  setInterval(function () {
    if (performance.now() - lastMove < 2600) return;
    allPpl.forEach(function (p) { if (Math.random() < .55) { p._wx = (Math.random() - .5) * 6; p._wy = (Math.random() - .45) * 5; } });
    queueLook();
  }, 1700);

  /* ---------- speech ---------- */
  function say(el, text, ms) {
    el.textContent = text; el.classList.add("on");
    clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove("on"); }, ms || 2600);
  }
  function bump(key, n) {
    tally[key] += n; var b = $('[data-t="' + key + '"]'); if (!b) return;
    b.textContent = tally[key]; var s = b.parentNode; s.classList.remove("bump"); void s.offsetWidth; s.classList.add("bump");
  }
  function act() {
    if (!heroVisible || document.hidden) return;
    var evs = inds[cur].events, n = evs.length, idx;
    do { idx = Math.floor(Math.random() * n); } while (idx === last && n > 1);
    last = idx;
    var ev = evs[idx], slot = slots[ev[0]]; if (!slot) return;
    var p = $(".ppl", slot);
    slots.forEach(function (s) { $("[data-say]", s).classList.remove("on"); });
    say($("[data-say]", slot), ev[1], 2800);
    p.classList.remove("hop"); void p.offsetWidth; p.classList.add("hop", "talk");
    setTimeout(function () { p.classList.remove("talk"); }, 1500);
    if (ev[2] === "in") bump("in", 1); else if (ev[2] === "leave") bump("leave", 1); else if (ev[2] === "swap") bump("swap", 1);
  }
  if (!reduce) { setInterval(act, 3000); setTimeout(act, 900); }

  /* ---------- the needs that orbit the core character ---------- */
  function renderNeeds() {
    var d = inds[cur];
    needsEl.innerHTML = d.needs.map(function (n, i) {
      return '<li class="need" style="--a:' + (i * 60 - 90) + 'deg;--r:240px;--i:' + i + '"><span><button class="need__in" type="button" data-n="' + i + '"><i>' + icons[n[0]] + "</i>" + n[1] + "</button></span></li>";
    }).join("");
    // restart the orbit so the ring and each pill's counter-spin start on the same frame and pills stay upright
    needsEl.style.animation = "none"; void needsEl.offsetWidth; needsEl.style.animation = "";
  }
  function speakNeed(i) {
    var n = inds[cur].needs[i]; if (!n) return;
    say(coreSay, n[2], 4200); core.classList.add("talk"); clearTimeout(core._t); core._t = setTimeout(function () { core.classList.remove("talk"); }, 1600);
  }
  needsEl.addEventListener("mouseover", function (e) { var b = e.target.closest(".need__in"); if (b) speakNeed(+b.getAttribute("data-n")); });
  needsEl.addEventListener("focusin", function (e) { var b = e.target.closest(".need__in"); if (b) speakNeed(+b.getAttribute("data-n")); });
  needsEl.addEventListener("click", function (e) { var b = e.target.closest(".need__in"); if (b) speakNeed(+b.getAttribute("data-n")); });

  /* ---------- switching industry: the whole world changes ---------- */
  function setText(el, text) {
    el.classList.add("swap"); setTimeout(function () { el.textContent = text; el.classList.remove("swap"); }, 230);
  }
  function setIndustry(i) {
    cur = i; var d = inds[i];
    body.setAttribute("data-w", d.key);
    var meta = $('meta[name="theme-color"]'); if (meta) meta.setAttribute("content", d.color);
    chipBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-k") === d.key ? "true" : "false"); });
    leads.forEach(function (l) { if (l) setText(l, d.lead); });
    slots.forEach(function (s, k) {
      $("[data-role]", s).textContent = d.roles[k];
      $("[data-prop]", s).innerHTML = icons[d.props[k]] || "";
      var p = $(".ppl", s); p.classList.remove("hop"); void p.offsetWidth; p.classList.add("hop");
    });
    renderNeeds();
    say(coreSay, "Touch a need and I'll tell you more.", 3200);
    last = -1; setTimeout(act, 700);
  }
  chipBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      userPicked = true;
      var k = b.getAttribute("data-k"); for (var i = 0; i < inds.length; i++) if (inds[i].key === k) setIndustry(i);
    });
  });
  // until someone picks an industry, the office tours them on its own
  if (!reduce) setInterval(function () { if (!userPicked && heroVisible && !document.hidden) setIndustry((cur + 1) % inds.length); }, 9500);
  if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; }, { threshold: .15 }).observe(hero);

  /* ---------- peek cards: click also flips (touch and keyboard) ---------- */
  $$(".pk").forEach(function (c) {
    c.addEventListener("click", function () { c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") === "true" ? "false" : "true"); });
  });

  setIndustry(0);
  say(coreSay, "Touch a need and I'll tell you more.", 5000);
})();
