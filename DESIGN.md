# Design Brief

## Direction

Craft Studio — a warm paper-and-clay workbench for turning photos into perler bead patterns, mobile-first and three-step.

## Tone

Refined minimalism with tactile craft warmth: clean like a workshop manual, never toy-like or cute.

## Differentiation

The bead grid itself is the hero — numbered cells on a pegboard with clay-colored accents framing it like a framed craft project.

## Color Palette

| Token      | OKLCH          | Role                                  |
| ---------- | -------------- | ------------------------------------- |
| background | 0.985 0.006 85 | warm paper canvas                     |
| foreground | 0.2 0.014 50   | ink text                              |
| card       | 1 0.003 85     | raised white work surfaces            |
| primary    | 0.55 0.155 38  | terracotta CTA, active step, selected |
| accent     | 0.58 0.1 180   | teal info badges, secondary highlights|
| muted      | 0.945 0.01 80  | chips, footer strip, alt sections     |

## Typography

- Display: Space Grotesk — headings, step titles, totals (CJK falls back to PingFang SC)
- Body: Figtree — labels, buttons, body copy
- Mono: Geist Mono — bead color numbers, counts, grid dimensions
- Scale: hero `text-3xl md:text-4xl font-bold tracking-tight`, h2 `text-xl font-bold`, label `text-xs font-semibold tracking-widest uppercase`, body `text-sm md:text-base`

## Elevation & Depth

Flat paper base with white cards lifted by `shadow-subtle` and thin warm-grey borders; `shadow-elevated` only for the preview card and sticky action bar.

## Structural Zones

| Zone    | Background        | Border        | Notes                                        |
| ------- | ----------------- | ------------- | -------------------------------------------- |
| Header  | bg-card           | border-b      | sticky, logo mark + title + 3-step stepper   |
| Content | bg-background     | —             | alternating `bg-muted/30` blocks per section |
| Footer  | bg-muted/40       | border-t      | 5mm 豆 · 150–160°C 烫 10–15 秒 tip           |

## Spacing & Rhythm

Mobile single column with `px-4` gutters, `space-y-4` card stacks, `gap-2` chips, `p-4` card padding; desktop widens to a two-column results layout at `lg`.

## Component Patterns

- Buttons: full-width `rounded-full` primary in terracotta, `h-12`; ghost/secondary in muted with border
- Cards: `rounded-2xl` white, `border-border`, `shadow-subtle`, `p-4`
- Badges: pill `rounded-full` teal or muted, mono numerals

## Motion

- Entrance: sections `animate-fade-up` staggered 60ms on mount
- Hover: `transition-smooth` on chips/buttons, slight `-translate-y-0.5` on cards
- Decorative: generated grid cells `animate-bead-pop` staggered reveal

## Constraints

- All UI copy in Simplified Chinese; numerals in Geist Mono
- Mobile-first: 390px base, touch targets ≥44px
- No gradients on surfaces; no purple; bead colors only inside the pattern grid
- Never reserve UI for history gallery or spreadsheet export

## Signature Detail

Numbered bead cells on faint 29×29 pegboard divider lines — the pattern reads like a real craft template, printable in black and white.
