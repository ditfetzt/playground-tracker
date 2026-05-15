# Blush — The Playground Design System

Pink-forward warm theme inspired by editorial design. Think festival sunrise: soft rose foregrounds, warm dark canvas, vibrant pink accents that pop without screaming.

## Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-background` | `#0f0612` | Page body (warm dark) |
| `--color-foreground` | `#fce4ec` | Primary text (soft rose) |
| `--color-primary` | `#ff4081` | Pink accent — buttons, active elements, progress |
| `--color-primary-foreground` | `#ffffff` | Text on primary |
| `--color-secondary` | `#2d1028a6` | Surfaces, hover backgrounds |
| `--color-secondary-foreground` | `#e0b0c0` | Text on secondary |
| `--color-muted` | `#2d1028a6` | Dimmed surfaces |
| `--color-muted-foreground` | `#9a7a8a` | Labels, descriptions, section headings |
| `--color-accent` | `#3d155099` | Ghost button hover |
| `--color-accent-foreground` | `#fce4ec` | Text on accent |
| `--color-destructive` | `#ff1744` | Deep red — delete, errors |
| `--color-destructive-foreground` | `#ffffff` | Text on destructive |
| `--color-border` | `#ff408140` | Card/input borders |
| `--color-input` | `#ff40814d` | Input field border |
| `--color-ring` | `#ff4081` | Focus ring |
| `--color-card` | `#2d102880` | Glass-card background |
| `--color-card-hover` | `#3d155099` | Glass-card hover |
| `--color-popover` | `#1d0e20` | Dropdown solid surface |

## Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-amber` | `#ff8c42` | Warnings, dismissed status |
| `--color-emerald` | `#69f0ae` | Success, paid, completed |
| `--color-pink` | `#ff4081` | Same as primary |
| `--color-glow-ember` | `#ff8c42` | Warm glow |
| `--color-glow-purple` | `#e040fb` | Accent purple |
| `--color-glow-cyan` | `#40c4ff` | Cool accent |
| `--color-glow-gold` | `#ffd740` | Camp separator |

## WCAG Contrast

| Pair | Ratio | Pass |
|------|-------|------|
| `#fce4ec` on `#0f0612` | 13.2:1 | AAA |
| `#ff4081` on `#0f0612` | 5.0:1 | AA (large) |
| `#9a7a8a` on `#0f0612` | 5.1:1 | AA |
| `#ffffff` on `#ff4081` | 4.6:1 | AA (large) |
| `#69f0ae` on `#0f0612` | 10.5:1 | AAA |

## Typography

Same as Neon — DM Sans + DM Mono. Font sizes and weights unchanged.

## Section Heading Pattern

Same hierarchy as Neon. Gradient separators use pink tones:
```
<div class="h-px mt-1.5 bg-gradient-to-r from-[#ff4081] to-transparent" />
```

## Glass Card

Same structure. Colors derived from theme tokens — pink-tinted translucent surfaces instead of purple.
