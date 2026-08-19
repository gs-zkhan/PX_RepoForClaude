import { EmptyState } from "@/components/ui/empty-state"

// `illustration` is optional — omit it entirely for a text-only empty state
// rather than passing an empty box.
export default function EmptyStateNoIllustration() {
  return (
    <EmptyState
      title="No results"
      description="Try adjusting your filters to find what you're looking for."
      primaryAction={{ label: "Clear filters", onClick: () => {} }}
    />
  )
}
