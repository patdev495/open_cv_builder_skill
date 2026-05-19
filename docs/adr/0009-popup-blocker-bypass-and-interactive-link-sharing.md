# 9. Popup Blocker Bypass and Interactive Link Sharing

Date: 2026-05-19

## Status

Accepted

## Context

When users of CV Builder Pro click "Save & Publish" (for new CVs) or "Update CV" (for existing CVs), we want to provide immediate visual confirmation of the published URL and automatically open the public CV page in a new browser tab. 

However, modern web browsers enforce strict security policies regarding `window.open`:
- Any `window.open` call executed asynchronously (such as after an `await` database write API call) is identified as a non-user-initiated pop-up.
- As a consequence, browsers block the new tab and show a "Pop-up blocked" warning to the user.
- This creates a bad user experience where users are unaware that their CV was published or updated, and they do not know what the public URL is.

We need a solution that:
1. Opens a new tab in a pop-up-blocker-safe way.
2. Displays a high-fidelity visual experience while the asynchronous network request is running.
3. Redirects to the correct URL once the save operation succeeds.
4. Closes gracefully if the save operation fails.
5. Provides a beautiful fallback and copyable link interface on the main editor in case pop-ups are strictly blocked at the browser config level.

## Decision

We will implement the **Popup Blocker Bypass and Interactive Link Sharing** system as follows:

1. **Synchronous Window Opening with Loading Placeholder**:
   - Immediately when the user clicks the "Save & Publish" or "Update CV" button, we execute `const newWindow = window.open('', '_blank')` synchronously in the main thread of the click event handler. Since this is direct synchronous execution, browsers treat it as user-initiated and allow it.
   - We immediately write a beautiful, dark-themed, glassmorphic loading document with a smooth neon-spinning loader and Vietnamese/English translation inside this blank window:
     ```html
     <body style="background: #0b0f19; ...">
       <div style="animation: spin 1s ..."></div>
       <p>Đang xuất bản CV...</p>
     </body>
     ```
   - This ensures the user receives instant visual feedback on their action while the actual background request starts.

2. **Asynchronous Redirection and Error Cleanup**:
   - We then trigger the asynchronous backend API call (`api.createCV` or `api.updateCV`).
   - If the API succeeds, we transition the new window's URL to the published slug path: `newWindow.location.href = targetUrl`.
   - If the API fails (e.g. invalid passcode, server error), we immediately close the newly opened window using `newWindow.close()` and show the corresponding error toast on the main editor page to prevent leaving a hanging loader tab.

3. **Interactive Toast Link Card**:
   - We enhance the `statusMessage` schema in `useCVEditor` to support an optional `link` property.
   - When a CV is successfully saved or updated, the success toast in `EditorWorkspace` displays a premium, glassmorphic **Link Card** showing the public URL.
   - This card includes a **Copy Link** button with a dynamic micro-interaction: clicking it copies the link and temporarily changes the toast text to "Đã sao chép liên kết!" ("Link copied to clipboard!") for 2 seconds to give immediate positive feedback.
   - A secondary **Open Link** button is provided as a perfect fallback to allow manual navigation if pop-ups are globally disabled in the browser settings.

## Consequences

- **Positive**: Zero pop-up blocker warnings. The new tab opens flawlessly on all major modern browsers (Chrome, Safari, Edge, Firefox).
- **Positive**: Exceptional visual flow. The transitional dark loader matches the high-end neon aesthetic of the application, keeping the user engaged during saving.
- **Positive**: High accessibility. The Copy Link and Open Link buttons in the editor toast provide an easy, reliable fallback and copying mechanism.
- **Positive**: Clean recovery. Errors close the blank tab automatically, leaving the workspace clean.
- **Negative**: The browser history of the newly opened tab contains the written document, which could theoretically be navigated back. This is negligible because the user is redirected immediately upon save success.
