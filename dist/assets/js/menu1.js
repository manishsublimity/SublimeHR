/* Small helper so the original header also works on the home page (inner pages get the same from main.js). */
(function () {
  var h = document.getElementById("header"), root = document.documentElement;
  function sc() { if (h) h.classList.toggle("scrolled", window.scrollY > 8); } sc(); window.addEventListener("scroll", sc, { passive: true });
  Array.prototype.forEach.call(document.querySelectorAll("[data-theme-toggle]"), function (b) {
    b.addEventListener("click", function () { var d = root.getAttribute("data-theme") !== "dark"; if (d) root.setAttribute("data-theme", "dark"); else root.removeAttribute("data-theme"); try { localStorage.setItem("shr-theme", d ? "dark" : "light"); } catch (e) {} });
  });
  var burger = document.querySelector(".burger"), drawer = document.getElementById("drawer");
  function set(o) { burger.setAttribute("aria-expanded", String(o)); drawer.classList.toggle("open", o); document.body.style.overflow = o ? "hidden" : ""; burger.querySelector(".i-open").hidden = o; burger.querySelector(".i-close").hidden = !o; }
  if (burger && drawer) { burger.addEventListener("click", function () { set(burger.getAttribute("aria-expanded") !== "true"); }); Array.prototype.forEach.call(drawer.querySelectorAll("a"), function (a) { a.addEventListener("click", function () { set(false); }); }); }
})();
