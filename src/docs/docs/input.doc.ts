import type { ComponentDoc } from "@/docs/types"

// Documents the real Input API. Its own header comment says the
// controlRecipe/surface props are "internal composition API — intended for
// SearchBar only" and that search-* recipes must not be passed from product
// screens. This doc reflects that honestly: Input is the shared primitive
// underneath TextField, SearchBar and DropdownField, and most consumers
// should reach for one of those instead.
export const inputDoc: ComponentDoc = {
  slug: "input",
  name: "Input",
  status: "stable",
  description:
    "The shared low-level text input primitive underneath TextField, SearchBar and DropdownField.",
  sourcePath: "src/components/ui/input.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Renders a bare textfield-recipe input at the Large (32px) height. Most product screens should reach for TextField, SearchBar, or DropdownField instead of Input directly — those own the label, helper text, and other field chrome that a standalone Input does not provide.",
      exampleId: "input/default",
    },
    {
      id: "sizes",
      title: "Sizes",
      body:
        "`size` (\"large\" | \"small\") only applies when `controlRecipe` is \"textfield\" (the default). Large (32px) is the default; Small (24px) is for table-cell inline edit and PEC search only.",
      exampleId: "input/sizes",
    },
    {
      id: "states",
      title: "Success, error, disabled",
      body:
        "`success` sets the border/content to the success tokens. The error state is driven by the native `aria-invalid` attribute rather than a boolean prop, so it composes directly with standard form-validation patterns. `disabled` uses the disabled border/background/content tokens for the active surface (textfield or search).",
      exampleId: "input/states",
    },
    {
      id: "adornments",
      title: "Leading and trailing adornments",
      body:
        "`leadingAdornment`/`trailingAdornment` (16 or 24) only reserve the padding needed to clear an icon or action of that size — Input does not render the icon itself. Positioning the icon (e.g. absolute left-3) is owned by the composing component, which is exactly how SearchBar and TextField's icon props are built on top of this.",
      exampleId: "input/adornments",
    },
    {
      id: "inline",
      title: "Inline",
      body:
        "`inline` removes the border and background so the field blends into its container surface; the border still appears on hover, focus, and error. Reserve this for table cells, inline editing, and other dense UI contexts — never in a standalone form, mirroring the same Inline=True convention used by TextField, DropdownField, DatePicker and SearchBar.",
      exampleId: "input/inline",
    },
  ],

  props: [
    {
      name: "controlRecipe",
      type: '"textfield" | "search-medium" | "search-large" | "search-xlarge" | "search-xxlarge"',
      defaultValue: '"textfield"',
      description:
        "Internal composition API, intended for SearchBar only. Defaults to \"textfield\" which uses --c-textfield-height-large (32px). Do not pass search-* recipes from product screens; use SearchBar instead.",
    },
    {
      name: "size",
      type: '"large" | "small"',
      defaultValue: '"large"',
      description:
        "Text Field size — Large (32px, default) or Small (24px, table-cell inline edit / PEC search only). Only applies when controlRecipe is \"textfield\".",
    },
    {
      name: "success",
      type: "boolean",
      defaultValue: "false",
      description:
        "Success state — mirrors aria-invalid for the error state. Sets border/content to --c-textfield-border-success / content-success.",
    },
    {
      name: "inline",
      type: "boolean",
      defaultValue: "false",
      description:
        "Inline=True (Figma boolean property) — removes border/background so the field blends into its container surface. Border still appears on Hover/Focus/Error. Table cells, inline editing, dense UI contexts only — never in a standalone form.",
    },
    {
      name: "leadingAdornment",
      type: "16 | 24",
      description:
        "Pixel size of the leading icon. Input applies left padding to clear it (16 -> pl-9 / 36px, 24 -> pl-10 / 40px). Icon positioning (left-3) is owned by the composing component.",
    },
    {
      name: "trailingAdornment",
      type: "16 | 24",
      description:
        "Pixel size of the trailing action. Input applies right padding to clear it (16 -> pr-8 / 32px, 24 -> pr-10 / 40px). Button positioning (right-2) is owned by the composing component.",
    },
    {
      name: "shape",
      type: '"default" | "pill"',
      defaultValue: '"default"',
      description: '"pill" uses --p-radius-full. Defaults to "default" (--c-textfield-radius).',
    },
    {
      name: "surface",
      type: '"textfield" | "search"',
      defaultValue: '"textfield"',
      description:
        "Selects the component token family for radius/padding/border/background/content/typography. \"search\" uses --c-search-* (SearchBar only).",
    },
  ],

  tokens: [
    "--c-search-background-default",
    "--c-search-background-disabled",
    "--c-search-border-active",
    "--c-search-border-default",
    "--c-search-content-disabled",
    "--c-search-content-placeholder",
    "--c-search-content-value",
    "--c-search-font-line-height",
    "--c-search-font-size",
    "--c-search-height-large",
    "--c-search-height-medium",
    "--c-search-height-xlarge",
    "--c-search-height-xxlarge",
    "--c-search-padding-left",
    "--c-search-padding-right",
    "--c-search-padding-vertical",
    "--c-search-radius-default",
    "--c-textfield-background-default",
    "--c-textfield-background-disabled",
    "--c-textfield-border-default",
    "--c-textfield-border-disabled",
    "--c-textfield-border-error",
    "--c-textfield-border-focus",
    "--c-textfield-border-hover",
    "--c-textfield-border-success",
    "--c-textfield-border-width",
    "--c-textfield-content-disabled",
    "--c-textfield-content-error",
    "--c-textfield-content-placeholder",
    "--c-textfield-content-value",
    "--c-textfield-focus-ring-color",
    "--c-textfield-focus-ring-width",
    "--c-textfield-font-line-height",
    "--c-textfield-font-size",
    "--c-textfield-font-weight",
    "--c-textfield-height-large",
    "--c-textfield-height-small",
    "--c-textfield-padding-left",
    "--c-textfield-padding-right",
    "--c-textfield-padding-vertical-large",
    "--c-textfield-padding-vertical-small",
    "--c-textfield-radius",
    "--p-radius-full",
  ],

  guidelines: {
    dos: [
      "Reach for TextField, SearchBar, or DropdownField in product screens — Input is the shared primitive underneath them, not a field component on its own.",
      "Drive the error state through aria-invalid so it composes with standard HTML form validation, rather than adding a separate error boolean.",
      "Let the composing component own icon positioning; use leadingAdornment/trailingAdornment only to reserve the clearing padding.",
    ],
    donts: [
      "Don't pass a search-* controlRecipe from a product screen — that recipe is reserved for SearchBar's internal use.",
      "Don't use `inline` in a standalone form — it's for table cells and other dense, inline-editing contexts only.",
      "Don't add a visible label around a bare Input in product code — compose TextField (or DropdownField/SearchBar) instead, which already provide label, helper text, and required/info-icon handling.",
    ],
  },
}
