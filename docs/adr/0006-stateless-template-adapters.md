# 6. Stateless Template Adapters

Date: 2026-05-18

## Status

Accepted

## Context

The `App.tsx` file had grown to over 3200 lines, mixing application state management, sidebar form rendering, and the heavy JSX mapping for 5 distinct CV templates. 
This caused significant architectural friction:
- **Lack of Locality**: A design tweak or bug fix in one template required navigating past thousands of lines of unrelated code, risking accidental breakage of other templates or the core `Live Preview` engine.
- **Low Leverage**: Adding a new template required modifying the core rendering logic of `App.tsx`.
- **Dynamic Section Ordering**: Since templates have different grid layouts (1-column vs 2-column), the logic mapping `cvData.sectionOrder` needs to be specific to each template layout, further complicating the central file.

## Decision

We will extract all CV template rendering logic out of `App.tsx` into independent adapter modules located in `src/templates/` (e.g., `ModernTemplate.tsx`, `CreativeTemplate.tsx`). 

All templates must strictly satisfy a standard `TemplateProps` interface:

```typescript
import { CVData, ColorTheme } from '../types';

export interface TemplateProps {
  cvData: CVData;          // The full CV Schema data
  activeColor: ColorTheme; // The resolved color theme object
  t: any;                  // i18n translation function
}
```

A new `TemplateRenderer.tsx` acts as the seam, dynamically selecting the correct adapter based on the `templateId` and passing it the `TemplateProps`.

Templates must remain **Stateless Pure Components**. They must not fetch data, manage internal React state, or trigger side effects. They are purely responsible for transforming the `CV Schema` into UI and respecting their own internal `sectionOrder` iteration rules.

## Consequences

- **Positive**: `App.tsx` is dramatically simplified (losing over 1500 lines of hardcoded JSX).
- **Positive**: Modifying or creating new templates is completely isolated and safe.
- **Negative**: We introduce a new layer of component abstraction (`TemplateRenderer`), which adds minor file-jumping overhead.
