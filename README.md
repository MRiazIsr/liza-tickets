# For Liza ✈️

A one-page static gift site. Two boarding-pass cards on a lavender gradient — Liza
picks a destination and travel dates from Tel Aviv, presses **Save & send**, and the
choices arrive by email to **markriaz13@gmail.com**.

Pure static files: `index.html`, `styles.css`, `script.js`. No backend.

## 1. Get a Web3Forms access key (one time, ~1 min)

The site needs a free key to send email.

1. Go to **https://web3forms.com**.
2. Enter **markriaz13@gmail.com** in the "Create your Access Key" box and submit.
3. The access key is emailed to you instantly (looks like `xxxxxxxx-xxxx-xxxx-...`).
4. Open `index.html`, find:
   ```html
   <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY" />
   ```
   Replace `YOUR_ACCESS_KEY` with your real key. Save.

That's it — the email goes to whatever address you registered the key with.

## 2. Test locally

Open `index.html` in a browser, or run a tiny server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Fill the form and submit; you should receive the email within seconds.
(If you haven't replaced `YOUR_ACCESS_KEY`, sending will fail with an error.)

## 3. Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `liza-tickets`).
2. Push these files to it:
   ```bash
   git remote add origin https://github.com/<your-username>/liza-tickets.git
   git branch -M main
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Set branch to **main** and folder to **/ (root)**. Save.
6. Wait ~1 minute. Your site is live at:
   `https://<your-username>.github.io/liza-tickets/`

Send Liza that link. 💜

## Notes

- Free Web3Forms tier covers 250 submissions/month — plenty.
- The `botcheck` hidden field is a built-in spam honeypot — leave it as is.
- Don't worry about exposing the access key in the HTML; that's how Web3Forms is
  designed to work (the key only lets people send mail *to you*).
