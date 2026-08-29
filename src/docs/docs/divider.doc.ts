import type { ComponentDoc } from "@/docs/types"

// STATUS: Visual Review: Approved. Approved for AI use: Yes. Approval date:
// 2026-08-29. Design-owner visually verified this component as part of a
// 4-item review batch (Link, Divider, Button Bulk Action, Button
// Primary-Split). See ai/figma-coverage.json (id component-divider:
// status Approved, designOwnerApproval.approved: true) and
// src/components/ui/divider.tsx for the full evidence trail.
export const dividerDoc: ComponentDoc = {
  slug: "divider",
  name: "Divider",
  status: "stable",
  description:
    "APPROVED. A structural boundary between distinct content groups — solid only, two orientations, two weights.",
  figmaNodeId: "20:18",
  sourcePath: "src/components/ui/divider.tsx",

  sections: [
    {
      id: "status",
      title: "Review status (read first)",
      body:
        "Visual Review: Approved. Approved for AI use: Yes. Approval date: 2026-08-29. Implemented against Figma page 20:18 (defining symbol frame 848:18, 4 variants) and its AI Instructions (9139:6494) / Dos and Don'ts (9139:6537), then visually verified by the design owner: Horizontal and Vertical orientations, 1px and 2px weights, and the solid-only rule.",
    },
    {
      id: "orientation",
      title: "Orientation",
      body:
        "Horizontal (default) renders as a real <hr> — full width of its container, height = weight. Vertical renders as a decorative <div role=\"separator\" aria-orientation=\"vertical\"> — full height of its container, width = weight. There is no native HTML element for a vertical separator, so this matches Figma's own accessibility spec exactly rather than substituting a workaround.",
      exampleId: "divider/orientation",
    },
    {
      id: "weight",
      title: "Weight",
      body:
        "1px (default) for most contexts — list rows, panel edges, section separators. 2px for stronger structural breaks — major section headers, side-panel rails. Both weights use the same colour token; only stroke-width changes.",
      exampleId: "divider/weight",
    },
    {
      id: "solid-only",
      title: "Solid only",
      body:
        "PX DS V2 explicitly excludes Dashed and Dotted styles — this component has no `style` prop for them. Do not introduce dashed/dotted variants without new Figma evidence.",
    },
  ],

  props: [
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      defaultValue: '"horizontal"',
      description: "Horizontal renders <hr>; vertical renders a decorative separator <div>.",
    },
    {
      name: "weight",
      type: "1 | 2",
      defaultValue: "1",
      description: "Stroke width in px. 1 for most contexts, 2 for stronger structural breaks.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only — e.g. sizing the container the divider stretches within.",
    },
  ],

  tokens: [
    "--s-color-line-default",
    "--p-border-width-100",
    "--p-border-width-200",
  ],

  guidelines: {
    dos: [
      "Use 1px for list rows and panel content separators.",
      "Use 2px for major section breaks.",
      "Use a vertical Divider between toolbar action groups.",
    ],
    donts: [
      "Don't use a Divider to replace spacing — if the only reason is to add a gap, use spacing tokens instead.",
      "Don't use Dashed or Dotted styles — not supported in PX DS V2.",
      "Don't stack dividers consecutively.",
      "Don't use inside a component that already has a built-in border/background separation (Cards, Modals with headers).",
    ],
  },
}
