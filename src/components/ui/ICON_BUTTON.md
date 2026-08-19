# IconButton

**PX code-system extension — not a Prism Figma component.**

IconButton does not exist in the Prism Figma file. It was introduced in this repository as a formalised PX code-system pattern after a full audit confirmed that icon-only interactive controls appear repeatedly across the product (table row actions, toolbars) but have no shared component owner.

## Rationale

Before `IconButton`, each icon-only button was a raw `<button>` with local styling that pulled colours directly from whichever parent component it lived inside (e.g. `--c-table-cell-icon-default`, `--c-table-cell-background-hover`). This caused:

- Cross-component token leakage (table tokens on a button)
- Inconsistent radius (ShadCN alias `rounded-md` instead of a Prism token)
- No shared disabled, pressed, or focus states
- No `aria-label` enforcement

## API

```tsx
import { IconButton } from "@/components/ui/icon-button"

<IconButton
  icon="more-horizantal"       // PrismIconName — icon identifier
  label="Open actions for X"   // required — becomes aria-label
  disabled={false}             // optional
  // any other <button> prop except children and aria-label
/>
```

## Token ownership

**Corrected 2026-08-04.** This originally documented a `--c-icon-button-*` component token set that was never actually added to `tokens/C_Default.tokens.json` — so every one of those `var()` calls was undefined. Since `color` is an inherited CSS property, an undefined `var()` with no fallback falls through to the ambient inherited color rather than erroring, so every IconButton silently rendered whatever text color it happened to inherit (usually neutral/900) instead of the intended state colors. Background/radius/size properties (not inherited) simply rendered as unset.

Rather than resurrect a duplicate `icon-button` token block, this component now uses the tokens that already exist and are verified correct: the real (Figma-sourced) `--c-icon-color-*` set for content colors where it has a matching state, falling back to semantic tokens per the standard priority order (component → semantic → primitive) for states that set has no entry for.

| CSS variable | Value | Source |
|---|---|---|
| size | 24px | fixed (`size-6` utility, no token needed) |
| radius | 8px | `--p-radius-100` (primitive — `radius/100`) |
| background (default/disabled) | transparent | `--s-color-surface-empty` (semantic) |
| background (hover) | #F5F7F9 | `--s-color-surface-muted` (semantic) |
| background (active/pressed) | #E6E9EC | `--s-color-surface-sunken` (semantic) |
| content (default) | #3C4A57 | `--c-icon-color-default` (component, real Figma alias) |
| content (hover, active/pressed) | #25313B | `--c-icon-color-hover` (component, real Figma alias — reused for pressed since no distinct pressed icon color token exists) |
| content (disabled) | #ACB4BD | `--s-icon-color-disabled` (semantic — no component-level disabled icon color exists) |

## Known gaps (POC scope)

- **Icon size**: `--c-icon-button-icon-size` is 24px, matching the only verified Prism asset (`more-horizantal` exists at 24px only). The current table action renders at 24px inside a 24px container — no padding. If a 16px icon asset is introduced, both this token and the `PrismIcon size` prop should be updated together. Do not change the token speculatively before the asset exists.
- **No tooltip**: Tooltip on focus/hover is the correct Prism pattern for icon-only buttons. Not implemented — requires the Tooltip component (Batch 2).
- **Single size**: No size variants. The container is fixed at 24px. A `medium` (32px) size can be added once there is a real use case.

## Table integration pattern

`IconButton` does not know it is inside a table. The table wrapper `<div>` owns the `opacity-0 group-hover:opacity-100 transition-opacity` reveal behaviour:

```tsx
<div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
  <IconButton icon="more-horizantal" label={`Open actions for ${account.name}`} />
</div>
```
