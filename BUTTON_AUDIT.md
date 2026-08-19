# Prism Button Component — Audit Report
**Date:** 2026-07-27 · **File:** `src/components/ui/button.tsx`

---

## Size Matrix

All three sizes are official Prism tokens, all present in `prism-generated.css`.

| Prism size | Height | H-padding | V-padding | Gap | Font size | Line height |
|---|---|---|---|---|---|---|
| **Large** | `--c-button-height-large` = 32 px | `--c-button-padding-left-right-large` = 16 px | `--c-button-padding-top-bottom-large` = 4 px | `--c-button-gap-large` = 4 px | `--c-button-font-size` = 14 px | `--c-button-font-line-height` = 24 px |
| **Medium** | `--c-button-height-medium` = 28 px | `--c-button-padding-left-right-medium` = 12 px | `--c-button-padding-top-bottom-medium` = 2 px | `--c-button-gap-small` = 2 px | `--c-button-font-size` = 14 px | `--c-button-font-line-height` = 24 px |
| **Small** | `--c-button-height-small` = 24 px | `--c-button-padding-left-right-small` = 8 px | `--c-button-padding-top-bottom-small` = 2 px | `--c-button-gap-small` = 2 px | `--c-button-font-size-small` = 12 px | `--c-button-font-line-height-small` = 16 px |

> **Current issue:** The existing `Button` default uses ShadCN's `h-9` (36 px). Prism Large is 32 px. The top demo buttons are 4 px too tall.

---

## Variant Matrix

| Prism type | Current ShadCN name | Background | Border | Text | Hover background | Hover border | Hover effect |
|---|---|---|---|---|---|---|---|
| **Primary** | `default` | `--c-button-primary-background-default` #0369E9 | none | `--c-button-primary-content-default` #FFFFFF | — no change — | — | `--e-shadow-button-hover` |
| **Secondary** | `outline` (misnamed, wrong tokens) | `--c-button-secondary-background-default` #FFFFFF | `--c-button-secondary-border-default` #D5D9DE | `--c-button-secondary-content-default` #0369E9 | `--c-button-secondary-background-hover` #E6F0FD | `--c-button-secondary-border-hover` #D2E4FB | bg + border change |
| **Tertiary** | `ghost` (wrong tokens) | `--c-button-tertiary-background-default` transparent | none | `--c-button-tertiary-content-default` #0369E9 | `--c-button-tertiary-background-hover` #E6F0FD | — | bg change |
| **Destructive** | `destructive` ✓ | `--c-button-destructive-background-default` #BF210D | none | `--c-button-destructive-content-default` #FFFFFF | — no change — | — | `--e-shadow-button-hover` |

**Types not in scope for this POC:** `bulk-action`, `primary-split`.

---

## Shape

Token file contains two radius values:
- `--c-button-radius`: 8 px (standard)
- `--c-button-pill-radius`: 9999 px (pill)

Every Button instance inspected in Figma uses pill. The Figma `ButtonProps` exposes `size` and `type` only — no `shape` property. The 8 px token exists but is not observed in any Button component instance.

**Conclusion:** Pill is the universal default. No `shape` prop is warranted.

---

## Focus

No dedicated `button/focus/*` token exists in the token file. Prism uses the shared effect token:

```
--e-shadow-focus: 0px 0px 0px 3px rgba(3, 105, 233, 0.25)
```

Current `button.tsx` uses `focus-visible:ring-ring` → routes to `--ring` → `--c-textfield-focus-ring-color`. That is a **textfield token on a button** — wrong.

Correct implementation: `focus-visible:shadow-[var(--e-shadow-focus)]`

---

## Disabled State (shared across all types)

| Token | Value |
|---|---|
| `--c-button-disabled-background` | #E6E9EC |
| `--c-button-disabled-content` | #ACB4BD |
| `--c-button-disabled-border` | #E6E9EC |

---

## Token Leakage in Current `button.tsx`

| Class | Resolves to | Should be |
|---|---|---|
| `rounded-md` | `calc(var(--p-radius-100) - 2px)` = 6 px | `rounded-[var(--c-button-pill-radius)]` |
| `font-medium` | weight 500 | `font-[var(--c-button-font-weight)]` = 600 |
| `text-sm` | 14 px (value ok, class wrong) | `text-[length:var(--c-button-font-size)]` |
| `gap-2` | 8 px | `gap-[var(--c-button-gap-small)]` = 2 px |
| `h-9 px-4 py-2` | 36 / 16 / 8 px | `h-[var(--c-button-height-large)]` 32 px / 16 px / 4 px |
| `focus-visible:ring-ring` | `--c-textfield-focus-ring-color` | `--e-shadow-focus` |
| `focus-visible:ring-2 ring-offset-2` | ring-width model | use box-shadow instead |
| `border-input` (outline variant) | `--c-textfield-border-default` | `--c-button-secondary-border-default` |
| `bg-background` (outline variant) | `--s-color-surface-page` = #F5F7F9 (grey) | `--c-button-secondary-background-default` = white |
| `hover:bg-[var(--c-button-secondary-background-hover)]` (ghost) | secondary token | `--c-button-tertiary-background-hover` |

---

## Answers to Key Questions

**1. Is the Empty State's 28 px pill button an official Prism Button variant?**
Yes. `button/height/medium: 28` and `button/pill/radius: 9999` are both first-class Prism tokens.

**2. Is it represented in the main Prism Button component set?**
Yes. The Figma `ButtonProps` exposes `size?: "Large" | "Medium"`. Medium is a named Figma property.

**3. Does it use `size=medium`, `shape=pill`, or another named Figma property?**
It uses `size="Medium"`. Pill is universal — there is no separate shape prop in Figma.

**4. Are the required tokens already present in the codebase?**
Yes. All medium-size tokens are already in `prism-generated.css`.

**5. Is the 36 px top demo button the correct default Prism size?**
No. Prism Large = 32 px. The current top buttons use ShadCN's `h-9` (36 px) and are 4 px too tall.

**6. Which `button.tsx` classes are inherited ShadCN defaults rather than Prism rules?**
`rounded-md`, `font-medium`, `text-sm`, `gap-2`, `h-9`, `px-4 py-2`, `h-8`, `h-10`, `ring-ring`, `ring-offset-2`, `border-input`, `bg-background`.

**7. What should the typed React API be?**

```tsx
variant?: "primary" | "secondary" | "tertiary" | "destructive"
// default: "primary"

size?: "large" | "medium" | "small"
// default: "large"

// No shape prop — pill is universal per Figma
```

---

## Proposed Changes

### `button.tsx` — base class

```diff
- "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium
-  transition-colors outline-none disabled:pointer-events-none disabled:opacity-50
-  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
+ "inline-flex items-center justify-center whitespace-nowrap outline-none transition-colors
+  rounded-[var(--c-button-pill-radius)]
+  text-[length:var(--c-button-font-size)] font-[var(--c-button-font-weight)] leading-[var(--c-button-font-line-height)]
+  gap-[var(--c-button-gap-small)]
+  focus-visible:shadow-[var(--e-shadow-focus)]
+  disabled:pointer-events-none
+  disabled:bg-[var(--c-button-disabled-background)]
+  disabled:text-[var(--c-button-disabled-content)]
+  disabled:border-[var(--c-button-disabled-border)]"
```

### `button.tsx` — variants

```diff
  variants: {
    variant: {
-     default:     "bg-primary text-primary-foreground hover:bg-primary hover:shadow-[var(--e-shadow-button-hover)] active:bg-[var(--c-button-primary-background-click)]",
+     primary:     "bg-[var(--c-button-primary-background-default)] text-[var(--c-button-primary-content-default)] hover:shadow-[var(--e-shadow-button-hover)] active:bg-[var(--c-button-primary-background-click)]",

-     destructive: "bg-destructive text-destructive-foreground hover:bg-destructive hover:shadow-[var(--e-shadow-button-hover)] active:bg-[var(--c-button-destructive-background-click)]",
+     destructive: "bg-[var(--c-button-destructive-background-default)] text-[var(--c-button-destructive-content-default)] hover:shadow-[var(--e-shadow-button-hover)] active:bg-[var(--c-button-destructive-background-click)]",

-     outline:     "border border-input bg-background hover:bg-[var(--c-button-secondary-background-hover)] active:bg-[var(--c-button-secondary-background-click)]",
+     secondary:   "border border-[var(--c-button-secondary-border-default)] bg-[var(--c-button-secondary-background-default)] text-[var(--c-button-secondary-content-default)] hover:bg-[var(--c-button-secondary-background-hover)] hover:border-[var(--c-button-secondary-border-hover)] active:bg-[var(--c-button-secondary-background-click)] active:border-[var(--c-button-secondary-border-click)]",

-     secondary:   "bg-secondary text-secondary-foreground hover:bg-[var(--c-button-secondary-background-hover)] active:bg-[var(--c-button-secondary-background-click)]",
+     tertiary:    "bg-[var(--c-button-tertiary-background-default)] text-[var(--c-button-tertiary-content-default)] hover:bg-[var(--c-button-tertiary-background-hover)] active:bg-[var(--c-button-tertiary-background-click)]",

-     ghost:       "hover:bg-[var(--c-button-secondary-background-hover)] active:bg-[var(--c-button-secondary-background-click)]",
-     link:        "text-primary underline-offset-4 hover:underline",
    },

    size: {
-     default: "h-9 px-4 py-2",
-     sm:      "h-8 rounded-md px-3 text-xs",
-     lg:      "h-10 rounded-md px-6",
-     icon:    "size-9",
+     large:  "h-[var(--c-button-height-large)] px-[var(--c-button-padding-left-right-large)] py-[var(--c-button-padding-top-bottom-large)] gap-[var(--c-button-gap-large)]",
+     medium: "h-[var(--c-button-height-medium)] px-[var(--c-button-padding-left-right-medium)] py-[var(--c-button-padding-top-bottom-medium)]",
+     small:  "h-[var(--c-button-height-small)] px-[var(--c-button-padding-left-right-small)] py-[var(--c-button-padding-top-bottom-small)] text-[length:var(--c-button-font-size-small)] leading-[var(--c-button-font-line-height-small)]",
    },

    defaultVariants: {
-     variant: "default",
-     size:    "default",
+     variant: "primary",
+     size:    "large",
    },
```

### `App.tsx` — demo row

```diff
- <Button>Primary action</Button>
- <Button variant="outline">Outline action</Button>
- <Button variant="secondary">Secondary action</Button>
+ <Button>Primary action</Button>
+ <Button variant="secondary">Secondary action</Button>
+ <Button variant="tertiary">Tertiary action</Button>
```

### `App.tsx` — Empty State actions

```diff
- <button type="button" className="inline-flex … h-[var(--c-button-height-medium)] …">Import data</button>
- <button type="button" className="inline-flex … bg-[var(--c-button-primary-background-default)] …">Add account</button>
+ <Button variant="secondary" size="medium">Import data</Button>
+ <Button size="medium">Add account</Button>
```

---

## Illustration Note

The 80×80 box in the Empty State is a **temporary POC placeholder**. The Figma component itself only specifies a `Placeholder` illustration variant for this state. No approved Prism illustration asset currently exists in the project. This must not be used as a reusable component or confused with a PrismIcon. Replace when the real asset is available.
