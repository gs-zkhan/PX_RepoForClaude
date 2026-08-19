import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// RadioGroup's own default layout is a vertical grid (gap-2). className here
// is layout-only — it changes direction/spacing, not any item's visual
// recipe — which is within a pattern's allowed composition-level control.
export default function RadioGroupHorizontal() {
  return (
    <RadioGroup defaultValue="grid" className="flex flex-row items-center gap-[var(--p-space-300)]">
      <div className="flex items-center gap-[var(--p-space-100)]">
        <RadioGroupItem value="list" id="view-list" />
        <label htmlFor="view-list" className="text-sm text-[var(--s-color-text-default)]">
          List
        </label>
      </div>
      <div className="flex items-center gap-[var(--p-space-100)]">
        <RadioGroupItem value="grid" id="view-grid" />
        <label htmlFor="view-grid" className="text-sm text-[var(--s-color-text-default)]">
          Grid
        </label>
      </div>
    </RadioGroup>
  )
}
