import type { ComponentDoc } from "@/docs/types"

// Documents the real InputNumber API: a fixed 88x32 numeric input with
// stacked up/down chevron steppers.
export const inputNumberDoc: ComponentDoc = {
  slug: "input-number",
  name: "Input Number",
  status: "stable",
  description: "A fixed-size numeric input with stacked increment/decrement steppers.",
  figmaNodeId: "1047:6",
  sourcePath: "src/components/ui/input-number.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Three zones inside a single rounded frame (radius/050): a 60px value zone, a 1px vertical divider, and a 26px stepper zone. Chevrons render at 12x12 inside 26x15 button zones, from a 16px source rendered with sourceSize. `min`, `max`, and `value` are always required — this component never assumes a range.",
      exampleId: "input-number/default",
    },
    {
      id: "step",
      title: "Step",
      body:
        "`step` controls how much each stepper click adds or subtracts. Bounds and step are always caller-owned — always pass min/max/step rather than relying on a default.",
      exampleId: "input-number/step",
    },
    {
      id: "bounds",
      title: "Clamping at bounds",
      body:
        "The value clamps to [min, max] on stepper click and on blur — never on every keystroke, so typing an intermediate invalid value (e.g. \"1\" on the way to \"10\") stays possible while typing. At a bound, the corresponding stepper button disables itself.",
      exampleId: "input-number/bounds",
    },
    {
      id: "disabled",
      title: "Disabled",
      body:
        "Disabling greys out the value text and both stepper buttons and blocks all interaction.",
      exampleId: "input-number/disabled",
    },
  ],

  props: [
    {
      name: "value",
      type: "number",
      required: true,
      description: "The current numeric value.",
    },
    {
      name: "onValueChange",
      type: "(value: number) => void",
      required: true,
      description: "Fired with the clamped value after a stepper click, Enter, or blur commit.",
    },
    {
      name: "min",
      type: "number",
      required: true,
      description: "Lower bound. Always caller-owned — there is no default.",
    },
    {
      name: "max",
      type: "number",
      required: true,
      description: "Upper bound. Always caller-owned — there is no default.",
    },
    {
      name: "step",
      type: "number",
      defaultValue: "1",
      description: "Amount added or subtracted per stepper click.",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Disables the input and both stepper buttons.",
    },
    {
      name: "ariaLabel",
      type: "string",
      description: "Accessible name for the input — this component has no visible label of its own.",
    },
    {
      name: "id",
      type: "string",
      description: "Passed to the underlying input, for pairing with an external <label>.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the outer frame.",
    },
  ],

  tokens: [
    "--p-radius-050",
    "--p-space-100",
    "--s-color-action-primary-default",
    "--s-color-line-default",
    "--s-color-surface-default",
    "--s-color-surface-muted",
    "--s-color-text-default",
    "--s-color-text-disabled",
    "--s-icon-color-default",
    "--s-icon-color-disabled",
    "--t-inputnumber-font-line-height",
    "--t-inputnumber-font-size",
  ],

  guidelines: {
    dos: [
      "Always pass min, max, and step explicitly — bounds are caller-owned by design, not defaulted.",
      "Wrap in FormField (or, until that exists in this repo, a plain <label>) when used inside a standalone form — InputNumber has no visible label of its own.",
      "Pass `ariaLabel` whenever the value's meaning isn't already conveyed by a paired visible label.",
    ],
    donts: [
      "Don't clamp on every keystroke — the component intentionally only clamps on stepper click and blur/Enter so intermediate typing (e.g. \"1\" heading to \"10\") stays possible.",
      "Don't treat this as a general-purpose numeric field — its 88x32 fixed geometry and stepper anatomy are meant for compact, bounded numeric entry, not free-form numbers.",
      "Don't add a visible label inside this component — that's FormField's (or the composing screen's) responsibility.",
    ],
  },
}
