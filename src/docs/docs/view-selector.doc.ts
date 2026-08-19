import type { ComponentDoc } from "@/docs/types"

// Documents the REAL ViewSelector API in this repo. ViewSelector, Views and
// ViewSwitcher are three distinct components — do not conflate them beyond
// the one-sentence disambiguation below; each is documented only on its own
// real API.
export const viewSelectorDoc: ComponentDoc = {
  slug: "view-selector",
  name: "View Selector",
  status: "stable",
  description: "A trigger for a named, user-saved view (e.g. \"My CTAs due this week\") that opens a list of saved views.",
  figmaNodeId: "1273:21",
  sourcePath: "src/components/ui/view-selector.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "ViewSelector renders only a label and a chevron — no bordered cells. It is a trigger only: always pair it with a Dropdown List that appears below it on click. Distinct from Views (a labeled filter control with label + value cells) and ViewSwitcher (a fixed 2-3 option pill toggle) — do not substitute one for another.",
      exampleId: "view-selector/default",
    },
    {
      id: "sizes",
      title: "Sizes",
      body:
        "Three sizes: Large (32px, 16px SemiBold), Medium (28px, 14px SemiBold), Small (24px, 12px SemiBold), all verified via get_variable_defs and reusing the same heading tokens already verified for Tabs. The chevron itself binds icon/size/024 at Large but icon/size/016 at Medium and Small — it is not a fixed size across sizes. There is no disabled state.",
      exampleId: "view-selector/sizes",
    },
    {
      id: "open",
      title: "Open state",
      body:
        "`open` flips the chevron from chevron-down to chevron-up and applies the click background token. It reflects whether the paired Dropdown List is currently showing — this component does not render that list itself.",
      exampleId: "view-selector/open",
    },
  ],

  props: [
    {
      name: "size",
      type: '"large" | "medium" | "small"',
      defaultValue: '"large"',
      description: "Controls height and typography/chevron scale. See Sizes.",
    },
    {
      name: "label",
      type: "string",
      required: true,
      description: "The current view's name. Truncates at 240px.",
    },
    {
      name: "open",
      type: "boolean",
      defaultValue: "false",
      description: "Whether the paired options list is open. Flips the chevron direction and applies the click background.",
    },
    {
      name: "onClick",
      type: "() => void",
      description: "Called when the trigger is clicked, typically to open/close the paired Dropdown List.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only. Do not use it to change height, radius or typography — those come from --c-view-selector-* tokens.",
    },
  ],

  tokens: [
    "--c-view-selector-background-click",
    "--c-view-selector-background-hover",
    "--c-view-selector-label",
    "--c-view-selector-padding-left",
    "--c-view-selector-padding-right",
    "--c-view-selector-radius",
    "--p-space-100",
    "--s-icon-color-default",
    "--t-font-heading-small-line-height",
    "--t-font-heading-small-size",
    "--t-font-heading-small-weight",
    "--t-font-heading-xsmall-line-height",
    "--t-font-heading-xsmall-size",
    "--t-font-heading-xsmall-weight",
    "--t-font-heading-xxsmall-line-height",
    "--t-font-heading-xxsmall-size",
    "--t-font-heading-xxsmall-weight",
  ],

  guidelines: {
    dos: [
      "Use ViewSelector only for named/user-saved views, paired with a Dropdown List for the open state.",
      "Match `open` to whatever list is actually visible, so the chevron direction stays truthful.",
      "Pick a size to match the surrounding chrome — Large for a page header, Medium/Small for denser toolbars.",
    ],
    donts: [
      "Don't use ViewSelector for a labeled filter control — that's Views, with its label + value cells.",
      "Don't use ViewSelector for a fixed 2-3 option layout toggle (Chart/Table/List) — that's ViewSwitcher.",
      "Don't render the options dropdown inside this component; it is a trigger only.",
      "Don't add a disabled treatment — Figma's own spec defines no disabled state for this component.",
    ],
  },
}
