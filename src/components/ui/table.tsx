import * as React from "react"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"

type TableDensity = "compact" | "default" | "comfortable"

const TableDensityContext =
  React.createContext<TableDensity>("default")

type TableProps = React.ComponentProps<"table"> & {
  density?: TableDensity
  /**
   * Layout-only classes (height/flex/min-h-0) for the table's own scroll
   * container. Needed because this div is *always* a vertical scroll
   * container too — per the CSS overflow spec, a browser forces overflow-y
   * to behave like "auto" whenever overflow-x is non-visible, so wrapping a
   * second div around <Table> for vertical scroll creates two nested scroll
   * containers and breaks `sticky` header positioning. Size *this* div
   * instead, e.g. `containerClassName="min-h-0 flex-1"`.
   */
  containerClassName?: string
}

function Table({
  className,
  density = "default",
  containerClassName,
  ...props
}: TableProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  // `overscroll-behavior-x: contain` (below) asks the browser nicely not to
  // chain a horizontal gesture past this container once it hits a scroll
  // boundary. In practice, Chrome's two-finger-trackpad gesture handling can
  // still let that hand-off through (it's the same gesture Chrome also uses
  // for back/forward navigation), so CSS alone isn't reliable here. This
  // takes over explicitly: a non-passive `wheel` listener claims any
  // predominantly-horizontal scroll over this element, applies it directly
  // to `scrollLeft` (which the browser clamps to the valid range on its
  // own), and calls `preventDefault()` unconditionally — so the browser
  // never sees an unhandled horizontal delta it could turn into page
  // rubber-banding or a navigation gesture. Vertical scrolling is left
  // completely untouched.
  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function onWheel(event: WheelEvent) {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
      event.preventDefault()
      el!.scrollLeft += event.deltaX
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  return (
    <TableDensityContext.Provider value={density}>
      <div
        ref={containerRef}
        data-slot="table-container"
        data-density={density}
        className={cn("relative w-full overflow-auto overscroll-x-contain", containerClassName)}
      >
        <table
          data-slot="table"
          className={cn(
            "w-full caption-bottom border-collapse",
            "text-[length:var(--c-table-cell-font-size)]",
            "font-[var(--c-table-cell-font-weight)]",
            "leading-[var(--c-table-cell-font-line-height)]",
            className
          )}
          {...props}
        />
      </div>
    </TableDensityContext.Provider>
  )
}

function useTableDensity() {
  return React.useContext(TableDensityContext)
}

function TableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "[&_tr]:h-[var(--c-table-header-height)]",
        className
      )}
      {...props}
    />
  )
}

function TableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(className)}
      {...props}
    />
  )
}

function TableFooter({
  className,
  ...props
}: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "h-[var(--c-table-pagination-height)]",
        className
      )}
      {...props}
    />
  )
}

function TableRow({
  className,
  selected = false,
  ...props
}: React.ComponentProps<"tr"> & {
  selected?: boolean
}) {
  return (
    <tr
      data-slot="table-row"
      data-state={selected ? "selected" : undefined}
      className={cn(
        "group",
        "border-b border-[var(--c-table-cell-border-row)]",
        "bg-[var(--c-table-cell-background-default)]",
        "transition-colors",
        "hover:bg-[var(--c-table-cell-background-hover)]",
        "data-[state=selected]:bg-[var(--c-table-cell-background-selected)]",
        // Scoped to `tbody` ancestor, not just `data-density` on the
        // container: `TableHeader` also wraps rows in this same `TableRow`
        // component, and an unscoped `[data-density=x] &` selector has equal
        // *class-count* specificity to (and after a rebuild can win against)
        // `TableHeader`'s own `[&_tr]:h-[var(--c-table-header-height)]` rule,
        // silently forcing header rows to body-row height. Requiring `tbody`
        // in the selector both raises specificity and is semantically
        // correct — density controls body row height only.
        "[[data-density=compact]_tbody_&]:h-[var(--c-table-row-height-compact)]",
        "[[data-density=default]_tbody_&]:h-[var(--c-table-row-height-default)]",
        "[[data-density=comfortable]_tbody_&]:h-[var(--c-table-row-height-comfortable)]",
        className
      )}
      {...props}
    />
  )
}

// Single-column-per-side pinning (first slice — see table.doc.ts / the
// Table Customisation Figma audit for the full multi-column contract this
// intentionally does not yet cover). Callers own which column id is pinned
// per side; this primitive only owns the resulting sticky positioning,
// z-index, opaque background, and boundary divider. No cumulative offset
// math — a pinned column always docks at `left-0`/`right-0`, so it is only
// visually correct when the checkbox/action columns stay unpinned and at
// most one data column is pinned per side, which is this slice's contract.
type TableColumnPin = "left" | "right"

type TableHeadProps = React.ComponentProps<"th"> & {
  /**
   * Marks the header as interactive (sortable).
   * When true: adds hover background, `aria-sort`, and pointer cursor.
   * When omitted or false: header is visually static.
   *
   * Sortability is NOT inferred from `sortDirection` — pages must opt in
   * explicitly so a stray `sortDirection={undefined}` cannot silently make
   * every header appear interactive.
   */
  sortable?: boolean
  sortDirection?: TableSortDirection
  /** Pins this header cell to the left or right edge. See `TableColumnPin`. */
  pinned?: TableColumnPin
}

function TableHead({
  className,
  sortable = false,
  sortDirection,
  pinned,
  ...props
}: TableHeadProps) {
  const ariaSortValue = sortable
    ? sortDirection === "ascending"
      ? "ascending"
      : sortDirection === "descending"
        ? "descending"
        : "none"
    : undefined

  return (
    <th
      data-slot="table-head"
      data-sortable={sortable || undefined}
      data-pinned={pinned}
      aria-sort={ariaSortValue}
      className={cn(
        // Sticky lives on the <th> itself, not <thead> — position:sticky on
        // a table-section element (thead) is unreliable across browsers when
        // the table uses border-collapse (which this one does).
        "sticky top-0 z-10",
        "h-[var(--c-table-header-height)]",
        "border-b border-[var(--c-table-header-border-bottom)]",
        "bg-[var(--c-table-header-background-default)]",
        "pl-6 pr-2 py-2 text-left align-middle",
        "text-[length:var(--c-table-header-font-size)]",
        "font-[var(--c-table-header-font-weight)]",
        "leading-[var(--c-table-header-font-line-height)]",
        "text-[var(--c-table-header-text)]",
        "whitespace-nowrap",
        sortable && "hover:bg-[var(--c-table-header-background-hover)]",
        // Doubly-sticky (top + left/right) corner cell needs to outrank the
        // plain sticky-top header cells it sits beside during horizontal
        // scroll, and must stay above pinned body cells (z-[1] below).
        pinned === "left" && "left-0 z-20 border-r border-[var(--c-table-cell-border-column)]",
        // Offset by the action column's own width, not `right-0` — the
        // action column (TableActionHead) is always sticky-right itself
        // (see its own comment), so this column docks immediately to its
        // left instead of underneath it.
        pinned === "right" && "right-[var(--c-table-column-width-action)] z-20 border-l border-[var(--c-table-cell-border-column)]",
        className
      )}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------
// Selection cells — checkbox column at fixed action-column width, flex-centered
// ---------------------------------------------------------------------------

type TableSelectionHeadProps = Omit<React.ComponentProps<"th">, "children"> & {
  children?: React.ReactNode
}

function TableSelectionHead({ className, children, ...props }: TableSelectionHeadProps) {
  return (
    <th
      data-slot="table-selection-head"
      className={cn(
        "sticky top-0 z-10",
        "h-[var(--c-table-header-height)]",
        "border-b border-[var(--c-table-header-border-bottom)]",
        "w-[var(--c-table-column-width-action)] px-3",
        "bg-[var(--c-table-header-background-default)]",
        "align-middle",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-center">{children}</div>
    </th>
  )
}

type TableSelectionCellProps = Omit<React.ComponentProps<"td">, "children"> & {
  children?: React.ReactNode
}

function TableSelectionCell({ className, children, ...props }: TableSelectionCellProps) {
  return (
    <td
      data-slot="table-selection-cell"
      className={cn(
        "w-[var(--c-table-column-width-action)] px-3",
        "align-middle",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-center">{children}</div>
    </td>
  )
}

// ---------------------------------------------------------------------------
// Action cells — fixed action-column width; content revealed on row hover /
// keyboard focus / selected state. TableRow must have `group` (it does).
//
// Always sticky to the right edge (not conditional on any column being
// pinned): this column is a fixed-width, always-present structural column,
// always the last in DOM order. If a data column is right-pinned (see
// `TableColumnPin` below) but this column weren't also pinned, the two would
// fight over the same rightmost slot — the pinned data column would cover
// this one for most of the scroll range, making row actions unreachable
// until the scrollbar hit its absolute end. Right-pinned `TableHead`/
// `TableCell` offset by this column's width (`right-[var(--c-table-column-
// width-action)]`) rather than `right-0` so they dock immediately to its
// left instead of underneath it.
// ---------------------------------------------------------------------------

type TableActionHeadProps = React.ComponentProps<"th">

function TableActionHead({ className, ...props }: TableActionHeadProps) {
  return (
    <th
      data-slot="table-action-head"
      aria-label={props["aria-label"] ?? "Row actions"}
      className={cn(
        "sticky top-0 right-0 z-20",
        "h-[var(--c-table-header-height)]",
        "border-b border-[var(--c-table-header-border-bottom)]",
        "w-[var(--c-table-column-width-action)] px-3",
        "bg-[var(--c-table-header-background-default)]",
        className,
      )}
      {...props}
    />
  )
}

type TableActionCellProps = Omit<React.ComponentProps<"td">, "children"> & {
  children?: React.ReactNode
}

function TableActionCell({ className, children, ...props }: TableActionCellProps) {
  return (
    <td
      data-slot="table-action-cell"
      className={cn(
        "sticky right-0 z-[1]",
        "bg-[var(--c-table-cell-background-default)]",
        "group-hover:bg-[var(--c-table-cell-background-hover)]",
        "group-data-[state=selected]:bg-[var(--c-table-cell-background-selected)]",
        "w-[var(--c-table-column-width-action)] px-3",
        "align-middle",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex items-center justify-center",
          "opacity-0 transition-opacity",
          "group-hover:opacity-100",
          "focus-within:opacity-100",
          "group-data-[state=selected]:opacity-100",
        )}
      >
        {children}
      </div>
    </td>
  )
}

type TableSortDirection = "ascending" | "descending" | undefined

type TableSortHeaderProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  direction?: TableSortDirection
}

function TableSortHeader({
  direction,
  className,
  children,
  ...props
}: TableSortHeaderProps) {
  return (
    <button
      type="button"
      data-slot="table-sort-header"
      data-direction={direction}
      className={cn(
        "group/sort",
        "inline-flex items-center gap-1 rounded-sm outline-none",
        "text-[var(--c-table-header-text)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--c-table-focus-ring-color)]",
        className
      )}
      {...props}
    >
      <span>{children}</span>

      {direction ? (
        <PrismIcon
          name={direction === "ascending" ? "arrow-up" : "arrow-down"}
          size={16}
          className="text-[var(--c-table-header-icon-sort-active)]"
        />
      ) : (
        <PrismIcon
          name="arrow-down"
          size={16}
          className={cn(
            "opacity-0 transition-opacity",
            "group-hover/sort:opacity-100",
            "text-[var(--c-table-header-icon)]"
          )}
        />
      )}
    </button>
  )
}

function TableCell({
  className,
  align = "left",
  pinned,
  ...props
}: React.ComponentProps<"td"> & {
  align?: "left" | "right" | "center"
  /** Pins this cell to the left or right edge. Must match the column's `TableHead` `pinned` value. */
  pinned?: TableColumnPin
}) {
  const density = useTableDensity()
  return (
    <td
      data-slot="table-cell"
      data-align={align}
      data-pinned={pinned}
      className={cn(
        "overflow-hidden pl-6 pr-2",
        density === "compact" ? "py-2" : density === "comfortable" ? "py-4" : "py-3",
        "align-middle",
        "text-[var(--c-table-cell-text-default)]",
        "whitespace-nowrap text-ellipsis",
        "data-[align=right]:text-right",
        "data-[align=center]:text-center",
        // Pinned body cells need their own opaque, state-aware background —
        // unlike unpinned cells (transparent, relying on the row's own
        // background showing through), a sticky cell is repositioned over
        // other cells of the same row as they scroll underneath it, so it
        // must paint its own bg. Mirrors `TableRow`'s own
        // default/hover/selected tokens via `group`/`group-data` so the
        // pinned cell still visually reflects row hover/selection.
        pinned && [
          "sticky z-[1]",
          "bg-[var(--c-table-cell-background-default)]",
          "group-hover:bg-[var(--c-table-cell-background-hover)]",
          "group-data-[state=selected]:bg-[var(--c-table-cell-background-selected)]",
          pinned === "left" && "left-0 border-r border-[var(--c-table-cell-border-column)]",
          // Offset by the action column's width — see TableActionCell's
          // comment; TableActionCell is always sticky-right itself, so this
          // cell docks immediately to its left instead of underneath it.
          pinned === "right" && "right-[var(--c-table-column-width-action)] border-l border-[var(--c-table-cell-border-column)]",
        ],
        className
      )}
      {...props}
    />
  )
}

type TableEmptyStateProps = {
  colSpan: number
  title?: string
  body?: string
  primaryAction?: React.ReactNode
  secondaryAction?: React.ReactNode
  className?: string
}

function TableEmptyState({
  colSpan,
  title = "No data found",
  body,
  primaryAction,
  secondaryAction,
  className,
}: TableEmptyStateProps) {
  return (
    <tbody data-slot="table-empty-state-body">
      <tr>
        <td colSpan={colSpan} className="p-0">
    <div
      data-slot="table-empty-state"
      className={cn(
        "flex min-h-[368px] flex-col items-center justify-center gap-6 p-6",
        className
      )}
    >
      <div className="relative flex size-20 items-center justify-center rounded-lg border border-[var(--s-color-line-subtle)] bg-[var(--s-color-surface-muted)]">
        <span className="text-[length:var(--p-font-size-small)] leading-4 text-[var(--s-color-text-disabled)]">
          80×80
        </span>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center">
          <p className="text-[length:var(--p-font-size-h5)] font-semibold leading-[var(--p-font-line-height-h5)] text-[var(--s-color-text-default)]">
            {title}
          </p>
          {body && (
            <p className="max-w-[424px] text-center text-[length:var(--p-font-size-medium)] font-normal leading-[var(--p-font-line-height-medium)] text-[var(--s-color-text-subtlest)]">
              {body}
            </p>
          )}
        </div>

        {(secondaryAction || primaryAction) && (
          <div className="flex items-center gap-4">
            {secondaryAction}
            {primaryAction}
          </div>
        )}
      </div>
    </div>
        </td>
      </tr>
    </tbody>
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "mt-4 text-[length:var(--c-table-cell-font-size)] text-[var(--c-table-cell-text-subtlest)]",
        className
      )}
      {...props}
    />
  )
}

export {
  Table,
  TableActionCell,
  TableActionHead,
  TableBody,
  TableCaption,
  TableCell,
  TableEmptyState,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectionCell,
  TableSelectionHead,
  TableSortHeader,
  useTableDensity,
  type TableColumnPin,
  type TableDensity,
  type TableEmptyStateProps,
  type TableHeadProps,
  type TableSortDirection,
}
