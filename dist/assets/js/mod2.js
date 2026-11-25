/* Module pages: everything plays by itself and stops when the visitor takes over. Built from the same pieces as the home page. */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, reduce ? 0 : ms); }); };
  var vis = function (el, cb, th) { if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { cb(es[0].isIntersecting); }, { threshold: th || .3 }).observe(el); else cb(true); };
  var esc = function (s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); };
  var data = {}; try { data = JSON.parse($("#mod-data").textContent); } catch (e) {}
  var icons = data.icons || {};

  /* ================= sound: a tiny synth, off until the visitor turns it on (same as the home page) ================= */
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
    return {
      set: function (v) { on = v; if (v) ensure(); }, get: function () { return on; },
      tick: function () { tone(1500, .04, "square", .04); }, pop: function () { tone(340, .13, "sine", .16, 0, 780); },
      ding: function () { tone(988, .55, "sine", .15); tone(1480, .75, "sine", .09, .09); },
      chime: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, .5, "triangle", .11, i * .09); }); },
      blip: function (base) { var n = 4 + Math.floor(Math.random() * 4); for (var i = 0; i < n; i++) tone(base * (.85 + Math.random() * .55), .07, "triangle", .06, i * .075); }
    };
  })();
  var sndBtn = $("[data-sound]"), nudge = $("[data-nudge]");
  function setSound(v) {
    Snd.set(v); sndBtn.setAttribute("aria-pressed", v ? "true" : "false"); sndBtn.setAttribute("aria-label", v ? "Turn sound off" : "Turn sound on");
    try { localStorage.setItem("lo-sound", v ? "1" : "0"); localStorage.setItem("lo-nudge", "1"); } catch (e) {}
    nudge.hidden = true; if (v) setTimeout(Snd.ding, 40);
  }
  sndBtn.addEventListener("click", function () { setSound(!Snd.get()); });
  try {
    if (localStorage.getItem("lo-sound") === "1") { var arm = function () { setSound(true); document.removeEventListener("pointerdown", arm); }; document.addEventListener("pointerdown", arm, { once: true }); }
    else if (!localStorage.getItem("lo-nudge") && !reduce) setTimeout(function () { if (!Snd.get()) { nudge.hidden = false; setTimeout(function () { nudge.hidden = true; }, 9000); } }, 7000);
  } catch (e) {}

  /* ================= nav and back-to-top ================= */
  var nav = $("[data-nav]"), hero = $("[data-hero]"), top = $("[data-top]");
  function onScroll() { nav.classList.toggle("solid", window.scrollY > 30); nav.classList.toggle("onhero", window.scrollY < hero.offsetHeight - 90); if (top) top.classList.toggle("on", window.scrollY > 900); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (top) top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ================= speech helpers ================= */
  function say(el, text, ms, voice) { el.textContent = text; el.classList.add("on"); clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove("on"); }, ms || 3000); if (voice) Snd.blip(voice); }
  function talk(p, ms) { if (!p) return; p.classList.add("talk"); clearTimeout(p._tt); p._tt = setTimeout(function () { p.classList.remove("talk"); }, ms || 2600); }

  /* ================= hero: the stage scales to the space, and the people act out the module ================= */
  var stage = $("[data-stage]");
  function fit() { var w = Math.min(hero.clientWidth, 1600) - 112; stage.style.setProperty("--fit", String(Math.max(.5, Math.min(.84, (w - 440 - 36) / 760)))); }
  fit(); window.addEventListener("resize", fit);
  var slots = $$("[data-slot]", stage), rows = $$("[data-row]", stage), bar = $("[data-bar]", stage), pct = $("[data-pct]", stage), lines = [];
  try { lines = JSON.parse($("#mod-story").textContent); } catch (e) {}
  (function story() {
    if (!lines.length) return;
    var i = 0, timer;
    function beat() {
      var k = i % rows.length, who = [1, 0, 2, 1][i % 4], s = slots[who];
      rows.forEach(function (r, n) { r.classList.toggle("done", n < k); r.classList.toggle("now", n === k); });
      var p = Math.round((k + 1) / rows.length * 100); if (bar) bar.style.width = p + "%"; if (pct) pct.textContent = p + "%";
      if (s) { say($("[data-say]", s), lines[i % lines.length], 3300, 420 + who * 60); talk($(".ppl", s), 3000); }
      i++;
    }
    vis(stage, function (on) { clearInterval(timer); if (on && !reduce) { beat(); timer = setInterval(beat, 3600); } else if (on) { rows.forEach(function (r) { r.classList.add("done"); }); if (pct) pct.textContent = "100%"; } });
  })();

  /* ================= the letter writes itself ================= */
  (function () {
    var w = $("[data-letter]"); if (!w) return;
    var name = $('[data-in="name"]', w), pos = $('[data-in="pos"]', w), sal = $('[data-in="sal"]', w), date = $('[data-in="date"]', w), send = $("[data-send]", w), tpls = $$("[data-t]", w);
    var holder = $("[data-hold] .ppl", w); if (holder) { holder.setAttribute("data-pose", "hold"); var hc = $(".chest", holder); if (hc) hc.innerHTML = icons.file || ""; }
    var title = $("[data-title]", w), body = $("[data-body]", w), paper = $(".mpaper", w), toast = $("[data-toast]", w), dsay = $("[data-dsay]", w), tpl = "offer";
    var fmtD = function (v) { try { return new Date(v + "T00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); } catch (e) { return v; } };
    var tok = function (t) { return "<mark>" + esc(t) + "</mark>"; };
    function render() {
      paper.classList.remove("sent");
      var n = tok(name.value || "Employee"), p = tok(pos.value), s = tok(Number(sal.value || 0).toLocaleString("en-US")), d = tok(fmtD(date.value));
      if (tpl === "offer") { title.textContent = "Offer of employment"; body.innerHTML = "<p>Dear " + n + ",</p><p>We are delighted to offer you the position of " + p + " with a monthly salary of " + s + ", starting " + d + ". Welcome to the team!</p>"; }
      else if (tpl === "exp") { title.textContent = "Experience certificate"; body.innerHTML = "<p>This is to certify that " + n + " has worked with us as " + p + " with a monthly salary of " + s + ". We wish them every success.</p>"; }
      else { title.textContent = "Warning letter"; body.innerHTML = "<p>Dear " + n + ",</p><p>This is a formal reminder about repeated late arrivals in your role as " + p + ". Please review the attendance policy. Effective " + d + ".</p>"; }
    }
    ["input", "change"].forEach(function (ev) { w.addEventListener(ev, function (e) { if (e.target.matches("[data-in]")) render(); }); });
    tpls.forEach(function (b) { b.addEventListener("click", function () { tpl = b.dataset.t; tpls.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); render(); }); });
    function doSend() { paper.classList.add("sent"); toast.classList.add("on"); Snd.chime(); setTimeout(function () { toast.classList.remove("on"); }, 2200); }
    send.addEventListener("click", doSend);
    render();
    if (reduce) return;
    var people = [["Sara Nasser", 0, 5200, "offer"], ["Daniel Reed", 1, 4300, "offer"], ["Meera Iyer", 3, 3800, "exp"], ["Omar Haddad", 2, 6100, "warn"]];
    var live = false, running = false, taken = false, shown = false, idle;
    function fire(el, ev) { el.dispatchEvent(new Event(ev, { bubbles: true })); }
    async function typeInto(el, text) { el.value = ""; fire(el, "input"); for (var i = 0; i < text.length; i++) { if (!live) return; el.value = text.slice(0, i + 1); fire(el, "input"); await wait(70); } }
    async function loop() {
      if (running) return; running = true; var k = 0;
      while (live) {
        var p = people[k % people.length]; k++;
        var t = tpls.filter(function (b) { return b.dataset.t === p[3]; })[0]; if (t) t.click();
        dsay.textContent = "Reading my offer…"; await wait(500); if (!live) break;
        await typeInto(name, p[0]); await wait(400); if (!live) break;
        pos.selectedIndex = p[1]; fire(pos, "change"); await wait(600); if (!live) break;
        sal.value = p[2]; fire(sal, "input"); await wait(900); if (!live) break;
        send.click(); dsay.textContent = "Signed. Thank you!"; await wait(2800);
      }
      running = false;
    }
    function takeOver() { taken = true; live = false; clearTimeout(idle); dsay.textContent = "Your turn!"; idle = setTimeout(function () { taken = false; if (shown) { live = true; loop(); } }, 30000); }
    ["pointerdown", "keydown", "focusin"].forEach(function (ev) { w.addEventListener(ev, function (e) { if (e.isTrusted) takeOver(); }); });
    vis(w, function (on) { shown = on; if (on && !taken) { live = true; loop(); } else live = false; }, .35);
  })();

  var mbaApi = null;

  /* ================= capabilities: the person holds the thing in her hands ================= */
  (function () {
    var box = $("[data-mcap]"); if (!box) return;
    var items = $$(".mcap__list li", box), card = $("[data-card]", box), t = $("[data-t]", card), d = $("[data-d]", card), ppl = $(".mcap__stage .ppl", box), chest = ppl && $(".chest", ppl), i = 0, timer, hold = false;
    function show(n) {
      i = n % items.length; var li = items[i];
      items.forEach(function (x, k) { x.classList.toggle("on", k === i); });
      card.classList.remove("mpop"); void card.offsetWidth; t.textContent = $("span:last-child", li).textContent; d.textContent = li.getAttribute("data-d") || ""; card.classList.add("mpop");
      if (ppl) {
        ppl.setAttribute("data-pose", li.getAttribute("data-ps") || "hold");
        if (chest) { chest.classList.remove("swap"); void chest.offsetWidth; chest.innerHTML = icons[li.getAttribute("data-it")] || icons.file || ""; chest.classList.add("swap"); }
        talk(ppl, 1800); Snd.tick();
      }
    }
    items.forEach(function (li, k) { li.addEventListener("mouseenter", function () { hold = true; show(k); }); li.addEventListener("mouseleave", function () { hold = false; }); li.addEventListener("click", function () { show(k); }); });
    show(0); if (reduce) return;
    vis(box, function (on) { clearInterval(timer); if (on) timer = setInterval(function () { if (!hold) show(i + 1); }, 3200); }, .35);
  })();

  /* ================= Ask Subi: same chat as the home page, answers come from this module ================= */
  (function () {
    var faq = data.faq || [], qs = $("[data-qs]"), log = $("[data-log]"), form = $("[data-ask-form]"), input = $("#ask-in"); if (!qs || !faq.length) return;
    qs.innerHTML = faq.slice(0, 7).map(function (f, i) { return '<button type="button" data-q="' + i + '">' + esc(f[0]) + "</button>"; }).join("");
    $$("[data-hq]").forEach(function (b, n) { var f = faq[n]; if (f) b.textContent = f[0]; else b.remove(); });
    function msg(cls, html) { var m = document.createElement("div"); m.className = "msg " + cls; m.innerHTML = html; log.appendChild(m); log.scrollTop = log.scrollHeight; return m; }
    function reply(q, a) { msg("me", esc(q)); Snd.pop(); var t = msg("bot typing", "<i></i><i></i><i></i>"); setTimeout(function () { t.remove(); msg("bot", a); Snd.blip(300); }, reduce ? 0 : 900 + Math.min(900, a.length * 3)); }
    qs.addEventListener("click", function (e) { var b = e.target.closest("[data-q]"); if (!b) return; $$("button", qs).forEach(function (x) { x.classList.toggle("on", x === b); }); var f = faq[+b.getAttribute("data-q")]; reply(f[0], esc(f[1])); });
    form.addEventListener("submit", function (e) {
      e.preventDefault(); var qq = input.value.trim(); if (!qq) return; input.value = "";
      var words = qq.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(function (w) { return w.length > 3; }), best = null, bs = 0;
      faq.forEach(function (f) { var hay = (f[0] + " " + f[1]).toLowerCase(), s = 0; words.forEach(function (w) { if (hay.indexOf(w) > -1) s++; }); if (s > bs) { bs = s; best = f; } });
      reply(qq, best ? esc(best[1]) : 'I don\'t have a ready answer for that yet. A teammate replies within one business day: <a class="link" href="/contact/">send us your question</a>.');
    });
    document.addEventListener("click", function (e) { var h = e.target.closest && e.target.closest("[data-hq]"); if (h) { var q = $$("[data-q]", qs)[+h.getAttribute("data-hq")]; if (q) q.click(); } });
  })();

  /* ================= Subi, the page guide: the same floating robot as the home page ================= */
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
  var tipped = {};
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { var el = e.target; if (e.isIntersecting && !tipped[el.className] && !gBusy && gMenu.hidden) { tipped[el.className] = 1; setTimeout(function () { if (!gBusy && gMenu.hidden) guideSay(el.getAttribute("data-tip"), 4800); }, 700); } }); }, { threshold: .45 });
    $$("[data-tip]").forEach(function (s) { if (s !== hero) io.observe(s); });
  }
  if (!reduce) setTimeout(function () { guideSay("Hi, I'm Subi. Click me and I'll show you around this page.", 5200); }, 2600);
  function settle() { return new Promise(function (res) { var last = -1, n = 0, t0 = Date.now(); (function f() { var y = window.scrollY; if (Math.abs(y - last) < 1) n++; else n = 0; last = y; if (n >= 8 || Date.now() - t0 > 3200) res(); else requestAnimationFrame(f); })(); }); }
  function toEl(el, block) { el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: block || "center" }); return wait(150).then(settle).then(function () { return wait(150); }); }
  function flyTo(el, fx, fy) { var r = el.getBoundingClientRect(); if (!r.width && !r.height) return wait(100); gFly = true; gPlace(Math.max(8, Math.min(window.innerWidth - 80, r.left + r.width * fx)), Math.max(70, Math.min(window.innerHeight - 140, r.top + r.height * fy))); return wait(1100); }
  async function finish(text) { await wait(1500); guideSay(text, 3600); await wait(900); gHome(); await wait(1000); gBusy = false; }
  var shows = {
    try: async function () { var el = $("[data-letter]"); await toEl(el, "center"); await flyTo(el, .96, .1); guideSay("Watch the letter write itself. Or type your own.", 3600); await finish("Every field fills the letter. One click sends it."); },
    ba: async function () { var el = $("[data-mba]"); await toEl(el, "center"); await flyTo($(".mba__scene", el), .5, .12); guideSay("Watch her call Subi HR.", 2400); if (mbaApi) mbaApi.play(); await wait(3200); await finish("One call, and the record is found."); },
    cap: async function () { var el = $("[data-mcap]"); await toEl(el, "center"); await flyTo($(".mcap__stage", el), .85, .15); guideSay("Each tile is something it does. Hover one.", 3600); await finish("Sixteen jobs, one record."); },
    ask: async function () { var el = $("[data-ask]"); await toEl(el, "center"); await flyTo($(".chat", el), .92, .1); guideSay("Ask me anything. I answer from this module.", 3600); await finish("A real person follows up within a day."); }
  };
  $$("[data-show]", gMenu).forEach(function (b) { b.addEventListener("click", async function () { menu(false); if (gBusy) return; gBusy = true; var f = shows[b.getAttribute("data-show")]; try { if (f) await f(); } catch (e) {} gBusy = false; }); });

  /* ================= before / after: the floating Subi flies over, listens, fixes it, and she relaxes ================= */
  (function () {
    var r = $("[data-mba]"); if (!r) return;
    var tabs = $$("[data-s]", r), bsay = $("[data-bsay]", r), scene = $(".mba__scene", r), lady = $(".mba__lady .ppl", r), auto = true, token = 0, shown = false;
    var lines = { before: "Where is that file again?", fix: "Oh, thank you!", after: "Found it. One click." };
    function set(step) {
      r.setAttribute("data-state", step === "after" ? "after" : "before"); r.setAttribute("data-step", step);
      tabs.forEach(function (b) { b.setAttribute("aria-pressed", String(step === "after" ? b.dataset.s === "after" : b.dataset.s === "before")); });
      bsay.textContent = lines[step] || lines.before;
      if (lady) { lady.setAttribute("data-pose", step === "after" ? "wave" : "rest"); lady.classList.toggle("ppl--wave", step === "after"); talk(lady, 2400); }
      if (step === "after") Snd.chime();
    }
    function alive(t) { return t === token; }
    async function play(manual) {
      var t = ++token;
      if (gBusy && !manual) return;
      gBusy = true; menu(false); set("before"); await wait(500); if (!alive(t)) return;
      await flyTo(scene, .86, .08); if (!alive(t)) return;
      guideSay("Hi, I'm Subi. What's the trouble?", 2600); await wait(1900); if (!alive(t)) return;
      bsay.textContent = "Where is that file again?"; talk(lady, 2000); await wait(2300); if (!alive(t)) return;
      await flyTo(scene, .47, .52); if (!alive(t)) return;
      set("fix"); guideSay("Let me find it. One moment…", 2200); await wait(2300); if (!alive(t)) return;
      set("after"); guideSay("Found it. Everything is on her record now.", 3000); await wait(3400); if (!alive(t)) return;
      gHome(); await wait(900); gBusy = false;
    }
    tabs.forEach(function (b) { b.addEventListener("click", function () { auto = false; token++; if (b.dataset.s === "after") { gBusy = false; play(true); } else { set("before"); if (gBusy) { gHome(); gBusy = false; } } }); });
    mbaApi = { play: function () { auto = false; return play(true); } };
    if (reduce) { set("after"); return; }
    var loopTimer;
    function cycle() { clearTimeout(loopTimer); if (!auto || !shown) return; play(false).then(function () { loopTimer = setTimeout(function () { if (auto && shown) { set("before"); loopTimer = setTimeout(cycle, 2600); } }, 5200); }); }
    vis(r, function (on) { shown = on; if (on && auto) { setTimeout(cycle, 900); } else { clearTimeout(loopTimer); if (!on && gBusy && auto) { token++; gHome(); gBusy = false; } } }, .5);
  })();

  /* ================= closing band: pick a time ================= */
  (function () {
    var box = $("[data-bk]"); if (!box) return;
    var dayBox = $("[data-days]", box), times = $$("[data-time]", box), go = $("[data-go]", box), say = $(".mbk__say"), ppl = $("[data-bkppl] .ppl"), chest = ppl && $(".chest", ppl);
    var now = new Date(), days = [], d = new Date(now);
    while (days.length < 5) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d)); }
    dayBox.innerHTML = days.map(function (x, i) { return '<button type="button" data-day="' + i + '" aria-pressed="' + (i === 0) + '">' + x.toLocaleDateString("en", { weekday: "short" }) + "<strong>" + x.getDate() + "</strong></button>"; }).join("");
    if (ppl) { ppl.setAttribute("data-pose", "hold"); if (chest) chest.innerHTML = icons.calendar || ""; }
    var dayBtns = $$("[data-day]", box), di = 0, ti = 1, timer, user = false;
    function paint() {
      dayBtns.forEach(function (b, i) { b.setAttribute("aria-pressed", String(i === di)); }); times.forEach(function (b, i) { b.setAttribute("aria-pressed", String(i === ti)); });
      var dd = days[di], label = dd.toLocaleDateString("en", { weekday: "short", day: "numeric", month: "short" }) + ", " + times[ti].dataset.time;
      if (say) say.textContent = "See you " + label + "!"; go.setAttribute("href", go.getAttribute("href").split("&slot=")[0] + "&slot=" + encodeURIComponent(label));
    }
    dayBtns.forEach(function (b, i) { b.addEventListener("click", function () { user = true; di = i; paint(); Snd.tick(); }); });
    times.forEach(function (b, i) { b.addEventListener("click", function () { user = true; ti = i; paint(); Snd.tick(); }); });
    paint(); if (reduce) return;
    vis(box, function (on) { clearInterval(timer); if (on && !user) timer = setInterval(function () { if (user) return; ti = (ti + 1) % times.length; if (ti === 0) di = (di + 1) % days.length; paint(); }, 2400); }, .4);
  })();
})();
