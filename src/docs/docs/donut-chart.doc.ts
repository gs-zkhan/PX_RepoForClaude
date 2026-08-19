import type { ComponentDoc } from "@/docs/types"

// Documents the REAL DonutChart API. Built on Recharts. Part-to-whole only —
// not for time series (use LineChart instead).
export const donutChartDoc: ComponentDoc = {
  slug: "donut-chart",
  name: "Donut Chart",
  status: "stable",
  description: "A part-to-whole donut, max 4 segments, with a required legend and an optional centre label.",
  figmaNodeId: "4983:160",
  sourcePath: "src/components/ui/donut-chart.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "\"status\" segments (each tagged `status: \"healthy\" | \"warning\" | \"atrisk\"`) always render in that fixed order, largest to smallest — never reversed. A legend renders automatically below the chart; there is no prop to hide it.",
      exampleId: "donut-chart/default",
    },
    {
      id: "series-colors",
      title: "Series colors",
      body:
        "\"series\" segments (tagged `series: 1 | 2 | 3 | 4`) use the neutral chart/series/1-4 palette instead of the status colors, for breakdowns that aren't a healthy/at-risk classification. Order segments largest to smallest to match the palette's intended visual weight.",
      exampleId: "donut-chart/series-colors",
    },
    {
      id: "center-label",
      title: "Center label",
      body: "`centerLabel` and `centerSubLabel` render inside the donut's hole — typically a total count and its unit.",
      exampleId: "donut-chart/center-label",
    },
    {
      id: "size",
      title: "Size",
      body: "`size` sets the chart's pixel width and height (default 200). The legend wraps independently below it at any size.",
      exampleId: "donut-chart/size",
    },
  ],

  props: [
    {
      name: "segments",
      type: "DonutChartSegment[]",
      required: true,
      description: "Up to 4 segments — Figma's own hard limit. Group any remainder into an \"Other\" segment rather than passing a 5th.",
    },
    {
      name: "centerLabel",
      type: "string",
      description: "Primary text rendered inside the donut's hole.",
    },
    {
      name: "centerSubLabel",
      type: "string",
      description: "Secondary text rendered below `centerLabel` inside the hole.",
    },
    {
      name: "size",
      type: "number",
      defaultValue: "200",
      description: "Pixel width and height of the chart.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the outer wrapper.",
    },
  ],

  tokens: [
    "--p-space-050",
    "--p-space-200",
    "--s-chart-series-1-regular",
    "--s-chart-series-2-regular",
    "--s-chart-series-3-regular",
    "--s-chart-series-4-regular",
    "--s-chart-status-atrisk",
    "--s-chart-status-healthy",
    "--s-chart-status-warning",
    "--s-color-surface-sunken",
    "--s-color-text-default",
    "--s-color-text-subtle",
    "--s-color-text-subtlest",
    "--t-font-label-small-line-height",
    "--t-font-label-small-size",
  ],

  guidelines: {
    dos: [
      "Cap segments at 4; group any remainder into an \"Other\" segment coloured with the neutral/300 -> `--s-color-surface-sunken` equivalent.",
      "Keep \"status\" segments in the fixed healthy -> warning -> atrisk order, largest to smallest.",
      "Use DonutChart for part-to-whole composition only.",
    ],
    donts: [
      "Don't use DonutChart for time series — use LineChart instead.",
      "Don't reverse or reorder status segments; the order is fixed regardless of value.",
      "Don't hide the legend; Figma requires one on every donut instance and there is no prop to suppress it.",
      "Don't mix `status` and `series` segment shapes in the same chart — pick one classification per chart.",
    ],
  },
}
