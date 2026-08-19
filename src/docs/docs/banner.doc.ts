import type { ComponentDoc } from "@/docs/types"

export const bannerDoc: ComponentDoc = {
  slug: "banner",
  name: "Banner",
  status: "stable",
  description:
    "Persistent, page- or section-level feedback that stays until dismissed or resolved — unlike Toast, it never auto-dismisses.",
  figmaNodeId: "1273:9",
  sourcePath: "src/components/ui/banner.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "With no size, Banner renders Small: a single-line message with the information variant. \"Page Level\" vs. \"Section Level\" from Figma is a placement decision, not a visual one — Banner owns no width or placement opinion, so callers place a full-width instance below the page header, or a narrower one inside a card.",
      exampleId: "banner/default",
    },
    {
      id: "variants",
      title: "Variants",
      body:
        "Four variants, set with `variant`: success, warning, danger and information (default). Each binds its own background, border and shadow tokens, and a matching filled status icon. Danger uses `role=\"alert\"` with assertive live-region announcement; the others use `role=\"status\"` with polite announcement.",
      exampleId: "banner/variants",
    },
    {
      id: "large",
      title: "Large",
      body:
        "Set `size=\"large\"` to add a `title` and optional `description` — use it only when a single sentence isn't enough to convey the message. Large's action button and dismiss control align to the top, next to the title, rather than the vertically centered placement used at Small.",
      exampleId: "banner/large",
    },
    {
      id: "with-action",
      title: "With an action",
      body:
        "Pass `action` with a `label` and `onClick` to render a secondary, small Button at the trailing edge. Common uses are Undo, Retry and Review changes.",
      exampleId: "banner/with-action",
    },
    {
      id: "dismissible",
      title: "Dismissible",
      body:
        "Pass `onDismiss` to render a trailing IconButton that closes the banner. Banner itself is stateless about dismissal — the caller owns whether the banner remains mounted.",
      exampleId: "banner/dismissible",
    },
  ],

  props: [
    {
      name: "variant",
      type: '"success" | "warning" | "danger" | "information"',
      defaultValue: '"information"',
      description: "Visual emphasis and icon. See Variants.",
    },
    {
      name: "size",
      type: '"small" | "large"',
      defaultValue: '"small"',
      description: "Small takes a single `message` string. Large takes `title` and optional `description` instead.",
    },
    {
      name: "message",
      type: "string",
      required: true,
      description: "Single-line message. Required when size is \"small\" (the default).",
    },
    {
      name: "title",
      type: "string",
      required: true,
      description: "Heading text. Required when size is \"large\".",
    },
    {
      name: "description",
      type: "string",
      description: "Optional supporting line, only rendered at size \"large\".",
    },
    {
      name: "onDismiss",
      type: "() => void",
      description: "Renders a trailing dismiss IconButton when provided.",
    },
    {
      name: "action",
      type: "{ label: string; onClick: () => void }",
      description: "Right-aligned secondary Button, e.g. Undo, Retry, Review changes.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the banner's outer container.",
    },
  ],

  tokens: [
    "--c-banner-content-body",
    "--c-banner-content-title",
    "--c-banner-danger-background",
    "--c-banner-danger-border",
    "--c-banner-information-background",
    "--c-banner-information-border",
    "--c-banner-padding",
    "--c-banner-radius",
    "--c-banner-success-background",
    "--c-banner-success-border",
    "--c-banner-warning-background",
    "--c-banner-warning-border",
    "--e-shadow-blue-100",
    "--e-shadow-green-100",
    "--e-shadow-red-100",
    "--e-shadow-yellow-100",
    "--p-space-100",
    "--p-space-200",
    "--t-banner-font-line-height",
    "--t-banner-font-size",
    "--t-font-heading-small-line-height",
    "--t-font-heading-small-size",
    "--t-font-heading-small-weight",
  ],

  guidelines: {
    dos: [
      "Reach for Large only when a single sentence isn't enough for the message.",
      "Use danger for conditions that need immediate attention; it announces assertively.",
      "Pair action with a verb label — Retry, Undo, Review changes — not \"OK\".",
      "Place page-level banners directly below the page header; section-level inside the relevant card or panel.",
    ],
    donts: [
      "Don't stack more than 2 banners simultaneously — it's Figma's own rule and the caller's responsibility to enforce.",
      "Don't use Large just for visual weight when Small's one-liner would do.",
      "Don't compose a custom icon into Banner; it already binds the correct filled status icon per variant.",
      "Don't rely on Banner to auto-dismiss — that's Toast's job, not this component's.",
    ],
  },
}
