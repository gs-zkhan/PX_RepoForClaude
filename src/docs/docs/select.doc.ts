import type { ComponentDoc } from "@/docs/types"

export const selectDoc: ComponentDoc = {
  slug: "select",
  name: "Select",
  status: "stable",
  description:
    "A Radix-backed dropdown select primitive — the trigger, panel and item pieces that DropdownField composes into a full form field.",
  sourcePath: "src/components/ui/select.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Select, SelectGroup and SelectValue are thin Radix passthroughs. SelectTrigger, SelectContent and SelectItem add this repo's own visual recipe on top. Most form usage should prefer DropdownField, which wraps this Select with a label row, required/info-icon/helper-text slots — reach for Select directly only when you need the bare trigger and panel with no label.",
      exampleId: "select/default",
    },
    {
      id: "sizes",
      title: "Sizes",
      body:
        "SelectTrigger's `size` prop is Large (32px, default) or Small (28px). Small is for compact toolbar filters and side-panel rows only.",
      exampleId: "select/sizes",
    },
    {
      id: "states",
      title: "States",
      body:
        "`success` sets the trigger border to --c-dropdown-border-success. Radix/HTML `aria-invalid` switches the trigger to its error border and content color. `disabled` (passed to the Select root) applies the shared disabled treatment.",
      exampleId: "select/states",
    },
    {
      id: "with-indicator",
      title: "With selected-item indicator",
      body:
        "`showIndicator` on SelectItem renders a 16px tick next to the selected item inside the panel. It's off by default since most PX dropdowns rely on the trigger's own value text rather than an in-list checkmark.",
      exampleId: "select/with-indicator",
    },
    {
      id: "inline",
      title: "Inline",
      body:
        "`inline` on SelectTrigger removes the border and background until hover/type/open/error — the same boolean property Text Field and Date Picker expose in Figma.",
      exampleId: "select/inline",
    },
  ],

  props: [
    {
      name: "Select props",
      type: "React.ComponentProps<typeof SelectPrimitive.Root>",
      description: "Passed straight through to Radix's Select.Root, including `value`, `defaultValue`, `onValueChange` and `disabled`.",
    },
    {
      name: "SelectTrigger size",
      type: '"large" | "small"',
      defaultValue: '"large"',
      description: "Large (32px, default) or Small (28px, compact toolbar/side-panel filters only).",
    },
    {
      name: "SelectTrigger success",
      type: "boolean",
      defaultValue: "false",
      description: "Success state — sets border to --c-dropdown-border-success.",
    },
    {
      name: "SelectTrigger inline",
      type: "boolean",
      defaultValue: "false",
      description: "Inline=True/False (Figma boolean property) — no border/background until Hover/Type/Open/Error.",
    },
    {
      name: "SelectTrigger (other props)",
      type: "React.ComponentProps<typeof SelectPrimitive.Trigger>",
      description: "All other Radix Select.Trigger props pass through, including `aria-invalid` for the error state.",
    },
    {
      name: "SelectContent position",
      type: '"item-aligned" | "popper"',
      defaultValue: '"popper"',
      description: "Radix positioning strategy for the panel; `popper` sizes the panel to the trigger's width.",
    },
    {
      name: "SelectItem showIndicator",
      type: "boolean",
      defaultValue: "false",
      description: "Renders a 16px tick next to the item when selected.",
    },
    {
      name: "SelectItem (other props)",
      type: "React.ComponentProps<typeof SelectPrimitive.Item>",
      description: "All other Radix Select.Item props pass through, including `value` and `disabled`.",
    },
    {
      name: "SelectLabel / SelectSeparator / SelectScrollUpButton / SelectScrollDownButton",
      type: "React.ComponentProps<typeof SelectPrimitive.*>",
      description: "Thin visual wrappers around the matching Radix Select subcomponents.",
    },
  ],

  tokens: [
    "--c-dropdown-background-default",
    "--c-dropdown-background-disabled",
    "--c-dropdown-border-default",
    "--c-dropdown-border-disabled",
    "--c-dropdown-border-error",
    "--c-dropdown-border-focus",
    "--c-dropdown-border-hover",
    "--c-dropdown-border-success",
    "--c-dropdown-border-width",
    "--c-dropdown-content-disabled",
    "--c-dropdown-content-error",
    "--c-dropdown-content-label",
    "--c-dropdown-content-placeholder",
    "--c-dropdown-content-value",
    "--c-dropdown-focus-ring-color",
    "--c-dropdown-focus-ring-width",
    "--c-dropdown-font-line-height",
    "--c-dropdown-font-size",
    "--c-dropdown-font-weight",
    "--c-dropdown-height-large",
    "--c-dropdown-height-small",
    "--c-dropdown-menu-background",
    "--c-dropdown-menu-divider",
    "--c-dropdown-menu-font-line-height",
    "--c-dropdown-menu-font-size",
    "--c-dropdown-menu-item-background-default",
    "--c-dropdown-menu-item-background-hover",
    "--c-dropdown-menu-item-background-selected",
    "--c-dropdown-menu-item-content",
    "--c-dropdown-menu-item-gap",
    "--c-dropdown-menu-item-padding-horizontal",
    "--c-dropdown-menu-item-padding-vertical",
    "--c-dropdown-menu-padding-vertical",
    "--c-dropdown-menu-radius",
    "--c-dropdown-padding-left",
    "--c-dropdown-padding-right",
    "--c-dropdown-padding-vertical-large",
    "--c-dropdown-padding-vertical-small",
    "--c-dropdown-radius",
    "--p-shadow-300",
    "--radix-select-trigger-height",
    "--radix-select-trigger-width",
    "--s-color-line-default",
    "--s-icon-color-default",
    "--s-icon-color-disabled",
    "--s-icon-color-selected",
  ],

  guidelines: {
    dos: [
      "Prefer DropdownField for any form usage — it composes this Select with the label/required/helper-text row.",
      "Reach for Select directly only for label-less, bare trigger+panel contexts (e.g. inline toolbar filters).",
      "Use `size=\"small\"` only in compact toolbar filters or side-panel rows.",
      "Set `success` or `aria-invalid` to reflect real validation state, not as a decorative accent.",
    ],
    donts: [
      "Don't rebuild DropdownField's label/required/helper-text row on top of a bare Select — that duplicates an existing component.",
      "Don't restyle SelectTrigger or SelectItem via className overrides — their color, radius and spacing come from --c-dropdown-* tokens.",
      "Don't use `showIndicator` and rely on the trigger value text being redundant — most PX dropdowns intentionally omit the in-list tick.",
      "Don't use `inline` outside of contexts that already mirror Text Field/Date Picker's own inline convention.",
    ],
  },
}
