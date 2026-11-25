(function () {
  var nav = document.querySelector("[data-nav]"); if (!nav) return;
  var hero = document.querySelector("[data-hero], .phero");
  function on() { var y = window.scrollY; nav.classList.toggle("solid", y > 30); nav.classList.toggle("onhero", !!hero && y < hero.offsetHeight - 90); }
  on(); window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
  var tg = nav.querySelector("[data-nav-theme]");
  function paint() { var d = document.documentElement.getAttribute("data-theme") === "dark"; if (tg) tg.setAttribute("aria-label", d ? "Switch to light theme" : "Switch to dark theme"); }
  if (tg) tg.addEventListener("click", function () { var d = document.documentElement.getAttribute("data-theme") !== "dark"; if (d) document.documentElement.setAttribute("data-theme", "dark"); else document.documentElement.removeAttribute("data-theme"); try { localStorage.setItem("shr-theme", d ? "dark" : "light"); } catch (e) {} paint(); });
  paint();
})();
