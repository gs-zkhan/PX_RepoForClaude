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
        "Three outer shells, set with `type` on the group. off-material (default) has a 1px border and radius/150 for standalone cards on the page surface. off-material-shadow drops the border for a shadow/400 floating card. on-material is a bottom hairline only, with no fill or radius — it has no background of its own and sits directly on whatever page/surface background it inherits; don't wrap it in an extra card/container to \"give it a surface\" (design-owner correction, 2026-08-27).",
      exampleId: "accordion/types",
    },
    {
      id: "with-icon",
      title: "With icon and subtitle",
      body:
        "AccordionItem accepts an optional leading `icon` (a PrismIconName, rendered at 24px), a `leading` node for arbitrary leading visuals such as numbered badges (takes precedence over `icon` if both are set), and a `subtitle` shown beneath the title. Subtitle only reads correctly at the 64px size — pair the two. When an item has a subtitle and is expanded, the panel gets exactly 24px of top padding above its content (space/300).",
      exampleId: "accordion/with-icon",
    },
    {
      id: "hover-and-expanded-state",
      title: "Hover and expanded state",
      body:
        "Collapsed rows show a full-width hover background. Once a row is expanded, that full-width hover is replaced with a smaller hover highlight confined to the chevron only — the header row is still the single click/keyboard toggle target throughout; only the visual hover feedback changes scope (design-owner correction, 2026-08-27).",
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
      name: "leading",
      type: "React.ReactNode",
      description: "Optional arbitrary leading visual (e.g. a numbered <Letter>), rendered as-is instead of `icon` when present. Takes precedence over `icon` if both are set.",
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
    "--p-radius-full",
    "--p-space-050",
    "--p-space-200",
    "--p-space-300",
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
      "Let on-material sit directly on the page's normal background — no extra wrapper card needed.",
      "Let the group manage open/closed state uncontrolled unless another part of the screen needs to react to it.",
      "Keep each item's title short enough to sit on one line at the header height.",
    ],
    donts: [
      "Don't wrap on-material in an extra card/container to give it a background — it has none of its own by design.",
      "Don't mix types within the same group; pick one shell for the whole group.",
      "Don't put a subtitle on a 48px or 56px item — there's no room for it.",
      "Don't override the header height or padding via className; use the `size` prop.",
    ],
  },
}
