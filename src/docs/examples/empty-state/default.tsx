import noDataFoundIllustration from "@/assets/illustrations/no-data-found.svg?raw"
import { EmptyState } from "@/components/ui/empty-state"

// Only one of Figma's 17 illustration types has been extracted so far
// ("No Data Found", raw-imported and injected via dangerouslySetInnerHTML —
// there is no illustration-loading component yet, unlike PrismIcon's icon
// set). Pass any other illustration through the same `illustration` slot
// once it exists.
export default function EmptyStateDefault() {
  return (
    <EmptyState
      illustration={<span className="inline-flex" dangerouslySetInnerHTML={{ __html: noDataFoundIllustration }} />}
      title="No data found"
      description="This body explains the empty state. The icon relates to the situation."
      primaryAction={{ label: "Add data", onClick: () => {} }}
      secondaryAction={{ label: "Learn more", onClick: () => {} }}
    />
  )
}
