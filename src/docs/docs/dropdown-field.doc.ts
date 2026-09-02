import type { ComponentDoc } from "@/docs/types"

// Documents the REAL DropdownField API. DropdownField is the labelled form
// composition; Select (select.tsx, documented separately) is the underlying
// primitive it wraps — use DropdownField in forms, and Select directly for
// unlabelled or non-form pickers.
export const dropdownFieldDoc: ComponentDoc = {
  slug: "dropdown-field",
  name: "Dropdown Field",
  status: "stable",
  description: "A labelled form field wrapping Select, with optional required marker, info tooltip and helper text.",
  figmaNodeId: "20:13",
  sourcePath: "src/components/ui/dropdown-field.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "With a label and SelectItem children, DropdownField renders a visible label above a large Select trigger. It composes the shared Select/SelectTrigger/SelectContent primitives — supply SelectItem, SelectGroup or SelectSeparator as `children` exactly as you would inside SelectContent directly.",
      exampleId: "dropdown-field/default",
    },
    {
      id: "required-and-info",
      title: "Required and info icon",
      body:
        "`required` renders a danger-coloured asterisk after the label. `infoIcon` adds a 16px info glyph that opens a tooltip with `infoTooltip` content on hover or focus. Both are off by default, matching the Figma component's own defaults.",
      exampleId: "dropdown-field/required-and-info",
    },
    {
      id: "helper-text",
      title: "Helper text and validation state",
      body:
        "Set `state` to \"error\" or \"success\" to recolour the Select trigger border and the helper text below it. Helper text always renders once state leaves \"default\", regardless of `helperVisible`.",
      exampleId: "dropdown-field/helper-text",
    },
    {
      id: "sizes",
      title: "Sizes",
      body: "`size` passes straight through to the underlying SelectTrigger — Large (32px, default) for standalone forms, Small (24px) for compact contexts.",
      exampleId: "dropdown-field/sizes",
    },
    {
      id: "disabled",
      title: "Disabled",
      body: "Set `disabled` to disable the Select underneath, including keyboard interaction.",
      exampleId: "dropdown-field/disabled",
    },
  ],

  props: [
    {
      name: "label",
      type: "string",
      required: true,
      description: "The field's label. Still used as the trigger's aria-label when `labelVisible` is false.",
    },
    {
      name: "labelVisible",
      type: "boolean",
      defaultValue: "true",
      description: "Show the label row. When false, `label` is still applied as an aria-label.",
    },
    {
      name: "required",
      type: "boolean",
      defaultValue: "false",
      description: "Render a danger-coloured asterisk after the label.",
    },
    {
      name: "infoIcon",
      type: "boolean",
      defaultValue: "false",
      description: "Show a 16px info icon after the label that opens `infoTooltip` in a tooltip.",
    },
    {
      name: "infoTooltip",
      type: "React.ReactNode",
      description: "Tooltip content shown when `infoIcon` is true.",
    },
    {
      name: "helperText",
      type: "string",
      description: "Helper/validation copy shown below the field.",
    },
    {
      name: "helperVisible",
      type: "boolean",
      defaultValue: "false",
      description: "Show `helperText` at rest. Always shown regardless of this flag when `state` is \"error\" or \"success\".",
    },
    {
      name: "state",
      type: '"default" | "error" | "success"',
      defaultValue: '"default"',
      description: "Validation state. Recolours the trigger border and helper text.",
    },
    {
      name: "size",
      type: '"large" | "small"',
      defaultValue: '"large"',
      description: "Passed through to the underlying SelectTrigger.",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Disable the Select.",
    },
    {
      name: "inline",
      type: "boolean",
      defaultValue: "false",
      description: "Passed through to SelectTrigger's own inline treatment. Compact toolbar filters or side-panel rows only — never a standalone form.",
    },
    {
      name: "placeholder",
      type: "string",
      description: "Placeholder text shown when no value is selected.",
    },
    {
      name: "value",
      type: "string",
      description:
        "The selected value (controlled). Passing `value` makes DropdownField controlled for its lifetime — keep passing a string on every render, including before a selection is made (use `value=\"\"`, not `value={undefined}`). Switching between `undefined` and a string triggers React's uncontrolled-to-controlled warning. To render uncontrolled instead, use `defaultValue` and omit `value` entirely.",
    },
    {
      name: "defaultValue",
      type: "string",
      description: "The selected value (uncontrolled initial value). Use this instead of `value` when DropdownField should manage its own selection state.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      description: "Called when the selected value changes.",
    },
    {
      name: "id",
      type: "string",
      description: "Id applied to the SelectTrigger and used to derive the label's htmlFor and the helper text's aria-describedby.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the outer field wrapper.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      required: true,
      description: "SelectContent's children — SelectGroup/SelectItem/SelectSeparator etc.",
    },
  ],

  tokens: [
    "--c-dropdown-content-error",
    "--c-dropdown-content-helper",
    "--c-dropdown-content-label",
    "--c-dropdown-content-success",
    "--c-dropdown-gap-label",
    "--c-dropdown-gap-required",
    "--c-dropdown-helper-font-line-height",
    "--c-dropdown-helper-font-size",
    "--c-dropdown-helper-font-weight",
    "--s-icon-color-subtle",
    "--t-font-label-small-line-height",
    "--t-font-label-small-size",
    "--t-font-label-small-weight",
  ],

  guidelines: {
    dos: [
      "Use DropdownField in forms; use Select directly for unlabelled or non-form pickers.",
      "Reserve `inline` for compact toolbar filters and side-panel rows, never a standalone form.",
      "Pair `state=\"error\"` with `helperText` explaining what's wrong.",
      "When controlling `value`, keep it a string for the whole lifetime of the component — start with `value=\"\"`, not `value={undefined}`.",
    ],
    donts: [
      "Don't use the trigger's own 14px value/placeholder font token for the label row — the label uses font.label.small (12px) instead.",
      "Don't use `helperVisible` to hide an error or success helper; those always show once `state` leaves \"default\".",
      "Don't recreate the label/required/info-icon row locally on top of a bare Select — that anatomy already lives in DropdownField.",
      "Don't switch `value` between `undefined` and a string across renders (e.g. `value={x || undefined}`) — that flips the component between uncontrolled and controlled and triggers a React warning. Use `value=\"\"` for an empty controlled state, or `defaultValue` for uncontrolled.",
    ],
  },
}
