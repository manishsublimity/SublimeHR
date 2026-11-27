/* Phone and tablet behaviour: the suggested questions live inside the chat, and phones get an app-style bottom tab bar */
(function () {
  var mq = window.matchMedia("(max-width: 960px)");
  var qs = document.querySelector("[data-qs]"), chat = document.querySelector(".chat");
  if (qs && chat) {
    var home = qs.parentNode, foot = chat.querySelector(".chat__foot");
    var place = function () {
      if (mq.matches) { chat.insertBefore(qs, foot || null); qs.classList.add("in-chat"); }
      else { home.appendChild(qs); qs.classList.remove("in-chat"); }
    };
    place();
    if (mq.addEventListener) mq.addEventListener("change", place); else if (mq.addListener) mq.addListener(place);
  }


  /* day timeline on tablet and phone: Aisha stands on the card of the current stop and hops to the next one */
  var day = document.querySelector("[data-day]"), walker = day && day.querySelector("[data-walker]"), track = day && day.querySelector("[data-track]");
  if (walker && track) {
    var stops = [].slice.call(day.querySelectorAll(".stp"));
    var put = function () {
      if (!mq.matches) { walker.style.removeProperty("--wxx"); walker.style.removeProperty("--wyy"); return; }
      var cur = stops.filter(function (x) { return x.classList.contains("on"); }).pop() || stops[0];
      var c = cur.querySelector(".stp__c") || cur, tr = (walker.offsetParent || track).getBoundingClientRect(), r = c.getBoundingClientRect();
      walker.style.setProperty("--wxx", (r.right - tr.left - 48) + "px");
      walker.style.setProperty("--wyy", (r.top - tr.top + 20) + "px");
    };
    if (window.MutationObserver) { var mo = new MutationObserver(put); stops.forEach(function (x) { mo.observe(x, { attributes: true, attributeFilter: ["class"] }); }); }
    put(); setTimeout(put, 700); window.addEventListener("resize", put);
    if (mq.addEventListener) mq.addEventListener("change", put);
  }

  /* hero industries: mark the one before, the active one and the next one, so a small phone can show just these three */
  var chips = [].slice.call(document.querySelectorAll("[data-chips] .chip"));
  if (chips.length > 2) {
    var ring = function () {
      var n = chips.length, i = 0;
      chips.forEach(function (c, k) { if (c.getAttribute("aria-pressed") === "true") i = k; });
      chips.forEach(function (c, k) {
        var r = k === i ? "cur" : k === (i + n - 1) % n ? "prev" : k === (i + 1) % n ? "next" : "";
        if (r) c.setAttribute("data-ring", r); else c.removeAttribute("data-ring");
      });
    };
    ring();
    if (window.MutationObserver) { var mc = new MutationObserver(ring); chips.forEach(function (c) { mc.observe(c, { attributes: true, attributeFilter: ["aria-pressed"] }); }); }
  }

  /* the end of the footer is on screen: the floating buttons fade away so they never cover the legal links */
  var endBar = document.querySelector(".footer__bar, .foot2__bar");
  if (endBar && "IntersectionObserver" in window) { new IntersectionObserver(function (en) { document.documentElement.classList.toggle("at-end", en[0].isIntersecting); }, { threshold: 0.2 }).observe(endBar); }

  var phone = window.matchMedia("(max-width: 760px)");
  var items = [
    ["/", "Home", '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/>'],
    ["/features/", "Features", '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>'],
    ["/pricing/", "Pricing", '<path d="M20.5 13.5 13 21l-9-9V4h8l8.5 8.5z"/><circle cx="8" cy="8" r="1.4"/>'],
    ["/industries/", "Industries", '<rect x="3" y="8" width="18" height="12" rx="2.5"/><path d="M9 8V5.5h6V8M3 13.5h18"/>'],
    ["/book-demo/", "Demo", '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17M9 15l2 2 4-4"/>']
  ];
  var path = location.pathname.replace(/index\.html$/, "");
  function active(h) { if (h === "/") return path === "/" || path === "/home-v2/"; return path.indexOf(h) === 0 || (h === "/features/" && path.indexOf("/software/") === 0); }
  var bar = document.createElement("nav");
  bar.className = "tabbar"; bar.setAttribute("aria-label", "Quick navigation");
  bar.innerHTML = items.map(function (it) {
    return '<a href="' + it[0] + '" aria-label="' + it[1] + '" class="' + (active(it[0]) ? "on" : "") + '"' + (active(it[0]) ? ' aria-current="page"' : "") + '><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + it[2] + "</svg><span>" + it[1] + "</span></a>";
  }).join("");
  var dot = document.createElement("span");
  dot.className = "tabbar__dot"; dot.setAttribute("aria-hidden", "true");
  bar.appendChild(dot);
  document.body.appendChild(bar);
  /* the notch and the round badge sit on whichever tab is active, and carry its icon */
  function seat() {
    var on = bar.querySelector("a.on");
    if (!on) { bar.removeAttribute("data-act"); return; }
    bar.setAttribute("data-act", "1");
    dot.innerHTML = on.querySelector("svg").outerHTML;
    bar.style.setProperty("--ax", (on.offsetLeft + on.offsetWidth / 2) + "px");
  }
  seat(); window.addEventListener("resize", seat); window.addEventListener("load", seat);
})();
