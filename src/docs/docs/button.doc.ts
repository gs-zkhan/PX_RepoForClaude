import type { ComponentDoc } from "@/docs/types"

// Documents the REAL Button API in this repo (four variants, three sizes,
// asChild). It deliberately does not mirror another design system's taxonomy —
// e.g. we have no "subtle"/"discovery"/"link" appearance and no `fullWidth`
// prop, so those are absent here rather than faked.
export const buttonDoc: ComponentDoc = {
  slug: "button",
  name: "Button",
  status: "stable",
  description:
    "A button triggers an action. Use the label to say plainly what will happen when it is pressed.",
  figmaNodeId: "20:5",
  sourcePath: "src/components/ui/button.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "With no props, Button renders the primary appearance at the large size. Use one primary button per view to mark the most important action; every other action on the same surface should be a lower-emphasis variant.",
      exampleId: "button/default",
    },
    {
      id: "appearance",
      title: "Appearance",
      body:
        "Four variants, set with the `variant` prop. Primary is the main confirming action. Secondary is the common companion for Cancel and other neutral actions. Tertiary carries no container and suits inline, low-emphasis actions. Destructive is for irreversible actions such as deleting a record — pair it with a confirmation step.",
      exampleId: "button/appearance",
    },
    {
      id: "sizes",
      title: "Sizes",
      body:
        "Three sizes, set with the `size` prop. Large (32px) is the default and correct for page and modal actions. Medium and Small exist for denser contexts such as toolbars, table rows and side panels. Height, padding and — for Small — font size all come from the button's own tokens, so do not adjust them by hand.",
      exampleId: "button/sizes",
    },
    {
      id: "disabled",
      title: "Disabled",
      body:
        "Set `disabled` when the action cannot currently be performed. All variants collapse to the same disabled treatment, and pointer events are removed. Prefer explaining why an action is unavailable — a disabled control with no explanation is a dead end for the user.",
      exampleId: "button/disabled",
    },
    {
      id: "with-icon",
      title: "Button with icon",
      body:
        "Button has no icon prop. Compose a PrismIcon as a child, before or after the label. The button owns the gap between icon and label through its own gap tokens, so no spacing classes are needed. Use 16px icons to sit correctly against the label.",
      exampleId: "button/with-icon",
    },
    {
      id: "as-child",
      title: "Rendering as another element",
      body:
        "`asChild` applies Button's styling to the child element instead of rendering a <button>. Reach for it when the action navigates: an anchor preserves link semantics and the browser affordances users expect, while still looking like a button.",
      exampleId: "button/as-child",
    },
    {
      id: "bulk-action",
      title: "Bulk action variant — Visual Review: Approved, Approved for AI use: Yes (2026-08-29)",
      body:
        "`variant=\"bulkAction\"` (Figma \"Type=Bulk Action\", Button page node 20:10, representative symbol 4044:23993). Regular font weight (not SemiBold), neutral background, grey border — visually distinct from every other variant, but with the exact same click/keyboard/disabled semantics as Primary/Secondary/Tertiary. Figma's own AI Instructions describe only a typographic and colour difference; there is no multi-select, toggle, or conditional-visibility behaviour evidenced anywhere in the Figma source, so none is implemented — do not infer bulk-selection behaviour from the name. Implemented against real, already-generated tokens (src/styles/prism-generated.css:370-377). Design-owner visually verified this variant's anatomy, typography, sizing, and states on 2026-08-29 — see ai/figma-coverage.json (id component-button-bulk-variant).",
      exampleId: "button/bulk-action",
    },
    {
      id: "split",
      title: "Split — Visual Review: Approved, Approved for AI use: Yes (2026-08-29)",
      body:
        "Figma's \"Type=Primary-Split\" variant (Button page node 20:10, representative symbol 4044:24089) is modelled in Figma as one visual symbol, but its own AI Instructions describe two functionally distinct zones — a primary action and a separate dropdown trigger, joined by a divider. A single <button> element cannot expose two independently keyboard-operable, independently labelled regions, so this is implemented as a new component, `SplitButton` (src/components/ui/split-button.tsx), composing two real Button instances (reusing the additive `radiusEdge` prop to square off the adjoining edge instead of a className override) plus the existing DropdownMenu primitive for the actual secondary-options popover — not a `variant` value on Button itself. The chevron flips (chevron-down → chevron-up) exactly per Figma when the menu opens. Design-owner visually verified the distinct action/trigger segments, divider, and chevron states on 2026-08-29 — see ai/figma-coverage.json (id component-button-split-variant).",
      exampleId: "button/split",
    },
  ],

  props: [
    {
      name: "variant",
      type: '"primary" | "secondary" | "tertiary" | "destructive" | "bulkAction"',
      defaultValue: '"primary"',
      description:
        "Visual emphasis. See Appearance for the four original variants. `bulkAction` is Figma-evidenced and design-owner approved (2026-08-29) — see \"Bulk action variant\" below and ai/figma-coverage.json's component-button-bulk-variant entry.",
    },
    {
      name: "radiusEdge",
      type: '"all" | "start" | "end"',
      defaultValue: '"all"',
      description:
        "Which corners get the pill radius. New, additive — every existing consumer omits this and is byte-for-byte unchanged (\"all\", the prior unconditional behaviour). Added so SplitButton can compose two adjoining Button instances that read as one pill without overriding Button's radius via className.",
    },
    {
      name: "size",
      type: '"large" | "medium" | "small"',
      defaultValue: '"large"',
      description:
        "Control height and padding. Large for page and modal actions; Medium and Small for dense contexts.",
    },
    {
      name: "asChild",
      type: "boolean",
      defaultValue: "false",
      description:
        "Render the styling onto the single child element rather than a <button>. Use for navigation, with an <a> child.",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description:
        "Disable the action. Applies the shared disabled treatment and removes pointer events.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      required: true,
      description:
        "The label, plus an optional PrismIcon before or after it. Keep labels short and action-led.",
    },
    {
      name: "className",
      type: "string",
      description:
        "Placement only — flex/grid positioning, order, alignment. Do not use it to change height, padding, radius, colour or typography; those belong to the component's tokens.",
    },
  ],

  tokens: [
    "--c-button-pill-radius",
    "--c-button-font-size",
    "--c-button-font-weight",
    "--c-button-font-line-height",
    "--c-button-font-size-small",
    "--c-button-font-line-height-small",
    "--c-button-gap-small",
    "--c-button-gap-large",
    "--c-button-height-large",
    "--c-button-height-medium",
    "--c-button-height-small",
    "--c-button-padding-left-right-large",
    "--c-button-padding-left-right-medium",
    "--c-button-padding-left-right-small",
    "--c-button-padding-top-bottom-large",
    "--c-button-padding-top-bottom-medium",
    "--c-button-padding-top-bottom-small",
    "--c-button-primary-background-default",
    "--c-button-primary-background-click",
    "--c-button-primary-content-default",
    "--c-button-secondary-background-default",
    "--c-button-secondary-background-hover",
    "--c-button-secondary-background-click",
    "--c-button-secondary-border-default",
    "--c-button-secondary-border-hover",
    "--c-button-secondary-border-click",
    "--c-button-secondary-content-default",
    "--c-button-tertiary-background-default",
    "--c-button-tertiary-background-hover",
    "--c-button-tertiary-background-click",
    "--c-button-tertiary-content-default",
    "--c-button-destructive-background-default",
    "--c-button-destructive-background-click",
    "--c-button-destructive-content-default",
    "--c-button-disabled-background",
    "--c-button-disabled-border",
    "--c-button-disabled-content",
    "--e-shadow-focus",
    "--e-shadow-button-hover",
    "--c-button-bulk-action-background-default",
    "--c-button-bulk-action-background-hover",
    "--c-button-bulk-action-background-click",
    "--c-button-bulk-action-border-default",
    "--c-button-bulk-action-border-hover",
    "--c-button-bulk-action-border-click",
    "--c-button-bulk-action-border-disabled",
    "--c-button-bulk-action-content-default",
    "--c-button-primary-split-background-default",
    "--c-button-primary-split-background-click",
    "--c-button-primary-split-content-default",
    "--c-button-primary-split-content-hover",
    "--c-button-primary-split-content-click",
    "--c-button-primary-split-divider",
    "--c-button-gap-split",
    "--c-button-padding-icon",
  ],

  guidelines: {
    dos: [
      "Use one primary button per view, for the single most important action.",
      "Write labels as the action they perform — “Save changes”, “Delete record” — not “OK” or “Submit”.",
      "Pair a destructive button with a confirmation step.",
      "Use asChild with an <a> when the action navigates.",
      "Let the button own its spacing; put layout on a wrapper element instead.",
    ],
    donts: [
      "Don't override height, padding, radius, colour or typography through className — propose a variant instead.",
      "Don't stack multiple primary buttons on one surface; it removes the visual hierarchy.",
      "Don't disable a button without telling the user what would make it available.",
      "Don't build a bespoke button from a native <button> with utility classes — compose this component.",
      "Don't add an icon larger than 16px; it will not sit correctly against the label.",
    ],
  },
}
