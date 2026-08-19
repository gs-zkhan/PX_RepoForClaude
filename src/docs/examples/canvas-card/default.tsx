import { CanvasCard } from "@/components/ui/canvas-card"

export default function CanvasCardDefault() {
  return (
    <CanvasCard
      className="h-64"
      left={<div className="p-[var(--p-space-200)]">Preview pane</div>}
      right={<div className="p-[var(--p-space-200)]">Config pane</div>}
    />
  )
}
