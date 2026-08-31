import { DashboardWidgetCard } from "@/components/ui/dashboard-widget-card"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export default function DashboardWidgetCardNoFilters() {
  return (
    <div className="w-[448px]">
      <DashboardWidgetCard
        title="Active Users"
        sourceLabel="GAINSIGHT CS - PROD"
        overflowMenu={<DropdownMenuItem>Remove widget</DropdownMenuItem>}
      >
        <div className="flex h-24 items-center justify-center text-xs text-[var(--s-color-text-subtlest)]">
          Static KPI content (caller-supplied)
        </div>
      </DashboardWidgetCard>
    </div>
  )
}
