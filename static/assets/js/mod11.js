/* The home page phone walkthrough and the one-day walk, reused on the module pages. */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var Snd = new Proxy({}, { get: function (_, k) { return function () { var s = window.SHRSnd; if (s && s[k]) try { s[k].apply(s, arguments); } catch (e) {} }; } });
  function vis(el, cb, th) { if (!("IntersectionObserver" in window)) { cb(true); return; } new IntersectionObserver(function (es) { cb(es[0].isIntersecting); }, { threshold: th || .3 }).observe(el); }
  function say(el, text, ms) { el.textContent = text; el.classList.add("on"); clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove("on"); }, ms || 2600); }
  function talk(p, ms) { p.classList.add("talk"); clearTimeout(p._tt); p._tt = setTimeout(function () { p.classList.remove("talk"); }, ms || 1500); }

  /* ================= phone movie ================= */
  var movie = $("[data-movie]");
  if (movie) (function () {
    var mSteps = $$("[data-go]", movie), mScr = $$(".mscr", movie), mScreen = $(".mscreen", movie), tap = $("[data-tap]", movie), mSay = $("[data-say-movie]", movie), mWho = $(".ppl--movie", movie), mBar = $("[data-mbar]", movie), mTabs = $$("[data-mtab] span", movie);
    var mi = 0, mT = [], mVis = false, mAuto = null, MDUR = 4000, N = 8, tabOf = [-1, -1, 0, 1, 2, 3, 0, 4];
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
      say(mSay, mLines[i], 3000); talk(mWho, 1400);
      if (i === 0) { var t = $("[data-mtype]", scr), s = "EMP-0142"; t.textContent = ""; for (var k = 1; k <= s.length; k++) (function (n) { mLater(function () { t.textContent = s.slice(0, n); Snd.tick(); }, 500 + n * 130); })(k); mLater(function () { tapOn($("[data-mbtn]", scr)); }, 2000); }
      if (i === 1) {
        var boxes = $$("[data-motp] span", scr), dgs = ["4", "8", "2", "6"], rs = $("[data-mresend]", scr);
        boxes.forEach(function (b) { b.textContent = ""; b.classList.remove("f"); });
        boxes.forEach(function (b, k) { mLater(function () { b.textContent = dgs[k]; b.classList.add("f"); var key = $('[data-k="' + dgs[k] + '"]', scr); key.classList.add("hit"); setTimeout(function () { key.classList.remove("hit"); }, 220); Snd.tick(); }, 500 + k * 380); });
        for (var c = 0; c < 4; c++) (function (n) { mLater(function () { rs.textContent = "0:" + String(24 - n * 5).padStart(2, "0"); }, n * 1000); })(c);
        mLater(function () { tapOn($("[data-mbtn]", scr)); }, 2500);
      }
      if (i === 2) { mLater(function () { tapOn($("[data-mbtn]", scr)); }, 1900); }
      if (i === 3) { var sc = $("[data-mscan]", scr), lb = $("[data-mclock]", scr), pi = $("[data-mpin]", scr); sc.classList.remove("scan", "ok"); lb.textContent = "Hold to clock in"; pi.textContent = "--:--"; mLater(function () { sc.classList.add("scan"); Snd.whoosh(); lb.textContent = "Scanning..."; }, 700); mLater(function () { sc.classList.remove("scan"); sc.classList.add("ok"); lb.textContent = "Clocked in at 08:52"; pi.textContent = "08:52"; Snd.ding(); }, 2300); }
      if (i === 4) { $$(".sel", scr).forEach(function (c) { c.classList.remove("sel"); }); $("[data-msum]", scr).textContent = "Pick your dates"; [23, 24].forEach(function (d, k) { mLater(function () { $('[data-d="' + d + '"]', scr).classList.add("sel"); Snd.tick(); if (k === 1) $("[data-msum]", scr).textContent = "2 working days"; }, 900 + k * 500); }); mLater(function () { tapOn($("[data-mbtn]", scr)); }, 2400); }
      if (i === 5) { mLater(function () { Snd.cash(); }, 1500); }
      if (i === 6) { mLater(function () { tapOn($(".mswap em", scr)); }, 1800); }
      if (i === 7) { mLater(function () { Snd.ding(); }, 600); }
    }
    function mNext() { mGo((mi + 1) % N); }
    function mAutoStart() { clearInterval(mAuto); if (!reduce) mAuto = setInterval(function () { if (mVis && !document.hidden) mNext(); }, MDUR); }
    mSteps.forEach(function (b) { b.addEventListener("click", function () { mGo(+b.getAttribute("data-go")); mAutoStart(); }); });
    vis(movie, function (v) { mVis = v; if (v && !mScr[0]._started) { mScr[0]._started = 1; mGo(0); mAutoStart(); } }, .3);
  })();

  /* ================= one day: Aisha walks and stops at each moment ================= */
  var day = $("[data-day]");
  if (day) (function () {
    var walker = $("[data-walker]"), walkP = $(".ppl", walker), prog = $("[data-prog]"), stp = $$(".stp", day);
    if (!walker || !prog) return;
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
          else { wk.x = goal; wSet(); stp[wk.k].classList.add("on"); Snd[wk.k === stp.length - 1 ? "cash" : "ding"](); wk.k++; wk.pause = wk.k >= stp.length ? 3 : 1.7; }
        }
        walkP.classList.toggle("walking", wk.walking);
      } else walkP.classList.remove("walking");
      requestAnimationFrame(wLoop);
    })(0);
    if (reduce) { stp.forEach(function (s) { s.classList.add("on"); }); wk.x = 92; wSet(); }
  })();
})();
