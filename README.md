# RG PRIME AUTO FINANCE — Website

Single-page React (Vite) site for RG PRIME AUTO FINANCE: hero with a 3D showroom car, services, an interactive
"how it works" stepper, an illustrative payment estimator, FAQ, and a consultation request form.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # serve the production build
npm run lint     # oxlint
```

## Before launch — client details

- **Contact info**: add real phone/email/address/hours in `src/config/site.js`. Empty values are not rendered.
- **Lead form backend**: the consultation form runs in **demo mode** (validates, shows a success state, sends
  nothing) until an endpoint is configured. Create `.env` with:

  ```
  VITE_LEAD_ENDPOINT=https://your-endpoint.example.com/leads
  ```

  Submissions are then POSTed as JSON (`name, email, phone, contactMethod, interest, timeframe, message, consent,
  source`). The endpoint must accept CORS from the site's origin.
- **Copy**: confirm the service list (`src/components/Services.jsx`) and FAQ answers (`src/components/Faq.jsx`) with the
  client. No rates, lender relationships, testimonials, or approval claims are included by design.

## 3D hero

`src/components/CarScene.jsx` (three.js + @react-three/fiber) is lazy-loaded in its own chunk. It falls back to a
CSS/SVG car (`CssCar.jsx`) when WebGL is unavailable, the context is lost, the scene errors, or the device signals
Save-Data or very low resources. Under `prefers-reduced-motion` it renders a single still frame; it pauses when
scrolled off-screen. Append `?static` to the URL to preview the fallback.

`three` is pinned to `~0.182.0`: r183+ logs a `THREE.Clock` deprecation warning with the current
@react-three/fiber release.
