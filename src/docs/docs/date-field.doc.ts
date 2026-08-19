import type { ComponentDoc } from "@/docs/types"

// Documents the REAL DateField API. Form Field no longer exists in Figma, so
// Label, Required, Info icon and Helper text are boolean properties owned
// directly by this component — the same composition pattern used by
// TextField and DropdownField, not a shared "FormField" wrapper.
export const dateFieldDoc: ComponentDoc = {
  slug: "date-field",
  name: "Date Field",
  status: "stable",
  description:
    "A labelled form field wrapping DatePicker, with optional required marker, info tooltip and helper text.",
  sourcePath: "src/components/ui/date-field.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "With just a label, DateField renders a visible label above a large DatePicker trigger. Use it any time a date needs to sit inside a labelled form — for an unlabelled or compact trigger, compose DatePicker directly instead.",
      exampleId: "date-field/default",
    },
    {
      id: "required-and-info",
      title: "Required and info icon",
      body:
        "`required` renders a danger-coloured asterisk after the label. `infoIcon` adds a 16px info glyph that opens a tooltip with `infoTooltip` content on hover or focus. Both are off by default, matching the Figma component's own defaults.",
      exampleId: "date-field/required-and-info",
    },
    {
      id: "helper-text",
      title: "Helper text and validation state",
      body:
        "Set `state` to \"error\" or \"success\" to recolour the DatePicker border and the helper text below it. Helper text always renders once state leaves \"default\", regardless of `helperVisible` — that flag only matters for a neutral hint you want shown at rest.",
      exampleId: "date-field/helper-text",
    },
    {
      id: "sizes",
      title: "Sizes",
      body:
        "`size` passes straight through to the underlying DatePicker trigger — Large (32px, default) for standalone forms, Small (24px) for compact or inline contexts.",
      exampleId: "date-field/sizes",
    },
    {
      id: "disabled",
      title: "Disabled",
      body: "Set `disabled` when the date cannot currently be edited. It disables the DatePicker trigger underneath.",
      exampleId: "date-field/disabled",
    },
    {
      id: "inline",
      title: "Inline",
      body:
        "`inline` removes the trigger's border and background until hover, focus or error, for compact/inline table or side-panel rows. Never use it inside a standalone form — that is the one context Figma calls out explicitly.",
      exampleId: "date-field/inline",
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
      type: "DatePickerSize",
      defaultValue: '"large"',
      description: "Passed through to the underlying DatePicker trigger.",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Disable the DatePicker trigger.",
    },
    {
      name: "inline",
      type: "boolean",
      defaultValue: "false",
      description: "Remove the trigger's border/background until hover, focus or error. Compact/inline contexts only — never in a standalone form.",
    },
    {
      name: "placeholder",
      type: "string",
      description: "Placeholder text shown when no date is selected.",
    },
    {
      name: "value",
      type: "Date",
      description: "The selected date (controlled).",
    },
    {
      name: "onChange",
      type: "(date: Date | undefined) => void",
      description: "Called when the selected date changes.",
    },
    {
      name: "id",
      type: "string",
      description: "Id applied to the DatePicker trigger and used to derive the label's htmlFor and the helper text's aria-describedby.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the outer field wrapper.",
    },
  ],

  tokens: [
    "--c-datepicker-input-content-error",
    "--c-datepicker-input-content-helper",
    "--c-datepicker-input-content-label",
    "--c-datepicker-input-content-success",
    "--c-datepicker-input-gap-label",
    "--c-datepicker-input-gap-required",
    "--c-datepicker-input-helper-font-line-height",
    "--c-datepicker-input-helper-font-size",
    "--c-datepicker-input-helper-font-weight",
    "--s-icon-color-subtle",
    "--t-font-label-small-line-height",
    "--t-font-label-small-size",
    "--t-font-label-small-weight",
  ],

  guidelines: {
    dos: [
      "Use DateField any time a date input sits inside a labelled form.",
      "Reserve `inline` for compact table/side-panel rows, never a standalone form.",
      "Pair `state=\"error\"` with `helperText` explaining what's wrong.",
      "Use the label row's own font tokens — do not restyle the label with className.",
    ],
    donts: [
      "Don't render DateField without a label just to get a bare trigger — compose DatePicker directly instead.",
      "Don't use `helperVisible` to hide an error or success helper; those always show once `state` leaves \"default\".",
      "Don't reach for the trigger's 14px value/placeholder font token for the label row — the label uses font.label.small (12px) instead.",
    ],
  },
}
