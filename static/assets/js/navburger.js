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
  /* sound switch lives in the menu on phone and tablet: it drives the floating sound button, which is hidden there */
  var fab = document.querySelector(".fab[data-sound]"), links = nav.querySelector(".nav__links");
  if (fab && links) {
    var sb = document.createElement("button");
    sb.type = "button"; sb.className = "nav__snd";
    sb.innerHTML = '<span class="nav__snd-t">Sound</span><span class="nav__snd-sw" aria-hidden="true"><i></i></span>';
    var sync = function () { var on = fab.getAttribute("aria-pressed") === "true"; sb.setAttribute("aria-pressed", String(on)); sb.querySelector(".nav__snd-t").textContent = on ? "Sound on" : "Sound off"; };
    sb.addEventListener("click", function () { fab.click(); setTimeout(sync, 30); });
    var cta = links.querySelector(".nav__cta-m"); links.insertBefore(sb, cta || null);
    sync();
    if (window.MutationObserver) new MutationObserver(sync).observe(fab, { attributes: true, attributeFilter: ["aria-pressed"] });
  }
})();
