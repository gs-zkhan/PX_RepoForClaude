import { Button } from "@/components/ui/button"

export default function ButtonBulkAction() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
      <Button variant="bulkAction" size="large">Bulk</Button>
      <Button variant="bulkAction" size="medium">Bulk</Button>
      <Button variant="bulkAction" size="small">Bulk</Button>
      <Button variant="bulkAction" size="large" disabled>Bulk</Button>
    </div>
  )
}
