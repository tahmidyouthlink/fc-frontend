# PoshaX — Fashion E‑commerce Website

Customer-side codebase for the **PoshaX Fashion E‑commerce Website** built with **Next.js (App Router)**. This project powers the customer‑facing storefront, authentication, checkout, and order management flows.

---

## 🚀 Tech Stack

**Core Framework**

- [Next.js 14 (App Router)](https://nextjs.org/) — React framework for server‑side rendering and routing.
- [React 18](https://react.dev/) — UI library.
- [NextAuth.js](https://next-auth.js.org/) — Authentication (credentials + Google).

**Styling & UI**

- [Tailwind CSS](https://tailwindcss.com/) — Utility‑first CSS.
- [@nextui-org/react](https://nextui.org/) — UI component library.
- [React Icons](https://react-icons.github.io/react-icons/) — Icon library.

**Forms & State**

- [React Hook Form](https://react-hook-form.com/) — Form handling & validation.
- Context API — Global loading states.

**Animations & Effects**

- [GSAP](https://greensock.com/gsap/) + [@gsap/react](https://www.npmjs.com/package/@gsap/react) — Animations.
- [React Confetti](https://www.npmjs.com/package/react-confetti) — Celebration effects.
- [Lottie](https://lottiefiles.com/) via `@lottiefiles/dotlottie-react` — Animated illustrations.

**Utilities & Tools**

- [jsBarcode](https://github.com/lindell/JsBarcode) — Barcode generation.
- [@react-pdf/renderer](https://react-pdf.org/) — PDF generation (invoices, policies).
- [Sharp](https://sharp.pixelplumbing.com/) — Image optimization.

**Developer Experience**

- ESLint + Prettier — Code quality and formatting.
- Prettier Tailwind Plugin — Tailwind class sorting.
- PostCSS + Autoprefixer — CSS processing.

---

## 📂 Project Structure

The project follows a modular structure with clear separation of concerns:

- `app/` — Next.js App Router pages and layouts.
  - `(withLayout)/` — Main customer‑facing pages with common layout (shop, product, checkout, etc.).
  - `(withoutLayout)/` — Pages without global layout (e.g., Google login).
  - `api/` — API routes (auth, orders, user data, uploads).
  - `actions/` — Server actions (authentication).
- `components/` — Reusable UI components organized by feature.
- `config/` — Static site & company configuration.
- `contexts/` — React Context providers (e.g., loading).
- `data/` — Static data (cities, sample policies, payment methods).
- `lib/fetcher/` — Centralized fetch utilities (`rawFetch`, `tokenizedFetch` etc.).
- `utils/` — Helper functions (auth, order calculations, date formatting etc.).
- `public/` — Static assets (SVGs, images).

---

## ⚙️ Setup & Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone git@github.com:tahmidyouthlink/fc-frontend.git .

# Install dependencies
npm install
```

### Running Locally

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

### Linting & Formatting

```bash
npm run lint
```

Formatting is handled automatically by Prettier and the Tailwind Prettier plugin.

---

## 🔑 Key Features

- **Authentication** — Credentials & Google login via NextAuth.js.
- **Product Catalog** — Product listings, filtering, product detail pages.
- **Checkout Flow** — Cart, address management, payment selection, confirmation.
- **Order Management** — Order history, order details, returns, tracking.
- **Policies & Legal** — Documents for privacy, returns, shipping, and terms.
- **User Profile** — Manage personal info, delivery addresses, and security settings.
- **Interactive UI** — Animations (GSAP, Lottie, Confetti), responsive design.
- **PDF Support** — Order invoices and policies downloadable as PDFs.

---

## 🤝 Contributing

This repository is **private and proprietary**. Contributions are managed internally by the YouthLink Tech. team. External contributions are not accepted.

---

## 📜 License

This project is **proprietary software**. All rights reserved by **PoshaX**. Unauthorized use, distribution, or modification of this code is strictly prohibited.

---

**Developed with ❤️ by YouthLink Tech. team for PoshaX.**
