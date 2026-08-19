import type { ComponentDoc } from "@/docs/types"

// Documents the real FilterChip API. It represents one active filter
// criterion and is always used inside a Filter Bar — never standalone (per
// the component's own Figma "When NOT to use" note). FilterBar itself is
// documented separately; this page covers the chip in isolation.
export const filterChipDoc: ComponentDoc = {
  slug: "filter-chip",
  name: "Filter Chip",
  status: "stable",
  description:
    "A pill representing one active filter criterion — the trigger that opens its Filter Dropdown Panel.",
  figmaNodeId: "4077:7991",
  sourcePath: "src/components/ui/filter-chip.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "With a `value` set, the chip renders Category label, operator icon, Value label, and a trailing chevron. It is composed inside a Filter Bar, alongside a FilterDropdownPanel that opens on click — see FilterDropdownPanel and FilterBar for the full composed pattern.",
      exampleId: "filter-chip/default",
    },
    {
      id: "no-value",
      title: "No value set",
      body:
        "Omit `value` to render the narrower variant used before a criterion has a value yet: Category label + chevron only, with a dashed border. This is the chip's initial state when a field is picked but not yet configured.",
      exampleId: "filter-chip/no-value",
    },
    {
      id: "operator-icon",
      title: "Operator icon",
      body:
        "`operatorIcon` defaults to \"equal\" and only renders once `value` is set. Pass any PrismIcon name that represents a comparison operator — the same operator set FilterDropdownPanel's number content type exposes as chips.",
      exampleId: "filter-chip/operator-icon",
    },
    {
      id: "open",
      title: "Open",
      body:
        "Set `open` to true while this chip's Filter Dropdown Panel is visible. It flips the chevron to point up and switches the chip to the brand-bordered open background — the caller (FilterBar) owns this state, keyed to which popover is currently open.",
      exampleId: "filter-chip/open",
    },
    {
      id: "disabled",
      title: "Disabled",
      body:
        "Disabled chips render with muted content and icon colours and stop responding to pointer or keyboard interaction. There is no dedicated pressed token yet in filter/chip/*, so `:active` falls back to the hover treatment rather than an unverified colour.",
      exampleId: "filter-chip/disabled",
    },
  ],

  props: [
    {
      name: "label",
      type: "string",
      required: true,
      description: "Category label — always visible, never empty.",
    },
    {
      name: "value",
      type: "string",
      description: "Selected value. Omit to render the narrower \"no value\" chip variant.",
    },
    {
      name: "operatorIcon",
      type: "PrismIconName",
      defaultValue: '"equal"',
      description: "Operator icon shown between label and value.",
    },
    {
      name: "open",
      type: "boolean",
      defaultValue: "false",
      description: "Whether this chip's Filter Dropdown Panel is open (chevron flips up).",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Disables the chip and applies the disabled colour treatment.",
    },
    {
      name: "onClick",
      type: "React.MouseEventHandler<HTMLButtonElement>",
      description: "Fired on click — typically toggles the paired Filter Dropdown Panel's open state.",
    },
  ],

  tokens: [
    "--c-filter-chip-background-default",
    "--c-filter-chip-background-disabled",
    "--c-filter-chip-background-hover",
    "--c-filter-chip-background-open",
    "--c-filter-chip-border-default",
    "--c-filter-chip-border-disabled",
    "--c-filter-chip-border-open",
    "--c-filter-chip-content-default",
    "--c-filter-chip-content-disabled",
    "--c-filter-chip-font-line-height",
    "--c-filter-chip-font-size",
    "--c-filter-chip-gap",
    "--c-filter-chip-icon-default",
    "--c-filter-chip-icon-disabled",
    "--c-filter-chip-padding-horizontal",
    "--c-filter-chip-radius",
    "--c-filterchip-height",
    "--e-shadow-focus",
  ],

  guidelines: {
    dos: [
      "Always use FilterChip inside a Filter Bar, paired with a FilterDropdownPanel it opens.",
      "Drive `open` from the same state that controls the paired panel's Popover — don't let them disagree.",
      "Leave `operatorIcon` at its \"equal\" default for text/picklist criteria; only override for numeric or date comparisons.",
      "Provide a real `value` string once the user has configured the criterion, not a placeholder.",
    ],
    donts: [
      "Don't render FilterChip standalone outside a Filter Bar — that is explicitly against the Figma component's own usage note.",
      "Don't invent a pressed/active colour for `:active` — there is no filter/chip pressed token yet; the hover token is the deliberate fallback.",
      "Don't pass `className` to change height, radius, border, or colours — those are owned by filter/chip/* tokens.",
    ],
  },
}
