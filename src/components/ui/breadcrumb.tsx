import * as React from "react"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// Breadcrumb — Prism DS anatomy (verified against prism-ds/src/components/
// Breadcrumb, Figma node 20:28). Horizontal trail with chevron-right
// separators; last item is always the current page (aria-current="page").
// Non-current items render as links (<a>) when `href` is supplied, else
// buttons calling `onItemClick`.
//
// Truncation: when items exceed `maxItems` (default 4) and the trail is not
// expanded, the middle collapses to an ellipsis button. Clicking the
// ellipsis reveals the hidden items — always keeps root + (maxItems - 2)
// trailing items visible.
//
// No dedicated component tokens exist for Breadcrumb — uses semantic
// s-color-action-primary-default for links, s-color-text-default for the
// current page, and s-icon-color-subtle for the chevron. Font sits on
// body/medium (14/24 Regular) with medium weight on the current item.
// -----------------------------------------------------------------------------

type BreadcrumbItem = {
  id: string
  label: string
  href?: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  onItemClick?: (id: string) => void
  /** Max visible items before the middle collapses to an ellipsis. Default 4. */
  maxItems?: number
  className?: string
}

type VisibleEntry =
  | { kind: "item"; item: BreadcrumbItem }
  | { kind: "truncate" }

function computeVisible(
  items: BreadcrumbItem[],
  maxItems: number,
  expanded: boolean,
): VisibleEntry[] {
  if (expanded || items.length <= maxItems) {
    return items.map((item) => ({ kind: "item" as const, item }))
  }
  const head = items[0]
  const tail = items.slice(-(maxItems - 2))
  return [
    { kind: "item", item: head },
    { kind: "truncate" },
    ...tail.map((item) => ({ kind: "item" as const, item })),
  ]
}

function Breadcrumb({ items, onItemClick, maxItems = 4, className }: BreadcrumbProps) {
  const [expanded, setExpanded] = React.useState(false)
  const visible = computeVisible(items, maxItems, expanded)

  return (
    <nav aria-label="Breadcrumb" className={cn("inline-flex items-center", className)}>
      <ol className="flex list-none items-center gap-[var(--p-space-050)] p-0">
        {visible.map((entry, idx) => {
          const isLast = idx === visible.length - 1

          if (entry.kind === "truncate") {
            return (
              <li key="truncate" className="inline-flex items-center">
                <button
                  type="button"
                  aria-label="Show hidden levels"
                  onClick={() => setExpanded(true)}
                  className={cn(
                    "inline-flex items-center px-[var(--p-space-025)]",
                    "rounded-[var(--p-radius-050)]",
                    "text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)]",
                    "text-[var(--s-color-action-primary-default)]",
                    "hover:underline focus-visible:shadow-[var(--e-shadow-focus)] outline-none",
                  )}
                >
                  …
                </button>
                <Separator />
              </li>
            )
          }

          const item = entry.item

          if (isLast) {
            return (
              <li key={item.id} className="inline-flex items-center">
                <span
                  aria-current="page"
                  className={cn(
                    "text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)]",
                    "font-medium text-[var(--s-color-text-default)]",
                  )}
                >
                  {item.label}
                </span>
              </li>
            )
          }

          return (
            <li key={item.id} className="inline-flex items-center">
              {item.href ? (
                <a
                  href={item.href}
                  onClick={
                    onItemClick
                      ? (event) => {
                          event.preventDefault()
                          onItemClick(item.id)
                        }
                      : undefined
                  }
                  className={cn(
                    "px-[var(--p-space-025)] rounded-[var(--p-radius-050)]",
                    "text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)]",
                    "text-[var(--s-color-action-primary-default)]",
                    "hover:underline focus-visible:shadow-[var(--e-shadow-focus)] outline-none",
                  )}
                >
                  {item.label}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => onItemClick?.(item.id)}
                  className={cn(
                    "px-[var(--p-space-025)] rounded-[var(--p-radius-050)]",
                    "text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)]",
                    "text-[var(--s-color-action-primary-default)]",
                    "hover:underline focus-visible:shadow-[var(--e-shadow-focus)] outline-none",
                  )}
                >
                  {item.label}
                </button>
              )}
              <Separator />
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function Separator() {
  return (
    <span aria-hidden="true" className="inline-flex items-center px-[var(--p-space-050)] text-[var(--s-icon-color-subtle)]">
      <PrismIcon name="chevron-right" size={16} decorative />
    </span>
  )
}

export { Breadcrumb }
export type { BreadcrumbProps, BreadcrumbItem }
