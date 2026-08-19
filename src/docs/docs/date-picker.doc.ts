import type { ComponentDoc } from "@/docs/types"

// Documents the REAL DatePicker API — the unlabelled trigger + calendar
// popover that DateField wraps. Use this directly for unlabelled or
// non-form contexts; use DateField when the date needs a label, required
// marker, info tooltip or helper text.
export const datePickerDoc: ComponentDoc = {
  slug: "date-picker",
  name: "Date Picker",
  status: "stable",
  description: "A single-date trigger that opens a Calendar in a popover. The unlabelled primitive behind DateField.",
  sourcePath: "src/components/ui/date-picker.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "With no props, DatePicker renders a Large trigger showing `placeholder` text and a calendar icon. Clicking it opens a single-date Calendar in a popover anchored to the trigger.",
      exampleId: "date-picker/default",
    },
    {
      id: "sizes",
      title: "Sizes",
      body: "Two sizes, set with `size`. Large (32px) is the default for standalone forms; Small (24px) suits compact and inline contexts.",
      exampleId: "date-picker/sizes",
    },
    {
      id: "success",
      title: "Success state",
      body:
        "`success` recolours the trigger border with the component's success token. There is no dedicated `error` boolean — pass the standard `aria-invalid` prop instead, which recolours both the border and the value text.",
      exampleId: "date-picker/success",
    },
    {
      id: "inline",
      title: "Inline",
      body:
        "`inline` (a Figma boolean property) removes the trigger's border and background until hover, focus or error — reserve it for compact/inline contexts, never a standalone form.",
      exampleId: "date-picker/inline",
    },
    {
      id: "disabled",
      title: "Disabled",
      body: "Set `disabled` when the date cannot currently be edited. Applies the disabled border, background, content colour and icon colour tokens.",
      exampleId: "date-picker/disabled",
    },
  ],

  props: [
    {
      name: "value",
      type: "Date",
      description: "The selected date (controlled). Falls back to internal state when omitted.",
    },
    {
      name: "onChange",
      type: "(date: Date | undefined) => void",
      description: "Called when the selected date changes.",
    },
    {
      name: "placeholder",
      type: "string",
      defaultValue: '"Select a date"',
      description: "Text shown in the trigger when no date is selected.",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Disable the trigger.",
    },
    {
      name: "size",
      type: '"large" | "small"',
      defaultValue: '"large"',
      description: "Large (32px, default) for standalone forms; Small (24px) for compact/inline contexts.",
    },
    {
      name: "success",
      type: "boolean",
      defaultValue: "false",
      description: "Sets the trigger border to the success token.",
    },
    {
      name: "inline",
      type: "boolean",
      defaultValue: "false",
      description: "Removes the trigger's border/background until hover, focus or error. Compact/inline contexts only.",
    },
    {
      name: "id",
      type: "string",
      description: "Id applied to the trigger button.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the trigger button.",
    },
    {
      name: "aria-invalid",
      type: "React.ComponentProps<\"button\">[\"aria-invalid\"]",
      description: "Standard ARIA invalid flag — recolours the border and value text to the error tokens.",
    },
    {
      name: "aria-describedby",
      type: "React.ComponentProps<\"button\">[\"aria-describedby\"]",
      description: "Standard ARIA description reference, e.g. pointing at helper text.",
    },
    {
      name: "aria-required",
      type: "React.ComponentProps<\"button\">[\"aria-required\"]",
      description: "Standard ARIA required flag.",
    },
    {
      name: "aria-label",
      type: "React.ComponentProps<\"button\">[\"aria-label\"]",
      description: "Standard ARIA label, used by DateField when its own label is hidden.",
    },
  ],

  tokens: [
    "--c-datepicker-input-background-default",
    "--c-datepicker-input-background-disabled",
    "--c-datepicker-input-border-default",
    "--c-datepicker-input-border-disabled",
    "--c-datepicker-input-border-error",
    "--c-datepicker-input-border-focus",
    "--c-datepicker-input-border-hover",
    "--c-datepicker-input-border-success",
    "--c-datepicker-input-border-width",
    "--c-datepicker-input-content-disabled",
    "--c-datepicker-input-content-error",
    "--c-datepicker-input-content-placeholder",
    "--c-datepicker-input-content-value",
    "--c-datepicker-input-focus-ring-color",
    "--c-datepicker-input-focus-ring-width",
    "--c-datepicker-input-font-line-height",
    "--c-datepicker-input-font-size",
    "--c-datepicker-input-font-weight",
    "--c-datepicker-input-height-large",
    "--c-datepicker-input-height-small",
    "--c-datepicker-input-padding-left",
    "--c-datepicker-input-padding-right",
    "--c-datepicker-input-padding-vertical-large",
    "--c-datepicker-input-padding-vertical-small",
    "--c-datepicker-input-radius",
    "--s-icon-color-default",
    "--s-icon-color-disabled",
  ],

  guidelines: {
    dos: [
      "Use DatePicker directly for unlabelled or non-form date inputs; use DateField when a label, required marker, info tooltip or helper text is needed.",
      "Drive error styling with `aria-invalid`, and success styling with `success` — they are not the same boolean.",
      "Reserve `inline` for compact/inline contexts, never a standalone form.",
    ],
    donts: [
      "Don't add a local error boolean prop — the component already exposes error state through `aria-invalid`.",
      "Don't restyle the trigger's height, padding or radius through className; use `size` or request a token change.",
      "Don't build a bespoke date trigger with a native `<button>` — compose this component.",
    ],
  },
}
