import * as React from "react"

import { cn } from "@/lib/utils"
import { Accordion, AccordionItem } from "@/components/ui/accordion"
import { IconButton } from "@/components/ui/icon-button"
import { PrismIcon } from "@/components/ui/prism-icon"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

import type { PxAnalyticsNavSection, PxAnalyticsSecondaryNavProps } from "./types"

// -----------------------------------------------------------------------------
// PxAnalyticsSecondaryNav — Figma "Secondary Left Navigation - Analytics"
// (frame 9576:15005, Prism V1 - ShadCN, U3D8WMBVFl9LvAZyLHhm24), which
// defines TWO variants under a single `Property 1` prop:
//   - Property 1=Expanded (symbol 3397:2451, 312×664) — the default.
//   - Property 1=Collapsed (symbol 9576:15105, 56×664).
// This corrects an earlier revision that (a) placed the collapse control
// inside the Reports accordion's own header instead of a dedicated title
// row, and (b) used a plain line chevron + a custom "primary" button colour
// instead of Figma's actual filled-chevron asset — both now fixed against
// live Figma evidence rather than guessed.
//
// Anatomy — expanded (3397:2451):
//   - A "Title" row (node 9576:16007): `title` text (semibold, 16px/24px —
//     --t-font-heading-small-*) on the left, a 24x24 collapse button on the
//     right, 16px padding all around (--p-space-200), justify-between.
//   - Below it, the same fixed-order stack of independent On-Material
//     Accordion sections as before (each its own sibling instance in
//     Figma, not one exclusive group), each holding real navigation rows.
//
// Anatomy — collapsed (9576:15105):
//   - A 56px-wide column, 16px vertical padding (--p-space-200), NOT the
//     24px sliver this pattern used previously — Figma's actual collapsed
//     state is a full icon rail: a 24x24 expand button, then one 24px icon
//     per section (in section order), stacked with 24px gaps
//     (--p-space-300), all centered. This supersedes the prior "no
//     persistent mini-rail" avoidance — that was reasoned in the absence
//     of Figma evidence; this frame IS that evidence, supplied directly.
//     The per-section icons are decorative previews only (Figma shows no
//     interaction state for them) — marked aria-hidden.
//
// Collapse/expand icons (Figma node 491:83 family, "icons/filled/chevron-
// leftmenu-collapse-filled" / "-expand-filled"): rendered via IconButton's
// `iconStyle="filled"` from the existing repo assets, now also wired into
// the sized folder (src/assets/icons/filled/24/). These assets bake in a
// permanent blue circle + white chevron with NO separate hover/resting
// colour — verified this matches Figma's actual, static rendering (not
// merely a hover treatment), and matches this repo's own existing
// precedent for "filled" status icons (success/warning/danger/information-
// filled all bake in a fixed colour the same way). No new SVG was drawn,
// no icon path was hard-coded, and no bespoke button-colour variant was
// needed — reverted the earlier "primary" IconButton variant since the
// icon itself now supplies all the colour.
//
// Row semantics (see README "Semantic decision"): sub-page rows are real
// navigation destinations — <a href> when the item supplies one, otherwise
// <button> — with aria-current="page", not Tree/TreeItem (Figma specifies
// role="menuitem"/"link", not role="tree"/"treeitem"). Native Tab order,
// no roving tabindex.
//
// Scrolling: this panel does not scroll independently (design-owner
// decision) — overflow-hidden, only the caller's content area scrolls.
//
// Composed entirely from existing approved components — no new primitives:
//   - Accordion/AccordionItem (type="on-material", size={48}) per section.
//   - IconButton (iconStyle="filled") for the collapse/expand control.
//   - PrismIcon for each section's decorative icon in the collapsed rail.
//
// Known deviations from Figma — see README "Deviation ledger" for the
// full, per-item classification.
//
// API extension this pattern required (additive, non-breaking):
//   - IconButton: `iconStyle?: "line" | "filled"` (default "line" — every
//     existing consumer omits it and is byte-for-byte unchanged) and
//     `React.forwardRef` (no existing consumer passes a ref today).
//
// Collapsed-menu hover flyout (Figma frame 9576:17226, "Collapsed Menu
// Hover behaviour"): each 56x56 section-icon cell in the collapsed rail is
// a real, focusable trigger — hovering OR focusing it opens a flyout
// (Figma node 9576:17185, "FlyOut") showing that section's items, flush
// against the rail's right edge. Its own visual tokens
// (--c-dropdown-menu-*, --e-shadow-500) are an EXACT match for this repo's
// existing DropdownMenu/DropdownMenuItem components — reused directly
// rather than building a bespoke overlay. Clicking an item selects it
// (same onSelectItem callback as the expanded rows) without expanding the
// panel — Figma doesn't show that, and it's not requested. The hovered
// cell's own background (--s-color-surface-selected) matches the Figma
// reference exactly.
// Only one flyout is open at a time (state lives on the parent, not each
// row) with a short close-delay so the pointer can travel diagonally from
// the icon into the flyout without it closing (WCAG 1.4.13 "hoverable" +
// "persistent"). Opening on focus (not just hover) satisfies "dismissible
// by keyboard" — Escape (Radix's own handling) and moving focus away both
// close it.
// -----------------------------------------------------------------------------

function PxAnalyticsSecondaryNav({
  title,
  sections,
  activeItemId,
  onSelectItem,
  openSectionIds,
  onOpenSectionIdsChange,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  className,
}: PxAnalyticsSecondaryNavProps) {
  const [internalOpen, setInternalOpen] = React.useState<string[]>(() => sections.map((s) => s.id))
  const isSectionsControlled = openSectionIds !== undefined
  const openIds = isSectionsControlled ? openSectionIds : internalOpen
  const openSet = React.useMemo(() => new Set(openIds), [openIds])

  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed)
  const isCollapsedControlled = collapsed !== undefined
  const isCollapsed = isCollapsedControlled ? collapsed : internalCollapsed

  // Which collapsed-rail section flyout is open — at most one at a time.
  // A short close-delay lets the pointer travel from the icon into the
  // flyout without it closing first; the delayed close only acts if this
  // section is STILL the open one (a newly-hovered section may have
  // already taken over `openFlyoutId` by the time the timeout fires).
  const [openFlyoutId, setOpenFlyoutId] = React.useState<string | null>(null)
  const flyoutCloseTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  function openFlyout(sectionId: string) {
    if (flyoutCloseTimeoutRef.current) {
      clearTimeout(flyoutCloseTimeoutRef.current)
      flyoutCloseTimeoutRef.current = null
    }
    setOpenFlyoutId(sectionId)
  }

  function scheduleCloseFlyout(sectionId: string) {
    flyoutCloseTimeoutRef.current = setTimeout(() => {
      setOpenFlyoutId((current) => (current === sectionId ? null : current))
    }, 150)
  }

  function closeFlyoutNow() {
    if (flyoutCloseTimeoutRef.current) {
      clearTimeout(flyoutCloseTimeoutRef.current)
      flyoutCloseTimeoutRef.current = null
    }
    setOpenFlyoutId(null)
  }

  React.useEffect(
    () => () => {
      if (flyoutCloseTimeoutRef.current) clearTimeout(flyoutCloseTimeoutRef.current)
    },
    [],
  )

  const navId = React.useId()
  const navRef = React.useRef<HTMLElement | null>(null)
  const sectionRefs = React.useRef<Record<string, HTMLDivElement | null>>({})
  const prevOpenSetRef = React.useRef<Set<string>>(openSet)
  const collapseButtonRef = React.useRef<HTMLButtonElement | null>(null)
  const expandButtonRef = React.useRef<HTMLButtonElement | null>(null)
  const pendingFocusTargetRef = React.useRef<"collapse" | "expand" | null>(null)
  // Which section currently holds focus, tracked continuously via a
  // `focusin` listener rather than read reactively at close-time. This is
  // necessary, not stylistic: when a section's content unmounts (its rows
  // removed from the DOM), the browser synchronously blurs the
  // now-detached focused element to <body> as part of that same DOM
  // mutation — by the time any React effect runs afterward,
  // `document.activeElement` is already <body>, too late to tell which
  // section it came from. Recording focus continuously, before the
  // unmount happens, is the only reliable way to know.
  const focusedSectionRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    function handleFocusIn(event: FocusEvent) {
      const target = event.target
      if (!(target instanceof Node)) return
      for (const [id, container] of Object.entries(sectionRefs.current)) {
        if (container?.contains(target)) {
          focusedSectionRef.current = id
          return
        }
      }
      focusedSectionRef.current = null
    }
    nav.addEventListener("focusin", handleFocusIn)
    return () => nav.removeEventListener("focusin", handleFocusIn)
  }, [])

  function setOpenIds(next: string[]) {
    if (!isSectionsControlled) setInternalOpen(next)
    onOpenSectionIdsChange?.(next)
  }

  function toggleSection(sectionId: string, nextOpen: boolean) {
    const next = nextOpen ? [...openIds, sectionId] : openIds.filter((id) => id !== sectionId)
    setOpenIds(next)
  }

  function setCollapsed(next: boolean) {
    pendingFocusTargetRef.current = next ? "expand" : "collapse"
    if (!isCollapsedControlled) setInternalCollapsed(next)
    onCollapsedChange?.(next)
  }

  // Restore focus to a section's own header when a collapse removed the row
  // that held focus — otherwise focus silently drops to <body>. Covers both
  // an internal header click and an externally-driven `openSectionIds`
  // change (e.g. a controlled parent collapsing a section from outside)
  // via the same previous-vs-current open-set comparison.
  React.useEffect(() => {
    const previouslyOpen = prevOpenSetRef.current
    for (const sectionId of previouslyOpen) {
      if (openSet.has(sectionId)) continue // still open, nothing to restore
      if (focusedSectionRef.current === sectionId) {
        sectionRefs.current[sectionId]?.querySelector("button")?.focus()
        focusedSectionRef.current = null
        break
      }
    }
    prevOpenSetRef.current = openSet
  }, [openSet])

  // Move focus to the counterpart button on every collapse/expand toggle.
  // Unlike the section-focus-restoration effect above, this needs no
  // "was it actually focused" check: the ONLY way to reach this state
  // change is by activating the currently-visible toggle button, which is
  // always the element about to unmount — so unconditionally focusing the
  // newly-mounted counterpart is always correct.
  React.useEffect(() => {
    const target = pendingFocusTargetRef.current
    if (target === "expand") expandButtonRef.current?.focus()
    else if (target === "collapse") collapseButtonRef.current?.focus()
    pendingFocusTargetRef.current = null
  }, [isCollapsed])

  if (isCollapsed) {
    return (
      <div
        data-slot="px-analytics-secondary-nav-collapsed"
        className={cn(
          "flex h-full w-14 shrink-0 flex-col items-center",
          "border-r border-[var(--s-color-line-default)]",
          "bg-[var(--s-color-surface-default)]",
          className,
        )}
      >
        <div className="flex h-14 w-full shrink-0 items-center justify-center">
          <IconButton
            ref={expandButtonRef}
            icon="chevron-leftmenu-expand-filled"
            iconStyle="filled"
            label="Expand secondary navigation"
            aria-expanded={false}
            aria-controls={navId}
            onClick={() => setCollapsed(false)}
          />
        </div>
        {sections.map((section) => (
          <CollapsedSectionRow
            key={section.id}
            section={section}
            activeItemId={activeItemId}
            onSelectItem={onSelectItem}
            open={openFlyoutId === section.id}
            onOpenIntent={() => openFlyout(section.id)}
            onCloseIntent={() => scheduleCloseFlyout(section.id)}
            onCloseNow={closeFlyoutNow}
          />
        ))}
      </div>
    )
  }

  return (
    <nav
      ref={navRef}
      id={navId}
      aria-label="Analytics navigation"
      data-slot="px-analytics-secondary-nav"
      className={cn(
        "flex h-full w-[312px] shrink-0 flex-col overflow-hidden",
        "border-r border-[var(--s-color-line-default)]",
        "bg-[var(--s-color-surface-default)]",
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between p-[var(--p-space-200)]">
        <span className="truncate text-[length:var(--t-font-heading-small-size)] font-[number:var(--t-font-heading-small-weight)] leading-[var(--t-font-heading-small-line-height)] text-[var(--s-color-text-default)]">
          {title}
        </span>
        <IconButton
          ref={collapseButtonRef}
          icon="chevron-leftmenu-collapse-filled"
          iconStyle="filled"
          label="Collapse secondary navigation"
          aria-expanded={true}
          aria-controls={navId}
          onClick={() => setCollapsed(true)}
          className="shrink-0"
        />
      </div>

      {sections.map((section) => {
        const isOpen = openSet.has(section.id)
        return (
          <div key={section.id} ref={(el) => { sectionRefs.current[section.id] = el }}>
            <Accordion
              type="on-material"
              size={48}
              value={isOpen ? section.id : undefined}
              onValueChange={(value) => toggleSection(section.id, value === section.id)}
            >
              <AccordionItem value={section.id} title={section.label} icon={section.icon} contentPadding={false}>
                <div className="flex flex-col">
                  {section.items.map((item) => (
                    <NavRow
                      key={item.id}
                      label={item.label}
                      href={item.href}
                      active={item.id === activeItemId}
                      onSelect={() => onSelectItem(item.id, section.id)}
                    />
                  ))}
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        )
      })}
    </nav>
  )
}

// -----------------------------------------------------------------------------
// NavRow — a single sub-page destination. Real <a> when `href` is supplied
// (real routing consumers), otherwise a <button> that only changes local
// state (this demo app's own model, matching PxShellRail's primary nav).
// Visual recipe matches Figma's Tree/Item Level=2 geometry exactly (48px
// left indent, 16px right, 32px row height) without delegating to the
// shared Tree component, whose role="tree"/"treeitem" semantics do not fit
// real navigation — see README "Semantic decision".
// -----------------------------------------------------------------------------

function NavRow({
  label,
  href,
  active,
  onSelect,
}: {
  label: string
  href?: string
  active: boolean
  onSelect: () => void
}) {
  const rowClassName = cn(
    "flex h-8 w-full items-center py-[var(--p-space-050)] pr-[var(--p-space-200)] pl-[48px] outline-none",
    "text-left text-[length:var(--t-tree-font-default-size)] leading-[var(--t-tree-font-default-line-height)] font-[number:var(--t-tree-font-default-weight)]",
    "truncate text-[var(--s-color-text-default)]",
    "bg-[var(--c-tree-branch-default)]",
    !active && "hover:bg-[var(--c-tree-branch-hover)]",
    active && "bg-[var(--c-tree-branch-selected)]",
    "focus-visible:shadow-[var(--e-shadow-focus)]",
  )

  if (href) {
    return (
      <a href={href} aria-current={active ? "page" : undefined} className={rowClassName} onClick={onSelect}>
        {label}
      </a>
    )
  }

  return (
    <button type="button" aria-current={active ? "page" : undefined} className={rowClassName} onClick={onSelect}>
      {label}
    </button>
  )
}

// -----------------------------------------------------------------------------
// CollapsedSectionRow — one 56x56 icon cell in the collapsed rail (Figma
// frame 9576:17226). Hovering or focusing it opens a flyout listing that
// section's items, reusing the shared DropdownMenu/DropdownMenuItem
// components — their existing --c-dropdown-menu-*/--e-shadow-500 tokens
// are an exact match for Figma's FlyOut (node 9576:17185). `modal={false}`
// on the DropdownMenu root: this is a lightweight hover surface, not a
// modal menu — it must not trap focus or disable pointer events elsewhere
// on the page the way a click-opened menu would.
// -----------------------------------------------------------------------------

function CollapsedSectionRow({
  section,
  activeItemId,
  onSelectItem,
  open,
  onOpenIntent,
  onCloseIntent,
  onCloseNow,
}: {
  section: PxAnalyticsNavSection
  activeItemId?: string
  onSelectItem: (itemId: string, sectionId: string) => void
  open: boolean
  onOpenIntent: () => void
  onCloseIntent: () => void
  onCloseNow: () => void
}) {
  // Radix returns focus to the trigger button whenever the content closes
  // (its default `onCloseAutoFocus` behavior) — for EVERY close path, not
  // just Escape: outside click, item select, and this row's own hover/blur
  // -driven close all end the same way, with `open` flipping to false and
  // focus landing back on the trigger. Without this guard, that synthetic
  // refocus would immediately re-fire the trigger's onFocus handler and
  // reopen the flyout, making every close path appear to do nothing.
  // Watching the `open` prop itself (rather than gating inside individual
  // close handlers) is what makes this catch all of them uniformly.
  const suppressReopenRef = React.useRef(false)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const wasOpenRef = React.useRef(open)

  React.useEffect(() => {
    if (wasOpenRef.current && !open) {
      suppressReopenRef.current = true
      // Radix's exit-animation keeps the content mounted for the duration
      // of the animate-out transition (~150ms) before actually unmounting
      // and returning focus to the trigger — the suppression window must
      // outlast that animation, not just the current paint.
      const timeout = setTimeout(() => {
        suppressReopenRef.current = false
      }, 300)
      wasOpenRef.current = open
      return () => clearTimeout(timeout)
    }
    wasOpenRef.current = open
  }, [open])

  function handleOpenIntent() {
    if (suppressReopenRef.current) return
    onOpenIntent()
  }

  // Radix moves focus from the trigger into the flyout's first item as
  // soon as it opens (keyboard-triggered open, e.g. Tab). That blurs the
  // trigger — without this check, the trigger's onBlur would read that as
  // "focus left the whole component" and schedule a close, even though
  // focus only moved into the flyout itself. Only schedule the close when
  // focus is landing somewhere outside BOTH the trigger and the content
  // (the content is portaled elsewhere in the DOM, so it's identified by
  // its own role="menu" rather than a ref).
  function handleBlur(event: React.FocusEvent) {
    const next = event.relatedTarget as HTMLElement | null
    if (next && (triggerRef.current?.contains(next) || next.closest('[role="menu"]'))) return
    onCloseIntent()
  }

  return (
    <DropdownMenu
      modal={false}
      open={open}
      onOpenChange={(next) => {
        // Radix itself decided to close (Escape, outside click, or item
        // select) — honor that immediately rather than through the
        // hover-intent delay, which exists only for mouse/focus travel
        // between the trigger and the flyout.
        if (!next) onCloseNow()
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={section.label}
          onMouseEnter={handleOpenIntent}
          onMouseLeave={onCloseIntent}
          onFocus={handleOpenIntent}
          onBlur={handleBlur}
          onClick={handleOpenIntent}
          className={cn(
            "flex h-14 w-full shrink-0 items-center justify-center outline-none",
            open ? "bg-[var(--s-color-surface-selected)]" : "hover:bg-[var(--s-color-surface-selected)]",
            "focus-visible:shadow-[var(--e-shadow-focus)]",
          )}
        >
          <PrismIcon name={section.icon} size={24} decorative />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={0}
        onMouseEnter={onOpenIntent}
        onMouseLeave={onCloseIntent}
        onBlur={handleBlur}
        className="w-max min-w-[160px]"
      >
        {section.items.map((item) => {
          const active = item.id === activeItemId
          return (
            <DropdownMenuItem
              key={item.id}
              asChild={!!item.href}
              selected={active}
              onSelect={() => onSelectItem(item.id, section.id)}
            >
              {item.href ? (
                <a href={item.href} aria-current={active ? "page" : undefined}>
                  {item.label}
                </a>
              ) : (
                item.label
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { PxAnalyticsSecondaryNav }
