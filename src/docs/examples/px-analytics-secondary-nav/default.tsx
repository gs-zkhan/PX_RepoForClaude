import * as React from "react"

import { PxAnalyticsSecondaryNav, type PxAnalyticsNavSection } from "@/patterns/px-analytics-secondary-nav"

// Matches the Figma "Secondary Left Navigation - Analytics" symbol
// (3397:2451, Property 1=Expanded) exactly: title, section order, labels,
// and sub-page items.
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
      { id: "feedback", label: "Feedback" },
      { id: "query-builder", label: "Query Builder" },
    ],
  },
  {
    id: "features",
    label: "Features",
    icon: "feature-px",
    items: [
      { id: "adoption", label: "Adoption" },
      { id: "path-analyzer", label: "Path Analyzer" },
    ],
  },
  {
    id: "engagement",
    label: "Engagement",
    icon: "pxengagements",
    items: [
      { id: "in-app-performance", label: "In App Performance" },
      { id: "email-performance", label: "Email Performance" },
    ],
  },
]

export default function PxAnalyticsSecondaryNavDefault() {
  const [activeItemId, setActiveItemId] = React.useState("retention-analysis")

  return (
    <div className="h-[500px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
      <PxAnalyticsSecondaryNav
        title="All Reports"
        sections={SECTIONS}
        activeItemId={activeItemId}
        onSelectItem={setActiveItemId}
      />
    </div>
  )
}
