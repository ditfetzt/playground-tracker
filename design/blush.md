# Blush — The Playground Design System

Verge-inspired editorial theme. Pill-card everything, flat depth, heavy display type, acid-mint pink accents.

## Palette

| Token | Hex | Role |
|-------|-----|------|
| `--color-background` | `#0f0612` | Canvas |
| `--color-foreground` | `#fce4ec` | Primary text (soft rose) |
| `--color-primary` | `#ff4081` | Pink accent — buttons, progress, active |
| `--color-primary-foreground` | `#ffffff` | Text on primary |
| `--color-secondary` | `#2d1028a6` | Surfaced hover |
| `--color-secondary-foreground` | `#e0b0c0` | Text on secondary |
| `--color-muted-foreground` | `#9a7a8a` | Labels, headings, meta |
| `--color-destructive` | `#ff1744` | Delete, errors |
| `--color-border` | `#ff408180` | Card / input borders (thick, visible) |
| `--color-ring` | `#ff4081` | Focus ring |
| `--color-card` | `#2d1028cc` | Card background (solid, opaque) |
| `--color-amber` | `#ff8c42` | Warnings |
| `--color-emerald` | `#69f0ae` | Success, paid |

## Typography

| Level | Weight | Tracking | Size |
|-------|--------|----------|------|
| Display (h1) | 700 | -0.02em | 18px |
| Headings (section) | 800 | 0.05em | 13px uppercase |
| Body | 400 | — | 18px |
| Mono | 400 | — | 13px |

**Fonts**: DM Sans + DM Mono (unchanged from Neon)

**Heavier display weight (800) on headings** — editorial presence. Display weight at 700 for titles. Tighter tracking on display.

## Shape & Radius

| Token | Value | Effect |
|-------|-------|--------|
| `--radius` | `1.5rem` (24px) | **Pill-card everything** — `rounded-md` ≈ 22px, cards 24px |
| `--btn-radius` | `9999px` | Fully pill buttons |
| `--card-border-width` | `2px` | Thick, visible borders |

**No blur** (`--card-blur: 0px`). Cards are solid, heavily bordered. Depth comes from border contrast, not glass. Think Verge StoryStream tiles — saturated, framed blocks.

## Elevation

Flat. No drop shadows. 2px solid borders do the work of shadows. Cards sit on the dark canvas with high-contrast outlines.

## Spacing

| Scale | Px |
|-------|----|
| `section-gap` | 20px |
| Card padding | 16-24px |
| Button padding | 8px 16px |

## WCAG

| Pair | Ratio |
|------|-------|
| `#fce4ec` on `#0f0612` | 13.2:1 AAA |
| `#ff4081` on `#0f0612` | 5.0:1 AA (large) |
| `#9a7a8a` on `#0f0612` | 5.1:1 AA |

## Character

**Editorial, bold, framed.** Think festival poster meets tech tabloid. Thick borders frame every card. Pink glows. Heavy uppercase section labels. No subtlety — the UI announces itself.
