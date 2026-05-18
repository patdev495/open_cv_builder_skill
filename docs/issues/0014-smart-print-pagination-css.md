---
title: "Smart Print Pagination CSS"
status: ready-for-agent
type: afk
blocked_by: 0013-multipage-schema-ui-toggle.md
---

## What to build

Implement robust CSS print pagination logic so that CV content flows beautifully across multiple pages when printed. If the user selects `single` mode, the CV container rigidly clips at 297mm height. If `multi` mode is selected, the container expands vertically, and discrete blocks (experience, projects, skills, etc.) are protected from being cut in half using `break-inside-avoid`.

## Acceptance criteria

- [ ] When `pageLayout` is `single`, the A4 preview container retains `min-h-[297mm]` and `overflow-hidden`.
- [ ] When `pageLayout` is `multi`, the container can grow beyond 297mm naturally on the screen.
- [ ] Tailwind utility classes `break-inside-avoid` (or standard `page-break-inside: avoid`) are applied to all granular content blocks (experience items, education entries, project cards).
- [ ] When triggering Print-to-PDF in `multi` mode, items do not split awkwardly across two pages (e.g., an experience title on page 1 and its bullet points on page 2).

## Blocked by

- [0013-multipage-schema-ui-toggle.md](0013-multipage-schema-ui-toggle.md)
