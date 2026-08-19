import type { ComponentDoc } from "@/docs/types"

// Documents the REAL EmptyState API. Only the layout/typography/button
// anatomy is built from verified Figma metadata — the illustration itself
// is a caller-supplied slot. Figma specs 17 illustration types x 5 sizes,
// but this repo's asset library only has icon sets extracted so far; only
// "No Data Found" (src/assets/illustrations/no-data-found.svg, at the
// Medium/80px reference size) has been pulled in. The other 16 types are
// intentionally deferred, not silently faked.
export const emptyStateDoc: ComponentDoc = {
  slug: "empty-state",
  name: "Empty State",
  status: "stable",
  description: "A centred illustration, title, description and up to two actions for a table, panel or page with no content.",
  figmaNodeId: "3323:14896",
  sourcePath: "src/components/ui/empty-state.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Pass any illustration through the `illustration` slot — this repo currently only has \"No Data Found\" extracted, imported with `?raw` and injected via `dangerouslySetInnerHTML` since there is no illustration-loading component analogous to PrismIcon yet. `title` and `description` are required; `primaryAction`/`secondaryAction` are both optional.",
      exampleId: "empty-state/default",
    },
    {
      id: "sizes",
      title: "Sizes",
      body:
        "Four sizes control both the illustration box (64/80/120/144px) and the CTA button's `size` (small/medium/large/large) — verified 1:1 against Button's own height tokens for each Figma instance. Title and body typography scale per size too; they are not uniform across sizes.",
      exampleId: "empty-state/sizes",
    },
    {
      id: "landscape",
      title: "Landscape orientation",
      body:
        "\"landscape\" places the illustration to the left of a left-aligned text column instead of centering everything in a vertical stack. \"portrait\" (default) centers everything.",
      exampleId: "empty-state/landscape",
    },
    {
      id: "no-illustration",
      title: "Without an illustration",
      body: "`illustration` is optional — omit it for a text-only empty state rather than passing an empty box.",
      exampleId: "empty-state/no-illustration",
    },
  ],

  props: [
    {
      name: "size",
      type: '"small" | "medium" | "large" | "xlarge"',
      defaultValue: '"medium"',
      description: "Controls the illustration box size and the CTA Button's size.",
    },
    {
      name: "orientation",
      type: '"portrait" | "landscape"',
      defaultValue: '"portrait"',
      description: "Portrait centers everything in a vertical stack; landscape places the illustration left of a left-aligned text column.",
    },
    {
      name: "illustration",
      type: "React.ReactNode",
      description: "Caller-supplied illustration content, rendered in a fixed-size box matching the chosen `size`. Only \"No Data Found\" has been extracted from Figma's 17-type spec so far.",
    },
    {
      name: "title",
      type: "string",
      required: true,
      description: "The empty state's heading.",
    },
    {
      name: "description",
      type: "string",
      required: true,
      description: "Body copy explaining the empty state.",
    },
    {
      name: "primaryAction",
      type: "EmptyStateAction",
      description: "Renders a primary Button after secondaryAction. `EmptyStateAction = { label: string; onClick: () => void }`.",
    },
    {
      name: "secondaryAction",
      type: "EmptyStateAction",
      description: "Renders a secondary Button before primaryAction. `EmptyStateAction = { label: string; onClick: () => void }`.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the outer wrapper.",
    },
  ],

  tokens: [
    "--p-space-200",
    "--p-space-300",
    "--s-color-text-default",
    "--s-color-text-subtlest",
    "--t-font-body-medium-line-height",
    "--t-font-body-medium-size",
    "--t-font-heading-medium-line-height",
    "--t-font-heading-medium-size",
    "--t-font-heading-medium-weight",
    "--t-font-heading-small-line-height",
    "--t-font-heading-small-size",
    "--t-font-heading-small-weight",
    "--t-font-heading-xsmall-line-height",
    "--t-font-heading-xsmall-size",
    "--t-font-heading-xsmall-weight",
    "--t-font-label-small-line-height",
    "--t-font-label-small-size",
  ],

  guidelines: {
    dos: [
      "An Empty State's primary action must render identically to the validated Button instance elsewhere in the app — same height, padding, radius and typography, all coming from `size` mapping to Button's own `size` prop.",
      "Use `secondaryAction` for a lower-emphasis companion action like \"Learn more\", alongside or instead of `primaryAction`.",
      "Ask before using any illustration other than \"No Data Found\" — the other 16 Figma illustration types have not been extracted into this repo yet.",
    ],
    donts: [
      "Don't assume all 17 Figma illustration types exist as importable assets — only \"No Data Found\" does today.",
      "Don't hardcode the same title/body font size across all four `size` values — Figma's per-size typography (verified via get_variable_defs) differs and is already baked into the component.",
      "Don't style the primary/secondary action buttons with className inside a pattern using EmptyState — their visual recipe belongs to Button.",
    ],
  },
}
