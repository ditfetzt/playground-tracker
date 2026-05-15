# Ember — The Playground Design System

Warp-inspired terminal theme. Tight rectangles, hairline borders, warm charcoal canvas, quiet confidence. Think campfire embers in a dark IDE.

## Palette

| Token | Hex | Role |
|-------|-----|------|
| `--color-background` | `#2b2622` | Warm dark canvas (brown-beige warmth) |
| `--color-foreground` | `#f7f5f0` | Off-white ink — default text |
| `--color-primary` | `#f7f5f0` | Off-white — button fill (inverted) |
| `--color-primary-foreground` | `#2b2622` | Dark text on primary buttons |
| `--color-secondary` | `#383330a6` | Surface fill |
| `--color-secondary-foreground` | `#dad2c1` | Body strong text |
| `--color-muted-foreground` | `#aea69c` | Labels, headings, meta (lowest priority) |
| `--color-destructive` | `#c44a42` | Delete, errors |
| `--color-border` | `#3f3a36` | Hairline 1px divider |
| `--color-ring` | `#f7f5f0` | Focus ring (off-white) |
| `--color-card` | `#383330cc` | Card background (solid, warm tint) |
| `--color-amber` | `#d48c50` | Warnings |
| `--color-emerald` | `#7ebc89` | Success, paid |

## Typography

| Level | Weight | Tracking | Size |
|-------|--------|----------|------|
| Display (h1) | 400 | -0.03em | 18px |
| Headings (section) | 500 | 0.025em | 13px uppercase |
| Body | 400 | — | 18px |
| Mono | 400 | — | 13px |

**Fonts**: DM Sans + DM Mono (unchanged from Neon)

**Light display weights (400-500)** — quiet confidence. The hero reads like a developer editor, not a billboard. Negative tracking on display (-0.03em) is part of the voice.

## Shape & Radius

| Token | Value | Effect |
|-------|-------|--------|
| `--radius` | `0.25rem` (4px) | **Tight rectangles** — buttons 3px, cards 4px |
| `--btn-radius` | `3px` | Almost rectangular CTAs |
| `--card-border-width` | `1px` | Hairline only |

**No blur**, **no shadows**. Elevation is carried entirely by surface-contrast and 1px hairline dividers. The brand never uses generous pills for CTAs.

## Elevation

Flat. 1px solid `#3f3a36` hairline borders define card edges against the warm canvas. Surface-contrast (canvas-soft on canvas) is the only depth mechanism. No drop shadows anywhere.

## Spacing

| Scale | Px |
|-------|----|
| `section-gap` | 24px |
| Card padding | 24px |
| Button padding | 8px 16px |

## WCAG

| Pair | Ratio |
|------|-------|
| `#f7f5f0` on `#2b2622` | 11.0:1 AAA |
| `#aea69c` on `#2b2622` | 5.5:1 AA |
| `#2b2622` on `#f7f5f0` | 11.0:1 AAA |

## Character

**Quiet, warm, disciplined.** No chromatic accent — the off-white IS the brand's voice. The warmth of the charcoal canvas (`#2b2622` carries brown-beige tones) IS the identity. Tight radii, hairline borders, light display weights. Reads like a terminal, feels like a campfire.
