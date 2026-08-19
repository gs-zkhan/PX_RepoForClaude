import type { ComponentDoc } from "@/docs/types"

// Documents the real GaugeChart API. Built on Recharts (installed this
// session, user confirmed) — a semicircular Pie/Pie composition, not a
// bespoke SVG arc.
export const gaugeChartDoc: ComponentDoc = {
  slug: "gauge-chart",
  name: "Gauge Chart",
  status: "stable",
  description:
    "A semicircular single-value score indicator (NPS, CES, Rating, Boolean performance) — not for distributions.",
  figmaNodeId: "4983:185",
  sourcePath: "src/components/ui/gauge-chart.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Renders a fixed 180° arc, 16px stroke, round cap — geometry Figma marks as \"don't change\". `value` is the 0-1 fraction of the arc to fill; `label` is the score shown centered below the arc, always visible per Figma's own \"always show the value\" rule.",
      exampleId: "gauge-chart/default",
    },
    {
      id: "status",
      title: "Status colour",
      body:
        "`status` selects the fill colour from chart/status/* (healthy, warning, atrisk). A gauge always uses chart/status/* for its fill, never chart/series/* — Figma's own rule, since a gauge represents one score's health, not one series among several.",
      exampleId: "gauge-chart/status",
    },
    {
      id: "size",
      title: "Size",
      body:
        "`size` sets the outer width in pixels; height is derived as `size * 0.65` to preserve the semicircle's aspect ratio. There is no fixed size prop union — pass any pixel value the layout needs.",
      exampleId: "gauge-chart/size",
    },
    {
      id: "nps",
      title: "Value-mapping is caller-owned",
      body:
        "GaugeChart only renders a pre-computed `value` (0-1) and `status` — it does not know which scoring range the caller is using. NPS, CES, Rating and Boolean each need their own formula to turn a raw score into `value` and `status`; this example shows the NPS mapping.",
      exampleId: "gauge-chart/nps",
    },
  ],

  props: [
    {
      name: "value",
      type: "number",
      required: true,
      description:
        "0-1, the fraction of the 180° arc to fill. Caller computes this from its own value-mapping formula (e.g. NPS: (score + 100) / 200).",
    },
    {
      name: "status",
      type: '"healthy" | "warning" | "atrisk"',
      required: true,
      description: "Selects the fill colour from chart/status/*.",
    },
    {
      name: "label",
      type: "string",
      required: true,
      description: "Numeric score shown centered below the arc (Figma's own \"always show the value\" rule).",
    },
    {
      name: "size",
      type: "number",
      defaultValue: "200",
      description: "Outer width in pixels. Height is derived as size * 0.65.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the outer inline-flex column.",
    },
  ],

  tokens: [
    "--s-chart-status-atrisk",
    "--s-chart-status-healthy",
    "--s-chart-status-warning",
    "--s-color-surface-sunken",
    "--s-color-text-default",
  ],

  guidelines: {
    dos: [
      "Always pass `label` with the visible score — Figma's own rule is that the value is always shown, never hidden.",
      "Compute `value` and `status` from the caller's own scoring formula (NPS, CES, Rating, Boolean) before passing them in.",
      "Use chart/status/* semantics (healthy/warning/atrisk) to choose `status`, consistent with every other status-driven chart in the system.",
      "Reach for DonutChart or SegmentedBar for distributions — GaugeChart is single-value only.",
    ],
    donts: [
      "Don't change the 180° arc, 16px stroke width, or round cap — Figma marks this geometry as fixed.",
      "Don't use chart/series/* colours on a gauge — only chart/status/* is correct here.",
      "Don't render a gauge without a visible label under the arc.",
    ],
  },
}
