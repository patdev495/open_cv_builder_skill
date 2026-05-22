# 8. Interactive Portfolio Commercial Suite

Date: 2026-05-18

## Status

Accepted

## Context

To transition CV Builder Pro from a static resume editor into a highly competitive commercial SaaS product, we need key differentiators (USPs) that standard template platforms do not offer.
Specifically, we need to:
1. Elevate the visual aesthetics of the shared public CV beyond basic black-and-white page copies.
2. Allow candidates to showcase modern dynamic projects (like interactive designs, video demos, and live repository metrics) directly on their profile.
3. Provide high-value, actionable insights to candidates regarding how recruiters interact with their shared CVs.

Doing this introduces architectural challenges:
- High performance rendering requirements for animations and real-time client-side interactivity.
- Preserving print fidelity; the online view must look like an interactive website, but the downloaded/printed PDF must remain clean, standard, and fully ATS-friendly.
- Managing database read/write volume for analytics tracking without overwhelming our SQLite backend.

## Decision

We will design and implement the **Interactive Portfolio Commercial Suite** as follows:

1. **Dynamic Theme Mode (Borderless Glassmorphic Dashboard)**:
   - The creator can save a default theme (`light`, `dark`, or `auto`) in the **CV Schema**.
   - On the public **Slug** view, visitors are presented with a premium Dark/Light mode toggle.
   - When **Dark Mode** is active, the simulated A4 page outline is hidden. The layout transitions into a borderless digital portfolio dashboard utilizing dynamic gradients, translucent glassmorphic components, and micro-interactions.
   - Using CSS media queries (`@media print`), all interactive layouts, dark background colors, and neon boundaries are stripped during browser printing, automatically rendering a pure light A4 sheet optimized for ATS engines.

2. **Polymorphic Project Embeds (`embedUrl`)**:
   - Instead of polluting the **CV Schema** with multiple third-party fields (e.g. `githubUrl`, `figmaUrl`, `youtubeUrl`), a single generic `embedUrl` field is added to the project entity.
   - The frontend rendering engine inspects the domain pattern of the `embedUrl` and renders specific high-fidelity glassmorphic widgets (e.g., GitHub repo cards, embedded Figma design frames, embedded YouTube players, or interactive sandbox spaces).
   - For print sheets, the engine replaces active iframes and embed cards with clean, shortened text URLs to maintain document utility.

3. **Granular Engagement Analytics**:
   - A client-side activity tracker anonymously measures user scrolling, hover duration on specific sections (e.g., how long the reader stays focused on "Projects" vs "Education"), link clicks, and PDF exports.
   - These events are batch-transmitted to a new `/api/analytics` endpoint and persisted in a lightweight `cv_analytics` SQLite table.
   - In the creator's admin panel, a high-fidelity visual dashboard compiles these metrics into interactive charts, showing candidates geographic viewing clusters, focus heat-maps, and download conversion rates.

## Consequences

- **Positive**: Extremely strong USP. It makes shared CVs look incredibly professional and highly modern compared to traditional competitors.
- **Positive**: Complete print compatibility. ATS scans and PDF prints are preserved perfectly.
- **Positive**: Clean data modeling. Using a single `embedUrl` allows the schema to scale without schema updates when new platform embeds are added.
- **Positive**: High commercial viability. Analytics dashboards provide a natural gating mechanism for premium/VIP monetization tiers.
- **Negative**: Increased SQLite write operations for analytics logging. This will be mitigated by batching events and rate-limiting analytics payloads in the API layer.
