import type { ComponentDoc } from "@/docs/types"

// StatusLabel is deliberately left untouched by StatusSelect (see that doc):
// it is a non-interactive <span> used inside table cells. Making it
// interactive would give one component two jobs — that job belongs to
// StatusSelect instead.
export const statusLabelDoc: ComponentDoc = {
  slug: "status-label",
  name: "StatusLabel",
  status: "stable",
  description:
    "A read-only status chip. Non-interactive — use StatusSelect when the status needs to be changeable.",
  sourcePath: "src/components/ui/status-label.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "`variant` is required and selects both the background and text colour from the matching --c-statuslabel-color-* pair. With no `size`, StatusLabel resolves its size from the nearest Table's density via `useTableDensity` — compact tables get the small chip automatically.",
      exampleId: "status-label/default",
    },
    {
      id: "variants",
      title: "Variants",
      body:
        "Seven status variants: open, in-progress, waiting, active, completed, failed, inactive. Each maps to its own background/text token pair — pick the variant that matches the underlying status, not just a similar colour.",
      exampleId: "status-label/variants",
    },
    {
      id: "sizes",
      title: "Sizes",
      body:
        "Two explicit sizes: regular (default outside a table) and small. Passing `size` overrides the table-density auto-resolution.",
      exampleId: "status-label/sizes",
    },
    {
      id: "table-density",
      title: "Inside a table",
      body:
        "When StatusLabel is rendered inside a Table without an explicit `size`, it reads the table's density from context and renders small automatically for compact tables — callers never need to pass size by hand in table cells.",
      exampleId: "status-label/table-density",
    },
  ],

  props: [
    {
      name: "variant",
      type: '"open" | "in-progress" | "waiting" | "active" | "completed" | "failed" | "inactive"',
      required: true,
      description: "Status represented. Selects the background/text token pair.",
    },
    {
      name: "size",
      type: '"small" | "regular"',
      description:
        "Chip size. If omitted, resolves from the enclosing Table's density (compact → small, otherwise regular).",
    },
    {
      name: "children",
      type: "React.ReactNode",
      required: true,
      description: "The status label text.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only. Do not use it to change colour, height, radius, or typography.",
    },
  ],

  tokens: [
    "--c-statuslabel-color-bg-active",
    "--c-statuslabel-color-bg-completed",
    "--c-statuslabel-color-bg-failed",
    "--c-statuslabel-color-bg-in-progress",
    "--c-statuslabel-color-bg-inactive",
    "--c-statuslabel-color-bg-open",
    "--c-statuslabel-color-bg-waiting",
    "--c-statuslabel-color-text-active",
    "--c-statuslabel-color-text-completed",
    "--c-statuslabel-color-text-failed",
    "--c-statuslabel-color-text-in-progress",
    "--c-statuslabel-color-text-inactive",
    "--c-statuslabel-color-text-open",
    "--c-statuslabel-color-text-waiting",
    "--c-statuslabel-font-line-height",
    "--c-statuslabel-font-size",
    "--c-statuslabel-font-weight",
    "--c-statuslabel-gap",
    "--c-statuslabel-height-regular",
    "--c-statuslabel-height-small",
    "--c-statuslabel-padding-horizontal-regular",
    "--c-statuslabel-padding-horizontal-small",
    "--c-statuslabel-radius-regular",
    "--c-statuslabel-radius-small",
  ],

  guidelines: {
    dos: [
      "Use StatusLabel for read-only status display, most commonly in table cells.",
      "Let it inherit size from the enclosing Table's density rather than passing `size` by hand in table cells.",
      "Pick the variant that matches the underlying status semantics, not just a similar colour.",
      "Use StatusSelect instead when the status needs to be changeable by the user.",
    ],
    donts: [
      "Don't make StatusLabel interactive (onClick, role=button) — that responsibility belongs to StatusSelect.",
      "Don't override its background or text colour via className; each variant owns its own token pair.",
      "Don't pass `size` in a table cell unless intentionally overriding the density-derived default.",
    ],
  },
}
