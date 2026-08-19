import type { ComponentDoc } from "@/docs/types"

export const popoverDoc: ComponentDoc = {
  slug: "popover",
  name: "Popover",
  status: "stable",
  description:
    "A low-level Radix-backed floating panel shell — the shared surface several higher components build their content on top of.",
  sourcePath: "src/components/ui/popover.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Popover, PopoverTrigger and PopoverContent are thin wrappers around @radix-ui/react-popover. This wrapper's own contribution is the panel's visual recipe: radius, border, background and shadow. Content is entirely up to the caller.",
      exampleId: "popover/default",
    },
    {
      id: "alignment",
      title: "Alignment",
      body:
        "`align` (default \"start\") and `sideOffset` (default 4px) are the two props this wrapper sets defaults for; both, along with `side`, pass straight through to Radix's own positioning logic.",
      exampleId: "popover/alignment",
    },
    {
      id: "as-shell",
      title: "Used as a shared shell",
      body:
        "Most consumers should not reach for Popover directly. It's the shared shell behind DateFilter, PECDropdown, FilterBar's per-chip panels, and FilterDropdownPanel's own FilterDropdownPopover export — each renders its own content inside this same PopoverContent surface rather than a bespoke panel.",
      exampleId: "popover/as-shell",
    },
  ],

  props: [
    {
      name: "Popover props",
      type: "React.ComponentProps<typeof PopoverPrimitive.Root>",
      description:
        "Passed straight through to Radix's Popover.Root, including `open`, `onOpenChange`, `defaultOpen` and `modal`.",
    },
    {
      name: "PopoverTrigger props",
      type: "React.ComponentProps<typeof PopoverPrimitive.Trigger>",
      description: "Passed straight through to Radix's Popover.Trigger, including `asChild`.",
    },
    {
      name: "align",
      type: "React.ComponentProps<typeof PopoverPrimitive.Content>[\"align\"]",
      defaultValue: '"start"',
      description: "Alignment of the panel relative to the trigger, forwarded to Radix.",
    },
    {
      name: "sideOffset",
      type: "React.ComponentProps<typeof PopoverPrimitive.Content>[\"sideOffset\"]",
      defaultValue: "4",
      description: "Gap in pixels between the trigger and the panel, forwarded to Radix.",
    },
    {
      name: "PopoverContent (other props)",
      type: "React.ComponentProps<typeof PopoverPrimitive.Content>",
      description:
        "All other Radix Popover.Content props (`side`, `collisionPadding`, `onOpenAutoFocus`, etc.) pass straight through. `className` applies this wrapper's own panel recipe alongside any caller additions.",
    },
  ],

  tokens: [
    "--c-datepicker-panel-background",
    "--c-datepicker-panel-border",
    "--c-datepicker-panel-radius",
    "--e-shadow-300",
  ],

  guidelines: {
    dos: [
      "Prefer a higher-level component (DateFilter, PECDropdown, a FilterBar chip panel) when one already fits the use case.",
      "Let PopoverContent own radius, border, background and shadow — only add padding/layout classes for the content inside.",
      "Use PopoverTrigger asChild with a Button or other interactive component rather than a native trigger element.",
    ],
    donts: [
      "Don't restyle the panel's border, radius or shadow via className overrides — those come from --c-datepicker-panel-* and --e-shadow-300.",
      "Don't build a second bespoke floating-panel component when Popover already provides the shell.",
      "Don't skip PopoverPrimitive.Portal semantics by rendering PopoverContent outside of a Popover root.",
    ],
  },
}
