import type { ComponentDoc } from "@/docs/types"

export const barChartDoc: ComponentDoc = {
  slug: "bar-chart",
  name: "Bar Chart",
  status: "stable",
  description:
    "A categorical comparison chart built on Recharts, styled entirely with Prism chart tokens.",
  figmaNodeId: "4981:196",
  sourcePath: "src/components/ui/bar-chart.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Vertical orientation (default) is for time-ordered or naturally-ordered categories. Each series maps to a `key` in `data`, a `label` for the legend/tooltip, and a `color` — pass `{ series: 1-5 }` to use one of the five chart-series tokens in order. The value axis always starts at 0 and never auto-truncates.",
      exampleId: "bar-chart/default",
    },
    {
      id: "horizontal",
      title: "Horizontal",
      body:
        "Set `orientation=\"horizontal\"` for ranked lists with long category labels. Never rotate a vertical chart with CSS to fake this — the orientation prop swaps the axis roles and moves the bar radius to the leading (right) corners.",
      exampleId: "bar-chart/horizontal",
    },
    {
      id: "status-colors",
      title: "Per-bar status colors",
      body:
        "Pass `color: { statusKey: \"fieldName\" }` to color each bar independently from that row's own value in `data[fieldName]` (healthy/warning/atrisk). This is distinct from `color: { status: \"healthy\" }`, which applies one fixed status color to every bar in the series — don't conflate the two.",
      exampleId: "bar-chart/status-colors",
    },
    {
      id: "multi-series",
      title: "Multiple series",
      body:
        "Pass multiple entries in `series` to render grouped bars. Cap at 3 series for readability — passing more logs a dev-only console warning (not a hard block) suggesting a Line Chart instead.",
      exampleId: "bar-chart/multi-series",
    },
  ],

  props: [
    {
      name: "orientation",
      type: '"vertical" | "horizontal"',
      defaultValue: '"vertical"',
      description: "Bar direction and which axis is categorical vs. numeric. See Horizontal.",
    },
    {
      name: "data",
      type: "Array<Record<string, string | number>>",
      required: true,
      description: "Row data. Each row must contain the categoryKey and every series key.",
    },
    {
      name: "categoryKey",
      type: "string",
      required: true,
      description: "Field in each data row used as the category axis.",
    },
    {
      name: "series",
      type: "BarChartSeriesDef[]",
      required: true,
      description: "One entry per bar series: { key, label, color }. color is { series: 1-5 } | { status: \"healthy\"|\"warning\"|\"atrisk\" } | { statusKey: string }.",
    },
    {
      name: "height",
      type: "number",
      defaultValue: "240",
      description: "Chart height in pixels. Width always fills the container.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the chart's outer container.",
    },
  ],

  tokens: [
    "--p-radius-100",
    "--s-chart-series-1-regular",
    "--s-chart-series-2-regular",
    "--s-chart-series-3-regular",
    "--s-chart-series-4-regular",
    "--s-chart-series-5-regular",
    "--s-chart-status-atrisk",
    "--s-chart-status-healthy",
    "--s-chart-status-warning",
    "--s-color-line-default",
    "--s-color-surface-default",
    "--s-color-surface-muted",
    "--s-color-text-subtlest",
  ],

  guidelines: {
    dos: [
      "Use vertical orientation for time-ordered or naturally-ordered categories.",
      "Switch to horizontal for ranked lists with long labels rather than rotating a vertical chart.",
      "Use statusKey to color bars by each row's own health value; use status for one uniform color across the whole series.",
      "Keep grouped bars to 3 series or fewer; move to a Line Chart beyond that.",
    ],
    donts: [
      "Don't truncate the value axis — it's fixed to start at 0 by design, per Figma's own rule.",
      "Don't rotate a vertical chart with CSS transforms to simulate horizontal; use the orientation prop.",
      "Don't conflate `status` (one fixed color for the series) with `statusKey` (per-bar color from row data).",
      "Don't pass more than 5 series colors' worth of distinct series without expecting them to repeat — only 5 series tokens exist.",
    ],
  },
}
