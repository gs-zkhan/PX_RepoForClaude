import type { ComponentDoc } from "@/docs/types"

export const summaryStatDoc: ComponentDoc = {
  slug: "summary-stat",
  name: "SummaryStat",
  status: "stable",
  description:
    "A KPI/stat tile showing a value and label, optionally as a clickable filter or with a trend and description. Compose several inside StatsRow.",
  sourcePath: "src/components/ui/summary-stat.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "With no `trend` or `description`, SummaryStat renders the Compact layout: value + label at a fixed 88px height, used for dashboard stat grids. `type` defaults to non-clickable, rendering a plain <div>.",
      exampleId: "summary-stat/default",
    },
    {
      id: "stats-row",
      title: "In a StatsRow",
      body:
        "StatsRow lays out multiple SummaryStat tiles in a horizontal strip with consistent gap. Use `placement=\"left\"` or `\"right\"` on each stat to enable a border, so the tiles read as separated cards; `placement=\"center\"` (the default) omits the border for a borderless KPI strip.",
      exampleId: "summary-stat/stats-row",
    },
    {
      id: "metric-with-trend",
      title: "Metric layout (trend / description)",
      body:
        "Passing `trend` or `description` switches SummaryStat into the Metric layout: label on top, a larger value, an optional trend row (up/down arrow + delta + comparator), and an optional description line. Height becomes auto and the card border is dropped. Used for KPI strips on list pages.",
      exampleId: "summary-stat/metric-with-trend",
    },
    {
      id: "clickable-selected",
      title: "Clickable and selected",
      body:
        "`type=\"clickable\"` renders a <button> and supports `selected`, which applies a selection ring (--s-color-action-primary-default border) and --s-color-surface-selected fill. Use this for stat tiles that act as filters for a list below them. `type=\"set-now\"` is a separate interactive variant for the \"Set now\" CTA card pattern and does not support `selected`.",
      exampleId: "summary-stat/clickable-selected",
    },
  ],

  props: [
    {
      name: "value",
      type: "React.ReactNode",
      required: true,
      description: "The stat's headline value.",
    },
    {
      name: "label",
      type: "string",
      required: true,
      description: "Label describing the value.",
    },
    {
      name: "type",
      type: '"non-clickable" | "clickable" | "set-now"',
      defaultValue: '"non-clickable"',
      description: "Controls interactivity. Non-clickable renders a div; clickable and set-now render buttons.",
    },
    {
      name: "placement",
      type: '"center" | "left" | "right"',
      defaultValue: '"center"',
      description: "Text alignment for the Compact layout. left/right also enable a border, ignored once the Metric layout is active.",
    },
    {
      name: "selected",
      type: "boolean",
      defaultValue: "false",
      description: "Selection state. Only applies to type=\"clickable\".",
    },
    {
      name: "onClick",
      type: "() => void",
      description: "Click handler for clickable/set-now types.",
    },
    {
      name: "trend",
      type: "SummaryStatTrend",
      description:
        '`{ direction: "up" | "down", delta: string, comparator?: string }`. Presence triggers the Metric layout.',
    },
    {
      name: "description",
      type: "string",
      description: "Supporting text shown below the trend row. Presence triggers the Metric layout.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only.",
    },
    {
      name: "children (StatsRow)",
      type: "React.ReactNode",
      required: true,
      description: "One or more SummaryStat elements.",
    },
    {
      name: "className (StatsRow)",
      type: "string",
      description: "Placement only, applied to the row's flex container.",
    },
  ],

  tokens: [
    "--p-radius-150",
    "--p-space-025",
    "--p-space-050",
    "--p-space-200",
    "--p-space-300",
    "--s-color-action-primary-default",
    "--s-color-line-default",
    "--s-color-status-danger-default",
    "--s-color-status-success-default",
    "--s-color-surface-default",
    "--s-color-surface-muted",
    "--s-color-surface-selected",
    "--s-color-text-default",
    "--s-color-text-subtle",
    "--t-font-heading-large-line-height",
    "--t-font-heading-large-size",
    "--t-font-heading-large-weight",
    "--t-font-label-small-line-height",
    "--t-font-label-small-size",
  ],

  guidelines: {
    dos: [
      "Compose multiple SummaryStat tiles inside StatsRow rather than a hand-rolled flex row.",
      "Use placement=\"left\" or \"right\" when tiles need to read as visually separated cards.",
      "Pass trend and/or description together to get the Metric layout for KPI strips.",
      "Reserve type=\"clickable\" + selected for stat tiles that act as a filter toggle.",
    ],
    donts: [
      "Don't pass `selected` to a non-clickable or set-now stat — only clickable supports it.",
      "Don't hardcode the Compact value font size elsewhere; the 26px/40lh pairing here is a documented, verified raw constant (matches the Prism reference and the pattern used in Charts) rather than a fabricated value — don't reuse it as a precedent for skipping tokens elsewhere.",
      "Don't add a card border to the Metric layout; Metric is always borderless regardless of `placement`.",
    ],
  },
}
