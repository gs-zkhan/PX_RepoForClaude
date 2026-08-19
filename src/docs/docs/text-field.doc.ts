import type { ComponentDoc } from "@/docs/types"

export const textFieldDoc: ComponentDoc = {
  slug: "text-field",
  name: "TextField",
  status: "stable",
  description:
    "The full text input field: label row, input slot, and helper row. Composes the lower-level Input primitive.",
  figmaNodeId: "20:11",
  sourcePath: "src/components/ui/text-field.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "The Prism DS removed its separate Form Field wrapper — Label, Required, Info icon, and Helper text are now boolean properties owned directly by TextField (and, by the same pattern, Dropdown and Date Picker). Figma defaults: Label on, Required off, Info icon off, Helper text off. TextField renders the label, then composes the `Input` primitive for the actual control, then an optional helper row.",
      exampleId: "text-field/default",
    },
    {
      id: "states",
      title: "States",
      body:
        "`state` is \"default\", \"error\", or \"success\". Helper text is always shown when state is error or success, regardless of `helperVisible` — there is no way to hide the message the field is currently reporting.",
      exampleId: "text-field/states",
    },
    {
      id: "sizes",
      title: "Sizes",
      body:
        "Two sizes: large (32px, default) and small (24px, reserved for table-cell inline edit or PEC search). `size` is forwarded to the underlying Input.",
      exampleId: "text-field/sizes",
    },
    {
      id: "with-icons-and-required",
      title: "Icons, required, and info tooltip",
      body:
        "`leadingIcon`/`trailingIcon` render 16px PrismIcons inside the field, with Input's adornment padding shifting to clear them. `required` renders a danger-coloured asterisk after the label. `infoIcon` adds a 16px info glyph with a Tooltip showing `infoTooltip`.",
      exampleId: "text-field/with-icons-and-required",
    },
    {
      id: "inline",
      title: "Inline",
      body:
        "`inline` removes the field's border and background so it blends into its container surface (still shown on hover/focus/error). Reserve this for table cells and dense inline editing — never in a standalone form.",
      exampleId: "text-field/inline",
    },
  ],

  props: [
    {
      name: "label",
      type: "string",
      required: true,
      description: "Field label. Still used as the input's aria-label when labelVisible is false.",
    },
    {
      name: "labelVisible",
      type: "boolean",
      defaultValue: "true",
      description: "Label=On/Off. When off, `label` becomes the input's aria-label instead of visible text.",
    },
    {
      name: "required",
      type: "boolean",
      defaultValue: "false",
      description: "Renders a danger-coloured asterisk after the label and sets aria-required.",
    },
    {
      name: "infoIcon",
      type: "boolean",
      defaultValue: "false",
      description: "Shows a 16px info icon with a tooltip after the label.",
    },
    {
      name: "infoTooltip",
      type: "React.ReactNode",
      description: "Tooltip content shown when infoIcon is true.",
    },
    {
      name: "helperText",
      type: "string",
      description: "Helper/error/success message shown in the row below the input.",
    },
    {
      name: "helperVisible",
      type: "boolean",
      defaultValue: "false",
      description: "Helper text=On/Off. Always shown regardless of this flag when state is error or success.",
    },
    {
      name: "state",
      type: '"default" | "error" | "success"',
      defaultValue: '"default"',
      description: "Visual and semantic state. See States.",
    },
    {
      name: "size",
      type: '"large" | "small"',
      defaultValue: '"large"',
      description: "Field height, forwarded to Input. See Sizes.",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Disables the input.",
    },
    {
      name: "inline",
      type: "boolean",
      defaultValue: "false",
      description: "Inline=True/False. Removes border/background until hover/focus/error/success. Table cells and dense inline editing only.",
    },
    {
      name: "leadingIcon",
      type: "PrismIconName",
      description: "Optional 16px icon before the input value.",
    },
    {
      name: "trailingIcon",
      type: "PrismIconName",
      description: "Optional 16px icon after the input value.",
    },
    {
      name: "id",
      type: "string",
      description: "Input id. Auto-generated via React.useId() when omitted.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the outer flex-column wrapper.",
    },
  ],

  tokens: [
    "--c-textfield-content-error",
    "--c-textfield-content-helper",
    "--c-textfield-content-label",
    "--c-textfield-content-success",
    "--c-textfield-content-value",
    "--c-textfield-gap-label",
    "--c-textfield-gap-required",
    "--c-textfield-helper-font-line-height",
    "--c-textfield-helper-font-size",
    "--c-textfield-helper-font-weight",
    "--s-icon-color-subtle",
    "--t-font-label-small-line-height",
    "--t-font-label-small-size",
    "--t-font-label-small-weight",
  ],

  guidelines: {
    dos: [
      "Use TextField as the full field — do not reintroduce a separate Form Field wrapper around it.",
      "Reserve size=\"small\" and inline for table-cell / dense inline-editing contexts, never a standalone form.",
      "Pass helperText whenever state is error or success — it always renders in those states.",
      "Use leadingIcon/trailingIcon rather than manually positioning a PrismIcon inside the field.",
    ],
    donts: [
      "Don't wrap TextField in a bespoke label/input/helper layout — label, required, info icon, and helper text are already owned by this component.",
      "Don't use inline in a standalone form; it's reserved for table cells and dense inline editing.",
      "Don't style the underlying Input directly for field-level concerns (label, helper, required, info icon) — those belong to TextField, not Input.",
    ],
  },
}
