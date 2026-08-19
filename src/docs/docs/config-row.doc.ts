import type { ComponentDoc } from "@/docs/types"

// No Figma node id in the component header — it's cross-checked against the
// prism-ds source repo's ConfigRow component, not a Figma node, so
// figmaNodeId is omitted rather than guessed.
export const configRowDoc: ComponentDoc = {
  slug: "config-row",
  name: "Config Row",
  status: "stable",
  description:
    "A 48px labeled row for editor config panes: an optional icon puck, a title/subtitle, a freeform trailing slot, and a chevron.",
  sourcePath: "src/components/ui/config-row.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "ConfigRow's anatomy is fixed: [icon puck] [title + subtitle] [trailing] [chevron]. The icon puck is a 28px, --s-color-surface-muted square that the component itself owns — pass any React node (typically a PrismIcon) as `icon`. When `onClick` is provided the row renders as a real <button> with hover and focus states; otherwise it's a static, non-interactive <div>.",
      exampleId: "config-row/default",
    },
    {
      id: "with-trailing",
      title: "With a trailing slot",
      body:
        "`trailing` is a freeform slot rendered just before the chevron — drop in a StatusLabel, a Chip, or plain text. ConfigRow does not style whatever you pass; the trailing component owns its own visual recipe.",
      exampleId: "config-row/with-trailing",
    },
    {
      id: "non-interactive",
      title: "Non-interactive / no chevron",
      body:
        "Omit `onClick` for a purely informational row. Set `hideChevron` when the row isn't navigable, so the chevron doesn't imply an action that doesn't exist.",
      exampleId: "config-row/non-interactive",
    },
    {
      id: "disabled",
      title: "Disabled",
      body:
        "Set `disabled` to mute the row and block its click handler. Disabled only changes opacity and cursor — the row's underlying color tokens are unchanged.",
      exampleId: "config-row/disabled",
    },
  ],

  props: [
    {
      name: "icon",
      type: "React.ReactNode",
      description: "Content for the 28px leading icon puck. Typically a PrismIcon.",
    },
    {
      name: "title",
      type: "React.ReactNode",
      required: true,
      description: "Primary label.",
    },
    {
      name: "subtitle",
      type: "React.ReactNode",
      description: "Secondary line under the title.",
    },
    {
      name: "trailing",
      type: "React.ReactNode",
      description: "Freeform slot before the chevron, e.g. a StatusLabel or Chip.",
    },
    {
      name: "onClick",
      type: "() => void",
      description: "When provided, the row renders as a <button> with hover/focus states. Omit for a static row.",
    },
    {
      name: "hideChevron",
      type: "boolean",
      defaultValue: "false",
      description: "Hide the trailing chevron, for rows that only display information.",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Mute the row and block onClick.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the row's root element.",
    },
  ],

  tokens: [
    "--e-shadow-focus",
    "--p-radius-075",
    "--p-space-100",
    "--p-space-150",
    "--s-color-line-bold",
    "--s-color-line-default",
    "--s-color-surface-default",
    "--s-color-surface-muted",
    "--s-color-text-default",
    "--s-color-text-subtle",
    "--s-icon-color-subtle",
    "--t-font-body-medium-line-height",
    "--t-font-body-medium-size",
    "--t-font-label-small-line-height",
    "--t-font-label-small-size",
  ],

  guidelines: {
    dos: [
      "Use hideChevron for rows that only display information and never navigate.",
      "Compose an approved component (StatusLabel, Chip) into `trailing` rather than hand-styled text.",
      "Rely on the icon puck's own background/radius rather than styling the icon node yourself.",
    ],
    donts: [
      "Don't add a chevron affordance to a row with no onClick — that's misleading.",
      "Don't override the row's border, radius or hover background via className.",
      "Don't reach for the raw --color-line-strong token here — Prism's own hover token isn't in this repo's catalog; --s-color-line-bold is the verified equivalent already in use.",
    ],
  },
}
