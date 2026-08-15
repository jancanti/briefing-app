# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19, Vite, Vanilla CSS, Firebase (Cloud Firestore & Firebase Auth), Mobile-First & Desktop Responsive layout.

## Users

1. **Standard Users**: Marketing agencies, branding consultants, design strategists, and aesthetic clinic owners logging in with Username + Password to manage their private clinic briefings.
2. **Admin User (`jancanti@gmail.com`)**: System administrator with access to an exclusive Admin Panel to view, audit, copy .MD, and download .MD files for all saved briefings across the platform.

## Product Purpose

An interactive, modular briefing collection application where authenticated users create and manage their private clinic briefings, with dedicated Admin oversight and export capabilities for `jancanti@gmail.com`.

## Positioning

A secure, multi-tenant intake platform tailored for aesthetic clinics, offering an authenticated user experience and administrative oversight.

## Operating Context

Unauthenticated users see a clean B&W Login/Signup screen upon opening the application. Authenticated standard users manage their private briefings. Admin user `jancanti@gmail.com` accesses global briefings with export capabilities.

## Capabilities and Constraints

- Mandatory Auth Gate: The app opens directly to a full-screen Login/Signup view.
- Admin Panel (`jancanti@gmail.com`): Dedicated admin interface listing all platform briefings with "Copiar .MD" and "Baixar .MD" actions.
- User-Scoped Isolation: Standard users access exclusively their own saved briefings tied to their `user_id`.
- Firebase Authentication: Username/Email + Password login.
- Responsive Web & Mobile Layout: Clean desktop sidebar + main view, fluid mobile navigation toggle drawer for small viewports.
- Minimalist Black & White design system (stark monochrome palette, high contrast, crisp typography using the **Inter** font family across the entire project).

## Brand Commitments

- Product Title: Briefing de Clínica de Estética | Coletor Interativo
- Primary Language: Portuguese (pt-BR)
- Font Family: **Inter** (unified across all titles, body text, buttons, and UI components)
- Visual Direction: Minimalist Black & White, high contrast, clean typography, luxury aesthetic clinic atmosphere.

## Evidence on Hand

- Runnable React + Vite application in `src/`.
- Pre-configured briefing module definitions in `src/data/briefingModules.js`.
- Firebase integration layer in `src/lib/firebase.js` and `src/services/briefingService.js`.

## Product Principles

1. **Auth Gate & Admin Control**: Require user login before displaying briefing content, providing admin controls for `jancanti@gmail.com`.
2. **User Ownership & Isolation**: Scope standard user briefing data while allowing admin management.
3. **Flawless Multi-Device Responsiveness**: Deliver a robust experience across desktop and mobile devices.
4. **Frictionless Intake**: Streamline clinic discovery into clear steps with clean B&W aesthetic.
5. **Minimalist B&W Elegance**: High-contrast, monochromatic design system powered by unified **Inter** typography.

## Accessibility & Inclusion

Strict WCAG AAA compliant black-and-white high contrast ratios, crisp Inter typographic hierarchy, explicit focus rings, and accessible form inputs.
