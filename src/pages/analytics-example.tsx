/**
 * Analytics — example screen built directly on <PxMainContainer>, composing
 * <PxAnalyticsSecondaryNav> as the content row's left sibling (mirroring how
 * PxListShell places its filterSlider on the right).
 *
 * Reproduces the Figma "Shell/Nav+SecNav" composition (node 4191:21173):
 * a collapsed (48px) primary rail + PX Header + [Analytics Secondary Nav]
 * [generic content slot]. The content slot itself is Figma's own "whatever
 * page is being browsed" — this file fills it with a realistic placeholder
 * that reflects the current navigation selection, not a full Analytics
 * dashboard (out of scope for this pattern).
 */

import * as React from "react"

import { cn } from "@/lib/utils"
import { PxMainContainer } from "@/patterns/px-main-container"
import { PxAnalyticsSecondaryNav, type PxAnalyticsNavSection } from "@/patterns/px-analytics-secondary-nav"
import { PX_NAV_LABELS, type PxShellNavKey, type PxShellRailMode } from "@/components/px-shell-rail"

// ---------------------------------------------------------------------------
// Sample data — matches the Figma "Secondary Left Navigation - Analytics"
// symbol (3397:2451) exactly: section order, labels and sub-page items.
// ---------------------------------------------------------------------------

const ANALYTICS_SECTIONS: PxAnalyticsNavSection[] = [
  {
    id: "reports",
    // Figma's updated frame (9576:15005) renames this section "Favorites"
    // — the panel-level title ("All Reports", passed separately as
    // `title`) now carries the "Reports" naming instead.
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
    // Confirmed via exact vector-path comparison against the live Figma
    // "FeaturePX" instance (same path data, scaled 1.5x from the existing
    // src/assets/icons/product/feature-px.svg source) — wired into the
    // sized icon system at src/assets/icons/24/feature-px.svg.
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
      { id: "survey-performance", label: "Survey Performance" },
      { id: "in-app-hub", label: "In-App Hub" },
    ],
  },
]

type AnalyticsExampleProps = {
  activeKey: PxShellNavKey
  onNavigate: (key: PxShellNavKey) => void
  mode: PxShellRailMode
  onModeChange: (mode: PxShellRailMode) => void
}

function AnalyticsExample({ activeKey, onNavigate, mode, onModeChange }: AnalyticsExampleProps) {
  const [activeItemId, setActiveItemId] = React.useState<string>("retention-analysis")

  const activeSection = ANALYTICS_SECTIONS.find((section) =>
    section.items.some((item) => item.id === activeItemId),
  )
  const activeItem = activeSection?.items.find((item) => item.id === activeItemId)

  return (
    <PxMainContainer
      nav={{ activeKey, onNavigate, mode, onModeChange }}
      header={{ moduleName: PX_NAV_LABELS[activeKey] }}
    >
      <PxAnalyticsSecondaryNav
        title="All Reports"
        sections={ANALYTICS_SECTIONS}
        activeItemId={activeItemId}
        onSelectItem={setActiveItemId}
      />

      <main
        data-slot="analytics-example-content"
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col overflow-auto",
          "p-[var(--p-space-300)]",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-[var(--p-space-200)]",
            "rounded-[var(--p-radius-150)]",
            "border border-[var(--s-color-line-default)]",
            "bg-[var(--s-color-surface-default)]",
            "p-[var(--p-space-400)]",
            "shadow-[var(--e-shadow-100)]",
          )}
        >
          <p
            className={cn(
              "text-[length:var(--p-font-size-xsmall)] font-[var(--p-font-weight-semi-bold)]",
              "uppercase tracking-wide text-[var(--s-color-text-subtle)]",
            )}
          >
            {activeSection?.label}
          </p>
          <p
            className={cn(
              "text-[length:var(--p-font-size-h5)] font-[var(--p-font-weight-semi-bold)]",
              "leading-[var(--p-font-line-height-h5)] text-[var(--s-color-text-default)]",
            )}
          >
            {activeItem?.label}
          </p>
          {/* Long filler content — deliberately tall (well past a normal
              viewport height) so scroll ownership is visually testable: only
              this <main> should scroll; the primary rail and
              PxAnalyticsSecondaryNav must stay fixed regardless of how far
              this list scrolls. Not real Analytics data — out of scope for
              this pattern (see file header comment). */}
          <div className="flex flex-col gap-[var(--p-space-200)] pt-[var(--p-space-200)]">
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-[var(--p-radius-100)] border border-[var(--s-color-line-default)]",
                  "p-[var(--p-space-300)] text-[length:var(--t-font-body-medium-size)] text-[var(--s-color-text-subtle)]",
                )}
              >
                Row {i + 1} of long scroll-test content for {activeItem?.label ?? "this page"}.
              </div>
            ))}
          </div>
        </div>
      </main>
    </PxMainContainer>
  )
}

export { AnalyticsExample, ANALYTICS_SECTIONS }
