import type { ComponentDoc } from "@/docs/types"

export const skeletonDoc: ComponentDoc = {
  slug: "skeleton",
  name: "Skeleton",
  status: "stable",
  description:
    "A structural placeholder shown while content is fetching, in the shape the real content will take.",
  figmaNodeId: "2683:24440",
  sourcePath: "src/components/ui/skeleton.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "With no props, Skeleton renders the Line variant: a 12px-tall pill-radius bar. Use Skeleton when the layout of the arriving content is known — for indeterminate or unknown-structure loading, use Spinner instead.",
      exampleId: "skeleton/default",
    },
    {
      id: "variants",
      title: "Variants",
      body:
        "Four variants, set with `variant`. Line suits text rows. Block suits paragraphs or images (80px tall by default). Avatar is a fixed 32×32 circle for profile pictures. Card suits content cards (80px minimum height). Width is always resizable — stretch each instance to match its real layout column.",
      exampleId: "skeleton/variants",
    },
    {
      id: "grouped",
      title: "Grouping instances",
      body:
        "A single Line skeleton alone is never sufficient. Always group multiple Skeleton instances to mirror the real content layout that will replace them, as in this avatar-plus-two-lines list row.",
      exampleId: "skeleton/grouped",
    },
  ],

  props: [
    {
      name: "variant",
      type: '"line" | "block" | "avatar" | "card"',
      defaultValue: '"line"',
      description: "Shape of the placeholder. See Variants.",
    },
    {
      name: "className",
      type: "string",
      description:
        "Placement and sizing only — e.g. width. Do not override the fill colour or radius; those come from the variant's own classes.",
    },
  ],

  tokens: ["--p-radius-050", "--p-radius-full", "--s-color-surface-muted"],

  guidelines: {
    dos: [
      "Use Skeleton when the layout of the arriving content is already known.",
      "Group multiple instances to mirror the real content layout — never use a single Line skeleton alone.",
      "Resize the width of each instance to match its real layout column.",
      "Use Avatar for profile pictures and Card for content cards, matching their real footprint.",
    ],
    donts: [
      "Don't use Skeleton for indeterminate or unknown-structure loading — use Spinner instead.",
      "Don't animate a shimmer effect on top of it; the design file specifies an unanimated filled shape (the pulse here is a CSS production concern, not a Figma-specified state).",
      "Don't override the fill colour via className; it always uses --s-color-surface-muted.",
      "Don't render a single Skeleton where several rows of real content will appear.",
    ],
  },
}
