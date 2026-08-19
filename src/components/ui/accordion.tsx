import * as React from "react"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import type { PrismIconName } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// Accordion — Figma "Accordion" (node 1273:6, Prism V1 - ShadCN).
//
// Progressive disclosure component: header row with a chevron + expandable
// content. Composes into <Accordion> (group container) → <AccordionItem>
// (individual expandable row). Group manages "only one open at a time" via
// controlled `openValue` / `onValueChange` or uncontrolled `defaultValue`.
//
// Sizes (header row height): 48 (compact), 56 (DEFAULT), 64 (with subtitle).
// Types govern the item's outer shell:
//   off-material  — 1px border, radius/150, no shadow. For standalone cards
//                   on the page surface.
//   off-material-shadow — shadow/400, no border. For floating cards.
//   on-material   — bottom hairline only, no fill, no radius. Requires a
//                   distinct parent surface (Figma's own "Don't use without
//                   a coloured parent" rule).
//
// State selectors: aria-expanded on the header button drives chevron
// rotation and (for off-material types) hover background. Content panel
// uses conditional rendering rather than aria-hidden so screen readers
// don't see stale content when closed.
// -----------------------------------------------------------------------------

type AccordionSize = 48 | 56 | 64
type AccordionType = "off-material" | "off-material-shadow" | "on-material"

const SIZE_HEIGHT: Record<AccordionSize, string> = {
  48: "h-12",
  56: "h-14",
  64: "h-16",
}

// Prism binds accordion/padding/48 (12), accordion/padding/56 (16),
// accordion/padding/64 (20 default / 24 for shadow variant). Vertical padding
// only; horizontal padding is always space/200 (16px).
const SIZE_PADDING_Y: Record<AccordionSize, string> = {
  48: "py-[var(--c-accordion-padding-48)]",
  56: "py-[var(--c-accordion-padding-56)]",
  64: "py-[var(--c-accordion-padding-64)]",
}

type AccordionContextValue = {
  openValue: string | undefined
  setOpenValue: (value: string | undefined) => void
  size: AccordionSize
  type: AccordionType
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

type AccordionProps = {
  /** Currently open item value (controlled). */
  value?: string
  /** Initially open item (uncontrolled). */
  defaultValue?: string
  onValueChange?: (value: string | undefined) => void
  size?: AccordionSize
  type?: AccordionType
  children: React.ReactNode
  className?: string
}

function Accordion({
  value,
  defaultValue,
  onValueChange,
  size = 56,
  type = "off-material",
  children,
  className,
}: AccordionProps) {
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue)
  const openValue = value ?? internal

  const setOpenValue = (next: string | undefined) => {
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }

  return (
    <AccordionContext.Provider value={{ openValue, setOpenValue, size, type }}>
      <div
        className={cn(
          "flex flex-col",
          // On-material items share a bottom hairline so they read as a group;
          // off-material types stack with the item's own outer border/shadow.
          type === "on-material" ? "gap-0" : "gap-[var(--c-accordion-gap)]",
          className,
        )}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

type AccordionItemProps = {
  value: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  icon?: PrismIconName
  children: React.ReactNode
  className?: string
}

function AccordionItem({ value, title, subtitle, icon, children, className }: AccordionItemProps) {
  const ctx = React.useContext(AccordionContext)
  if (!ctx) throw new Error("<AccordionItem> must be used inside <Accordion>.")

  const { openValue, setOpenValue, size, type } = ctx
  const isOpen = openValue === value
  const headerId = React.useId()
  const panelId = `${headerId}-panel`

  const shellClass = cn(
    type === "off-material" && "rounded-[var(--p-radius-150)] border border-[var(--c-accordion-border)] bg-[var(--c-accordion-background)]",
    type === "off-material-shadow" && "rounded-[var(--p-radius-150)] bg-[var(--c-accordion-background)] shadow-[var(--e-shadow-400)]",
    type === "on-material" && "border-b border-[var(--c-accordion-border)]",
    className,
  )

  return (
    <div className={shellClass}>
      <button
        id={headerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setOpenValue(isOpen ? undefined : value)}
        className={cn(
          "flex w-full items-center gap-[var(--p-space-200)] px-[var(--p-space-200)]",
          SIZE_HEIGHT[size],
          SIZE_PADDING_Y[size],
          "text-left outline-none transition-colors",
          type !== "on-material" && "hover:bg-[var(--c-accordion-background-hover)]",
          type === "off-material" && "rounded-[var(--p-radius-150)]",
          type === "off-material-shadow" && "rounded-[var(--p-radius-150)]",
        )}
      >
        {icon ? (
          <PrismIcon
            name={icon}
            size={24}
            decorative
            className="shrink-0 text-[var(--s-icon-color-default)]"
          />
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[length:var(--t-font-heading-xsmall-size)] font-[number:var(--t-font-heading-xsmall-weight)] leading-[var(--t-font-heading-xsmall-line-height)] text-[var(--c-accordion-label)]">
            {title}
          </span>
          {subtitle ? (
            <span className="truncate text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] text-[var(--s-color-text-subtle)]">
              {subtitle}
            </span>
          ) : null}
        </div>
        <PrismIcon
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={24}
          decorative
          className="shrink-0 text-[var(--s-icon-color-default)]"
        />
      </button>
      {isOpen ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          className={cn(
            "px-[var(--p-space-200)] pb-[var(--p-space-200)]",
            "text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] text-[var(--s-color-text-default)]",
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}

export { Accordion, AccordionItem }
export type { AccordionProps, AccordionItemProps, AccordionSize, AccordionType }
