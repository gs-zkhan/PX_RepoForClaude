import noDataFoundIllustration from "@/assets/illustrations/no-data-found.svg?raw"
import { EmptyState } from "@/components/ui/empty-state"

// "landscape" places the illustration to the left of a left-aligned text
// column instead of centering everything in a vertical stack.
export default function EmptyStateLandscape() {
  return (
    <EmptyState
      orientation="landscape"
      illustration={<span className="inline-flex" dangerouslySetInnerHTML={{ __html: noDataFoundIllustration }} />}
      title="No data found"
      description="This body explains the empty state. The icon relates to the situation."
      secondaryAction={{ label: "Learn more", onClick: () => {} }}
    />
  )
}
