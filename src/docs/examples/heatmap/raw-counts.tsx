import { Heatmap } from "@/components/ui/heatmap"

// Values are normalised to 0-1 against the max cell in the whole data set —
// callers always pass raw counts, never pre-normalised values.
export default function HeatmapRawCounts() {
  return (
    <Heatmap
      rows={["Team A", "Team B"]}
      columns={["Week 1", "Week 2", "Week 3"]}
      data={[
        [120, 340, 210],
        [40, 90, 60],
      ]}
    />
  )
}
