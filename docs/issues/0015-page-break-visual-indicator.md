---
title: "Page Break Visual Indicator on Live Preview"
status: ready-for-agent
type: hitl
blocked_by: 0013-multipage-schema-ui-toggle.md
---

## What to build

Render a dashed horizontal line labeled "Page Break" on the Live Preview panel every 297mm to help the user see exactly where each A4 page ends — without opening the print dialog.

## Acceptance criteria

- [ ] Only visible when `pageLayout === 'multi'`.
- [ ] A faint dashed horizontal rule is rendered at every 297mm mark in the live preview.
- [ ] The rule is labeled with a small non-printing label (e.g., "— Page 2 —").
- [ ] The rule is hidden from print output (`print:hidden`).

## Blocked by

- [0013-multipage-schema-ui-toggle.md](0013-multipage-schema-ui-toggle.md)
