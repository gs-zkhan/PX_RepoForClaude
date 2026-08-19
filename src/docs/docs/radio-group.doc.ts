import type { ComponentDoc } from "@/docs/types"

export const radioGroupDoc: ComponentDoc = {
  slug: "radio-group",
  name: "Radio Group",
  status: "stable",
  description:
    "A Radix-backed set of mutually exclusive radio controls; RadioGroupItem renders only the control, not its label text.",
  sourcePath: "src/components/ui/radio-group.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "RadioGroup lays its items out as a vertical grid with an 8px gap by default. RadioGroupItem is a bare Radix control with no built-in text slot — this repo has no approved Label component yet, so option text is a native <label> wired via htmlFor/id until one exists.",
      exampleId: "radio-group/default",
    },
    {
      id: "disabled",
      title: "Disabled",
      body:
        "Set `disabled` on the RadioGroup root to disable every item at once, or on an individual RadioGroupItem to disable just that option. Disabled items get a distinct border, background and indicator color from their own tokens.",
      exampleId: "radio-group/disabled",
    },
    {
      id: "horizontal",
      title: "Horizontal layout",
      body:
        "className on the root is layout-only here — direction and gap are composition-level properties, not part of an item's visual recipe — so switching to a horizontal row via className is within the allowed pattern-ownership boundary.",
      exampleId: "radio-group/horizontal",
    },
  ],

  props: [
    {
      name: "RadioGroup props",
      type: "React.ComponentProps<typeof RadioGroupPrimitive.Root>",
      description:
        "Passed straight through to Radix's RadioGroup.Root, including `value`/`defaultValue`, `onValueChange`, `disabled`, `name` and `orientation`. `className` (default grid layout, gap-2) is the only prop this wrapper touches directly.",
    },
    {
      name: "RadioGroupItem props",
      type: "React.ComponentProps<typeof RadioGroupPrimitive.Item>",
      description:
        "Passed straight through to Radix's RadioGroup.Item, including `value`, `disabled` and `id`. `className` is the only prop this wrapper touches directly, to apply the component's visual recipe.",
    },
  ],

  tokens: [
    "--c-radio-background-disabled",
    "--c-radio-border-default",
    "--c-radio-border-disabled",
    "--c-radio-border-hover",
    "--c-radio-focus-ring-color",
    "--c-radio-focus-ring-width",
    "--c-radio-indicator-disabled",
    "--c-radio-indicator-selected",
    "--c-radio-size",
  ],

  guidelines: {
    dos: [
      "Wire each item's option text with htmlFor/id until an approved Label component exists.",
      "Use `disabled` on the root when the whole group is unavailable, and on an item when only that option is unavailable.",
      "Use className on the root only for direction/spacing between items, never to restyle an individual item.",
      "Give the group a `defaultValue` or controlled `value` — Radix radio groups have no implicit selection.",
    ],
    donts: [
      "Don't build option text with a styled <span> mimicking a label's typography — that duplicates a future Label component's job.",
      "Don't pass visual className to RadioGroupItem — its border, size and indicator all come from --c-radio-* tokens.",
      "Don't use RadioGroup for a single boolean choice — use Checkbox instead.",
      "Don't nest RadioGroupItem outside of a RadioGroup root; Radix's roving focus depends on the root context.",
    ],
  },
}
