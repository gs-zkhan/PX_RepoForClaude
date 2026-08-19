import * as React from "react"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"

type PaginationProps = React.HTMLAttributes<HTMLDivElement> & {
  page: number
  pageCount: number
  pageSize: number
  totalItems: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

function Pagination({
  page,
  pageCount,
  pageSize,
  totalItems,
  pageSizeOptions = [10, 25, 50],
  onPageChange,
  onPageSizeChange,
  className,
  ...props
}: PaginationProps) {
  const isFirstPage = page <= 1
  const isLastPage = page >= pageCount

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, totalItems)

  function goToPage(nextPage: number) {
    onPageChange(Math.min(Math.max(nextPage, 1), pageCount))
  }

  return (
    <div
      data-slot="pagination"
      className={cn(
        "flex h-[var(--c-table-pagination-height)] items-center justify-between",
        "bg-[var(--c-pagination-background)]",
        "px-[var(--c-pagination-padding-horizontal)]",
        "text-[length:var(--c-pagination-font-size)]",
        "font-[var(--c-pagination-font-weight)]",
        "leading-[var(--c-pagination-font-line-height)]",
        "text-[var(--c-pagination-content-default)]",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-[var(--c-pagination-gap)]">
        <span className="text-[var(--c-pagination-content-subtle)]">
          {rangeStart}-{rangeEnd} of {totalItems}
        </span>

        <span
          aria-hidden="true"
          className="h-6 w-px bg-[var(--c-pagination-divider)]"
        />

        <label className="flex items-center gap-[var(--c-pagination-per-page-gap)]">
          <select
            value={pageSize}
            onChange={(event) =>
              onPageSizeChange?.(Number(event.target.value))
            }
            className={cn(
              "appearance-none bg-transparent pr-6 outline-none",
              "font-[var(--c-pagination-font-weight-strong)]",
              "text-[var(--c-pagination-content-default)]",
              "cursor-pointer"
            )}
            aria-label="Rows per page"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <PrismIcon
            name="chevron-down"
            size={16}
            className="-ml-6 pointer-events-none text-[var(--c-pagination-icon-default)]"
          />

          <span className="text-[var(--c-pagination-content-subtle)]">
            Per page
          </span>
        </label>

        <span
          aria-hidden="true"
          className="h-6 w-px bg-[var(--c-pagination-divider)]"
        />
      </div>

      <div className="flex items-center gap-[var(--c-pagination-gap)]">
        <PaginationButton
          label="Previous page"
          disabled={isFirstPage}
          onClick={() => goToPage(page - 1)}
        >
          <PrismIcon name="chevron-left" size={24} />
        </PaginationButton>

        <button
          type="button"
          aria-current="page"
          className={cn(
            "inline-flex h-6 w-8 items-center justify-center",
            "rounded-[var(--c-pagination-pill-radius)]",
            "font-[var(--c-pagination-font-weight-strong)]",
            "text-[var(--c-pagination-pill-content)]",
            "outline-none",
            "hover:bg-[var(--c-pagination-pill-background-hover)]",
            "focus:border focus:border-[var(--c-pagination-pill-border-active)]",
            "focus:bg-[var(--c-pagination-pill-background-active)]"
          )}
        >
          {page}
        </button>

        <PaginationButton
          label="Next page"
          disabled={isLastPage}
          onClick={() => goToPage(page + 1)}
        >
          <PrismIcon name="chevron-right" size={24} />
        </PaginationButton>
      </div>
    </div>
  )
}

type PaginationButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string
  }

function PaginationButton({
  label,
  className,
  children,
  ...props
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex size-6 items-center justify-center",
        "rounded-[var(--c-pagination-pill-radius)]",
        "text-[var(--c-pagination-icon-default)]",
        "outline-none",
        "hover:bg-[var(--c-pagination-pill-background-hover)]",
        "focus-visible:ring-2",
        "focus-visible:ring-[var(--c-pagination-pill-border-active)]",
        "disabled:cursor-not-allowed",
        "disabled:text-[var(--c-pagination-icon-disabled)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { Pagination }
export type { PaginationProps }
