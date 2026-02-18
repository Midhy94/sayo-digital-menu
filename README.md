# SAYO Digital Menu

Premium, Apple-level digital menu experience for **SAYO Pan-Asian Restaurant**. Built with React, TypeScript, Framer Motion, and the iOS 26 design system. Fully responsive, RTL-ready (English / Arabic), with glassmorphism, spring animations, and an intuitive filter and modal flow.

---

## Features

- **iOS 26 design system** — Soft glassmorphism, blur, large radii, spring motion, 8pt grid
- **Hero** — Cinematic food imagery, overlay, smooth scroll indicator
- **Star Items / Chef’s Specials** — Horizontal scroll, premium cards, “Chef’s Special” pill
- **Menu by section** — Appetizers, Mains, Desserts, Drinks, Combos, etc., with clear hierarchy
- **Dish cards** — Hover lift, soft shadow, open in full-screen modal
- **Premium dish modal** — Full-screen glass sheet, image area, prev/next navigation, drag-down to close (mobile), Add to Order CTA
- **Filters** — Category, diet (Veg / Non-Veg), price range, sort (default, popularity, price), Chef’s Special toggle; iOS-style segmented controls and toggles; slide-up drawer on mobile, sticky panel on desktop
- **Multilingual (EN / AR)** — i18next, RTL layout, direction-aware UI, Tajawal for Arabic
- **Theme** — Dark (default) and light with system preference support
- **Accessibility** — Skip link, focus visible, ARIA, semantic HTML

---

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build for production

```bash
npm run build
```

Output is in `dist/`.

### Preview production build

```bash
npm run preview
```

---

## Project structure

```
src/
  components/     # Navbar (Header), Hero, LanguageSwitcher, FilterPanel,
                  # StarItemsSection, MenuGrid, DishCard, DishModal
  contexts/       # MenuContext, LanguageContext, ThemeContext
  hooks/          # useFilter, useModalNavigation
  i18n/           # i18next config and locales (en.json, ar.json)
  data/           # menuData.ts (dishes, category order)
  styles/         # global.css, ios-theme.css
  types/          # menu.ts (Dish, MenuFilters, etc.)
```

---

## Tech stack

- **React 18** (functional components, hooks)
- **TypeScript**
- **Vite**
- **Framer Motion** — Spring animations, AnimatePresence, drag
- **react-i18next / i18next** — EN + AR, RTL
- **Context API** — Menu, language, theme

---

## Configuration

- **Menu data** — Edit `src/data/menuData.ts` to add or change dishes and categories.
- **Locales** — Edit `src/i18n/locales/en.json` and `ar.json` for copy.
- **Theme tokens** — `src/styles/global.css` (colors, spacing) and `src/styles/ios-theme.css` (radii, spring, glass).

---

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). RTL and `backdrop-filter` are used; older browsers may need fallbacks.
