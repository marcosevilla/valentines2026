# UX / Design Audit: Scream Queens: Six Degrees

**Date:** 2026-02-10
**Context:** Valentine's Day gift. PJ will play it once, on her phone, probably on Feb 14. First impressions are everything.

---

## P0 — Must Fix Before Feb 14

### 1a. Keyboard pushes chain off-screen during chain building
**Problem:** When PJ taps the search input, the mobile keyboard takes ~50% of the viewport. The chain cards use `dvh` units and sit above the search. With keyboard open, chain and/or search results will be hidden.
**Impact:** Core gameplay broken on mobile.
**Fix:** Restructure so search input is pinned to top with results as a bottom-sheet overlay, or collapse chain when keyboard opens. At minimum, use `visualViewport` API to detect keyboard and shrink cards aggressively.
**Files:** `components/round/ChainBuilder.tsx`

### 1b. Search results dropdown hidden by keyboard
**Problem:** `SearchResults` renders absolute below the input. On mobile with keyboard, dropdown extends below visible viewport.
**Fix:** Render dropdown above input (`bottom: 100%`) or as a full-screen overlay/bottom sheet on mobile.
**Files:** `components/round/SearchResults.tsx`

### 2a. Intro screen doesn't explain the game well enough
**Problem:** "Connect two actresses through the movies and shows they share with other actors" is abstract. PJ likely doesn't know what "Six Degrees" means as a game mechanic.
**Fix:** Add a brief concrete example below the description, or a small visual showing the chain concept.
**Files:** `components/screens/IntroScreen.tsx`

### 4a. Word accumulation doesn't register
**Problem:** Each round's word appears during the clip and disappears. No accumulation. By celebration, PJ may not realize the words formed a sentence.
**Fix:** Add a persistent accumulating word display. After each round, show collected words so far (e.g., "Will you ___").
**Files:** `components/round/VideoClip.tsx`, `components/round/ChainBuilder.tsx`

### 5a. No network error handling in search/validate
**Problem:** `tmdb.ts` fetch calls have no try/catch. Network failure = spinner stuck forever.
**Fix:** Wrap all fetch calls in try/catch. Return empty arrays on search failure, false on validation failure. Add `.finally()` to clear loading state.
**Files:** `lib/tmdb.ts`, `components/round/SearchInput.tsx`

### 7a. Video fallback is bare
**Problem:** If clips don't exist, fallback is just a portrait + movie name with no animation. Celebration montage fallback = 7.5s of static portraits.
**Fix:** Polish no-video fallback with fade-in animation. Reduce montage timer from 1500ms to 1000ms. Add crossfade between clips.
**Files:** `components/round/VideoClip.tsx`, `components/screens/CelebrationScreen.tsx`

---

## P1 — Should Fix

### 1c. Touch targets on Undo/Start Over too small
~24px tall, should be 44px minimum. Add `py-3` and `min-h-[44px]`.
**Files:** `components/round/ChainBuilder.tsx`

### 1d. Search result rows lack visual separation
Add subtle border between rows for better tap targeting.
**Files:** `components/round/SearchResults.tsx`

### 1e. No viewport meta export
Add viewport export to layout with `viewport-fit: cover`.
**Files:** `app/layout.tsx`

### 2b. No persistent search mode indicator
When keyboard is open and chain is scrolled off, PJ loses context of what to search for.
**Fix:** Add small label "Search for a movie/show" or "Search for an actor" above input.
**Files:** `components/round/ChainBuilder.tsx`

### 2c. "Connect X to Y" instruction too subtle
Make it sticky at top of screen so it's always visible.
**Files:** `components/round/ChainBuilder.tsx`

### 3a. RoundIntro unskippable (3.4s × 5 = 17s dead time)
Add tap-to-skip behavior.
**Files:** `components/round/RoundIntro.tsx`

### 3b. No screen transitions
Hard cuts between Intro → Round → Celebration. Add fade transitions.
**Files:** `components/Game.tsx`

### 3d. Dark-to-light reveal transition doesn't animate
Different render branches mean CSS transition never fires. Keep single container and transition via state.
**Files:** `components/screens/CelebrationScreen.tsx`

### 4b. No progression feeling between rounds
Add progress indicator (5 dots), flash earned word after round completion.
**Files:** `components/round/ChainBuilder.tsx`

### 4c. Post-Yes screen too sparse
No animation, no crescendo. Add slow text reveal, delayed "I love you" appearance.
**Files:** `components/screens/CelebrationScreen.tsx`

### 5b. Error persists while typing new search
Clear error when search input value changes.
**Files:** `components/round/ChainBuilder.tsx`

### 5c. No empty state for zero search results
Show "No results for '[query]'" message.
**Files:** `components/round/SearchInput.tsx`

### 6b. Secondary text contrast below WCAG AA
`#666666` on `#0A0A0A` = 4.2:1 ratio. Bump to `#888888` (5.6:1).
**Files:** `app/globals.css`

### 7b. RoundIntro portraits overflow on phones
Two portraits at `w-[30dvh]` = ~432px total. Phones are 375-430px wide.
**Fix:** Use `w-[min(30dvh,40vw)]`.
**Files:** `components/round/RoundIntro.tsx`

---

## P2 — Nice to Have

### 1f. Safe area insets
Add `padding-bottom: env(safe-area-inset-bottom)` for iPhone notch/home indicator.

### 3c. Celebration montage has no transition between clips
Add crossfade between clips in montage.

### 5d. "No" button could dodge
Classic Valentine's web trick — button moves to random position when tapped.

### 6c. Image alt text
Already mostly handled. Minor a11y completeness.

### 7c. Grain z-index vs dropdown z-index
Grain at z-99 could visually overlay the search dropdown at z-50.

### 7d. No TMDb rate limit handling
Add basic retry on 429, or increase debounce to 400-500ms.
