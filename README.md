# Rlino Photo — Website + Booking Form

A simple, dependency-free site (plain HTML/CSS/JS) with an interactive booking
form. No backend, database, or server required — form submissions are emailed
directly to you.

## Files

- `index.html` / `style.css` — a full one-page site (hero, services, gallery,
  booking form, contact) you can deploy as-is.
- `booking.html` / `booking-embed.css` — a standalone, light-themed version of
  **just the booking form**, meant to be embedded into an existing site (e.g.
  Squarespace, Wix, WordPress) via `<iframe>`.
- `script.js` — shared logic: mobile nav toggle, date validation (blocks past
  dates), form validation, and AJAX submission.

## 1. Activate email delivery (one-time, ~1 minute)

The form uses [FormSubmit](https://formsubmit.co) — a free service that
emails you form submissions with zero backend setup. It's already configured
to send to **rubylaken@gmail.com**.

The **first** time the form is submitted, FormSubmit sends a confirmation
email to that address — click the "Confirm" link in it once, and every
submission after that (from anyone) lands straight in your inbox. Until you
confirm, submissions won't be delivered.

To test it: open `booking.html` (or `index.html`) in a browser, fill out the
form, and submit it. Then check rubylaken@gmail.com (including spam) for the
FormSubmit confirmation email.

If you'd rather send to a different address, replace
`rubylaken@gmail.com` in the form `action` URL in both `index.html` and
`booking.html`.

## 2. Choose how to use it

**Option A — Deploy this whole site.** If rlinophoto.com should be replaced
by this repo, deploy it with any static host: GitHub Pages, Netlify, Vercel,
or Cloudflare Pages all work with zero config since there's no build step.
Point your domain's DNS at whichever host you pick.

**Option B — Embed just the booking form into your existing site.** If
rlinophoto.com is already built on a platform (Squarespace, Wix, etc.), keep
that site and drop the form in as an embed:

1. Host `booking.html`, `booking-embed.css`, and `script.js` somewhere public
   (e.g. deploy this repo to Netlify/GitHub Pages — you'll get a URL like
   `https://yoursite.netlify.app/booking.html`).
2. On your existing site, add an "Embed" / "Code" block and paste:
   ```html
   <iframe
     src="https://yoursite.netlify.app/booking.html"
     style="width:100%; height:900px; border:0;"
     title="Book a session with Rlino Photo"
   ></iframe>
   ```
3. Adjust the `height` to taste.

## 3. Customize

- Replace the gallery placeholder `<div class="frame">` blocks in
  `index.html` with real `<img>` tags of your work.
- Update services, copy, and contact details as needed.
- Colors and fonts live at the top of `style.css` (dark theme) and
  `booking-embed.css` (light theme, for embedding) under `:root`.

## Notes

- Spam protection: a hidden honeypot field silently discards bot
  submissions; FormSubmit also blocks obvious spam automatically.
- The date field only allows today or future dates — it doesn't check your
  actual calendar availability, since there's no calendar connected yet. The
  form is a *booking request*, and you confirm availability by replying to
  the email.
