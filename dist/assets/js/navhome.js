(function () {
  var nav = document.querySelector("[data-nav]"), hero = document.querySelector(".phero"); if (!nav) return;
  function on() { var y = window.scrollY; nav.classList.toggle("solid", y > 30); nav.classList.toggle("onhero", !!hero && y < hero.offsetHeight - 90); }
  on(); window.addEventListener("scroll", on, { passive: true });
})();
