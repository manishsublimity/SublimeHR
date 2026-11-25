/* The contact form for the module-style pages: validation, WhatsApp hand-off, optional endpoint. */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var form = $("#contact-form"); if (!form) return;
  var params = new URLSearchParams(location.search);
  var topic = params.get("topic"); if (topic) { var tr = $$('input[name="topic"]', form).filter(function (r) { return r.value === topic; })[0]; if (tr) tr.checked = true; }
  function ctl(f) { return $("input[required], textarea[required], select[required]", f) || $("input, select, textarea", f); }
  function validate(f) {
    var i = ctl(f); if (!i) return true;
    var ok = i.checkValidity() && (i.type !== "tel" || /^[()\-\s\d]{6,}$/.test(i.value.trim()));
    f.classList.toggle("invalid", !ok); i.setAttribute("aria-invalid", String(!ok)); return ok;
  }
  $$(".cf-field", form).forEach(function (f) { var i = ctl(f); if (!i) return; i.addEventListener("blur", function () { if (i.value && f.hasAttribute("data-validate")) validate(f); }); i.addEventListener("input", function () { if (f.classList.contains("invalid")) validate(f); }); });
  function waLink(p) {
    var names = { book_demo: "Book a demo", request_quote: "Get pricing", contact_sales: "Contact message" };
    var lines = ["Hi SublimeHR, new enquiry from the website:", "Request: " + (names[p.intent] || "-"), "Name: " + (p.name || "-"), "Company: " + (p.company || "-"), "Email: " + (p.email || "-"), "Phone: " + (p.phone || "-"), p.message ? "Message: " + p.message : ""].filter(Boolean);
    return "https://wa.me/917976117684?text=" + encodeURIComponent(lines.join("\n"));
  }
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if ($('[name="website"]', form).value) return;
    var bad = $$(".cf-field[data-validate]", form).filter(function (f) { return !validate(f); });
    if (bad.length) { ctl(bad[0]).focus(); return; }
    var payload = {};
    new FormData(form).forEach(function (v, k) { if (k === "website") return; payload[k] = payload[k] ? payload[k] + ", " + v : v; });
    payload.phone = (payload.cc || "") + " " + (payload.phone || ""); delete payload.cc;
    if (payload.topic) payload.message = "[" + payload.topic + "] " + (payload.message || "");
    payload.page = location.pathname + location.search; payload.referrer = document.referrer || "";
    ["utm_source", "utm_medium", "utm_campaign"].forEach(function (k) { var v = params.get(k); if (v) payload[k] = v; });
    var btn = $('button[type="submit"]', form), lbl = $("[data-submit-label]", form), orig = lbl.textContent, errBox = $("#form-error"), card = form.closest(".cf-card");
    btn.disabled = true; btn.setAttribute("aria-busy", "true"); lbl.textContent = "Sending…";
    var endpoint = (form.getAttribute("data-endpoint") || "").trim();
    function done(viaWa) {
      card.classList.add("sent"); var s = $("#form-success");
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
