---
name: Ethereal Tech
colors:
  surface: '#15121b'
  surface-dim: '#15121b'
  surface-bright: '#3b3742'
  surface-container-lowest: '#0f0d15'
  surface-container-low: '#1d1a23'
  surface-container: '#211e27'
  surface-container-high: '#2c2832'
  surface-container-highest: '#37333d'
  on-surface: '#e7e0ed'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e7e0ed'
  inverse-on-surface: '#322f39'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#ffb869'
  on-tertiary: '#482900'
  tertiary-container: '#ca801e'
  on-tertiary-container: '#3f2300'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffdcbb'
  tertiary-fixed-dim: '#ffb869'
  on-tertiary-fixed: '#2c1700'
  on-tertiary-fixed-variant: '#673d00'
  background: '#15121b'
  on-background: '#e7e0ed'
  surface-variant: '#37333d'
typography:
  headline-lg:
    fontFamily: geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-desktop: 32px
  margin-mobile: 16px
---

## Brand & Style

The design system is built for a high-performance, developer-centric SaaS environment. It targets a sophisticated audience that values speed, clarity, and aesthetic precision. The personality is authoritative yet innovative, evoking the feeling of a cutting-edge laboratory where complex data is distilled into intuitive workflows.

The visual style is a fusion of **Minimalism** and **Glassmorphism**. It relies on deep blacks, subtle translucent layers, and high-contrast typography to create a sense of infinite depth. Every element is designed to feel like a precision instrument, utilizing thin borders and intentional whitespace to eliminate visual noise. The emotional response is one of calm focus, reliability, and "pro-tier" capability.

## Colors

The palette is anchored by a "True Dark" foundation. The primary background uses a near-black obsidian to ensure maximum contrast for vibrant accents. 

- **Primary (Violet):** Used for primary actions, progress indicators, and active states. It represents the "core energy" of the system.
- **Secondary (Cyan):** Reserved for data visualization, success states, and secondary highlights, providing a cool, technical contrast to the primary purple.
- **Surface & Borders:** A tiered system of grays defines depth. Surfaces use a slightly lighter charcoal to lift off the background, while borders are kept razor-thin and low-contrast to maintain a seamless, "unibody" look.

## Typography

This design system utilizes a mono-typeface approach to maintain a technical, cohesive aesthetic. The chosen font family provides a neutral yet modern structure that excels in both large display sizes and dense functional interfaces.

Headlines should use tight tracking and high weights to feel impactful and "engineered." Body text prioritizes readability with generous line heights. Labels and metadata should leverage uppercase transformations and slightly increased letter spacing to differentiate themselves from narrative content. For mobile devices, display type scales down aggressively to maintain hierarchy within narrow viewports.

## Layout & Spacing

The design system employs a **Fluid Grid** model based on a 12-column system. It relies on a rigorous 8pt spatial cadence (4px base unit) to ensure consistent alignment across all components.

- **Desktop:** 12 columns with 24px gutters. Use large margins (32px+) to allow the dark background to "breathe."
- **Tablet:** 8 columns with 16px gutters.
- **Mobile:** 4 columns with 16px margins. 

Layouts should favor vertical stacks with generous padding between sections (`xl` spacing) to reinforce the premium, unhurried feel. Information-dense areas (dashboards) should use a "nested grid" approach, where cards containerize their own internal spacing logic.

## Elevation & Depth

Depth in this system is conveyed through **Tonal Layers** and **Backdrop Blurs** rather than traditional heavy shadows.

1.  **Level 0 (Base):** The #09090b background. 
2.  **Level 1 (Cards/Surfaces):** #18181b with a 1px solid border (#27272a). 
3.  **Level 2 (Modals/Popovers):** Semi-transparent surfaces with a `20px` backdrop blur and a subtle inner-glow (a 1px white border at 5% opacity).
4.  **Shadows:** When necessary, use "Ambient Glows"—extra-diffused shadows that use a faint tint of the primary color (#8b5cf6) at very low opacity (10%) to suggest the element is emitting light.

## Shapes

The shape language is refined and approachable. The system uses a **Rounded** philosophy to soften the technical edge of the dark theme.

- **Standard Elements:** (Buttons, Inputs) use a 0.5rem (8px) radius.
- **Containers:** (Cards, Sections) use a 1rem (16px) radius for a more pronounced, "modern slab" look.
- **Interactive States:** When hovered, certain elements may subtly increase their perceived volume through light-refracting borders, but the corner radius remains constant to maintain grid integrity.

## Components

### Buttons
Primary buttons use a solid gradient of the primary color. Secondary buttons use the "Ghost" style: a transparent background with a 1px border (#27272a) that transitions to the secondary color on hover.

### Cards
Cards are the primary structural unit. They should feature a subtle top-down linear gradient (from #1c1c1f to #18181b) to simulate a physical surface catching light. Use `p-24` (md) for internal padding.

### Input Fields
Inputs are dark-filled (#09090b) with a 1px border. On focus, the border color shifts to the primary purple, and a subtle 4px outer glow is applied. Labels sit strictly above the input in the `label-sm` style.

### Chips & Badges
Small, pill-shaped elements used for status. They should use a low-opacity fill of the status color (e.g., 10% Cyan for "Success") with high-contrast text.

### Navigation Rails
Side navigation should be minimal, using icons with `1.5rem` sizing and `label-sm` text. Active states are indicated by a vertical 2px "indicator line" in the primary color on the far left of the item.

### Glow Elements
For "Pro" features or premium callouts, use a background "blur-orb"—a large, low-opacity radial gradient of the primary or secondary color positioned behind the content to create a soft atmospheric glow.