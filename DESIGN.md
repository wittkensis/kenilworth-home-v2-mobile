# Kenilworth Home — Design

## Intent

Replace the Tauri desktop app with a mobile-first web app accessible from any device. The core need: update home data (assets, maintenance, contacts, upgrades) from a phone without being at a desk.

The Tauri v1 → v2 local app versions had the right data model but wrong delivery. A web app on the VPS solves portability.

## Architecture Decisions

**Single SQLite file** over Neon PostgreSQL: Home data is personal and single-user. SQLite on the VPS host is simpler, no connection pool needed, and the data stays close to the app. A bind-mount volume survives container re-deploys.

**No multi-tenancy**: Personal use only. No auth tokens, no user IDs in the schema, no row-level security. The `APP_PASSWORD` gate is enough.

**Bottom sheets over page navigation**: All editing happens in sheets. Mobile browsers have back/forward gestures that conflict with multi-page navigation for CRUD flows. Sheets keep context and avoid the flash of a new page.

**BottomNav with 4 tabs**: Assets | Contacts | Maintenance | Upgrades. These are the four data domains — each gets one tab. The FAB is context-sensitive (creates a record in the active tab's domain).

## Data Model Philosophy

Each of the four domains is intentionally simple:

- **Assets**: Physical items in the home with warranty and purchase info
- **Contacts**: Service providers (contractors, utilities, vendors) with trade/category
- **Maintenance**: Tasks with due dates, recurrence, and completion tracking
- **Upgrades**: Improvement projects with status, budget, and priority

Relationships are minimal: a maintenance task can reference an asset; an upgrade can reference a contractor contact. These are convenience links, not constraints.

## Design System

Kenilworth v1.0, dark mode, folk-modernist palette. Same token set as Pipeline.
