# Scream Queens: Six Degrees — Build Log

## Project Summary
A mobile-first web game as a Valentine's Day gift for PJ. The player connects horror movie actresses through shared filmographies (Six Degrees of Separation style). Five rounds, each revealing a word, spelling out **"Will you be my Valentine?"**

**Deadline:** February 14, 2026
**Status:** Core game functional, visual polish in progress, custom actress photos added, Geist font + card physics animations
**Dev server:** `npm run dev` → `http://localhost:3000` (port 3004 preferred but not enforced in config)
**Repo:** https://github.com/marcosevilla/valentines2026.git

---

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript, Tailwind CSS v4, Turbopack)
- **API:** TMDb (The Movie Database) — free tier, proxied through server-side API routes
- **State:** React useReducer + Context (no external state library)
- **Fonts:** Geist Sans (primary, semibold) + Geist Pixel Square (round headers) + Playfair Display (serif, celebration reveal only)
- **Hosting:** Vercel (not yet deployed)

---

## Round Structure
| Round | Clip Actress / Movie | Connect From → To | Word |
|-------|---------------------|-------------------|------|
| 1 | Toni Collette / Hereditary | Toni Collette → Florence Pugh | "Will" |
| 2 | Florence Pugh / Midsommar | Florence Pugh → Jenna Ortega | "you" |
| 3 | Jenna Ortega / X | Jenna Ortega → Naomi Scott | "be" |
| 4 | Naomi Scott / Smile 2 | Naomi Scott → Samara Weaving | "my" |
| 5 | Samara Weaving / Ready or Not | Samara Weaving → Toni Collette | "Valentine?" |

---

## Decision Log

### 2026-02-10 — Initial Session

**Game concept:** Six Degrees of Separation with horror movie actresses, Valentine's reveal
- Chose "search and select" input (type + autocomplete) over free typing or multiple choice
- Chose TMDb over IMDb (TMDb has free public API, IMDb doesn't)

**UX decisions:**
- No help system — PJ figures it out or gets IRL help from Marco
- Undo: step-by-step undo + "Start over" button to reset entire chain
- No save/resume — one-sitting experience, no localStorage persistence
- Soft chain limit at 10 links — gentle nudge "Try a different path?" but no forced reset
- Dead ends — no special messaging, undo/reset handles it
- Search results show Film/TV labels with year (e.g., "Big Little Lies (TV, 2017)")
- All TMDb credit types accepted (cameos, voice, uncredited) to maximize possible connections
- Fewer connections = better feedback: 1 link "Incredible!", 2 "Amazing!", 3 "Nice!", 4+ "You got it!"

**Progress display:**
- No word reveals during gameplay — instead, 5 actress portrait slots at the top
- Completed rounds fill in the actress photo; incomplete rounds show empty placeholders
- Words only revealed at the end

**Video clips:**
- Auto-play when round starts, replay button available throughout the round
- Word overlaid on the clip
- Placeholder state: actress photo + movie name card (until Marco adds real clips)

**End sequence:**
1. All 5 clips play back-to-back (montage) with words overlaid
2. Final screen: 5 actress portraits with words beneath forming "Will you be my Valentine?"
3. Yes / No buttons — "No" triggers "Wrong answer!" then disappears, "Yes" triggers celebration

**Architecture:**
- Single page, state-driven screens (no routing beyond `/`)
- Search ALL of TMDb, validate after selection (player needs genuine knowledge)
- Server-side validation hides API key AND prevents cheating via network inspection
- TV shows use aggregate_credits endpoint (catches actors from any season)
- Chain loops prevented by filtering out actors already in the chain

### 2026-02-10 — Design System

**Visual direction pivot:** Initial ornate proposal (Playfair everywhere, tinted backgrounds, monospace accents) rejected. Marco requested A24-inspired minimal aesthetic — more modern, indie, trendy, minimal.

**A24-inspired design system:**
- Geist Sans (semibold, 600 weight) as single sans-serif for all UI (replaced Inter)
- Playfair Display only for the final Valentine's reveal moment (serif, italic)
- Dark background (#0A0A0A) throughout gameplay
- Single accent color shifts per round (blood red → coral pink gradient)
- Light/dark inversion only at celebration reveal screen
- Uppercase labels with wide letter-spacing (0.15-0.2em)
- No rounded corners on buttons or cards
- Generous whitespace, minimal decoration

**Round accent colors:**
| Round | Color | Hex |
|-------|-------|-----|
| 1 | Blood red | #E63946 |
| 2 | Warming | #D94060 |
| 3 | Rose | #CC4D7A |
| 4 | Berry | #BF5A94 |
| 5 | Coral pink | #E8547C |

### 2026-02-10 — Chain Layout Redesign

**Horizontal card chain:** Replaced vertical text-based chain with horizontal scrollable card strip.

**Card system:**
- Start/End actress cards: 30dvh, shrinks 3dvh per link (min 20dvh)
- Intermediate actor/movie cards: 70% of bookend height (min 14dvh)
- Placeholder card: same size as intermediate, dashed border, film/person icon
- All cards 3:4 aspect ratio, no border-radius
- Subtle elegant border: `rgba(255,255,255,0.08)` with inset highlight
- Custom actress photos from `/public/actresses/` for bookend cards
- TMDb images at w500 (profiles) and w342 (posters) for intermediates

**Connectors:** Curved SVG bezier strings between cards with gentle sway animation (staggered timing per connector). Confirmed = accent color, pending = border color. No connector to pinned target until chain is complete.

**Target actress:** Pinned to right edge of screen, always visible as destination. Full opacity (not muted).

**Scroll behavior:** Auto-scroll to newest cards on addition. Free horizontal scroll otherwise.

**Animations:**
- New cards: 3D flip-in (rotateY -90° → 0°, 400ms ease-out) + accent glow pulse (800ms)
- Intermediate cards: gentle physics-like bob animation (3-4s cycles, alternating patterns, staggered delays)
- Connectors: subtle string sway (scaleY + rotate, staggered timing)
- Win sequence: wave cascade bouncing backward through chain (80ms stagger per card)
- Continue button: fade-in-up with 800ms delay
- Placeholder: scale-in (300ms delay)

**Undo:** X button appears on hover over the newest card (top-right corner). "Start over" button pinned to bottom of screen.

**Round intro animation:** Each round starts with an intro sequence:
1. "Round X" fades in (100ms)
2. Actress 1 portrait appears center (400ms)
3. Actress 2 slides in from right (1400ms)
4. Both scale down and drift apart (2800ms)
5. Transition to chain builder (3400ms)

**Search bar:** Dynamically positioned under the placeholder card (tracks position via ref). 240px max-width. Transparent background, bottom border only (2px, 3px accent on focus). Text-base size.

**Actress collection bar:** Removed from round screen.

**Film grain:** Lightweight CSS conic-gradient overlay with mix-blend-mode overlay on round screen.

### 2026-02-10 — Visual Polish Session

**Font swap:** Replaced Inter with Geist Sans (semibold 600 weight) via `geist` npm package. All UI text is now semibold.

**Custom actress photos:** Marco provided custom photos for all 5 actresses (from their respective horror films). Stored in `/public/actresses/`. `getProfileUrl()` detects local paths and returns them directly instead of constructing TMDb URLs.

**Card physics:** Added gentle bobbing animation to intermediate cards with staggered timing (alternating `card-bob` and `card-bob-alt` keyframes, 3-4s cycles). SVG connectors sway subtly like physical strings.

**Undo redesign:** Replaced standalone "Undo" button with an X button on the top-right corner of the newest card, always visible (persistent, not hover-only). Circular, overlaps card edge. Only "Start over" remains as a standalone pill button with refresh icon, pinned to page bottom.

**Search bar redesign:** Transparent background (removed surface color), accent-colored bottom stroke on focus (3px), dynamically positioned under the placeholder card using ref tracking + scroll listener. Narrowed to 240px max-width.

**Layout restructure:** Round header ("Round 1") positioned at top of page, chain section vertically centered via flex spacers, "Start over" pinned to bottom. Clip phase skipped — rounds go directly to intro animation.

**UX audit:** Comprehensive audit saved to `UX-AUDIT.md` covering mobile UX, visual hierarchy, animation, emotional arc, interaction design, accessibility, and edge cases.

### 2026-02-10 — Session 3: Shared Element Transitions, Sound, Celebration

**Geist Pixel font:** Round headers now use Geist Pixel Square (`font-pixel` class). Imported from `geist/font/pixel` as `GeistPixelSquare` (no generic `GeistPixel` export exists — variants are Square, Grid, Circle, Triangle, Line). CSS variable: `--font-geist-pixel-square`.

**Shared element intro transition:** Merged `RoundIntro` into `ChainBuilder`. The "Round 1" heading is now a single DOM element that transitions from centered position (scaled down at ~28dvh) to its final top position via CSS `transform` + `transition`. Actress portraits use a crossfade overlay that drifts toward chain positions as it fades out and chain display fades in simultaneously. `RoundScreen` simplified — no longer manages `showIntro` state.

**Hangman word reveal:** Five underline slots below "Round 1" header, hangman-style. Completed rounds fill in their word ("Will", "you", "be", "my", "Valentine?"). Uses `completedRounds` from game state. Fades in with chain display.

**Sound effects (Web Audio API):** `lib/sounds.ts` — no audio files needed.
- `playCardSound()`: sine chime (660→880Hz, 250ms) on successful card add
- `playWinSound()`: ascending C major arpeggio (C5→E5→G5→C6) on chain completion
- `playRemoveSound()`: descending triangle wave (400→180Hz) + noise burst on undo

**Background music integration:** `BackgroundMusic` component now accepts `volume` prop. During celebration, volume raised to 0.95 (from default 0.65). Music plays simultaneously with montage clip audio.

**Celebration montage overhaul:**
- Full-screen video clips (fixed inset-0, object-cover) instead of small card
- Clips seek to scream timestamps: Hereditary 5s, Midsommar 6s, X 4s, Smile 2 9s, Ready or Not 4s
- Start time backed up if clip too short: `Math.min(screamAt, duration - clipDuration)`
- 2.5s per clip, auto-advance via timer or `onEnded` (whichever first)
- Clips play with audio (not muted)
- Word overlay with heavy text shadow for readability over full-screen video

**Celebration reveal screen:**
- Actress portraits: 10vw circles spanning 60vw container, justify-between
- Words beneath each portrait at text-4xl bold italic
- "Will you be my Valentine?" h1 removed
- Yes/No buttons remain

**Final screen:** "Happy Valentine's Day" + "Love, your boobaloo" with floating pink heart animation (18 hearts, randomized position/size/drift/timing, CSS keyframe `heart-float`).

**Bookend card padding:** Increased from px-4/pr-4 to px-8/pr-8 for more breathing room on left/right edges.

**Start over button:** Redesigned as pill button (rounded-full) with refresh icon SVG.

---

## TMDb IDs (Verified)
| Actress | TMDb ID |
|---------|---------|
| Toni Collette | 3051 |
| Florence Pugh | 1373737 |
| Jenna Ortega | 974169 |
| Samara Weaving | 1372369 |
| Naomi Scott | 240724 |

---

## File Structure
```
app/
  layout.tsx                    # Root layout (Geist Sans + Playfair Display fonts)
  page.tsx                      # Renders <Game />
  globals.css                   # Tailwind + CSS variables + animations
  api/tmdb/
    search/route.ts             # Search movies, TV, actors
    credits/route.ts            # Get cast list for a movie/show
    validate/route.ts           # Validate actor↔movie connection
components/
  Game.tsx                      # State-driven screen switcher + accent color
  ActressCollection.tsx         # 5 portrait slots (currently unused)
  screens/
    IntroScreen.tsx             # Title + start button
    RoundScreen.tsx             # Clip → intro → chain → complete + grain bg
    CelebrationScreen.tsx       # Montage → reveal (serif) → yes/no
  round/
    RoundIntro.tsx              # Round intro animation sequence
    VideoClip.tsx               # Video player + fallback portrait
    ChainBuilder.tsx            # Core gameplay: chain + search + undo
    ChainDisplay.tsx            # Horizontal scrollable card strip
    ChainCard.tsx               # Card component + connector + icons
    SearchInput.tsx             # Debounced autocomplete
    SearchResults.tsx           # Dropdown results
    RoundComplete.tsx           # Win feedback + completed chain + continue
lib/
  types.ts                      # All TypeScript types
  game-data.ts                  # Round configs, TMDb IDs, accent colors
  game-reducer.ts               # Game state reducer
  GameContext.tsx                # React Context provider
  tmdb.ts                       # Client-side TMDb fetch helpers
hooks/
  useDebounce.ts                # 300ms debounce for search
public/
  actresses/                    # Custom actress photos (added by Marco)
  clips/                        # Video clips (round-1.mp4 through round-5.mp4)
```

---

## Research Docs
- `game-ui-research.md` — Mobile game UI/UX best practices (Wordle, Monument Valley, Jenova Chen, etc.) with applied recommendations
- `visual-design-research.md` — Visual/graphic design research with concrete ideas: color palette, typography, animation concepts, per-film visual references

---

## TODO
- [ ] Fix mobile keyboard/search experience (P0 — search results hidden by keyboard)
- [ ] Error handling for network failures / empty results
- [ ] Animate dark-to-light transition at celebration reveal
- [ ] "No" button dodge animation on celebration screen
- [ ] Win sequence: zoom-out to fit full chain on screen
- [ ] Deploy to Vercel (add `TMDB_API_KEY` env var)
- [ ] Test on real phone (mobile viewport, touch interactions)
- [ ] Screen transitions (fade between Intro → Round → Celebration)
- [ ] Empty state for zero search results
- [ ] Tap-to-skip on round intro animation
- [ ] Fine-tune montage scream timestamps after testing on device
- [x] ~~Core game logic + API routes~~
- [x] ~~A24-inspired typography + color system~~
- [x] ~~Horizontal card chain layout~~
- [x] ~~Round intro animation~~
- [x] ~~Dynamic card sizing (30dvh → shrink)~~
- [x] ~~Project CLAUDE.md with specs~~
- [x] ~~Geist font swap + semibold~~
- [x] ~~Custom actress photos~~
- [x] ~~Card physics animations (bob + string connectors)~~
- [x] ~~Undo redesign (X on newest card, persistent circular)~~
- [x] ~~Search bar redesign (transparent, accent focus, position tracking)~~
- [x] ~~UX audit (saved to UX-AUDIT.md)~~
- [x] ~~Skip clip phase (straight to round intro)~~
- [x] ~~Shared element intro transition (merged RoundIntro into ChainBuilder)~~
- [x] ~~Geist Pixel Square for round headers~~
- [x] ~~Start over pill button with refresh icon~~
- [x] ~~Hangman word reveal (underlines fill in per completed round)~~
- [x] ~~Sound effects (card add chime, win arpeggio, undo crumple)~~
- [x] ~~Celebration montage (full-screen clips, scream timestamps, music at 95%)~~
- [x] ~~Celebration final screen (floating hearts, "Love, your boobaloo")~~
- [x] ~~Video clips added to public/clips/~~
