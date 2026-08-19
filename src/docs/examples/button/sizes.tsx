import { Button } from "@/components/ui/button"

export default function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
      <Button size="large">Large</Button>
      <Button size="medium">Medium</Button>
      <Button size="small">Small</Button>
    </div>
  )
}
