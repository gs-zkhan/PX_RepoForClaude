import type { ComponentDoc } from "@/docs/types"

// Documents the REAL DropdownMenu API — a thin styling layer over Radix's
// DropdownMenu primitive. No Figma node comment exists in the source file,
// only a token-reference comment, so figmaNodeId is intentionally omitted.
export const dropdownMenuDoc: ComponentDoc = {
  slug: "dropdown-menu",
  name: "Dropdown Menu",
  status: "stable",
  description: "A floating action/selection menu opened from a trigger, built on Radix's DropdownMenu primitive.",
  sourcePath: "src/components/ui/dropdown-menu.tsx",

  // Registry status note: this component is Implemented-unmapped in
  // ai/figma-coverage.json — it is NOT independently approved for arbitrary
  // direct screen composition. It is, however, a confirmed dependency of
  // three approved surfaces (component-button-split-variant,
  // shell-analytics-secondary-nav, component-dashboard-widget-card), each of
  // whose own approval covers this exact internal composition. Using it
  // through one of those components' own documented public API — e.g.
  // passing DropdownMenuItem content into SplitButton's `menuContent` prop —
  // is covered by that component's approval. Importing DropdownMenu /
  // DropdownMenuTrigger / DropdownMenuContent directly in new screen code is
  // NOT covered by this and remains disallowed. See
  // decision-dropdown-menu-scoped-composition in ai/figma-coverage.json.

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Compose DropdownMenu, DropdownMenuTrigger (with `asChild` on a Button) and DropdownMenuContent with DropdownMenuItem children. `destructive` recolours an item's text with the shared destructive action token — reserve it for irreversible actions like Delete.",
      exampleId: "dropdown-menu/default",
    },
    {
      id: "with-icons-and-shortcut",
      title: "With icons and shortcut",
      body:
        "`icon` renders a leading 16px PrismIcon; `shortcut` renders a trailing keyboard-hint string. Both are optional and independent — use icons for scannability and shortcuts only where a real keybinding exists.",
      exampleId: "dropdown-menu/with-icons-and-shortcut",
    },
    {
      id: "selected",
      title: "Selected item",
      body:
        "`selected` applies the item's selected background independently of Radix's own keyboard/hover highlight — use it when the menu doubles as a value picker and needs to show the current value.",
      exampleId: "dropdown-menu/selected",
    },
    {
      id: "sections",
      title: "Sections",
      body: "Group related items with DropdownMenuGroup and DropdownMenuLabel, and separate groups with DropdownMenuSeparator.",
      exampleId: "dropdown-menu/sections",
    },
  ],

  props: [
    {
      name: "destructive",
      type: "boolean",
      defaultValue: "false",
      description: "Renders the item's text in the shared destructive action color. DropdownMenuItem only.",
    },
    {
      name: "icon",
      type: "PrismIconName",
      description: "Optional leading 16px Prism icon. DropdownMenuItem only.",
    },
    {
      name: "shortcut",
      type: "string",
      description: "Optional trailing keyboard-shortcut hint text. DropdownMenuItem only.",
    },
    {
      name: "selected",
      type: "boolean",
      defaultValue: "false",
      description: "Applies the item's selected background. DropdownMenuItem only.",
    },
    {
      name: "sideOffset",
      type: "number",
      defaultValue: "4",
      description: "Gap between the trigger and the panel. DropdownMenuContent only, passed through to Radix's Content.",
    },
  ],

  tokens: [
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
    "--c-dropdown-menu-section-label",
    "--e-shadow-500",
    "--p-shadow-500",
    "--s-color-action-destructive-default",
    "--s-color-line-default",
  ],

  guidelines: {
    dos: [
      "Use `asChild` on DropdownMenuTrigger with a Button or IconButton so the trigger keeps that component's own styling.",
      "Reserve `destructive` for irreversible actions such as Delete, and pair it with a confirmation step downstream.",
      "Use DropdownMenuGroup + DropdownMenuLabel to section a long menu instead of inventing a local label element.",
    ],
    donts: [
      "Don't use `--c-dropdown-*` tokens here — that namespace belongs to the form Select trigger (DropdownField), not the menu. This component owns `--c-dropdown-menu-*`.",
      "Don't use `--p-shadow-500` for the panel elevation — the verified token is the semantic `--e-shadow-500`, not the primitive.",
      "Don't build a bespoke floating menu with a native `<ul>`/`<button>` and manual positioning — compose this component on top of Radix.",
    ],
  },
}
