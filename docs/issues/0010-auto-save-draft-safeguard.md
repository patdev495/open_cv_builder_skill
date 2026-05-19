---
id: 0010
title: Seamless Auto-Save Draft Safeguard
type: AFK
status: completed
blocked_by: ["#0001"]
---

## Parent

PRD-0001: [0001-cv-builder-prd.md](file:///d:/Workspace/Open_CV_Skill/docs/prd/0001-cv-builder-prd.md)

## What to build

Auto-saves CV draft locally to browser `localStorage` as the user edits, protecting drafts from accidental reloads or crashes. Provides a recovery banner when unfinished changes exist.

## Acceptance criteria

- [x] Edits trigger debounce local storage write (e.g., 500ms).
- [x] Page reload fetches draft gracefully.
- [x] "Save to Cloud" clears local storage draft successfully.

## Blocked by

- #0001: Live Preview & Mẫu A4
