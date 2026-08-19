import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Heatmap — Prism DS anatomy (verified against prism-ds/src/components/
// Charts/Heatmap). Grid of colored cells with row + column labels, showing
// intensity via a linear color ramp from --p-color-neutral-300 (empty) to
// the chosen chart series color (full). Legend gradient rendered below.
//
// Values are normalised to 0–1 against the max in the passed data set, so
// callers pass raw counts and the component handles scaling.
//
// The intensity ramp requires numeric hex values at runtime for RGB
// interpolation — CSS variable references can't be lerped in JS. The
// SERIES_FULL_HEX map below mirrors --s-chart-series-{1-5}-regular exactly
// as of build time (verified against prism-generated.css). If the chart
// series tokens change, this map needs to change with them. Kept as a
// documented parallel palette rather than reading getComputedStyle at
// render time (fragile, SSR-hostile, forces client-only render).
// -----------------------------------------------------------------------------

const EMPTY_HEX = "#E6E9EC" // --p-color-neutral-300

const SERIES_FULL_HEX: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "#2AB5CB", // --s-chart-series-1-regular
  2: "#6B75CD", // --s-chart-series-2-regular
  3: "#D4728C", // --s-chart-series-3-regular
  4: "#00C4B4", // --s-chart-series-4-regular
  5: "#6E32AE", // --s-chart-series-5-regular
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t)
}

function intensityColor(pct: number, fullHex: string): string {
  if (pct <= 0) return EMPTY_HEX
  const empty = hexToRgb(EMPTY_HEX)
  const full = hexToRgb(fullHex)
  const r = lerp(empty.r, full.r, pct)
  const g = lerp(empty.g, full.g, pct)
  const b = lerp(empty.b, full.b, pct)
  return `rgb(${r},${g},${b})`
}

type HeatmapSeriesNumber = 1 | 2 | 3 | 4 | 5

type HeatmapProps = {
  /** Row labels (e.g. days of week). */
  rows: string[]
  /** Column labels (e.g. hours). */
  columns: string[]
  /**
   * 2D array data[rowIndex][colIndex] = intensity value. Values are
   * normalised to 0–1 against the max cell in the entire data set — pass
   * raw counts.
   */
  data: number[][]
  /** Which series color to use for the "full" end of the intensity ramp. Default 2 (blue). */
  seriesColor?: HeatmapSeriesNumber
  className?: string
}

const LABEL_COL_WIDTH = 32
const CELL_WIDTH = 32
const CELL_HEIGHT = 20
const HEADER_HEIGHT = 20

function Heatmap({ rows, columns, data, seriesColor = 2, className }: HeatmapProps) {
  const fullColor = SERIES_FULL_HEX[seriesColor]

  let max = 0
  for (const row of data) for (const value of row) if (value > max) max = value

  const gridTemplateColumns = `${LABEL_COL_WIDTH}px ${columns.map(() => `${CELL_WIDTH}px`).join(" ")}`

  return (
    <div className={cn("flex flex-col gap-[var(--p-space-100)] overflow-x-auto", className)}>
      <div
        className="grid gap-px"
        style={{ gridTemplateColumns }}
        role="grid"
        aria-label="Heatmap"
      >
        <span style={{ height: HEADER_HEIGHT }} />
        {columns.map((col) => (
          <span
            key={col}
            className="flex items-center justify-center whitespace-nowrap text-[10px] text-[var(--s-color-text-subtlest)]"
            style={{ height: HEADER_HEIGHT, width: CELL_WIDTH }}
          >
            {col}
          </span>
        ))}

        {rows.map((row, ri) => (
          <div key={row} style={{ display: "contents" }}>
            <span
              className="flex items-center whitespace-nowrap pr-[var(--p-space-050)] text-[10px] text-[var(--s-color-text-subtlest)]"
              style={{ height: CELL_HEIGHT }}
            >
              {row}
            </span>
            {columns.map((col, ci) => {
              const raw = data[ri]?.[ci] ?? 0
              const pct = max > 0 ? raw / max : 0
              const bg = intensityColor(pct, fullColor)
              return (
                <div
                  key={`${row}-${col}`}
                  role="gridcell"
                  aria-label={`${row} ${col}: ${raw}`}
                  title={`${row} ${col}: ${raw}`}
                  className="rounded-[3px]"
                  style={{ width: CELL_WIDTH, height: CELL_HEIGHT, background: bg }}
                />
              )
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-[var(--p-space-100)] text-[10px] text-[var(--s-color-text-subtlest)]">
        <span>Low</span>
        <div
          className="h-2 max-w-[120px] flex-1 rounded-[var(--p-radius-full)]"
          style={{ background: `linear-gradient(to right, ${EMPTY_HEX}, ${fullColor})` }}
        />
        <span>High</span>
      </div>
    </div>
  )
}

export { Heatmap }
export type { HeatmapProps, HeatmapSeriesNumber }
