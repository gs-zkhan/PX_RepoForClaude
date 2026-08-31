import type { ComponentDoc } from "@/docs/types"

// STATUS: APPROVED (2026-08-30). Design owner completed visual review and
// approved this component as implemented — no outstanding exceptions. See
// ai/figma-coverage.json (id component-card) and src/components/ui/card.tsx
// for the full evidence trail.
export const cardDoc: ComponentDoc = {
  slug: "card",
  name: "Card",
  status: "stable",
  description:
    "APPROVED (2026-08-30). A selectable list-item card — leading icon, title/description, optional tags row (large), and a freeform trailing slot for status/actions (small).",
  figmaNodeId: "7611:395",
  sourcePath: "src/components/ui/card.tsx",

  sections: [
    {
      id: "status",
      title: "Review status",
      body:
        "Implemented against Figma page 7611:395, defining frame 7613:57. Unlike Link/Divider/Button, this page carries no AI Instructions or Dos/Don'ts frames in the approved file — anatomy is derived from the 8 symbols' own visual layout (screenshot-verified) plus this repo's generated tokens. Design owner completed visual review and approved this component on 2026-08-30 — no outstanding exceptions.",
    },
    {
      id: "distinct",
      title: "Distinct from CanvasCard, SummaryStat, and ConfigRow",
      body:
        "CanvasCard is an unrelated two-pane resizable editor shell. SummaryStat is a KPI value+label display with no icon/title/description/tags anatomy. ConfigRow is the closest anatomical relative (icon + title/subtitle + trailing + chevron) but has no Selected state, no tags row, and no reorder handle — Card is not built by extending any of these, and none of them were modified.",
    },
    {
      id: "legal-variants",
      title: "8/8 legal Figma variants — not a full Cartesian product",
      body:
        "CORRECTED (2026-08-30): re-enumerated frame 7613:57 directly via get_metadata instead of assuming `Size × State × WithTags` combine freely. All 8 symbols render in the example below, in this order: 1. Large/Default/with tags (7623:3891) — 2. Large/Selected/with tags (7623:3906) — 3. Large/Default/without tags (7623:3921) — 4. Large/Selected/without tags (7623:3929) — 5. Small/Default (7614:231) — 6. Small/Selected (7614:284) — 7. Small/Compact, mapped from Figma's `State=SelectedMin` (7621:3622) — 8. Small/Empty (7620:315). Large never has Compact/Empty; Small never has a tags row. The component is typed as a discriminated union on `size` so these invalid combinations cannot be constructed in code.",
      exampleId: "card/sizes-states",
    },
    {
      id: "small-row",
      title: "Small row — reorder handle, trailing actions, Compact",
      body:
        "`reorderHandle` (small only) is a caller-supplied node rendered before the leading icon — this component does not implement drag-and-drop physics or keyboard reorder instructions; wire up your own DnD library and pass your own handle element if real reordering is needed. `trailing` (small only) is fully freeform — Figma shows a status Chip + destructive delete IconButton + disclosure chevron for populated rows, but nothing is hard-coded. RENAMED (2026-08-30): the public API calls Figma's `State=SelectedMin` symbol (7621:3622) `state=\"compact\"` instead — evidence: `get_variable_defs` shows Selected (7614:284) bound to `color/line/brand` (#0369e9), while this symbol (7621:3622) is bound to `color/line/default` (#d5d9de) — the plain default border, not the brand/selected one — and its layer tree has no selection indicator (no checkmark/dot/fill change). It is a condensed/minimized row, not a selected row, so it is not named after \"selected\" in the public API; `aria-pressed` is driven strictly by `state === \"selected\"`, which `compact` never satisfies. No deprecated `selectedMin` alias is retained.",
      exampleId: "card/small-row",
    },
    {
      id: "empty-state",
      title: "Empty — a distinct, non-selectable branch",
      body:
        "REFINED (2026-08-30): `state=\"empty\"` is its own typed branch, not a boolean flag layered on top of Default. Figma never pairs Empty with Selected (no \"Empty + Selected\" symbol exists among the 8 audited variants) and Empty's own anatomy — a single \"Add\" affordance, no status Chip/delete/chevron — reads as an invite-to-add prompt rather than an existing, selectable row. Accordingly this branch requires `trailing` (compose the approved `Link`; this component does not hard-code its copy or destination) and does not accept `onSelect` at all — passing one is a type error, not just a documentation note. Visual anatomy is otherwise identical to Default (icon, title, AND description all still render).",
      exampleId: "card/small-row",
    },
  ],

  props: [
    { name: "size", type: '"large" | "small"', required: true, description: "Selects which discriminated-union branch applies — see \"8/8 legal Figma variants\" above." },
    { name: "state (large)", type: '"default" | "selected"', defaultValue: '"default"', description: "Large only. Selected applies a 2px primary-blue border (background stays white)." },
    { name: "state (small, interactive)", type: '"default" | "selected" | "compact"', defaultValue: '"default"', description: "Small only, when `onSelect` may be supplied. `compact` maps to Figma's `State=SelectedMin` symbol (7621:3622) — a 48px condensed row with the default border, not the blue Selected border, and never `aria-pressed`. See Small row section for the variable-binding evidence." },
    { name: "state (small, empty)", type: '"empty"', required: true, description: "Small only. A distinct, non-selectable branch — see Empty section. Requires `trailing`; rejects `onSelect` at the type level." },
    { name: "icon", type: "React.ReactNode", description: "Leading icon/avatar slot." },
    { name: "title", type: "React.ReactNode", required: true, description: "Card title." },
    { name: "description", type: "React.ReactNode", description: "Card description. Automatically hidden when size=\"small\" and state=\"compact\"." },
    { name: "tags (large only)", type: "React.ReactNode", description: "Large only — not accepted for size=\"small\". Compose approved Chip elements. Renders only when supplied." },
    { name: "reorderHandle (small only)", type: "React.ReactNode", description: "Small only — not accepted for size=\"large\". Caller-supplied reorder affordance; no drag physics implemented." },
    { name: "trailing (small only)", type: "React.ReactNode", description: "Small only — not accepted for size=\"large\". Optional for state=\"default\"/\"selected\"/\"compact\"; required for state=\"empty\". Rendered as a sibling of the selection button, never nested inside it." },
    { name: "onSelect", type: "() => void", description: "Large, and small non-empty states: supplying this makes the icon/title/description region a real <button> with aria-pressed reflecting state===\"selected\". Not accepted (typed `never`) when size=\"small\" and state=\"empty\"." },
    { name: "className", type: "string", description: "Placement only." },
  ],

  tokens: [
    "--s-color-surface-default",
    "--s-color-line-default",
    "--s-color-action-primary-default",
    "--s-color-text-default",
    "--s-color-text-subtle",
    "--t-font-heading-small-size",
    "--t-font-heading-small-weight",
    "--t-font-heading-small-line-height",
    "--p-font-size-medium",
    "--p-radius-150",
    "--p-space-100",
    "--p-space-150",
    "--p-space-200",
    "--p-space-600",
    "--e-shadow-focus",
  ],

  guidelines: {
    dos: [
      "Compose Chip elements for the tags row (size=\"large\" only).",
      "Compose Link/IconButton/Chip for the trailing slot (size=\"small\" only) — do not invent new visual treatments.",
      "Supply `onSelect` whenever the card represents a real selectable option.",
    ],
    donts: [
      "Don't nest an interactive trailing action inside the selection button — `trailing` is already a sibling by construction; don't move it inside `onSelect`'s button.",
      "Don't implement real drag-and-drop physics inside this component — `reorderHandle` is a caller-supplied slot, not a built-in behaviour.",
      "Don't extend CanvasCard or ConfigRow to add this anatomy — Card is a distinct component.",
      "Don't invent a whole-card disabled state — no Disabled variant exists in the audited Figma evidence; disable individual freeform trailing controls yourself if needed.",
      "Don't try to make an Empty card selectable — `onSelect` is rejected at the type level for state=\"empty\"; Figma has no Empty+Selected variant.",
    ],
  },
}
