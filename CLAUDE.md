# Scream Queens: Six Degrees — Project Context

## Safety Rules
- Always commit working state before starting a new feature or risky change
- Commit between phases of multi-step features (not just before starting)
- Make small incremental changes and verify each one works before proceeding
- After any structural change (new component, new context, layout rewrite), verify the dev server before continuing
- If the dev server breaks, revert immediately — do not spiral through 5+ fix attempts
- If 2 consecutive fix attempts fail on the same issue, stop and reassess the approach
- Never make large architectural changes without confirming the current approach is insufficient first

## Development Approach
- Propose approach before implementing non-trivial features — outline 2-3 options with tradeoffs
- Prefer the simplest solution that works; do not over-engineer
- Never guess or fabricate values for visual properties (colors, fonts, animation parameters) — ask Marco for exact values
- When something breaks, say so directly rather than silently trying more fixes
- Marco is a designer — defer to his visual judgment, ask for specs when unsure

## Known Gotchas
- **Directory name has apostrophe** — `valentine's 2026` causes issues with some npm/CLI tools. Use quoted paths always.
- **Turbopack root detection** — There's a `package-lock.json` at `~/` that confuses turbopack. Fixed via `turbopack: { root: "." }` in `next.config.ts`. Don't remove this.
- **Port conflicts** — Ports 3000-3003 are often in use by other projects. This project runs on **port 3004**.
- **SVG filter noise textures** — Inline SVG `feTurbulence` filters in CSS can cause rendering hangs in the browser. Use lightweight CSS-only grain or pre-rendered PNGs instead.
- **Git push** — Repo is `marcosevilla/valentines2026` but local git uses `marco-sevilla` account. Added as collaborator.
- **Dev server buffering** — If the page buffers indefinitely, kill the server (`lsof -iTCP:3004`), delete `.next/`, and restart fresh.

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with CSS custom properties
- **Fonts**: Inter (sans, primary) + Playfair Display (serif, reveal moment only)
- **State**: React useReducer + Context (no external state library)
- **API**: TMDb (proxied via `/api/tmdb/*` routes to hide key)
- **Deployment**: Vercel
- **Env**: `TMDB_API_KEY` in `.env.local`

## Project Structure
```
app/
  layout.tsx                    # Root layout (Inter + Playfair Display fonts)
  page.tsx                      # Renders <Game />
  globals.css                   # Tailwind + CSS variables + animations
  api/tmdb/
    search/route.ts             # Search movies, TV, actors via TMDb
    credits/route.ts            # Get cast list for a movie/show
    validate/route.ts           # Validate actor↔movie connection
components/
  Game.tsx                      # State-driven screen switcher + accent color
  screens/
    IntroScreen.tsx             # Title + start button
    RoundScreen.tsx             # Clip → intro → chain → complete
    CelebrationScreen.tsx       # Montage → reveal → yes/no
  round/
    RoundIntro.tsx              # Round intro animation (portraits + round label)
    VideoClip.tsx               # Video player + fallback portrait
    ChainBuilder.tsx            # Core gameplay: search + validate + chain
    ChainDisplay.tsx            # Horizontal scrollable card strip
    ChainCard.tsx               # Individual card + connector + icons
    SearchInput.tsx             # Debounced autocomplete input
    SearchResults.tsx           # Dropdown results
    RoundComplete.tsx           # Win feedback + completed chain + continue
  ActressCollection.tsx         # 5 portrait slots (currently unused)
lib/
  types.ts                      # All TypeScript types
  game-data.ts                  # Round configs, TMDb IDs, accent colors
  game-reducer.ts               # useReducer: all game state transitions
  GameContext.tsx                # React Context provider
  tmdb.ts                       # Client-side fetch helpers
hooks/
  useDebounce.ts                # 300ms debounce for search
public/
  clips/                        # Video clips (added by Marco)
```

## Game Flow
```
Intro → [Round 1-5: Clip → Intro Animation → Chain Building → Won] → Celebration
```

## Round Structure
| Round | Clip Actress / Movie | Connect From → To | Word |
|-------|---------------------|-------------------|------|
| 1 | Toni Collette / Hereditary | Toni Collette → Florence Pugh | "Will" |
| 2 | Florence Pugh / Midsommar | Florence Pugh → Jenna Ortega | "you" |
| 3 | Jenna Ortega / X | Jenna Ortega → Samara Weaving | "be" |
| 4 | Samara Weaving / Ready or Not | Samara Weaving → Naomi Scott | "my" |
| 5 | Naomi Scott / Smile 2 | Naomi Scott → Toni Collette | "Valentine?" |

## Verified TMDb IDs
| Actress | TMDb ID |
|---------|---------|
| Toni Collette | 3051 |
| Florence Pugh | 1373737 |
| Jenna Ortega | 974169 |
| Samara Weaving | 1372369 |
| Naomi Scott | 240724 |

## Design Tokens (CSS Variables)

### Colors
| Variable | Value | Usage |
|----------|-------|-------|
| `--color-bg` | `#0A0A0A` | Page background |
| `--color-surface` | `#141414` | Card/input backgrounds |
| `--color-border` | `#222222` | Borders, dividers |
| `--color-text` | `#FAFAFA` | Primary text |
| `--color-text-secondary` | `#666666` | Labels, secondary text |
| `--color-accent` | Shifts per round | CTA buttons, highlights |
| `--color-reveal-bg` | `#FAFAFA` | Celebration reveal background |
| `--color-reveal-text` | `#0A0A0A` | Celebration reveal text |
| `--color-error` | `#E63946` | Error messages |
| `--color-success` | `#4ade80` | Success states |

### Round Accent Colors
| Round | Accent | Description |
|-------|--------|-------------|
| 0 | `#E63946` | Blood red |
| 1 | `#D94060` | Warming |
| 2 | `#CC4D7A` | Entering rose |
| 3 | `#BF5A94` | Berry |
| 4 | `#E8547C` | Coral pink |

### Typography
| Element | Font | Weight | Size | Style |
|---------|------|--------|------|-------|
| Body / UI | Inter (`--font-sans`) | 400 | 14-16px | Normal |
| Labels | Inter | 400-500 | 10-12px | Uppercase, tracked |
| Round numbers | Inter | 400 | 12px | Uppercase, 0.2em tracking |
| Feedback messages | Inter | 500 | 24px | Normal |
| Celebration reveal | Playfair Display (`--font-serif`) | 700 | 40-48px | Bold italic |
| Valentine message | Playfair Display | 700 | 48-60px | Bold italic |

## Component & Interaction Specs

### Chain Cards
| Variant | Height | Aspect | Notes |
|---------|--------|--------|-------|
| Start/End (bookend) | `50dvh` → shrinks to `22dvh` min | 3:4 | Shrinks 5dvh per chain link added |
| Intermediate (actor/media) | 70% of bookend height, min `16dvh` | 3:4 | |
| Placeholder | 70% of bookend height | 3:4 | Dashed border, icon-based |

### Chain Card Animations
| Animation | Duration | Easing | Details |
|-----------|----------|--------|---------|
| Card flip-in | 400ms | ease-out | `perspective(400px) rotateY(-90deg → 0)` |
| Card wave (win) | 500ms | ease-out | `translateY(-10px) scale(1.06)` bounce |
| Wave cascade delay | 80ms per card | — | Starts from last card, ripples backward |
| Placeholder appear | 300ms | ease-out | `scale(0.9 → 1)`, 300ms delay |
| Continue button | 400ms | ease-out | `translateY(8px → 0)` fade-in, 800ms delay |

### Round Intro Sequence
| Phase | Time | Animation |
|-------|------|-----------|
| Round label | 100ms | Fade + rise |
| Actress 1 portrait | 400ms | Fade + scale |
| Actress 2 portrait | 1400ms | Slide in from right |
| Transition out | 2800ms | Both scale down + drift apart |
| Complete | 3400ms | Fade to chain builder |

### Connectors
- SVG bezier curves: `M 0 24 C 7 10, 17 38, 24 24`
- Stroke: `1.5px`, round cap
- Confirmed: `var(--color-accent)`, Pending: `var(--color-border)`
- No connector to pinned target until chain is complete

### Search Bar
- Max width: `max-w-sm` (384px)
- Left-aligned under chain (`self-start`)
- Bottom border only (no full border)
- 300ms debounce on input

## Session End
Before ending any session:
1. Update the "Current State" section below with: what was accomplished, what's in progress, any known issues
2. Note exact file paths that were modified
3. If any features are partially complete, describe what's left

## Current State
_Updated by Claude at end of each session_
- **Last worked on:** Horizontal card chain layout, round intro animation, dynamic card sizing
- **In progress:** Visual polish iteration based on Marco's feedback
- **Known issues:** Dev server occasionally buffers — kill + clear `.next/` + restart fixes it
- **Deadline:** February 14, 2026
