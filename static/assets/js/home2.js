/* SublimeHR — Home design option B: "Living Workforce" engine */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  var rand = Math.random, PI2 = Math.PI * 2;
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };

  /* ---------------- Decode (signal) text effect ---------------- */
  var GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&+=/<>";
  function decode(el) {
    if (reduce || el._busy) return;
    if (!el._nodes) {
      el._nodes = [];
      (function walk(n) { n.childNodes.forEach(function (c) { if (c.nodeType === 3) el._nodes.push([c, c.textContent]); else walk(c); }); })(el);
    }
    el._busy = true;
    var t0 = performance.now(), dur = 900;
    (function step(t) {
      var p = Math.min(1, (t - t0) / dur);
      el._nodes.forEach(function (pair) {
        var orig = pair[1], out = "";
        for (var i = 0; i < orig.length; i++) {
          var ch = orig[i];
          out += (ch === " " || i / orig.length < p * 1.15 - .15) ? ch : GLYPHS[(rand() * GLYPHS.length) | 0];
        }
        pair[0].textContent = out;
      });
      if (p < 1) requestAnimationFrame(step); else { el._nodes.forEach(function (pair) { pair[0].textContent = pair[1]; }); el._busy = false; }
    })(t0);
  }

  /* ---------------- Shape library (sampled from offscreen drawings) ---------------- */
  var SZ = 300, off = document.createElement("canvas"); off.width = off.height = SZ;
  var octx = off.getContext("2d", { willReadFrequently: true });
  var logoImg = new Image(); logoImg.src = "/assets/img/sublimehr-logo.png";
  function rr(x, y, w, h, r) { octx.beginPath(); octx.moveTo(x + r, y); octx.arcTo(x + w, y, x + w, y + h, r); octx.arcTo(x + w, y + h, x, y + h, r); octx.arcTo(x, y + h, x, y, r); octx.arcTo(x, y, x + w, y, r); octx.closePath(); }
  var draw = {
    logo: function () {
      if (!logoImg.complete || !logoImg.naturalWidth) return false;
      var r = logoImg.naturalWidth / logoImg.naturalHeight, w = SZ * .92, h = w / r;
      octx.drawImage(logoImg, (SZ - w) / 2, (SZ - h) / 2, w, h); return true;
    },
    clock: function () {
      var d = new Date(), c = SZ / 2;
      octx.strokeStyle = octx.fillStyle = "#fff"; octx.lineCap = "round";
      octx.lineWidth = 16; octx.beginPath(); octx.arc(c, c, 126, 0, PI2); octx.stroke();
      for (var i = 0; i < 12; i++) { var a = i / 12 * PI2; octx.lineWidth = i % 3 ? 6 : 10; octx.beginPath(); octx.moveTo(c + Math.cos(a) * 92, c + Math.sin(a) * 92); octx.lineTo(c + Math.cos(a) * 106, c + Math.sin(a) * 106); octx.stroke(); }
      var ha = ((d.getHours() % 12) + d.getMinutes() / 60) / 12 * PI2 - Math.PI / 2, ma = d.getMinutes() / 60 * PI2 - Math.PI / 2;
      octx.lineWidth = 14; octx.beginPath(); octx.moveTo(c, c); octx.lineTo(c + Math.cos(ha) * 56, c + Math.sin(ha) * 56); octx.stroke();
      octx.lineWidth = 9; octx.beginPath(); octx.moveTo(c, c); octx.lineTo(c + Math.cos(ma) * 84, c + Math.sin(ma) * 84); octx.stroke();
      octx.beginPath(); octx.arc(c, c, 14, 0, PI2); octx.fill(); return true;
    },
    calendar: function () {
      octx.strokeStyle = octx.fillStyle = "#fff"; octx.lineWidth = 12;
      rr(34, 52, 232, 214, 26); octx.stroke();
      rr(34, 52, 232, 52, 26); octx.fill(); octx.fillRect(34, 80, 232, 24);
      octx.lineWidth = 12; octx.lineCap = "round"; [96, 204].forEach(function (x) { octx.beginPath(); octx.moveTo(x, 32); octx.lineTo(x, 70); octx.stroke(); });
      for (var r = 0; r < 4; r++) for (var c = 0; c < 6; c++) {
        var x = 52 + c * 34, y = 122 + r * 34, sel = (r === 1 && (c === 2 || c === 3));
        rr(x, y, sel ? 28 : 20, sel ? 28 : 20, 6); octx.fill();
      }
      return true;
    },
    bars: function () {
      octx.fillStyle = octx.strokeStyle = "#fff"; octx.lineCap = "round";
      [70, 104, 92, 150, 196].forEach(function (h, i) { rr(40 + i * 46, 250 - h, 32, h, 10); octx.fill(); });
      octx.lineWidth = 10; octx.beginPath(); octx.moveTo(26, 268); octx.lineTo(276, 268); octx.stroke();
      octx.lineWidth = 9; octx.beginPath(); octx.moveTo(52, 150); octx.lineTo(120, 112); octx.lineTo(168, 130); octx.lineTo(250, 40); octx.stroke();
      octx.beginPath(); octx.moveTo(250, 40); octx.lineTo(222, 44); octx.moveTo(250, 40); octx.lineTo(246, 68); octx.stroke(); return true;
    },
    globe: function () {
      var c = SZ / 2; octx.strokeStyle = "#fff"; octx.lineWidth = 10;
      octx.beginPath(); octx.arc(c, c, 124, 0, PI2); octx.stroke();
      octx.lineWidth = 7;
      [60, 100].forEach(function (rx) { octx.beginPath(); octx.ellipse(c, c, rx, 124, 0, 0, PI2); octx.stroke(); });
      octx.beginPath(); octx.moveTo(c, 26); octx.lineTo(c, 274); octx.stroke();
      [-60, 0, 60].forEach(function (dy) { var w = Math.sqrt(124 * 124 - dy * dy); octx.beginPath(); octx.moveTo(c - w, c + dy); octx.lineTo(c + w, c + dy); octx.stroke(); });
      return true;
    },
    people: function () {
      octx.fillStyle = "#fff";
      for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) {
        var x = 52 + c * 66, y = 50 + r * 80;
        octx.beginPath(); octx.arc(x, y, 15, 0, PI2); octx.fill();
        octx.beginPath(); octx.ellipse(x, y + 42, 26, 20, 0, Math.PI, PI2); octx.fill();
      }
      return true;
    }
  };
  var BLUE = [76, 143, 224], TEAL = [70, 211, 199], LILAC = [140, 124, 240];
  function sample(name) {
    octx.clearRect(0, 0, SZ, SZ);
    if (!draw[name]()) return null;
    var data = octx.getImageData(0, 0, SZ, SZ).data, pts = [], step = 2;
    for (var y = 0; y < SZ; y += step) for (var x = 0; x < SZ; x += step) {
      var i = (y * SZ + x) * 4;
      if (data[i + 3] > 110) {
        var col;
        if (name === "logo") col = [data[i], data[i + 1], data[i + 2]];
        else { var t = x / SZ, base = rand() < .1 ? LILAC : null; col = base || [BLUE[0] + (TEAL[0] - BLUE[0]) * t, BLUE[1] + (TEAL[1] - BLUE[1]) * t, BLUE[2] + (TEAL[2] - BLUE[2]) * t]; }
        pts.push([x / SZ - .5, y / SZ - .5, col]);
      }
    }
    for (var k = pts.length - 1; k > 0; k--) { var j = (rand() * (k + 1)) | 0, tmp = pts[k]; pts[k] = pts[j]; pts[j] = tmp; }
    return pts;
  }

  /* ---------------- Particle field ---------------- */
  var stage = $("[data-stage]"), canvas = $("[data-field]");
  var chaps = $$("[data-chap]"), dots = $$(".dots li");
  if (stage && canvas) {
    var ctx = canvas.getContext("2d"), DPR = Math.min(1.25, window.devicePixelRatio || 1);
    var W = 0, H = 0, N = window.innerWidth < 760 ? 2200 : 4200, P = [], mouse = { x: -9999, y: -9999 };
    var cur = -1, visible = true, t = 0;
    var box = { cx: 0, cy: 0, s: 0 };
    function layout() {
      var r = canvas.getBoundingClientRect(); W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      if (W < 860) { box.cx = W / 2; box.cy = H * .3; box.s = Math.min(W * .78, H * .38); }
      else { box.cx = W * .63; box.cy = H * .52; box.s = Math.min(W * .38, H * .68); }
    }
    layout();
    var pattern = ["burst", "rain", "spiral", "scatter", "ring"][(rand() * 5) | 0];   // a different entrance on every load
    for (var i = 0; i < N; i++) {
      var p = { x: 0, y: 0, vx: 0, vy: 0, tx: box.cx, ty: box.cy, b: 0, s: 1.3 + rand() * 1.5, k: .018 + rand() * .03, d: 0, ph: rand() * PI2 };
      var a = rand() * PI2, rad = rand();
      if (pattern === "burst") { p.x = box.cx; p.y = box.cy; p.vx = Math.cos(a) * (6 + rand() * 18); p.vy = Math.sin(a) * (6 + rand() * 18); }
      else if (pattern === "rain") { p.x = rand() * W; p.y = -rand() * H; }
      else if (pattern === "spiral") { var ang = i / N * PI2 * 9; p.x = box.cx + Math.cos(ang) * (i / N) * W * .6; p.y = box.cy + Math.sin(ang) * (i / N) * H * .6; }
      else if (pattern === "ring") { p.x = box.cx + Math.cos(a) * W * .7; p.y = box.cy + Math.sin(a) * W * .7; }
      else { p.x = rand() * W; p.y = rand() * H; }
      p.d = performance.now() + rand() * 900;
      P.push(p);
    }
    var NB = 14, BUCKETS = [], COLS = [];
    function bucket(c) {
      // quantise colours into a few groups so the frame draws one fillStyle per group (≈15× faster)
      var key = Math.round(c[0] / 24) + "," + Math.round(c[1] / 24) + "," + Math.round(c[2] / 24);
      var k = COLS.indexOf(key);
      if (k < 0) { if (COLS.length >= 40) { var best = 0, bd = 1e9; COLS.forEach(function (ck, j) { var a = ck.split(",").map(Number), dd = Math.abs(a[0] * 24 - c[0]) + Math.abs(a[1] * 24 - c[1]) + Math.abs(a[2] * 24 - c[2]); if (dd < bd) { bd = dd; best = j; } }); return best; } COLS.push(key); k = COLS.length - 1; }
      return k;
    }
    function morph(name) {
      var pts = sample(name);
      if (!pts) { setTimeout(function () { if (chaps[cur] && chaps[cur].getAttribute("data-shape") === name) morph(name); }, 120); return; }
      var now = performance.now(), L = pts.length;
      for (var i = 0; i < N; i++) {
        var q = pts[i % L], p = P[i];
        p.tx = box.cx + q[0] * box.s + (rand() - .5) * 1.4;
        p.ty = box.cy + q[1] * box.s + (rand() - .5) * 1.4;
        p.b = bucket(q[2]);
        p.d = Math.max(p.d, now + rand() * 380);
        if (cur > 0 && !reduce) { p.vx += (rand() - .5) * 6; p.vy += (rand() - .5) * 6; }
      }
      if (reduce) P.forEach(function (p) { p.x = p.tx; p.y = p.ty; });
      BUCKETS = COLS.map(function () { return []; }); P.forEach(function (p) { BUCKETS[p.b].push(p); });
    }
    window.__lwSettle = function () { P.forEach(function (p) { p.x = p.tx; p.y = p.ty; p.vx = p.vy = 0; p.d = 0; }); };
    function setChapter(i) {
      if (i === cur) return;
      var prev = cur; cur = i;
      chaps.forEach(function (c, j) { c.classList.toggle("on", j === i); c.classList.toggle("out", j < i); });
      dots.forEach(function (d, j) { d.classList.toggle("on", j === i); });
      morph(chaps[i].getAttribute("data-shape"));
      var h = $("[data-decode]", chaps[i]); if (h && prev !== -1) decode(h);
    }
    function progress() {
      var r = stage.getBoundingClientRect(), total = r.height - window.innerHeight;
      visible = r.bottom > 0 && r.top < window.innerHeight;
      stage.classList.toggle("moved", r.top < -40);
      var p = Math.min(.9999, Math.max(0, -r.top / total));
      setChapter(Math.min(chaps.length - 1, Math.floor(p * chaps.length)));
    }
    window.addEventListener("scroll", progress, { passive: true });
    window.addEventListener("resize", function () { layout(); var c = cur; cur = -1; setChapter(c < 0 ? 0 : c); });
    canvas.parentNode.addEventListener("pointermove", function (e) { var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    canvas.parentNode.addEventListener("pointerleave", function () { mouse.x = mouse.y = -9999; });
    logoImg.onload = function () { if (cur === 0) { cur = -1; setChapter(0); } };
    progress(); if (cur < 0) setChapter(0);
    var h1 = $("[data-decode]", chaps[0]); setTimeout(function () { decode(h1); }, 250);

    (function frame(now) {
      requestAnimationFrame(frame);
      if (!visible) return;
      t += .016;
      ctx.fillStyle = reduce ? "#04070F" : "rgba(4,7,15,.34)";
      ctx.fillRect(0, 0, W, H);
      for (var i = 0; i < N; i++) {
        var p = P[i];
        if (now > p.d) {
          var tx = p.tx + Math.sin(t * 1.3 + p.ph) * 1.2, ty = p.ty + Math.cos(t * 1.1 + p.ph) * 1.2;
          p.vx += (tx - p.x) * p.k; p.vy += (ty - p.y) * p.k;
        }
        var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 9000) { var f = (9000 - d2) / 9000 * 2.4, d = Math.sqrt(d2) || 1; p.vx += dx / d * f; p.vy += dy / d * f; }
        p.vx *= .84; p.vy *= .84; p.x += p.vx; p.y += p.vy;
      }
      for (var b = 0; b < BUCKETS.length; b++) {
        var g = BUCKETS[b]; if (!g.length) continue;
        var c = COLS[b].split(","); ctx.fillStyle = "rgb(" + c[0] * 24 + "," + c[1] * 24 + "," + c[2] * 24 + ")";
        ctx.beginPath();
        for (var j = 0; j < g.length; j++) { var q = g[j]; ctx.rect(q.x, q.y, q.s, q.s); }
        ctx.fill();
      }
    })(performance.now());

    /* live clock in the chip (the clock shape also shows the real time) */
    var now = $("[data-now]");
    var tick = function () { var d = new Date(); if (now) now.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()); };
    tick(); setInterval(tick, 15000);
  }

  /* ---------------- Decode headings outside the stage as they enter ---------------- */
  var later = $$("[data-decode]").filter(function (el) { return !el.closest("[data-stage]"); });
  function checkDecode() { later = later.filter(function (el) { if (el.getBoundingClientRect().top < window.innerHeight * .85) { decode(el); return false; } return true; }); }
  window.addEventListener("scroll", checkDecode, { passive: true }); checkDecode();

  /* ---------------- "Just ask" command demo ---------------- */
  var cmd = $("[data-cmd]");
  if (cmd) {
    var txt = $("[data-cmd-text]", cmd), out = $("[data-cmd-out]", cmd), btns = $$("[data-ask]", cmd), busy = false, ran = false;
    var row = function (av, c, b, s, tag, cls, delay) { return '<div class="row" style="animation-delay:' + (delay || 0) + 'ms"><i class="av" style="--c:' + c + '">' + av + '</i><span><b>' + b + '</b><small>' + s + '</small></span>' + (tag ? '<em class="tag ' + (cls || "") + '">' + tag + '</em>' : '') + '</div>'; };
    var R = {
      approve: function () {
        out.innerHTML = '<div class="res"><div class="res__h">Leave request<small>just now</small></div>' + row("OM", "#8C7CF0", "Omar M. · Annual leave", "23–24 Apr · balance 14 → 12 days", "Pending", "", 0) + row("✓", "#46D3C7", "Calendar checked", "No clashes in Omar's team", "Clear", "ok", 250) + '</div>';
        setTimeout(function () { var t = $(".tag", out); if (t) { t.textContent = "Approved ✓"; t.className = "tag ok"; } out.insertAdjacentHTML("beforeend", row("📱", "#4C8FE0", "Omar notified", "Push notification sent to the app", "", "", 0)); }, 1100);
      },
      late: function () {
        out.innerHTML = '<div class="res"><div class="res__h">Late arrivals today<small>shift 09:00 · 15 min grace</small></div>' + row("PS", "#F29C7B", "Priya S.", "Clocked in 09:12 · mobile · field", "Grace", "ok", 0) + row("RV", "#4C8FE0", "Ravi V.", "Clocked in 09:31 · biometric · Plant 2", "Late 31 min", "warn", 200) + row("✓", "#46D3C7", "Auto-flagged", "Managers notified · penalty rules applied", "", "", 400) + '</div>';
      },
      payroll: function () {
        out.innerHTML = '<div class="res"><div class="res__h">March payroll · 412 employees<small data-pct>0%</small></div><div class="prog"><i data-bar></i></div>' + row("Σ", "#4C8FE0", "Gross 1,284,600", "Overtime 42,180 · deductions −96,420", "", "", 200) + '</div>';
        var bar = $("[data-bar]", out), pct = $("[data-pct]", out), t0 = performance.now();
        requestAnimationFrame(function () { bar.style.width = "100%"; });
        (function f(t) { var q = Math.min(1, (t - t0) / 2000); pct.textContent = Math.round(q * 100) + "%"; if (q < 1) requestAnimationFrame(f); else out.querySelector(".res").insertAdjacentHTML("beforeend", row("✓", "#46D3C7", "412 payslips sent", "Branded PDFs delivered to every phone", "Done", "ok", 0)); })(t0);
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
      txt.textContent = "";
      (function type() { if (i <= s.length) { txt.textContent = s.slice(0, i++); setTimeout(type, reduce ? 0 : 28); } else { R[key](); setTimeout(function () { busy = false; }, 600); } })();
    };
    btns.forEach(function (b) { b.addEventListener("click", function () { run(b.getAttribute("data-ask")); }); });
    var autoRun = function () { if (ran) return; if (cmd.getBoundingClientRect().top < window.innerHeight * .7) { ran = true; setTimeout(function () { run("approve"); }, 500); } };
    window.addEventListener("scroll", autoRun, { passive: true }); autoRun();
  }

  /* ---------------- 3D module ring: auto-spin + drag with inertia ---------------- */
  var scene = $("[data-ring]"), spin = $("[data-spin]");
  if (scene && spin) {
    var ry = 0, vel = reduce ? 0 : .12, dragging = false, lastX = 0, moved = 0, hoverCard = false;
    scene.addEventListener("pointerdown", function (e) { dragging = true; lastX = e.clientX; moved = 0; scene.classList.add("drag"); scene.setPointerCapture(e.pointerId); });
    scene.addEventListener("pointermove", function (e) { if (!dragging) return; var dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx); vel = dx * .25; ry += dx * .25; });
    var end = function () { dragging = false; scene.classList.remove("drag"); };
    scene.addEventListener("pointerup", end); scene.addEventListener("pointercancel", end);
    scene.addEventListener("click", function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    $$(".mod", scene).forEach(function (m) { m.addEventListener("mouseenter", function () { hoverCard = true; }); m.addEventListener("mouseleave", function () { hoverCard = false; }); });
    (function loop() {
      requestAnimationFrame(loop);
      var r = scene.getBoundingClientRect(); if (r.bottom < 0 || r.top > window.innerHeight) return;
      if (!dragging) { var base = reduce ? 0 : (hoverCard ? 0 : .12); vel += (base - vel) * .03; ry += vel; }
      spin.style.setProperty("--ry", ry.toFixed(2) + "deg");
    })();
  }

  /* ---------------- CTA starfield ---------------- */
  var sc = $("[data-stars]");
  if (sc) {
    var sx = sc.getContext("2d"), SW, SH, stars = [];
    var sl = function () { var r = sc.getBoundingClientRect(); SW = r.width; SH = r.height; sc.width = SW; sc.height = SH; stars = Array.from({ length: Math.round(SW * SH / 6000) }, function () { return { x: rand() * SW, y: rand() * SH, r: rand() * 1.3 + .2, p: rand() * PI2, v: rand() * .15 + .03 }; }); };
    sl(); window.addEventListener("resize", sl);
    (function tw(time) {
      requestAnimationFrame(tw);
      var r = sc.getBoundingClientRect(); if (r.bottom < 0 || r.top > window.innerHeight) return;
      sx.clearRect(0, 0, SW, SH);
      stars.forEach(function (s) { s.y -= reduce ? 0 : s.v; if (s.y < 0) s.y = SH; var a = .35 + .65 * Math.abs(Math.sin(time / 1400 + s.p)); sx.fillStyle = "rgba(190,230,255," + a + ")"; sx.beginPath(); sx.arc(s.x, s.y, s.r, 0, PI2); sx.fill(); });
    })(0);
  }

  /* ---------------- Cursor + magnetic buttons ---------------- */
  if (fine && !reduce) {
    var cur2 = $(".cursor"), mx = -100, my = -100, cx = -100, cy = -100;
    window.addEventListener("pointermove", function (e) { mx = e.clientX; my = e.clientY; cur2.classList.add("on"); });
    document.addEventListener("pointerleave", function () { cur2.classList.remove("on"); });
    document.addEventListener("pointerover", function (e) { cur2.classList.toggle("big", !!e.target.closest("a, button, .mod")); });
    (function cl() { requestAnimationFrame(cl); cx += (mx - cx) * .2; cy += (my - cy) * .2; cur2.style.transform = "translate(" + cx + "px," + cy + "px)"; })();
    $$("[data-magnet]").forEach(function (b) {
      b.addEventListener("pointermove", function (e) { var r = b.getBoundingClientRect(); b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * .22) + "px," + ((e.clientY - r.top - r.height / 2) * .3) + "px)"; });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  var y = $("[data-y]"); if (y) y.textContent = new Date().getFullYear();
})();
