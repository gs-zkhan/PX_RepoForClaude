import type { ComponentDoc } from "@/docs/types"

export const metricBarDoc: ComponentDoc = {
  slug: "metric-bar",
  name: "Metric Bar",
  status: "stable",
  description:
    "A horizontal progress-style bar for a single quantified metric, with a knob marking the current value.",
  figmaNodeId: "4978:300",
  sourcePath: "src/components/ui/metric-bar.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "MetricBar renders an 8px-tall fill within a 16px track and a 20px knob centered on the fill's trailing edge. It takes `label` only for the accessible name — the caller is responsible for rendering the visible numeric value alongside it, per Figma's own rule that this component alone is not accessible.",
      exampleId: "metric-bar/default",
    },
    {
      id: "series",
      title: "Series colors",
      body:
        "Pass `color={{ series: 1-5 }}` for metrics with no inherent healthy/warning/at-risk meaning, such as Health KPI weightage sliders or a Product Score distribution. Series colors come from the shared chart palette, the same convention SegmentedBar uses.",
      exampleId: "metric-bar/series",
    },
    {
      id: "status",
      title: "Status colors",
      body:
        "Pass `color={{ status: \"healthy\" | \"warning\" | \"atrisk\" }}` for metrics that carry a health meaning, such as an account's Product Score. Never use a UI action/status token here — only the chart status palette, per Figma's own token rule.",
      exampleId: "metric-bar/status",
    },
  ],

  props: [
    {
      name: "value",
      type: "number",
      required: true,
      description: "0-100. Values outside this range are clamped.",
    },
    {
      name: "color",
      type: "{ series: 1 | 2 | 3 | 4 | 5 } | { status: \"healthy\" | \"warning\" | \"atrisk\" }",
      required: true,
      description:
        "Chart series or chart status color, never a UI action/status token. Determines both the fill and the accompanying dot-legend color where used.",
    },
    {
      name: "label",
      type: "string",
      required: true,
      description:
        "Accessible label describing what's being measured, e.g. \"Product Score\". Not rendered visibly — pair with a caller-rendered numeric value.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, e.g. sizing the bar's width within a layout.",
    },
  ],

  tokens: [
    "--e-shadow-100",
    "--p-radius-100",
    "--s-chart-metric-track",
    "--s-chart-series-1-regular",
    "--s-chart-series-2-regular",
    "--s-chart-series-3-regular",
    "--s-chart-series-4-regular",
    "--s-chart-series-5-regular",
    "--s-chart-status-atrisk",
    "--s-chart-status-healthy",
    "--s-chart-status-warning",
  ],

  guidelines: {
    dos: [
      "Always render a visible numeric value next to the bar — MetricBar's `label` prop is accessible-name only, not a visible caption.",
      "Use `status` colors only when the metric has a healthy/warning/at-risk meaning, e.g. Product Score.",
      "Use `series` colors for weighting/distribution metrics with no health meaning.",
      "Size the bar by setting a width on its container or via `className`; the track itself is resizable.",
    ],
    donts: [
      "Don't use MetricBar for a binary on/off state — use a Switch instead, per Figma's own rule.",
      "Don't reach for a UI action/status token for the fill color; only chart series/status tokens are correct here.",
      "Don't ship MetricBar without a visible value label — it fails Figma's own accessibility Dos/Don'ts.",
      "Don't measure the knob offset with a ResizeObserver or JS — the component already expresses it as a `calc()` percentage.",
    ],
  },
}
