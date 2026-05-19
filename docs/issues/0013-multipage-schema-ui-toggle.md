---
title: "Multi-page Schema & UI Toggle"
status: completed
type: afk
blocked_by: none
---

## What to build

Implement the foundational schema and UI toggle for Multi-page CV support. This slice updates the data layer to support a new layout mode and adds a toggle switch in the UI (Settings tab) to let users choose between forcing a strict 1-page fit (`single`) or allowing the CV to flow across multiple pages (`multi`).

## Acceptance criteria

- [x] `CVSchema` interface in `types.ts` is updated to include an optional `pageLayout: 'single' | 'multi'` property.
- [x] Backward compatibility is ensured (if `pageLayout` is missing, it defaults to `single`).
- [x] A dropdown or toggle switch is added to the Style Customization grid in `App.tsx` labeled "Số trang / Pagination" (Consolidated to unified layout flow).
- [x] The toggle successfully updates `cvData.pageLayout` in the global state (Consolidated to unified layout flow).

## Blocked by

None - can start immediately
