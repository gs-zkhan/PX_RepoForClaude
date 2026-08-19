import * as React from "react"

import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// DragHandle — Prism DS anatomy (verified against prism-ds/src/components/
// DragHandle). 1px draggable separator with a 24x2 pill grip that resizes
// its target sibling along one axis. Vertical (default) sits between two
// columns; horizontal sits between two rows.
//
// Pure pointer-event implementation — no external library. If `targetRef`
// is omitted, the handle resizes its own previousElementSibling, which is
// the natural pairing when the handle sits directly after the resized
// element in a flex container.
//
// Prism uses --color-line-strong for the hover/dragging state; this repo
// uses --s-color-line-bold (same #3C4A57 value) as the verified
// equivalent, matching the pattern already used in ConfigRow.
// -----------------------------------------------------------------------------

type DragHandleOrientation = "vertical" | "horizontal"

type DragHandleProps = {
  /**
   * Axis of the handle. Vertical handles sit between two columns and
   * resize width; horizontal handles sit between two rows and resize
   * height. Default 'vertical'.
   */
  orientation?: DragHandleOrientation
  /**
   * Element to resize. If omitted, the handle uses its own
   * previousElementSibling — convenient when the handle sits directly
   * after the element being resized in a flex container.
   */
  targetRef?: React.RefObject<HTMLElement | null>
  /** Minimum size (px) of the target along the drag axis. Default 200. */
  minSize?: number
  /** Maximum size (px) of the target along the drag axis. Default 800. */
  maxSize?: number
  ariaLabel?: string
  className?: string
}

function DragHandle({
  orientation = "vertical",
  targetRef,
  minSize = 200,
  maxSize = 800,
  ariaLabel = "Resize panels",
  className,
}: DragHandleProps) {
  const handleRef = React.useRef<HTMLDivElement | null>(null)
  const [dragging, setDragging] = React.useState(false)

  const isVertical = orientation === "vertical"

  const onPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const handle = handleRef.current
      if (!handle) return
      const target =
        targetRef?.current ?? (handle.previousElementSibling as HTMLElement | null)
      if (!target) return

      const start = isVertical ? event.clientX : event.clientY
      const rect = target.getBoundingClientRect()
      const startSize = isVertical ? rect.width : rect.height

      setDragging(true)
      handle.setPointerCapture(event.pointerId)

      const onMove = (ev: PointerEvent) => {
        const delta = (isVertical ? ev.clientX : ev.clientY) - start
        const next = Math.max(minSize, Math.min(maxSize, startSize + delta))
        if (isVertical) {
          target.style.width = `${next}px`
        } else {
          target.style.height = `${next}px`
        }
        target.style.flex = "none"
      }

      const onUp = (ev: PointerEvent) => {
        setDragging(false)
        handle.releasePointerCapture(ev.pointerId)
        handle.removeEventListener("pointermove", onMove)
        handle.removeEventListener("pointerup", onUp)
        handle.removeEventListener("pointercancel", onUp)
      }

      handle.addEventListener("pointermove", onMove)
      handle.addEventListener("pointerup", onUp)
      handle.addEventListener("pointercancel", onUp)
    },
    [isVertical, maxSize, minSize, targetRef],
  )

  return (
    <div
      ref={handleRef}
      role="separator"
      aria-orientation={orientation}
      aria-label={ariaLabel}
      onPointerDown={onPointerDown}
      className={cn(
        "relative z-[1] shrink-0 transition-colors",
        "bg-[var(--s-color-line-default)]",
        isVertical ? "w-px cursor-col-resize" : "h-px cursor-row-resize",
        (dragging || undefined) && "bg-[var(--s-color-line-bold)]",
        !dragging && "hover:bg-[var(--s-color-line-bold)]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "rounded-[var(--p-radius-full)] bg-[var(--s-color-line-bold)]",
          isVertical ? "h-6 w-0.5" : "h-0.5 w-6",
        )}
      />
    </div>
  )
}

export { DragHandle }
export type { DragHandleProps, DragHandleOrientation }
