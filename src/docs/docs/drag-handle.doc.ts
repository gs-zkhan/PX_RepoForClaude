import type { ComponentDoc } from "@/docs/types"

// Documents the REAL DragHandle API. Verified against prism-ds's DragHandle
// anatomy (a 1px separator + 24x2 pill grip); this repo has no matching
// Figma node in Prism V1 - ShadCN, so figmaNodeId is intentionally omitted.
export const dragHandleDoc: ComponentDoc = {
  slug: "drag-handle",
  name: "Drag Handle",
  status: "stable",
  description: "A 1px draggable separator with a pill grip that resizes a target sibling along one axis.",
  sourcePath: "src/components/ui/drag-handle.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "With no `targetRef`, DragHandle resizes its own previousElementSibling — the natural pairing when it sits directly after the panel it resizes in a flex container. Default orientation is vertical, sitting between two columns and resizing width.",
      exampleId: "drag-handle/default",
    },
    {
      id: "horizontal",
      title: "Horizontal",
      body: "`orientation=\"horizontal\"` sits between two rows and resizes height instead of width.",
      exampleId: "drag-handle/horizontal",
    },
    {
      id: "min-max-size",
      title: "Min and max size",
      body: "`minSize` and `maxSize` clamp the resized panel along the drag axis, in pixels. Defaults are 200 and 800.",
      exampleId: "drag-handle/min-max-size",
    },
  ],

  props: [
    {
      name: "orientation",
      type: '"vertical" | "horizontal"',
      defaultValue: '"vertical"',
      description: "Axis of the handle. Vertical resizes width between two columns; horizontal resizes height between two rows.",
    },
    {
      name: "targetRef",
      type: "React.RefObject<HTMLElement | null>",
      description: "Element to resize. If omitted, the handle uses its own previousElementSibling.",
    },
    {
      name: "minSize",
      type: "number",
      defaultValue: "200",
      description: "Minimum size (px) of the target along the drag axis.",
    },
    {
      name: "maxSize",
      type: "number",
      defaultValue: "800",
      description: "Maximum size (px) of the target along the drag axis.",
    },
    {
      name: "ariaLabel",
      type: "string",
      defaultValue: '"Resize panels"',
      description: "Accessible label for the separator role.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the handle element.",
    },
  ],

  tokens: [
    "--p-radius-full",
    "--s-color-line-bold",
    "--s-color-line-default",
  ],

  guidelines: {
    dos: [
      "Place DragHandle directly after the panel it resizes in a flex container so the default previousElementSibling behaviour works without `targetRef`.",
      "Pass `ariaLabel` describing what the handle resizes when there's more than one on a screen.",
      "Set `minSize`/`maxSize` to keep both sides of a split usable.",
    ],
    donts: [
      "Don't build a bespoke resizer with raw pointer events and utility classes — compose this component.",
      "Don't rely on `--color-line-strong` directly; it's the prism-ds source name — this repo's verified equivalent is `--s-color-line-bold` (same #3C4A57 value).",
      "Don't nest DragHandle inside the element it resizes; it expects to act on a sibling, not an ancestor.",
    ],
  },
}
