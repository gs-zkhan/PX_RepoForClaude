import * as React from "react"

import { cn } from "@/lib/utils"
import { SearchBar } from "@/components/ui/search-bar"
import { ViewSwitcher } from "@/components/ui/view-switcher"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { PrismIcon } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// ColumnSelector — Figma "Column Selector" (node 1572:8281, Prism V1 - ShadCN).
// Popover panel that controls table column visibility and order.
//
// Changes from v1:
// - All edits are buffered internally; parent state updates only on Save.
// - Save is disabled until a change is made (isDirty).
// - Reset to default appears on both tabs.
// - Order tab supports HTML5 drag-and-drop and up/down keyboard buttons.
// -----------------------------------------------------------------------------

type ColumnSelectorView = "selection" | "order"

type ColumnSelectorColumn = {
  id: string
  label: string
  disabled?: boolean
}

type ColumnSelectorProps = {
  columns: ColumnSelectorColumn[]
  /** Currently committed selected column ids. Used to initialise the draft. */
  selected: string[]
  /** Currently committed column order. Used to initialise the draft. */
  order?: string[]
  view?: ColumnSelectorView
  onViewChange?: (view: ColumnSelectorView) => void
  onSelectedChange: (selected: string[]) => void
  onReorder?: (order: string[]) => void
  /** Called when user clicks Reset — parent may use this to supply the default set. */
  onReset?: () => void
  onCancel?: () => void
  onSave?: () => void
  /**
   * Ref set to true while a drag is in flight. Pass this into the parent
   * Popover's onPointerDownOutside / onInteractOutside to prevent Radix from
   * closing the popover mid-drag.
   */
  isDraggingRef?: React.RefObject<boolean>
  className?: string
}

function ColumnSelector({
  columns,
  selected: committedSelected,
  order: committedOrder,
  view = "selection",
  onViewChange,
  onSelectedChange,
  onReorder,
  onReset,
  onCancel,
  onSave,
  isDraggingRef: externalIsDraggingRef,
  className,
}: ColumnSelectorProps) {
  const defaultOrder = React.useMemo(() => columns.map((c) => c.id), [columns])

  // Draft state — initialised from committed state at mount (Popover remounts on open).
  const [draftSelected, setDraftSelected] = React.useState<string[]>(committedSelected)
  const [draftOrder, setDraftOrder] = React.useState<string[]>(committedOrder ?? defaultOrder)
  const [isDirty, setIsDirty] = React.useState(false)

  const [search, setSearch] = React.useState("")
  const [internalView, setInternalView] = React.useState<ColumnSelectorView>(view)
  const activeView = onViewChange ? view : internalView
  const setView = (v: ColumnSelectorView) => {
    if (onViewChange) onViewChange(v)
    else setInternalView(v)
  }

  // Drag state — dragId is stored in both state (visual feedback) and dataTransfer
  // (drop logic). The dataTransfer copy avoids reading from a potentially-stale
  // React closure when the drop event fires.
  const [dragId, setDragId] = React.useState<string | null>(null)
  const [dragOverId, setDragOverId] = React.useState<string | null>(null)
  const internalIsDraggingRef = React.useRef(false)
  const isDraggingRef = externalIsDraggingRef ?? internalIsDraggingRef

  const orderedColumns = draftOrder
    .map((id) => columns.find((c) => c.id === id))
    .filter((c): c is ColumnSelectorColumn => Boolean(c))

  const filtered = orderedColumns.filter((c) =>
    c.label.toLowerCase().includes(search.trim().toLowerCase()),
  )

  const total = columns.length
  const count = draftSelected.length

  // --- selection ---

  const toggleSelected = (id: string, checked: boolean) => {
    setDraftSelected((prev) => (checked ? [...prev, id] : prev.filter((s) => s !== id)))
    setIsDirty(true)
  }

  // --- order (keyboard) ---

  const move = (id: string, delta: -1 | 1) => {
    const idx = draftOrder.indexOf(id)
    if (idx === -1) return
    const next = idx + delta
    if (next < 0 || next >= draftOrder.length) return
    const nextOrder = [...draftOrder]
    const [item] = nextOrder.splice(idx, 1)
    nextOrder.splice(next, 0, item)
    setDraftOrder(nextOrder)
    setIsDirty(true)
  }

  // --- order (drag-and-drop) ---

  const handleDragStart = (e: React.DragEvent, id: string) => {
    isDraggingRef.current = true
    setDragId(id)
    e.dataTransfer.effectAllowed = "move"
    // Store in dataTransfer so handleDrop doesn't depend on React state timing.
    e.dataTransfer.setData("text/plain", id)
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (id !== dragOverId) setDragOverId(id)
  }

  const handleDrop = (e: React.DragEvent, toId: string) => {
    e.preventDefault()
    isDraggingRef.current = false
    setDragOverId(null)
    const fromId = e.dataTransfer.getData("text/plain")
    if (!fromId || fromId === toId) { setDragId(null); return }
    const fromIdx = draftOrder.indexOf(fromId)
    const toIdx = draftOrder.indexOf(toId)
    if (fromIdx === -1 || toIdx === -1) { setDragId(null); return }
    const next = [...draftOrder]
    next.splice(fromIdx, 1)
    next.splice(toIdx, 0, fromId)
    setDraftOrder(next)
    setIsDirty(true)
    setDragId(null)
  }

  const handleDragEnd = () => {
    isDraggingRef.current = false
    setDragId(null)
    setDragOverId(null)
  }

  // --- footer actions ---

  const handleSave = () => {
    onSelectedChange(draftSelected)
    onReorder?.(draftOrder)
    onSave?.()
  }

  const handleCancel = () => onCancel?.()

  const handleReset = () => {
    setDraftSelected(defaultOrder)
    setDraftOrder(defaultOrder)
    setIsDirty(true)
    onReset?.()
  }

  return (
    <div
      role="dialog"
      aria-label="Column arrangements"
      className={cn("flex w-[312px] flex-col", className)}
    >
      <div className="flex items-center px-[var(--p-space-200)] pt-[var(--p-space-200)]">
        <h2 className="text-[length:var(--t-font-heading-small-size)] font-[number:var(--t-font-heading-small-weight)] leading-[var(--t-font-heading-small-line-height)] text-[var(--s-color-text-default)]">
          Column arrangements
        </h2>
      </div>

      <div className="px-[var(--p-space-200)] pt-[var(--p-space-100)]">
        <SearchBar
          size="small"
          placeholder="Search columns"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between px-[var(--p-space-200)] py-[var(--p-space-100)]">
        <span className="text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] text-[var(--s-color-text-subtle)]">
          {count} / {total} Selected
        </span>
        <ViewSwitcher
          value={activeView}
          onValueChange={(v) => setView(v as ColumnSelectorView)}
          options={[
            { value: "selection", label: "Select" },
            { value: "order", label: "Order" },
          ]}
        />
      </div>

      <ul className="max-h-[400px] overflow-y-auto">
        {filtered.map((col) => {
          const idx = draftOrder.indexOf(col.id)
          const isFirst = idx === 0
          const isLast = idx === draftOrder.length - 1
          const checked = draftSelected.includes(col.id)
          const isDragging = dragId === col.id
          const isDragOver = dragOverId === col.id && !isDragging

          if (activeView === "order") {
            return (
              <li
                key={col.id}
                draggable={!col.disabled}
                onDragStart={(e) => !col.disabled && handleDragStart(e, col.id)}
                onDragOver={(e) => !col.disabled && handleDragOver(e, col.id)}
                onDrop={(e) => !col.disabled && handleDrop(e, col.id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "flex items-center gap-[var(--p-space-100)] px-[var(--p-space-200)] py-[var(--p-space-100)]",
                  "hover:bg-[var(--s-color-surface-muted)]",
                  isDragOver && "bg-[var(--s-color-surface-sunken)] outline outline-1 outline-[var(--s-color-action-primary-default)]",
                  isDragging && "opacity-40",
                  col.disabled && "opacity-60",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "text-[var(--s-icon-color-subtle)]",
                    !col.disabled && "cursor-grab active:cursor-grabbing",
                  )}
                >
                  <PrismIcon name="drag-and-drop" size={16} sourceSize={24} decorative />
                </span>
                <span className="min-w-0 flex-1 truncate text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] text-[var(--s-color-text-default)]">
                  {col.label}
                </span>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    aria-label={`Move ${col.label} up`}
                    onClick={() => move(col.id, -1)}
                    disabled={isFirst || col.disabled}
                    className="inline-flex size-5 items-center justify-center rounded-[var(--p-radius-050)] text-[var(--s-icon-color-default)] hover:bg-[var(--s-color-surface-sunken)] disabled:cursor-not-allowed disabled:text-[var(--s-icon-color-disabled)]"
                  >
                    <PrismIcon name="chevron-up" size={16} decorative />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${col.label} down`}
                    onClick={() => move(col.id, 1)}
                    disabled={isLast || col.disabled}
                    className="inline-flex size-5 items-center justify-center rounded-[var(--p-radius-050)] text-[var(--s-icon-color-default)] hover:bg-[var(--s-color-surface-sunken)] disabled:cursor-not-allowed disabled:text-[var(--s-icon-color-disabled)]"
                  >
                    <PrismIcon name="chevron-down" size={16} decorative />
                  </button>
                </div>
              </li>
            )
          }

          return (
            <li key={col.id}>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-[var(--p-space-100)] px-[var(--p-space-200)] py-[var(--p-space-100)]",
                  "hover:bg-[var(--s-color-surface-muted)]",
                  col.disabled && "cursor-not-allowed opacity-60",
                )}
              >
                <Checkbox
                  checked={checked}
                  disabled={col.disabled}
                  onCheckedChange={(value) => toggleSelected(col.id, value === true)}
                />
                <span className="min-w-0 flex-1 truncate text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] text-[var(--s-color-text-default)]">
                  {col.label}
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      <div
        className={cn(
          "flex items-center gap-[var(--p-space-200)] px-[var(--p-space-200)] py-[var(--p-space-150)]",
          "border-t border-[var(--s-color-line-default)] shadow-[var(--e-shadow-inverse)]",
        )}
      >
        <Button variant="tertiary" size="medium" onClick={handleReset}>
          Reset to default
        </Button>
        <div className="ml-auto flex items-center gap-[var(--p-space-100)]">
          <Button variant="secondary" size="medium" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="medium" disabled={!isDirty} onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

export { ColumnSelector }
export type { ColumnSelectorProps, ColumnSelectorColumn, ColumnSelectorView }
