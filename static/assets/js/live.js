/* Live demos for the inner pages: everything plays by itself, and stops as soon as the visitor takes over. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  /* run a loop only while its element is on screen and nobody is using it */
  function whenVisible(el, start, stop) {
    if (!("IntersectionObserver" in window)) { start(); return; }
    new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) start(); else if (stop) stop(); }); }, { threshold: .35 }).observe(el);
  }

  /* ---------- letter generator types a new letter by itself ---------- */
  $$('[data-w="letter"]').forEach(function (w) {
    if (reduce) return;
    var name = $('[data-in="name"]', w), pos = $('[data-in="pos"]', w), sal = $('[data-in="sal"]', w), send = $("[data-send]", w), tpls = $$("[data-t]", w);
    var people = [["Sara Nasser", 0, 5200, "offer"], ["Daniel Reed", 1, 4300, "offer"], ["Meera Iyer", 3, 3800, "exp"], ["Omar Haddad", 2, 6100, "offer"]];
    var live = false, running = false, taken = false, idle;
    function fire(el, ev) { el.dispatchEvent(new Event(ev, { bubbles: true })); }
    async function typeInto(el, text) { el.value = ""; fire(el, "input"); for (var i = 0; i < text.length; i++) { if (!live) return; el.value = text.slice(0, i + 1); fire(el, "input"); await wait(70); } }
    async function loop() {
      if (running) return; running = true; var k = 0;
      while (live) {
        var p = people[k % people.length]; k++;
        var t = tpls.filter(function (b) { return b.dataset.t === p[3]; })[0]; if (t) t.click();
        await wait(600); if (!live) break;
        await typeInto(name, p[0]); await wait(450); if (!live) break;
        pos.selectedIndex = p[1]; fire(pos, "change"); await wait(650); if (!live) break;
        sal.value = p[2]; fire(sal, "input"); await wait(1100); if (!live) break;
        send.click(); await wait(2600);
      }
      running = false;
    }
    function go() { if (!taken) { live = true; loop(); } }
    function stop() { live = false; }
    function takeOver() { taken = true; live = false; clearTimeout(idle); idle = setTimeout(function () { taken = false; if (visible) go(); }, 30000); }
    var visible = false;
    ["pointerdown", "keydown", "focusin"].forEach(function (ev) { w.addEventListener(ev, function (e) { if (e.isTrusted) takeOver(); }); });
    whenVisible(w, function () { visible = true; go(); }, function () { visible = false; stop(); });
  });

  /* ---------- capability spotlight ---------- */
  $$("[data-capx]").forEach(function (box) {
    var items = $$(".capx__list li", box), say = $("[data-say]", box), ppl = $(".ppl", box), i = 0, timer, hold = false;
    function show(n) {
      i = n % items.length; items.forEach(function (li, k) { li.classList.toggle("on", k === i); });
      var txt = $("span:last-child", items[i]).textContent; say.classList.remove("pop"); void say.offsetWidth; say.textContent = txt; say.classList.add("pop");
      if (ppl) { ppl.classList.add("talk"); clearTimeout(ppl._t); ppl._t = setTimeout(function () { ppl.classList.remove("talk"); }, 1500); }
    }
    items.forEach(function (li, k) { li.addEventListener("mouseenter", function () { hold = true; show(k); }); li.addEventListener("mouseleave", function () { hold = false; }); li.addEventListener("click", function () { show(k); }); });
    if (reduce) return;
    whenVisible(box, function () { clearInterval(timer); timer = setInterval(function () { if (!hold) show(i + 1); }, 2400); }, function () { clearInterval(timer); });
  });

  /* ---------- scenario cards turn over one after another ---------- */
  $$("[data-flipx]").forEach(function (box) {
    var cards = $$(".fcard", box), k = 0, timer, hold = false;
    cards.forEach(function (c) { c.addEventListener("click", function () { var on = c.classList.toggle("is-flip"); c.setAttribute("aria-pressed", String(on)); }); c.addEventListener("mouseenter", function () { hold = true; }); c.addEventListener("mouseleave", function () { hold = false; }); });
    if (reduce) return;
    function step() { if (hold) return; cards.forEach(function (c, n) { c.classList.toggle("is-flip", n === k % cards.length); }); k++; }
    whenVisible(box, function () { step(); clearInterval(timer); timer = setInterval(step, 3400); }, function () { clearInterval(timer); });
  });

  /* ---------- Subi asks itself questions until the visitor types ---------- */
  $$(".faqx").forEach(function (box) {
    var chat = $('[data-w="chat"]', box); if (!chat) return;
    var qs = $$(".chat__q", chat).filter(function (b) { return !b.hidden; }), n = 0, timer, taken = false;
    $$("[data-pq]", chat).forEach(function (b) { b.addEventListener("click", function () { var t = qs[+b.dataset.pq]; if (t) t.click(); taken = true; }); });
    ["pointerdown", "keydown", "focusin"].forEach(function (ev) { chat.addEventListener(ev, function (e) { if (e.isTrusted) { taken = true; clearInterval(timer); } }); });
    if (reduce || !qs.length) return;
    function next() { if (taken) return; var q = qs[n % qs.length]; n++; var log = $("[data-log]", chat); q.click(); if (log) log.scrollTop = log.scrollHeight; }
    whenVisible(chat, function () { if (taken) return; clearInterval(timer); setTimeout(function () { if (!taken) next(); }, 900); timer = setInterval(next, 7000); }, function () { clearInterval(timer); });
  });
})();
