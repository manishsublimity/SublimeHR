/* About page stat cards: feature names rain into a pyramid and collapse; the language switches through the world's scripts */
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var timers = [];
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }

  /* ---- 70+ feature areas: rain, pile up as a pyramid, collapse ---- */
  var box = document.querySelector(".abt__fx--rain");
  if (box) {
    var stack = [["Leave", "Shifts", "Payroll"], ["Records", "Reports"], ["Attendance"]];
    var extra = ["Visitors", "Mobile", "Security", "Self service", "Access", "Roles"];
    var items = [], drops = [], W = 150, H = 138, GAP = 4, RH = 24;
    function mk(t, cls) { var e = document.createElement("i"); e.textContent = t; e.className = cls; box.appendChild(e); return e; }
    stack.forEach(function (row, r) {
      var els = row.map(function (t) { return mk(t, "abt__pill"); });
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

  /* ---- languages: the same rotation the home page uses ---- */
  var L = document.querySelector("[data-alang]"), Hh = document.querySelector("[data-ahello]");
  if (L) {
    var langs = [["EN", "ltr", 1, "Hello"], ["عربي", "rtl", .82, "مرحبا"], ["हिन्दी", "ltr", .8, "नमस्ते"], ["Español", "ltr", .56, "Hola"], ["Français", "ltr", .56, "Bonjour"], ["Deutsch", "ltr", .56, "Hallo"], ["Türkçe", "ltr", .56, "Merhaba"], ["Bahasa", "ltr", .6, "Halo"], ["中文", "ltr", .86, "你好"], ["Português", "ltr", .5, "Olá"]], li = 0;
    var base = parseFloat(getComputedStyle(L).fontSize) || 60; L.style.height = base + "px"; L.style.lineHeight = base + "px"; L.style.whiteSpace = "nowrap"; L.style.transition = "opacity .28s, transform .28s";
    if (!reduce) {
      setInterval(function () {
        li = (li + 1) % langs.length;
        L.style.opacity = 0; L.style.transform = "translateY(-10px)"; if (Hh) { Hh.style.opacity = 0; Hh.style.transform = "scale(.7)"; }
        setTimeout(function () {
          L.textContent = langs[li][0]; L.setAttribute("dir", langs[li][1]); L.style.fontSize = Math.round(base * langs[li][2]) + "px";
          L.style.transform = "translateY(10px)"; void L.offsetWidth; L.style.opacity = 1; L.style.transform = "none";
          if (Hh) { Hh.textContent = langs[li][3]; Hh.setAttribute("dir", langs[li][1]); Hh.style.opacity = 1; Hh.style.transform = "scale(1)"; }
        }, 290);
      }, 1900);
    }
  }
})();
