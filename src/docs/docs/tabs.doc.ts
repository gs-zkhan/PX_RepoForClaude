import type { ComponentDoc } from "@/docs/types"

export const tabsDoc: ComponentDoc = {
  slug: "tabs",
  name: "Tabs",
  status: "stable",
  description:
    "A tab list that switches between panels. Two variants — Primary (underline) and Secondary (pill) — across three sizes.",
  figmaNodeId: "1078:437",
  sourcePath: "src/components/ui/tabs.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Tabs is @radix-ui/react-tabs' Root directly, giving roving-tabindex keyboard navigation and tablist/tab/tabpanel ARIA for free. Compose Tabs > TabsList > TabsTrigger (one per tab) and TabsContent (one per panel), matched by `value`.",
      exampleId: "tabs/default",
    },
    {
      id: "variants",
      title: "Variants",
      body:
        "`variant` on TabsList selects Primary (underline indicator on the active tab, no background, optional leading icon) or Secondary (pill/segmented background, no indicator, no icon support at all).",
      exampleId: "tabs/variants",
    },
    {
      id: "sizes",
      title: "Sizes",
      body:
        "Three sizes — large, medium, small — set with `size` on TabsList. Font is not uniform across sizes: Large uses --t-tab-font-* (14px/24 line-height); Medium and Small both use --t-font-heading-xxsmall-* (12px/16 line-height), verified via Figma variable defs rather than assumed. Vertical padding differs by variant too: Large/Medium use the shared --c-tabs-padding-vertical (8px) component token for Primary, while Secondary uses raw 4px (Large/Medium) or 2px (Small) — Small's Primary padding (6px) and Secondary padding (2px) have no dedicated token and are verified raw constants from Figma metadata, not tokens.",
      exampleId: "tabs/sizes",
    },
    {
      id: "with-icon",
      title: "With icon",
      body:
        "`icon` on TabsTrigger renders a leading PrismIcon, but only for variant=\"primary\" — every Secondary symbol in Figma is Icon=False, so there is no Icon=True variant for Secondary at all. Passing `icon` on a Secondary trigger is silently ignored (with a dev-only console warning). Icon size follows the tab size: 24px for Large, 20px for Medium/Small (rendered from the 24px source asset via `sourceSize`, since no 20px asset exists).",
      exampleId: "tabs/with-icon",
    },
    {
      id: "disabled",
      title: "Disabled",
      body:
        "`disabled` is a native Radix Trigger prop, passed straight through. Disabled tabs remove pointer events and switch label colour to --c-tabs-label-disabled.",
      exampleId: "tabs/disabled",
    },
  ],

  props: [
    {
      name: "value (Tabs)",
      type: "string",
      description: "Controlled active tab value.",
    },
    {
      name: "defaultValue (Tabs)",
      type: "string",
      description: "Uncontrolled initial active tab value.",
    },
    {
      name: "onValueChange (Tabs)",
      type: "(value: string) => void",
      description: "Called when the active tab changes.",
    },
    {
      name: "variant (TabsList)",
      type: '"primary" | "secondary"',
      defaultValue: '"primary"',
      description: "Underline vs. pill treatment. See Variants.",
    },
    {
      name: "size (TabsList)",
      type: '"small" | "medium" | "large"',
      defaultValue: '"large"',
      description: "Controls font and vertical padding per the size/variant token map. See Sizes.",
    },
    {
      name: "value (TabsTrigger)",
      type: "string",
      required: true,
      description: "This trigger's tab identifier, matched against a TabsContent value.",
    },
    {
      name: "icon (TabsTrigger)",
      type: "PrismIconName",
      description: "Optional leading icon. Only renders on variant=\"primary\"; ignored (with a dev warning) on \"secondary\".",
    },
    {
      name: "disabled (TabsTrigger)",
      type: "boolean",
      description: "Disables this tab. Inherited from Radix's Trigger props.",
    },
    {
      name: "value (TabsContent)",
      type: "string",
      required: true,
      description: "Matches the TabsTrigger value this panel belongs to.",
    },
  ],

  tokens: [
    "--c-tabs-gap-icon",
    "--c-tabs-icon-default",
    "--c-tabs-indicator-color",
    "--c-tabs-label-active",
    "--c-tabs-label-default",
    "--c-tabs-label-disabled",
    "--c-tabs-label-hover",
    "--c-tabs-padding-vertical",
    "--p-radius-full",
    "--p-space-150",
    "--p-space-200",
    "--s-color-action-neutral-active",
    "--s-color-surface-muted",
    "--t-font-heading-xxsmall-line-height",
    "--t-font-heading-xxsmall-size",
    "--t-font-heading-xxsmall-weight",
    "--t-tab-font-line-height",
    "--t-tab-font-size",
    "--t-tab-font-weight",
  ],

  guidelines: {
    dos: [
      "Match every TabsTrigger's `value` to a TabsContent value.",
      "Use Primary when an icon or underline indicator is needed; use Secondary for a segmented, pill-style switch.",
      "Trust the per-size/per-variant font and padding maps in this component rather than assuming sizes scale uniformly.",
    ],
    donts: [
      "Don't pass `icon` on a Secondary TabsTrigger expecting it to render — Figma defines no Icon=True variant for Secondary.",
      "Don't hardcode Small's vertical padding elsewhere as if it were token-backed; it's a documented, verified raw constant because no token exists at that size.",
      "Don't override the active-tab indicator or label colours via className; they come from --c-tabs-indicator-color / --c-tabs-label-active.",
    ],
  },
}
