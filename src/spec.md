# Specification

## Summary
**Goal:** Replace the current index page with a branded D’ZETA Homepage that uses the provided five-section copy, vintage-modern earth-tone styling, and correct navigation behavior.

**Planned changes:**
- Create a new Homepage component rendered at route `/` with five sections in the user-specified order: Hero (headline, sub-headline, 2 CTAs), “The Digital Edge” 3-item grid, “The Social & Eco Impact” section with a 3-item live counter area, “Explore Our Space (370 m²)” with the four zones and descriptions, and a footer matching the provided footer copy.
- Wire Hero CTA buttons to existing TanStack Router routes: primary CTA to an existing menu/ordering route; secondary CTA to an existing exploration route (museum and/or booking), using client-side navigation.
- Apply “Vintage Modern” homepage-only styling using earth tones (Deep Forest Green, Terracotta, White Smoke) and serif headings + sans body fonts consistent with current Tailwind configuration.
- Update routing/navigation assumptions now that `/` is the Homepage: ensure `/museum` remains the Museum page, adjust BottomNav active-state so “Museum” is not active on `/`, and update any “Back to Home” link (e.g., OrderStatusPage) to go to `/`.
- Implement the Homepage live counter block with the three draft counter labels, using existing metrics where available and falling back gracefully to placeholders (e.g., `—`) if metrics are missing/unavailable.

**User-visible outcome:** Visiting `/` shows the new D’ZETA Homepage with the five requested sections and styling; the two CTAs navigate to existing ordering and exploration routes without page refresh; counters display the three categories with safe fallbacks; navigation reflects `/` as Home while `/museum` remains accessible.
