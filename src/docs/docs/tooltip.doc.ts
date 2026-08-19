import type { ComponentDoc } from "@/docs/types"

// Documents the REAL Tooltip API in this repo, a thin wrapper over
// @radix-ui/react-tooltip. Root/Trigger are re-exported as-is; only Content
// carries this repo's own styling.
export const tooltipDoc: ComponentDoc = {
  slug: "tooltip",
  name: "Tooltip",
  status: "stable",
  description: "A short label that appears on hover or focus to explain a control that has no visible text of its own.",
  sourcePath: "src/components/ui/tooltip.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Compose Tooltip, TooltipTrigger (with asChild) and TooltipContent. A single TooltipProvider must wrap the tree — this repo mounts it once at the app root (see src/App.tsx and src/patterns/px-list-shell/PxListShell.tsx), so individual Tooltip instances do not need their own provider.",
      exampleId: "tooltip/default",
    },
    {
      id: "sides",
      title: "Side placement",
      body:
        "`side` and `sideOffset` are Radix Content props forwarded straight through; `sideOffset` defaults to 4. Radix flips the side automatically when the preferred side would overflow the viewport.",
      exampleId: "tooltip/sides",
    },
    {
      id: "icon-trigger",
      title: "With an icon-only trigger",
      body:
        "Tooltip is the standard companion for an icon-only control such as IconButton, since those controls carry an aria-label but no visible text. Keep the tooltip text short — it is not a place for paragraphs of help copy.",
      exampleId: "tooltip/icon-trigger",
    },
  ],

  props: [
    {
      name: "side",
      type: '"top" | "right" | "bottom" | "left"',
      description: "Preferred placement relative to the trigger, forwarded to Radix's Content. Flips automatically to stay on screen.",
    },
    {
      name: "sideOffset",
      type: "number",
      defaultValue: "4",
      description: "Distance in pixels between the trigger and the tooltip.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      required: true,
      description: "The tooltip's text content, rendered inside TooltipContent. Keep it to a short phrase.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only on TooltipContent. Do not use it to change background, radius or typography — there is no shadow on this component, by design.",
    },
  ],

  tokens: [
    "--c-tooltip-font-line-height",
    "--c-tooltip-font-size",
    "--c-tooltip-font-weight",
    "--c-tooltip-radius",
    "--s-color-surface-inverse",
    "--s-color-text-inverse",
  ],

  guidelines: {
    dos: [
      "Ensure a TooltipProvider is present somewhere up the tree — it is required, not optional.",
      "Use `asChild` on TooltipTrigger so the trigger element itself (Button, IconButton, etc.) receives the hover/focus handlers, rather than wrapping it in an extra span.",
      "Reach for Tooltip whenever a trigger has no visible label, such as an icon-only IconButton.",
      "Keep tooltip copy to a short phrase — one line, not a paragraph.",
    ],
    donts: [
      "Don't add a drop shadow to TooltipContent — Figma's own audit confirms tooltips have no shadow.",
      "Don't mount a second TooltipProvider per tooltip; one at the app root is sufficient and correct.",
      "Don't use Tooltip as a substitute for visible label text a user actually needs to read at a glance.",
    ],
  },
}
