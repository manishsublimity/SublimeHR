/* About page stat cards: feature names rain into a pyramid and collapse; the language switches through the world's scripts */
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var timers = [];
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }

  /* ---- 70+ feature areas: rain, pile up as a pyramid, collapse ---- */
  var box = document.querySelector(".abt__fx--rain");
  if (box) {
    var stack = [["Leave", "Shifts", "Payroll"], ["Records", "Reports"], ["Attendance"], ["+64 more"]];
    var extra = ["Visitors", "Mobile", "Security", "Self service", "Access", "Roles"];
    var items = [], drops = [], W = 150, H = 138, GAP = 4, RH = 24;
    function mk(t, cls) { var e = document.createElement("i"); e.textContent = t; e.className = cls; box.appendChild(e); return e; }
    stack.forEach(function (row, r) {
      var els = row.map(function (t) { return mk(t, t.charAt(0) === "+" ? "abt__pill abt__pill--more" : "abt__pill"); });
      var tot = els.reduce(function (a, e) { return a + e.offsetWidth + GAP; }, -GAP), x = (W - tot) / 2;
      els.forEach(function (e) { items.push({ el: e, x: x, y: H - RH - r * (RH + GAP) }); x += e.offsetWidth + GAP; });
    });
    extra.forEach(function (t, i) { drops.push({ el: mk(t, "abt__pill abt__pill--rain"), x: 4 + (i * 27) % 92 }); });
    function place(o, x, y, r, op, tr) {
      o.el.style.transition = tr || "none";
      o.el.style.transform = "translate(" + x + "px," + y + "px) rotate(" + (r || 0) + "deg)";
      o.el.style.opacity = op;
    }
    function settle() { items.forEach(function (o) { place(o, o.x, o.y, 0, 1); }); }
    function cycle() {
      items.forEach(function (o) { place(o, o.x, -40, 0, 0); });
      drops.forEach(function (o) { place(o, o.x, -40, 0, 0); });
      void box.offsetWidth;
      var k = 0;
      items.forEach(function (o, i) {
        later(function () { place(o, o.x, o.y, (i % 2 ? 2 : -2), 1, "transform .75s cubic-bezier(.3,1.35,.5,1), opacity .15s"); later(function () { o.el.style.transform = "translate(" + o.x + "px," + o.y + "px) rotate(0)"; }, 760); }, 250 + i * 420);
      });
      drops.forEach(function (o, i) {
        later(function () {
          place(o, o.x, -30, 0, 1);
          void o.el.offsetWidth;
          place(o, o.x, H + 4, 0, 0, "transform .85s cubic-bezier(.5,0,.9,.6), opacity .85s ease-in");
        }, 120 + i * 430);
      });
      var done = 250 + items.length * 420 + 900;
      later(function () {
        items.slice().reverse().forEach(function (o, i) {
          later(function () { place(o, o.x + (i % 2 ? 26 : -26), H + 40, (i % 2 ? 40 : -40), 0, "transform .6s cubic-bezier(.5,0,.9,.6), opacity .6s ease-in"); }, i * 90);
        });
      }, done + 1900);
      later(cycle, done + 1900 + 1500);
    }
    if (reduce) { settle(); } else { cycle(); }
  }

  /* ---- report types: three sheets shuffle like cards; the top one slides out and goes to the back with a new report ---- */
  var sheets = [].slice.call(document.querySelectorAll("[data-sheet]"));
  if (sheets.length === 3) {
    var RT = ["Event Sheet", "Timesheet", "Attendance", "Comparison", "Exception", "Punch Approval", "Who Is Here", "Daily Clock In/Out", "Penalty", "Daily Salary", "Visitor Timesheet", "Biometrics", "Late Coming"];
    var FM = ["PDF", "XLS", "CSV"], next = 3, order = sheets.slice();
    function heights(k) { var a = []; for (var q = 0; q < 5; q++) a.push(22 + ((k * 37 + q * 53 + (k * q) % 7 * 11) % 70)); return a; }
    function fill(sh, k) {
      var r = k % RT.length, kind = r % 4, h = heights(r);
      sh.querySelector("[data-rtitle]").textContent = RT[r]; sh.querySelector("[data-rfmt]").textContent = FM[r % 3]; sh.setAttribute("data-k", String(kind));
      [].forEach.call(sh.querySelectorAll(".abt__bars i"), function (bb, q) { bb.style.height = h[q] + "%"; });
      var pts = []; for (var q = 0; q < 6; q++) pts.push((q * 20) + "," + Math.round(44 - h[q % 5] * .42 - (q % 2) * 3)); sh.querySelector("polyline").setAttribute("points", pts.join(" "));
      sh.querySelector(".abt__dn").style.setProperty("--p", (30 + h[0] % 50) + "%");
      [].forEach.call(sh.querySelectorAll(".abt__tb u"), function (u, q) { u.style.width = (45 + (h[q] % 55)) + "%"; });
    }
    sheets.forEach(function (sh, i) { fill(sh, [1, 2, 12][i]); });
    function layout() { order.forEach(function (sh, i) { sh.setAttribute("data-p", String(i)); }); }
    layout();
    if (!reduce) {
      setInterval(function () {
        var top = order.shift();
        top.setAttribute("data-p", "out");
        setTimeout(function () {
          fill(top, next++); order.push(top); layout();
        }, 520);
        order.forEach(function (sh, i) { sh.setAttribute("data-p", String(i)); });
      }, 2300);
    }
  }

  /* ---- languages: the name in its own script; the matching letter lights up in the grid ---- */
  var L = document.querySelector("[data-alang]"), glyphs = [].slice.call(document.querySelectorAll(".abt__glyphs i"));
  if (L) {
    var langs = [["EN", 1], ["عربي", .82], ["हिन्दी", .8], ["Español", .56], ["Français", .56], ["Deutsch", .56], ["Türkçe", .56], ["Bahasa", .6], ["中文", .86], ["Português", .5]], li = 0, N = langs.length;
    var base = parseFloat(getComputedStyle(L).fontSize) || 60; L.style.height = base + "px"; L.style.lineHeight = base + "px"; L.style.whiteSpace = "nowrap"; L.style.transition = "opacity .28s, transform .28s";
    function lit() { glyphs.forEach(function (g, k) { g.classList.toggle("on", k === li); }); }
    lit();
    if (!reduce) {
      setInterval(function () {
        li = (li + 1) % N;
        L.style.opacity = 0; L.style.transform = "translateY(-10px)"; lit();
        setTimeout(function () {
          L.textContent = langs[li][0]; L.style.fontSize = Math.round(base * langs[li][1]) + "px";
          L.style.transform = "translateY(10px)"; void L.offsetWidth; L.style.opacity = 1; L.style.transform = "none";
        }, 290);
      }, 1900);
    }
  }
})();
