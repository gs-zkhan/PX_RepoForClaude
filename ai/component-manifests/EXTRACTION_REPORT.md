# Component Extraction Report

**Date:** 2026-07-28
**Figma file:** Prism V1 — ShadCN (`U3D8WMBVFl9LvAZyLHhm24`)
**Source library:** Prism - AI Design System of PX
**Last updated:** 2026-07-28 — Phase 1 manifest refresh complete

---

## 1. Extraction Summary

| Component | Figma Name | Status | Node ID |
|---|---|---|---|
| Search Field | Search Bar | **Ready** — all tokens resolved, reuses textfield tokens; current implementation renders the available 24px search icon, with the missing 16px asset tracked as a fidelity gap | UNRESOLVED |
| Filter Chip | Filter Chip | **Ready** — all tokens resolved, uses semantic tokens directly | UNRESOLVED |
| Dropdown Menu | Dropdown List (floating panel) | **Ready** — comprehensive `--c-dropdown-menu-*` token set confirmed, shadow resolved to `--e-shadow-500`. **Blocking: Radix package missing.** | UNRESOLVED |
| Avatar | Avatar | **Ready** — all 3 size tokens + fallback colors + typography confirmed. **Blocking: Radix package missing.** | UNRESOLVED |
| Tooltip | Tooltip | **Ready** — 4 component tokens confirmed, semantic bg/text tokens confirmed, no shadow. **Blocking: Radix package missing.** | UNRESOLVED |

**All 5 Figma node IDs remain UNRESOLVED.**

---

## 2. Blocking Issues (Implementation)

These items prevent full implementation and must be resolved before completing the affected components:

### Critical — Install Required

| Package | Required By | Install Command |
|---|---|---|
| `@radix-ui/react-dropdown-menu` | DropdownMenu component | `npm install @radix-ui/react-dropdown-menu` |
| `@radix-ui/react-avatar` | Avatar component | `npm install @radix-ui/react-avatar` |
| `@radix-ui/react-tooltip` | Tooltip component | `npm install @radix-ui/react-tooltip` |

All three components are **stubbed** with typed APIs and clear BLOCKING comments. SearchBar and FilterChip are fully implemented (they do not require missing Radix packages).

### Asset Gap

| Asset | Required By | Location Checked | Status |
|---|---|---|---|
| `search.svg` at 16px | SearchBar leading icon | `src/assets/icons/16/` | MISSING — only exists at 24px |

A 16px version of `search.svg` is still absent from `src/assets/icons/16/`. The current SearchBar explicitly renders the available 24px asset, so its leading icon is visible; adding a 16px asset remains a fidelity gap rather than a rendering blocker.

---

## 3. Resolved Items (Previously Uncertain)

### Shadow Token Conflict — RESOLVED

**Previous state:** Manifests referenced `--p-shadow-200` for dropdown and tooltip shadow. The CSS `--p-shadow-200` value differed from E_Effects.styles.json `shadow/200`.

**Resolution:** 
- Dropdown Menu uses `--e-shadow-500` (confirmed correct token)
- Tooltip has **NO shadow** (confirmed)
- `--e-shadow-500` value in CSS: `0px 12px 32px 0px rgba(60,74,87,0.08), 0px 0px 1px 0px rgba(60,74,87,0.2)` ✓

### Filter Chip Color States — RESOLVED

**Previous state:** 6 filter chip color state tokens were marked UNRESOLVED (inferred from pattern).

**Resolution:** All state tokens confirmed using semantic tokens directly:
- hover background: `--s-color-surface-muted` (#F5F7F9)
- pressed/active background: `--s-color-surface-sunken` (#E6E9EC)
- disabled background: `--s-color-surface-disabled` (#E6E9EC)
- border selected: `--c-textfield-border-focus` (#0369E9) — same action/primary/default value
- border disabled: `--s-color-line-disabled` (#E6E9EC)

### Tooltip Padding — RESOLVED

**Previous state:** Tooltip padding (4px vertical / 8px horizontal) was marked UNRESOLVED.

**Resolution:** Confirmed as `px-2 py-1` (standard Tailwind utility classes). No dedicated token needed.

### Dropdown Panel Border — RESOLVED

**Previous state:** Manifest referenced `--c-dropdown-border-default` for the panel border.

**Resolution:** `--c-dropdown-border-default` belongs to the **form select trigger** input, NOT the action menu panel. Dropdown Menu panel border uses `--s-color-line-default` (#D5D9DE).

### Avatar Fallback Colors — RESOLVED

**Previous state:** Avatar fallback background and text marked UNRESOLVED.

**Resolution:**
- Fallback background: `--s-color-surface-sunken` (#E6E9EC) ✓
- Fallback text: `--s-color-text-subtle` (#3C4A57) ✓

### Search Bar Disabled Background — RESOLVED

**Previous state:** `--c-search-background-disabled` was proposed but unconfirmed.

**Resolution:** `--c-search-background-disabled: #E6E9EC` already exists in CSS. Value is `#E6E9EC` (surface/disabled/sunken) — different from `--c-textfield-background-disabled: #F5F7F9` (surface/muted). Search Bar disabled background is darker than textfield disabled.

### Search Bar Token Reuse — RESOLVED

**Previous state:** Manifests proposed 15+ new `--c-search-*` tokens duplicating textfield tokens.

**Resolution:** Search Bar reuses all `--c-textfield-*` tokens for border, background, content, radius, and focus-ring. Only the height tokens (`--c-search-height-*`) and `--c-search-background-disabled` are Search-Bar-specific. No new duplicate tokens needed.

### Dropdown Destructive Item Token — RESOLVED

**Previous state:** A new `--c-dropdown-menu-item-content-destructive` token was proposed.

**Resolution:** Use `--s-color-status-danger-default` (#DC3626) directly. No new token needed.

---

## 4. Reusable Existing Tokens (Confirmed)

### Search Field (Search Bar)
| Property | Token | Value |
|---|---|---|
| height/medium | `--c-search-height-medium` | 32px |
| height/large | `--c-search-height-large` | 40px |
| height/xlarge | `--c-search-height-xlarge` | 36px |
| height/xxlarge | `--c-search-height-xxlarge` | 40px |
| background/disabled | `--c-search-background-disabled` | #E6E9EC |
| All other visuals | `--c-textfield-*` | (reused from Input component) |
| icon/color | `--s-icon-color-default` | #3C4A57 |

### Filter Chip
| Property | Token | Value |
|---|---|---|
| height | `--c-filterchip-height` | 28px |
| radius | `--p-radius-full` | 9999px |
| padding | `--p-space-050`, `--p-space-100` | 4px, 8px |
| gap | `--p-space-050` | 4px |
| background/default | `--s-color-surface-default` | #FFFFFF |
| background/hover | `--s-color-surface-muted` | #F5F7F9 |
| background/pressed | `--s-color-surface-sunken` | #E6E9EC |
| background/disabled | `--s-color-surface-disabled` | #E6E9EC |
| border/default | `--s-color-line-default` | #D5D9DE |
| border/selected | `--c-textfield-border-focus` | #0369E9 |
| border/disabled | `--s-color-line-disabled` | #E6E9EC |
| text | `--s-color-text-subtle` | #3C4A57 |
| text/disabled | `--s-color-text-disabled` | #ACB4BD |
| font/size | `--p-font-size-h6` | 14px |
| font/weight | `--p-font-weight-regular` | 400 |
| font/line-height | `--p-font-line-height-h6` | 24px |
| focus-ring | `--e-shadow-focus` | rgba(3,105,233,0.25) ring |

### Dropdown Menu
| Property | Token | Value |
|---|---|---|
| panel/background | `--c-dropdown-menu-background` | #FFFFFF |
| panel/border | `--s-color-line-default` | #D5D9DE |
| panel/radius | `--c-dropdown-menu-radius` | 12px |
| panel/shadow | `--e-shadow-500` | 0px 12px 32px... |
| panel/padding-vertical | `--c-dropdown-menu-padding-vertical` | 8px |
| item/bg/hover | `--c-dropdown-menu-item-background-hover` | #F5F7F9 |
| item/bg/selected | `--c-dropdown-menu-item-background-selected` | #E9F8FA |
| item/content | `--c-dropdown-menu-item-content` | #181F26 |
| item/content/destructive | `--s-color-status-danger-default` | #DC3626 |
| divider | `--c-dropdown-menu-divider` | #D5D9DE |
| section-label | `--c-dropdown-menu-section-label` | #3C4A57 |

### Avatar
| Property | Token | Value |
|---|---|---|
| size/small | `--c-avatar-size-small` | 16px |
| size/medium | `--c-avatar-size-medium` | 24px |
| size/large | `--c-avatar-size-large` | 32px |
| radius | `--p-radius-full` | 9999px |
| fallback/bg | `--s-color-surface-sunken` | #E6E9EC |
| fallback/text | `--s-color-text-subtle` | #3C4A57 |
| font/size | `--p-font-size-h7` | 12px |
| font/weight | `--p-font-weight-regular` | 400 |
| font/line-height | `--p-font-line-height-h7` | 16px |

### Tooltip
| Property | Token | Value |
|---|---|---|
| font/size | `--c-tooltip-font-size` | 12px |
| font/weight | `--c-tooltip-font-weight` | 400 |
| font/line-height | `--c-tooltip-font-line-height` | 16px |
| radius | `--c-tooltip-radius` | 6px |
| background | `--s-color-surface-inverse` | #181F26 |
| text/color | `--s-color-text-inverse` | #FFFFFF |
| shadow | none — NO shadow | — |

---

## 5. New Tokens Added to CSS

The following tokens were confirmed by the task spec to have been added to `prism-generated.css`:

| Token | Value | Component |
|---|---|---|
| `--c-search-background-disabled` | #E6E9EC | Search Bar |
| `--c-search-height-large` | 40px | Search Bar |
| `--c-search-height-medium` | 32px | Search Bar |
| `--c-search-height-xlarge` | 36px | Search Bar |
| `--c-search-height-xxlarge` | 40px | Search Bar |
| `--c-filterchip-height` | 28px | Filter Chip |
| `--c-avatar-size-small` | 16px | Avatar |
| `--c-avatar-size-medium` | 24px | Avatar |
| `--c-avatar-size-large` | 32px | Avatar |
| `--c-tooltip-radius` | 6px | Tooltip |
| `--c-tooltip-font-size` | 12px | Tooltip |
| `--c-tooltip-font-line-height` | 16px | Tooltip |
| `--c-tooltip-font-weight` | 400 | Tooltip |

---

## 6. Ambiguous or Incorrect Bindings (Remaining)

1. **Filter Chip border in hover vs. default** — The border stays `--s-color-line-default` on hover (only background changes). This is inferred from pattern; Figma node access would confirm.

2. **Dropdown Menu naming** — The CSS token namespace `--c-dropdown-menu-*` co-exists with `--c-dropdown-*`. These must not be mixed: `--c-dropdown-*` = form select trigger, `--c-dropdown-menu-*` = action menu panel.

---

## Summary Counts

| Metric | Count |
|---|---|
| Components ready for implementation | 5 |
| Components fully implemented (no Radix needed) | 2 (Search Bar, Filter Chip) |
| Components stubbed (Radix package missing) | 3 (Dropdown Menu, Avatar, Tooltip) |
| Total existing tokens confirmed reusable | 44+ |
| New tokens added to CSS | 13 (pre-existing from prior work) |
| New tokens still needed | 0 |
| Blocking package installs needed | 3 |
| Missing icon assets | 1 (16px search icon) |
| Figma node IDs resolved | 0 |
| Figma node IDs UNRESOLVED | 5 |
