import type { ComponentDoc } from "@/docs/types"

// STATUS: Visual Review: Approved. Approved for AI use: Yes. Approval date:
// 2026-08-29. Design-owner visually verified this component as part of a
// 4-item review batch (Link, Divider, Button Bulk Action, Button
// Primary-Split). See ai/figma-coverage.json (id component-link:
// status Approved, designOwnerApproval.approved: true) and
// src/components/ui/link.tsx for the full evidence trail.
export const linkDoc: ComponentDoc = {
  slug: "link",
  name: "Link",
  status: "stable",
  description:
    "APPROVED. A single inline navigation element — never an action substitute. Renders as a real <a>, with optional trailing icon and external-link indicator.",
  figmaNodeId: "20:15",
  sourcePath: "src/components/ui/link.tsx",

  sections: [
    {
      id: "status",
      title: "Review status (read first)",
      body:
        "Visual Review: Approved. Approved for AI use: Yes. Approval date: 2026-08-29. Implemented against Figma page 20:15 (defining symbol frame 4023:1437, 32 variants) and its AI Instructions (9139:6328) / Dos and Don'ts (9139:6381), then visually verified by the design owner: Default and Small sizes, Default/Hover/Visited/Disabled states, the optional right icon and external-link treatment, and real anchor semantics.",
    },
    {
      id: "default",
      title: "Sizes",
      body:
        "Two sizes: `size=\"default\"` (14px/24px line-height, the default) for body copy, table cells, and form help text; `size=\"small\"` (12px/16px) for dense contexts — metadata rows, captions, compact list cells.",
      exampleId: "link/sizes",
    },
    {
      id: "states",
      title: "States",
      body:
        "Default: text colour only, no underline. Hover: colour changes AND underline is applied together. Visited: browser-managed via the native CSS :visited pseudo-class — there is no prop to fake it; Figma explicitly warns against manually setting visited colour. Disabled: an explicit `disabled` prop (not CSS-only) that strips the href, sets aria-disabled and tabIndex=-1, and applies the disabled colour token — always pair with a visible explanation.",
      exampleId: "link/states",
    },
    {
      id: "icon-external",
      title: "Icon and external indicator",
      body:
        "`icon` appends icons/24/link after the label (0px gap) — intended for `size=\"default\"` only per Figma's Dos/Don'ts, since the icon is disproportionate at Small. `external` appends icons/16/arrow-right rotated 180° and applies target=\"_blank\" rel=\"noopener noreferrer\". These are independent: either, both, or neither may be set. RESOLVED BY DESIGN-OWNER APPROVAL (2026-08-29): the external-indicator asset (a rotated straight arrow, visually a left-pointing arrow rather than a conventional up-right \"opens externally\" glyph) was reviewed and approved as implemented — no substitute icon needed.",
      exampleId: "link/icon-external",
    },
    {
      id: "semantic-decision",
      title: "Navigation only — never an action substitute",
      body:
        "Figma's AI Instructions are explicit: never use Link to submit a form, delete a record, or open a modal (use Button); never as a standalone block-level CTA (use Button Tertiary); never as the primary action in a Modal footer. This component always renders a real <a> — never a <span>/<div> with onClick — so it cannot be used as a button substitute by construction.",
    },
  ],

  props: [
    {
      name: "size",
      type: '"default" | "small"',
      defaultValue: '"default"',
      description: "14px/24px vs 12px/16px. See Sizes.",
    },
    {
      name: "icon",
      type: "boolean",
      defaultValue: "false",
      description: "Appends icons/24/link after the label. Default size only, per Figma's Dos/Don'ts.",
    },
    {
      name: "external",
      type: "boolean",
      defaultValue: "false",
      description:
        "Appends a rotated icons/16/arrow-right and sets target=\"_blank\" rel=\"noopener noreferrer\". Caller must supply an aria-label communicating the new-tab behaviour — this component does not inject one.",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description:
        "Explicit disabled state — strips href, sets aria-disabled + tabIndex=-1, applies the disabled colour token. Always pair with a visible explanation.",
    },
    {
      name: "href",
      type: "string",
      description: "Standard anchor href. Omitted automatically when `disabled` is true.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      required: true,
      description:
        "Link text. Must describe the destination (\"View invoice\") — never \"click here\" or \"read more\" alone.",
    },
  ],

  tokens: [
    "--c-link-color-default",
    "--c-link-color-hover",
    "--c-link-color-visited",
    "--c-link-color-disabled",
    "--s-icon-color-default",
    "--p-font-size-medium",
    "--p-font-line-height-medium",
    "--p-font-size-small",
    "--p-font-line-height-small",
    "--p-font-weight-regular",
    "--p-space-050",
    "--e-shadow-focus",
  ],

  guidelines: {
    dos: [
      "Use Link for inline navigation within body copy, table cells, or help text.",
      "Set `external` whenever the link opens in a new tab or a third-party domain.",
      "Use `size=\"small\"` in dense or compact contexts.",
      "Provide meaningful link text describing the destination.",
    ],
    donts: [
      "Don't use Link to trigger actions (submit, delete, open a modal) — use Button.",
      "Don't use Link as a standalone block-level CTA — use Button (Tertiary).",
      "Don't set `icon` on `size=\"small\"` links — disproportionate per Figma.",
      "Don't manually fake the Visited state — it is browser-managed.",
      "Don't disable a link without a visible explanation.",
    ],
  },
}
