import * as React from "react"

import { cn } from "@/lib/utils"
import { IconButton } from "@/components/ui/icon-button"

// -----------------------------------------------------------------------------
// TableFrame — Table's own intrinsic anatomy: Toolbar → Table → optional
// Pagination. Figma source: Table page (node 20:34, "Table 🟢"), "SECTION 4 —
// TOOLBAR & PAGINATION" (Table/Toolbar symbol 1896:6 + Pagination), and Shell/
// Table Customisation (3187:9). The Toolbar is present by default — Table's
// own Dos/Don'ts explicitly say to reflect the filtered record count in its
// title ("Accounts (12)" not "Accounts (247)") and to place Column Selector/
// row density there, never in the header row.
//
// This is a *frame*, not a feature: it owns title/count layout, the RHS
// icon-group chrome (search reveal, filter toggle, and whatever slots the
// caller supplies), and the surface treatment below. It does not own search
// query state, filter predicate logic, sort state, or column/density state —
// those stay in the composing screen or in whatever component fills a slot
// (e.g. <TableCustomizationMenu> for column selector + row density).
//
// Surface rule (PX-wide, see CLAUDE.md's Product Surface Rule —
// verified against List Page / Content Area, node 3302:6): a table sitting
// directly on the product/page background gets `surface="page"` (shadow-100,
// no border); a table nested inside another already-elevated surface (e.g.
// inside a Modal) gets `surface="nested"` (border, no shadow). Never both.
// -----------------------------------------------------------------------------

type TableFrameSurface = "page" | "nested"

type TableFrameSearchSlot = {
  /** The caller-supplied <SearchBar> (or equivalent), rendered when `open`. */
  render: React.ReactNode
  open: boolean
  onToggle: () => void
}

type TableFrameFilterSlot = {
  active: boolean
  onToggle: () => void
}

type TableFrameProps = {
  /** Table/list title, e.g. "Accounts". */
  title: React.ReactNode
  /** Appended as "(N)" per Table's own Dos rule — pass the *filtered* count. */
  count?: number
  /**
   * Secondary status text next to the title (e.g. "3 selected"), rendered in
   * a subtler tone. Not part of Figma's Toolbar anatomy itself — a small,
   * generic extension for feature-owned bulk-selection UX.
   */
  subtitle?: React.ReactNode
  /**
   * Directly on the product/page background (default) vs. nested inside
   * another already-elevated surface. See the Surface rule note above.
   */
  surface?: TableFrameSurface
  /** Search icon that reveals a caller-supplied SearchBar — never an
   * always-open input, per Figma's own collapsed-icon Toolbar anatomy. */
  search?: TableFrameSearchSlot
  /** Filter icon that toggles a caller-supplied filter surface below. */
  filter?: TableFrameFilterSlot
  /** Row density + column selector, e.g. <TableCustomizationMenu>. */
  customization?: React.ReactNode
  /** CTA(s), e.g. <Button>/<SplitButton>. Rendered right-most. */
  actions?: React.ReactNode
  /** <Table>… plus an optional <Pagination> below it. */
  children: React.ReactNode
  className?: string
}

const SURFACE_CLASS: Record<TableFrameSurface, string> = {
  page: "bg-[var(--s-color-surface-page)] shadow-[var(--e-shadow-100)]",
  nested: "bg-[var(--s-color-surface-default)] border border-[var(--s-color-line-default)]",
}

function TableFrame({
  title,
  count,
  subtitle,
  surface = "page",
  search,
  filter,
  customization,
  actions,
  children,
  className,
}: TableFrameProps) {
  const hasRhs = Boolean(search || filter || customization || actions)

  return (
    <section
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[var(--p-radius-150)]",
        SURFACE_CLASS[surface],
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-[var(--p-space-200)] p-[var(--p-space-200)]",
          "bg-[var(--s-color-surface-default)]",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-[var(--p-space-200)]">
          <span className="min-w-0 truncate text-[length:var(--p-font-size-h6)] font-[var(--p-font-weight-medium)] leading-[var(--p-font-line-height-h6)] text-[var(--s-color-text-default)]">
            {title}
            {count !== undefined ? ` (${count.toLocaleString()})` : ""}
          </span>
          {subtitle && (
            <span className="shrink-0 text-[length:var(--p-font-size-small)] leading-[var(--p-font-line-height-small)] text-[var(--s-color-text-subtlest)]">
              {subtitle}
            </span>
          )}
        </div>

        {hasRhs && (
          <div className="flex shrink-0 items-center gap-[var(--p-space-050)]">
            {search && (
              <IconButton
                icon="search"
                label={search.open ? "Hide search" : "Show search"}
                appearance="toolbar"
                pressed={search.open}
                onClick={search.onToggle}
              />
            )}
            {filter && (
              <IconButton
                icon="filter"
                label={filter.active ? "Hide filters" : "Show filters"}
                appearance="toolbar"
                pressed={filter.active}
                onClick={filter.onToggle}
              />
            )}
            {customization}
            {actions}
          </div>
        )}
      </div>

      {search?.open && (
        <div
          className={cn(
            "shrink-0 border-t border-[var(--s-color-line-default)]",
            "bg-[var(--s-color-surface-default)]",
            "px-[var(--p-space-200)] py-[var(--p-space-100)]",
          )}
        >
          {search.render}
        </div>
      )}

      {children}
    </section>
  )
}

export { TableFrame }
export type { TableFrameProps, TableFrameSurface, TableFrameSearchSlot, TableFrameFilterSlot }
