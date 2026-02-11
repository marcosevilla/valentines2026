# Scream Queens: Six Degrees — Build Log

## Project Summary
A mobile-first web game as a Valentine's Day gift for PJ. The player connects horror movie actresses through shared filmographies (Six Degrees of Separation style). Five rounds, each revealing a word, spelling out **"Will you be my Valentine?"**

**Deadline:** February 14, 2026
**Status:** Core game functional, visual polish pending

---

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- **API:** TMDb (The Movie Database) — free tier, proxied through server-side API routes
- **State:** React useReducer + Context (no external state library)
- **Hosting:** Vercel (not yet deployed)
- **Dev server:** `npm run dev` → `http://localhost:3002`

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

**TMDb actress IDs (verified):**
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
  layout.tsx                    # Root layout
  page.tsx                      # Renders <Game />
  globals.css                   # Tailwind + CSS variables
  api/tmdb/
    search/route.ts             # Search movies, TV, actors
    credits/route.ts            # Get cast list for a movie/show
    validate/route.ts           # Validate actor↔movie connection
components/
  Game.tsx                      # State-driven screen switcher
  ActressCollection.tsx         # 5 portrait slots bar
  screens/
    IntroScreen.tsx             # Title + start button
    RoundScreen.tsx             # Clip → chain → word reveal
    CelebrationScreen.tsx       # Montage → portraits → yes/no
  round/
    VideoClip.tsx               # Video player (auto-play, replay)
    ChainBuilder.tsx            # Core gameplay orchestrator
    SearchInput.tsx             # Debounced autocomplete
    SearchResults.tsx           # Dropdown results
    ChainDisplay.tsx            # Visual chain (actors + movies)
    RoundComplete.tsx           # Feedback + portrait fill
lib/
  types.ts                      # All TypeScript types
  game-data.ts                  # Round configs, TMDb IDs, helpers
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
- [ ] Visual polish (Marco — colors, fonts, animations, spacing)
- [ ] Add video clips to `public/clips/` (round-1.mp4 through round-5.mp4)
- [ ] Source clips: find scenes where each actress says their word
- [ ] Deploy to Vercel (add `TMDB_API_KEY` env var)
- [ ] Test on real phone
- [ ] Mobile keyboard behavior testing
- [ ] Error handling for network failures / empty results
- [ ] Loading state animations
- [ ] Celebration screen animations (confetti, etc.)
- [ ] Personalize the final "I love you" message
