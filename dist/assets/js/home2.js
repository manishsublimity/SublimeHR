/* SublimeHR — Living Office. Characters that breathe, blink, hold things and watch you; a helper robot that
   answers questions; optional sound; a dashboard that fills as things happen; a phone movie; a walking
   timeline; six working mini products; role views; and an assistant chat. */
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
    else if (!localStorage.getItem("lo-nudge") && !reduce) setTimeout(function () { if (!Snd.get()) { nudge.hidden = false; setTimeout(function () { nudge.hidden = true; }, 9000); } }, 6000);
  } catch (e) {}

  /* ================= confetti ================= */
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

  /* ================= stage fit, wall clock, nav ================= */
  function fit() { stage.style.setProperty("--fit", String(Math.max(.5, Math.min(1, (hero.clientWidth - 112 - 470 - 36) / 760)))); }
  fit(); window.addEventListener("resize", fit);
  var hh = $(".hh", stage), mh = $(".mh", stage), sh = $(".sh", stage);
  function tick() { var d = new Date(), s = d.getSeconds(), m = d.getMinutes() + s / 60, h = (d.getHours() % 12) + m / 60; hh.style.transform = "rotate(" + h * 30 + "deg)"; mh.style.transform = "rotate(" + m * 6 + "deg)"; sh.style.transform = "rotate(" + s * 6 + "deg)"; }
  tick(); setInterval(tick, 1000);
  window.addEventListener("scroll", function () { nav.classList.toggle("solid", window.scrollY > hero.offsetHeight - 140); }, { passive: true });

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

  /* ================= dashboard ================= */
  var dashEls = { present: $('[data-d="present"]'), leave: $('[data-d="leave"]'), ot: $('[data-d="ot"]'), pay: $('[data-d="pay"]') };
  var bars = $$("[data-bars] i"), ring = $("[data-ring]"), ringN = $("[data-ring-n]"), feed = $("[data-feed]"), dnav = $$("[data-dnav] span");
  function tween(el, to, dur) {
    var from = parseFloat(String(el.textContent).replace(/,/g, "")) || 0, t0 = performance.now(); dur = dur || 900;
    if (reduce) { el.textContent = fmt(to); return; }
    (function f(t) { var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(from + (to - from) * e); if (p < 1) requestAnimationFrame(f); })(t0);
  }
  function setDash(i) {
    tween(dashEls.present, 380 + (i * 37) % 90); tween(dashEls.leave, 6 + (i * 5) % 11); tween(dashEls.ot, 48 + (i * 23) % 70); tween(dashEls.pay, 70 + (i * 7) % 28);
    bars.forEach(function (b, k) { var h = 52 + ((i * 13 + k * 29) % 42); if (k > 4) h *= .5; b.style.setProperty("--h", Math.round(h) + "%"); });
    var a1 = 38 + (i * 7) % 24, a2 = a1 + 24 + (i * 3) % 12; ring.style.setProperty("--a1", a1 + "%"); ring.style.setProperty("--a2", a2 + "%"); tween(ringN, 120 + (i * 13) % 60);
    $("[data-dash-ind]").textContent = inds[i].name;
  }
  $("[data-dash-date]").textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  var navI = 0; if (!reduce) setInterval(function () { dnav[navI].classList.remove("on"); navI = (navI + 1) % dnav.length; dnav[navI].classList.add("on"); }, 3600);
  var typeIcon = { in: "clock", leave: "calendar", swap: "repeat", other: "check" };
  function pushFeed(name, text, type) {
    var li = document.createElement("li"); li.innerHTML = "<i>" + icons[typeIcon[type] || "check"] + "</i><span><b>" + name + "</b>" + text + "<br><em>just now</em></span>";
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

  /* ================= Subi: follows the cursor, and takes you to the questions ================= */
  var subi = $("[data-subi]"), subiSay = $("[data-subi-say]"), subiBot = $(".subi__bot", subi);
  var home = { x: 650, y: 14 }, sp = { x: home.x, y: home.y }, target = { x: home.x, y: home.y }, tipI = 0;
  var tips = ["Click me and I'll take you to the questions.", "Pick an industry below. Everyone changes clothes for it.", "Turn the sound on. I do voices.", "The dashboard further down runs on real arithmetic.", "Try the live demos. Nothing there is a screenshot."];
  document.addEventListener("pointermove", function (e) {
    var r = stage.getBoundingClientRect(), k = r.width / 760 || 1;
    if (e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom) { target.x = Math.max(0, Math.min(690, (e.clientX - r.left) / k + 30)); target.y = Math.max(0, Math.min(470, (e.clientY - r.top) / k - 110)); }
    else { target.x = home.x; target.y = home.y; }
  }, { passive: true });
  (function loop() { sp.x += (target.x - sp.x) * .055; sp.y += (target.y - sp.y) * .055; subi.style.setProperty("--sx", sp.x.toFixed(1) + "px"); subi.style.setProperty("--sy", sp.y.toFixed(1) + "px"); if (!reduce) requestAnimationFrame(loop); })();
  subiBot.addEventListener("click", function () { say(subiSay, "On it. Let's ask something.", 2200, 540); Snd.pop(); burstAt(subiBot, 6); setTimeout(function () { $("#ask").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }, 350); });
  subiBot.addEventListener("mouseenter", function () { if (!subiSay.classList.contains("on")) say(subiSay, tips[tipI++ % tips.length], 3600, 540); });
  if (!reduce) setTimeout(function () { say(subiSay, "Hi, I'm Subi. Pick an industry below.", 4200, 540); }, 2500);
  slots.forEach(function (s, i) { $(".ppl", s).addEventListener("click", function () { var d = inds[cur]; say($("[data-say]", s), d.roles[i] + ": " + d.events[(i + cur) % d.events.length][1], 3200, pitch[i]); talk($(".ppl", s), 1700); Snd.pop(); }); });

  /* ================= needs orbit, pains and recommended modules ================= */
  function renderNeeds() {
    var d = inds[cur];
    needsEl.innerHTML = d.needs.map(function (n, i) { return '<li class="need" style="--a:' + (i * 60 - 60) + 'deg;--r:240px;--i:' + i + '"><span><button class="need__in" type="button" data-n="' + i + '"><i>' + icons[n[0]] + "</i>" + n[1] + "</button></span></li>"; }).join("");
    painsEl.innerHTML = d.pains.map(function (t, i) { return '<li style="--i:' + i + '">' + t + "</li>"; }).join("");
    recEl.innerHTML = d.rec.map(function (r, i) { return '<a href="' + r[1] + '" style="--i:' + i + '"><i>' + icons[r[2]] + "</i>" + r[0] + "</a>"; }).join("");
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
    slots.forEach(function (s, k) { $("[data-role]", s).textContent = d.roles[k]; $("[data-prop]", s).innerHTML = icons[d.props[k]] || ""; var p = $(".ppl", s); p.classList.remove("hop"); void p.offsetWidth; p.classList.add("hop"); });
    renderNeeds(); setDash(i); say(coreSay, "Touch a need and I'll tell you more.", 3200);
    if (fromUser) { Snd.whoosh(); say(subiSay, "Welcome to the " + d.name.toLowerCase() + " floor.", 3200, 540); }
    last = -1; setTimeout(act, 700);
  }
  chipBtns.forEach(function (b) { b.addEventListener("click", function () { userPicked = true; var k = b.getAttribute("data-k"); for (var i = 0; i < inds.length; i++) if (inds[i].key === k) setIndustry(i, true); burstAt(b, 8); }); });
  if (!reduce) setInterval(function () { if (!userPicked && heroVisible && !document.hidden) setIndustry((cur + 1) % inds.length, false); }, 9500);
  vis(hero, function (v) { heroVisible = v; }, .15);

  /* ================= stats count up ================= */
  $$("[data-count]").forEach(function (el) {
    var to = +el.getAttribute("data-count"), suf = el.getAttribute("data-suf") || "", done = false;
    vis(el, function (v) { if (!v || done) return; done = true; if (reduce) { el.textContent = to + suf; return; } var t0 = performance.now(); (function f(t) { var p = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(f); })(t0); }, .5);
  });

  /* ================= phone movie ================= */
  var movie = $("[data-movie]"), mSteps = $$("[data-go]", movie), mScr = $$(".mscr", movie), mScreen = $(".mscreen", movie), tap = $("[data-tap]", movie), mSay = $("[data-say-movie]", movie), mWho = $(".ppl--movie", movie), mBar = $("[data-mbar]", movie);
  var mi = 0, mT = [], mVis = false, mAuto = null, MDUR = 4300, mLines = ["Employee code first.", "Now the one-time code.", "Here's my whole day.", "Fingerprint and GPS, one press.", "Two days off. Easy.", "And there's my payslip."];
  (function () { var cal = $("[data-mcal2]", movie), h = ["S", "M", "T", "W", "T", "F", "S"], s = h.map(function (x) { return '<span class="h">' + x + "</span>"; }).join(""); for (var n = 20; n < 34; n++) { var d = n > 30 ? n - 30 : n, wd = (n - 20) % 7; s += '<span class="' + (wd === 0 || wd === 6 ? "we " : "") + '" data-d="' + d + '">' + d + "</span>"; } cal.innerHTML = s; })();
  function mLater(fn, ms) { mT.push(setTimeout(fn, reduce ? 0 : ms)); }
  function tapOn(el) { var a = el.getBoundingClientRect(), b = mScreen.getBoundingClientRect(); tap.style.left = a.left - b.left + a.width / 2 + "px"; tap.style.top = a.top - b.top + a.height / 2 + "px"; tap.classList.add("on"); mLater(function () { tap.classList.add("tap"); el.classList.add("press"); Snd.tick(); }, 420); mLater(function () { tap.classList.remove("tap", "on"); el.classList.remove("press"); }, 760); }
  function mGo(i) {
    mT.forEach(clearTimeout); mT = []; mi = i; var scr = mScr[i];
    mSteps.forEach(function (b, k) { b.setAttribute("aria-selected", k === i ? "true" : "false"); b.style.setProperty("--dur", MDUR / 1000 + "s"); var em = $("em", b); em.style.animation = "none"; if (k === i) { void em.offsetWidth; em.style.animation = ""; } });
    mScr.forEach(function (s, k) { s.classList.toggle("on", k === i); }); mBar.style.width = ((i + 1) / 6 * 100) + "%"; tap.classList.remove("on", "tap");
    say(mSay, mLines[i], 3000, pitch[0]); talk(mWho, 1400); Snd.whoosh();
    if (i === 0) { var t = $("[data-mtype]", scr), s = "EMP-0142", k = 0; t.textContent = ""; for (k = 1; k <= s.length; k++) (function (n) { mLater(function () { t.textContent = s.slice(0, n); Snd.tick(); }, 500 + n * 130); })(k); mLater(function () { tapOn($("[data-mbtn]", scr)); }, 1900); }
    if (i === 1) { var boxes = $$("[data-motp] span", scr), dg = ["4", "8", "2", "6"]; boxes.forEach(function (b) { b.textContent = ""; b.classList.remove("f"); }); boxes.forEach(function (b, k) { mLater(function () { b.textContent = dg[k]; b.classList.add("f"); Snd.tick(); }, 500 + k * 340); }); mLater(function () { tapOn($("[data-mbtn]", scr)); }, 2200); }
    if (i === 2) { mLater(function () { tapOn($(".mbtn", scr)); }, 1700); }
    if (i === 3) { var sc = $("[data-mscan]", scr), lb = $("[data-mclock]", scr); sc.classList.remove("scan", "ok"); lb.textContent = "Hold to clock in"; mLater(function () { sc.classList.add("scan"); Snd.whoosh(); lb.textContent = "Scanning…"; }, 700); mLater(function () { sc.classList.remove("scan"); sc.classList.add("ok"); lb.textContent = "Clocked in at 08:52"; Snd.ding(); burstAt(sc, 14); }, 2300); }
    if (i === 4) { $$(".sel", scr).forEach(function (c) { c.classList.remove("sel"); }); [23, 24].forEach(function (d, k) { mLater(function () { var c = $('[data-d="' + d + '"]', scr); c.classList.add("sel"); Snd.tick(); }, 900 + k * 500); }); mLater(function () { tapOn($("[data-mbtn]", scr)); }, 2300); }
    if (i === 5) { $$(".mslip div", scr).forEach(function (r) { r.classList.remove("on"); }); $$(".mslip div", scr).forEach(function (r, k) { mLater(function () { r.classList.add("on"); Snd.tick(); }, 500 + k * 420); }); mLater(function () { Snd.cash(); burstAt($(".mslip .net", scr), 12); }, 2400); }
  }
  function mNext() { mGo((mi + 1) % 6); }
  function mAutoStart() { clearInterval(mAuto); if (!reduce) mAuto = setInterval(function () { if (mVis && !document.hidden) mNext(); }, MDUR); }
  mSteps.forEach(function (b) { b.addEventListener("click", function () { mGo(+b.getAttribute("data-go")); mAutoStart(); }); });
  vis(movie, function (v) { mVis = v; if (v && !mScr[0]._started) { mScr[0]._started = 1; mGo(0); mAutoStart(); } }, .3);

  /* ================= day timeline: Aisha really walks, turns sideways, and faces front at each stop ================= */
  var day = $("[data-day]"), walker = $("[data-walker]"), walkP = $(".ppl", walker), prog = $("[data-prog]"), stp = $$(".stp", day);
  var sx = stp.map(function (s) { return parseFloat(s.style.getPropertyValue("--l")); });
  var wk = { x: 3, k: 0, pause: 0, vis: false, t0: 0 };
  function wSet() { walker.style.setProperty("--wx", wk.x.toFixed(2) + "%"); prog.style.setProperty("--pw", Math.max(0, wk.x - 2).toFixed(2) + "%"); }
  function wReset() { wk.x = 3; wk.k = 0; wk.pause = 0; stp.forEach(function (s) { s.classList.remove("on"); }); wSet(); }
  vis(day, function (v) { wk.vis = v; }, .3);
  (function wLoop(t) {
    var dt = Math.min(.05, (t - (wk.t0 || t)) / 1000); wk.t0 = t;
    if (wk.vis && !document.hidden) {
      if (wk.pause > 0) { wk.pause -= dt; walkP.classList.remove("walking"); if (wk.pause <= 0) { if (wk.k >= stp.length) wReset(); } }
      else {
        var goal = sx[wk.k]; if (goal === undefined) { wk.pause = 1; }
        else if (wk.x < goal - .15) { wk.x += 6.5 * dt; walkP.classList.add("walking"); wSet(); }
        else { wk.x = goal; wSet(); walkP.classList.remove("walking"); stp[wk.k].classList.add("on"); Snd[wk.k === stp.length - 1 ? "cash" : "ding"](); if (wk.k === stp.length - 1) burstAt(walker, 14); wk.k++; wk.pause = wk.k >= stp.length ? 3 : 1.7; }
      }
    } else walkP.classList.remove("walking");
    requestAnimationFrame(wLoop);
  })(0);
  if (reduce) { stp.forEach(function (s) { s.classList.add("on"); }); wk.x = 92; wSet(); }

  /* ================= live playground ================= */
  var lab = $("[data-lab]");
  // clock in
  var arr = $("[data-arr]"), arrOut = $("[data-arr-out]"), scanner = $("[data-scan]"), scanIc = $("[data-scan-ic]"), scanLbl = $("[data-scan-lbl]"), checks = $$("[data-checks] li", lab), status = $("[data-status]"), c0 = $("[data-c0]"), punching = false, mode = "fp";
  var hm = function (m) { return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };
  arr.addEventListener("input", function () { arrOut.textContent = hm(+arr.value); }); arrOut.textContent = hm(+arr.value);
  var modeMap = { fp: ["fingerprint", "Fingerprint matched"], selfie: ["camera", "Selfie matched"], gps: ["pin", "Location matched"] };
  $$("[data-mode]", lab).forEach(function (b) { b.addEventListener("click", function () { mode = b.getAttribute("data-mode"); $$("[data-mode]", lab).forEach(function (x) { x.setAttribute("aria-checked", x === b ? "true" : "false"); }); scanIc.innerHTML = icons[modeMap[mode][0]]; c0.textContent = modeMap[mode][1]; Snd.tick(); }); });
  scanner.addEventListener("click", function () {
    if (punching) return; punching = true; var m = +arr.value;
    checks.forEach(function (c) { c.className = ""; }); status.textContent = "Checking"; scanner.className = "scanner scan"; scanLbl.textContent = "Scanning…"; Snd.whoosh();
    setTimeout(function () { checks[0].classList.add("on"); Snd.tick(); }, 700); setTimeout(function () { checks[1].classList.add("on"); Snd.tick(); }, 1200);
    setTimeout(function () {
      var cls, txt, lbl;
      if (m <= 540) { cls = "on"; txt = "On time, " + hm(m); lbl = "On time"; scanner.className = "scanner ok"; Snd.ding(); burstAt(scanner, 16); }
      else if (m <= 555) { cls = "on grace"; txt = "Within grace, no deduction"; lbl = "Grace window"; scanner.className = "scanner ok"; Snd.pop(); }
      else { cls = "on late"; txt = "Late by " + (m - 540) + " min"; lbl = "Late"; scanner.className = "scanner bad"; Snd.boop(); }
      status.textContent = txt; checks[2].className = cls; scanLbl.textContent = lbl; punching = false;
      var td = $("[data-today]", lab); $("b", td).textContent = hm(m); var em = $("em", td); em.textContent = lbl; em.className = m <= 540 ? "ok" : m <= 555 ? "gr" : "late"; td.classList.remove("pulse-in"); void td.offsetWidth; td.classList.add("pulse-in");
    }, 1900);
  });
  // leave
  var lcal = $("[data-lcal]"), lsum = $("[data-lsum]"), lbar = $("[data-lbar]"), lflow = $("[data-lflow]"), ltype = "annual", bal = { annual: 14, sick: 6, comp: 2 }, maxb = { annual: 14, sick: 6, comp: 6 }, selA = null, selB = null;
  var now = new Date(), y = now.getFullYear(), mo = now.getMonth(), first = new Date(y, mo, 1).getDay(), dim = new Date(y, mo + 1, 0).getDate();
  function lRender() {
    var s = ["S", "M", "T", "W", "T", "F", "S"].map(function (x) { return '<span class="h">' + x + "</span>"; }).join(""), k;
    for (k = 0; k < first; k++) s += "<span></span>";
    for (var d = 1; d <= dim; d++) { var wd = (first + d - 1) % 7, we = wd === 0 || wd === 6, cl = we ? "we" : ""; if (selA && d === selA) cl += " st"; else if (selB && d === selB) cl += " st"; else if (selA && selB && d > selA && d < selB && !we) cl += " in"; s += we ? '<span class="' + cl + '">' + d + "</span>" : '<button type="button" class="' + cl + '" data-day="' + d + '">' + d + "</button>"; }
    lcal.innerHTML = s;
  }
  function workDays(a, b) { var n = 0; for (var d = a; d <= b; d++) { var wd = (first + d - 1) % 7; if (wd !== 0 && wd !== 6) n++; } return n; }
  function lSummary() {
    lflow.textContent = ""; lflow.className = "lflow";
    if (!selA) { lsum.textContent = "Pick a start date."; lbar.style.width = Math.max(4, bal[ltype] / maxb[ltype] * 100) + "%"; return; }
    var b = selB || selA, n = workDays(selA, b), after = bal[ltype] - n;
    lsum.textContent = n + " working day" + (n === 1 ? "" : "s") + ", weekends skipped. " + (after >= 0 ? "Balance after: " + after + "." : "Not enough balance, so HR decides.");
    lbar.style.width = Math.max(4, Math.max(0, after) / maxb[ltype] * 100) + "%";
  }
  lcal.addEventListener("click", function (e) { var b = e.target.closest("[data-day]"); if (!b) return; var d = +b.getAttribute("data-day"); Snd.tick(); if (!selA || (selA && selB)) { selA = d; selB = null; } else if (d < selA) { selB = selA; selA = d; } else selB = d; lRender(); lSummary(); });
  $$("[data-ltype]", lab).forEach(function (b) { b.addEventListener("click", function () { ltype = b.getAttribute("data-ltype"); $$("[data-ltype]", lab).forEach(function (x) { x.setAttribute("aria-checked", x === b ? "true" : "false"); }); Snd.tick(); lSummary(); }); });
  $("[data-lgo]").addEventListener("click", function (e) {
    if (!selA) { lflow.textContent = "Pick a date first."; lflow.className = "lflow hr"; Snd.boop(); return; }
    var n = workDays(selA, selB || selA); Snd.whoosh();
    setTimeout(function () {
      if (n <= bal[ltype]) { bal[ltype] -= n; Snd.chime(); burstAt(e.currentTarget, 16); lflow.textContent = "Approved by Priya. " + bal[ltype] + " days left."; lflow.className = "lflow"; selA = selB = null; lRender(); lbar.style.width = Math.max(4, bal[ltype] / maxb[ltype] * 100) + "%"; lsum.textContent = "Pick a start date."; }
      else { Snd.boop(); lflow.textContent = "Sent to HR. Not enough balance to auto-approve."; lflow.className = "lflow hr"; }
    }, 600);
  });
  lRender(); lSummary();
  // payroll
  var oth = $("[data-oth]"), ulv = $("[data-ulv]"), netEl = $("[data-net]");
  function payUpdate() {
    var h = +oth.value, u = +ulv.value, base = 5100, ot = Math.round(4800 / 160 * 1.5 * h), ded = Math.round(4800 / 30 * u), net = base + ot - ded;
    $("[data-oth-out]").textContent = h; $("[data-ulv-out]").textContent = u; $("[data-ot-h]").textContent = h; $("[data-ul-d]").textContent = u;
    $("[data-ot-v]").textContent = "+ " + fmt(ot); $("[data-ul-v]").textContent = "- " + fmt(ded); tween(netEl, net, 450);
    $("[data-s1]").style.flex = String(base); $("[data-s2]").style.flex = String(Math.max(ot, 1)); $("[data-s3]").style.flex = String(Math.max(ded, 1)); $("[data-sent]").textContent = "";
  }
  oth.addEventListener("input", payUpdate); ulv.addEventListener("input", payUpdate); oth.addEventListener("change", Snd.tick); ulv.addEventListener("change", Snd.tick); netEl.textContent = "0"; payUpdate();
  $("[data-pay-go]").addEventListener("click", function (e) { $("[data-sent]").textContent = "412 payslips sent to every phone"; Snd.cash(); burstAt(e.currentTarget, 18); });
  // permissions
  var perms = $("[data-perms]"), permSum = $("[data-perm-sum]"), roleNames = ["An employee", "A manager", "HR", "An admin"], areas = [["clock", "Attendance"], ["calendar", "Leave"], ["wallet", "Payroll"], ["chart", "Reports"], ["shield", "Settings"]];
  var pm = [[1, 1, 0, 0, 0], [1, 1, 0, 1, 0], [1, 1, 1, 1, 0], [1, 1, 1, 1, 1]], pr = 0;
  function pRender() {
    perms.innerHTML = areas.map(function (a, i) { return "<li>" + icons[a[0]] + "<span>" + a[1] + '</span><button class="sw" type="button" role="switch" aria-checked="' + (pm[pr][i] ? "true" : "false") + '" data-pi="' + i + '" aria-label="' + a[1] + '"></button></li>'; }).join("");
    var n = pm[pr].reduce(function (s, v) { return s + v; }, 0); permSum.textContent = roleNames[pr] + " can open " + n + " of 5 areas" + (pm[pr][2] ? ", including payroll." : ", and cannot see payroll.");
  }
  perms.addEventListener("click", function (e) { var b = e.target.closest("[data-pi]"); if (!b) return; var i = +b.getAttribute("data-pi"); pm[pr][i] = pm[pr][i] ? 0 : 1; Snd.tick(); pRender(); });
  $$("[data-role-p]", lab).forEach(function (b) { b.addEventListener("click", function () { pr = +b.getAttribute("data-role-p"); $$("[data-role-p]", lab).forEach(function (x) { x.setAttribute("aria-checked", x === b ? "true" : "false"); }); Snd.tick(); pRender(); }); });
  pRender();
  // who's in
  var hereG = $("[data-here-grid]"), hereS = $("[data-here]"), people24 = [], cols = ["#45C4B0", "#FF8A70", "#9B8CFF", "#FFB020", "#7FB4FF", "#FF9FC0", "#B8E986", "#E98ACD"], ini = ["AK", "OM", "SN", "RV", "PR", "KR", "ND", "JL", "MH", "SI", "TB", "DL", "ES", "FA", "GU", "HY", "IM", "JO", "KA", "LU", "MA", "NO", "OL", "PA"];
  for (var q = 0; q < 24; q++) people24.push({ a: 470 + Math.round(((q * 37) % 100) * 1.05) + (q % 5 === 0 ? 40 : 0), c: cols[q % 8], n: ini[q] });
  hereG.innerHTML = people24.map(function (p) { return '<i style="--c:' + p.c + '">' + p.n + "</i>"; }).join("");
  function hRender() {
    var m = +hereS.value, inN = 0, late = 0; $("[data-here-t]").textContent = hm(m);
    $$("i", hereG).forEach(function (el, k) { var p = people24[k], arrived = m >= p.a, isLate = p.a > 540; el.className = arrived ? (isLate ? "late" : "ok") : ""; if (arrived) { inN++; if (isLate) late++; } });
    $("[data-here-n]").textContent = inN + " of 24 in" + (late ? ", " + late + " late" : "");
  }
  hereS.addEventListener("input", hRender); hRender();
  // roster
  var roster = $("[data-roster]"), cover = $("[data-cover]"), days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], rp = [["Karan", "#FF9FC0"], ["Ravi", "#45C4B0"], ["Sara", "#9B8CFF"], ["Nadia", "#B8E986"], ["Omar", "#FFD05A"]], seq = ["M", "E", "N", "O"], lastBad = false;
  var rs = [["M", "M", "E", "E", "O", "M", "O"], ["E", "E", "M", "M", "M", "O", "M"], ["M", "O", "M", "M", "E", "E", "O"], ["O", "M", "O", "E", "M", "M", "E"], ["N", "N", "M", "O", "E", "O", "M"]];
  function rRender() {
    var h = '<div class="r"><span></span>' + days.map(function (d) { return '<span class="hd">' + d + "</span>"; }).join("") + "</div>", bad = [];
    rp.forEach(function (p, r) { h += '<div class="r"><span class="nm"><i style="--c:' + p[1] + '">' + p[0].slice(0, 2).toUpperCase() + "</i>" + p[0] + "</span>" + rs[r].map(function (s, d) { return '<button type="button" class="' + s + '" data-r="' + r + '" data-d="' + d + '" aria-label="' + p[0] + " " + days[d] + ", shift " + s + '">' + s + "</button>"; }).join("") + "</div>"; });
    h += '<div class="r"><span class="nm">Mornings</span>' + days.map(function (d, di) { var n = rs.reduce(function (s, row) { return s + (row[di] === "M" ? 1 : 0); }, 0), b = n < 2; if (b) bad.push(d + " has " + n); return '<span class="cv' + (b ? " bad" : "") + '">' + n + "</span>"; }).join("") + "</div>";
    roster.innerHTML = h; cover.className = "cover" + (bad.length ? " bad" : ""); cover.textContent = bad.length ? "Understaffed: " + bad.join(", ") + " on the morning shift (needs 2)." : "Coverage is fine for the whole week.";
    if (bad.length && !lastBad) Snd.boop(); lastBad = !!bad.length;
  }
  roster.addEventListener("click", function (e) { var b = e.target.closest("[data-r]"); if (!b) return; var r = +b.getAttribute("data-r"), d = +b.getAttribute("data-d"); rs[r][d] = seq[(seq.indexOf(rs[r][d]) + 1) % 4]; Snd.pop(); rRender(); });
  rRender();

  /* ================= peek cards ================= */
  $$(".pk").forEach(function (c) { c.addEventListener("click", function () { c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") === "true" ? "false" : "true"); Snd.pop(); }); c.addEventListener("mouseenter", Snd.tick); });

  /* ================= role views ================= */
  var rTabs = $$("[data-r]", $("[data-roles]")), rScr = $$("[data-rs]", $("[data-roles]"));
  rTabs.forEach(function (t) { t.addEventListener("click", function () { var i = +t.getAttribute("data-r"); rTabs.forEach(function (x) { x.setAttribute("aria-selected", x === t ? "true" : "false"); }); rScr.forEach(function (s, k) { s.hidden = k !== i; }); Snd.whoosh(); }); });
  var rc = $("[data-rclock]"); rc.addEventListener("click", function () { var on = rc.classList.toggle("on"); $("[data-rclock-t]").textContent = on ? "Clocked in 08:52" : "Clock in"; $("[data-rclock-s]").textContent = on ? "On time. Have a good day." : "Tap to punch, 09:00 shift"; if (on) { Snd.ding(); burstAt(rc, 14); } else Snd.tick(); });
  var apprN = $("[data-appr-n]"); $("[data-appr]").addEventListener("click", function (e) { var b = e.target.closest("[data-ap]"); if (!b) return; var li = b.closest("li"); if (li.classList.contains("done")) return; li.classList.add("done"); b.textContent = "Approved"; apprN.textContent = Math.max(0, +apprN.textContent - 1); Snd.chime(); burstAt(li, 8); });
  var dirData = [["Aisha Khan", "Finance", "Present"], ["Omar Mansour", "Operations", "On leave"], ["Sara Nasser", "Design", "Present"], ["Ravi Verma", "Engineering", "Present"], ["Priya Shah", "HR", "Present"], ["Karan Mehta", "Sales", "On leave"], ["Nadia Farouk", "Finance", "Present"], ["John Lewis", "Reception", "Present"]], dcols = ["#FF8A70", "#E0A42E", "#9B8CFF", "#45C4B0", "#5E8FE0", "#E86F9C", "#6BB84A", "#8A7BD8"];
  var dir = $("[data-dir]"), find = $("[data-find]");
  function dRender() { var q = find.value.trim().toLowerCase(), rows = dirData.map(function (r, i) { return [r, i]; }).filter(function (x) { return !q || (x[0][0] + " " + x[0][1]).toLowerCase().indexOf(q) > -1; }); dir.innerHTML = rows.length ? rows.slice(0, 5).map(function (x) { var r = x[0]; return '<li><i style="--c:' + dcols[x[1]] + '">' + r[0].split(" ").map(function (w) { return w[0]; }).join("") + "</i><span><b>" + r[0] + "</b>" + r[1] + "</span><em" + (r[2] === "On leave" ? ' class="lv"' : "") + ">" + r[2] + "</em></li>"; }).join("") : '<li class="none">No one matches that. Try another name or team.</li>'; }
  find.addEventListener("input", dRender); dRender();
  $$("[data-fsteps] button").forEach(function (b) { b.addEventListener("click", function () { var on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on ? "true" : "false"); Snd.tick(); if ($$("[data-fsteps] [aria-pressed=true]").length === 4) { Snd.cash(); burstAt(b, 18); } }); });

  /* ================= Ask Subi ================= */
  var faq = data.faq, qs = $("[data-qs]"), log = $("[data-log]"), askForm = $("[data-ask-form]"), askIn = $("#ask-in");
  qs.innerHTML = faq.slice(0, 7).map(function (f, i) { return '<button type="button" data-q="' + i + '">' + f[0] + "</button>"; }).join("");
  function msg(cls, html) { var m = document.createElement("div"); m.className = "msg " + cls; m.innerHTML = html; log.appendChild(m); log.scrollTop = log.scrollHeight; return m; }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function reply(q, a) { msg("me", esc(q)); Snd.pop(); var t = msg("bot typing", "<i></i><i></i><i></i>"); setTimeout(function () { t.remove(); msg("bot", a); Snd.blip(300); }, reduce ? 0 : 900 + Math.min(900, a.length * 3)); }
  qs.addEventListener("click", function (e) { var b = e.target.closest("[data-q]"); if (!b) return; $$("button", qs).forEach(function (x) { x.classList.toggle("on", x === b); }); var f = faq[+b.getAttribute("data-q")]; reply(f[0], esc(f[1])); });
  askForm.addEventListener("submit", function (e) {
    e.preventDefault(); var q = askIn.value.trim(); if (!q) return; askIn.value = "";
    var words = q.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(function (w) { return w.length > 3; }), best = null, bs = 0;
    faq.forEach(function (f) { var hay = (f[0] + " " + f[1]).toLowerCase(), s = 0; words.forEach(function (w) { if (hay.indexOf(w) > -1) s++; }); if (s > bs) { bs = s; best = f; } });
    reply(q, best ? esc(best[1]) : 'I don\'t have a ready answer for that yet. A teammate replies within one business day: <a class="link" href="/contact/">send us your question</a>.');
  });

  setIndustry(0, false);
  say(coreSay, "Touch a need and I'll tell you more.", 5000);
})();
