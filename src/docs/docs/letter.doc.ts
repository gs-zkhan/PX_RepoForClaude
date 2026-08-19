import type { ComponentDoc } from "@/docs/types"

// Documents the real Letter API and its CORRECTED purpose.
//
// Figma's own description on this node ("Single letter avatar used as a
// fallback… Used internally by Avatar — do not place standalone") is stale
// and wrong, confirmed by the design system owner on 2026-08-07, not assumed.
// The component's real, confirmed purpose is to label a filter criterion so
// it can be referenced by letter in advanced boolean logic, e.g.
// "(A and B) or (C and D)" — it is used standalone in FilterConfigModal, one
// per criterion row. This doc intentionally does NOT repeat the stale
// Avatar-fallback claim.
export const letterDoc: ComponentDoc = {
  slug: "letter",
  name: "Letter",
  status: "stable",
  description:
    "A 32x32 rounded-square tile labelling a filter criterion by letter, for reference in advanced boolean logic.",
  figmaNodeId: "4049:1598",
  sourcePath: "src/components/ui/letter.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Renders a single character centered in a 32x32 rounded square with a border. It labels a filter criterion row so that row can be referenced by letter in an advanced-logic expression, e.g. \"(A and B) or (C and D)\" in the Configure Filters modal — it is used standalone, one Letter per row, not as an Avatar fallback.",
      exampleId: "letter/default",
    },
    {
      id: "state",
      title: "State",
      body:
        "`state` is \"default\" | \"selected\" | \"borderless\". Figma's second variant is named \"Hover\", but it renders a brand border + selected fill — a selected/active look, not a pointer-hover style — so it is exposed here as `selected` to describe what it actually means. Real pointer-hover behaviour is left to the composing component.",
      exampleId: "letter/state",
    },
    {
      id: "sequence",
      title: "Sequence in FilterConfigModal",
      body:
        "FilterConfigModal derives each row's letter from its position (A, B, C… wrapping to AA, AB… past 26) so the sequence stays correct as rows are added or removed. Letter itself takes no index — the caller always computes and passes the character.",
      exampleId: "letter/sequence",
    },
  ],

  props: [
    {
      name: "letter",
      type: "string",
      required: true,
      description: "Single character. Longer strings are not truncated — pass one character.",
    },
    {
      name: "state",
      type: '"default" | "selected" | "borderless"',
      defaultValue: '"default"',
      description:
        '"selected" renders a brand border + selected fill (Figma\'s "Hover" variant, renamed here since it is a selected/active look, not pointer hover). "borderless" removes the border entirely.',
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the tile's outer span.",
    },
  ],

  tokens: [
    "--p-radius-100",
    "--s-color-line-brand",
    "--s-color-line-default",
    "--s-color-surface-default",
    "--s-color-surface-selected",
    "--s-color-text-subtle",
    "--t-font-heading-xsmall-line-height",
    "--t-font-heading-xsmall-size",
    "--t-font-heading-xsmall-weight",
  ],

  guidelines: {
    dos: [
      "Use Letter to label filter criterion rows for reference in advanced boolean logic — this is its real, confirmed purpose, standalone in FilterConfigModal.",
      "Derive the letter sequence from row position in the caller (A, B, C…, wrapping to AA past 26) rather than hardcoding letters.",
      "Use `state=\"selected\"` for a genuinely selected/active row, not for pointer hover — real hover styling belongs to the composing interactive element.",
    ],
    donts: [
      "Don't treat this as an Avatar fallback or route new avatar-initial work through it — that Figma description is stale and wrong; AvatarFallback in src/components/ui/avatar.tsx already exists and is circular/borderless, a different shape entirely.",
      "Don't pass more than one character — Letter does not truncate.",
      "Don't reach for a raw 8px radius value — --p-radius-100 already equals the literal Figma value, so use the token.",
    ],
  },
}
