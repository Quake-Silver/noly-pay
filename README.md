# Nolypay landing page

Vite + React + TypeScript. Built from the Figma frame "Landing page" (2026-REWIND file, node 349:13238).

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
```

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project → Import** the repo. The framework is detected as Vite (build `npm run build`, output `dist`).
3. Deploy. Every push to `main` redeploys.

Or without GitHub: `npx vercel` from this folder, then `npx vercel --prod`.

## Things to wire up before launch
- **Waitlist storage**: `src/waitlist.tsx` → `submit()` only fakes a delay. Replace the `setTimeout` with a real request.
- **Testimonials**: `src/App.tsx` → `TESTIMONIALS`. The arrows turn on once there are two or more.
- **Footer links**: Privacy, Terms, WhatsApp, Call us and social links point to `#`.
- **Images**: exported at 1x from Figma. Re-export at 2x for sharper retina screens and drop them into `public/img/` with the same names.
