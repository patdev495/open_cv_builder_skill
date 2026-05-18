---
id: 0006
title: Bilingual Localization (Vietnamese & English UI toggle)
type: AFK
status: completed
blocked_by: ["#0001"]
---

## Parent

PRD-0001: [0001-cv-builder-prd.md](file:///d:/Workspace/Open_CV_Skill/docs/prd/0001-cv-builder-prd.md)

## What to build

A language selector toggle in the header. Upon toggle, the entire UI labels (left panel, buttons, settings, placeholders) switch instantly between Vietnamese and English, retaining all entered CV user values.

## Acceptance criteria

- [ ] Language toggle works instantly without reloading the page.
- [ ] Setting value persists across page reloads using browser local storage.
- [ ] Translates all field headers, sidebar, templates selector, and action buttons.
- [ ] Retains the current CV content values upon toggling.

## Blocked by

- #0001: Live Preview & Mẫu A4
