import type { ComponentDoc } from "@/docs/types"

// No Figma node id in the component header — it's cross-checked against the
// prism-ds source repo's CanvasCard component, not a Figma node, so
// figmaNodeId is omitted rather than guessed.
export const canvasCardDoc: ComponentDoc = {
  slug: "canvas-card",
  name: "Canvas Card",
  status: "stable",
  description:
    "A page-level two-pane shell for editor-style patterns — a preview pane and a config pane side by side.",
  sourcePath: "src/components/ui/canvas-card.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "In \"split\" mode (default) both panes flex equally to fill the available width. CanvasCard is a shell only — it is not a general-purpose dashboard widget wrapper; that role belongs to whatever the caller composes inside each pane (e.g. multiple SummaryStat or Chart instances).",
      exampleId: "canvas-card/default",
    },
    {
      id: "fixed-left",
      title: "Fixed-left",
      body:
        "Set `mode=\"fixed-left\"` to pin the left pane at `fixedSize` pixels (default 440) while the right pane flexes to fill the rest. Use `mode=\"fixed-right\"` for the mirrored layout — a fixed-width right pane with a flexing left pane.",
      exampleId: "canvas-card/fixed-left",
    },
    {
      id: "resizable",
      title: "Resizable divider",
      body:
        "Set `resizable` to render a DragHandle between the panes. It resizes the left pane in \"split\"/\"fixed-left\" modes, or the right pane in \"fixed-right\" mode — always the pane that is naturally sized for that mode. `minSize`/`maxSize` bound the drag.",
      exampleId: "canvas-card/resizable",
    },
  ],

  props: [
    {
      name: "mode",
      type: '"split" | "fixed-left" | "fixed-right"',
      defaultValue: '"split"',
      description: "Pane sizing strategy. See Default and Fixed-left.",
    },
    {
      name: "left",
      type: "React.ReactNode",
      required: true,
      description: "Content for the left pane.",
    },
    {
      name: "right",
      type: "React.ReactNode",
      required: true,
      description: "Content for the right pane.",
    },
    {
      name: "fixedSize",
      type: "number",
      defaultValue: "440",
      description: "Width in px for the fixed pane. Ignored in \"split\" mode.",
    },
    {
      name: "resizable",
      type: "boolean",
      defaultValue: "false",
      description: "Show a draggable divider between panes. See Resizable divider.",
    },
    {
      name: "minSize",
      type: "number",
      defaultValue: "200",
      description: "Min width (px) of the resized pane.",
    },
    {
      name: "maxSize",
      type: "number",
      defaultValue: "800",
      description: "Max width (px) of the resized pane.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the outer shell.",
    },
  ],

  tokens: ["--e-shadow-100", "--p-radius-100", "--s-color-surface-default"],

  guidelines: {
    dos: [
      "Compose real content components (SummaryStat, Chart, forms) inside each pane rather than treating CanvasCard itself as a widget.",
      "Use fixed-left/fixed-right when one pane has a natural fixed width, like a config rail.",
      "Set minSize/maxSize on resizable instances so a drag can't collapse or blow out the layout.",
    ],
    donts: [
      "Don't use CanvasCard as a general dashboard grid — it is a two-pane editor shell only.",
      "Don't set a fixedSize and expect it honored in \"split\" mode; fixedSize only applies to fixed-left/fixed-right.",
      "Don't add your own divider styling; the resizable DragHandle already owns that visual.",
    ],
  },
}
