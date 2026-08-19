import type { ComponentDoc } from "@/docs/types"

// Documents the REAL Views API in this repo. Views, ViewSelector and
// ViewSwitcher are three distinct components — do not conflate them beyond
// the one-sentence disambiguation below; each is documented only on its own
// real API.
export const viewsDoc: ComponentDoc = {
  slug: "views",
  name: "Views",
  status: "stable",
  description: "An inline dropdown trigger combining a filter's label cell and its selected-value cell, e.g. \"Status: Active\".",
  figmaNodeId: "1273:22",
  sourcePath: "src/components/ui/views.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Non-inline Views renders both cells bordered: a sunken label cell on the left and the value + chevron on the right. It is a trigger only — always pair it with a Dropdown List/Menu for the open state; this component does not render the options list itself.",
      exampleId: "views/default",
    },
    {
      id: "inline",
      title: "Inline",
      body:
        "`inline` drops the bordered label cell entirely — only the value and chevron render, with no border chrome, for placement within denser toolbars or inline text rather than as a standalone filter chip.",
      exampleId: "views/inline",
    },
    {
      id: "sizes",
      title: "Sizes",
      body:
        "Three sizes, verified independently via get_variable_defs rather than assumed uniform: Large (32px, font.body.medium 14/24 Regular), Small (28px, font.label.small 12/16 Regular), Extrasmall (24px, font.label.small, 16px icon instead of 24px).",
      exampleId: "views/sizes",
    },
    {
      id: "icon",
      title: "With a leading icon",
      body:
        "`icon` renders inside the label cell, coloured with the dedicated --c-views-icon-color token. The design team added dedicated views/* component tokens (2026-08-06) so this component no longer falls back to the semantic --s-color-surface-sunken token for its label-cell background.",
      exampleId: "views/icon",
    },
    {
      id: "disabled",
      title: "Disabled",
      body:
        "`disabled` swaps border, label and icon colours to their disabled tokens and disables the value-cell button. Only the non-inline variant shows a visible disabled border; the label cell is always non-interactive.",
      exampleId: "views/disabled",
    },
  ],

  props: [
    {
      name: "size",
      type: '"large" | "small" | "extrasmall"',
      defaultValue: '"large"',
      description: "Controls height, typography and icon size. See Sizes.",
    },
    {
      name: "inline",
      type: "boolean",
      defaultValue: "false",
      description: "Drops the bordered label cell, rendering only the value + chevron. See Inline.",
    },
    {
      name: "label",
      type: "string",
      required: true,
      description: "The filter's name, shown in the label cell (or before the value in Inline mode).",
    },
    {
      name: "value",
      type: "string",
      required: true,
      description: "The currently selected value, shown in the value cell/button. Truncates in non-inline mode.",
    },
    {
      name: "icon",
      type: "PrismIconName",
      description: "Optional leading icon in the label cell (non-inline only).",
    },
    {
      name: "open",
      type: "boolean",
      defaultValue: "false",
      description: "Whether the paired options list is open. Flips the chevron and applies the click border/background.",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Disables the value-cell button and applies disabled tokens throughout.",
    },
    {
      name: "onClick",
      type: "() => void",
      description: "Called when the value cell is clicked, typically to open/close the paired Dropdown List.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only. Do not use it to change border, padding or typography — those come from --c-views-* tokens.",
    },
  ],

  tokens: [
    "--c-views-background-default",
    "--c-views-background-hover",
    "--c-views-border-click",
    "--c-views-border-default",
    "--c-views-border-disabled",
    "--c-views-border-hover",
    "--c-views-gap-icon",
    "--c-views-gap-inline",
    "--c-views-icon-color",
    "--c-views-icon-size-large",
    "--c-views-icon-size-small",
    "--c-views-inline-hover-bg",
    "--c-views-label-default",
    "--c-views-label-disabled",
    "--c-views-label-subtle",
    "--c-views-padding-chevron",
    "--c-views-padding-horizontal",
    "--c-views-padding-value-left",
    "--c-views-radius",
    "--c-views-radius-extrasmall",
    "--c-views-radius-inline",
    "--c-views-surface-sunken",
    "--p-space-050",
    "--s-color-surface-sunken",
    "--t-font-body-medium-line-height",
    "--t-font-body-medium-size",
    "--t-font-body-medium-weight",
    "--t-font-label-small-line-height",
    "--t-font-label-small-size",
    "--t-font-label-small-weight",
  ],

  guidelines: {
    dos: [
      "Use Views for a labeled filter control that shows both the filter's name and its current value.",
      "Pair Views with a real Dropdown List/Menu for the open state — this component is a trigger only.",
      "Use `inline` when the trigger sits inside denser toolbars or text rather than as a standalone bordered chip.",
      "Pick the size that matches surrounding density — Extrasmall uses a 16px icon, not 24px.",
    ],
    donts: [
      "Don't use Views for a named/user-saved view trigger — that's ViewSelector.",
      "Don't use Views for a fixed 2-3 option layout toggle — that's ViewSwitcher.",
      "Don't fall back to the semantic --s-color-surface-sunken token for the label-cell background — use the dedicated --c-views-surface-sunken component token.",
      "Don't collapse the per-size font map to a single flat token — the flat views/label/fontSize tokens only describe the Large size.",
    ],
  },
}
