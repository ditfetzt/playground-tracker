# Ember — The Playground Design System

Warm-dark theme inspired by terminal aesthetics and campfire embers. Think cozy firelight: charred wood surfaces, golden text, subtle burnt-orange accents. Quiet confidence — no chromatic screaming, just warmth.

## Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-background` | `#1a1512` | Page body (warm charcoal) |
| `--color-foreground` | `#f7f3ee` | Primary text (warm off-white) |
| `--color-primary` | `#e8954c` | Ember orange — buttons, active elements |
| `--color-primary-foreground` | `#1a1512` | Text on primary (dark) |
| `--color-secondary` | `#2a242080` | Surfaces, hover backgrounds |
| `--color-secondary-foreground` | `#d4c8b8` | Text on secondary |
| `--color-muted` | `#2a2420a6` | Dimmed surfaces |
| `--color-muted-foreground` | `#96887a` | Labels, descriptions, section headings |
| `--color-accent` | `#38302899` | Ghost button hover |
| `--color-accent-foreground` | `#f7f3ee` | Text on accent |
| `--color-destructive` | `#e0554a` | Muted red — delete, errors |
| `--color-destructive-foreground` | `#ffffff` | Text on destructive |
| `--color-border` | `#e8954c30` | Card/input borders |
| `--color-input` | `#e8954c40` | Input field border |
| `--color-ring` | `#e8954c` | Focus ring |
| `--color-card` | `#2a242080` | Glass-card background |
| `--color-card-hover` | `#38302899` | Glass-card hover |
| `--color-popover` | `#24201c` | Dropdown solid surface |

## Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-amber` | `#d48c50` | Warnings, dismissed status |
| `--color-emerald` | `#7ebc89` | Success, paid, completed |
| `--color-pink` | `#c07070` | Accent |
| `--color-glow-ember` | `#e8954c` | Warm glow |
| `--color-glow-purple` | `#a090c0` | Muted purple accent |
| `--color-glow-cyan` | `#709890` | Cool accent |
| `--color-glow-gold` | `#d4b060` | Camp separator |

## WCAG Contrast

| Pair | Ratio | Pass |
|------|-------|------|
| `#f7f3ee` on `#1a1512` | 11.0:1 | AAA |
| `#e8954c` on `#1a1512` | 6.0:1 | AA |
| `#96887a` on `#1a1512` | 5.2:1 | AA |
| `#1a1512` on `#e8954c` | 6.0:1 | AA |
| `#7ebc89` on `#1a1512` | 6.3:1 | AA |

## Typography

Same as Neon — DM Sans + DM Mono. Font sizes and weights unchanged.

## Section Heading Pattern

Same hierarchy. Gradient separators use ember tones:
```
<div class="h-px mt-1.5 bg-gradient-to-r from-[#e8954c] to-transparent" />
```

## Glass Card

Same structure. Colors derived from theme tokens — warm brown-tinted translucent surfaces instead of purple.

## Character

Ember is the quietest of the three themes. Where Neon screams festival and Blush pops editorial, Ember whispers campfire. Tight radii, warm neutrals, no chromatic overstimulation. The ember orange `#e8954c` appears only on primary actions — the rest is warm-dark surface and off-white text.
