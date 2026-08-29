import * as React from "react"

import { PxAnalyticsSecondaryNav, type PxAnalyticsNavSection } from "@/patterns/px-analytics-secondary-nav"

// Demonstrates: controlled section open/close state, one real <a href> row
// (link semantics) alongside plain state-only rows (button semantics), and
// active-item selection driving aria-current.
const SECTIONS: PxAnalyticsNavSection[] = [
  {
    id: "reports",
    label: "Favorites",
    icon: "document",
    items: [
      // A real destination: renders as <a href> with aria-current, not a button.
      { id: "my-reports", label: "My Reports", href: "/analytics/reports/my-reports" },
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

export default function PxAnalyticsSecondaryNavStates() {
  const [activeItemId, setActiveItemId] = React.useState("funnel")
  const [openSectionIds, setOpenSectionIds] = React.useState(["reports", "audience"])

  return (
    <div className="flex flex-col gap-[var(--p-space-200)]">
      <button
        type="button"
        className="self-start text-[length:var(--t-font-label-small-size)] text-[var(--s-color-link-default)] underline"
        // Genuinely external controls that operate on a list shouldn't steal
        // focus away from it (the same reason toolbar buttons over a text
        // editor use this) — preventing default on mousedown keeps whatever
        // row currently has keyboard focus focused, so the click below
        // demonstrates the real "external, focus-preserving collapse"
        // scenario PxAnalyticsSecondaryNav's focus-restoration handles,
        // rather than the unrelated "focus already moved to the clicked
        // control" case.
        onMouseDown={(event) => event.preventDefault()}
        onClick={() =>
          setOpenSectionIds((ids) => (ids.includes("audience") ? ids.filter((id) => id !== "audience") : [...ids, "audience"]))
        }
      >
        Toggle "Audience" section (controlled — also demonstrates focus
        restoration if a row inside it currently holds keyboard focus)
      </button>
      <div className="h-[360px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
        <PxAnalyticsSecondaryNav
          title="All Reports"
          sections={SECTIONS}
          activeItemId={activeItemId}
          onSelectItem={setActiveItemId}
          openSectionIds={openSectionIds}
          onOpenSectionIdsChange={setOpenSectionIds}
        />
      </div>
    </div>
  )
}
