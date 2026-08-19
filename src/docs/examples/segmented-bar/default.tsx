import { SegmentedBar } from "@/components/ui/segmented-bar"

export default function SegmentedBarDefault() {
  return (
    <SegmentedBar
      segments={[
        { label: "At risk", value: 18, color: { status: "atrisk" } },
        { label: "Warning", value: 27, color: { status: "warning" } },
        { label: "Healthy", value: 55, color: { status: "healthy" } },
      ]}
    />
  )
}
