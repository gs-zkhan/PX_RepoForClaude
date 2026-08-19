import type { ComponentDoc } from "@/docs/types"

// Documents the real LineChart API. Built on Recharts (installed this
// session, user confirmed).
export const lineChartDoc: ComponentDoc = {
  slug: "line-chart",
  name: "Line Chart",
  status: "stable",
  description: "A time-series trend chart with up to 6 series, with an optional area fill.",
  figmaNodeId: "4980:249",
  sourcePath: "src/components/ui/line-chart.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Pass `data` as an array of records, `categoryKey` for the x-axis field, and `series` describing which data keys to plot. The grid renders 4 horizontal lines only (no vertical grid) at the semantic --s-color-line-default token, mapped from Figma's neutral/300 @ 80% opacity since no dedicated chart-grid token exists. Lines are 2px, round cap, with an 8px dot and 5px white inner circle at each data point.",
      exampleId: "line-chart/default",
    },
    {
      id: "multi-series",
      title: "Multiple series",
      body:
        "Up to 6 series (Figma's own cap — beyond 6, lines become indistinguishable). Series colours are always assigned in order — chart/series/1, /2, /3… — never skipped, so removing a series from the middle of the array shifts every later series' colour. Multi-series charts always need a legend per Figma's own rule; LineChart does not render one itself, leaving it a composition-level concern for the caller — the same pattern used everywhere except SegmentedBar, which is the one exception Figma mandates an inline legend for.",
      exampleId: "line-chart/multi-series",
    },
    {
      id: "area",
      title: "Area fill",
      body:
        "`area` layers the same series colour at 25% fill opacity under the line, with no stroke on the fill path — Recharts' Area (fill, no stroke) and Line (2px stroke) are drawn together so the Line traces the visible edge on top of the Area's fill.",
      exampleId: "line-chart/area",
    },
    {
      id: "height",
      title: "Height",
      body: "`height` sets the chart's pixel height; width always fills its container via ResponsiveContainer.",
      exampleId: "line-chart/height",
    },
  ],

  props: [
    {
      name: "data",
      type: "Array<Record<string, string | number>>",
      required: true,
      description: "The dataset, one record per x-axis category.",
    },
    {
      name: "categoryKey",
      type: "string",
      required: true,
      description: "The data key used for the x-axis category (e.g. a date or month field).",
    },
    {
      name: "series",
      type: "LineChartSeriesDef[]",
      required: true,
      description: "Which data keys to plot. Each is `{ key, label, series }`, where `series` (1-6) picks the chart/series/* colour.",
    },
    {
      name: "area",
      type: "boolean",
      defaultValue: "false",
      description: "Area fill under the line at 25% opacity. Default false (plain line).",
    },
    {
      name: "height",
      type: "number",
      defaultValue: "240",
      description: "Chart height in pixels.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the outer container.",
    },
  ],

  tokens: [
    "--p-radius-100",
    "--s-chart-series-1-regular",
    "--s-chart-series-2-regular",
    "--s-chart-series-3-regular",
    "--s-chart-series-4-regular",
    "--s-chart-series-5-regular",
    "--s-chart-series-6-regular",
    "--s-color-line-default",
    "--s-color-surface-default",
    "--s-color-text-subtlest",
  ],

  guidelines: {
    dos: [
      "Cap series at 6 — beyond that Figma's own spec says lines become indistinguishable (the component logs a dev warning past 6).",
      "Assign series numbers in order (1, 2, 3…) and keep them stable if a series is later removed, rather than renumbering the remaining series.",
      "Compose a legend alongside the chart whenever more than one series is plotted — LineChart does not render one itself.",
      "Reach for BarChart instead when comparing categories with no temporal relationship.",
    ],
    donts: [
      "Don't render more than 6 series without expecting a dev-time console warning — treat it as a real signal to switch chart types or split the view.",
      "Don't invent a new chart-grid token — --s-color-line-default is the deliberate, documented semantic stand-in since no dedicated one exists.",
      "Don't render a chart-owned legend inside LineChart itself — SegmentedBar is the sole documented exception to \"legend is a caller concern\".",
    ],
  },
}
