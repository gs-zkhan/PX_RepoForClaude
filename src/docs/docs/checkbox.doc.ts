import type { ComponentDoc } from "@/docs/types"

// No Figma node id in the component file — omitted rather than guessed.
export const checkboxDoc: ComponentDoc = {
  slug: "checkbox",
  name: "Checkbox",
  status: "stable",
  description:
    "A binary or tri-state selection control, built on Radix's Checkbox primitive.",
  sourcePath: "src/components/ui/checkbox.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Checkbox is a thin, styled wrapper over Radix CheckboxPrimitive.Root — it forwards every Radix prop, including `checked` and `onCheckedChange`. Use it controlled, as shown, for anything beyond a static demo.",
      exampleId: "checkbox/default",
    },
    {
      id: "states",
      title: "Checked, unchecked, indeterminate",
      body:
        "`checked` accepts Radix's CheckedState: `true`, `false`, or `\"indeterminate\"`. Indeterminate swaps the tick icon for a dash and uses the same checked background/border tokens — it is a distinct visual state from checked, not just an alias for it.",
      exampleId: "checkbox/states",
    },
    {
      id: "disabled",
      title: "Disabled",
      body:
        "Set `disabled` to block interaction. It works combined with either checked value and swaps to the dedicated disabled background/border tokens regardless of checked state.",
      exampleId: "checkbox/disabled",
    },
  ],

  props: [
    {
      name: "...props",
      type: "React.ComponentProps<typeof CheckboxPrimitive.Root>",
      description: "All Radix Checkbox.Root props pass through, including checked, onCheckedChange, disabled, required, name, value.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, merged onto the root's own visual classes.",
    },
  ],

  tokens: [
    "--c-checkbox-background-checked",
    "--c-checkbox-background-default",
    "--c-checkbox-background-disabled",
    "--c-checkbox-background-hover",
    "--c-checkbox-border-default",
    "--c-checkbox-border-disabled",
    "--c-checkbox-border-hover",
    "--c-checkbox-border-width",
    "--c-checkbox-focus-ring-color",
    "--c-checkbox-focus-ring-width",
    "--c-checkbox-icon-checked",
    "--c-checkbox-icon-indeterminate",
    "--c-checkbox-radius",
    "--c-checkbox-size",
  ],

  guidelines: {
    dos: [
      "Use `checked=\"indeterminate\"` for a parent checkbox representing a partially-selected group of children.",
      "Pair Checkbox with a `<label>` wrapping both the control and its text so the whole row is clickable (see ColumnSelector's selection view).",
      "Drive `checked` from state rather than relying on Checkbox's own internal state, in any screen where another control needs to read the value.",
    ],
    donts: [
      "Don't use disabled+unchecked to mean \"not applicable\" without also communicating why elsewhere in the row.",
      "Don't resize the control via className; height/width come from --c-checkbox-size.",
      "Don't reach for a native <input type=\"checkbox\"> with utility classes when this component covers the need.",
    ],
  },
}
