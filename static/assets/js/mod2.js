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

  /* ---------- nav and back-to-top ---------- */
  var nav = $("[data-nav]"), hero = $("[data-hero]"), top = $("[data-top]");
  function onScroll() { nav.classList.toggle("solid", window.scrollY > 30); nav.classList.toggle("onhero", window.scrollY < hero.offsetHeight - 90); if (top) top.classList.toggle("on", window.scrollY > 900); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (top) top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ---------- hero: the stage scales to the space, and the people act out the module ---------- */
  var stage = $("[data-stage]");
  function fit() { var w = Math.min(hero.clientWidth, 1600) - 112; stage.style.setProperty("--fit", String(Math.max(.55, Math.min(1.28, (w - 440 - 36) / 760)))); }
  fit(); window.addEventListener("resize", fit);
  var slots = $$("[data-slot]", stage), rows = $$("[data-row]", stage), bar = $("[data-bar]", stage), win = $("[data-mwin]", stage);
  var lines = [];
  try { lines = JSON.parse($("#mod-story").textContent); } catch (e) {}
  function say(el, text, ms) { el.textContent = text; el.classList.add("on"); clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove("on"); }, ms || 3000); }
  function talk(p, ms) { p.classList.add("talk"); clearTimeout(p._tt); p._tt = setTimeout(function () { p.classList.remove("talk"); }, ms || 2600); }
  (function story() {
    if (!lines.length) return;
    var i = 0, timer;
    function beat() {
      var k = i % rows.length, who = [1, 0, 2, 1][i % 4], s = slots[who];
      rows.forEach(function (r, n) { r.classList.toggle("done", n < k); r.classList.toggle("now", n === k); });
      if (bar) bar.style.width = ((k + 1) / rows.length * 100) + "%";
      if (s) { say($("[data-say]", s), lines[i % lines.length], 3300); talk($(".ppl", s), 3000); }
      i++;
    }
    vis(stage, function (on) { clearInterval(timer); if (on && !reduce) { beat(); timer = setInterval(beat, 3600); } else if (on) { rows.forEach(function (r) { r.classList.add("done"); }); } });
  })();

  /* ---------- the letter writes itself ---------- */
  (function () {
    var w = $("[data-letter]"); if (!w) return;
    var name = $('[data-in="name"]', w), pos = $('[data-in="pos"]', w), sal = $('[data-in="sal"]', w), date = $('[data-in="date"]', w), send = $("[data-send]", w), tpls = $$("[data-t]", w);
    var title = $("[data-title]", w), body = $("[data-body]", w), paper = $(".mpaper", w), toast = $("[data-toast]", w), dsay = $("[data-dsay]", w), tpl = "offer";
    var fmtD = function (v) { try { return new Date(v + "T00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); } catch (e) { return v; } };
    var tok = function (t) { return '<mark>' + esc(t) + '</mark>'; };
    function render() {
      paper.classList.remove("sent");
      var n = tok(name.value || "Employee"), p = tok(pos.value), s = tok(Number(sal.value || 0).toLocaleString("en-US")), d = tok(fmtD(date.value));
      if (tpl === "offer") { title.textContent = "Offer of employment"; body.innerHTML = "<p>Dear " + n + ",</p><p>We are delighted to offer you the position of " + p + " with a monthly salary of " + s + ", starting " + d + ". Welcome to the team!</p>"; }
      else if (tpl === "exp") { title.textContent = "Experience certificate"; body.innerHTML = "<p>This is to certify that " + n + " has worked with us as " + p + " with a monthly salary of " + s + ". We wish them every success.</p>"; }
      else { title.textContent = "Warning letter"; body.innerHTML = "<p>Dear " + n + ",</p><p>This is a formal reminder about repeated late arrivals in your role as " + p + ". Please review the attendance policy. Effective " + d + ".</p>"; }
    }
    ["input", "change"].forEach(function (ev) { w.addEventListener(ev, function (e) { if (e.target.matches("[data-in]")) render(); }); });
    tpls.forEach(function (b) { b.addEventListener("click", function () { tpl = b.dataset.t; tpls.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); render(); }); });
    function doSend() { paper.classList.add("sent"); toast.classList.add("on"); setTimeout(function () { toast.classList.remove("on"); }, 2200); }
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
        dsay.textContent = "Writing the letter…"; await wait(500); if (!live) break;
        await typeInto(name, p[0]); await wait(400); if (!live) break;
        pos.selectedIndex = p[1]; fire(pos, "change"); await wait(600); if (!live) break;
        sal.value = p[2]; fire(sal, "input"); await wait(900); if (!live) break;
        send.click(); dsay.textContent = "Sent for e-signature ✓"; await wait(2800);
      }
      running = false;
    }
    function takeOver() { taken = true; live = false; clearTimeout(idle); dsay.textContent = "Your turn!"; idle = setTimeout(function () { taken = false; if (shown) { live = true; loop(); } }, 30000); }
    ["pointerdown", "keydown", "focusin"].forEach(function (ev) { w.addEventListener(ev, function (e) { if (e.isTrusted) takeOver(); }); });
    vis(w, function (on) { shown = on; if (on && !taken) { live = true; loop(); } else live = false; }, .35);
  })();

  /* ---------- before / after ---------- */
  (function () {
    var r = $("[data-mba]"); if (!r) return;
    var tabs = $$("[data-s]", r), iv, set = function (s) { r.setAttribute("data-state", s); tabs.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.s === s)); }); };
    tabs.forEach(function (b) { b.addEventListener("click", function () { clearInterval(iv); set(b.dataset.s); }); });
    if (reduce) return;
    vis(r, function (on) { clearInterval(iv); if (on) iv = setInterval(function () { set(r.getAttribute("data-state") === "before" ? "after" : "before"); }, 5200); }, .4);
  })();

  /* ---------- capabilities ---------- */
  (function () {
    var box = $("[data-mcap]"); if (!box) return;
    var items = $$(".mcap__list li", box), card = $("[data-card]", box), t = $("[data-t]", card), d = $("[data-d]", card), ic = $("[data-ic]", card), ppl = $(".mcap__stage .ppl", box), i = 0, timer, hold = false;
    function show(n) {
      i = n % items.length; var li = items[i];
      items.forEach(function (x, k) { x.classList.toggle("on", k === i); });
      card.classList.remove("mpop"); void card.offsetWidth; t.textContent = $("span:last-child", li).textContent; d.textContent = li.getAttribute("data-d") || ""; card.classList.add("mpop");
      if (ppl) { ppl.setAttribute("data-pose", li.getAttribute("data-ps") || "rest"); ppl.setAttribute("data-item", li.getAttribute("data-it") || "none"); ppl.classList.add("talk"); clearTimeout(ppl._t); ppl._t = setTimeout(function () { ppl.classList.remove("talk"); }, 1800); }
    }
    items.forEach(function (li, k) { li.addEventListener("mouseenter", function () { hold = true; show(k); }); li.addEventListener("mouseleave", function () { hold = false; }); li.addEventListener("click", function () { show(k); }); });
    show(0); if (reduce) return;
    vis(box, function (on) { clearInterval(timer); if (on) timer = setInterval(function () { if (!hold) show(i + 1); }, 3200); }, .35);
  })();

  /* ---------- flip cards: same behaviour as the home page ---------- */
  $$(".pk").forEach(function (c) { c.addEventListener("click", function () { c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") === "true" ? "false" : "true"); }); });

  /* ---------- Ask Subi: same chat as the home page, answers come from this module ---------- */
  (function () {
    var faq = data.faq || [], qs = $("[data-qs]"), log = $("[data-log]"), form = $("[data-ask-form]"), input = $("#ask-in"); if (!qs || !faq.length) return;
    qs.innerHTML = faq.slice(0, 7).map(function (f, i) { return '<button type="button" data-q="' + i + '">' + esc(f[0]) + "</button>"; }).join("");
    $$("[data-hq]").forEach(function (b, n) { var f = faq[n]; if (f) b.textContent = f[0]; else b.remove(); });
    function msg(cls, html) { var m = document.createElement("div"); m.className = "msg " + cls; m.innerHTML = html; log.appendChild(m); log.scrollTop = log.scrollHeight; return m; }
    function reply(q, a) { msg("me", esc(q)); var t = msg("bot typing", "<i></i><i></i><i></i>"); setTimeout(function () { t.remove(); msg("bot", a); }, reduce ? 0 : 900 + Math.min(900, a.length * 3)); }
    qs.addEventListener("click", function (e) { var b = e.target.closest("[data-q]"); if (!b) return; $$("button", qs).forEach(function (x) { x.classList.toggle("on", x === b); }); var f = faq[+b.getAttribute("data-q")]; reply(f[0], esc(f[1])); });
    form.addEventListener("submit", function (e) {
      e.preventDefault(); var qq = input.value.trim(); if (!qq) return; input.value = "";
      var words = qq.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(function (w) { return w.length > 3; }), best = null, bs = 0;
      faq.forEach(function (f) { var hay = (f[0] + " " + f[1]).toLowerCase(), s = 0; words.forEach(function (w) { if (hay.indexOf(w) > -1) s++; }); if (s > bs) { bs = s; best = f; } });
      reply(qq, best ? esc(best[1]) : 'I don\'t have a ready answer for that yet. A teammate replies within one business day: <a class="link" href="/contact/">send us your question</a>.');
    });
    document.addEventListener("click", function (e) { var h = e.target.closest && e.target.closest("[data-hq]"); if (h) { var q = $$("[data-q]", qs)[+h.getAttribute("data-hq")]; if (q) q.click(); } });
  })();
})();
