import type { ComponentDoc } from "@/docs/types"

// Documents the REAL Tree/TreeItem API in this repo. 144 documented Figma
// variants (4 levels x 4 icon-count types x checkbox on/off x 6 states) are
// covered by a single TreeItem component + props, per Figma's own
// instruction to compose rows by stacking instances in a vertical auto-
// layout frame rather than building one component per variant.
export const treeDoc: ComponentDoc = {
  slug: "tree",
  name: "Tree",
  status: "stable",
  description: "A hierarchical, expandable list of rows for navigating nested structures such as folders or segment groups.",
  figmaNodeId: "1273:16",
  sourcePath: "src/components/ui/tree.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Tree is a plain role=\"tree\" container; stack TreeItem rows inside it directly — indentation is baked into each row via `level`, so never add extra padding to the container. Real bound tokens (verified via get_variable_defs) are trusted over this component's own prose in two places: selected fill is --c-tree-branch-selected (#E9F8FA), and default row fill is --c-tree-branch-default (#FFFFFF), correcting earlier prose values.",
      exampleId: "tree/default",
    },
    {
      id: "levels",
      title: "Levels",
      body:
        "`level` is 0-3. Level 0 and 1 indent by space/200 (16px) and level 3 by the --c-tree-indent component token (80px). Level 2 is a verified raw 48px constant with no dedicated token — a deliberate exception, not an omission. Level 3 leaves never render a chevron, checkbox or not.",
      exampleId: "tree/levels",
    },
    {
      id: "icons",
      title: "Leading icons",
      body:
        "`icons` accepts 0-3 PrismIcon names, rendered after the chevron/checkbox slot, matching Figma's Type=No Icon/1 Icon/2 Icons/3 Icons variants. Every chevron state, including expanded, reuses the same chevron-right asset rotated 90deg — there is no separate chevron-down asset for this component.",
      exampleId: "tree/icons",
    },
    {
      id: "checkbox",
      title: "With checkboxes",
      body:
        "The chevron and checkbox are two independent, simultaneously-renderable slots, never mutually exclusive — a multiselect branch row always shows both when `expandable` and `checkbox` are both set. `checked` accepts \"indeterminate\" for a parent row whose children are partially selected.",
      exampleId: "tree/checkbox",
    },
    {
      id: "states",
      title: "Selected, disabled and row actions",
      body:
        "`selected` swaps to the corrected selected-fill token and bolder row typography. `disabled` disables interaction and dims text and icons. `onMoreActions` renders a trailing IconButton that only appears on hover/focus, for a per-row overflow menu.",
      exampleId: "tree/states",
    },
  ],

  props: [
    {
      name: "level",
      type: "0 | 1 | 2 | 3",
      defaultValue: "1",
      description: "Nesting depth, drives left indentation. Level 3 is a leaf level: it never shows a chevron.",
    },
    {
      name: "label",
      type: "string",
      required: true,
      description: "The row's text, truncates rather than wraps.",
    },
    {
      name: "icons",
      type: "PrismIconName[]",
      defaultValue: "[]",
      description: "0-3 leading icons rendered after the chevron/checkbox slot.",
    },
    {
      name: "expandable",
      type: "boolean",
      defaultValue: "false",
      description: "Shows the expand/collapse chevron. Pass for level 0-2 branch rows with real children; omit for level-3 leaves and flat \"no nesting\" rows.",
    },
    {
      name: "expanded",
      type: "boolean",
      defaultValue: "false",
      description: "Rotates the chevron 90deg when true. Purely visual — the caller owns which children are actually rendered.",
    },
    {
      name: "onToggleExpand",
      type: "() => void",
      description: "Called when the chevron button is clicked.",
    },
    {
      name: "checkbox",
      type: "boolean",
      defaultValue: "false",
      description: "Renders a Checkbox in the slot immediately after the chevron.",
    },
    {
      name: "checked",
      type: 'boolean | "indeterminate"',
      defaultValue: "false",
      description: "Checkbox state. \"indeterminate\" for a parent row with a partial selection among its children.",
    },
    {
      name: "onCheckedChange",
      type: '(checked: boolean | "indeterminate") => void',
      description: "Called when the row's checkbox changes.",
    },
    {
      name: "selected",
      type: "boolean",
      defaultValue: "false",
      description: "Applies the selected fill (--c-tree-branch-selected) and selected typography tokens.",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Disables the row's click, chevron and checkbox interaction and dims its text/icons.",
    },
    {
      name: "onSelect",
      type: "() => void",
      description: "Called when the row itself is clicked (not the chevron or checkbox, which stop propagation).",
    },
    {
      name: "onMoreActions",
      type: "() => void",
      description: "When provided, renders a trailing \"more actions\" IconButton visible on hover/focus.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only on the row. Do not use it to change fill, indentation or typography.",
    },
  ],

  tokens: [
    "--c-tree-branch-default",
    "--c-tree-branch-hover",
    "--c-tree-branch-selected",
    "--c-tree-indent",
    "--p-space-050",
    "--p-space-100",
    "--p-space-200",
    "--s-color-text-default",
    "--s-color-text-disabled",
    "--t-tree-font-default-line-height",
    "--t-tree-font-default-size",
    "--t-tree-font-default-weight",
    "--t-tree-font-selected-line-height",
    "--t-tree-font-selected-size",
    "--t-tree-font-selected-weight",
  ],

  guidelines: {
    dos: [
      "Stack TreeItem rows directly in a Tree container — indentation lives in the row, not the container.",
      "Treat `expandable` as level-appropriate: pass it on level 0-2 branch rows with real children, not as a generic style toggle.",
      "Use \"indeterminate\" on a parent's `checked` when only some of its children are selected.",
      "Trust the corrected token values (--c-tree-branch-selected, --c-tree-branch-default) over any older prose describing different colours.",
    ],
    donts: [
      "Don't add a separate chevron-down asset for the expanded state — this component rotates the same chevron-right icon 90deg, per Figma's own instruction.",
      "Don't show a chevron on a level-3 row — leaves never expand.",
      "Don't treat chevron and checkbox as mutually exclusive — a multiselect branch row shows both at once.",
      "Don't invent a token for level 2's 48px indent — it's a verified raw constant with no dedicated token, by design.",
    ],
  },
}
