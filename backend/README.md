# Contact form backend: Google Sheets + email

The backend is a free Google Apps Script web app. It needs no server and works on any static host. For every enquiry it:

- saves a row to a **Google Sheet** called "Leads"
- **emails your sales team** with the lead's details, and sets reply-to to the lead
- sends the lead a **confirmation email**
- blocks spam with a honeypot field, server-side validation and a limit of 5 submissions per email per hour

## Setup (about 10 minutes)

1. Open [sheets.new](https://sheets.new) while signed in to the Google account that should own the leads. Name the sheet **SublimeHR Leads**.
2. In the sheet, go to **Extensions → Apps Script**.
3. Delete the starter code. Paste the full contents of [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
4. At the top, change `NOTIFY_EMAILS: "sales@example.com"` to your real inbox. You can list several addresses, separated by commas.
5. Click **Save**. Select the `setup` function in the toolbar and click **Run**. Approve the permissions when asked: Google will say the app is "unverified" because it's your own script. Click **Advanced → Go to project**. This step also creates the "Leads" header row.
6. Go to **Deploy → New deployment → Select type: Web app** and set:
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
   Then click **Deploy** and copy the **Web app URL**. It ends in `/exec`.
7. Paste that URL into `src/data.mjs`:
   ```js
   formEndpoint: "https://script.google.com/macros/s/XXXX/exec",
   ```
8. Rebuild and upload `dist/`:
   ```bash
   node build.mjs
   ```

To check that the deployment works, open the `/exec` URL in a browser. It should show `{"ok":true,"service":"SublimeHR leads endpoint"}`.

## Updating the script later

After you edit `Code.gs`, go to **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. The URL stays the same.

## Behaviour on the website

| Situation | What the visitor sees |
|---|---|
| `formEndpoint` is set and the request succeeds | A success message. The sheet row and both emails are created. |
| The server rejects the data | An error message with a "Send it on WhatsApp instead" link |
| Network error | The same message with the WhatsApp fallback |
| `formEndpoint` is empty | WhatsApp opens with the details filled in (the previous behaviour) |

Each row also records the page, the referrer and any `utm_source`, `utm_medium`, `utm_campaign` or `plan` values from the URL. A **Status** column starts at "New" so your team can track follow-up.

## Limits

Gmail accounts can send about 100 emails per day from Apps Script. Google Workspace accounts can send about 1,500. Each lead uses 2 emails (team notification and confirmation). To halve that, set `SEND_CONFIRMATION_TO_LEAD: false`.
