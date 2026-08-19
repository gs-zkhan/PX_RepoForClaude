import { ViewSelector } from "@/components/ui/view-selector"

// Large binds icon/size/024 for its chevron; Medium and Small bind
// icon/size/016 — the chevron is not a fixed size across the three sizes.
export default function ViewSelectorSizes() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
      <ViewSelector size="large" label="Large" />
      <ViewSelector size="medium" label="Medium" />
      <ViewSelector size="small" label="Small" />
    </div>
  )
}
