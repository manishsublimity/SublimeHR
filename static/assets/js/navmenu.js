(function () {
  var root = document.documentElement;
  Array.prototype.forEach.call(document.querySelectorAll("[data-theme-toggle]"), function (b) {
    b.addEventListener("click", function () { var d = root.getAttribute("data-theme") !== "dark"; if (d) root.setAttribute("data-theme", "dark"); else root.removeAttribute("data-theme"); try { localStorage.setItem("shr-theme", d ? "dark" : "light"); } catch (e) {} });
  });
})();
