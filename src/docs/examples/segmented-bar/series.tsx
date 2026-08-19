import { SegmentedBar } from "@/components/ui/segmented-bar"

// Series colors for a weightage distribution across up to 5 metrics — no
// inherent healthy/warning/at-risk meaning, unlike the status palette.
export default function SegmentedBarSeries() {
  return (
    <SegmentedBar
      segments={[
        { label: "Usage", value: 40, color: { series: 1 } },
        { label: "Adoption", value: 25, color: { series: 2 } },
        { label: "Engagement", value: 20, color: { series: 3 } },
        { label: "Support", value: 15, color: { series: 4 } },
      ]}
    />
  )
}
