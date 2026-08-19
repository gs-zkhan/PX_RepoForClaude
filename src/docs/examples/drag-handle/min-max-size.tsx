import { DragHandle } from "@/components/ui/drag-handle"

// `minSize`/`maxSize` clamp the resized panel along the drag axis, in pixels.
export default function DragHandleMinMaxSize() {
  return (
    <div className="flex h-40 w-full overflow-hidden rounded-[var(--p-radius-100)] border border-[var(--s-color-line-default)]">
      <div className="flex h-full w-[160px] shrink-0 items-center justify-center bg-[var(--s-color-surface-sunken)] text-[length:var(--t-font-label-small-size)] text-[var(--s-color-text-subtlest)]">
        Min 120 / Max 320
      </div>
      <DragHandle minSize={120} maxSize={320} ariaLabel="Resize navigation" />
      <div className="flex h-full flex-1 items-center justify-center text-[length:var(--t-font-label-small-size)] text-[var(--s-color-text-subtlest)]">
        Content
      </div>
    </div>
  )
}
