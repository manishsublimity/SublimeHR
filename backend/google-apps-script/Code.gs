/**
 * SublimeHR — Contact form backend (Google Apps Script web app)
 *
 * What it does for every website enquiry:
 *   1. Validates the data and blocks obvious spam
 *   2. Appends a row to the "Leads" sheet of the spreadsheet this script is bound to
 *   3. Emails the sales team a notification (reply-to = the lead)
 *   4. Sends the lead a short confirmation email
 *
 * Setup: see backend/README.md
 */

// ===== Configuration =========================================================
var CONFIG = {
  NOTIFY_EMAILS: "sales@example.com",          // comma-separated team inbox(es) — CHANGE THIS
  SEND_CONFIRMATION_TO_LEAD: true,             // auto-reply to the person who submitted
  SHEET_NAME: "Leads",
  COMPANY_NAME: "SublimeHR",
  WHATSAPP_URL: "https://wa.me/917976117684",
  PHONE: "+91-7976117684",
  MAX_PER_EMAIL_PER_HOUR: 5                    // simple rate limit
};

var COLUMNS = [
  "Submitted at", "Request", "Company", "Name", "Email", "Phone", "Industry",
  "Employees", "Current HR software", "Customization", "Interested modules",
  "Preferred demo date", "Plan", "Message", "Page", "Referrer",
  "utm_source", "utm_medium", "utm_campaign", "Status"
];

var INTENTS = { book_demo: "Book a demo", request_quote: "Request a quote", contact_sales: "Contact sales" };

// ===== Entry points ==========================================================
function doPost(e) {
  try {
    var data = parseBody_(e);

    // Honeypot: bots fill hidden fields. Pretend success, store nothing.
    if (data.website) return json_({ ok: true });

    var errors = validate_(data);
    if (errors.length) return json_({ ok: false, errors: errors });

    if (isRateLimited_(data.email)) return json_({ ok: false, errors: ["Too many submissions. Please try again later."] });

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try { appendRow_(data); } finally { lock.releaseLock(); }

    notifyTeam_(data);
    if (CONFIG.SEND_CONFIRMATION_TO_LEAD) confirmLead_(data);

    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, errors: ["Server error"] });
  }
}

// Visiting the URL in a browser shows this — handy to confirm deployment works.
function doGet() {
  return json_({ ok: true, service: "SublimeHR leads endpoint" });
}

// ===== Helpers ===============================================================
function parseBody_(e) {
  var raw = (e && e.postData && e.postData.contents) || "{}";
  var obj = JSON.parse(raw);
  var clean = {};
  Object.keys(obj).forEach(function (k) {
    var v = obj[k];
    if (Array.isArray(v)) v = v.join(", ");
    clean[k] = String(v == null ? "" : v).trim().slice(0, k === "message" ? 3000 : 300);
  });
  return clean;
}

function validate_(d) {
  var errs = [];
  if (!d.company) errs.push("Company name is required.");
  if (!d.name) errs.push("Name is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email || "")) errs.push("A valid email is required.");
  if (!/^[+()\-\s\d]{7,}$/.test(d.phone || "")) errs.push("A valid phone number is required.");
  if (/https?:\/\//i.test(d.name) || /https?:\/\//i.test(d.company)) errs.push("Invalid characters.");
  return errs;
}

function isRateLimited_(email) {
  var cache = CacheService.getScriptCache();
  var key = "rl_" + Utilities.base64EncodeWebSafe(String(email).toLowerCase()).slice(0, 200);
  var n = Number(cache.get(key) || 0);
  if (n >= CONFIG.MAX_PER_EMAIL_PER_HOUR) return true;
  cache.put(key, String(n + 1), 3600);
  return false;
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.insertSheet(CONFIG.SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLUMNS);
    sh.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold").setBackground("#2F72B8").setFontColor("#FFFFFF");
    sh.setFrozenRows(1);
  }
  return sh;
}

// Prevent spreadsheet formula injection (values starting with = + - @)
function safe_(v) {
  v = v || "";
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function appendRow_(d) {
  sheet_().appendRow([
    new Date(), INTENTS[d.intent] || d.intent, d.company, d.name, d.email, d.phone, d.industry,
    d.size, d.current_software, d.customization, d.modules, d.demo_date, d.plan, d.message,
    d.page, d.referrer, d.utm_source, d.utm_medium, d.utm_campaign, "New"
  ].map(function (v) { return v instanceof Date ? v : safe_(v); }));
}

function esc_(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function notifyTeam_(d) {
  var label = INTENTS[d.intent] || "Website enquiry";
  var rows = [
    ["Request", label], ["Company", d.company], ["Name", d.name], ["Email", d.email], ["Phone", d.phone],
    ["Industry", d.industry], ["Employees", d.size], ["Current HR software", d.current_software],
    ["Customization", d.customization], ["Modules", d.modules], ["Preferred demo date", d.demo_date],
    ["Plan", d.plan], ["Message", d.message], ["Page", d.page], ["Source", [d.utm_source, d.utm_medium, d.utm_campaign].filter(String).join(" / ")]
  ].filter(function (r) { return r[1]; });

  var html = '<div style="font-family:Arial,sans-serif;color:#0B1B33">' +
    '<h2 style="color:#2F72B8;margin:0 0 12px">New ' + esc_(label) + " — " + esc_(d.company) + "</h2>" +
    '<table cellpadding="8" style="border-collapse:collapse;font-size:14px">' +
    rows.map(function (r) {
      return '<tr><td style="border-bottom:1px solid #E3E9F2;color:#5B6B84;white-space:nowrap">' + esc_(r[0]) +
        '</td><td style="border-bottom:1px solid #E3E9F2">' + esc_(r[1]).replace(/\n/g, "<br>") + "</td></tr>";
    }).join("") + "</table>" +
    '<p style="margin-top:16px"><a href="tel:' + esc_(d.phone) + '">Call</a> · <a href="https://wa.me/' +
    String(d.phone).replace(/\D/g, "") + '">WhatsApp</a> · <a href="' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '">Open leads sheet</a></p></div>';

  MailApp.sendEmail({
    to: CONFIG.NOTIFY_EMAILS,
    replyTo: d.email,
    name: CONFIG.COMPANY_NAME + " Website",
    subject: "[" + CONFIG.COMPANY_NAME + "] " + label + ": " + d.company + " (" + d.name + ")",
    htmlBody: html,
    body: rows.map(function (r) { return r[0] + ": " + r[1]; }).join("\n")
  });
}

function confirmLead_(d) {
  var first = String(d.name).split(" ")[0];
  var html = '<div style="font-family:Arial,sans-serif;color:#0B1B33;font-size:15px;line-height:1.6">' +
    "<p>Hi " + esc_(first) + ",</p>" +
    "<p>Thanks for contacting " + CONFIG.COMPANY_NAME + ". We've received your request (" + esc_(INTENTS[d.intent] || "enquiry") +
    ") and an HR specialist will get back to you within 1 business day.</p>" +
    '<p>Need a faster answer? Call <a href="tel:' + CONFIG.PHONE + '">' + CONFIG.PHONE + '</a> or <a href="' + CONFIG.WHATSAPP_URL + '">chat on WhatsApp</a>.</p>' +
    "<p>— Team " + CONFIG.COMPANY_NAME + "</p></div>";
  MailApp.sendEmail({
    to: d.email,
    name: CONFIG.COMPANY_NAME,
    replyTo: CONFIG.NOTIFY_EMAILS.split(",")[0].trim(),
    subject: "We've received your request — " + CONFIG.COMPANY_NAME,
    htmlBody: html
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Run once from the editor to grant permissions and create the sheet header.
function setup() {
  sheet_();
  console.log("Leads sheet ready: " + SpreadsheetApp.getActiveSpreadsheet().getUrl());
}
