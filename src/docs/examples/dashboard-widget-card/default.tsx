import * as React from "react"

import { DashboardWidgetCard } from "@/components/ui/dashboard-widget-card"
import { DashboardWidgetChartTypeSwitcher } from "@/components/ui/dashboard-widget-chart-type-switcher"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { PrismIcon } from "@/components/ui/prism-icon"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

// Chart-type switcher: anatomy based on user-supplied reference
// screenshots (a single icon+chevron trigger opening a popover list), not
// Figma static frames. The 4 example options (scatter/bar/line/number)
// match those screenshots; "formula-number" is the closest existing Prism
// icon to the "#"-style glyph shown (this repo has no dedicated hash
// icon) — see dashboard-widget-chart-type-switcher.tsx's own header
// comment for the full correction history.
export default function DashboardWidgetCardDefault() {
  const [chartType, setChartType] = React.useState("line")

  return (
    <div className="w-[448px]">
      <DashboardWidgetCard
        title="Account Health Score"
        sourceLabel="GAINSIGHT CS - PROD"
        chartTypeSwitcher={
          <DashboardWidgetChartTypeSwitcher
            aria-label="Chart type"
            options={[
              { value: "scatter", label: "Scatter chart", icon: "scatter" },
              { value: "bar", label: "Bar chart", icon: "bar" },
              { value: "line", label: "Line chart", icon: "line" },
              { value: "number", label: "Number", icon: "formula-number" },
            ]}
            value={chartType}
            onValueChange={setChartType}
          />
        }
        filterAction={{ label: "Filter widget", onClick: () => console.log("filter") }}
        shareAction={{ label: "Share widget", onClick: () => console.log("share") }}
        overflowMenu={
          <>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem destructive>Remove widget</DropdownMenuItem>
          </>
        }
        filterRow={
          <>
            <div className="flex items-center gap-[var(--p-space-100)]">
              <Select defaultValue="daily">
                <SelectTrigger inline size="small" className="w-auto">
                  <SelectValue placeholder="Granularity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="30d">
                <SelectTrigger inline size="small" className="w-auto">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select defaultValue="all">
              <SelectTrigger inline size="small" className="w-auto">
                <PrismIcon name="filter" size={16} decorative />
                <SelectValue placeholder="Segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All users</SelectItem>
                <SelectItem value="trial">Trial users</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      >
        <div className="flex h-32 items-center justify-center text-xs text-[var(--s-color-text-subtlest)]">
          Chart body (caller-supplied)
        </div>
      </DashboardWidgetCard>
    </div>
  )
}
