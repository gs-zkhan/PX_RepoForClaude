import { Heatmap } from "@/components/ui/heatmap"

const ROWS = ["Mon", "Tue", "Wed", "Thu", "Fri"]
const COLUMNS = ["9am", "12pm", "3pm", "6pm"]
const DATA = [
  [2, 8, 4, 1],
  [5, 12, 9, 3],
  [1, 6, 3, 0],
  [7, 15, 10, 4],
  [3, 9, 6, 2],
]

export default function HeatmapDefault() {
  return <Heatmap rows={ROWS} columns={COLUMNS} data={DATA} />
}
