# 10. Unified Dynamic Pagination

Date: 2026-05-19

## Status

Accepted

## Context

Originally, the CV Builder Pro application was planned to have a strict choice between:
1. **Single Page Mode**: Forcing the user's content to rigidly fit onto a single A4 page.
2. **Multi Page Mode**: Allowing the content to flow naturally across multiple A4 pages.

However, implementing two separate rendering paths introduces several issues:
- **Print Overflow Risk (Data Loss)**: In standard web browsers, PDF rendering engine margins vary slightly. A rigid `overflow-hidden` height boundary of 1123px (297mm) in "Single Page" mode could result in critical user data at the bottom of the page being clipped and permanently lost during PDF export.
- **UX Complexity**: Forcing users to select between "Single" and "Multi" layout options is redundant. Users ultimately want their CV to look professional. If their content naturally spills onto a second page, they want to see this immediately and have the tools to adjust it, rather than having the content hidden behind an overflow barrier.

We need a unified, safer, and simpler design that guides the user to fit their CV into 1 page when desired, without introducing clipping risks.

## Decision

We will implement a **Unified Dynamic Pagination** system as follows:

1. **Eliminate Strict Single-Page Clipping**:
   - The editor will always calculate and render page boundaries dynamically. There will no longer be a rigid `overflow-hidden` 1123px container limit that hides content.
   - The preview area will grow naturally to accommodate all pages (e.g. 1 page, 2 pages) while rendering dashed page boundary guides to show the user exactly where the printer margins lie.

2. **Remove Page Layout Toggle**:
   - Remove the "Định dạng Trang (Page Layout)" toggle from the UI (`LayoutForm.tsx`) to simplify layout configuration.

3. **Empower User-Led Layout Compression**:
   - Keep the live page status badge showing the current page count (e.g., "Số trang: 2 trang").
   - Retain the "Tự động vừa trang" (Auto-fit Page) button, section gaps, page padding, and typography selections.
   - If a user wishes to restrict their CV to a single page, they can easily observe the page count badge and adjust the spacing sliders (or click the Auto-fit button) until the badge displays "Số trang: 1 trang".

## Consequences

- **Positive**: Zero risk of print-time data loss. Content is never hidden by rigid CSS overflow boundaries.
- **Positive**: Extremely clean and unified UI. Reduced options in the layout settings panel makes styling less confusing.
- **Positive**: Consistent print output. The printer always prints all pages naturally while honoring `break-inside-avoid` rules on individual entries (experience items, projects, etc.).
- **Negative**: Users must actively adjust layout sliders or click Auto-fit if they want their CV to be exactly 1 page, rather than having a hard limit automatically enforce it. This is mitigated by clear visual feedback (the page count badge and page boundary lines).
