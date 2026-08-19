import { StatusLabel } from "@/components/ui/status-label"

export default function StatusLabelVariants() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
      <StatusLabel variant="open">Open</StatusLabel>
      <StatusLabel variant="in-progress">In progress</StatusLabel>
      <StatusLabel variant="waiting">Waiting</StatusLabel>
      <StatusLabel variant="active">Active</StatusLabel>
      <StatusLabel variant="completed">Completed</StatusLabel>
      <StatusLabel variant="failed">Failed</StatusLabel>
      <StatusLabel variant="inactive">Inactive</StatusLabel>
    </div>
  )
}
