/* The day and night lamp: pull the chain for night, pull the lamp down and watch it jump back, tickle its face, change or remove the bulb. */
(function () {
  "use strict";
  var L = document.querySelector("[data-lamp]"); if (!L) return;
  var root = document.documentElement, $ = function (s) { return L.querySelector(s); };
  var body = $(".lamp__body"), cord = $("[data-lcord]"), face = $("[data-lface]"), bulb = $("[data-lbulb]"), chain = $("[data-lpull]"), menu = $("[data-lmenu]"), sayEl = $("[data-lsay]"), bulbAct = $('[data-lact="bulb"]');
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches, meta = document.querySelector('meta[name="theme-color"]');
  var st = { dy: 0, bulbOut: false, tick: 0, tickT: 0, sayT: 0, dragging: false, busy: false };
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function isDark() { return root.getAttribute("data-theme") === "dark"; }
  function sync() { var d = isDark(); chain.setAttribute("aria-label", d ? "Pull the chain for day" : "Pull the chain for night"); if (meta) meta.setAttribute("content", d ? "#0A1527" : "#FFFFFF"); }
  function say(t, ms) { sayEl.textContent = t; sayEl.classList.remove("on"); void sayEl.offsetWidth; sayEl.classList.add("on"); clearTimeout(st.sayT); st.sayT = setTimeout(function () { sayEl.classList.remove("on"); }, ms || 1700); }
  function mood(c, ms) { face.classList.add(c); setTimeout(function () { face.classList.remove(c); }, ms || 700); }
  function sparkles(n) {
    var r = face.getBoundingClientRect(), cols = ["#FFD05A", "#FF8A70", "#45C4B0", "#7A5CF0", "#fff"];
    for (var i = 0; i < n; i++) { var s = document.createElement("i"); s.className = "lamp__sp"; s.style.left = (r.left + r.width / 2) + "px"; s.style.top = (r.top + r.height / 2) + "px"; s.style.background = cols[i % cols.length]; var a = Math.random() * 6.28, d = 40 + Math.random() * 50; s.style.setProperty("--x", Math.cos(a) * d + "px"); s.style.setProperty("--y", Math.sin(a) * d - 20 + "px"); document.body.appendChild(s); setTimeout(function (e) { e.remove(); }.bind(null, s), 900); }
  }

  /* ----- colours of the bulb ----- */
  function setColor(v, quiet) {
    var p = v.split("|"); L.style.setProperty("--lg", p[0]); L.style.setProperty("--lb", p[1]); L.style.setProperty("--ls", p[2]); save("shr-lamp", v);
    Array.prototype.forEach.call(L.querySelectorAll("[data-lc]"), function (b) { b.classList.toggle("on", b.getAttribute("data-lc") === v); });
    if (!quiet) { say("Ooh, nice colour!"); mood("giggle", 600); }
  }
  var saved = load("shr-lamp"); if (saved) setColor(saved, true); else setColor("255,200,70|#FFFBE0|#FFC233", true);

  /* ----- day and night, with the light spreading from the bulb ----- */
  function switchTheme() {
    if (st.busy) return; st.busy = true;
    var toDark = !isDark(); L.classList.add("flicker"); say(toDark ? "Moon time!" : "Rise and shine!", 1500);
    var fx = document.createElement("div"); fx.className = "lamp-fx " + (toDark ? "to-dark" : "to-day");
    fx.innerHTML = toDark ? '<div class="orb moon"><i></i></div><span class="st s1"></span><span class="st s2"></span><span class="st s3"></span><span class="st s4"></span><span class="st s5"></span><span class="st s6"></span>' : '<div class="orb sun"><b class="rays"></b><b class="rays r2"></b><i></i></div>';
    document.body.appendChild(fx); void fx.offsetWidth; fx.classList.add("go");
    setTimeout(function () { if (toDark) root.setAttribute("data-theme", "dark"); else root.removeAttribute("data-theme"); save("shr-theme", toDark ? "dark" : "light"); sync(); }, reduce ? 0 : 650);
    setTimeout(function () { fx.classList.add("out"); L.classList.remove("flicker"); }, reduce ? 0 : 1150);
    setTimeout(function () { fx.remove(); st.busy = false; }, reduce ? 0 : 1800);
  }

  /* ----- a tiny spring for the lamp when it is let go ----- */
  function setDy(v) { st.dy = v; L.style.setProperty("--dy", v.toFixed(1) + "px"); }
  function spring(from, vel) {
    var x = from, v = vel || 0, last = performance.now(), k = 230, c = 9.5; st.dragging = false; L.classList.add("springing");
    (function step(now) { var dt = Math.min(.032, (now - last) / 1000); last = now; v += (-k * x - c * v) * dt; x += v * dt; setDy(x); if (Math.abs(x) > .25 || Math.abs(v) > 6) requestAnimationFrame(step); else { setDy(0); L.classList.remove("springing"); } })(last);
  }

  /* ----- drag: the lamp (pulls down, springs back) and the chain (day or night) ----- */
  function drag(el, onMove, onUp) {
    el.addEventListener("pointerdown", function (e) {
      if (e.button) return; var y0 = e.clientY, moved = 0; try { el.setPointerCapture(e.pointerId); } catch (x) {}
      function mv(ev) { var d = ev.clientY - y0; moved = Math.max(moved, Math.abs(d)); onMove(d, moved); }
      function up(ev) { el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); onUp(ev.clientY - y0, moved); }
      el.addEventListener("pointermove", mv); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up); e.preventDefault();
    });
  }
  drag(face, function (d, moved) {
    if (moved < 5) return; if (!st.dragging) { st.dragging = true; L.classList.add("pulling"); L.classList.remove("springing"); mood("oh", 5000); }
    setDy(Math.max(0, Math.min(170, d * .85 - (d > 90 ? (d - 90) * .35 : 0))));
  }, function (d, moved) {
    L.classList.remove("pulling"); face.classList.remove("oh");
    if (moved < 5) { tickle(); return; }
    var big = st.dy > 80; say(big ? "Wheeeee!" : "Wheee!", 1400); mood("laugh", 1100); spring(st.dy, -(st.dy * 1.2));
  });
  var pullBase = 0;
  drag(chain, function (d, moved) { if (moved < 4) return; var v = Math.max(0, Math.min(64, d)); chain.style.setProperty("--cy", v + "px"); L.classList.add("chain-pull"); pullBase = v; }, function (d, moved) {
    chain.style.setProperty("--cy", "0px"); L.classList.remove("chain-pull");
    if (moved < 4 || pullBase >= 22) { pullBase = 0; switchTheme(); } else pullBase = 0;
  });
  chain.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); chain.style.setProperty("--cy", "26px"); setTimeout(function () { chain.style.setProperty("--cy", "0px"); }, 160); switchTheme(); } });

  /* ----- the face: tickle it ----- */
  var lines = ["Hehe!", "That tickles!", "Hihi!", "Stop it!", "Ha ha ha!", "Not the cheeks!", "Eep!"];
  function tickle() {
    st.tick++; clearTimeout(st.tickT); st.tickT = setTimeout(function () { st.tick = 0; }, 1600);
    if (st.tick >= 6) { st.tick = 0; say("Okay okay, you win!", 1900); L.classList.remove("spin"); void L.offsetWidth; L.classList.add("spin"); setTimeout(function () { L.classList.remove("spin"); }, 1000); mood("dizzy", 1500); sparkles(16); return; }
    say(lines[Math.floor(Math.random() * lines.length)], 1200); mood("giggle", 650); if (st.tick === 3) sparkles(7);
    L.classList.remove("jiggle"); void L.offsetWidth; L.classList.add("jiggle");
  }
  face.addEventListener("dblclick", function () { mood("wink", 900); say("Wink wink!", 1100); });
  face.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tickle(); } });

  /* the eyes follow the pointer */
  document.addEventListener("pointermove", function (e) {
    if (st.dragging) return; var r = face.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, dx = e.clientX - cx, dy = e.clientY - cy, d = Math.max(1, Math.hypot(dx, dy)), m = Math.min(1, d / 220);
    face.style.setProperty("--ex", (dx / d * 2.2 * m).toFixed(2) + "px"); face.style.setProperty("--ey", (dy / d * 1.6 * m).toFixed(2) + "px");
  }, { passive: true });

  /* ----- the bulb: take it out, put it back ----- */
  function bulbToggle() {
    st.bulbOut = !st.bulbOut; L.classList.toggle("nobulb", st.bulbOut); root.classList.toggle("nobulb", st.bulbOut);
    bulbAct.textContent = st.bulbOut ? "Put the bulb back" : "Take the bulb out";
    say(st.bulbOut ? "Hey! Where did my bulb go?" : "Thank you, that is better!", 1900); mood(st.bulbOut ? "oh" : "giggle", 1200);
  }
  bulb.addEventListener("click", bulbToggle);

  /* ----- the options on the cord ----- */
  function openMenu(on) { menu.hidden = !on; cord.setAttribute("aria-expanded", String(on)); L.classList.toggle("menu", on); }
  cord.addEventListener("click", function (e) { e.stopPropagation(); openMenu(menu.hidden); if (!menu.hidden) say("Pick me a bulb!", 1400); });
  menu.addEventListener("click", function (e) {
    e.stopPropagation(); var c = e.target.closest("[data-lc]"), a = e.target.closest("[data-lact]");
    if (c) setColor(c.getAttribute("data-lc")); else if (a) { if (a.getAttribute("data-lact") === "bulb") bulbToggle(); else { L.classList.remove("nudge"); void L.offsetWidth; L.classList.add("nudge"); say("Wheee!", 1200); mood("laugh", 900); } openMenu(false); }
  });
  document.addEventListener("pointerdown", function (e) { if (!menu.hidden && !L.contains(e.target)) openMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { openMenu(false); cord.focus(); } });

  /* ----- little life of its own ----- */
  if (!reduce) {
    (function idle() {
      setTimeout(function () {
        if (!st.dragging && !st.busy && document.visibilityState === "visible") {
          var r = Math.random();
          if (r < .35) { L.classList.remove("nudge"); void L.offsetWidth; L.classList.add("nudge"); } else if (r < .6) { mood("yawn", 1500); say("Yaaawn…", 1400); } else if (r < .85) { mood("wink", 900); } else { say("Psst, pull my chain!", 2000); }
        }
        idle();
      }, 7000 + Math.random() * 6000);
    })();
  }
  sync();
})();
