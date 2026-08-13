# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19, Vite, Vanilla CSS, Supabase (Database, Auth & Row Level Security), Mobile-First layout.

## Users

Marketing agencies, branding consultants, design strategists, and aesthetic clinic owners operating with individual user accounts identified by Username.

## Product Purpose

An interactive, modular briefing collection application where each authenticated user (identified by Username) creates, manages, and owns their private clinic briefings stored securely in Supabase.

## Positioning

A secure, multi-tenant intake platform tailored for aesthetic clinics, replacing noisy forms and shared documents with isolated, username-owned digital briefings.

## Operating Context

Used by authenticated users logging in with a Username and Password to manage personal/agency briefings safely, accessible across desktop and mobile devices.

## Capabilities and Constraints

- User-Scoped Briefing Isolation: Each logged-in user accesses exclusively their own saved briefings tied to their `user_id`.
- Supabase Authentication: **Username + Password login & registration** (No email input required from the user; internal email mapping handled transparently).
- Automatic cloud auto-save and persistence per user in Supabase.
- Removed real-time Markdown preview drawer for a focused, step-by-step form layout.
- Minimalist Black & White design system (stark monochrome palette, high contrast, crisp typography using the **Inter** font family across the entire project).

## Brand Commitments

- Product Title: Briefing de Clínica de Estética | Coletor Interativo
- Primary Language: Portuguese (pt-BR)
- Font Family: **Inter** (unified across all titles, body text, buttons, and UI components)
- Visual Direction: Minimalist Black & White, high contrast, clean typography, luxury aesthetic clinic atmosphere.

## Evidence on Hand

- Runnable React + Vite application in `src/`.
- Pre-configured briefing module definitions in `src/data/briefingModules.js`.
- Supabase integration layer in `src/lib/supabase.js` and `src/services/briefingService.js`.

## Product Principles

1. **User Ownership & Isolation**: Strictly scope and isolate briefing data to the authenticated Username account via Supabase Auth and RLS.
2. **Simple Username Authentication**: Allow frictionless access using Username + Password without requiring personal email inputs.
3. **Frictionless & Focused Intake**: Streamline clinic discovery into clear steps, eliminating preview clutter.
4. **Secure Cloud Continuity**: Auto-save progress continuously while maintaining complete privacy for each user.
5. **Minimalist B&W Elegance**: High-contrast, monochromatic design system powered by unified **Inter** typography.
6. **Mobile-First Excellence**: Ensure flawless usability and touch interactions across all screen sizes.

## Accessibility & Inclusion

Strict WCAG AAA compliant black-and-white high contrast ratios, crisp Inter typographic hierarchy, explicit focus rings, and accessible form inputs.
