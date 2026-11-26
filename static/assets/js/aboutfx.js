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

  /* ---- report types: one report sheet at a time, its chart redraws for each of the 13 reports ---- */
  var sheet = document.querySelector("[data-sheet]");
  if (sheet) {
    var RT = ["Event Sheet", "Timesheet", "Attendance", "Comparison", "Exception", "Punch Approval", "Who Is Here", "Daily Clock In/Out", "Penalty", "Daily Salary", "Visitor Timesheet", "Biometrics", "Late Coming"];
    var FM = ["PDF", "XLS", "CSV"], bars = [].slice.call(sheet.querySelectorAll(".abt__bars i")), tt = sheet.querySelector("[data-rtitle]"), fm = sheet.querySelector("[data-rfmt]"), ri = 0;
    function heights(k) { return bars.map(function (_, j) { return 22 + ((k * 37 + j * 53 + (k * j) % 7 * 11) % 70); }); }
    function showReport(k) {
      tt.textContent = RT[k]; fm.textContent = FM[k % 3];
      var h = heights(k); bars.forEach(function (b, j) { b.style.height = h[j] + "%"; });
    }
    bars.forEach(function (b) { b.style.height = "0%"; });
    showReport(0);
    if (!reduce) {
      setInterval(function () {
        ri = (ri + 1) % RT.length;
        sheet.classList.add("flip");
        bars.forEach(function (b) { b.style.height = "0%"; });
        setTimeout(function () { showReport(ri); sheet.classList.remove("flip"); }, 380);
      }, 2100);
    }
  }

  /* ---- languages: one wheel, the active language in its own script, neighbours in English ---- */
  var L = document.querySelector("[data-alang]"), wheel = document.querySelectorAll(".abt__wheel i");
  if (L) {
    var langs = [["EN", "ltr", 1, "English"], ["عربي", "rtl", .82, "Arabic"], ["हिन्दी", "ltr", .8, "Hindi"], ["Español", "ltr", .56, "Spanish"], ["Français", "ltr", .56, "French"], ["Deutsch", "ltr", .56, "German"], ["Türkçe", "ltr", .56, "Turkish"], ["Bahasa", "ltr", .6, "Indonesian"], ["中文", "ltr", .86, "Chinese"], ["Português", "ltr", .5, "Portuguese"]], li = 0, N = langs.length;
    var base = parseFloat(getComputedStyle(L).fontSize) || 60; L.style.height = base + "px"; L.style.lineHeight = base + "px"; L.style.whiteSpace = "nowrap"; L.style.transition = "opacity .28s, transform .28s";
    function paintWheel() { if (wheel.length === 3) { wheel[0].textContent = langs[(li + N - 1) % N][3]; wheel[1].textContent = langs[li][3]; wheel[2].textContent = langs[(li + 1) % N][3]; } }
    paintWheel();
    if (!reduce) {
      setInterval(function () {
        li = (li + 1) % N;
        L.style.opacity = 0; L.style.transform = "translateY(-10px)";
        [].forEach.call(wheel, function (w) { w.style.transition = "opacity .28s, transform .28s"; w.style.opacity = 0; w.style.transform = "translateY(-8px)"; });
        setTimeout(function () {
          L.textContent = langs[li][0]; L.setAttribute("dir", langs[li][1]); L.style.fontSize = Math.round(base * langs[li][2]) + "px";
          L.style.transform = "translateY(10px)"; void L.offsetWidth; L.style.opacity = 1; L.style.transform = "none";
          paintWheel();
          [].forEach.call(wheel, function (w) { w.style.transform = "translateY(8px)"; void w.offsetWidth; w.style.opacity = ""; w.style.transform = "none"; });
        }, 290);
      }, 1900);
    }
  }
})();
