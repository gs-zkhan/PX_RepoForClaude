import type { ComponentDoc } from "@/docs/types"

export const segmentedBarDoc: ComponentDoc = {
  slug: "segmented-bar",
  name: "Segmented Bar",
  status: "stable",
  description:
    "A full-width bar divided into abutting colored segments showing a distribution, always paired with a dot-legend.",
  figmaNodeId: "4979:159",
  sourcePath: "src/components/ui/segmented-bar.tsx",

  sections: [
    {
      id: "default",
      title: "Status distribution",
      body:
        "SegmentedBar renders a fixed 24px-tall bar with segments sized proportionally to their `value`, plus a required dot-legend below — Figma's own rule is that color alone does not communicate which segment is which, so the legend is always rendered, not an optional add-on. Use status colors for a healthy/warning/at-risk split, e.g. a Product Score distribution.",
      exampleId: "segmented-bar/default",
    },
    {
      id: "series",
      title: "Series distribution",
      body:
        "Use series colors (1-5) for weighted/equal distributions with no health meaning, such as a Weightage Distribution across up to 5 metrics — the same series palette convention MetricBar uses.",
      exampleId: "segmented-bar/series",
    },
  ],

  props: [
    {
      name: "segments",
      type: "SegmentedBarSegment[]",
      required: true,
      description:
        "Array of { label, value, color }. Segment widths are proportional to value / sum(all values). `color` is { series: 1-5 } or { status: \"atrisk\" | \"warning\" | \"healthy\" }.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the outer wrapper around both the bar and its legend.",
    },
  ],

  tokens: [
    "--p-radius-100",
    "--p-space-050",
    "--p-space-100",
    "--p-space-200",
    "--s-chart-series-1-regular",
    "--s-chart-series-2-regular",
    "--s-chart-series-3-regular",
    "--s-chart-series-4-regular",
    "--s-chart-series-5-regular",
    "--s-chart-status-atrisk-light",
    "--s-chart-status-healthy-light",
    "--s-chart-status-warning-light",
    "--s-color-text-subtle",
    "--t-font-label-small-line-height",
    "--t-font-label-small-size",
  ],

  guidelines: {
    dos: [
      "Use SegmentedBar for a distribution across a fixed set of categories, e.g. at-risk/neutral/healthy account split.",
      "Let the component render its own dot-legend — do not build a separate legend for it.",
      "Use the `-light` status tone (already applied internally) to distinguish this from MetricBar's `-regular` status fill.",
      "Keep segment counts small (up to ~5) so labels remain legible in the legend.",
    ],
    donts: [
      "Don't use SegmentedBar for progress or loading — use MetricBar for a single-value progress indicator instead.",
      "Don't pass a mix of series and status colors across segments in the same bar.",
      "Don't hide or replace the generated legend; per Figma's rule color alone is not sufficient identification.",
      "Don't rely on rounded corners appearing on middle segments — only the first and last segment's outer corners are rounded.",
    ],
  },
}
