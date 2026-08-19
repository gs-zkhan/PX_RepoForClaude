import { Heatmap } from "@/components/ui/heatmap"

const ROWS = ["Mon", "Tue", "Wed"]
const COLUMNS = ["9am", "12pm", "3pm"]
const DATA = [
  [2, 8, 4],
  [5, 12, 9],
  [1, 6, 3],
]

// `seriesColor` picks which chart/series/* colour anchors the "full" end of
// the intensity ramp — the "empty" end is always neutral/300.
export default function HeatmapSeriesColor() {
  return (
    <div className="flex flex-col gap-[var(--p-space-300)]">
      <Heatmap rows={ROWS} columns={COLUMNS} data={DATA} seriesColor={1} />
      <Heatmap rows={ROWS} columns={COLUMNS} data={DATA} seriesColor={3} />
    </div>
  )
}
