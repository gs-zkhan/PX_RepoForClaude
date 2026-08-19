import { DragHandle } from "@/components/ui/drag-handle"

// With no `targetRef`, the handle resizes its own previousElementSibling —
// the natural pairing when it sits directly after the resized panel in a
// flex container.
export default function DragHandleDefault() {
  return (
    <div className="flex h-40 w-full overflow-hidden rounded-[var(--p-radius-100)] border border-[var(--s-color-line-default)]">
      <div className="flex h-full w-[240px] shrink-0 items-center justify-center bg-[var(--s-color-surface-sunken)] text-[length:var(--t-font-label-small-size)] text-[var(--s-color-text-subtlest)]">
        Left panel
      </div>
      <DragHandle />
      <div className="flex h-full flex-1 items-center justify-center text-[length:var(--t-font-label-small-size)] text-[var(--s-color-text-subtlest)]">
        Right panel
      </div>
    </div>
  )
}
