import { DragHandle } from "@/components/ui/drag-handle"

// `orientation="horizontal"` sits between two rows and resizes height instead
// of width.
export default function DragHandleHorizontal() {
  return (
    <div className="flex h-64 w-full flex-col overflow-hidden rounded-[var(--p-radius-100)] border border-[var(--s-color-line-default)]">
      <div className="flex h-[120px] w-full shrink-0 items-center justify-center bg-[var(--s-color-surface-sunken)] text-[length:var(--t-font-label-small-size)] text-[var(--s-color-text-subtlest)]">
        Top panel
      </div>
      <DragHandle orientation="horizontal" />
      <div className="flex flex-1 items-center justify-center text-[length:var(--t-font-label-small-size)] text-[var(--s-color-text-subtlest)]">
        Bottom panel
      </div>
    </div>
  )
}
