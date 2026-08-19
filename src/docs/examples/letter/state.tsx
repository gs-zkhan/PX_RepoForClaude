import { Letter } from "@/components/ui/letter"

// "selected" is a brand-bordered, selected-fill look — Figma's own variant
// name for it is "Hover", but it renders a selected/active treatment, not a
// pointer-hover style, so it is exposed here as `selected` instead.
export default function LetterState() {
  return (
    <div className="flex items-center gap-[var(--p-space-100)]">
      <Letter letter="A" state="default" />
      <Letter letter="B" state="selected" />
      <Letter letter="C" state="borderless" />
    </div>
  )
}
