---
id: 0007
title: Style Customizers (Selectable Colors & Typographies)
type: AFK
status: completed
blocked_by: ["#0001", "#0002"]
---

## Parent

PRD-0001: [0001-cv-builder-prd.md](file:///d:/Workspace/Open_CV_Skill/docs/prd/0001-cv-builder-prd.md)

## What to build

Style customizers including 6 dynamic professional colors (indigo, emerald, rose, amber, slate, bronze) and 3 fonts (Sans-serif, Elegant Serif, Modern Monospace). These settings are stored directly in the `cv_data` object in `themeColor` and `fontFamily` parameters, avoiding SQLite schema changes.

## Acceptance criteria

- [ ] Stored directly inside the `cv_data` JSON.
- [ ] Interactive UI selector dots for 6 color palettes.
- [ ] Dropdown font family selector.
- [ ] Updates the A4 simulation sheet instantly when selecting styling choices.

## Blocked by

- #0001: Live Preview & Mẫu A4
- #0002: Đăng ký Slug & Passcode
