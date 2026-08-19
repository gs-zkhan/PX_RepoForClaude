import { StatusLabel } from "@/components/ui/status-label"

export default function StatusLabelSizes() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
      <StatusLabel variant="active" size="regular">
        Active
      </StatusLabel>
      <StatusLabel variant="active" size="small">
        Active
      </StatusLabel>
    </div>
  )
}
