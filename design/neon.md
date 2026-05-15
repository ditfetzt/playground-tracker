# Neon — The Playground Design System

The original dark-purple theme. Deep midnight canvas with electric purple-pink accents, aurora backdrops, and floating particle fields. Named after the neon glow of festival nights.

## Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-background` | `#0a0612` | Page body (very dark midnight) |
| `--color-foreground` | `#f0e6ff` | Primary text (soft lavender) |
| `--color-primary` | `#b44dff` | Brand purple — buttons, active elements, progress |
| `--color-primary-foreground` | `#ffffff` | Text on primary |
| `--color-secondary` | `#1e1432a6` | Surfaces, hover backgrounds |
| `--color-secondary-foreground` | `#c4b0e0` | Text on secondary |
| `--color-muted` | `#1e1432a6` | Dimmed surfaces |
| `--color-muted-foreground` | `#8a7a9a` | Labels, descriptions, section headings |
| `--color-accent` | `#37265099` | Ghost button hover |
| `--color-accent-foreground` | `#f0e6ff` | Text on accent |
| `--color-destructive` | `#ff2d95` | Hot pink — delete, errors |
| `--color-destructive-foreground` | `#ffffff` | Text on destructive |
| `--color-border` | `#b44dff40` | Card/input borders |
| `--color-input` | `#b44dff4d` | Input field border |
| `--color-ring` | `#ff2d95` | Focus ring |
| `--color-card` | `#2d1e4180` | Glass-card background (50% opacity) |
| `--color-card-hover` | `#37265099` | Glass-card hover |
| `--color-popover` | `#1e1432` | Dropdown solid surface |

## Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-amber` | `#ff6b35` | Warnings, dismissed status, buying alerts |
| `--color-emerald` | `#39ff8c` | Success, paid, completed |
| `--color-pink` | `#ff2d95` | Same as destructive |
| `--color-glow-ember` | `#ff6b35` | Accent glow |
| `--color-glow-purple` | `#b44dff` | Primary accent |
| `--color-glow-cyan` | `#00f0ff` | Aurora effects |
| `--color-glow-gold` | `gold` | Camp separator |

## WCAG Contrast

| Pair | Ratio | Pass |
|------|-------|------|
| `#f0e6ff` on `#0a0612` | 13.8:1 | AAA |
| `#b44dff` on `#0a0612` | 5.1:1 | AA (large) |
| `#8a7a9a` on `#0a0612` | 5.3:1 | AA |
| `#ffffff` on `#b44dff` | 5.1:1 | AA (large) |

## Typography

- **Sans**: DM Sans, system-ui (weights 400, 500, 600, 700)
- **Mono**: DM Mono (weights 400, 500)
- **Base size**: 18px on body
- **Panel headings**: 13px, bold, uppercase, tracking-widest, `text-muted-foreground`
- **Page titles**: 18px, bold, `text-foreground` (or `rainbow-text` for "The Playground")

## Section Heading Pattern

Every panel/section heading uses:
```
text-[13px] font-bold uppercase tracking-widest text-muted-foreground
```
Followed by a 1px gradient separator:
```
<div class="h-px mt-1.5 bg-gradient-to-r from-[#b44dff] to-transparent" />
```
Camp panel uses gold gradient: `from-[#ff6b35] via-[#ffd700] to-transparent`.

## Glass Card

```css
background: var(--color-card);
backdrop-filter: blur(12px);
border: 1px solid var(--color-border-glow);
border-radius: 14px;
```

## Spacing Scale

| Token | px | Usage |
|-------|----|-------|
| `p-6` | 24 | Empty states |
| `p-4` | 16 | Standard cards, RoleCard |
| `p-3` | 12 | Compact cards (Budget, E-transfer) |
| `gap-4` | 16 | Panel grids |
| `gap-3` | 12 | Panel content |
| `gap-2` | 8 | Card elements, button groups |
| `mb-4` | 16 | Major section separation |
| `mb-3` | 12 | Panel heading → content |
| `mb-2` | 8 | Section heading → list |

## Animations

- **Transition**: 0.3s standard, 0.5s progress bars, 0.7s ring
- **Aurora**: 25s infinite gradient shift, 15s alternate scale
- **Particles**: Linear drift upward, 14-25s duration, staggered
- **Status pulse**: 4s subtle box-shadow pulse on status badges
- **Rainbow shimmer**: 4s background-position sweep on title
