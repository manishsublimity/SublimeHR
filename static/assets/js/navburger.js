/* Phone/tablet header: the burger opens a full-screen menu; Product and Company open as lists on first tap */
(function () {
  var nav = document.querySelector(".nav"), b = document.querySelector("[data-burger]");
  if (!nav || !b) return;
  var root = document.documentElement;
  function set(o) { nav.classList.toggle("open", o); b.setAttribute("aria-expanded", String(o)); b.setAttribute("aria-label", o ? "Close menu" : "Menu"); root.classList.toggle("nav-open", o); }
  b.addEventListener("click", function () { set(!nav.classList.contains("open")); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { set(false); b.focus(); } });
  window.addEventListener("resize", function () { if (window.innerWidth > 1080 && nav.classList.contains("open")) set(false); });
  [].forEach.call(nav.querySelectorAll(".nav__item > a"), function (a) {
    a.addEventListener("click", function (e) {
      if (window.innerWidth > 1080) return;
      var it = a.parentNode;
      if (!it.classList.contains("exp")) {
        e.preventDefault();
        [].forEach.call(nav.querySelectorAll(".nav__item.exp"), function (x) { x.classList.remove("exp"); });
        it.classList.add("exp");
      }
    });
  });
  [].forEach.call(nav.querySelectorAll(".nav__links > a, .nav__mega a"), function (a) { a.addEventListener("click", function () { set(false); }); });
})();
