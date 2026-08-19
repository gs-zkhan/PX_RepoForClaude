import type { ComponentDoc } from "@/docs/types"

export const thirdPaneDoc: ComponentDoc = {
  slug: "third-pane",
  name: "ThirdPane",
  status: "stable",
  description:
    "A right-anchored contextual panel that slides in and overlays page content. Built on @radix-ui/react-dialog — not the same as Modal.",
  figmaNodeId: "1273:20",
  sourcePath: "src/components/ui/third-pane.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "ThirdPane has no header frame, footer, border, or border-radius — Figma's own Dos/Don'ts explicitly forbid adding any of these. Title and close icon sit directly on the panel surface. It stretches to full viewport height (`inset-y-0`) rather than a fixed 900px, since that figure was this artboard's height, not a real constraint.",
      exampleId: "third-pane/default",
    },
    {
      id: "sizes",
      title: "Sizes",
      body:
        "Four sizes: small (336px), medium (584px, default — the minimum for form-heavy content since small is too narrow for label+input layouts), large (840px), xlarge (1064px).",
      exampleId: "third-pane/sizes",
    },
    {
      id: "with-back-navigation",
      title: "With back navigation",
      body:
        "`onBack` renders a leading back-arrow button for in-panel drill-down navigation and reduces the title row's left inset by 8px to make room for the arrow and its gap to the title.",
      exampleId: "third-pane/with-back-navigation",
    },
  ],

  props: [
    {
      name: "open",
      type: "boolean",
      required: true,
      description: "Controls whether the panel is open.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      required: true,
      description: "Called when the panel requests to open or close (close button, Escape, overlay click).",
    },
    {
      name: "size",
      type: '"small" | "medium" | "large" | "xlarge"',
      defaultValue: '"medium"',
      description: "Panel width. See Sizes.",
    },
    {
      name: "title",
      type: "string",
      required: true,
      description: "Panel title, shown on the surface with the close icon.",
    },
    {
      name: "onBack",
      type: "() => void",
      description: "When provided, renders a back-arrow button before the title for in-panel drill-down navigation.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      required: true,
      description: "Panel content, in a scrollable region padded with --p-space-300 vertical and a size-matched horizontal inset.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the dialog content element.",
    },
  ],

  tokens: [
    "--c-icon-color-default",
    "--e-shadow-400",
    "--p-space-200",
    "--p-space-300",
    "--s-color-surface-default",
    "--s-color-text-default",
    "--t-font-heading-medium-line-height",
    "--t-font-heading-medium-size",
    "--t-font-heading-medium-weight",
  ],

  guidelines: {
    dos: [
      "Use medium or larger for any form-heavy content; small is reserved for content that doesn't need label+input layouts.",
      "Use onBack for in-panel drill-down navigation rather than closing and reopening the panel.",
      "Let the panel's content region own its own vertical scrolling; don't add a second scroll container inside children.",
    ],
    donts: [
      "Don't add a header frame, footer, border, or border-radius to the panel — Figma explicitly forbids all four.",
      "Don't confuse ThirdPane with Modal; it is a right-anchored sliding overlay, not a centered dialog.",
      "Don't fix the panel to a 900px height; it intentionally stretches to the viewport.",
      "Don't use ThirdPane for the InlinePanel anatomy (4 unlabeled content slots, no title/close/shadow, sits inline) — that is a distinct, not-yet-built variant.",
    ],
  },
}
