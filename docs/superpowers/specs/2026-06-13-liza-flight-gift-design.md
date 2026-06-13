# Liza Flight Gift — Design

**Date:** 2026-06-13
**Goal:** A single static page (a gift for Liza Gindis) showing two airline-ticket cards on a light-purple gradient. Liza fills in a destination and travel dates; on save, an email with her choices is sent to markriaz13@gmail.com.

## Constraints

- **Static files only** — no backend. Deploy to GitHub Pages.
- Email is sent via **Web3Forms** (free, no account login needed; just an access key tied to the recipient email).
- Language: **English**.

## User experience

1. Page loads with a soft light-purple (lavender → lilac) gradient background and a welcoming title.
2. Two boarding-pass–style cards:
   - **Outbound:** `Tel Aviv (TLV) → {Destination}`, passenger **Liza Gindis**, field **Departure date**.
   - **Return:** `{Destination} → Tel Aviv (TLV)`, passenger **Liza Gindis**, field **Return date**.
3. Editable fields: **Destination** (single input, mirrored into both cards live via JS), **Departure date**, **Return date** (`<input type="date">`).
4. A primary button **"Save & send ✈️"**.
5. On submit: data POSTed to `https://api.web3forms.com/submit` via `fetch`; cards are replaced by an on-screen confirmation ("Saved! Mark will get your tickets 💜") without a page reload.

## Architecture

- `index.html` — markup: form wrapping both cards, hidden `access_key` field, hidden `subject`/`from_name` fields for a nice email.
- `styles.css` — gradient background, boarding-pass card styling, responsive layout.
- Inline (or small) JS in `index.html` — live destination mirroring, validation (all fields required, return ≥ departure), async submit, success/error UI.
- `README.md` — how to get a Web3Forms access key and how to deploy to GitHub Pages.

## Data flow

Form fields → `fetch` POST (JSON) to Web3Forms API with `access_key` → Web3Forms emails markriaz13@gmail.com → JS shows success state.

Email payload includes: Destination, Departure date, Return date, fixed route Tel Aviv (TLV), passenger Liza Gindis.

## Error handling

- Client-side: required fields; return date not before departure date.
- Network/API error on submit: show an error message and re-enable the button so she can retry.

## Setup required (one-time, by Mark)

Get a free access key at web3forms.com (enter email → key arrives by mail). Replace `YOUR_ACCESS_KEY` placeholder in `index.html`.

## Out of scope (YAGNI)

No accounts, no database, no multiple trip options, no i18n, no analytics.
