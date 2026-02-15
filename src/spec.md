# Specification

## Summary
**Goal:** Re-run the build to ensure the D’ZETA app compiles and deploys successfully, with working end-to-end admin flows between the React frontend and Motoko backend.

**Planned changes:**
- Fix compile-time and runtime integration issues between frontend and backend (Candid/actor interface mismatches, missing exports, type mismatches, and any initialization/route issues causing blank screen or fatal console errors).
- Ensure the backend exposes and the frontend can successfully call all admin APIs used by the existing admin UI (isCallerAdmin, getAdminOrdersQueue, getAdminAnalytics, updateOrderStatus, and any access-control initialization invoked during actor setup).
- Verify and harden the one-time admin bootstrap flow via secureBootAdmin so the first admin can be assigned post-deployment, subsequent calls are rejected, and behavior aligns with the frontend’s admin token handling; add clear developer comments in backend/main.mo documenting bootstrap steps/parameters.

**User-visible outcome:** The app loads without fatal errors, admin users can bootstrap the first admin once after deployment, and the admin UI can verify admin status, fetch orders/queue, update order status, and load analytics successfully.
