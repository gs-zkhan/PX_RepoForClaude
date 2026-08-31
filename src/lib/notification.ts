// -----------------------------------------------------------------------------
// Pure logic for the Notification component family — extracted from
// notification.tsx so it can be unit-tested directly (matching this repo's
// existing convention of testing colour-math/parsing helpers as plain
// functions, e.g. src/lib/color.ts), rather than requiring a DOM-rendering
// test harness this repo does not otherwise use.
// -----------------------------------------------------------------------------

type NotificationItemLike = { read: boolean }

/** Figma: Large With Number caps the visible count at "99+". */
function getBadgeDisplayCount(count: number): string | number {
  return count > 99 ? "99+" : count
}

function getUnreadCount(items: NotificationItemLike[]): number {
  return items.filter((item) => !item.read).length
}

/**
 * CORRECTED (design-owner review): a prior draft gated this on
 * `itemCount > 20`, inferred solely from the Dos/Don'ts prose ("Add a 'View
 * all' link when unread count exceeds 20"). Re-checked directly against the
 * actual rendered Populated-panel anatomy (get_design_context on 7197:157):
 * the "View all notifications" footer is present in that example with only
 * 4 items — it is not conditionally hidden below any threshold in the real
 * anatomy. Per this repo's rule to trust rendered structure over conflicting
 * prose, the link is now shown whenever the Panel is Populated AND the
 * caller actually supplied a destination (`viewAllHref` or `onViewAll`) —
 * this component never hard-codes navigation, so with no destination
 * supplied there is nothing to link to and it correctly renders nothing.
 * The Dos/Don'ts' underlying concern (never let the panel grow unbounded
 * with no way out) is still satisfied — the link is simply always
 * available once a destination exists, not switched on only past 20 items.
 */
function shouldShowViewAll(hasDestination: boolean): boolean {
  return hasDestination
}

type AutoAlignInput = {
  /** Trigger's left edge, in viewport coordinates (getBoundingClientRect().left). */
  triggerLeft: number
  /** Trigger's right edge, in viewport coordinates (getBoundingClientRect().right). */
  triggerRight: number
  /** window.innerWidth (or the relevant scroll container's width). */
  viewportWidth: number
  /** The panel's own rendered width — used to judge whether a side actually fits it. */
  panelWidth: number
}

/**
 * CORRECTED (design-owner review): a manually-supplied `align="start"|"end"`
 * prop does not satisfy "location-aware behaviour" — a normal consumer
 * should not have to compute this themselves. This is the pure decision
 * function `NotificationBell` calls automatically (via the trigger's real
 * `getBoundingClientRect()`) every time the panel opens and on viewport
 * resize while it stays open: growing the panel toward whichever side of
 * the trigger actually has more usable room, preferring a side that fits
 * the panel's full width outright over one that merely has *more* space
 * but still not enough (Radix's own `avoidCollisions` handles any residual
 * overflow either way).
 */
function computeAutoAlign(input: AutoAlignInput): "start" | "end" {
  const spaceRight = input.viewportWidth - input.triggerLeft
  const spaceLeft = input.triggerRight

  if (spaceRight >= input.panelWidth) return "start"
  if (spaceLeft >= input.panelWidth) return "end"
  return spaceRight > spaceLeft ? "start" : "end"
}

export { getBadgeDisplayCount, getUnreadCount, shouldShowViewAll, computeAutoAlign }
export type { NotificationItemLike, AutoAlignInput }
