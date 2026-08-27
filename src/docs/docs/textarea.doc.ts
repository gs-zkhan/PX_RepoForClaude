import type { ComponentDoc } from "@/docs/types"

export const textareaDoc: ComponentDoc = {
  slug: "textarea",
  name: "Textarea",
  status: "stable",
  description:
    "Multi-line text input for longer content — notes, comments, descriptions. Same label/required/info-icon/helper-text/state/a11y shape as TextField; use TextField for single-line inputs.",
  figmaNodeId: "3137:126",
  sourcePath: "src/components/ui/textarea.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Figma calls this component \"Messagebox\": \"Multi-line text input for longer content — notes, comments, descriptions. Use when the expected input is a sentence or more. For single-line inputs use Text Field instead.\" Same composition as TextField — label row, then the field, then an optional helper row — but with a native <textarea> instead of Input. Fixed content-box height (default 80px, matching Figma) rather than auto-grow.",
      exampleId: "textarea/default",
    },
    {
      id: "states",
      title: "States",
      body:
        "`state` is \"default\", \"error\", or \"success\", identical to TextField. Helper text is always shown when state is error or success, regardless of `helperVisible`.",
      exampleId: "textarea/states",
    },
  ],

  props: [
    { name: "label", type: "string", required: true, description: "Field label (or aria-label when labelVisible is false)." },
    { name: "labelVisible", type: "boolean", defaultValue: "true", description: "Show the label row." },
    { name: "required", type: "boolean", defaultValue: "false", description: "Renders a danger-coloured asterisk after the label." },
    { name: "infoIcon", type: "boolean", defaultValue: "false", description: "Shows a 16px info icon + tooltip after the label." },
    { name: "infoTooltip", type: "React.ReactNode", description: "Tooltip content shown when infoIcon is true." },
    { name: "helperText", type: "string", description: "Helper/error/success message below the field." },
    { name: "helperVisible", type: "boolean", defaultValue: "false", description: "Show helperText even when state is \"default\"." },
    { name: "state", type: '"default" | "error" | "success"', defaultValue: '"default"', description: "Validation state." },
    { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables the field." },
    { name: "height", type: "number", defaultValue: "80", description: "Fixed content-box height in px." },
  ],

  tokens: [
    "--s-color-text-subtle",
    "--s-color-text-subtlest",
    "--s-color-text-default",
    "--s-color-text-disabled",
    "--s-color-line-default",
    "--s-color-line-brand",
    "--s-color-surface-default",
    "--s-color-surface-sunken",
    "--s-color-status-danger-default",
    "--s-color-status-success-default",
    "--p-radius-100",
    "--p-space-025",
    "--p-space-050",
    "--p-space-150",
    "--p-space-200",
    "--t-font-label-small-size",
    "--p-font-size-medium",
    "--p-font-size-small",
  ],

  guidelines: {
    dos: [
      "Use Textarea when the expected input is a sentence or more (notes, comments, descriptions).",
      "Pair with a visible label — never rely on placeholder text alone.",
    ],
    donts: [
      "Don't use Textarea for single-line inputs — use TextField instead.",
      "Don't borrow TextField's component tokens (--c-textfield-*) for a Textarea — this component intentionally uses semantic/primitive tokens directly (see the source file's header comment) until dedicated --c-textarea-* tokens exist.",
    ],
  },
}
