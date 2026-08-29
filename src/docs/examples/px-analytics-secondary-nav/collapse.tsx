import * as React from "react"

import { PxAnalyticsSecondaryNav, type PxAnalyticsNavSection } from "@/patterns/px-analytics-secondary-nav"

// Demonstrates: uncontrolled collapse (defaultCollapsed), and a controlled
// collapse driven by an external button — both preserve section-open and
// selected-item state across the toggle (try expanding "Audience" or
// selecting "Funnel", then collapse/expand: both survive).
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

export default function PxAnalyticsSecondaryNavCollapse() {
  const [activeItemId, setActiveItemId] = React.useState("retention-analysis")
  const [controlledCollapsed, setControlledCollapsed] = React.useState(false)

  return (
    <div className="flex flex-col gap-[var(--p-space-300)]">
      <div className="flex flex-col gap-[var(--p-space-100)]">
        <p className="text-[length:var(--t-font-label-small-size)] text-[var(--s-color-text-subtle)]">
          Uncontrolled — click the chevron beside "All Reports" to collapse (the panel disappears into
          a 56px icon rail, one icon per section), then the chevron at the top of that rail to expand.
        </p>
        <div className="h-[360px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
          <PxAnalyticsSecondaryNav
            title="All Reports"
            sections={SECTIONS}
            activeItemId={activeItemId}
            onSelectItem={setActiveItemId}
          />
        </div>
      </div>

      <div className="flex flex-col gap-[var(--p-space-100)]">
        <button
          type="button"
          className="self-start text-[length:var(--t-font-label-small-size)] text-[var(--s-color-link-default)] underline"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setControlledCollapsed((value) => !value)}
        >
          {controlledCollapsed ? "Expand" : "Collapse"} (controlled from outside)
        </button>
        <div className="h-[360px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
          <PxAnalyticsSecondaryNav
            title="All Reports"
            sections={SECTIONS}
            activeItemId={activeItemId}
            onSelectItem={setActiveItemId}
            collapsed={controlledCollapsed}
            onCollapsedChange={setControlledCollapsed}
          />
        </div>
      </div>
    </div>
  )
}
