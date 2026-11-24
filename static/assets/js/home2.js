/* SublimeHR — Living Office. Characters that breathe, blink, hold things and watch you; a page guide (Subi) that
   tells you about each section and shows you how the demos work; optional sound; a dashboard with five views;
   a full phone app; a real 3D walker; six working mini products; role views; and an assistant chat. */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var data; try { data = JSON.parse($("#lo-data").textContent); } catch (e) { return; }
  var inds = data.industries, icons = data.icons, names = data.people;
  var body = document.body, hero = $("[data-hero]"), stage = $("[data-stage]"), nav = $("[data-nav]"), fx = $("[data-fx]");
  var slots = $$("[data-slot]", stage), allPpl = $$(".ppl"), cur = 0, userPicked = false, heroVisible = true;
  var leads = [$("[data-lead]"), $("[data-lead2]")], chipBtns = $$("[data-chips] .chip");
  var coreSay = $("[data-say-core]"), core = $(".orbit__core .ppl"), needsEl = $("[data-needs]"), painsEl = $("[data-pains]"), recEl = $("[data-rec]");
  var tally = { in: 412, leave: 9, swap: 3 }, last = -1, pitch = [260, 200, 300, 175, 320, 225, 285];
  var fmt = function (n) { return Math.round(n).toLocaleString("en-US"); };
  var rnd = function (s) { var x = Math.sin(s * 9301 + 49297) * 233280; return x - Math.floor(x); };
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, reduce ? 0 : ms); }); };
  var vis = function (el, cb, th) { if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { cb(es[0].isIntersecting); }, { threshold: th || .25 }).observe(el); else cb(true); };

  /* ================= sound: a tiny synth, off until the visitor turns it on ================= */
  var Snd = (function () {
    var ctx, master, on = false, buf;
    function ensure() {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
        ctx = new AC(); master = ctx.createGain(); master.gain.value = .6; master.connect(ctx.destination);
        buf = ctx.createBuffer(1, ctx.sampleRate * .5, ctx.sampleRate); var d = buf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === "suspended") ctx.resume(); return true;
    }
    function tone(f, dur, type, vol, delay, to) {
      if (!on || !ctx) return; var t = ctx.currentTime + (delay || 0), o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || "sine"; o.frequency.setValueAtTime(f, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol || .15, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .05);
    }
    function sweep(dur, f0, f1, vol) {
      if (!on || !ctx) return; var t = ctx.currentTime, s = ctx.createBufferSource(), flt = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = buf; flt.type = "bandpass"; flt.Q.value = 1.4; flt.frequency.setValueAtTime(f0, t); flt.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * .3); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      s.connect(flt); flt.connect(g); g.connect(master); s.start(t); s.stop(t + dur + .05);
    }
    return {
      set: function (v) { on = v; if (v) ensure(); }, get: function () { return on; },
      tick: function () { tone(1500, .04, "square", .04); }, pop: function () { tone(340, .13, "sine", .16, 0, 780); },
      ding: function () { tone(988, .55, "sine", .15); tone(1480, .75, "sine", .09, .09); },
      chime: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, .5, "triangle", .11, i * .09); }); },
      cash: function () { tone(1568, .16, "triangle", .13); tone(2093, .55, "triangle", .13, .1); },
      boop: function () { tone(230, .28, "sawtooth", .08, 0, 150); }, whoosh: function () { sweep(.4, 350, 2600, .14); },
      blip: function (base) { var n = 4 + Math.floor(Math.random() * 4); for (var i = 0; i < n; i++) tone(base * (.85 + Math.random() * .55), .07, "triangle", .06, i * .075); }
    };
  })();
  var sndBtn = $("[data-sound]"), nudge = $("[data-nudge]");
  function setSound(v) {
    Snd.set(v); sndBtn.setAttribute("aria-pressed", v ? "true" : "false"); sndBtn.setAttribute("aria-label", v ? "Turn sound off" : "Turn sound on"); $("span", sndBtn).textContent = v ? "Sound on" : "Sound off";
    try { localStorage.setItem("lo-sound", v ? "1" : "0"); localStorage.setItem("lo-nudge", "1"); } catch (e) {}
    nudge.hidden = true; if (v) setTimeout(Snd.ding, 40);
  }
  sndBtn.addEventListener("click", function () { setSound(!Snd.get()); });
  try {
    if (localStorage.getItem("lo-sound") === "1") { var arm = function () { setSound(true); document.removeEventListener("pointerdown", arm); }; document.addEventListener("pointerdown", arm, { once: true }); }
    else if (!localStorage.getItem("lo-nudge") && !reduce) setTimeout(function () { if (!Snd.get()) { nudge.hidden = false; setTimeout(function () { nudge.hidden = true; }, 9000); } }, 7000);
  } catch (e) {}

  /* ================= confetti and tap rings ================= */
  function burst(x, y, n) {
    if (reduce) return; var cols = ["#FFD05A", "#FF8A70", "#6BF3D2", "#9B8CFF", "#ffffff", "#7FB4FF"];
    for (var i = 0; i < (n || 14); i++) {
      var s = document.createElement("i"), a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 110;
      s.className = "cf"; s.style.left = x + "px"; s.style.top = y + "px"; s.style.setProperty("--c", cols[i % cols.length]);
      s.style.setProperty("--dx", Math.cos(a) * d + "px"); s.style.setProperty("--dy", Math.sin(a) * d - 40 + "px"); s.style.setProperty("--r", Math.random() * 540 - 270 + "deg");
      fx.appendChild(s); setTimeout(function (el) { el.remove(); }.bind(null, s), 1250);
    }
  }
  function burstAt(el, n) { var r = el.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 3, n); }
  function ring(el) { var r = el.getBoundingClientRect(), d = document.createElement("i"); d.className = "tapring"; d.style.left = r.left + r.width / 2 + "px"; d.style.top = r.top + r.height / 2 + "px"; fx.appendChild(d); setTimeout(function () { d.remove(); }, 900); }

  /* ================= stage fit, wall clock, nav, back to top ================= */
  function fit() { var w = Math.min(hero.clientWidth, 1600) - 112; stage.style.setProperty("--fit", String(Math.max(.55, Math.min(1.28, (w - 440 - 36) / 760)))); }
  fit(); window.addEventListener("resize", fit);
  var wc = $(".wallclock", stage), hh = $(".hh", wc), mh = $(".mh", wc), sh = $(".sh", wc);
  function tick() {
    var d = new Date(), s = d.getSeconds(), m = d.getMinutes() + s / 60, h = (d.getHours() % 12) + m / 60;
    hh.style.transform = "rotate(" + h * 30 + "deg)"; mh.style.transform = "rotate(" + m * 6 + "deg)"; sh.style.transform = "rotate(" + s * 6 + "deg)";
  }
  tick(); setInterval(tick, 1000);
  var topBtn = $("[data-top]");
  window.addEventListener("scroll", function () { nav.classList.toggle("solid", window.scrollY > 30); nav.classList.toggle("onhero", window.scrollY < hero.offsetHeight - 90); topBtn.classList.toggle("on", window.scrollY > 900); var g = $("[data-guide]"); if (g) g.classList.toggle("away", window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 520); }, { passive: true });
  topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); Snd.tick(); });

  /* ================= eyes follow the cursor; idle eyes wander ================= */
  var pointer = null, lastMove = 0, rafId = 0;
  function look() {
    rafId = 0; var idle = performance.now() - lastMove > 2600;
    allPpl.forEach(function (p) {
      var ex, ey;
      if (p.classList.contains("walking")) { ex = 3.4; ey = 0; }
      else if (!idle && pointer) {
        var r = $(".ppl__head", p).getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = pointer.x - cx, dy = pointer.y - cy, dist = Math.sqrt(dx * dx + dy * dy) || 1, k = Math.min(1, dist / 160) * 3.6; ex = dx / dist * k; ey = dy / dist * k;
      } else { ex = p._wx || 0; ey = p._wy || 0; }
      p.style.setProperty("--ex", ex.toFixed(2) + "px"); p.style.setProperty("--ey", ey.toFixed(2) + "px");
    });
  }
  function queueLook() { if (!rafId) rafId = requestAnimationFrame(look); }
  document.addEventListener("pointermove", function (e) {
    pointer = { x: e.clientX, y: e.clientY }; lastMove = performance.now(); queueLook();
    if (e.clientY < hero.getBoundingClientRect().bottom) stage.style.setProperty("--px", ((e.clientX / window.innerWidth - .5) * 2).toFixed(3));
  }, { passive: true });
  setInterval(function () {
    if (performance.now() - lastMove < 2600) return;
    allPpl.forEach(function (p) { if (Math.random() < .55) { p._wx = (Math.random() - .5) * 6; p._wy = (Math.random() - .45) * 5; } }); queueLook();
  }, 1700);

  /* ================= speech ================= */
  function say(el, text, ms, voice) { el.textContent = text; el.classList.add("on"); clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove("on"); }, ms || 2600); if (voice) Snd.blip(voice); }
  function talk(p, ms) { p.classList.add("talk"); clearTimeout(p._tt); p._tt = setTimeout(function () { p.classList.remove("talk"); }, ms || 1500); }
  function bump(key, n) { tally[key] += n; var b = $('[data-t="' + key + '"]'); if (!b) return; b.textContent = tally[key]; var s = b.parentNode; s.classList.remove("bump"); void s.offsetWidth; s.classList.add("bump"); }

  /* ================= dashboard: five views that follow the sidebar ================= */
  var dashEls = { present: $('[data-d="present"]'), leave: $('[data-d="leave"]'), ot: $('[data-d="ot"]'), pay: $('[data-d="pay"]') };
  var bars = $$("[data-bars] i"), ring0 = $("[data-ring]"), ringN = $("[data-ring-n]"), feed = $("[data-feed]");
  var panes = $$("[data-pane]"), pnBtns = $$("[data-pn]"), pn = 0, pnNames = ["dashboard", "attendance", "leave", "payroll", "shifts"], urlEl = $("[data-url]"), pnTimer = null, pnHover = false;
  function tween(el, to, dur, dec) {
    var from = parseFloat(String(el.textContent).replace(/,/g, "")) || 0, t0 = performance.now(); dur = dur || 900;
    var show = function (v) { el.textContent = dec ? v.toFixed(dec) : fmt(v); };
    if (reduce) { show(to); return; }
    (function f(t) { var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); show(from + (to - from) * e); if (p < 1) requestAnimationFrame(f); })(t0);
  }
  var av = function (n) { return n.slice(0, 2).toUpperCase(); }, avc = ["#FF8A70", "#E0A42E", "#9B8CFF", "#45C4B0", "#5E8FE0", "#E86F9C", "#6BB84A"];
  function fillPane(k) {
    var i = cur, s = i * 7 + 3;
    if (k === 0) {
      tween(dashEls.present, 380 + (i * 37) % 90); tween(dashEls.leave, 6 + (i * 5) % 11); tween(dashEls.ot, 48 + (i * 23) % 70); tween(dashEls.pay, 70 + (i * 7) % 28);
      bars.forEach(function (b, j) { var h = 52 + ((i * 13 + j * 29) % 42); if (j > 4) h *= .5; b.style.setProperty("--h", Math.round(h) + "%"); });
      var a1 = 38 + (i * 7) % 24, a2 = a1 + 24 + (i * 3) % 12; ring0.style.setProperty("--a1", a1 + "%"); ring0.style.setProperty("--a2", a2 + "%"); var tot = 120 + (i * 13) % 60; tween(ringN, tot); var pa = Math.round(tot * a1 / 100), un = Math.round(tot * (a2 - a1) / 100); $("[data-dk=\"a\"]").textContent = pa; $("[data-dk=\"b\"]").textContent = un; $("[data-dk=\"c\"]").textContent = tot - pa - un;
    } else if (k === 1) {
      tween($('[data-a="ontime"]'), 84 + (i * 3) % 10); tween($('[data-a="late"]'), 12 + (i * 5) % 20); tween($('[data-a="abs"]'), 8 + (i * 7) % 12); tween($('[data-a="hrs"]'), 7.4 + (i % 5) * .2, 800, 1);
      $$("[data-abars] i").forEach(function (b, j) { var base = [22, 58, 92, 64, 34, 16, 8][j]; b.style.setProperty("--h", Math.round(Math.max(6, base + (rnd(s + j) - .5) * 18)) + "%"); });
      $("[data-late]").innerHTML = [0, 1, 2, 3, 4].map(function (j) { var n = names[(j + i) % 7], m = 5 + Math.round(rnd(s + j * 3) * 38); return '<li><i style="--c:' + avc[(j + i) % 7] + '">' + av(n) + "</i><span><b>" + n + "</b>09:" + String(m < 10 ? "0" + m : m) + ", " + m + " min late</span><em class=\"" + (m <= 15 ? "wait" : "bad") + '">' + (m <= 15 ? "Grace" : "Late") + "</em></li>"; }).join("");
    } else if (k === 2) {
      tween($('[data-l="pend"]'), 5 + (i * 3) % 9); tween($('[data-l="appr"]'), 12 + (i * 5) % 14); tween($('[data-l="away"]'), 9 + (i * 4) % 11); tween($('[data-l="used"]'), 38 + (i * 6) % 30);
      var hd = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], hv = [], hh = hd.map(function (x) { return '<b class="hh">' + x + "</b>"; }).join("");
      $("[data-heat]").innerHTML = hh + Array.apply(null, Array(14)).map(function (_, j) { var v = Math.round(10 + rnd(s + j * 2) * 60), we = j % 7 === 5 || j % 7 === 6; hv.push(we ? 0 : Math.round(v / 8)); return '<i style="--v:' + (we ? 6 : v) + '">' + (we ? "" : Math.round(v / 8)) + "</i>"; }).join("");
      var mx = Math.max.apply(null, hv), mn = Math.min.apply(null, hv.filter(function (x, y) { return y % 7 < 5; })), mxi = hv.indexOf(mx), mni = hv.indexOf(mn);
      $("[data-heat-s]").innerHTML = '<span><i class="pk"></i>Busiest: ' + hd[mxi % 7] + ", " + mx + ' away</span><span><i class="qt"></i>Quietest: ' + hd[mni % 7] + ", " + mn + ' away</span><span>Weekends are not counted</span>';
      var st = [["ok", "Approved"], ["wait", "Pending"], ["ok", "Cover found"], ["wait", "Pending"], ["ok", "Approved"]]; $("[data-reqs]").innerHTML = [0, 1, 2, 3, 4].map(function (j) { var n = names[(j * 2 + i) % 7]; return '<li><i style="--c:' + avc[(j * 2 + i) % 7] + '">' + av(n) + "</i><span><b>" + n + "</b>" + ["Annual, 2 days", "Sick, 1 day", "Comp-off, 1 day", "Annual, 5 days", "Half day"][j] + '</span><em class="' + st[j][0] + '">' + st[j][1] + "</em></li>"; }).join("");
    } else if (k === 3) {
      var gross = 1900 + (i * 37) % 150; tween($('[data-p="gross"]'), gross); tween($('[data-p="net"]'), gross * .86); tween($('[data-p="ot"]'), 38 + (i * 7) % 30); tween($('[data-p="ded"]'), 120 + (i * 11) % 60);
      $$("[data-pbars] i").forEach(function (b, j) { b.style.setProperty("--h", Math.round([82, 64, 48, 30, 22][j] + (rnd(s + j) - .5) * 20) + "%"); });
      var items = $$("[data-pck] li"); items.forEach(function (li) { li.classList.remove("on"); }); items.forEach(function (li, j) { setTimeout(function () { li.classList.add("on"); }, reduce ? 0 : 500 + j * 650); });
    } else if (k === 4) {
      tween($('[data-s="m"]'), 14 + i % 6); tween($('[data-s="e"]'), 11 + i % 4); tween($('[data-s="n"]'), 7 + i % 3); tween($('[data-s="sw"]'), 2 + i % 4);
      var dd = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], sq = ["M", "E", "N", "O"], h = '<div class="r"><span></span>' + dd.map(function (x) { return '<span class="hd">' + x + "</span>"; }).join("") + "</div>";
      ["Karan", "Ravi", "Sara", "Nadia"].forEach(function (n, r) { h += '<div class="r"><span class="nm">' + n + "</span>" + dd.map(function (_, d) { var v = sq[Math.floor(rnd(s + r * 7 + d) * 4)]; return '<span class="c ' + v + '">' + v + "</span>"; }).join("") + "</div>"; });
      $("[data-mini]").innerHTML = h;
    }
  }
  function setPane(k, fromUser) {
    pn = k; panes.forEach(function (p, j) { p.hidden = j !== k; }); pnBtns.forEach(function (b, j) { b.classList.toggle("on", j === k); }); urlEl.textContent = pnNames[k]; fillPane(k);
    if (fromUser) { Snd.tick(); clearInterval(pnTimer); pnTimer = null; }
  }
  pnBtns.forEach(function (b) { b.addEventListener("click", function () { setPane(+b.getAttribute("data-pn"), true); }); });
  var prodEl = $("[data-prod]"), prodVis = false; vis(prodEl, function (v) { prodVis = v; }, .3);
  if (!reduce) pnTimer = setInterval(function () { if (prodVis && !document.hidden && !pnHover) setPane((pn + 1) % 5, false); }, 4800);
  $(".win", prodEl).addEventListener("mouseenter", function () { pnHover = true; }); $(".win", prodEl).addEventListener("mouseleave", function () { pnHover = false; });
  $("[data-dash-date]").textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  var typeIcon = { in: "clock", leave: "calendar", swap: "repeat", other: "check" };
  var typeCol = { in: "var(--world)", leave: "#F59F00", swap: "#7A4DF0", other: "#2BB673" };
  function pushFeed(name, text, type) {
    var li = document.createElement("li"); li.innerHTML = '<i style="--c:' + typeCol[type] + '">' + icons[typeIcon[type] || "check"] + "</i><div><b>" + name + "<em>just now</em></b><p>" + text + "</p></div>";
    feed.insertBefore(li, feed.firstChild); while (feed.children.length > 5) feed.removeChild(feed.lastChild);
  }

  /* ================= events in the office ================= */
  function act() {
    if (!heroVisible || document.hidden) return;
    var evs = inds[cur].events, n = evs.length, idx; do { idx = Math.floor(Math.random() * n); } while (idx === last && n > 1); last = idx;
    var ev = evs[idx], slot = slots[ev[0]]; if (!slot) return; var p = $(".ppl", slot);
    slots.forEach(function (s) { $("[data-say]", s).classList.remove("on"); });
    say($("[data-say]", slot), ev[1], 2800, pitch[ev[0]]);
    p.classList.remove("hop"); void p.offsetWidth; p.classList.add("hop"); talk(p, 1700);
    if (ev[2] === "in") { bump("in", 1); setTimeout(Snd.ding, 350); }
    else if (ev[2] === "leave") { bump("leave", 1); burstAt(p, 10); setTimeout(Snd.chime, 350); }
    else if (ev[2] === "swap") { bump("swap", 1); burstAt(p, 8); setTimeout(Snd.pop, 350); }
    else setTimeout(Snd.tick, 350);
    pushFeed(names[ev[0]], ev[1], ev[2]);
  }
  if (!reduce) { setInterval(act, 3200); setTimeout(act, 1100); }
  slots.forEach(function (s, i) { $(".ppl", s).addEventListener("click", function () { var pp = $(".ppl", s), prev = pp.getAttribute("data-pose"); pp.setAttribute("data-pose", "wave"); setTimeout(function () { pp.setAttribute("data-pose", prev); }, 2600); burstAt(pp, 8); var d = inds[cur]; say($("[data-say]", s), d.roles[i] + ": " + d.events[(i + cur) % d.events.length][1], 3200, pitch[i]); talk($(".ppl", s), 1700); Snd.pop(); }); });

  /* ================= needs orbit, pains and recommended modules ================= */
  function renderNeeds() {
    var d = inds[cur];
    needsEl.innerHTML = d.needs.map(function (n, i) { return '<li class="need" style="--a:' + (i * 60 - 60) + 'deg;--r:240px;--i:' + i + '"><span><button class="need__in" type="button" data-n="' + i + '"><i>' + icons[n[0]] + "</i>" + n[1] + "</button></span></li>"; }).join("");
    painsEl.innerHTML = d.pains.map(function (t, i) { return '<li style="--i:' + i + '">' + t + "</li>"; }).join("");
    recEl.innerHTML = d.rec.map(function (r, i) { return '<a href="' + r[1] + '" style="--i:' + i + '"><i>' + icons[r[2]] + "</i><span><b>" + r[0] + "</b><small>" + (r[3] || "") + "</small></span></a>"; }).join("");
    needsEl.style.animation = "none"; void needsEl.offsetWidth; needsEl.style.animation = "";
  }
  function speakNeed(i) { var n = inds[cur].needs[i]; if (!n) return; say(coreSay, n[2], 4200, pitch[2]); talk(core, 1800); }
  needsEl.addEventListener("mouseover", function (e) { var b = e.target.closest(".need__in"); if (b && b !== needsEl._h) { needsEl._h = b; Snd.tick(); speakNeed(+b.getAttribute("data-n")); } });
  needsEl.addEventListener("mouseout", function (e) { if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest(".need__in")) needsEl._h = null; });
  needsEl.addEventListener("focusin", function (e) { var b = e.target.closest(".need__in"); if (b) speakNeed(+b.getAttribute("data-n")); });
  needsEl.addEventListener("click", function (e) { var b = e.target.closest(".need__in"); if (b) speakNeed(+b.getAttribute("data-n")); });

  /* ================= switching industry: colour, clothes, hats, poses and props all change ================= */
  function setText(el, text) { el.classList.add("swap"); setTimeout(function () { el.textContent = text; el.classList.remove("swap"); }, 230); }
  function dress(p, d) {
    var i = +p.getAttribute("data-i"), a = d.acts[i] || ["rest", "none", "none"];
    p.setAttribute("data-hat", d.hats[i] || "none"); p.setAttribute("data-outfit", a[2]);
    if (p.classList.contains("ppl--bust") || p.classList.contains("ppl--wave") || p.classList.contains("ppl--walk") || p.classList.contains("ppl--movie")) return;
    p.setAttribute("data-pose", a[0]); p.setAttribute("data-item", a[1]);
  }
  function setIndustry(i, fromUser) {
    cur = i; var d = inds[i];
    body.setAttribute("data-w", d.key); var meta = $('meta[name="theme-color"]'); if (meta) meta.setAttribute("content", d.color);
    chipBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-k") === d.key ? "true" : "false"); });
    leads.forEach(function (l) { if (l) setText(l, d.lead); });
    allPpl.forEach(function (p) { dress(p, d); });
    slots.forEach(function (s, k) { $('[data-tagx="' + k + '"] [data-role]').textContent = d.roles[k]; $("[data-prop]", s).innerHTML = icons[d.props[k]] || ""; var p = $(".ppl", s); p.classList.remove("hop"); void p.offsetWidth; p.classList.add("hop"); });
    renderNeeds(); $("[data-dash-ind]").textContent = d.name; fillPane(pn); say(coreSay, "Touch a need and I'll tell you more.", 3200);
    if (fromUser) { Snd.whoosh(); guideSay("Welcome to the " + d.name.toLowerCase() + " floor.", 3200); }
    last = -1; setTimeout(act, 700);
  }
  chipBtns.forEach(function (b) { b.addEventListener("click", function () { userPicked = true; var k = b.getAttribute("data-k"); for (var i = 0; i < inds.length; i++) if (inds[i].key === k) setIndustry(i, true); burstAt(b, 8); }); });
  if (!reduce) setInterval(function () { if (!userPicked && heroVisible && !document.hidden) setIndustry((cur + 1) % inds.length, false); }, 9500);
  vis(hero, function (v) { heroVisible = v; }, .15);

  /* ================= stats count up ================= */

  // wall calendar date and rotating languages
  (function () {
    var d = new Date(), M = $("[data-wc-m]"), D = $("[data-wc-d]"), W = $("[data-wc-w]");
    if (M) { M.textContent = d.toLocaleDateString("en", { month: "short" }).toUpperCase(); D.textContent = d.getDate(); W.textContent = d.toLocaleDateString("en", { weekday: "long" }); }
    var L = $("[data-lang]"); if (!L) return; var langs = [["EN", "ltr", 46], ["\u0639\u0631\u0628\u064a", "rtl", 60], ["\u0939\u093f\u0928\u094d\u0926\u0940", "ltr", 54], ["Espa\u00f1ol", "ltr", 44], ["Fran\u00e7ais", "ltr", 44], ["Deutsch", "ltr", 44], ["T\u00fcrk\u00e7e", "ltr", 44], ["Bahasa", "ltr", 44]], li = 0;
    setInterval(function () { li = (li + 1) % langs.length; L.classList.add("out"); setTimeout(function () { L.textContent = langs[li][0]; L.setAttribute("dir", langs[li][1]); L.style.fontSize = langs[li][2] + "px"; L.classList.remove("out"); }, 280); }, 1900);
  })();
  $$("[data-count]").forEach(function (el) {
    var to = +el.getAttribute("data-count"), suf = el.getAttribute("data-suf") || "", done = false;
    vis(el, function (v) { if (!v || done) return; done = true; if (reduce) { el.textContent = to + suf; return; } var t0 = performance.now(); (function f(t) { var p = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(f); })(t0); }, .5);
  });

  /* ================= phone movie: a full app, eight screens ================= */
  var movie = $("[data-movie]"), mSteps = $$("[data-go]", movie), mScr = $$(".mscr", movie), mScreen = $(".mscreen", movie), tap = $("[data-tap]", movie), mSay = $("[data-say-movie]", movie), mWho = $(".ppl--movie", movie), mBar = $("[data-mbar]", movie), mTabs = $$("[data-mtab] span", movie);
  var mi = 0, mT = [], mVis = false, mAuto = null, MDUR = 4300, N = 8, tabOf = [-1, -1, 0, 1, 2, 3, 0, 4];
  var mLines = ["Employee code first.", "Now the one-time code.", "Here's my whole day.", "Fingerprint and GPS, one press.", "Two days off. Easy.", "And there's my payslip.", "My week, with a swap ready.", "Everything lands in my inbox."];
  (function () {
    var cal = $("[data-mcal2]", movie), h = ["S", "M", "T", "W", "T", "F", "S"], s = h.map(function (x) { return '<span class="h">' + x + "</span>"; }).join("");
    var nowd = new Date(), fy = nowd.getFullYear(), fm = nowd.getMonth(), fd = new Date(fy, fm, 1).getDay(), dm = new Date(fy, fm + 1, 0).getDate(), pd = new Date(fy, fm, 0).getDate(), q;
    for (q = fd - 1; q >= 0; q--) s += '<span class="adj">' + (pd - q) + "</span>";
    for (var d = 1; d <= dm; d++) { var wd = (fd + d - 1) % 7; s += '<span class="' + (wd === 0 || wd === 6 ? "we" : "") + '" data-d="' + d + '">' + d + "</span>"; }
    for (q = fd + dm; q % 7 !== 0; q++) s += '<span class="adj">' + (q - fd - dm + 1) + "</span>";
    cal.innerHTML = s;
    var wk = [["Mon", "M", "09:00 to 17:00"], ["Tue", "M", "09:00 to 17:00"], ["Wed", "E", "13:00 to 21:00"], ["Thu", "E", "13:00 to 21:00"], ["Fri", "M", "09:00 to 17:00"], ["Sat", "O", "Day off"], ["Sun", "O", "Day off"]];
    $("[data-mwk]", movie).innerHTML = wk.map(function (r) { return '<div class="' + r[1] + (r[0] === "Thu" ? " today" : "") + '"><b>' + r[0] + "</b><span>" + r[2] + "</span><em>" + r[1] + "</em></div>"; }).join("");
  })();
  function mLater(fn, ms) { mT.push(setTimeout(fn, reduce ? 0 : ms)); }
  function reachTo(el) {
    var w = mWho.parentNode, r = w.getBoundingClientRect(), k = r.height / 190, kx = r.width / 104, a = el.getBoundingClientRect(), bw = parseFloat(getComputedStyle(mWho).getPropertyValue("--bw")) || 84;
    var cur = parseFloat(w.style.getPropertyValue("--sx")) || 0, sx = r.left - cur + ((104 - bw) / 2 - 1.5) * kx, sy = r.top + 84 * k, tx = a.left + a.width / 2, ty = a.top + a.height / 2, reach = 84 * k;
    var dx = tx - sx, dy = Math.max(-reach * .8, Math.min(reach * .8, ty - sy)), hx = Math.sqrt(Math.max(0, reach * reach - dy * dy)), s = Math.min(140 * kx, Math.max(0, -dx - hx + 6)), dn = dx + s, ang = Math.max(25, Math.min(165, Math.atan2(-dn, dy) * 180 / Math.PI));
    w.style.setProperty("--sx", -s + "px"); mWho.style.setProperty("--lu", -ang); mWho.style.setProperty("--lf", 0);
  }
  function reachOff() { var w = mWho.parentNode; w.style.removeProperty("--sx"); mWho.style.removeProperty("--lu"); mWho.style.removeProperty("--lf"); mWho.setAttribute("data-pose", "rest"); }
  function tapOn(el) { mWho.setAttribute("data-pose", "reach"); reachTo(el); mLater(reachOff, 1300); var a = el.getBoundingClientRect(), b = mScreen.getBoundingClientRect(); tap.style.left = a.left - b.left + a.width / 2 + "px"; tap.style.top = a.top - b.top + a.height / 2 + "px"; tap.classList.add("on"); mLater(function () { tap.classList.add("tap"); el.classList.add("press"); Snd.tick(); }, 420); mLater(function () { tap.classList.remove("tap", "on"); el.classList.remove("press"); }, 760); }
  function mGo(i) {
    mT.forEach(clearTimeout); mT = []; mi = i; var scr = mScr[i];
    mSteps.forEach(function (b, k) { b.setAttribute("aria-selected", k === i ? "true" : "false"); b.style.setProperty("--dur", MDUR / 1000 + "s"); var em = $("em", b); em.style.animation = "none"; if (k === i) { void em.offsetWidth; em.style.animation = ""; } });
    mScr.forEach(function (s, k) { s.classList.toggle("on", k === i); });
    mScreen.classList.toggle("notab", i < 2); mTabs.forEach(function (t, k) { t.classList.toggle("on", k === tabOf[i]); });
    mBar.style.width = ((i + 1) / N * 100) + "%"; tap.classList.remove("on", "tap");
    say(mSay, mLines[i], 3000, pitch[0]); talk(mWho, 1400); Snd.whoosh();
    if (i === 0) { var t = $("[data-mtype]", scr), s = "EMP-0142"; t.textContent = ""; for (var k = 1; k <= s.length; k++) (function (n) { mLater(function () { t.textContent = s.slice(0, n); Snd.tick(); }, 500 + n * 130); })(k); mLater(function () { tapOn($("[data-mbtn]", scr)); }, 2000); }
    if (i === 1) {
      var boxes = $$("[data-motp] span", scr), dgs = ["4", "8", "2", "6"], rs = $("[data-mresend]", scr);
      boxes.forEach(function (b) { b.textContent = ""; b.classList.remove("f"); });
      boxes.forEach(function (b, k) { mLater(function () { b.textContent = dgs[k]; b.classList.add("f"); var key = $('[data-k="' + dgs[k] + '"]', scr); key.classList.add("hit"); setTimeout(function () { key.classList.remove("hit"); }, 220); Snd.tick(); }, 500 + k * 380); });
      for (var c = 0; c < 4; c++) (function (n) { mLater(function () { rs.textContent = "0:" + String(24 - n * 5).padStart(2, "0"); }, n * 1000); })(c);
      mLater(function () { tapOn($("[data-mbtn]", scr)); }, 2500);
    }
    if (i === 2) { mLater(function () { tapOn($("[data-mbtn]", scr)); }, 1900); }
    if (i === 3) { var sc = $("[data-mscan]", scr), lb = $("[data-mclock]", scr), pi = $("[data-mpin]", scr); sc.classList.remove("scan", "ok"); lb.textContent = "Hold to clock in"; pi.textContent = "--:--"; mLater(function () { sc.classList.add("scan"); Snd.whoosh(); lb.textContent = "Scanning..."; }, 700); mLater(function () { sc.classList.remove("scan"); sc.classList.add("ok"); lb.textContent = "Clocked in at 08:52"; pi.textContent = "08:52"; Snd.ding(); burstAt(sc, 14); }, 2300); }
    if (i === 4) { $$(".sel", scr).forEach(function (c) { c.classList.remove("sel"); }); $("[data-msum]", scr).textContent = "Pick your dates"; [23, 24].forEach(function (d, k) { mLater(function () { $('[data-d="' + d + '"]', scr).classList.add("sel"); Snd.tick(); if (k === 1) $("[data-msum]", scr).textContent = "2 working days"; }, 900 + k * 500); }); mLater(function () { tapOn($("[data-mbtn]", scr)); }, 2400); }
    if (i === 5) { mLater(function () { Snd.cash(); burstAt($(".mnet", scr), 12); }, 1500); }
    if (i === 6) { mLater(function () { tapOn($(".mswap em", scr)); }, 1800); }
    if (i === 7) { mLater(function () { Snd.ding(); }, 600); }
  }
  function mNext() { mGo((mi + 1) % N); }
  function mAutoStart() { clearInterval(mAuto); if (!reduce) mAuto = setInterval(function () { if (mVis && !document.hidden) mNext(); }, MDUR); }
  mSteps.forEach(function (b) { b.addEventListener("click", function () { mGo(+b.getAttribute("data-go")); mAutoStart(); }); });
  vis(movie, function (v) { mVis = v; if (v && !mScr[0]._started) { mScr[0]._started = 1; mGo(0); mAutoStart(); } }, .3);

  /* ================= day timeline: a real 3D Aisha walks, turns sideways, and faces front at each stop ================= */
  var day = $("[data-day]"), walker = $("[data-walker]"), walkP = $(".ppl", walker), prog = $("[data-prog]"), stp = $$(".stp", day), track = $("[data-track]");
  var sx = stp.map(function (s) { return parseFloat(s.style.getPropertyValue("--l")); });
  var wk = { x: 3, k: 0, pause: 0, vis: false, t0: 0, walking: false };
  function wSet() { walker.style.setProperty("--wx", wk.x.toFixed(2) + "%"); prog.style.setProperty("--pw", Math.max(0, wk.x - 2).toFixed(2) + "%"); }
  function wReset() { wk.x = 3; wk.k = 0; wk.pause = 0; stp.forEach(function (s) { s.classList.remove("on"); }); wSet(); }
  vis(day, function (v) { wk.vis = v; }, .3);
  (function wLoop(t) {
    var dt = Math.min(.05, (t - (wk.t0 || t)) / 1000); wk.t0 = t; wk.walking = false;
    if (wk.vis && !document.hidden) {
      if (wk.pause > 0) { wk.pause -= dt; if (wk.pause <= 0 && wk.k >= stp.length) wReset(); }
      else {
        var goal = sx[wk.k]; if (goal === undefined) wk.pause = 1;
        else if (wk.x < goal - .15) { wk.x += 6.5 * dt; wk.walking = true; wSet(); }
        else { wk.x = goal; wSet(); stp[wk.k].classList.add("on"); Snd[wk.k === stp.length - 1 ? "cash" : "ding"](); if (wk.k === stp.length - 1) burstAt(walker, 14); wk.k++; wk.pause = wk.k >= stp.length ? 3 : 1.7; }
      }
      walkP.classList.toggle("walking", wk.walking);
    } else walkP.classList.remove("walking");
    requestAnimationFrame(wLoop);
  })(0);
  if (reduce) { stp.forEach(function (s) { s.classList.add("on"); }); wk.x = 92; wSet(); }

  /* ================= live playground ================= */
  var lab = $("[data-lab]");
  // clock in: a thumb presses the fingerprint, the selfie counts down and flashes, and GPS sweeps a radar
  var arr = $("[data-arr]"), arrOut = $("[data-arr-out]"), scanner = $("[data-scan]"), scanLbl = $("[data-scan-lbl]"), scanImg = $("[data-scan-img]"), cnt = $("[data-cnt]"), flashEl = $(".flash", scanner), checks = $$("[data-checks] li", lab), status = $("[data-status]"), c0 = $("[data-c0]"), c1 = $("[data-c1]");
  var sample = $("[data-sample]"), selfieIn = $("[data-selfie-in]"), geoSw = $("[data-geo]"), punching = false, mode = "fp", hasImg = false;
  var hm = function (m) { return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };
  arr.addEventListener("input", function () { arrOut.textContent = hm(+arr.value); }); arrOut.textContent = hm(+arr.value);
  var modeMap = { fp: ["Fingerprint matched", "Press to clock in"], selfie: ["Selfie matched", ""], gps: ["Location shared", "Check my location"] };
  function setMode(m) {
    mode = m; $$("[data-mode]", lab).forEach(function (x) { x.setAttribute("aria-checked", x.getAttribute("data-mode") === m ? "true" : "false"); });
    scanner.setAttribute("data-m", m); scanner.classList.remove("ok", "bad", "at-in", "at-out", "scan"); c0.textContent = modeMap[m][0]; scanLbl.textContent = modeMap[m][1];
    sample.hidden = m !== "selfie"; $("[data-upload]", lab).hidden = true; scanner.classList.toggle("has-img", m === "selfie" && hasImg); scanImg.hidden = !(m === "selfie" && hasImg); Snd.tick();
  }
  $$("[data-mode]", lab).forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); }); });
  geoSw.addEventListener("click", function () { var on = geoSw.getAttribute("aria-checked") !== "true"; geoSw.setAttribute("aria-checked", on ? "true" : "false"); c1.textContent = on ? "GPS 12 m, inside Head Office" : "GPS 340 m away, outside the fence"; Snd.tick(); });
  function sampleFace() {
    var cv = document.createElement("canvas"); cv.width = cv.height = 200; var g = cv.getContext("2d");
    g.fillStyle = "#CDE0FF"; g.fillRect(0, 0, 200, 200); g.fillStyle = "#FF8A70"; g.beginPath(); g.ellipse(100, 200, 70, 50, 0, 0, 7); g.fill();
    g.fillStyle = "#2B1B17"; g.beginPath(); g.ellipse(100, 100, 56, 66, 0, 0, 7); g.fill(); g.fillStyle = "#E8B48C"; g.beginPath(); g.ellipse(100, 104, 42, 50, 0, 0, 7); g.fill();
    g.fillStyle = "#2B1B17"; g.beginPath(); g.ellipse(100, 70, 46, 24, 0, Math.PI, 0); g.fill();
    g.fillStyle = "#fff"; [80, 120].forEach(function (x) { g.beginPath(); g.ellipse(x, 104, 9, 10, 0, 0, 7); g.fill(); }); g.fillStyle = "#14213D"; [82, 122].forEach(function (x) { g.beginPath(); g.arc(x, 106, 4.5, 0, 7); g.fill(); });
    g.strokeStyle = "#7A3B30"; g.lineWidth = 4; g.lineCap = "round"; g.beginPath(); g.arc(100, 124, 14, .2, Math.PI - .2); g.stroke(); return cv.toDataURL("image/png");
  }
  function useImage(src) { scanImg.src = src; hasImg = true; scanner.classList.add("has-img"); scanImg.hidden = true; runScan(); }
  sample.addEventListener("click", function () { Snd.pop(); useImage(sampleFace()); });
  selfieIn.addEventListener("change", function () { var f = selfieIn.files && selfieIn.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { useImage(r.result); }; r.readAsDataURL(f); });
  function runScan() {
    if (punching) return; punching = true; var m = +arr.value, inside = geoSw.getAttribute("aria-checked") === "true", selfie = mode === "selfie", d = selfie ? 1500 : 0;
    checks.forEach(function (c) { c.className = ""; }); status.textContent = "Checking"; scanner.classList.remove("ok", "bad", "at-in", "at-out"); scanner.classList.add("scan"); scanLbl.textContent = selfie ? "Hold still" : "Scanning..."; Snd.whoosh();
    if (selfie) {
      scanImg.hidden = true; [3, 2, 1].forEach(function (n, i) { setTimeout(function () { cnt.textContent = n; cnt.classList.remove("on"); void cnt.offsetWidth; cnt.classList.add("on"); Snd.tick(); }, i * 430); });
      setTimeout(function () { cnt.classList.remove("on"); cnt.textContent = ""; flashEl.classList.remove("go"); void flashEl.offsetWidth; flashEl.classList.add("go"); scanImg.hidden = false; Snd.pop(); }, 1290);
    }
    setTimeout(function () { checks[0].classList.add("on"); Snd.tick(); }, d + 700); setTimeout(function () { checks[1].classList.add("on"); if (!inside) checks[1].classList.add("late"); Snd.tick(); }, d + 1200);
    setTimeout(function () {
      var cls, txt, lbl, td = $("[data-today]", lab), em = $("em", td);
      scanner.classList.remove("scan"); scanner.classList.add(inside ? "at-in" : "at-out");
      if (!inside) { cls = "on late"; txt = "Rejected: outside the fence"; lbl = "Rejected"; scanner.classList.add("bad"); Snd.boop(); em.textContent = "Rejected"; em.className = "late"; $("b", td).textContent = "--:--"; }
      else {
        if (m <= 540) { cls = "on"; txt = "On time, " + hm(m); lbl = "On time"; scanner.classList.add("ok"); Snd.ding(); burstAt(scanner, 16); }
        else if (m <= 555) { cls = "on grace"; txt = "Within grace, no deduction"; lbl = "Grace window"; scanner.classList.add("ok"); Snd.pop(); }
        else { cls = "on late"; txt = "Late by " + (m - 540) + " min"; lbl = "Late"; scanner.classList.add("bad"); Snd.boop(); }
        $("b", td).textContent = hm(m); em.textContent = lbl; em.className = m <= 540 ? "ok" : m <= 555 ? "gr" : "late";
      }
      status.textContent = txt; checks[2].className = cls; scanLbl.textContent = lbl; td.classList.remove("pulse-in"); void td.offsetWidth; td.classList.add("pulse-in"); punching = false;
    }, d + 1900);
  }
  scanner.addEventListener("click", function () { if (mode === "selfie" && !hasImg) { useImage(sampleFace()); return; } runScan(); });
  $("[data-upload]", lab).addEventListener("click", function () { selfieIn.click(); });
  // leave
  var lcal = $("[data-lcal]"), lsum = $("[data-lsum]"), lbar = $("[data-lbar]"), lflow = $("[data-lflow]"), ltype = "annual", bal = { annual: 14, sick: 6, comp: 2 }, maxb = { annual: 14, sick: 6, comp: 6 }, selA = null, selB = null;
  var now = new Date(), y = now.getFullYear(), mo = now.getMonth(), first = new Date(y, mo, 1).getDay(), dim = new Date(y, mo + 1, 0).getDate();
  function lRender() {
    var s = ["S", "M", "T", "W", "T", "F", "S"].map(function (x) { return '<span class="h">' + x + "</span>"; }).join(""), k;
    var pdim = new Date(y, mo, 0).getDate(); for (k = first - 1; k >= 0; k--) s += '<span class="adj">' + (pdim - k) + "</span>";
    for (var d = 1; d <= dim; d++) { var wd = (first + d - 1) % 7, we = wd === 0 || wd === 6, cl = we ? "we" : ""; if (selA && d === selA) cl += " pick"; else if (selB && d === selB) cl += " pick"; else if (selA && selB && d > selA && d < selB && !we) cl += " in"; s += we ? '<span class="' + cl + '">' + d + "</span>" : '<button type="button" class="' + cl + '" data-day="' + d + '">' + d + "</button>"; }
    for (k = first + dim; k < 42; k++) s += '<span class="adj">' + (k - first - dim + 1) + "</span>";
    lcal.innerHTML = s;
  }
  var linfo = $("[data-linfo]"), lcard = $(".lc--leave"), lmeta = { annual: ["var(--world)", "Annual leave: 14 days a year and 5 can carry forward. Needs 2 days notice."], sick: ["#E8590C", "Sick leave: 6 days a year. A medical note is needed after 2 days."], comp: ["#7A4DF0", "Comp-off: earned for holiday work and expires after 30 days."] };
  function workDays(a, b) { var n = 0; for (var d = a; d <= b; d++) { var wd = (first + d - 1) % 7; if (wd !== 0 && wd !== 6) n++; } return n; }
  function lSummary() {
    lflow.textContent = ""; lflow.className = "lflow"; linfo.textContent = lmeta[ltype][1]; lcard.style.setProperty("--tc", lmeta[ltype][0]);
    if (!selA) { lsum.textContent = "Pick a start date."; lbar.style.width = Math.max(4, bal[ltype] / maxb[ltype] * 100) + "%"; return; }
    var b = selB || selA, n = workDays(selA, b), after = bal[ltype] - n;
    lsum.textContent = n + " working day" + (n === 1 ? "" : "s") + ", weekends skipped. " + (after >= 0 ? "Balance after: " + after + "." : "Not enough balance, so HR decides.");
    lbar.style.width = Math.max(4, Math.max(0, after) / maxb[ltype] * 100) + "%";
  }
  lcal.addEventListener("click", function (e) { var b = e.target.closest("[data-day]"); if (!b) return; var d = +b.getAttribute("data-day"); Snd.tick(); if (!selA || (selA && selB)) { selA = d; selB = null; } else if (d < selA) { selB = selA; selA = d; } else selB = d; lRender(); lSummary(); });
  $$("[data-ltype]", lab).forEach(function (b) { b.addEventListener("click", function () { ltype = b.getAttribute("data-ltype"); $$("[data-ltype]", lab).forEach(function (x) { x.setAttribute("aria-checked", x === b ? "true" : "false"); }); Snd.tick(); lSummary(); }); });
  $("[data-lgo]").addEventListener("click", function (e) {
    if (!selA) { lflow.textContent = "Pick a date first."; lflow.className = "lflow tohr"; Snd.boop(); return; }
    var n = workDays(selA, selB || selA); Snd.whoosh();
    setTimeout(function () {
      if (n <= bal[ltype]) { bal[ltype] -= n; Snd.chime(); burstAt($("[data-lgo]"), 16); lflow.textContent = "Approved by Priya. " + bal[ltype] + " days left."; lflow.className = "lflow"; selA = selB = null; lRender(); lbar.style.width = Math.max(4, bal[ltype] / maxb[ltype] * 100) + "%"; lsum.textContent = "Pick a start date."; }
      else { Snd.boop(); lflow.textContent = "Sent to HR. Not enough balance to auto-approve."; lflow.className = "lflow tohr"; }
    }, 600);
  });
  lRender(); lSummary();
  // payroll
  var oth = $("[data-oth]"), ulv = $("[data-ulv]"), netEl = $("[data-net]");
  function payUpdate() {
    var h = +oth.value, u = +ulv.value, base = 5100, ot = Math.round(4800 / 160 * 1.5 * h), ded = Math.round(4800 / 30 * u), net = base + ot - ded;
    $("[data-oth-out]").textContent = h; $("[data-ulv-out]").textContent = u; $("[data-ot-h]").textContent = h; $("[data-ul-d]").textContent = u;
    $("[data-ot-v]").textContent = "+ " + fmt(ot); $("[data-ul-v]").textContent = "- " + fmt(ded); tween(netEl, net, 450);
    var gross = base + ot, pct = Math.round(net / gross * 100); $("[data-th]").style.width = pct + "%"; $("[data-th-t]").textContent = pct + "%"; $("[data-s1]").style.flex = String(base); $("[data-s2]").style.flex = String(Math.max(ot, 1)); $("[data-s3]").style.flex = String(Math.max(ded, 1)); $("[data-sent]").textContent = "";
  }
  oth.addEventListener("input", payUpdate); ulv.addEventListener("input", payUpdate); oth.addEventListener("change", Snd.tick); ulv.addEventListener("change", Snd.tick); netEl.textContent = "0"; payUpdate();
  $("[data-pay-go]").addEventListener("click", function (e) { $("[data-sent]").textContent = "412 payslips sent to every phone"; Snd.cash(); burstAt(e.currentTarget, 18); });
  // permissions
  var perms = $("[data-perms]"), permSum = $("[data-perm-sum]"), roleNames = ["An employee", "A manager", "HR", "An admin"], areas = [["clock", "Attendance"], ["calendar", "Leave"], ["wallet", "Payroll"], ["chart", "Reports"], ["shield", "Settings"]];
  var pm = [[1, 1, 0, 0, 0], [1, 1, 0, 1, 0], [1, 1, 1, 1, 0], [1, 1, 1, 1, 1]], pr = 0;
  function pRender() {
    perms.innerHTML = areas.map(function (a, i) { return "<li>" + icons[a[0]] + "<span>" + a[1] + '</span><button class="sw" type="button" role="switch" aria-checked="' + (pm[pr][i] ? "true" : "false") + '" data-pi="' + i + '" aria-label="' + a[1] + '"></button></li>'; }).join("");
    var n = pm[pr].reduce(function (s, v) { return s + v; }, 0); $("[data-pmenu-in]").innerHTML = areas.map(function (a, i) { return '<span class="pm' + (pm[pr][i] ? "" : " off") + '">' + (pm[pr][i] ? icons[a[0]] : icons.lock) + a[1] + "</span>"; }).join(""); permSum.textContent = roleNames[pr] + " can open " + n + " of 5 areas" + (pm[pr][2] ? ", including payroll." : ", and cannot see payroll.");
  }
  perms.addEventListener("click", function (e) { var b = e.target.closest("[data-pi]"); if (!b) return; var i = +b.getAttribute("data-pi"); pm[pr][i] = pm[pr][i] ? 0 : 1; Snd.tick(); pRender(); });
  $$("[data-role-p]", lab).forEach(function (b) { b.addEventListener("click", function () { pr = +b.getAttribute("data-role-p"); $$("[data-role-p]", lab).forEach(function (x) { x.setAttribute("aria-checked", x === b ? "true" : "false"); }); Snd.tick(); pRender(); }); });
  pRender();
  // who's in: little faces fill in as the morning goes on
  var hereG = $("[data-here-grid]"), hereS = $("[data-here]"), people24 = [], skins = ["#F1CBA6", "#E8B48C", "#D49A6E", "#B97D52", "#9A6238", "#8A5530"], hairs = ["#1C1410", "#2B1B17", "#120D0B", "#3A2A20", "#1C1410", "#B5651D", "#2B1B17"], tops = ["#FF8A70", "#9B8CFF", "#45C4B0", "#FFD05A", "#7FB4FF", "#FF9FC0", "#B8E986", "#F4F7FB"], hstyle = ["short", "long", "bun", "curls", "hijab", "cap", "short", "long"], fnames = ["Aisha", "Omar", "Sara", "Ravi", "Priya", "Karan", "Nadia", "Leo", "Mina", "Yusuf", "Anya", "Dev", "Hana", "Ben", "Zoya", "Raj", "Lina", "Tariq", "Maya", "Sam", "Noor", "Ivan", "Isha", "Jon"];
  function faceSvg(sk, hr, top, st, cc, tr) {
    if (st === "hijab") hr = cc;
    tr = tr || { e: 0, m: 0, g: 0, b: 0 };
    var H = { short: '<path d="M10 17c0-8 4-11 10-11s10 3 10 11c-3-4-7-5-10-5s-7 1-10 5z" fill="' + hr + '"/>', long: '<path d="M8.5 22c-1-10 3-16 11.5-16S32 12 31.5 22c0 5-1 8-3 9l-1-12c-4-1-10-1-14 0l-1 12c-2-1-4-4-4-9z" fill="' + hr + '"/>', bun: '<circle cx="20" cy="5.5" r="4" fill="' + hr + '"/><path d="M10 17c0-8 4-11 10-11s10 3 10 11c-3-4-7-5-10-5s-7 1-10 5z" fill="' + hr + '"/>', curls: '<path d="M8.5 18c-2-3 0-6 3-5 0-4 4-6 8.5-6s8.5 2 8.5 6c3-1 5 2 3 5-3-3-6-4-11.5-4S11.5 15 8.5 18z" fill="' + hr + '"/>', hijab: '<path d="M7 24c-1-11 4-18 13-18s14 7 13 18c0 5-2 8-4 9H11c-2-1-4-4-4-9z" fill="' + hr + '"/>', cap: '<path d="M10 17c0-8 4-11 10-11s10 3 10 11c-3-4-7-5-10-5s-7 1-10 5z" fill="' + hr + '"/><path d="M9.5 15c0-6.5 4-9.5 10.5-9.5S30.5 8.5 30.5 15z" fill="' + cc + '"/><path d="M28 13.5h8c0 2-3 3-8 3z" fill="' + cc + '"/>' };
    var hijab = st === "hijab", face = hijab ? 'cx="20" cy="21" rx="8" ry="9.5"' : 'cx="20" cy="20" rx="8.5" ry="10"', ink = "#14213D";
    var eye = [['<ellipse cx="16.2" cy="21" rx="1.7" ry="2" fill="#fff"/><ellipse cx="23.8" cy="21" rx="1.7" ry="2" fill="#fff"/><circle cx="16.5" cy="21.3" r="1.05" fill="' + ink + '"/><circle cx="24.1" cy="21.3" r="1.05" fill="' + ink + '"/>'], ['<ellipse cx="16.2" cy="21" rx="2.1" ry="2.4" fill="#fff"/><ellipse cx="23.8" cy="21" rx="2.1" ry="2.4" fill="#fff"/><circle cx="16.6" cy="21.4" r="1.4" fill="' + ink + '"/><circle cx="24.2" cy="21.4" r="1.4" fill="' + ink + '"/>'], ['<path d="M14.3 21.3q1.9-1.7 3.8 0M21.9 21.3q1.9-1.7 3.8 0" stroke="' + ink + '" stroke-width="1.1" fill="none" stroke-linecap="round"/>'], ['<circle cx="16.2" cy="21.2" r="1.15" fill="' + ink + '"/><circle cx="23.8" cy="21.2" r="1.15" fill="' + ink + '"/>']][tr.e % 4][0];
    var mouth = ['<path d="M17.2 26.2q2.8 2.6 5.6 0" stroke="#7A3B30" stroke-width="1.1" fill="none" stroke-linecap="round"/>', '<path d="M17 25.6h6q-.4 3.4-3 3.4t-3-3.4z" fill="#7A3B30"/>', '<path d="M17.6 26.8h4.8" stroke="#7A3B30" stroke-width="1.1" stroke-linecap="round"/>', '<path d="M17.4 26.6q2.6 1.6 5 -.6" stroke="#7A3B30" stroke-width="1.1" fill="none" stroke-linecap="round"/>'][tr.m % 4];
    var brow = tr.e % 2 ? '<path d="M14 18q2.2-1.6 4.2-.4M21.8 17.6q2-1.2 4.2.4" stroke="' + ink + '" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".6"/>' : '<path d="M14 18.2q2.2-1.3 4.2 0M21.8 18.2q2-1.3 4.2 0" stroke="' + ink + '" stroke-width=".8" fill="none" stroke-linecap="round" opacity=".5"/>';
    var gl = tr.g ? '<circle cx="16.2" cy="21" r="3.2" fill="none" stroke="' + ink + '" stroke-width=".9"/><circle cx="23.8" cy="21" r="3.2" fill="none" stroke="' + ink + '" stroke-width=".9"/><path d="M19.4 21h1.2" stroke="' + ink + '" stroke-width=".9"/>' : "";
    var bd = tr.b ? '<path d="M12.2 24c0 6 3.3 8 7.8 8s7.8-2 7.8-8c-2 2.4-4.600 3-7.800 3s-5.800-.6-7.800-3z" fill="' + hr + '"/>' : "";
    return '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M2 40c1-8 7-11 18-11s17 3 18 11z" fill="' + top + '"/><rect x="16.5" y="26" width="7" height="6" rx="3" fill="' + sk + '"/>' + (st === "long" || hijab ? H[st] : "") + '<ellipse ' + face + ' fill="' + sk + '"/>' + (hijab ? "" : '<circle cx="11.5" cy="21" r="1.8" fill="' + sk + '"/><circle cx="28.5" cy="21" r="1.8" fill="' + sk + '"/>') + (st === "long" || hijab ? "" : H[st]) + (st === "long" ? '<path d="M11 15c4-4 14-4 18 0-4-2-14-2-18 0z" fill="' + hr + '"/>' : "") + (hijab ? '<path d="M12.5 17c4-5 11-5 15 0-4-2-11-2-15 0z" fill="' + hr + '"/>' : "") + eye + brow + gl + '<circle cx="13.6" cy="25" r="1.7" fill="#FF7A8A" opacity=".32"/><circle cx="26.4" cy="25" r="1.7" fill="#FF7A8A" opacity=".32"/>' + bd + mouth + '</svg>';
  }
  var darkH = ["#1C1410", "#2B1B17", "#120D0B", "#3A2A20"], capCols = ["#2F6FED", "#E4577A", "#14213D", "#0F9D8A", "#F59E0B", "#5B45D6"], hijabCols = ["#F7F3FF", "#FFE3F0", "#DFF3FF", "#E9F7DF"], order = ["short", "long", "bun", "curls", "hijab", "cap"], seen = {};
  for (var q = 0; q < 24; q++) {
    var rr = Math.floor(q / 8), cc = q % 8, sI = (cc + rr * 2) % 6, vI = seen[sI] = (seen[sI] === undefined ? 0 : seen[sI] + 1), skI = (cc * 5 + rr * 2 + vI) % 6, light = skI <= 1;
    people24.push({ a: 470 + Math.round(((q * 37) % 100) * 1.05) + (q % 5 === 0 ? 40 : 0), sk: skins[skI], hr: (light && vI % 2 === 1 && sI % 2 === 0) ? "#B5651D" : darkH[(sI + vI * 2 + cc) % 4], top: tops[(cc * 3 + rr * 5) % 8], st: order[sI], cc: order[sI] === "hijab" ? hijabCols[vI % 4] : capCols[(sI + vI * 2 + cc) % 6], tr: { e: (q * 3 + vI) % 4, m: (q + rr * 2) % 4, g: (q % 7 === 3 || q % 7 === 5) ? 1 : 0, b: (sI === 0 || sI === 5) && q % 3 === 1 ? 1 : 0 }, n: fnames[q] });
  }
  hereG.innerHTML = people24.map(function (p, q) { return '<span class="hf" title="' + p.n + '">' + faceSvg(p.sk, p.hr, p.top, p.st, p.cc, p.tr) + "</span>"; }).join("");
  var arr3 = $("[data-arr3]");
  function hRender() {
    var m = +hereS.value, inN = 0, late = 0; $("[data-here-t]").textContent = hm(m);
    $$(".hf", hereG).forEach(function (el, k) { var p = people24[k], arrived = m >= p.a, isLate = p.a > 540; el.className = "hf" + (arrived ? (isLate ? " late" : " ok") : ""); if (arrived) { inN++; if (isLate) late++; } });
    $("[data-here-n]").textContent = inN + " of 24 in" + (late ? ", " + late + " late" : "");
    if (arr3) { var got = people24.map(function (p, k) { return { p: p, k: k }; }).filter(function (o) { return m >= o.p.a; }).sort(function (a, b) { return b.p.a - a.p.a; }); var extra = Math.max(0, got.length - 4); got = got.slice(0, 4); arr3.innerHTML = got.length ? got.map(function (o) { return '<li><span class="hf mini ' + (o.p.a > 540 ? "late" : "ok") + '">' + faceSvg(o.p.sk, o.p.hr, o.p.top, o.p.st, o.p.cc, o.p.tr) + "</span><b>" + o.p.n + "</b><em>" + hm(o.p.a) + "</em><i class=\"" + (o.p.a > 540 ? "late" : "ok") + "\">" + (o.p.a > 540 ? "Late" : "On time") + "</i></li>"; }).join("") : "<li class=\"none\">Nobody has arrived yet. Drag the slider.</li>"; if (extra) arr3.innerHTML += '<li class="more">+' + extra + " more arrived</li>"; }
    $("[data-hb-ok]").style.flexBasis = (inN - late) / 24 * 100 + "%"; $("[data-hb-late]").style.flexBasis = late / 24 * 100 + "%";
    $("[data-hk-ok]").textContent = inN - late; $("[data-hk-late]").textContent = late; $("[data-hk-off]").textContent = 24 - inN;
  }
  hereS.addEventListener("input", hRender); hRender();
  // roster: icons for each shift and a coverage bar per day
  var roster = $("[data-roster]"), cover = $("[data-cover]"), days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], rp = [["Karan", "#FF9FC0"], ["Ravi", "#45C4B0"], ["Sara", "#9B8CFF"], ["Nadia", "#B8E986"], ["Omar", "#FFD05A"]], seq = ["M", "E", "N", "O"], lastBad = false;
  var ICO = { M: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>', E: '<svg viewBox="0 0 24 24"><path d="M17 18a5 5 0 0 0-10 0"/><path d="M12 9V2M4.2 10.2l1.4 1.4M2 18h2M20 18h2M18.4 11.6l1.4-1.4M22 22H2M8 5l4-3 4 3"/></svg>', N: '<svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>', O: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>' };
  var mon = new Date(); mon.setDate(mon.getDate() - ((mon.getDay() + 6) % 7));
  var rs = [["M", "M", "E", "E", "O", "M", "O"], ["E", "E", "M", "M", "M", "O", "M"], ["M", "O", "M", "M", "E", "E", "O"], ["O", "M", "O", "E", "M", "M", "E"], ["N", "N", "M", "O", "E", "O", "M"]];
  function rRender() {
    var h = '<div class="r"><span></span>' + days.map(function (d, i) { var dt = new Date(mon); dt.setDate(mon.getDate() + i); return '<span class="hd">' + d + "<b>" + dt.getDate() + "</b></span>"; }).join("") + "</div>", bad = [];
    rp.forEach(function (p, r) { h += '<div class="r"><span class="nm"><i style="--c:' + p[1] + '">' + p[0].slice(0, 2).toUpperCase() + "</i>" + p[0] + "</span>" + rs[r].map(function (s, d) { return '<button type="button" class="' + s + '" data-r="' + r + '" data-d="' + d + '" aria-label="' + p[0] + " " + days[d] + ", shift " + s + '">' + ICO[s] + "<span>" + s + "</span></button>"; }).join("") + "</div>"; });
    h += '<div class="r"><span class="nm">Morning crew</span>' + days.map(function (d, di) { var n = rs.reduce(function (s, row) { return s + (row[di] === "M" ? 1 : 0); }, 0), b = n < 2; if (b) bad.push(d + " has " + n); return '<span class="cv' + (b ? " bad" : "") + '"><i style="--w:' + Math.min(100, n / 2 * 100) + '%"></i><b>' + n + (b ? " of 2" : "") + "</b></span>"; }).join("") + "</div>";
    roster.innerHTML = h; cover.className = "cover" + (bad.length ? " bad" : ""); cover.textContent = bad.length ? "Understaffed: " + bad.join(", ") + " on the morning shift (needs 2)." : "Coverage is fine for the whole week.";
    if (bad.length && !lastBad) Snd.boop(); lastBad = !!bad.length;
  }
  roster.addEventListener("click", function (e) { var b = e.target.closest("[data-r]"); if (!b) return; var r = +b.getAttribute("data-r"), d = +b.getAttribute("data-d"); rs[r][d] = seq[(seq.indexOf(rs[r][d]) + 1) % 4]; Snd.pop(); rRender(); });
  rRender();

  /* ================= peek cards ================= */
  $$(".pk").forEach(function (c) { c.addEventListener("click", function () { c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") === "true" ? "false" : "true"); Snd.pop(); }); c.addEventListener("mouseenter", Snd.tick); });

  /* ================= role views ================= */
  (function () { var fm = $("[data-fin-month]"), d = new Date(); d.setMonth(d.getMonth() - 1); if (fm) fm.textContent = d.toLocaleDateString("en", { month: "long" }); })();
  var rolesEl = $("[data-roles]"), rTabs = $$("[data-r]", rolesEl), rScr = $$("[data-rs]", rolesEl);
  rTabs.forEach(function (t) { t.addEventListener("click", function () { var i = +t.getAttribute("data-r"); rTabs.forEach(function (x) { x.setAttribute("aria-selected", x === t ? "true" : "false"); }); rScr.forEach(function (s, k) { s.hidden = k !== i; }); Snd.whoosh(); }); });
  var rc = $("[data-rclock]"); rc.addEventListener("click", function () { var on = rc.classList.toggle("on"); $("[data-rclock-t]").textContent = on ? "Clocked in 08:52" : "Clock in"; $("[data-rclock-s]").textContent = on ? "On time. Have a good day." : "Tap to punch, 09:00 shift"; if (on) { Snd.ding(); burstAt(rc, 14); } else Snd.tick(); });
  var apprN = $("[data-appr-n]"); $("[data-appr]").addEventListener("click", function (e) { var b = e.target.closest("[data-ap]"); if (!b) return; var li = b.closest("li"); if (li.classList.contains("done")) return; li.classList.add("done"); var no = b.getAttribute("data-ap") === "no"; if (no) li.classList.add("rej"); $$("button", li).forEach(function (x) { x.hidden = x !== b; }); b.textContent = no ? "Rejected" : "Approved"; apprN.textContent = Math.max(0, +apprN.textContent - 1); if (!no) { Snd.chime(); burstAt(li, 8); } else Snd.tick(); });
  var dirData = [["Aisha Khan", "Finance", "Present"], ["Omar Mansour", "Operations", "On leave"], ["Sara Nasser", "Design", "Present"], ["Ravi Verma", "Engineering", "Present"], ["Priya Shah", "HR", "Present"], ["Karan Mehta", "Sales", "On leave"], ["Nadia Farouk", "Finance", "Present"], ["John Lewis", "Reception", "Present"]], dcols = ["#FF8A70", "#E0A42E", "#9B8CFF", "#45C4B0", "#5E8FE0", "#E86F9C", "#6BB84A", "#8A7BD8"];
  var dir = $("[data-dir]"), find = $("[data-find]");
  function dRender() { var qq = find.value.trim().toLowerCase(), rows = dirData.map(function (r, i) { return [r, i]; }).filter(function (x) { return !qq || (x[0][0] + " " + x[0][1]).toLowerCase().indexOf(qq) > -1; }); dir.innerHTML = rows.length ? rows.slice(0, 5).map(function (x) { var r = x[0]; return '<li><i style="--c:' + dcols[x[1]] + '">' + r[0].split(" ").map(function (w) { return w[0]; }).join("") + "</i><span><b>" + r[0] + "</b>" + r[1] + "</span><em" + (r[2] === "On leave" ? ' class="lv"' : "") + ">" + r[2] + "</em></li>"; }).join("") : '<li class="none">No one matches that. Try another name or team.</li>'; }
  find.addEventListener("input", dRender); dRender();
  var frun = $("[data-frun]");
  $$("[data-fsteps] button").forEach(function (b) { b.addEventListener("click", function () { var on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on ? "true" : "false"); Snd.tick(); var cnt = $$("[data-fsteps] [aria-pressed=true]").length; frun.disabled = cnt < 4; frun.classList.remove("sent"); frun.textContent = cnt < 4 ? "Run payroll (" + cnt + " of 4 ready)" : "Run payroll"; if (cnt === 4) Snd.chime(); }); });
  frun.addEventListener("click", function () { if (frun.disabled) return; Snd.cash(); burstAt(frun, 18); frun.textContent = "412 payslips sent"; frun.classList.add("sent"); });

  /* ================= Ask Subi chat ================= */
  var faq = data.faq, qs = $("[data-qs]"), log = $("[data-log]"), askForm = $("[data-ask-form]"), askIn = $("#ask-in");
  qs.innerHTML = faq.slice(0, 7).map(function (f, i) { return '<button type="button" data-q="' + i + '">' + f[0] + "</button>"; }).join("");
  function msg(cls, html) { var m = document.createElement("div"); m.className = "msg " + cls; m.innerHTML = html; log.appendChild(m); log.scrollTop = log.scrollHeight; return m; }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function reply(q, a) { msg("me", esc(q)); Snd.pop(); var t = msg("bot typing", "<i></i><i></i><i></i>"); setTimeout(function () { t.remove(); msg("bot", a); Snd.blip(300); }, reduce ? 0 : 900 + Math.min(900, a.length * 3)); }
  qs.addEventListener("click", function (e) { var b = e.target.closest("[data-q]"); if (!b) return; $$("button", qs).forEach(function (x) { x.classList.toggle("on", x === b); }); var f = faq[+b.getAttribute("data-q")]; reply(f[0], esc(f[1])); });
  askForm.addEventListener("submit", function (e) {
    e.preventDefault(); var qq = askIn.value.trim(); if (!qq) return; askIn.value = "";
    var words = qq.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(function (w) { return w.length > 3; }), best = null, bs = 0;
    faq.forEach(function (f) { var hay = (f[0] + " " + f[1]).toLowerCase(), s = 0; words.forEach(function (w) { if (hay.indexOf(w) > -1) s++; }); if (s > bs) { bs = s; best = f; } });
    reply(qq, best ? esc(best[1]) : 'I don\'t have a ready answer for that yet. A teammate replies within one business day: <a class="link" href="/contact/">send us your question</a>.');
  });

  document.addEventListener("click", function (e) { var h = e.target.closest && e.target.closest("[data-hq]"); if (h) { var q = $$("[data-qs] button")[+h.getAttribute("data-hq")]; if (q) q.click(); } });

  // clock options for review: /home-v2/?clock=1..6
  (function () {
    var m = location.search.match(/clk=(\d+)/); if (!m) return; document.body.setAttribute("data-clk", +m[1]); return;
    var wcl = $(".wallclock"); if (!wcl || ![3, 5, 6].some(function (x) { return x === n; })) return;
    var h = {
      3: '<div class="dc dc--pill"><i></i><b data-dt>09:41</b><small data-dd>Tue 24 Nov</small></div>',
      5: '<div class="dc dc--flip"><div class="fl"><span data-fh>09</span></div><em>:</em><div class="fl"><span data-fm>41</span></div></div>',
      6: '<div class="dc dc--ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="rg" cx="60" cy="60" r="50"/><circle class="rp" cx="60" cy="60" r="50" pathLength="100" data-rp/></svg><b data-dt>09:41</b><small>Shift 09:00 to 18:00</small></div>'
    };
    wcl.insertAdjacentHTML("beforeend", h[n]);
    function tk() {
      var d = new Date(), hh2 = String(d.getHours()).padStart(2, "0"), mm = String(d.getMinutes()).padStart(2, "0"), e;
      if ((e = $("[data-dt]", wcl))) e.textContent = hh2 + ":" + mm;
      if ((e = $("[data-dd]", wcl))) e.textContent = d.toLocaleDateString("en", { weekday: "short", day: "numeric", month: "short" });
      if ((e = $("[data-fh]", wcl))) e.textContent = hh2; if ((e = $("[data-fm]", wcl))) e.textContent = mm;
      if ((e = $("[data-rp]", wcl))) { var mins = d.getHours() * 60 + d.getMinutes(), pc = Math.max(0, Math.min(100, (mins - 540) / 540 * 100)); e.style.strokeDasharray = pc + " 100"; }
    }
    tk(); setInterval(tk, 1000);
  })();
  /* ================= Subi, the page guide: stays with you, speaks about each section, and shows you how things work ================= */
  var guide = $("[data-guide]"), gSay = $("[data-guide-say]"), gMenu = $("[data-guide-menu]"), gBot = $("[data-guide-bot]"), gBusy = false, gFly = false;
  function gPlace(x, y) { guide.style.setProperty("--gx", Math.round(x) + "px"); guide.style.setProperty("--gy", Math.round(y) + "px"); }
  function gHome() { gFly = false; gPlace(window.innerWidth - 24 - 70, window.innerHeight - 92 - 124); }
  guide.style.transition = "none"; gHome(); void guide.offsetWidth; guide.style.transition = "";
  window.addEventListener("resize", function () { if (!gFly) gHome(); });
  function guideSay(t, ms) { say(gSay, t, ms || 3600, 540); }
  function menu(open) { gMenu.hidden = !open; gBot.setAttribute("aria-expanded", open ? "true" : "false"); if (open) { gSay.classList.remove("on"); Snd.pop(); } }
  gBot.addEventListener("click", function () { if (gBusy) return; menu(gMenu.hidden); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !gMenu.hidden) { menu(false); gBot.focus(); } });
  document.addEventListener("click", function (e) { if (!gMenu.hidden && !guide.contains(e.target)) menu(false); });
  // each section has a tip; Subi says it the first time you reach that section
  var tipped = {};
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { var el = e.target; if (e.isIntersecting && !tipped[el.className] && !gBusy && gMenu.hidden) { tipped[el.className] = 1; setTimeout(function () { if (!gBusy && gMenu.hidden) guideSay(el.getAttribute("data-tip"), 4800); }, 700); } }); }, { threshold: .45 });
    $$("[data-tip]").forEach(function (s) { if (s !== hero) io.observe(s); });
  }
  if (!reduce) setTimeout(function () { guideSay("Hi, I'm Subi. Pick an industry below, or click me and I'll show you around.", 5200); }, 2600);
  // helpers for the guided demos
  function settle() { return new Promise(function (res) { var last = -1, n = 0, t0 = Date.now(); (function f() { var y = window.scrollY; if (Math.abs(y - last) < 1) n++; else n = 0; last = y; if (n >= 8 || Date.now() - t0 > 3200) res(); else requestAnimationFrame(f); })(); }); }
  function toEl(el, block) { el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: block || "center" }); return wait(150).then(settle).then(function () { return wait(150); }); }
  function flyTo(el, fx, fy) { var r = el.getBoundingClientRect(); if (!r.width && !r.height) return wait(100); gFly = true; gPlace(Math.max(8, Math.min(window.innerWidth - 80, r.left + r.width * fx)), Math.max(70, Math.min(window.innerHeight - 140, r.top + r.height * fy))); return wait(1100); }
  var vcur = document.createElement("div"); vcur.className = "vcur"; vcur.innerHTML = '<svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 2 3.5 6.5-2.5 1.2L10.5 14 6 18z" fill="#fff" stroke="#14213D" stroke-width="1.6" stroke-linejoin="round"/></svg>'; document.body.appendChild(vcur);
  function curTo(x, y) { vcur.style.setProperty("--cx", Math.round(x) + "px"); vcur.style.setProperty("--cy", Math.round(y) + "px"); }
  async function press(el) {
    var g = gBot.getBoundingClientRect(); vcur.style.transition = "none"; curTo(g.left + 6, g.top + 62); void vcur.offsetWidth; vcur.style.transition = ""; vcur.classList.add("on"); await wait(120); guide.classList.add("act");
    var r = el.getBoundingClientRect(); curTo(r.left + r.width / 2 - 6, r.top + r.height / 2 - 4); await wait(1000);
    ring(el); Snd.tick(); await wait(200); el.click(); await wait(350);
    g = gBot.getBoundingClientRect(); curTo(g.left + 6, g.top + 62); await wait(750); vcur.classList.remove("on"); guide.classList.remove("act");
  }
  async function finish(msgText) { await wait(1500); guideSay(msgText || "That's how it works. Click me for more.", 3600); await wait(900); gHome(); await wait(1000); gBusy = false; }
  var shows = {
    clock: async function () { var c = $(".lc--clock"); await toEl(c); setMode("fp"); guideSay("Let's clock in with a thumb.", 2400); await flyTo($("[data-scan]"), 1.15, -.35); guideSay("I press the scanner with my thumb.", 2400); await wait(500); await press($("[data-scan]")); await wait(2300); guideSay($("[data-status]").textContent + ". The check marks are the checks it ran.", 3800); await finish(); },
    selfie: async function () { var c = $(".lc--clock"); await toEl(c); setMode("selfie"); guideSay("Selfie mode. You upload a photo, or I can use a sample.", 3200); await flyTo(sample, .5, -1.4); await wait(500); await press(sample); await wait(2300); guideSay("Face matched. The photo shows right in the scanner.", 3600); await finish(); },
    gps: async function () { var c = $(".lc--clock"); await toEl(c); setMode("gps"); guideSay("GPS only. First I step outside the office.", 3000); await flyTo(geoSw, -.8, -1.6); if (geoSw.getAttribute("aria-checked") === "true") { await press(geoSw); } await wait(500); await flyTo($("[data-scan]"), 1.15, -.35); await press($("[data-scan]")); await wait(2300); guideSay("Outside the fence, so the punch is rejected.", 3400); await wait(2500); guideSay("Now I walk back inside.", 2400); await flyTo(geoSw, -.8, -1.6); await press(geoSw); await wait(500); await flyTo($("[data-scan]"), 1.15, -.35); await press($("[data-scan]")); await wait(2300); await finish("Inside the fence, so it passes."); },
    leave: async function () { var c = $(".lc--leave"); await toEl(c); guideSay("To request leave, pick a start date and an end date.", 3600); var btns = $$("[data-lcal] button"), a = btns[Math.min(btns.length - 3, 7)], b = btns[Math.min(btns.length - 1, 9)]; await flyTo(a, .9, -.4); await press(a); guideSay("That is the start.", 1800); await wait(800); await flyTo(b, .9, -.4); await press(b); guideSay("And the end. Weekends are skipped.", 2800); await wait(1500); var go = $("[data-lgo]"); await flyTo(go, .9, -.8); await press(go); await wait(1400); await finish("Approved, and the balance is updated."); },
    pay: async function () { var c = $(".lc--pay"); await toEl(c); guideSay("Let's give them some overtime.", 2400); var o = $("[data-oth]"); await flyTo(o, .9, -.8); for (var v = +o.value; v <= 14; v++) { o.value = v; o.dispatchEvent(new Event("input")); await wait(90); } guideSay("More overtime, more pay. Watch the net number.", 3000); await wait(1200); var go = $("[data-pay-go]"); await flyTo(go, .9, -.8); await press(go); await wait(1200); await finish("Payroll is done. Nobody typed a thing."); },
    roster: async function () { var c = $(".lc--roster"); await toEl(c); guideSay("Click a shift and it rotates. Watch the coverage row.", 3400); var cell = $('[data-r="0"][data-d="1"]'); await flyTo(cell, .9, -.5); await press(cell); await wait(900); guideSay(cover.textContent, 3600); await wait(1800); var fix = $('[data-r="2"][data-d="1"]'); await flyTo(fix, .9, -.5); var tries = 0; while (cover.classList.contains("bad") && tries++ < 3) { await press(fix); await wait(700); } await finish(cover.classList.contains("bad") ? "Still short. Try another shift." : "Fixed. Coverage is fine again."); },
    ask: async function () { await toEl($("#ask"), "start"); guideSay("Pick any question on the left.", 2600); var q = $("[data-qs] button"); await flyTo(q, 1.05, .1); await press(q); await finish("Ask me anything else you like."); }
  };
  gMenu.addEventListener("click", function (e) { var b = e.target.closest("[data-show]"); if (!b || gBusy) return; menu(false); gBusy = true; var f = shows[b.getAttribute("data-show")]; if (f) f().catch(function () { gBusy = false; gHome(); }); });

  setIndustry(0, false); setPane(0, false);
  say(coreSay, "Touch a need and I'll tell you more.", 5000);
})();
