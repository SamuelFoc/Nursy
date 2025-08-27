# Virtual Nurse (Inteligent Queueing System) — (Next.js + TypeScript + Tailwind)

A compact starter for a **virtual nurse** that gathers basic patient info (name → age → symptoms → allergies → meds). No external APIs; pure client demo. Built with **Next.js (App Router) + TypeScript + Tailwind**. Components are split and styled with a minimal, material-ish, futuristic healthcare feel.

> Reality check: this is a demo. **Not HIPAA/GDPR compliant** out of the box. In production, you must implement compliant storage, transport, authn/z, logging, and retention.

---

## Features

* Landing page with CTA → `/chat`
* Chat UI: message list, bubbles, composer (Enter to send)
* Hardcoded nurse flow in `lib/nurseFlow.ts`
* Dark, minimal styling; no UI libs

---

## Project Structure

```
app/
  page.tsx                # Landing page
  chat/
    page.tsx              # Chat page (uses ChatHeader with logo-only nav)
components/
  AppBar.tsx              # Top bar (landing variant shows nav; chat variant hides it)
  CtaSection.tsx
  FeatureCard.tsx
  FeaturesSection.tsx
  Hero.tsx
  InfoSection.tsx
  Logo.tsx                # Clickable logo → "/"
  SiteFooter.tsx
  icons.tsx               # SVG icons (Shield, Chat, Clipboard, Spark, Heartbeat)
  chat/
    ChatHeader.tsx        # Chat header with only logo (back to landing)
    Composer.tsx
    MessageBubble.tsx
    MessageList.tsx
lib/
  nurseFlow.ts            # Hardcoded intake logic
types/
  types.ts                # Message type
public/
  logo.svg                # App logo (place your SVG here)
```

---

## Requirements

* **Node.js 18+** (recommend 20)
* npm / pnpm / yarn

---

## Install & Setup

If starting fresh:

```bash
npx create-next-app@latest virtual-nurse --typescript --eslint
cd virtual-nurse
```

Install styling deps:

```bash
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Tailwind config — `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
export default config;
```

Global styles — `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Optional dark base */
html, body { height: 100%; }
body { color: rgb(226 232 240); background: #0b1220; }
```

(Optionally) path alias — `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["*"] }
  }
}
```

Copy the provided `app`, `components`, `lib`, and `types` folders into your project.
Place the logo at `public/logo.svg` and ensure `Logo.tsx` points to `/`.

---

## Run

```bash
npm run dev
# http://localhost:3000
```

## Build

```bash
npm run build
npm run start
```

---

## Swapping in a Real Backend (later)

* Replace the canned logic in `lib/nurseFlow.ts` with your API calls.
* Add schema validation, server actions / API routes, and persistence.
* Lock down PHI: TLS, encryption at rest, RBAC, audit trails, retention policies.

---

## Logo

Add your SVG to `public/logo.svg`. Example minimal mark (AI + healthcare) already provided. Use via:

```tsx
// components/Logo.tsx wraps next/link and inlines the SVG badge
<Logo href="/" />
```

---

## Notes

* Chat is **local-only**; no network calls.
* Keep prompts short, predictable, and accessible (plain language).
* Don’t ship this to prod without compliance hardening.
