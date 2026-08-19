import { Button } from "@/components/ui/button"

export default function ButtonDisabled() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
      <Button variant="primary" disabled>
        Save changes
      </Button>
      <Button variant="secondary" disabled>
        Cancel
      </Button>
      <Button variant="destructive" disabled>
        Delete record
      </Button>
    </div>
  )
}
