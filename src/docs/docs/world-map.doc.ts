import type { ComponentDoc } from "@/docs/types"

// Documents the REAL WorldMap API in this repo, built on react-simple-maps.
// Client-render only (it fetches TopoJSON at first render), so it cannot be
// used in a server-only rendering context.
export const worldMapDoc: ComponentDoc = {
  slug: "world-map",
  name: "World Map",
  status: "stable",
  description: "A geographic distribution chart that shades countries to show where accounts, users or events are concentrated.",
  sourcePath: "src/components/ui/world-map.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Pass `activeCountryCodes` as ISO 3166-1 numeric codes (as strings) — e.g. '840' for USA, '826' for GBR, '276' for DEU, '250' for FRA, '392' for JPN. Active countries fill with --s-chart-series-1-regular; every other country renders in a neutral inactive surface. Country boundaries load at first render from a CDN TopoJSON (world-atlas 110m), so this component is client-render only.",
      exampleId: "world-map/default",
    },
    {
      id: "empty",
      title: "No active countries",
      body:
        "With `activeCountryCodes` omitted or empty, every country renders in the neutral inactive colour — the base map with no highlighted data.",
      exampleId: "world-map/empty",
    },
    {
      id: "sized",
      title: "Custom dimensions",
      body:
        "`width` and `height` size the rendered SVG directly (defaults 850x320). Use smaller dimensions for a dashboard tile and the default or larger for a full report page.",
      exampleId: "world-map/sized",
    },
  ],

  props: [
    {
      name: "activeCountryCodes",
      type: "string[]",
      defaultValue: "[]",
      description: "ISO 3166-1 numeric country codes (as strings) to highlight, e.g. '840' = USA, '826' = GBR, '276' = DEU.",
    },
    {
      name: "width",
      type: "number",
      defaultValue: "850",
      description: "Rendered SVG width in pixels.",
    },
    {
      name: "height",
      type: "number",
      defaultValue: "320",
      description: "Rendered SVG height in pixels.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only on the outer wrapper div. Do not use it to change fill colours — those are mirrored constants tied to chart tokens.",
    },
  ],

  tokens: [
    "--p-color-neutral-300",
    "--s-chart-series-1-regular",
    "--s-color-line-default",
  ],

  guidelines: {
    dos: [
      "Pass country codes as ISO 3166-1 numeric strings, not ISO alpha-2/3 codes.",
      "Treat this component as client-render only — it fetches TopoJSON from a CDN on first render.",
      "Update the mirrored ACTIVE_COLOR/INACTIVE_COLOR constants in world-map.tsx in sync if the underlying chart tokens change, the same pattern used for Heatmap.",
    ],
    donts: [
      "Don't pass alpha-2/alpha-3 country codes (e.g. 'US', 'USA') — the underlying TopoJSON keys on ISO 3166-1 numeric IDs.",
      "Don't expect this component to render server-side; it depends on a runtime fetch for map geometry.",
      "Don't restyle active/inactive fill via className — they are hard-coded hex mirrors of chart tokens, not classes.",
    ],
  },
}
