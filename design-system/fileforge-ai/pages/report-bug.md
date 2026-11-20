# Page Design Override: Report a Bug (`/report-bug`)

## Purpose
Direct, high-utility diagnostic bug-reporting interface enabling users to send structured reports directly to the owner via a secure server route.

## Form & Component Rules
- Use `<sakuga-input>` for Name, Email, and Page URL.
- Use `<sakuga-radio>` / `<sakuga-tabs>` for Bug Type selection (Visual issue, Broken button, Upload issue, Compression issue, Conversion issue, Mobile issue, Performance issue, Other).
- Use `<sakuga-checkbox>` for consent and optional screenshot attachment.
- Use `<sakuga-button>` for the primary submit action with loading state spinner and burst confirmation.
- Use `<sakuga-toast>` (`forgeToast.success` / `forgeToast.error`) for instant feedback.
- Client auto-detects browser and operating system details.
- Anti-spam: honeypot field, rate limiting, and sanitization.
