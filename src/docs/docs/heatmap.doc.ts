import type { ComponentDoc } from "@/docs/types"

// Documents the real Heatmap API. Its header comment verifies anatomy against
// prism-ds/src/components/Charts/Heatmap but does not cite a Figma node id in
// this repo's Prism V1 - ShadCN file, so figmaNodeId is intentionally omitted
// rather than guessed.
export const heatmapDoc: ComponentDoc = {
  slug: "heatmap",
  name: "Heatmap",
  status: "stable",
  description:
    "A grid of coloured cells with row and column labels, showing intensity via a linear colour ramp with a legend gradient.",
  sourcePath: "src/components/ui/heatmap.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Pass row labels, column labels, and a 2D `data[rowIndex][colIndex]` array of raw counts. Values are normalised to 0-1 against the max cell in the entire data set, so the component handles scaling — never pre-normalise before passing data in. A legend gradient renders below the grid from Low to High.",
      exampleId: "heatmap/default",
    },
    {
      id: "series-color",
      title: "Series colour",
      body:
        "`seriesColor` (1-5) selects which chart/series/* colour anchors the \"full\" end of the intensity ramp. The \"empty\" end is always neutral/300, regardless of series colour, so every heatmap on a page shares the same empty-cell colour.",
      exampleId: "heatmap/series-color",
    },
    {
      id: "raw-counts",
      title: "Raw counts, not percentages",
      body:
        "Data is always raw counts. The component computes the max across the whole data set at render time and scales every cell against it — passing already-normalised 0-1 values would double-scale and understate the true max cell.",
      exampleId: "heatmap/raw-counts",
    },
  ],

  props: [
    {
      name: "rows",
      type: "string[]",
      required: true,
      description: "Row labels (e.g. days of week).",
    },
    {
      name: "columns",
      type: "string[]",
      required: true,
      description: "Column labels (e.g. hours).",
    },
    {
      name: "data",
      type: "number[][]",
      required: true,
      description:
        "2D array data[rowIndex][colIndex] = intensity value. Values are normalised to 0-1 against the max cell in the entire data set — pass raw counts.",
    },
    {
      name: "seriesColor",
      type: "1 | 2 | 3 | 4 | 5",
      defaultValue: "2",
      description: "Which series colour to use for the \"full\" end of the intensity ramp.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the outer flex column.",
    },
  ],

  tokens: [
    "--p-color-neutral-300",
    "--p-radius-full",
    "--p-space-050",
    "--p-space-100",
    "--s-chart-series-1-regular",
    "--s-chart-series-2-regular",
    "--s-chart-series-3-regular",
    "--s-chart-series-4-regular",
    "--s-chart-series-5-regular",
    "--s-color-text-subtlest",
  ],

  guidelines: {
    dos: [
      "Always pass raw counts in `data` and let the component normalise — never pre-scale to 0-1 yourself.",
      "Pick a `seriesColor` that doesn't collide with another chart's series colour already used on the same screen.",
      "Rely on the built-in legend gradient rather than adding a separate one.",
    ],
    donts: [
      "Don't call getComputedStyle to read the ramp colours at render time — the SERIES_FULL_HEX map is a deliberate, documented parallel palette kept in sync with prism-generated.css by hand, precisely to avoid a fragile, SSR-hostile runtime read.",
      "Don't pass percentages or already-normalised values in `data` — the component's own max-scaling logic expects raw counts.",
      "Don't hand-roll a grid with Tailwind background classes for intensity — this component owns the RGB interpolation and empty-to-full ramp.",
    ],
  },
}
