import { CanvasCard } from "@/components/ui/canvas-card"

// 'fixed-left' pins the left pane to `fixedSize`px; the right pane flexes to
// fill the remaining width. Use for a narrow config rail beside a canvas.
export default function CanvasCardFixedLeft() {
  return (
    <CanvasCard
      mode="fixed-left"
      fixedSize={280}
      className="h-64"
      left={<div className="p-[var(--p-space-200)]">Config rail (280px)</div>}
      right={<div className="p-[var(--p-space-200)]">Canvas</div>}
    />
  )
}
