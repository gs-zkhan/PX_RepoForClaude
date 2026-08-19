import { CanvasCard } from "@/components/ui/canvas-card"

// `resizable` renders a DragHandle between panes. It resizes the left pane
// in 'split'/'fixed-left' modes, or the right pane in 'fixed-right'.
export default function CanvasCardResizable() {
  return (
    <CanvasCard
      resizable
      minSize={240}
      maxSize={600}
      className="h-64"
      left={<div className="p-[var(--p-space-200)]">Drag the divider</div>}
      right={<div className="p-[var(--p-space-200)]">Canvas</div>}
    />
  )
}
