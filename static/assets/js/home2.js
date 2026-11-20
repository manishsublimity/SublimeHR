/* SublimeHR — Home design option B: "Glass Universe" (non-3D interactions) */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var top = $("[data-top]");

  /* ---------- hero ticker (live events) ---------- */
  var tick = $("[data-tick]"), events = ["Aisha clocked in · 08:52", "Leave approved · Omar · 2 days", "Payroll ready · 412 employees", "Shift swap · Ravi ⇄ Karan", "Visitor checked in · John D.", "Sara downloaded her payslip"], ei = 0;
  if (tick && !reduce) setInterval(function () { ei = (ei + 1) % events.length; tick.classList.remove("in"); void tick.offsetWidth; tick.textContent = events[ei]; tick.classList.add("in"); }, 2600);

  /* ---------- 3D laptop + phone (scroll-driven, auto-playing screen) ---------- */
  var see = $("[data-see]"), dev = $("[data-dev]"), lid = $("[data-lid]"), phone = $("[data-phone]");
  var cap = $("[data-cap]"), capsub = $("[data-capsub]"), steps = $$(".steps li");
  var caps = [["Open it up.", "Admins run everything from the web. Employees do the rest from their phone — and both stay perfectly in sync."],
              ["It runs itself.", "Attendance, leave, payroll and reports update live — the screen you see is cycling through them on its own."],
              ["Phone in hand.", "When Sara taps Clock in on her phone, the admin screen updates in the same second."]];
  var stage = -1;
  function seeScroll() {
    if (!see) return;
    var r = see.getBoundingClientRect(), total = r.height - window.innerHeight;
    var p = clamp(-r.top / total, 0, 1);
    var open = reduce ? 1 : clamp(p / .3, 0, 1);
    var e = 1 - Math.pow(1 - open, 3);
    lid.style.transform = "rotateX(" + (-92 + e * 84) + "deg)";
    var turn = clamp((p - .1) / .5, 0, 1);
    dev.style.transform = "rotateX(" + (18 - turn * 10) + "deg) rotateY(" + (-28 + turn * 22) + "deg) scale(" + (.86 + turn * .14) + ")";
    var ph = clamp((p - .55) / .25, 0, 1);
    phone.style.opacity = String(ph); phone.style.transform = "translate3d(" + (120 - ph * 120) + "px," + (40 - ph * 40) + "px, 60px) rotateY(-14deg)";
    var s = p < .33 ? 0 : p < .62 ? 1 : 2;
    if (s !== stage) { stage = s; cap.textContent = caps[s][0]; capsub.textContent = caps[s][1]; steps.forEach(function (li, i) { li.classList.toggle("on", i <= s); }); cap.classList.remove("swap"); void cap.offsetWidth; cap.classList.add("swap"); }
  }
  /* the screen cycles through modules automatically */
  var tabs = $$("[data-t]"), panels = $$("[data-p]"), cur = 0;
  function showTab(i) { cur = i; tabs.forEach(function (t, j) { t.classList.toggle("on", j === i); }); panels.forEach(function (p, j) { p.classList.toggle("on", j === i); }); }
  if (tabs.length && !reduce) setInterval(function () { showTab((cur + 1) % tabs.length); }, 3000);
  tabs.forEach(function (t, i) { t.addEventListener("click", function () { showTab(i); }); });
  /* phone clocks in → admin screen syncs */
  var phbtn = $("[data-phbtn]"), phlabel = $("[data-phlabel]"), toast = $("[data-toast]"), present = $("[data-present]"), feed = $("[data-feed]");
  function syncLoop() {
    if (!phbtn) return;
    phbtn.classList.add("press"); phlabel.textContent = "Verifying…";
    setTimeout(function () {
      phbtn.classList.remove("press"); phbtn.classList.add("done"); phlabel.textContent = "Clocked in ✓";
      showTab(0);
      toast.classList.add("in");
      present.textContent = String(+present.textContent + 1);
      var li = document.createElement("div"); li.className = "li new"; li.innerHTML = '<i style="--c:#8C7CF0">SN</i><span>Sara clocked in · Mobile</span><em>09:03</em>';
      feed.insertBefore(li, feed.firstChild); if (feed.children.length > 3) feed.removeChild(feed.lastChild);
      setTimeout(function () { toast.classList.remove("in"); phbtn.classList.remove("done"); phlabel.textContent = "Clock in"; present.textContent = String(+present.textContent - 1); }, 4200);
    }, 1200);
  }
  if (phone && !reduce) setInterval(function () { if (stage === 2) syncLoop(); }, 6500);
  if (phbtn) phbtn.addEventListener("click", syncLoop);

  /* ---------- "Just ask" command demo ---------- */
  var cmd = $("[data-cmd]");
  if (cmd) {
    var txt = $("[data-cmd-text]", cmd), out = $("[data-cmd-out]", cmd), btns = $$("[data-ask]", cmd), busy = false, ran = false;
    var row = function (av, c, b, s, tag, cls, delay) { return '<div class="row" style="animation-delay:' + (delay || 0) + 'ms"><i class="av" style="--c:' + c + '">' + av + '</i><span><b>' + b + '</b><small>' + s + '</small></span>' + (tag ? '<em class="tag ' + (cls || "") + '">' + tag + '</em>' : '') + '</div>'; };
    var R = {
      approve: function () {
        out.innerHTML = '<div class="res"><div class="res__h">Leave request<small>just now</small></div>' + row("OM", "#8C7CF0", "Omar M. · Annual leave", "23–24 Apr · balance 14 → 12 days", "Pending", "", 0) + row("✓", "#46D3C7", "Calendar checked", "No clashes in Omar's team", "Clear", "ok", 250) + '</div>';
        setTimeout(function () { var t = $(".tag", out); if (t) { t.textContent = "Approved ✓"; t.className = "tag ok"; } out.firstChild.insertAdjacentHTML("beforeend", row("↗", "#4C8FE0", "Omar notified", "Push notification sent to the app", "", "", 0)); }, 1100);
      },
      late: function () { out.innerHTML = '<div class="res"><div class="res__h">Late arrivals today<small>shift 09:00 · 15 min grace</small></div>' + row("PS", "#F29C7B", "Priya S.", "Clocked in 09:12 · mobile · field", "Grace", "ok", 0) + row("RV", "#4C8FE0", "Ravi V.", "Clocked in 09:31 · biometric · Plant 2", "Late 31 min", "warn", 200) + row("✓", "#46D3C7", "Auto-flagged", "Managers notified · penalty rules applied", "", "", 400) + '</div>'; },
      payroll: function () {
        out.innerHTML = '<div class="res"><div class="res__h">March payroll · 412 employees<small data-pct>0%</small></div><div class="prog"><i data-bar></i></div>' + row("Σ", "#4C8FE0", "Gross 1,284,600", "Overtime 42,180 · deductions −96,420", "", "", 200) + '</div>';
        var bar = $("[data-bar]", out), pct = $("[data-pct]", out), t0 = performance.now();
        requestAnimationFrame(function () { bar.style.width = "100%"; });
        (function f(t) { var q = Math.min(1, (t - t0) / 2000); pct.textContent = Math.round(q * 100) + "%"; if (q < 1) requestAnimationFrame(f); else out.firstChild.insertAdjacentHTML("beforeend", row("✓", "#46D3C7", "412 payslips sent", "Branded PDFs delivered to every phone", "Done", "ok", 0)); })(t0);
      },
      headcount: function () {
        var data = [["Dubai", 168], ["Riyadh", 124], ["Jaipur", 86], ["Remote", 34]];
        out.innerHTML = '<div class="res"><div class="res__h">Headcount by branch<small>412 total</small></div><div class="hbars">' + data.map(function (d) { return '<div><span>' + d[0] + '</span><i data-w="' + (d[1] / 168 * 100) + '"></i><b>' + d[1] + '</b></div>'; }).join("") + '</div></div>';
        requestAnimationFrame(function () { requestAnimationFrame(function () { $$("[data-w]", out).forEach(function (i, k) { setTimeout(function () { i.style.width = i.getAttribute("data-w") + "%"; }, k * 120); }); }); });
      }
    };
    var run = function (key) {
      if (busy) return; busy = true;
      var b = $('[data-ask="' + key + '"]', cmd), s = b.textContent, i = 0;
      btns.forEach(function (x) { x.classList.toggle("on", x === b); });
      (function type() { if (i <= s.length) { txt.textContent = s.slice(0, i++); setTimeout(type, reduce ? 0 : 26); } else { R[key](); setTimeout(function () { busy = false; }, 600); } })();
    };
    btns.forEach(function (b) { b.addEventListener("click", function () { run(b.getAttribute("data-ask")); }); });
    var autoRun = function () { if (ran) return; if (cmd.getBoundingClientRect().top < window.innerHeight * .7) { ran = true; setTimeout(function () { run("approve"); }, 400); } };
    window.addEventListener("scroll", autoRun, { passive: true }); autoRun();
  }

  /* ---------- Module orbit: front-facing ellipse, depth-sorted, auto-spin + drag ---------- */
  var orb = $("[data-orbit]");
  if (orb) {
    var planets = $$("[data-planet]", orb), n = planets.length, ang = 0, vel = reduce ? 0 : .0035, dragging = false, lx = 0, moved = 0, hover = false;
    function place() {
      var w = orb.clientWidth, h = orb.clientHeight, rx = Math.min(w * .36, 480), ry = h * .3;
      planets.forEach(function (p, i) {
        var a = ang + i / n * Math.PI * 2, z = Math.sin(a);             // z: -1 (back) .. 1 (front)
        var x = Math.cos(a) * rx, y = z * ry * .55 + ry * .1, s = .62 + (z + 1) * .26;
        p.style.transform = "translate(-50%,-50%) translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) scale(" + s.toFixed(3) + ")";
        p.style.zIndex = String(Math.round((z + 1) * 50));
        p.style.opacity = String(.35 + (z + 1) * .325);
        p.style.filter = z < -.2 ? "blur(" + ((-z - .2) * 3).toFixed(1) + "px)" : "none";
        p.classList.toggle("front", z > .85);
      });
    }
    orb.addEventListener("pointerdown", function (e) { dragging = true; lx = e.clientX; moved = 0; orb.setPointerCapture(e.pointerId); });
    orb.addEventListener("pointermove", function (e) { if (!dragging) return; var dx = e.clientX - lx; lx = e.clientX; moved += Math.abs(dx); ang += dx * .006; vel = dx * .0008; });
    var stop = function () { dragging = false; };
    orb.addEventListener("pointerup", stop); orb.addEventListener("pointercancel", stop);
    orb.addEventListener("click", function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    planets.forEach(function (p) { p.addEventListener("mouseenter", function () { hover = true; }); p.addEventListener("mouseleave", function () { hover = false; }); });
    (function loop() {
      requestAnimationFrame(loop);
      var r = orb.getBoundingClientRect(); if (r.bottom < 0 || r.top > window.innerHeight) return;
      if (!dragging) { var base = reduce || hover ? 0 : .0035; vel += (base - vel) * .04; ang += vel; }
      place();
    })();
    place();
  }

  /* ---------- counters ---------- */
  var cnts = $$("[data-cnt]");
  function counts() {
    cnts = cnts.filter(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight * .92) return true;
      var to = +el.getAttribute("data-cnt"), t0 = null;
      if (reduce) { el.textContent = to; return false; }
      requestAnimationFrame(function f(t) { if (t0 === null) t0 = t; var q = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - q, 3))); if (q < 1) requestAnimationFrame(f); });
      return false;
    });
  }

  /* ---------- CTA starfield ---------- */
  var sc = $("[data-stars]");
  if (sc) {
    var sx = sc.getContext("2d"), SW, SH, stars = [];
    var sl = function () { var r = sc.getBoundingClientRect(); SW = r.width; SH = r.height; sc.width = SW; sc.height = SH; stars = Array.from({ length: Math.round(SW * SH / 5000) }, function () { return { x: Math.random() * SW, y: Math.random() * SH, r: Math.random() * 1.3 + .2, p: Math.random() * 6.3, v: Math.random() * .15 + .03 }; }); };
    sl(); window.addEventListener("resize", sl);
    (function tw(time) {
      requestAnimationFrame(tw);
      var r = sc.getBoundingClientRect(); if (r.bottom < 0 || r.top > window.innerHeight) return;
      sx.clearRect(0, 0, SW, SH);
      stars.forEach(function (s) { s.y -= reduce ? 0 : s.v; if (s.y < 0) s.y = SH; sx.fillStyle = "rgba(190,230,255," + (.35 + .65 * Math.abs(Math.sin(time / 1400 + s.p))) + ")"; sx.beginPath(); sx.arc(s.x, s.y, s.r, 0, 6.3); sx.fill(); });
    })(0);
  }

  /* ---------- scroll hub ---------- */
  function onScroll() { if (top) top.classList.toggle("solid", window.scrollY > 40); seeScroll(); counts(); }
  window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll); onScroll();

  var y = $("[data-y]"); if (y) y.textContent = new Date().getFullYear();
})();
