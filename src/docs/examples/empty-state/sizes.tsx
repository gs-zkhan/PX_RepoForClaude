import noDataFoundIllustration from "@/assets/illustrations/no-data-found.svg?raw"
import { EmptyState } from "@/components/ui/empty-state"

// Size drives both the illustration box (64/80/120/144) and the CTA button's
// `size` (small/medium/large/large) — verified 1:1 against Button's own
// height tokens for each Figma instance.
export default function EmptyStateSizes() {
  return (
    <div className="flex flex-wrap items-start gap-[var(--p-space-500)]">
      {(["small", "medium", "large", "xlarge"] as const).map((size) => (
        <EmptyState
          key={size}
          size={size}
          illustration={<span className="inline-flex" dangerouslySetInnerHTML={{ __html: noDataFoundIllustration }} />}
          title={size}
          description="Empty state body text."
          primaryAction={{ label: "Add data", onClick: () => {} }}
        />
      ))}
    </div>
  )
}
