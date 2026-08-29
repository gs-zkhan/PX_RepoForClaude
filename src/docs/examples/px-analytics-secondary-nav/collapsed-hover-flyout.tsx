import * as React from "react"

import { PxAnalyticsSecondaryNav, type PxAnalyticsNavSection } from "@/patterns/px-analytics-secondary-nav"

// Demonstrates: the collapsed-rail hover flyout (Figma frame 9576:17226).
// Collapse the panel, then hover (or Tab-focus) a section icon to see a
// flyout of that section's items — click or Enter-select one to update
// `activeItemId` without expanding the panel.
const SECTIONS: PxAnalyticsNavSection[] = [
  {
    id: "reports",
    label: "Favorites",
    icon: "document",
    items: [
      { id: "my-reports", label: "My Reports" },
      { id: "shared", label: "Shared" },
      { id: "archived", label: "Archived" },
    ],
  },
  {
    id: "audience",
    label: "Audience",
    icon: "user",
    items: [
      { id: "retention-analysis", label: "Retention Analysis" },
      { id: "funnel", label: "Funnel" },
    ],
  },
]

export default function PxAnalyticsSecondaryNavCollapsedHoverFlyout() {
  const [activeItemId, setActiveItemId] = React.useState("retention-analysis")

  return (
    <div className="flex flex-col gap-[var(--p-space-100)]">
      <p className="text-[length:var(--t-font-label-small-size)] text-[var(--s-color-text-subtle)]">
        Panel starts collapsed. Hover or Tab-focus a section icon to open its flyout; click or
        Enter-select an item to load it — the panel stays collapsed.
      </p>
      <div className="h-[360px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
        <PxAnalyticsSecondaryNav
          title="All Reports"
          sections={SECTIONS}
          activeItemId={activeItemId}
          onSelectItem={setActiveItemId}
          defaultCollapsed
        />
      </div>
    </div>
  )
}
