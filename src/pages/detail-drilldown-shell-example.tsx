import { useState } from "react"

import { PxDetailDrilldownShell } from "@/patterns/px-detail-drilldown-shell"
import type { PxShellNavKey, PxShellRailMode } from "@/components/px-shell-rail"
import { PX_NAV_LABELS } from "@/components/px-shell-rail"
import { StatusLabel } from "@/components/ui/status-label"
import { SummaryStat, StatsRow } from "@/components/ui/summary-stat"
import {
  Table,
  TableBody,
  TableCell,
  TableEmptyState,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Toggle } from "@/components/ui/toggle"

/**
 * Detail/Drilldown — example screen proving PxDetailDrilldownShell composes
 * correctly. Deliberately generic: "Example Record" is a stand-in for any
 * entity (Account, Segment, Feature, Engagement, ...) per the shell's own
 * "never name/structure around a specific entity" rule — this is NOT a
 * production Account Explorer (or any other entity) drilldown page.
 *
 * The "Show no activity" toggle is a local-only affordance to demonstrate
 * the shell's content region correctly hosting an empty state — there is no
 * backend here.
 */

const ACTIVITY_ROWS = [
  { event: "Membership changed", when: "Sep 5, 2026" },
  { event: "Criteria updated", when: "Sep 3, 2026" },
  { event: "Record created", when: "Aug 20, 2026" },
]

type DetailDrilldownShellExampleProps = {
  activeKey: PxShellNavKey
  onNavigate: (key: PxShellNavKey) => void
  mode?: PxShellRailMode
  onModeChange?: (mode: PxShellRailMode) => void
}

export function DetailDrilldownShellExample({
  activeKey,
  onNavigate,
  mode,
  onModeChange,
}: DetailDrilldownShellExampleProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showEmpty, setShowEmpty] = useState(false)

  return (
    <PxDetailDrilldownShell
      nav={{ activeKey, onNavigate, mode, onModeChange }}
      header={{ moduleName: PX_NAV_LABELS[activeKey] }}
      onBack={() => onNavigate("segments")}
      title="Example Record"
      titleChip={<StatusLabel variant="active">Active</StatusLabel>}
      tabs={[
        { id: "overview", label: "Overview" },
        { id: "activity", label: "Activity" },
      ]}
      activeTabId={activeTab}
      onTabChange={setActiveTab}
      secondaryUtilities={[
        { id: "duplicate", icon: "copy", label: "Duplicate record" },
      ]}
      secondaryActions={[
        { id: "edit", label: "Edit record", variant: "primary", onClick: () => {} },
      ]}
    >
      <div className="flex flex-col gap-[var(--p-space-300)]">
        <StatsRow>
          <SummaryStat value="12,486" label="Users" />
          <SummaryStat value="842" label="Accounts" />
          <SummaryStat value="Sep 3, 2026" label="Last updated" />
        </StatsRow>

        <div className="flex items-center gap-[var(--p-space-100)]">
          <Toggle
            label="Show no activity (demo)"
            checked={showEmpty}
            onChange={(e) => setShowEmpty(e.target.checked)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          {showEmpty ? (
            <TableEmptyState
              colSpan={2}
              title="No recent activity"
              body="This record has no recent activity in the selected period."
            />
          ) : (
            <TableBody>
              {ACTIVITY_ROWS.map((row) => (
                <TableRow key={row.event}>
                  <TableCell>{row.event}</TableCell>
                  <TableCell>{row.when}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
    </PxDetailDrilldownShell>
  )
}
