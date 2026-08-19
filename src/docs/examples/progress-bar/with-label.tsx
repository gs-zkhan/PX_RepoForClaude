import { ProgressBar } from "@/components/ui/progress-bar"

// ProgressBar alone is not accessible per Figma's own rule — always pair it
// with a visible percentage or step count, rendered by the caller.
export default function ProgressBarWithLabel() {
  return (
    <div className="w-64">
      <div className="mb-[var(--p-space-100)] flex items-center justify-between text-sm text-[var(--s-color-text-subtle)]">
        <span>Onboarding</span>
        <span>3 of 5 steps</span>
      </div>
      <ProgressBar value={60} label="Onboarding progress" />
    </div>
  )
}
