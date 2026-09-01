import * as React from "react"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import { IconButton } from "@/components/ui/icon-button"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { getBadgeDisplayCount, getUnreadCount, shouldShowViewAll, computeAutoAlign } from "@/lib/notification"

// -----------------------------------------------------------------------------
// Notification — Figma "Notification" page (1273:7), three separate,
// same-file component sets, all verified live via get_metadata/
// get_design_context:
//   Notification/Badge  — component set 3176:38, 4 variants (Small/Medium/
//     Large/Large With Number). Overlays the bell icon in the Shell nav bar.
//   Notification/Item   — component set 7196:426, 16 variants (Type × Read ×
//     Hover). A single panel-list row — never used outside a Panel.
//   Notification/Panel  — component set 7197:157, 2 variants (State=Empty/
//     Populated). The popover container opened from the bell icon.
// AI Instructions: 7195:378. Dos/Don'ts: 7195:422.
//
// SCOPE DECISION (2026-08-31, design-owner override — see
// ai/figma-coverage.json id component-notification for the full record):
// the Notification AI Instructions node's own "Purpose" section literally
// states "Out of scope for current release." That is preserved verbatim as
// historical evidence in the coverage entry. The design owner explicitly
// requested implementation regardless — this file exists because of that
// override, not because the original release-scope note was wrong or
// ignored. That override authorized implementation only; it did not by
// itself constitute approval — visual approval followed as a separate,
// later event the same day (see STATUS below).
//
// Anchored-use rule, same as ColorPicker (Mandatory Composition Rule):
// Figma's own component descriptions say Badge/Item/Panel must never be
// used standalone ("Badge... sits inside PX Shell Navigation Bar — do not
// use standalone"; "Always stack items inside Notification/Panel — never
// use standalone"; Panel is "Opened from the bell icon"). `NotificationBell`
// (Popover-anchored bell trigger + badge + panel) is the ONE recommended,
// consumer-facing composition. `NotificationBadge`/`NotificationItem`/
// `NotificationPanel` remain exported ONLY as internal/compositional
// anatomy modules — for building `NotificationBell` and for clearly-labelled
// review/anatomy inspection in the Validation Gallery, matching the
// ColorPickerBasic/ColorPickerAdvanced precedent exactly.
//
// Evidence conflicts (documented, not silently resolved):
//
// 1. Dismiss-button visibility. Notification/Item's own component
//    description says "The Dismiss icon (×) appears on hover" (implying
//    hover-only visibility), but the Dos/Don'ts explicitly overrides this:
//    "Always show the Dismiss (×) button on every Item... Never hide it —
//    even on Danger/Unread items." The Dos/Don'ts is the stronger, more
//    explicit rule (it directly says "never hide it"), so Dismiss is always
//    rendered, not hover-gated. This also matches the actual rendered
//    Populated-panel screenshot, where every item's × is visible regardless
//    of hover.
//
// 2. Hover as a CSS state, not a prop. Read=Unread/Read and Type are real
//    content props; Hover=True/False in Figma's variant grid is a rendered
//    snapshot of the real `:hover` pseudo-state, not a separate boolean a
//    caller would ever set — so `NotificationItem` has no `hover` prop; the
//    hover background (`--c-notification-item-bg-hover`) is applied via a
//    real Tailwind `hover:` class, exactly matching how ColorPicker's Basic
//    swatches handle `focus-visible` as a real pseudo-class rather than a
//    prop.
//
// 3. "Mark all as read" header action. Both the Panel's own component
//    description ("Mark-all-read action sits in the panel header") AND the
//    Dos/Don'ts ("'Mark all as read' is a panel-level action on the header")
//    assert this control exists — but the actual extracted Populated-panel
//    anatomy (get_design_context on 7197:157) renders only a bell icon,
//    "Notifications" title, an unread-count badge, and a single "×" button
//    in the header — no second, separate mark-all-read control anywhere in
//    the rendered structure. The "×" is the panel's own close control (it
//    closes the Popover — matching the AI Instructions' Accessibility note,
//    "Keyboard: ... Escape closes panel"), not mark-all-read. Per this
//    repo's rule to trust structural evidence over conflicting prose: no
//    fabricated header button is added. Since the prose is repeated in two
//    independent places, `NotificationPanel` accepts an optional
//    `onMarkAllRead` callback — when supplied, a "Mark all as read" tertiary
//    text button renders in the header (matching the Footer's own
//    already-evidenced tertiary-button treatment for "View all
//    notifications"); when omitted, nothing renders and the header matches
//    the literal evidenced anatomy exactly. This is a reasoned reconciliation
//    under an acknowledged evidence gap, not a guess either way.
//
// Icons: all sourced from the existing Prism icon set, at Figma's evidenced
//24px size, no approximations needed — `notifications` (bell trigger),
// `cancel` (dismiss/close), and the filled status set (`information-filled`/
// `success-filled`/`warning-filled`/`danger-filled`, iconStyle="filled")
// already used identically by Toast/Banner for the same four intents.
//
// Tokens: the full `--c-notification-*` component-token family (26 tokens)
// already existed in prism-generated.css before this component did — this
// implementation uses them directly, inventing none.
//
// Accessibility (per AI Instructions' own Accessibility section, verified
// node 7195:406): Panel `role="region" aria-label="Notifications"`; item
// list `role="list"`; each item `role="listitem"`; unread items prepend
// "Unread — " to their accessible name; Dismiss `aria-label="Dismiss
// notification"`; Badge conveys unread count via the trigger's own
// aria-label, not a separate live region — an unread badge count changing
// is not urgent/interruptive enough to warrant `aria-live`, and Popover's
// own focus/Escape handling already manages the panel's open/close
// announcement, avoiding a duplicate live-region announcement on top of
// Radix's own.
//
// Design-owner review corrections (applied in place, see the specific
// sections/comments below for each): the header's own bell icon was
// requesting a non-existent icon-asset size folder and silently rendering
// nothing (`PrismIcon size=20` with no `sourceSize`, when the source SVGs
// only exist at 16/24/32/48/64px) — this, not the header's own padding
// tokens (which were already correct and symmetric), was the actual cause
// of the reported left/right spacing imbalance; fixed via `sourceSize={24}`.
// `NotificationBell`'s popover `align` was first hardcoded to "end", then
// briefly a manually-supplied "start"/"end" prop — neither satisfies
// "location-aware"; it is now computed automatically from the trigger's
// real measured position via `computeAutoAlign` (src/lib/notification.ts),
// recalculated on open and on window resize, with `align` remaining only
// as an explicit escape-hatch override. The trigger badge's overlap was
// reduced to a small, corner-centred amount. Unread rows no longer carry a
// tinted background — the dot alone signals unread, per direct
// design-owner instruction. "View all notifications" no longer waits for a
// 20-item threshold that the real rendered anatomy never actually gated on.
//
// STATUS: Approved. Design-owner visual review complete 2026-08-31.
// Visual Review: Approved. Approved for AI use: Yes.
// -----------------------------------------------------------------------------

type NotificationType = "info" | "success" | "warning" | "danger"

const TYPE_ICON: Record<NotificationType, string> = {
  info: "information-filled",
  success: "success-filled",
  warning: "warning-filled",
  danger: "danger-filled",
}

// -----------------------------------------------------------------------------
// NotificationBadge — internal/compositional anatomy module.
// -----------------------------------------------------------------------------

type NotificationBadgeSize = "small" | "medium" | "large" | "largeWithNumber"

type NotificationBadgeProps = {
  size?: NotificationBadgeSize
  /** Only rendered for size="largeWithNumber". Figma caps the visible count at 99. */
  count?: number
  className?: string
}

function NotificationBadge({ size = "small", count, className }: NotificationBadgeProps) {
  const isLargeWithNumber = size === "largeWithNumber"
  const dotSize = size === "large" ? 12 : size === "medium" ? 8 : 6

  if (isLargeWithNumber) {
    const displayCount = count !== undefined ? getBadgeDisplayCount(count) : count
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--c-notification-badge-radius)]",
          "bg-[var(--c-notification-badge-background)] px-[5px] py-[2px]",
          className,
        )}
      >
        <span
          className="text-center text-[11px] font-semibold leading-[16px] tracking-[0.5px] text-[var(--c-notification-badge-text)]"
        >
          {displayCount}
        </span>
      </span>
    )
  }

  return (
    <span
      aria-hidden="true"
      className={cn("inline-block rounded-[var(--c-notification-badge-radius)] bg-[var(--c-notification-badge-background)]", className)}
      style={{ width: dotSize, height: dotSize }}
    />
  )
}

// -----------------------------------------------------------------------------
// NotificationItem — internal/compositional anatomy module. Never use
// outside NotificationPanel (Figma Dos/Don'ts, verified node 7195:432).
// -----------------------------------------------------------------------------

type NotificationItemData = {
  id: string
  type: NotificationType
  title: string
  body: string
  timestamp: string
  read: boolean
}

type NotificationItemProps = {
  item: NotificationItemData
  onDismiss: (id: string) => void
  className?: string
}

function NotificationItem({ item, onDismiss, className }: NotificationItemProps) {
  const { id, type, title, body, timestamp, read } = item

  return (
    <div
      role="listitem"
      aria-label={read ? title : `Unread — ${title}`}
      className={cn(
        "relative flex w-full items-start gap-[var(--c-notification-item-gap)]",
        "px-[var(--c-notification-item-padding-h)] py-[var(--c-notification-item-padding-v)]",
        "bg-[var(--c-notification-item-bg-default)] hover:bg-[var(--c-notification-item-bg-hover)]",
        className,
      )}
    >
      {!read && (
        <span
          aria-hidden="true"
          className="absolute left-[6px] top-[18px] size-[8px] rounded-full bg-[var(--c-notification-item-unread-dot)]"
        />
      )}
      <PrismIcon name={TYPE_ICON[type]} iconStyle="filled" size={24} decorative className="shrink-0" />
      <div className={cn("flex min-w-0 flex-1 flex-col overflow-hidden", "gap-[var(--c-notification-item-content-gap)]")}>
        <p className="truncate text-[14px] font-semibold leading-[24px] text-[var(--c-notification-item-title)]">
          {title}
        </p>
        <p className="truncate text-[12px] leading-[16px] text-[var(--c-notification-item-body)]">{body}</p>
        <p className="text-[11px] leading-[16px] text-[var(--c-notification-item-timestamp)]">{timestamp}</p>
      </div>
      <IconButton
        icon="cancel"
        label="Dismiss notification"
        iconSize={24}
        onClick={() => onDismiss(id)}
        className="shrink-0"
      />
    </div>
  )
}

// -----------------------------------------------------------------------------
// NotificationPanel — internal/compositional anatomy module. Opened from the
// bell icon (see NotificationBell below); do not render standalone in a
// product screen.
// -----------------------------------------------------------------------------

type NotificationPanelProps = {
  items: NotificationItemData[]
  onDismissItem: (id: string) => void
  onClose?: () => void
  /** See evidence-conflict note #3 above — only rendered when supplied. */
  onMarkAllRead?: () => void
  /**
   * Renders "View all notifications" in the Populated state whenever
   * either is supplied. CORRECTED (design-owner review): previously
   * gated on `items.length > 20` per the Dos/Don'ts prose alone; the
   * actual rendered Populated anatomy shows this link even with only 4
   * items, so the gate is now purely "was a destination supplied" — see
   * `shouldShowViewAll` in src/lib/notification.ts.
   */
  viewAllHref?: string
  onViewAll?: () => void
  className?: string
}

function NotificationPanel({
  items,
  onDismissItem,
  onClose,
  onMarkAllRead,
  viewAllHref,
  onViewAll,
  className,
}: NotificationPanelProps) {
  const isPopulated = items.length > 0
  const unreadCount = getUnreadCount(items)
  const showViewAll = shouldShowViewAll(Boolean(viewAllHref || onViewAll))

  return (
    <div
      role="region"
      aria-label="Notifications"
      className={cn(
        "flex w-[440px] flex-col overflow-hidden",
        "rounded-[var(--c-notification-panel-radius)] border border-[var(--c-notification-panel-border)]",
        "bg-[var(--c-notification-panel-bg)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-full items-center justify-between",
          "bg-[var(--c-notification-panel-header-bg)]",
          "px-[var(--c-notification-panel-padding-h)] py-[var(--c-notification-panel-padding-v)]",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-[var(--p-space-100)]">
          <PrismIcon name="notifications" size={20} sourceSize={24} decorative />
          <p className="whitespace-nowrap text-[16px] font-semibold leading-[24px] text-[var(--c-notification-panel-header-text)]">
            Notifications
          </p>
          {unreadCount > 0 && <NotificationBadge size="largeWithNumber" count={unreadCount} />}
        </div>
        <div className="flex shrink-0 items-center gap-[var(--p-space-100)]">
          {onMarkAllRead && (
            <Button variant="tertiary" size="small" onClick={onMarkAllRead}>
              Mark all as read
            </Button>
          )}
          {onClose && <IconButton icon="cancel" label="Close notifications" onClick={onClose} />}
        </div>
      </div>
      <div className="h-px w-full bg-[var(--c-notification-panel-border)]" />

      {!isPopulated && (
        <div className="flex h-[255px] w-full flex-col items-center justify-center gap-[var(--p-space-100)] bg-[var(--c-notification-panel-bg)]">
          <PrismIcon name="success-filled" iconStyle="filled" size={24} decorative />
          <p className="text-center text-[14px] font-semibold leading-[24px] text-[var(--c-notification-panel-header-text)]">
            You&apos;re all caught up!
          </p>
          <p className="text-center text-[12px] leading-[16px] text-[var(--c-notification-panel-empty-text)]">
            No new notifications
          </p>
        </div>
      )}

      {isPopulated && (
        <>
          <div role="list" className="flex max-h-[440px] flex-col overflow-y-auto">
            {items.slice(0, 20).map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && <div className="h-px w-full bg-[var(--s-color-surface-sunken)]" />}
                <NotificationItem item={item} onDismiss={onDismissItem} />
              </React.Fragment>
            ))}
          </div>
          {showViewAll && (
            <>
              <div className="h-px w-full bg-[var(--c-notification-panel-border)]" />
              <div
                className={cn(
                  "flex w-full items-center justify-center",
                  "bg-[var(--c-notification-panel-header-bg)]",
                  "px-[var(--c-notification-panel-padding-h)] py-[var(--c-notification-panel-padding-v)]",
                )}
              >
                {viewAllHref ? (
                  <Button variant="tertiary" size="small" asChild>
                    <a href={viewAllHref}>View all notifications</a>
                  </Button>
                ) : (
                  <Button variant="tertiary" size="small" onClick={onViewAll}>
                    View all notifications
                  </Button>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

// -----------------------------------------------------------------------------
// NotificationBell — the recommended, anchored, consumer-facing composition.
// Popover-anchored bell trigger (badge overlay) + NotificationPanel content,
// mirroring the ColorPicker anchored-trigger precedent exactly.
// -----------------------------------------------------------------------------

// Must match the literal `w-[440px]` Tailwind class below — kept as a
// separate numeric constant because arbitrary-value Tailwind classes have
// to stay static string literals for the build's class scanner, so this
// can't be templated into the class itself.
const NOTIFICATION_PANEL_WIDTH = 440

type NotificationBellProps = {
  items: NotificationItemData[]
  onDismissItem: (id: string) => void
  onMarkAllRead?: () => void
  viewAllHref?: string
  onViewAll?: () => void
  /**
   * Which edge of the trigger the panel's own edge anchors to. CORRECTED
   * (design-owner review): a manually-supplied value does not satisfy
   * "location-aware behaviour" — omit this prop (the normal case) and the
   * component measures the trigger's real position via
   * `getBoundingClientRect()` every time the panel opens (and again on
   * viewport resize while it stays open) and picks whichever side actually
   * has more usable room, via the pure `computeAutoAlign` helper in
   * src/lib/notification.ts. A bell near the left edge gets `"start"`
   * (grows rightward); a bell near the right edge gets `"end"` (grows
   * leftward). This prop remains as an explicit override for the rare case
   * a consumer needs to force one direction — supplying it disables the
   * automatic measurement entirely. Radix's own collision detection
   * (`avoidCollisions`, on by default, left untouched) still auto-adjusts
   * from whichever alignment is in effect if it would overflow the
   * viewport.
   */
  align?: "start" | "end"
  className?: string
}

function NotificationBell({
  items,
  onDismissItem,
  onMarkAllRead,
  viewAllHref,
  onViewAll,
  align,
  className,
}: NotificationBellProps) {
  const [open, setOpen] = React.useState(false)
  const [autoAlign, setAutoAlign] = React.useState<"start" | "end">("end")
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const unreadCount = getUnreadCount(items)
  const effectiveAlign = align ?? autoAlign

  const recomputeAutoAlign = React.useCallback(() => {
    if (align) return // explicit override in effect — no measurement needed
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    setAutoAlign(
      computeAutoAlign({
        triggerLeft: rect.left,
        triggerRight: rect.right,
        viewportWidth: window.innerWidth,
        panelWidth: NOTIFICATION_PANEL_WIDTH,
      }),
    )
  }, [align])

  const handleOpenChange = (next: boolean) => {
    if (next) recomputeAutoAlign()
    setOpen(next)
  }

  // Recalculate after relevant viewport resizing while the panel is open —
  // e.g. a browser window resize or a third-pane/nav-rail collapse that
  // changes how much room the trigger actually has.
  React.useEffect(() => {
    if (!open || align) return
    window.addEventListener("resize", recomputeAutoAlign)
    return () => window.removeEventListener("resize", recomputeAutoAlign)
  }, [open, align, recomputeAutoAlign])

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
          className={cn(
            "relative inline-flex size-[var(--p-icon-size-024)] items-center justify-center rounded-[var(--p-radius-100)] outline-none",
            "hover:bg-[var(--s-color-surface-muted)]",
            "focus-visible:shadow-[var(--e-shadow-focus)]",
            className,
          )}
        >
          <PrismIcon name="notifications" size={24} decorative />
          {unreadCount > 0 && (
            <NotificationBadge
              size="largeWithNumber"
              count={unreadCount}
              // CORRECTED (design-owner review): previously -right-1/-top-1
              // (a 4px outward nudge), which — because the Large-With-Number
              // badge (26x20, matching Figma's own 3176:36 exactly) is nearly
              // as wide as the 24px icon itself — still covered most of the
              // bell glyph. Centering the badge's own centre exactly on the
              // icon's top-right corner (translate 50%/-50%) means only the
              // HALF of the badge nearer the icon overlaps it — the small,
              // standard "corner badge" overlap amount — while the outer
              // half hangs clear of the glyph. No Figma frame shows the
              // badge composited onto a real bell instance to measure an
              // exact evidenced offset against, so this corner-centring
              // convention (the same one used by e.g. Material/Ant Design
              // badges) is a reasoned default under that evidence gap, not
              // the original guess.
              className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2"
            />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={effectiveAlign}
        className={cn(
          "w-auto rounded-[var(--c-notification-panel-radius)] border-[var(--c-notification-panel-border)]",
          "bg-[var(--c-notification-panel-bg)] p-0",
        )}
      >
        <NotificationPanel
          items={items}
          onDismissItem={onDismissItem}
          onClose={() => setOpen(false)}
          onMarkAllRead={onMarkAllRead}
          viewAllHref={viewAllHref}
          onViewAll={onViewAll}
          className="w-[440px] rounded-none border-0"
        />
      </PopoverContent>
    </Popover>
  )
}

export { NotificationBell, NotificationPanel, NotificationItem, NotificationBadge }
export type {
  NotificationType,
  NotificationItemData,
  NotificationBellProps,
  NotificationPanelProps,
  NotificationItemProps,
  NotificationBadgeProps,
  NotificationBadgeSize,
}
