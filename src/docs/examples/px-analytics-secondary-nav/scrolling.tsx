import * as React from "react"

import { PxAnalyticsSecondaryNav, type PxAnalyticsNavSection } from "@/patterns/px-analytics-secondary-nav"

// Demonstrates scroll ownership (design-owner decision): the secondary nav
// itself never scrolls or gets its own scrollbar — only content to its
// right does. Scroll the right-hand panel and confirm the nav on the left
// does not move.
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
]

export default function PxAnalyticsSecondaryNavScrolling() {
  const [activeItemId, setActiveItemId] = React.useState("retention-analysis")

  return (
    <div className="flex h-[360px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
      <PxAnalyticsSecondaryNav
        title="All Reports"
        sections={SECTIONS}
        activeItemId={activeItemId}
        onSelectItem={setActiveItemId}
      />
      <div className="flex-1 overflow-auto p-[var(--p-space-300)]">
        <div className="flex flex-col gap-[var(--p-space-200)]">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="rounded border border-[var(--s-color-line-default)] p-[var(--p-space-200)] text-[length:var(--t-font-body-medium-size)] text-[var(--s-color-text-subtle)]"
            >
              Content row {i + 1} — scroll this panel; the nav on the left stays fixed.
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
