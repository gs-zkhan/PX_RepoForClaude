import type { ComponentDoc } from "@/docs/types"

export const statusSelectDoc: ComponentDoc = {
  slug: "status-select",
  name: "StatusSelect",
  status: "stable",
  description:
    "The interactive counterpart to StatusLabel — a status chip that opens a dropdown menu to change the value.",
  figmaNodeId: "767:222",
  sourcePath: "src/components/ui/status-select.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "StatusSelect is a composition, not a new visual component: its trigger is a StatusLabel plus a 16px chevron, and its menu is a DropdownMenuContent whose items each render a StatusLabel. Every value it needs — chip colours, height, radius, padding, gap, and the menu item hover fill — already existed as approved tokens, so nothing new was added to build it.",
      exampleId: "status-select/default",
    },
    {
      id: "sizes",
      title: "Sizes",
      body:
        "`size` is forwarded to the underlying StatusLabel for both the trigger and every menu item, and also selects which radius token the trigger's focus ring traces, so the ring always matches the chip's own corner.",
      exampleId: "status-select/sizes",
    },
    {
      id: "disabled",
      title: "Disabled",
      body:
        "`disabled` is passed to DropdownMenuTrigger and visually dims the trigger (`opacity-50`) with a not-allowed cursor.",
      exampleId: "status-select/disabled",
    },
  ],

  props: [
    {
      name: "value",
      type: "string",
      required: true,
      description: "Currently selected option's value. Must match an entry in `options`.",
    },
    {
      name: "options",
      type: "StatusSelectOption[]",
      required: true,
      description:
        'Available statuses, each `{ value, variant, label }`. `label` should use full wording (e.g. "Work in progress"), matching the Figma menu.',
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      description: "Called with the newly selected option's value.",
    },
    {
      name: "size",
      type: '"small" | "regular"',
      defaultValue: '"regular"',
      description: "Forwarded to the trigger and menu-item StatusLabels, and to the trigger's focus-ring radius.",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Disables the trigger.",
    },
    {
      name: "align",
      type: '"start" | "center" | "end"',
      defaultValue: '"start"',
      description: "Menu alignment against the trigger.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the trigger button.",
    },
  ],

  tokens: [
    "--c-statuslabel-radius-regular",
    "--c-statuslabel-radius-small",
    "--e-shadow-focus",
  ],

  guidelines: {
    dos: [
      "Use StatusSelect when the user needs to change a status; use plain StatusLabel for read-only display.",
      "Provide full-wording labels in `options` (e.g. \"Work in progress\") to match the Figma menu, even if the chip itself shows shorter text.",
      "Let `size` flow through unchanged to both the trigger and the menu items so they stay visually consistent.",
    ],
    donts: [
      "Don't pass a `value` that has no matching entry in `options` — the component warns in dev and renders nothing rather than an empty pill.",
      "Don't rebuild the trigger or menu item styling locally; both compose StatusLabel and DropdownMenu tokens that already exist.",
      "Don't remove the current-value indicator in the menu; without it there is no way to tell which status is active once the menu is open.",
    ],
  },
}
