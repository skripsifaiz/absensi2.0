---
name: Lumina Admin
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#9b3e3b'
  on-tertiary: '#ffffff'
  tertiary-container: '#ba5551'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ae'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#7f2928'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system is built for administrative excellence in educational environments. It combines the rigorous structure of a SaaS dashboard with a welcoming, accessible atmosphere. The brand personality is **reliable, precise, and encouraging**, designed to reduce the cognitive load on school administrators and teachers.

The visual style follows a **Modern Corporate** aesthetic with a strong emphasis on **Minimalism**. It leverages high-contrast typography and generous whitespace to ensure clarity of data. Influenced by modern UI frameworks like Shadcn/UI, the system utilizes subtle depth through soft shadows and a refined color palette to create a focused, premium workspace.

## Colors
The color strategy is anchored by **Emerald Green**, pulled directly from the institution's heritage to symbolize growth, vitality, and balance. 

- **Primary Emerald (#059669):** Used for primary actions, success states, and brand-defining elements.
- **Slate Neutrals:** A sophisticated scale of Slate grays provides the structural foundation. Deep slate (#0f172a) is used for high-contrast typography, while lighter tints handle borders and backgrounds.
- **Functional Accents:** Vibrant greens for attendance "Present" markers, soft ambers for "Late," and muted reds for "Absent" ensure immediate data scannability.
- **Surface Strategy:** We use a "White-on-Gray" approach where the main background is a very light slate (#f8fafc) and primary content cards are crisp white (#ffffff) to create natural separation.

## Typography
The design system utilizes **Inter** exclusively to achieve a clean, utilitarian, and highly legible interface. The scale is designed for data-dense environments where hierarchy is paramount.

- **Headlines:** Use semi-bold weights with slight negative letter-spacing to appear modern and tight.
- **Body:** Standardized at 16px for optimal readability in reports and lists.
- **Labels:** Used for table headers and metadata, often employing medium or semi-bold weights at smaller sizes to maintain distinctiveness from body text.
- **Mobile Adaptation:** Large display titles scale down significantly on mobile to prevent awkward wrapping in narrow containers.

## Layout & Spacing
The layout follows a **Fluid Grid** model with strict 8px incremental rhythm.

- **Desktop:** A 12-column grid with 24px gutters. Sidebars are fixed at 280px, with the main content area expanding to a maximum of 1280px.
- **Tablet:** 8-column grid with 16px margins. Sidebars typically collapse into a hamburger menu or narrow icon-only rail.
- **Mobile:** Single-column layout with 16px safe-area margins.
- **Density:** Elements like table rows and list items should utilize "Tall" (16px) or "Compact" (8px) vertical padding depending on the volume of data displayed.

## Elevation & Depth
This design system uses **Tonal Layers** combined with **Ambient Shadows** to create a sense of organized stacking. 

- **Level 0 (Background):** Slate-50 (#f8fafc), flat.
- **Level 1 (Cards/Sheets):** White (#ffffff) with a 1px border (#e2e8f0). For focused areas, apply a soft, diffused shadow: `0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)`.
- **Level 2 (Dropdowns/Modals):** Pure white with a more pronounced shadow to indicate significant elevation above the interface plane.
- **Interactions:** Buttons use a subtle "lift" effect on hover, increasing shadow depth slightly rather than changing color dramatically.

## Shapes
The shape language is defined as **Rounded**, utilizing `rounded-xl` as the primary radius for major components.

- **Main Containers:** Cards, modals, and primary sidebar containers use a 1rem (16px) radius to create a friendly, modern feel.
- **Small Elements:** Buttons and input fields use a 0.5rem (8px) radius to maintain a professional, structured look while remaining cohesive with the larger containers.
- **Interactive States:** Focus rings follow the curvature of the element with a 2px offset to maintain visual harmony.

## Components
- **Buttons:** Primary buttons are solid Emerald Green with white text. Secondary buttons use a white background with a Slate-200 border and Slate-900 text.
- **Input Fields:** Clean, minimal fields with a 1px Slate-200 border. On focus, the border transitions to Emerald-500 with a subtle 2px emerald glow (ring).
- **Cards:** White background, 1px Slate-200 border, and `rounded-xl` corners. Headers within cards should have a subtle bottom border.
- **Attendance Chips:** Small, high-contrast badges with rounded-full corners. "Present" (Emerald/Light Emerald Bg), "Late" (Amber/Light Amber Bg), "Absent" (Rose/Light Rose Bg).
- **Data Tables:** Modern, borderless rows with subtle hover states (Slate-50). Header text in `label-sm` style (Slate-500, uppercase).
- **Sidebar:** A clean Slate-900 or white vertical bar. Active states are indicated by an Emerald-500 left-edge accent and a subtle background tint.