---
name: Briefing de Clínica de Estética
description: Minimalist Black & White high-contrast design system built on Inter typography
colors:
  primary: "#09090B"
  neutral-bg: "#FFFFFF"
  neutral-secondary: "#FAFAFA"
  border: "#E4E4E7"
  text-muted: "#71717A"
  danger: "#DC2626"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 700
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.08em"
rounded:
  xs: "4px"
  sm: "8px"
  md: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1rem"
  button-secondary:
    backgroundColor: "{colors.neutral-secondary}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1rem"
  card:
    backgroundColor: "{colors.neutral-bg}"
    rounded: "{rounded.sm}"
    padding: "1rem"
---

# Design System: Briefing de Clínica de Estética

## Overview

**Creative North Star: "The Monochromatic Sanctuary"**

A high-contrast, editorial black-and-white design system tailored for high-end aesthetic clinic intake and strategy. By eliminating decorative fluff, soft pastel fills, and colored gradients, the interface achieves absolute clarity, executive focus, and stark visual authority.

Every element relies on crisp Inter typography, high-contrast borders, and stark monochromatic fills (`#09090B` and `#FFFFFF`).

**Key Characteristics:**
- **Pure Monochromatic Contrast**: Pure obsidian black paired with clean white and subtle zinc borders.
- **Unified Inter Typography**: Single typeface family driving all titles, body copy, inputs, buttons, and badges.
- **Stark Geometric Precision**: Sharp borders, subtle hover inversions, and clean structural rhythm.
- **Distraction-Free Intake**: No side preview drawers, floating widgets, or colored badges.

## Colors

A disciplined monochromatic palette designed for maximum WCAG AAA legibility and executive polish.

### Primary
- **Obsidian Black** (`#09090B`): Primary focus color, titles, active buttons, solid badges, and main structural text.

### Neutral
- **Pure White** (`#FFFFFF`): Primary background surface for cards, viewports, and inverted text.
- **Soft Zinc** (`#FAFAFA`): Secondary background surface for sidebars, inputs, and tab containers.
- **Subtle Border** (`#E4E4E7`): Clean divider lines, input strokes, and card borders.
- **Muted Text** (`#71717A`): Secondary subtitles, hints, meta information, and unselected tab labels.

### Danger
- **Crimson Red** (`#DC2626`): Alert badges, error banners, and destructive actions.

### Named Rules
**The Monochromatic Principle.** Colored backgrounds and decorative gradients are forbidden. Color is used strictly for state error feedback (`#DC2626`).

## Typography

**Display Font:** Inter (fallback: system sans-serif)  
**Body Font:** Inter (fallback: system sans-serif)  
**Label/Mono Font:** Inter / monospace for technical IDs  

**Character:** Clean, precise, and authoritative. Inter is used across all typographic scale levels to maintain visual unity.

### Hierarchy
- **Display** (800 weight, `2rem`, `1.15` line-height, `-0.02em` tracking): Module titles and primary screen headings.
- **Headline** (800 weight, `1.25rem`, `-0.02em` tracking): Card headings and auth screen titles.
- **Title** (700 weight, `1.05rem`): Header app title, card headers, and input labels.
- **Body** (400 weight, `0.9rem`, `1.5` line-height): Form descriptions, question text, and body copy.
- **Label** (700 weight, `0.75rem`, `0.08em` tracking, uppercase): Sidebar section headers, tags, and meta labels.

### Named Rules
**The Single Face Rule.** Inter is the exclusive typeface for all UI components. Mixing serif or decorative display fonts is prohibited.

## Layout

A responsive split-view topology for web and mobile viewports:
- **Desktop (`≥ 768px`)**: Sticky left sidebar (`300px` fixed width) with a fluid, comfortable main content area (`flex: 1`, `padding: 2.5rem 3.5rem`).
- **Mobile (`< 768px`)**: Collapsible sidebar navigation accessible via a "Módulos" header button that triggers a mobile navigation drawer.

## Elevation & Depth

Surfaces are flat at rest. Depth is conveyed entirely through high-contrast structural borders (`#E4E4E7` or `#09090B`) and subtle backdrop blurs on sticky headers and modals.

### Named Rules
**The Border-Over-Shadow Rule.** Containers use 1px solid borders for visual definition rather than ambient box-shadows.

## Shapes

- **Base Radius:** `8px` (`--radius-sm`) for inputs, buttons, and cards.
- **Pill Radius:** `9999px` (`--radius-full`) for badges and user profile pills.
- **Focus Rings:** High-contrast `2px` solid `#09090B` focus outlines.

## Components

### Buttons
- **Shape:** `8px` corner radius (`--radius-sm`).
- **Primary:** Solid black (`#09090B`) background with white text (`#FFFFFF`). Inverts to white background with black border on hover.
- **Secondary:** Light gray (`#FAFAFA`) background with 1px border (`#E4E4E7`).
- **Icon Minimal:** Transparent background with subtle border on hover.

### Inputs & Textareas
- **Style:** Light gray (`#FAFAFA`) fill with 1px border (`#E4E4E7`).
- **Focus:** Sharp black border (`#09090B`) transition with white background (`#FFFFFF`).

### Cards
- **Corner Style:** `8px` or `12px` radius.
- **Border:** 1px solid `#E4E4E7` at rest; highlights to 1px solid `#09090B` when filled or active.

## Do's and Don'ts

### Do:
- **Do** maintain strict WCAG AAA contrast ratios using `#09090B` on `#FFFFFF`.
- **Do** use `Inter` for all typography without exception.
- **Do** use `transform: scaleX(...)` for smooth progress bar transitions.

### Don't:
- **Don't** use colored gradients, pastel fills, or shadow overlays.
- **Don't** introduce secondary serif or handwritten font families.
- **Don't** render markdown preview drawers or export buttons on client intake screens.
