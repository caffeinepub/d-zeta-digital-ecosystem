# Specification

## Summary
**Goal:** Add secure Internet Identity-based admin authentication and authorization so only admins can access and use the /admin dashboard end-to-end.

**Planned changes:**
- Add an admin-only route gate for `/admin` that prompts logged-out users to sign in with Internet Identity, blocks signed-in non-admins with an access denied screen, and renders the dashboard only for authenticated admins.
- Implement/verify backend admin authorization support, including an `isCallerAdmin` query and admin-only guards on all admin dashboard data/mutation methods.
- Add a secure one-time bootstrap/claim mechanism to establish the first admin after deployment, with developer-facing comments describing the expected flow.
- Ensure the existing admin dashboard (at minimum Orders/Queue and Analytics panels) loads, fetches data, and performs mutations successfully for admins, and shows handled error states for non-admin attempts.

**User-visible outcome:** Visiting `/admin` prompts Internet Identity login when logged out; after signing in, admins can view and use the admin dashboard (including Orders/Queue updates and Analytics), while non-admin users see an access denied/handled error experience.
