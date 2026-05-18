---
id: 0011
title: Stateless Avatar Upload & Multi-Template Render
type: AFK
status: completed
blocked_by: ["#0001", "#0007"]
---

## Parent

PRD-0001: [0001-cv-builder-prd.md](file:///d:/Workspace/Open_CV_Skill/docs/prd/0001-cv-builder-prd.md)

## What to build

Implement an end-to-end stateless Avatar image upload and render system. 
1. Add optional `avatar` string field in both Backend (`backend/app/models.py`) and Frontend (`frontend/src/types.ts`).
2. Add a beautiful circular Avatar Uploader UI in the "Personal Info" accordion that compresses image files to a 1:1 ratio square (300x300px) at 70% JPEG quality using native HTML5 Canvas, translating it into a Base64 string under 150KB.
3. Integrate rendering of the avatar in all 5 templates dynamically, matching layout styles and active theme colors.
4. Verify backend storage capability by adding integration tests in `backend/tests/test_api.py`.

## Acceptance criteria

- [ ] HTML5 Canvas automatically crops, resizes (300x300px), and compresses uploads to Base64 under 150KB.
- [ ] Circular upload button displays hover overlay camera icon, and a "Delete" link clears the avatar.
- [ ] Avatar renders perfectly in 5 templates:
  - `modern`: Circle top right.
  - `classic`: Square/circle right side of header contact block.
  - `creative`: Bold color-bordered circle next to name.
  - `executive`: Large circle inside the top right dynamic colored sidebar.
  - `minimal`: Centered circle directly above the name.
- [ ] CSS print rules ensure high-contrast, clean avatar rendering without clipping when printed.
- [ ] Automated integration test added to `test_api.py` validating avatar data storage.

## Blocked by

- #0001: Live Preview & Mẫu A4
- #0007: Style Customizers (Selectable Colors & Typographies)
