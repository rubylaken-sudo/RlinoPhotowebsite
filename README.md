# Rlino Photo — Website + Booking Form

A simple, dependency-free site (plain HTML/CSS/JS) with an interactive booking
form. No backend, database, or server required — form submissions are emailed
directly to you.

## Files

- `index.html` / `style.css` — a full one-page site (hero, services, gallery,
  booking form, contact) you can deploy as-is.
- `booking.html` / `booking-embed.css` — a standalone, light-themed version of
  **just the booking form**, meant to be embedded into an existing site (e.g.
  Wix, WordPress) via `<iframe>`.
- `squarespace-embed.html` — **use this one for Squarespace.** A single
  self-contained snippet (HTML + scoped CSS + JS all inline) designed to be
  pasted directly into a Squarespace Code Block — no external hosting or
  iframe needed. See "Embedding in Squarespace" below.
- `script.js` — shared logic for `index.html`/`booking.html`: mobile nav
  toggle, date validation (blocks past dates), form validation, and AJAX
  submission.

## 1. Activate email delivery (one-time, ~1 minute)

The form uses [FormSubmit](https://formsubmit.co) — a free service that
emails you form submissions with zero backend setup. It's already configured
to send to **rlinophoto@gmail.com**.

The **first** time the form is submitted, FormSubmit sends a confirmation
email to that address — click the "Confirm" link in it once, and every
submission after that (from anyone) lands straight in your inbox. Until you
confirm, submissions won't be delivered.

To test it: open `booking.html` (or `index.html`) in a browser, fill out the
form, and submit it. Then check rlinophoto@gmail.com (including spam) for the
FormSubmit confirmation email.

If you'd rather send to a different address, replace
`rlinophoto@gmail.com` in the form `action` URL in both `index.html` and
`booking.html`.

## 2. Embedding in Squarespace

1. Open the page (or add a new page) where you want the booking form —
   e.g. a "Book Now" page.
2. Click an insert point in the page content, open the block menu, and
   choose **Code** (under "More").
3. Open `squarespace-embed.html` from this repo, copy the **entire file**,
   and paste it into that Code Block.
4. Save and view the page. The form is scoped under
   `#rlino-booking-embed` with its own prefixed class names (`rb-...`), so
   it won't inherit or clash with your Squarespace theme's styles.
5. Squarespace's Code Block runs the `<script>` tag automatically, so the
   form works with no further setup — just confirm the FormSubmit email as
   described in step 1 above.

To change the accent color to match your brand, edit the `--rb-accent`
value near the top of the `<style>` block in `squarespace-embed.html`
before pasting.

## 3. Other embed method (Wix, WordPress, etc.)

`booking.html` / `booking-embed.css` / `script.js` are an alternative to
`squarespace-embed.html` for platforms that don't support inline Code
Blocks — host those three files publicly (e.g. Netlify or GitHub Pages) and
embed via `<iframe>`:

```html
<iframe
  src="https://yoursite.netlify.app/booking.html"
  style="width:100%; height:900px; border:0;"
  title="Book a session with Rlino Photo"
></iframe>
```

Not needed for Squarespace — use `squarespace-embed.html` instead (see
above).

## 4. Customize

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
