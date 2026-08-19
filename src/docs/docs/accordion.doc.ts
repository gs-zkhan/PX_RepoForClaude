import type { ComponentDoc } from "@/docs/types"

export const accordionDoc: ComponentDoc = {
  slug: "accordion",
  name: "Accordion",
  status: "stable",
  description:
    "A progressive-disclosure header row that expands to reveal content. Compose an Accordion group of AccordionItem rows.",
  figmaNodeId: "1273:6",
  sourcePath: "src/components/ui/accordion.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Accordion is a controlled-or-uncontrolled group: pass `value`/`onValueChange` to control which item is open, or `defaultValue` to let the component manage its own state. Only one item opens at a time. The content panel is conditionally rendered rather than hidden with `aria-hidden`, so screen readers never see stale closed content.",
      exampleId: "accordion/default",
    },
    {
      id: "sizes",
      title: "Sizes",
      body:
        "Three header row heights, set with `size` on the group: 48 for compact panels, 56 (default) for most surfaces, and 64 only for headers that carry a `subtitle`. Vertical padding is derived from the size token; horizontal padding is always space/200.",
      exampleId: "accordion/sizes",
    },
    {
      id: "types",
      title: "Types",
      body:
        "Three outer shells, set with `type` on the group. off-material (default) has a 1px border and radius/150 for standalone cards on the page surface. off-material-shadow drops the border for a shadow/400 floating card. on-material is a bottom hairline only, with no fill or radius — it requires a distinct, coloured parent surface to read correctly; don't use it directly on the page background.",
      exampleId: "accordion/types",
    },
    {
      id: "with-icon",
      title: "With icon and subtitle",
      body:
        "AccordionItem accepts an optional leading `icon` (a PrismIconName, rendered at 24px) and a `subtitle` shown beneath the title. Subtitle only reads correctly at the 64px size — pair the two.",
      exampleId: "accordion/with-icon",
    },
  ],

  props: [
    {
      name: "value",
      type: "string",
      description: "Currently open item value (controlled).",
    },
    {
      name: "defaultValue",
      type: "string",
      description: "Initially open item (uncontrolled).",
    },
    {
      name: "onValueChange",
      type: "(value: string | undefined) => void",
      description: "Called with the newly open item's value, or undefined when the open item is closed.",
    },
    {
      name: "size",
      type: "48 | 56 | 64",
      defaultValue: "56",
      description: "Header row height. See Sizes.",
    },
    {
      name: "type",
      type: '"off-material" | "off-material-shadow" | "on-material"',
      defaultValue: '"off-material"',
      description: "Outer shell treatment. See Types.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      required: true,
      description: "One or more AccordionItem elements.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the group's flex container.",
    },
    {
      name: "value (AccordionItem)",
      type: "string",
      required: true,
      description: "Unique identifier for this item within the group.",
    },
    {
      name: "title",
      type: "React.ReactNode",
      required: true,
      description: "Header label.",
    },
    {
      name: "subtitle",
      type: "React.ReactNode",
      description: "Optional second line under the title. Intended for the 64px size.",
    },
    {
      name: "icon",
      type: "PrismIconName",
      description: "Optional leading icon, rendered at 24px.",
    },
    {
      name: "children (AccordionItem)",
      type: "React.ReactNode",
      required: true,
      description: "Panel content, rendered only while the item is open.",
    },
    {
      name: "className (AccordionItem)",
      type: "string",
      description: "Placement only, applied to the item's outer shell.",
    },
  ],

  tokens: [
    "--c-accordion-background",
    "--c-accordion-background-hover",
    "--c-accordion-border",
    "--c-accordion-gap",
    "--c-accordion-label",
    "--c-accordion-padding-48",
    "--c-accordion-padding-56",
    "--c-accordion-padding-64",
    "--e-shadow-400",
    "--p-radius-150",
    "--p-space-200",
    "--s-color-text-default",
    "--s-color-text-subtle",
    "--s-icon-color-default",
    "--t-font-body-medium-line-height",
    "--t-font-body-medium-size",
    "--t-font-heading-xsmall-line-height",
    "--t-font-heading-xsmall-size",
    "--t-font-heading-xsmall-weight",
    "--t-font-label-small-line-height",
    "--t-font-label-small-size",
  ],

  guidelines: {
    dos: [
      "Use 64px size only when an item has a subtitle.",
      "Use on-material only on top of a distinct, coloured parent surface — never directly on the page background.",
      "Let the group manage open/closed state uncontrolled unless another part of the screen needs to react to it.",
      "Keep each item's title short enough to sit on one line at the header height.",
    ],
    donts: [
      "Don't apply on-material without a coloured parent — the hairline alone won't read as a boundary.",
      "Don't mix types within the same group; pick one shell for the whole group.",
      "Don't put a subtitle on a 48px or 56px item — there's no room for it.",
      "Don't override the header height or padding via className; use the `size` prop.",
    ],
  },
}
