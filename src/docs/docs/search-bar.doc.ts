import type { ComponentDoc } from "@/docs/types"

export const searchBarDoc: ComponentDoc = {
  slug: "search-bar",
  name: "Search Bar",
  status: "stable",
  description:
    "A search input composed on top of Input, owning the search icon/clear-button slot, shape and size mapping.",
  sourcePath: "src/components/ui/search-bar.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "SearchBar composes Input — Input owns the complete textfield visual recipe (border, background, focus ring); SearchBar owns the Figma size API, the search-icon/clear-button slot, and the size→controlRecipe mapping onto Input.",
      exampleId: "search-bar/default",
    },
    {
      id: "sizes",
      title: "Sizes — a naming quirk",
      body:
        "The public `size` API is deliberately ascending-pixel-ordered: small=32px, medium=36px, large=40px. This does NOT match Figma's own token names — medium (36px) maps internally to Figma's \"xlarge\" sizing recipe, and Figma's own \"large\"/\"xxlarge\" (both 40px) collapse onto this API's single \"large\". Read the size by its pixel value in this table, not by cross-referencing the Figma layer name; this mismatch was a real source of confusion, caught and fixed in the Validation Gallery.",
      exampleId: "search-bar/sizes",
    },
    {
      id: "rounded",
      title: "Rounded",
      body: "`rounded` delegates to Input's `shape=\"pill\"` for a fully rounded search field.",
      exampleId: "search-bar/rounded",
    },
    {
      id: "clearable",
      title: "Clearable",
      body:
        "Passing `onClear` shows a clear button once `value` is non-empty. The clear button and the search icon share the same trailing slot and never render together — clear replaces search, not sits beside it.",
      exampleId: "search-bar/clearable",
    },
    {
      id: "inline",
      title: "Inline",
      body:
        "`inline` removes the border and background until hover/focus, matching the same Inline=True/False boolean Text Field, Dropdown and Date Picker expose in Figma. Reserve it for table cells and dense list/panel contexts (e.g. a PEC Dropdown column search) — never for a standalone search field.",
      exampleId: "search-bar/inline",
    },
  ],

  props: [
    {
      name: "size",
      type: '"small" | "medium" | "large"',
      defaultValue: '"medium"',
      description:
        "Public API is pixel-ascending (32/36/40), which does not match Figma's own size names — see Sizes above.",
    },
    {
      name: "rounded",
      type: "boolean",
      defaultValue: "false",
      description: "Pill-shaped radius when true. Delegates to Input shape=\"pill\".",
    },
    {
      name: "inline",
      type: "boolean",
      defaultValue: "false",
      description:
        "No border/background until hover/focus. Table cells and dense list/panel contexts only — never a standalone search context.",
    },
    {
      name: "value",
      type: "string",
      description: "Controlled input value.",
    },
    {
      name: "defaultValue",
      type: "string",
      description: "Uncontrolled initial value.",
    },
    {
      name: "placeholder",
      type: "string",
      defaultValue: '"Search…"',
      description: "Placeholder text.",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Disables the input and switches the trailing icon to its disabled color.",
    },
    {
      name: "onChange",
      type: "React.ChangeEventHandler<HTMLInputElement>",
      description: "Standard input change handler.",
    },
    {
      name: "onClear",
      type: "() => void",
      description: "When provided, shows a clear button while `value` is non-empty.",
    },
    {
      name: "className",
      type: "string",
      description: "Forwarded to the underlying Input.",
    },
  ],

  tokens: [
    "--c-search-height-large",
    "--c-search-height-medium",
    "--c-search-height-xlarge",
    "--c-search-icon-default",
    "--c-search-icon-disabled",
    "--c-search-padding-right",
    "--e-shadow-focus",
    "--s-icon-color-hover",
  ],

  guidelines: {
    dos: [
      "Read `size` by its pixel value (32/36/40) — don't assume it lines up with a same-named Figma size token.",
      "Provide `onClear` whenever the field should let users clear a typed query.",
      "Reserve `inline` for table cells and dense list/panel search, never a standalone search bar.",
      "Let SearchBar own the trailing icon slot — don't add a second icon or button in that position.",
    ],
    donts: [
      "Don't assume SearchBar's \"medium\" equals Figma's \"medium\" token — it maps to Figma's \"xlarge\" recipe.",
      "Don't show both the search icon and the clear button at once; the component already guarantees only one renders.",
      "Don't restyle Input's border/background from SearchBar — that recipe belongs to Input's own tokens.",
      "Don't use `inline` on a page-level or standalone search field; it's for dense, already-bordered contexts only.",
    ],
  },
}
