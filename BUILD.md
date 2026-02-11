# Scream Queens: Six Degrees — Build Log

## Project Summary
A mobile-first web game as a Valentine's Day gift for PJ. The player connects horror movie actresses through shared filmographies (Six Degrees of Separation style). Five rounds, each revealing a word, spelling out **"Will you be my Valentine?"**

**Deadline:** February 14, 2026
**Status:** Core game functional, horizontal card chain layout built, A24-inspired design system applied, visual polish in progress
**Dev server:** `npm run dev` → `http://localhost:3004`
**Repo:** https://github.com/marcosevilla/valentines2026.git

---

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript, Tailwind CSS v4, Turbopack)
- **API:** TMDb (The Movie Database) — free tier, proxied through server-side API routes
- **State:** React useReducer + Context (no external state library)
- **Fonts:** Inter (primary sans) + Playfair Display (serif, celebration reveal only)
- **Hosting:** Vercel (not yet deployed)

---

## Round Structure
| Round | Clip Actress / Movie | Connect From → To | Word |
|-------|---------------------|-------------------|------|
| 1 | Toni Collette / Hereditary | Toni Collette → Florence Pugh | "Will" |
| 2 | Florence Pugh / Midsommar | Florence Pugh → Jenna Ortega | "you" |
| 3 | Jenna Ortega / X | Jenna Ortega → Samara Weaving | "be" |
| 4 | Samara Weaving / Ready or Not | Samara Weaving → Naomi Scott | "my" |
| 5 | Naomi Scott / Smile 2 | Naomi Scott → Toni Collette | "Valentine?" |

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
- Inter as single sans-serif for all UI
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
- Start/End actress cards: large (50dvh, shrinks to 22dvh min as chain grows)
- Intermediate actor/movie cards: 70% of bookend height
- Placeholder card: dashed border, film/person icon based on what's needed next
- All cards 3:4 aspect ratio, no border-radius
- Dynamic sizing: cards shrink 5dvh per chain link added

**Connectors:** Curved SVG bezier lines between cards. Confirmed = accent color, pending = border color. No connector to pinned target until chain is complete.

**Target actress:** Pinned to right edge of screen, always visible as destination. Full opacity (not muted).

**Scroll behavior:** Auto-scroll to newest cards on addition. Free horizontal scroll otherwise.

**Animations:**
- New cards: 3D flip-in (rotateY -90° → 0°, 400ms ease-out)
- Win sequence: wave cascade bouncing backward through chain (80ms stagger per card)
- Continue button: fade-in-up with 800ms delay
- Placeholder: scale-in (300ms delay)

**Round intro animation:** Each round starts with an intro sequence:
1. "Round X" fades in (100ms)
2. Actress 1 portrait appears center (400ms)
3. Actress 2 slides in from right (1400ms)
4. Both scale down and drift apart (2800ms)
5. Transition to chain builder (3400ms)

**Search bar:** Left-aligned under chain, max-w-sm width. Bottom border only.

**Actress collection bar:** Removed from round screen.

**Film grain:** Lightweight CSS conic-gradient overlay with mix-blend-mode overlay on round screen.

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
  layout.tsx                    # Root layout (Inter + Playfair Display fonts)
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
  clips/                        # Video clips (round-1.mp4 through round-5.mp4)
```

---

## Research Docs
- `game-ui-research.md` — Mobile game UI/UX best practices (Wordle, Monument Valley, Jenova Chen, etc.) with applied recommendations
- `visual-design-research.md` — Visual/graphic design research with concrete ideas: color palette, typography, animation concepts, per-film visual references

---

## TODO
- [ ] Continue visual polish iterations (card sizing, intro animation refinement)
- [ ] Add video clips to `public/clips/` (round-1.mp4 through round-5.mp4)
- [ ] Source clips: find scenes where each actress says their word
- [ ] Win sequence: zoom-out to fit full chain on screen
- [ ] "No" button dodge animation on celebration screen
- [ ] Deploy to Vercel (add `TMDB_API_KEY` env var)
- [ ] Test on real phone (mobile viewport, touch interactions)
- [ ] Mobile keyboard behavior testing
- [ ] Error handling for network failures / empty results
- [ ] Loading state animations
- [ ] Celebration screen animations refinement
- [x] ~~Core game logic + API routes~~
- [x] ~~A24-inspired typography + color system~~
- [x] ~~Horizontal card chain layout~~
- [x] ~~Round intro animation~~
- [x] ~~Dynamic card sizing (50dvh → shrink)~~
- [x] ~~Project CLAUDE.md with specs~~
