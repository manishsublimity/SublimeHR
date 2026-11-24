/* SublimeHR — Living Office: characters that breathe, blink and watch you; a helper robot; optional sound;
   a dashboard that fills as things happen; a day timeline; and try-it demos. */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var data; try { data = JSON.parse($("#lo-data").textContent); } catch (e) { return; }
  var inds = data.industries, icons = data.icons;
  var body = document.body, hero = $("[data-hero]"), stage = $("[data-stage]"), nav = $("[data-nav]"), fx = $("[data-fx]");
  var slots = $$("[data-slot]", stage), allPpl = $$(".ppl"), cur = 0, userPicked = false, heroVisible = true;
  var leads = [$("[data-lead]"), $("[data-lead2]")];
  var chipBtns = $$("[data-chips] .chip");
  var coreSay = $("[data-say-core]"), core = $(".orbit__core .ppl"), needsEl = $("[data-needs]"), painsEl = $("[data-pains]");
  var tally = { in: 412, leave: 9, swap: 3 }, last = -1;
  var pitch = [260, 200, 300, 175, 320, 225, 285];
  var fmt = function (n) { return Math.round(n).toLocaleString("en-US"); };

  /* ================= sound: tiny synth, off until the visitor turns it on ================= */
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
      tick: function () { tone(1500, .04, "square", .04); },
      pop: function () { tone(340, .13, "sine", .16, 0, 780); },
      ding: function () { tone(988, .55, "sine", .15); tone(1480, .75, "sine", .09, .09); },
      chime: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, .5, "triangle", .11, i * .09); }); },
      cash: function () { tone(1568, .16, "triangle", .13); tone(2093, .55, "triangle", .13, .1); },
      boop: function () { tone(230, .28, "sawtooth", .08, 0, 150); },
      whoosh: function () { sweep(.4, 350, 2600, .14); },
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
    // a saved "on" preference only takes effect after the first gesture, because browsers block audio before that
    if (localStorage.getItem("lo-sound") === "1") { var arm = function () { setSound(true); document.removeEventListener("pointerdown", arm); }; document.addEventListener("pointerdown", arm, { once: true }); }
    else if (!localStorage.getItem("lo-nudge") && !reduce) setTimeout(function () { if (!Snd.get()) { nudge.hidden = false; setTimeout(function () { nudge.hidden = true; }, 9000); } }, 5500);
  } catch (e) {}

  /* ================= confetti ================= */
  function burst(x, y, n) {
    if (reduce) return; var cols = ["#FFD05A", "#FF8A70", "#6BF3D2", "#9B8CFF", "#ffffff", "#7FB4FF"];
    for (var i = 0; i < (n || 14); i++) {
      var s = document.createElement("i"), a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 110;
      s.className = "cf"; s.style.left = x + "px"; s.style.top = y + "px";
      s.style.setProperty("--c", cols[i % cols.length]); s.style.setProperty("--dx", Math.cos(a) * d + "px"); s.style.setProperty("--dy", Math.sin(a) * d - 40 + "px"); s.style.setProperty("--r", Math.random() * 540 - 270 + "deg");
      fx.appendChild(s); setTimeout(function (el) { el.remove(); }.bind(null, s), 1250);
    }
  }
  function burstAt(el, n) { var r = el.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 3, n); }

  /* ================= stage fit, wall clock, nav ================= */
  function fit() { stage.style.setProperty("--fit", String(Math.max(.5, Math.min(1, (hero.clientWidth - 112 - 470 - 36) / 760)))); }
  fit(); window.addEventListener("resize", fit);
  var hh = $(".hh", stage), mh = $(".mh", stage), sh = $(".sh", stage);
  function tick() {
    var d = new Date(), s = d.getSeconds(), m = d.getMinutes() + s / 60, h = (d.getHours() % 12) + m / 60;
    hh.style.transform = "rotate(" + h * 30 + "deg)"; mh.style.transform = "rotate(" + m * 6 + "deg)"; sh.style.transform = "rotate(" + s * 6 + "deg)";
  }
  tick(); setInterval(tick, 1000);
  function onScroll() { nav.classList.toggle("solid", window.scrollY > hero.offsetHeight - 140); dayScroll(); }

  /* ================= eyes follow the cursor; idle eyes wander ================= */
  var pointer = null, lastMove = 0, rafId = 0;
  function look() {
    rafId = 0; var idle = performance.now() - lastMove > 2600;
    allPpl.forEach(function (p) {
      var ex, ey;
      if (!idle && pointer) {
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
  function say(el, text, ms, voice) {
    el.textContent = text; el.classList.add("on"); clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove("on"); }, ms || 2600);
    if (voice) Snd.blip(voice);
  }
  function bump(key, n) {
    tally[key] += n; var b = $('[data-t="' + key + '"]'); if (!b) return; b.textContent = tally[key]; var s = b.parentNode; s.classList.remove("bump"); void s.offsetWidth; s.classList.add("bump");
  }

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
    p.classList.remove("hop"); void p.offsetWidth; p.classList.add("hop", "talk"); setTimeout(function () { p.classList.remove("talk"); }, 1500);
    if (ev[2] === "in") { bump("in", 1); setTimeout(Snd.ding, 350); }
    else if (ev[2] === "leave") { bump("leave", 1); burstAt(p, 10); setTimeout(Snd.chime, 350); }
    else if (ev[2] === "swap") { bump("swap", 1); burstAt(p, 8); setTimeout(Snd.pop, 350); }
    else setTimeout(Snd.tick, 350);
    pushFeed(data.people[ev[0]], ev[1], ev[2]);
  }
  if (!reduce) { setInterval(act, 3200); setTimeout(act, 1100); }

  /* ================= Subi, the helper robot ================= */
  var subi = $("[data-subi]"), subiSay = $("[data-subi-say]"), subiBot = $(".subi__bot", subi);
  var home = { x: 664, y: 24 }, sp = { x: home.x, y: home.y }, target = { x: home.x, y: home.y }, tipI = 0;
  var tips = ["Click any character and I'll tell you what they do all day.", "Pick an industry below. Everyone changes hats for it.", "Turn the sound on. I do voices.", "The dashboard further down runs on real arithmetic.", "Try the demos below. Nothing there is a screenshot."];
  document.addEventListener("pointermove", function (e) {
    var r = stage.getBoundingClientRect(), k = r.width / 760 || 1;
    if (e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom) {
      target.x = Math.max(0, Math.min(700, (e.clientX - r.left) / k + 34)); target.y = Math.max(0, Math.min(500, (e.clientY - r.top) / k - 96));
    } else { target.x = home.x; target.y = home.y; }
  }, { passive: true });
  (function loop() {
    sp.x += (target.x - sp.x) * .055; sp.y += (target.y - sp.y) * .055;
    subi.style.setProperty("--sx", sp.x.toFixed(1) + "px"); subi.style.setProperty("--sy", sp.y.toFixed(1) + "px");
    if (!reduce) requestAnimationFrame(loop);
  })();
  subiBot.addEventListener("click", function () { say(subiSay, tips[tipI++ % tips.length], 4200, 540); Snd.pop(); burstAt(subiBot, 6); });
  if (!reduce) setTimeout(function () { say(subiSay, "Hi, I'm Subi. Pick an industry below.", 4200, 540); }, 2500);
  slots.forEach(function (s, i) { $(".ppl", s).addEventListener("click", function () { var d = inds[cur]; say($("[data-say]", s), d.roles[i] + ": " + d.events[(i + cur) % d.events.length][1], 3200, pitch[i]); Snd.pop(); }); });

  /* ================= needs orbit and pains ================= */
  function renderNeeds() {
    var d = inds[cur];
    needsEl.innerHTML = d.needs.map(function (n, i) {
      return '<li class="need" style="--a:' + (i * 60 - 90) + 'deg;--r:240px;--i:' + i + '"><span><button class="need__in" type="button" data-n="' + i + '"><i>' + icons[n[0]] + "</i>" + n[1] + "</button></span></li>";
    }).join("");
    painsEl.innerHTML = d.pains.map(function (t, i) { return '<li style="--i:' + i + '">' + t + "</li>"; }).join("");
    needsEl.style.animation = "none"; void needsEl.offsetWidth; needsEl.style.animation = "";
  }
  function speakNeed(i) {
    var n = inds[cur].needs[i]; if (!n) return; say(coreSay, n[2], 4200, pitch[2]); core.classList.add("talk"); clearTimeout(core._t); core._t = setTimeout(function () { core.classList.remove("talk"); }, 1600);
  }
  needsEl.addEventListener("mouseover", function (e) { var b = e.target.closest(".need__in"); if (b && b !== needsEl._h) { needsEl._h = b; Snd.tick(); speakNeed(+b.getAttribute("data-n")); } });
  needsEl.addEventListener("mouseout", function (e) { if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest(".need__in")) needsEl._h = null; });
  needsEl.addEventListener("focusin", function (e) { var b = e.target.closest(".need__in"); if (b) speakNeed(+b.getAttribute("data-n")); });
  needsEl.addEventListener("click", function (e) { var b = e.target.closest(".need__in"); if (b) speakNeed(+b.getAttribute("data-n")); });

  /* ================= switching industry: the whole world changes ================= */
  function setText(el, text) { el.classList.add("swap"); setTimeout(function () { el.textContent = text; el.classList.remove("swap"); }, 230); }
  function setIndustry(i, fromUser) {
    cur = i; var d = inds[i];
    body.setAttribute("data-w", d.key); var meta = $('meta[name="theme-color"]'); if (meta) meta.setAttribute("content", d.color);
    chipBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-k") === d.key ? "true" : "false"); });
    leads.forEach(function (l) { if (l) setText(l, d.lead); });
    allPpl.forEach(function (p) { p.setAttribute("data-hat", d.hats[+p.getAttribute("data-i")] || "none"); });
    slots.forEach(function (s, k) {
      $("[data-role]", s).textContent = d.roles[k]; $("[data-prop]", s).innerHTML = icons[d.props[k]] || "";
      var p = $(".ppl", s); p.classList.remove("hop"); void p.offsetWidth; p.classList.add("hop");
    });
    renderNeeds(); setDash(i);
    say(coreSay, "Touch a need and I'll tell you more.", 3200);
    if (fromUser) { Snd.whoosh(); say(subiSay, "Welcome to the " + d.name.toLowerCase() + " floor.", 3200, 540); }
    last = -1; setTimeout(act, 700);
  }
  chipBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      userPicked = true; var k = b.getAttribute("data-k"); for (var i = 0; i < inds.length; i++) if (inds[i].key === k) setIndustry(i, true); burstAt(b, 8);
    });
  });
  if (!reduce) setInterval(function () { if (!userPicked && heroVisible && !document.hidden) setIndustry((cur + 1) % inds.length, false); }, 9500);
  if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; }, { threshold: .15 }).observe(hero);

  /* ================= day timeline: Aisha walks as you scroll ================= */
  var day = $("[data-day]"), track = $("[data-track]"), walker = $("[data-walker]"), walkP = $(".ppl", walker), stp = $$(".stp", track), prog = $("[data-prog]"), walkT = 0, seen = {};
  function dayScroll() {
    var r = track.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.max(0, Math.min(1, (vh * .82 - r.top) / (r.height + vh * .3)));
    var wx = 4 + p * 92; walker.style.setProperty("--wx", wx.toFixed(2) + "%"); prog.style.setProperty("--pw", Math.max(0, wx - 2).toFixed(2) + "%");
    stp.forEach(function (s, i) {
      var on = wx >= parseFloat(s.style.getPropertyValue("--l")) - 1.5; s.classList.toggle("on", on);
      if (on && !seen[i]) { seen[i] = 1; setTimeout(i === 5 ? Snd.cash : Snd.ding, 80); }
    });
    walkP.classList.add("walking"); clearTimeout(walkT); walkT = setTimeout(function () { walkP.classList.remove("walking"); }, 160);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ================= try-it demos ================= */
  var play = $("[data-play]"), tabs = $$("[data-tab]", play), panels = $$("[data-panel]", play), sayPlay = $("[data-say-play]"), playP = $(".ppl--play", play);
  function playSay(t) { say(sayPlay, t, 3600, pitch[3]); playP.classList.add("talk"); clearTimeout(playP._t); playP._t = setTimeout(function () { playP.classList.remove("talk"); }, 1400); }
  var tabLines = ["Move the slider, then punch in.", "Pick a leave type. Watch the balance.", "Slide overtime up. See what payroll does."];
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () {
      tabs.forEach(function (x, j) { x.setAttribute("aria-selected", i === j ? "true" : "false"); }); panels.forEach(function (p, j) { p.hidden = i !== j; });
      Snd.tick(); playSay(tabLines[i]);
    });
  });
  // 1 · clock in
  var arr = $("[data-arr]"), arrOut = $("[data-arr-out]"), nowEl = $("[data-clock-now]"), punch = $("[data-punch]"), checks = $$("[data-checks] li"), status = $("[data-status]"), punching = false;
  var hm = function (m) { return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };
  function arrUpdate() { arrOut.textContent = hm(+arr.value); nowEl.textContent = hm(+arr.value); }
  arr.addEventListener("input", arrUpdate); arrUpdate();
  $("[data-punch-btn]").addEventListener("click", function () {
    if (punching) return; punching = true; var m = +arr.value;
    checks.forEach(function (c) { c.className = ""; }); status.textContent = "Checking"; punch.classList.remove("ok"); punch.classList.add("scan"); Snd.whoosh(); playSay("Scanning the face and the place…");
    setTimeout(function () { checks[0].classList.add("on"); Snd.tick(); }, 700);
    setTimeout(function () { checks[1].classList.add("on"); Snd.tick(); }, 1200);
    setTimeout(function () {
      punch.classList.remove("scan"); var cls, txt, line;
      if (m <= 540) { cls = "on"; txt = "On time, " + hm(m); line = "On time. Nice."; punch.classList.add("ok"); Snd.ding(); burstAt(punch, 16); }
      else if (m <= 555) { cls = "on grace"; txt = "Within grace, no deduction"; line = (m - 540) + " minutes late, but inside the grace window."; punch.classList.add("ok"); Snd.pop(); }
      else { cls = "on late"; txt = "Late by " + (m - 540) + " min"; line = "Late by " + (m - 540) + " minutes. The policy applies."; Snd.boop(); }
      status.textContent = txt; checks[2].className = cls; playSay(line); punching = false;
    }, 1900);
  });
  // 2 · leave
  var types = $$("[data-type]", play), typeKey = "paid", days = 2, bal = { paid: 14, comp: 2, emergency: 3 }, max = { paid: 14, comp: 6, emergency: 6 };
  var names = { paid: "Paid leave", unpaid: "Unpaid leave", comp: "Comp-off", emergency: "Emergency leave" };
  var daysEl = $("[data-days]"), balBar = $("[data-bal-bar]"), balTxt = $("[data-bal-txt]"), balLbl = $("[data-bal-lbl]"), flow = $$("[data-flow] li"), lastLi = $("[data-flow-last]"), leaving = false;
  function balUpdate() {
    daysEl.textContent = days; balLbl.textContent = names[typeKey] + " balance";
    if (typeKey === "unpaid") { balBar.style.width = "100%"; balTxt.textContent = "No cap, pay is reduced for these days"; }
    else { balBar.style.width = Math.max(4, bal[typeKey] / max[typeKey] * 100) + "%"; balTxt.textContent = bal[typeKey] + " day" + (bal[typeKey] === 1 ? "" : "s") + " left"; }
  }
  types.forEach(function (b) { b.addEventListener("click", function () { typeKey = b.getAttribute("data-type"); types.forEach(function (x) { x.setAttribute("aria-checked", x === b ? "true" : "false"); }); Snd.tick(); balUpdate(); }); });
  $("[data-dec]").addEventListener("click", function () { days = Math.max(1, days - 1); Snd.tick(); balUpdate(); });
  $("[data-inc]").addEventListener("click", function () { days = Math.min(5, days + 1); Snd.tick(); balUpdate(); });
  $("[data-leave-go]").addEventListener("click", function () {
    if (leaving) return; leaving = true; flow.forEach(function (li) { li.className = ""; }); lastLi.textContent = "Approved"; Snd.whoosh(); playSay("Sending the request…");
    setTimeout(function () { flow[0].classList.add("done"); Snd.tick(); }, 200);
    setTimeout(function () { flow[1].classList.add("done"); Snd.tick(); playSay("Priya has been pinged."); }, 900);
    setTimeout(function () {
      var ok = typeKey === "unpaid" || days <= bal[typeKey];
      flow[2].classList.add("done");
      if (ok) { if (typeKey !== "unpaid") bal[typeKey] -= days; Snd.chime(); burstAt(lastLi, 14); playSay("Approved. " + names[typeKey] + " booked."); balUpdate(); }
      else { lastLi.textContent = "Sent to HR"; flow[2].classList.add("hr"); Snd.boop(); playSay("Not enough " + names[typeKey].toLowerCase() + ", so it goes to HR."); }
      leaving = false;
    }, 1700);
  });
  balUpdate();
  // 3 · payroll
  var oth = $("[data-oth]"), ulv = $("[data-ulv]"), netEl = $("[data-net]");
  function payUpdate() {
    var h = +oth.value, u = +ulv.value, base = 4800, allow = 300, ot = Math.round(base / 160 * 1.5 * h), ded = Math.round(base / 30 * u), net = base + allow + ot - ded;
    $("[data-oth-out]").textContent = h; $("[data-ulv-out]").textContent = u; $("[data-ot-h]").textContent = h; $("[data-ul-d]").textContent = u;
    $("[data-ot-v]").textContent = "+ " + fmt(ot); $("[data-ul-v]").textContent = "- " + fmt(ded); tween(netEl, net, 500);
    $("[data-s1]").style.flex = String(base + allow); $("[data-s2]").style.flex = String(Math.max(ot, 1)); $("[data-s3]").style.flex = String(Math.max(ded, 1));
    $("[data-sent]").textContent = "";
  }
  oth.addEventListener("input", payUpdate); ulv.addEventListener("input", payUpdate); netEl.textContent = "0"; payUpdate();
  oth.addEventListener("change", function () { playSay("Overtime is paid at one and a half times."); Snd.tick(); });
  ulv.addEventListener("change", function () { playSay("Each unpaid day removes one thirtieth of the basic."); Snd.tick(); });
  $("[data-pay-go]").addEventListener("click", function (e) {
    $("[data-sent]").textContent = "412 payslips sent to every phone"; Snd.cash(); burstAt(e.currentTarget, 18); playSay("Payroll done. Nobody typed a thing.");
  });

  /* ================= peek cards ================= */
  $$(".pk").forEach(function (c) {
    c.addEventListener("click", function () { c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") === "true" ? "false" : "true"); Snd.pop(); });
    c.addEventListener("mouseenter", function () { Snd.tick(); });
  });

  setIndustry(0, false);
  say(coreSay, "Touch a need and I'll tell you more.", 5000);
})();
