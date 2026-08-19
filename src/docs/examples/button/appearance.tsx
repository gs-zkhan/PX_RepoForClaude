import { Button } from "@/components/ui/button"

export default function ButtonAppearance() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
      <Button variant="primary">Save changes</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="tertiary">Learn more</Button>
      <Button variant="destructive">Delete record</Button>
    </div>
  )
}
