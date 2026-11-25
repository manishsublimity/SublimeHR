/* The contact form for the module-style pages: validation, WhatsApp hand-off, optional endpoint. */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var form = $("#contact-form"); if (!form) return;
  var params = new URLSearchParams(location.search);
  var topic = params.get("topic"); if (topic) { var tr = $$('input[name="topic"]', form).filter(function (r) { return r.value === topic; })[0]; if (tr) tr.checked = true; }
  var mod = params.get("module"); if (mod) { var mb = $('input[name="modules"][value="' + mod + '"]', form); if (mb) mb.checked = true; }
  ["industry", "size", "customization"].forEach(function (k) { var v = params.get(k), el = $('[name="' + k + '"]', form); if (v && el) el.value = v; });
  var plan = params.get("plan"); if (plan) { var pr = $$('input[name="plan"]', form).filter(function (r) { return r.value.toLowerCase() === plan.toLowerCase(); })[0]; if (pr) pr.checked = true; }
  var di = $('input[type="date"]', form); if (di) { var tm = new Date(); tm.setDate(tm.getDate() + 1); di.min = tm.toISOString().slice(0, 10); }
  function ctl(f) { return $("input[required], textarea[required], select[required]", f) || $("input, select, textarea", f); }
  function validate(f) {
    var i = ctl(f); if (!i) return true;
    var ok = i.checkValidity() && (i.type !== "tel" || /^[()\-\s\d]{6,}$/.test(i.value.trim()));
    f.classList.toggle("invalid", !ok); i.setAttribute("aria-invalid", String(!ok)); return ok;
  }
  $$(".cf-field", form).forEach(function (f) { var i = ctl(f); if (!i) return; i.addEventListener("blur", function () { if (i.value && f.hasAttribute("data-validate")) validate(f); }); i.addEventListener("input", function () { if (f.classList.contains("invalid")) validate(f); }); });
  function waLink(p) {
    var names = { book_demo: "Book a demo", request_quote: "Get pricing", contact_sales: "Contact message" };
    var lines = ["Hi SublimeHR, new enquiry from the website:", "Request: " + (names[p.intent] || "-"), "Name: " + (p.name || "-"), "Company: " + (p.company || "-"), "Email: " + (p.email || "-"), "Phone: " + (p.phone || "-"), p.size ? "Employees: " + p.size : "", p.industry ? "Industry: " + p.industry : "", p.demo_date ? "Preferred demo: " + p.demo_date : "", p.modules ? "Modules: " + p.modules : "", p.plan ? "Plan: " + p.plan : "", p.customization ? "Customization: " + p.customization : "", p.message ? "Message: " + p.message : ""].filter(Boolean);
    return "https://wa.me/917976117684?text=" + encodeURIComponent(lines.join("\n"));
  }
  var say = $("[data-cfsay]"), says = { "f-name": "Hi! What is your name?", "f-company": "Which company are you with?", "f-email": "Your work email, please.", "f-phone": "A number we can call.", "f-size": "How big is your team?", "f-industry": "What industry are you in?", "f-date": "Pick a day that suits you.", "f-msg": "Tell me a little more.", "f-custom": "Any special needs?" };
  function sayIt(tx) { if (!say) return; say.classList.remove("on"); void say.offsetWidth; say.textContent = tx; say.classList.add("on"); }
  form.addEventListener("focusin", function (e) { var id = e.target.id, nm = e.target.name; if (says[id]) sayIt(says[id]); else if (nm === "topic") sayIt("What is it about?"); else if (nm === "modules") sayIt("Pick the modules you like."); else if (nm === "slot") sayIt("Morning, afternoon or evening?"); else if (nm === "plan") sayIt("Which plan sounds right?"); });
  function confetti(card) {
    var cols = ["#3558F5", "#FFD05A", "#45C4B0", "#FF8A70", "#7A5CF0", "#1FBF75"], box = document.createElement("div"); box.className = "cf-conf"; card.appendChild(box);
    for (var i = 0; i < 36; i++) { var c = document.createElement("i"); c.style.background = cols[i % cols.length]; c.style.setProperty("--x", (Math.random() * 520 - 260) + "px"); c.style.setProperty("--y", (-Math.random() * 260 - 40) + "px"); c.style.setProperty("--r", (Math.random() * 720 - 360) + "deg"); c.style.left = "50%"; c.style.top = "55%"; c.style.animationDelay = (Math.random() * .25) + "s"; box.appendChild(c); }
    setTimeout(function () { box.remove(); }, 2600);
  }
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if ($('[name="website"]', form).value) return;
    var bad = $$(".cf-field[data-validate]", form).filter(function (f) { return !validate(f); });
    if (bad.length) { ctl(bad[0]).focus(); return; }
    var payload = {};
    new FormData(form).forEach(function (v, k) { if (k === "website") return; payload[k] = payload[k] ? payload[k] + ", " + v : v; });
    payload.phone = (payload.cc || "") + " " + (payload.phone || ""); delete payload.cc;
    if (payload.slot) { payload.demo_date = (payload.demo_date || "Any day") + " (" + payload.slot + ")"; delete payload.slot; }
    if (payload.topic) payload.message = "[" + payload.topic + "] " + (payload.message || "");
    payload.page = location.pathname + location.search; payload.referrer = document.referrer || "";
    ["utm_source", "utm_medium", "utm_campaign"].forEach(function (k) { var v = params.get(k); if (v) payload[k] = v; });
    var btn = $('button[type="submit"]', form), lbl = $("[data-submit-label]", form), orig = lbl.textContent, errBox = $("#form-error"), card = form.closest(".cf-card");
    btn.disabled = true; btn.setAttribute("aria-busy", "true"); lbl.textContent = "Sending…";
    var endpoint = (form.getAttribute("data-endpoint") || "").trim();
    function done(viaWa) {
      card.classList.add("sent"); var s = $("#form-success"); sayIt("Thank you! Talk soon."); var pp = card.querySelector(".cf__ppl"); if (pp) pp.classList.add("cheer"); confetti(card);
      if (viaWa) $("#success-msg").textContent = "Please press send in WhatsApp to deliver your details to our team. We'll reply within 1 business day.";
      var wa = $("#wa-followup"); if (wa) wa.href = waLink(payload); s.setAttribute("tabindex", "-1"); s.focus();
    }
    function fail(m) {
      btn.disabled = false; btn.removeAttribute("aria-busy"); lbl.textContent = orig; errBox.innerHTML = "";
      var p = document.createElement("p"); p.textContent = (m && m.length ? m.join(" ") : "Sorry, we couldn't send your request.") + " ";
      var a = document.createElement("a"); a.href = waLink(payload); a.target = "_blank"; a.rel = "noopener"; a.textContent = "Send it on WhatsApp instead";
      p.appendChild(a); errBox.appendChild(p); errBox.hidden = false; errBox.focus();
    }
    if (!endpoint) { done(true); window.open(waLink(payload), "_blank", "noopener"); return; }
    errBox.hidden = true;
    fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload), redirect: "follow" })
      .then(function (r) { return r.json(); }).then(function (res) { if (res && res.ok) done(false); else fail(res && res.errors); }).catch(function () { fail(); });
  });
})();
