import { GaugeChart } from "@/components/ui/gauge-chart"

// GaugeChart only renders a pre-computed `value` (0-1) and `status` — the
// caller owns the range-specific value-mapping formula. This shows the NPS
// mapping: (score + 100) / 200, for a score of 40.
export default function GaugeChartNps() {
  const npsScore = 40
  const value = (npsScore + 100) / 200

  return <GaugeChart value={value} status="healthy" label={String(npsScore)} />
}
