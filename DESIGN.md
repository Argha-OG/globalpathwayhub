# DESIGN.md — GlobalPathwayHub Visual System

## 1. Design Mandate: Strict 4-Color Palette & Universal 8px Geometry

An international higher education platform built for direct university admissions, study destination comparison, and practical student survival guides.

### Core Principles
- **Universal 8px Border Radius (Strict Rule):** Every card, button, input, select, badge, image container, and modal uses an **8px border radius** (`--radius: 8px;`, mapped across `tailwind.config.js`).
- **Strict Color Palette:**
  - Deep Blue Primary: `#144272` (`hsl(211 70% 26%)`) — headers, hero canvas, primary navigation states, primary CTAs, footer.
  - Cyan Accent: `#3FC1C9` — secondary CTAs, interactive focus highlights, advisor buttons.
  - Warm Gold Accent: `#FFD749` — featured highlights, primary hero actions, badge pills, floating WhatsApp desk.
  - Offwhite Ground: `#F5F5F5` — application canvas, card insets, filter trays.
  - Neutral Ink: Solid Black (`#000000`) on light grounds and Crisp White (`#FFFFFF`) on `#144272` surfaces.
- **Distilled Copy & Icon Restraint:** Zero icons in navbar links, zero eyebrow kickers above headings, minimal functional icons, and concise scannable text across every page.

---

## 2. Color Tokens

- **Deep Blue (`#144272`):** Primary structural surfaces, typography headings, primary buttons (`text-white` or `text-[#FFD749]`).
- **Cyan (`#3FC1C9`):** Secondary interactive buttons (`text-[#144272]`), hover borders, active destination pills.
- **Amber Gold (`#FFD749`):** High-priority action controls (`text-[#144272]`), country codes, spotlight callouts.
- **Offwhite (`#F5F5F5`):** App background (`--background`), inset metric rows, neutral badges.
- **Crisp White (`#FFFFFF`):** Elevated cards and form inputs bordered with `#144272` opacity hairlines.

---

## 3. Hero & Page Rhythm

- **Homepage Hero:** Immersive `#144272` split canvas pairing a direct display headline (`Study Abroad. Without Guesswork.`), unified search bar, interactive country flag selector (`CountryFlag` SVG emblems for Malaysia, Canada, Australia, UK, France, USA, Germany, Ireland), and a live edge-to-edge campus viewport anchored by a single bottom metrics strip.
- **Guides & Survival Blog (`/guide`):** Clean editorial layout supporting both image-led articles and pure text-only guidelines seamlessly.
- **Typography:** `Outfit` (`sans-serif`), tight display tracking (`-0.03em`), high-contrast tabular numbers on facts and fee ranges.
