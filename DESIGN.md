---
name: Luminous Hive
colors:
  surface: '#faf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeeb'
  surface-container-high: '#e9e8e5'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1a'
  on-surface-variant: '#4f4536'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f2f1ee'
  outline: '#817664'
  outline-variant: '#d3c5b0'
  surface-tint: '#7b5800'
  primary: '#7b5800'
  on-primary: '#ffffff'
  primary-container: '#d4a23b'
  on-primary-container: '#533a00'
  inverse-primary: '#f3be55'
  secondary: '#5c614d'
  on-secondary: '#ffffff'
  secondary-container: '#e0e5cc'
  on-secondary-container: '#626753'
  tertiary: '#675e46'
  on-tertiary: '#ffffff'
  tertiary-container: '#b5a98e'
  on-tertiary-container: '#463e29'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdea6'
  primary-fixed-dim: '#f3be55'
  on-primary-fixed: '#271900'
  on-primary-fixed-variant: '#5d4200'
  secondary-fixed: '#e0e5cc'
  secondary-fixed-dim: '#c4c9b1'
  on-secondary-fixed: '#191d0e'
  on-secondary-fixed-variant: '#444937'
  tertiary-fixed: '#efe1c4'
  tertiary-fixed-dim: '#d2c5a9'
  on-tertiary-fixed: '#211b09'
  on-tertiary-fixed-variant: '#4e4630'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e3e2e0'
  honey-gold: '#D4A23B'
  olive-drab: '#6B705C'
  earth-umber: '#433B26'
  cream-luminous: '#FAF9F6'
  slate-deep: '#2F3B43'
  charcoal-ink: '#121517'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 40px
    fontWeight: '500'
    lineHeight: 48px
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-md:
    fontFamily: EB Garamond
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  margin-mobile: 20px
  margin-desktop: 80px
  gutter: 24px
  max-width: 1200px
---

## Brand & Style

This design system is crafted for a premium apitourism and wellness experience, blending the artisanal warmth of traditional beekeeping with a modern, professional wellness aesthetic. The brand personality is grounded, nurturing, and sophisticated—evoking the serene landscapes of La Pampa.

The visual style follows a **Modern Organic** approach. It leverages high-quality whitespace and luminous surfaces to create a sense of calm, while incorporating tactile elements like subtle paper grains and soft, wood-inspired textures. The interface should feel "breathtakingly quiet," using fluid, organic lines and honeycomb-inspired geometry to connect the digital interface to the physical world of nature and honey.

## Colors

The palette is rooted in the natural lifecycle of the hive and the earth. 

- **Primary (Honey Gold):** Used for calls to action, active states, and key brand highlights. It represents energy, warmth, and the core product.
- **Secondary (Olive Green):** Represents the flora and the natural environment of La Pampa. Use for secondary actions and success states.
- **Tertiary (Earth Brown):** A grounding color used for structural elements or subtle backgrounds to provide depth.
- **Neutral (Soft Cream):** The primary background color. It is warmer than pure white, reducing eye strain and feeling more "paper-like."
- **Dark Accents (Charcoal Ink):** Reserved for high-contrast typography and borders to ensure professional legibility and authority.

## Typography

This system pairs the graceful, classical elegance of **EB Garamond** with the clean, geometric versatility of **Montserrat**. 

- **EB Garamond** should be used for all editorial headings and display text. It conveys trust, history, and a premium "artisanal" feel.
- **Montserrat** is the functional workhorse. Use it for body copy, buttons, labels, and navigation. Its openness ensures legibility even on smaller mobile devices.
- **Hierarchy:** Ensure a clear distinction between levels. Display titles should use tighter letter-spacing to feel more "designed," while labels use wider spacing for a technical, precise look.

## Layout & Spacing

The layout is governed by a **Fixed-Fluid Hybrid Grid**. Content is centered within a 1200px container on desktop to maintain focus and premium "breathing room."

- **Desktop:** 12-column grid with 24px gutters and generous 80px side margins.
- **Tablet:** 8-column grid with 24px gutters and 40px margins.
- **Mobile:** 4-column grid with 16px gutters and 20px margins.

Spacing follows an 8px base unit. Use larger vertical spacing (64px+) between major sections to emphasize the "calm" brand pillar. Elements should never feel cramped; when in doubt, add more whitespace.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and **Ambient Shadows**. Instead of harsh black shadows, use "Tinted Shadows"—shadows that pull color from the Earth Brown or Olive palette at very low opacities (e.g., 5-10%).

- **Level 1 (Surface):** The Soft Cream background.
- **Level 2 (Cards):** Slightly elevated using a very soft, diffused shadow (20px blur, 4px Y-offset) or a 1px border in a muted Earth Brown tint.
- **Floating Elements:** Modals and menus use a double-shadow technique (one tight, one broad) to appear "lifted" off the page like a piece of high-quality stationery.
- **Backdrop Blurs:** Use subtle blurs on fixed navigation bars to create a "glass-on-paper" effect that maintains the luminous quality of the brand.

## Shapes

The shape language is defined by **Soft Geometricism**. 

- **Standard Elements:** Buttons and input fields use a 0.5rem (8px) radius to feel approachable but professional.
- **Large Containers:** Cards and image containers use 1rem (16px) or 1.5rem (24px) to emphasize the organic, "rounded-corner" nature of the brand.
- **Honeycomb Accents:** Utilize hexagonal masks for specific highlight images or as subtle, low-opacity background patterns. 
- **Organic Lines:** Use curved dividers (SVGs) instead of straight horizontal rules to separate sections, mimicking the flow of honey or natural terrain.

## Components

- **Buttons:** Primary buttons use a Honey Gold fill with Charcoal Ink text. Secondary buttons use a transparent background with an Olive Green border. All buttons have a subtle "press" state where the shadow reduces, creating a tactile feel.
- **Cards:** Cards should have a Soft Cream or pure White background, a very thin muted-brown border, and generous internal padding (32px).
- **Inputs:** Form fields use a Soft Cream background that is slightly darker than the page background to create a "inset" look. The focus state is a 2px Honey Gold border.
- **Chips/Badges:** Use the Olive Green at 10% opacity with 100% opacity text for labels like "Organic" or "Limited Edition."
- **Imagery:** Photos should be luminous and warm-toned. Use soft-focus backgrounds to maintain the "calm" aesthetic.
- **Interactive Patterns:** Incorporate a subtle "ripple" effect or a smooth transition when hovering over cards, echoing the fluidity of honey.