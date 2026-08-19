import { ComposableMap, Geographies, Geography } from "react-simple-maps"

import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// WorldMap — Prism DS anatomy (verified against prism-ds/src/components/
// Charts/WorldMap). Geographic distribution chart with country shading;
// active countries fill with --s-chart-series-1-regular, inactive with a
// neutral surface.
//
// Built on react-simple-maps (installed this session with --legacy-peer-
// deps — the library declares React 16-18 peer support but works fine
// with React 19 since its rendering is D3-based SVG, not React-19-
// specific APIs). Country boundaries load at first render from a CDN
// TopoJSON (world-atlas 110m, ISO 3166-1 numeric IDs — e.g. '840' for
// USA, '826' for GBR, '276' for DEU). Component is client-render only
// due to the fetch.
//
// Because the intensity ramp requires hex values at runtime for hover
// interpolation, the active/inactive/hover colors are mirrored from the
// token catalog as documented parallel constants — same pattern as
// Heatmap. Update in sync if the chart tokens change.
// -----------------------------------------------------------------------------

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const ACTIVE_COLOR = "#2AB5CB" // --s-chart-series-1-regular
const ACTIVE_HOVER = "#1FA0B4" // hand-computed darker teal for hover
const INACTIVE_COLOR = "#E6E9EC" // --p-color-neutral-300 (same as heatmap empty)
const INACTIVE_HOVER = "#D5D9DE" // --s-color-line-default, one shade darker
const STROKE_COLOR = "#FFFFFF"

type WorldMapProps = {
  /**
   * ISO 3166-1 numeric country codes (as strings) that should be
   * highlighted. Examples: '840' = USA, '826' = GBR, '276' = DEU,
   * '250' = FRA, '036' = AUS, '124' = CAN, '356' = IND, '076' = BRA,
   * '392' = JPN, '702' = SGP.
   */
  activeCountryCodes?: string[]
  width?: number
  height?: number
  className?: string
}

function WorldMap({
  activeCountryCodes = [],
  width = 850,
  height = 320,
  className,
}: WorldMapProps) {
  const activeSet = new Set(activeCountryCodes.map((c) => String(c)))

  return (
    <div className={cn("relative", className)} style={{ width, height }}>
      <ComposableMap
        width={width}
        height={height}
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 140, center: [0, 10] }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: Array<{ rsmKey: string; id?: string | number }> }) =>
            geographies.map((geo) => {
              const isActive = activeSet.has(String(geo.id ?? ""))
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
                  stroke={STROKE_COLOR}
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: {
                      fill: isActive ? ACTIVE_HOVER : INACTIVE_HOVER,
                      outline: "none",
                    },
                    pressed: { outline: "none" },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  )
}

export { WorldMap }
export type { WorldMapProps }
