import * as React from "react"

import { cn } from "@/lib/utils"
import { IconButton } from "@/components/ui/icon-button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu"

// -----------------------------------------------------------------------------
// DashboardWidgetCard — Figma "Dashboard Widget Card" page (20:27), AI
// Instructions frame 4407:49309, Dos and Don'ts frame 4407:49334. Confirmed
// via get_metadata + screenshot (light/dark instances 4445:51016 /
// 4445:51076) — the header bar of every analytics dashboard tile.
//
// Distinct from:
//   - SummaryStat: a single KPI value+label display, no header/actions/body
//     slot at all.
//   - CanvasCard: a two-pane resizable editor shell — unrelated purpose.
//   - Existing chart components (BarChart/LineChart/DonutChart/etc.): those
//     render the DATA visualization; this component is only the widget's
//     header chrome + a content slot a caller fills with any one of them
//     (or nothing) — no coupling to a specific chart library.
//
// Anatomy (per AI Instructions AND re-verified 2026-08-30 directly against
// the defining symbol 4432:50635, per direct design-owner correction):
//   Primary Bar (24px): Title + Source label stacked left (see the
//     typography correction note below). Right side, up to 4 icons max
//     (Figma's own Dos/Don'ts rule): chart-type switcher, filter,
//     share/export, overflow (⋮) — secondary actions belong in the overflow
//     menu, not as additional standalone icons.
//   Body: fills remaining space — the `children` slot. No coupling to any
//     chart library, per the composability requirement.
//   Footer dropdown row (CORRECTED 2026-08-30 — see the dedicated note
//     below for the full anatomy and the layout-position bug this fixes):
//     an optional row of Select/Dropdown controls anchored to the BOTTOM
//     of the card, below the body — not directly under the header, which
//     is where a prior draft incorrectly rendered it. Exposed as a
//     `filterRow` slot rather than built-in Select/Dropdown controls,
//     since Figma's own instruction says these use "standard Dropdown ·
//     Select" components — the caller supplies whichever already-approved
//     control fits their data, keeping this component decoupled from any
//     specific filter UI.
//
// Footer dropdown row anatomy (CORRECTED 2026-08-30, per direct
// design-owner correction: "footer DD are missing in the implementation"):
// a prior draft rendered `filterRow` as a single generic gap-only row
// directly below the header, and only ever demonstrated it with plain
// placeholder text (no real dropdowns) — neither the position nor the
// anatomy matched Figma. Re-inspected the defining symbol's own footer
// frame (4419:50511, "Frame 4", at y=220 of a 288px-tall card — i.e. the
// BOTTOM of the card, not top) directly via get_metadata: it contains
// exactly 3 "Dropdown" component instances — two grouped together on the
// left ("Frame 3": 4419:50277 at x=0, 4419:50303 at x=39, both a bare
// "Select Value" trigger + chevron-down, no leading icon) and one pinned
// to the right edge (4419:50311 at x=385 of 416: leading
// `icons/24/placeholder` + "Select Value" + chevron-down — note the icon
// itself is literally named "placeholder" in Figma, meaning Figma has not
// finalized which icon belongs there either; any reasonable icon is a
// caller/example decision, not a specified one). All 3 are instances of
// this repo's own already-approved `Select`/`SelectTrigger`/`SelectValue`/
// `SelectContent` (see src/components/ui/select.tsx) — composed directly
// in the example, not rebuilt. The wrapper is now `justify-between` (not a
// single gap-only row) so a caller composing "left group + right item" as
// two top-level children reproduces Figma's left/right split; it also now
// renders AFTER `children` in DOM order (previously it rendered before,
// forcing it directly under the header) so it lands at the bottom of the
// card, matching the y=220-of-288 (bottom) position of the real frame.
//
// Title/subtitle typography and spacing (CORRECTED 2026-08-30, per direct
// design-owner request — re-verified against the real defining symbol, not
// the AI Instructions' summarized prose): pulled `get_variable_defs`
// directly on the title text node (4419:50529) and the subtitle text node
// (4432:50619) individually, since a prior draft used the AI Instructions'
// Tokens-list prose ("Widget title: SemiBold 14px" / "source-label →
// color/action/primary/default") without checking the actual bound
// variables on the real component — which disagree with that prose:
//   Title (4419:50529):    font.heading.small (Noto Sans SemiBold 16px,
//                           lineHeight 24, letterSpacing 0), color/text/default
//   Subtitle (4432:50619): font.label.small (Noto Sans Regular 12px,
//                           lineHeight 16, letterSpacing 0), color/text/subtle
// This is a real, documented conflict between the AI Instructions' prose
// and the live component's bound variables — the direct per-node evidence
// is trusted here (ground truth over a summarized description), consistent
// with this file's own established practice of resolving evidence conflicts
// from direct inspection rather than restating stale prose. Both token sets
// already exist in generated CSS (verified via grep, nothing invented):
// title uses --t-font-heading-small-* (already used identically by
// src/components/ui/card.tsx's own title), subtitle uses the full
// --t-font-label-small-* set (size/weight/line-height/letter-spacing — not
// just --p-font-size-small, which only captured the size), subtitle colour
// is --s-color-text-subtle (#3C4A57, exactly matching color/text/subtle).
// The 4px vertical gap between title and subtitle uses --p-space-050 (the
// semantic token for 4px), applied as the flex gap on their wrapper.
//
// Reuse decisions:
//   - `chartTypeSwitcher` accepts any node — an important admission
//     (CORRECTED 2026-08-30, per direct design-owner question "where did
//     you see the 2 chart type switcher icons... you must have referenced
//     something else"): re-inspected the RHS icon instances of all 3
//     defining symbols (4432:50635, 4432:50637, 4445:50697) directly via
//     get_metadata — each shows exactly ONE static icon instance named
//     `icons/24/PXAnalytics` in this slot. There is no second icon, no
//     visible toggle, and no line/bar pair anywhere in the Figma file. The
//     earlier two-option ("line"/"bar") interactive switcher shown in the
//     gallery/docs examples was NOT sourced from a Figma instance — it was
//     an assumption, extrapolated from the AI Instructions' prose ("active
//     icon reflects the current chart type selected" + "use
//     role=\"radiogroup\"", which implies more than one selectable option
//     must exist somewhere) combined with borrowing the "line"/"bar" icon
//     pair from this repo's own pre-existing ViewSwitcher gallery demo as
//     a stand-in, without ever confirming a matching Figma instance. This
//     was a real error in how the evidence was represented — it should
//     have been flagged as an interpretation of the accessibility
//     requirement, not presented as something observed in the file.
//     `chartTypeSwitcher` itself stays a generic slot (not hardcoded to
//     any specific number of options) precisely because Figma does not
//     specify how many chart types exist or what their icons are — only
//     that if/when there is a chart-type control, it must use
//     role="radiogroup" per the Accessibility row. Figma's own AI
//     Instructions require role="radiogroup" for this control, which is
//     authoritative — the repo's `ViewSwitcher` uses role="tablist"/"tab"
//     instead (a different, established ARIA pattern for its own use case)
//     and is NOT reused here. This is not a statement about ViewSwitcher's
//     review status — it remains `Mapped-review-pending`, its own visual
//     review is Pending, and it is unmodified/unreclassified by this
//     decision. The intended composition, WHEN a chart-type control is
//     actually needed, is the new, isolated `DashboardWidgetChartTypeSwitcher`
//     (src/components/ui/dashboard-widget-chart-type-switcher.tsx), built
//     on @radix-ui/react-radio-group for genuine radiogroup/radio
//     semantics — see that file's header comment for the same correction,
//     the token-ownership correction (it no longer references any
//     `--c-view-switcher-*` token), and the 24px icon-size correction
//     (RESOLVED 2026-08-30). CORRECTED AGAIN (2026-08-30, per direct user
//     correction with reference screenshots): the switcher's actual visual
//     anatomy is a single icon+chevron trigger that opens a popover listing
//     the options (role="radiogroup" inside the popover) — not an
//     always-visible row of icon buttons, which is what the previous
//     correction still rendered. See DashboardWidgetChartTypeSwitcher's own
//     header comment for the full anatomy and the icon-asset notes (4
//     example options: scatter/bar/line/formula-number, sourced from the
//     user's screenshots, not Figma).
//   - Overflow menu reuses the existing, unmodified DropdownMenu/
//     DropdownMenuItem primitives.
//   - Filter/share actions reuse the existing IconButton, with a
//     caller-supplied accessible `label` (see `filterAction`/`shareAction`
//     below) — a prior draft hard-coded the strings "Filter"/"Share" while
//     documenting them as caller-supplied, which didn't match the code.
//     IconButton's box is always 24×24 regardless of its `iconSize` prop
//     (default `iconSize=24`) — neither is overridden here, so both render
//     at the Figma-specified 24px without any change to IconButton itself.
//
// Share icon provenance (AUDITED 2026-08-30, per direct design-owner
// request — reported honestly, not glossed over): traced
// `icon="share"` -> IconButton -> PrismIcon -> asset lookup ->
// src/assets/icons/24/share.svg (a "share network" three-node glyph),
// rendered at PrismIcon's default size=24 with no scaling (sourceSize
// defaults to size when omitted, so 24px source folder = 24px render).
// BUT: re-inspected all 3 defining Dashboard Widget Card symbols
// (4432:50635 Size=1*1, 4432:50637 Size=1*2, 4445:50697 Size=1*3) directly
// via get_metadata — every one of them shows exactly 3 RHS icon instances
// (icons/24/filter, icons/24/PXAnalytics, icons/24/more-vertical). NONE of
// the 3 defining symbols contains a Share icon instance anywhere, despite
// the AI Instructions' prose repeatedly listing "share/export icon" as one
// of the 4 fixed action types. A `search_design_system` lookup for "share
// icon" scoped to this file returned zero hits from the approved library —
// every result came from other, unrelated or explicitly forbidden
// libraries (including "Prism - AI Design System of PX", forbidden per
// CLAUDE.md) and was discarded, not used as evidence. Conclusion: there is
// no authoritative Share icon instance anywhere in the approved Figma file
// to vector/path-compare against. `icon="share"` is kept as-is (it is a
// real, already-cataloged repo Prism icon — not a bespoke inline SVG or a
// Lucide/generic substitute), but this is a genuine, unresolved evidence
// gap, not a verified match — the exact glyph needs explicit design-owner
// confirmation (or a decision to drop the Share action entirely, if it was
// cut from the final visual design) during visual review.
//
// Tokens: no dedicated --c-card-widget-* tokens exist in generated CSS
// (verified via grep) — composes directly from semantic tokens. Confirmed
// via direct per-node `get_variable_defs` (see typography note above):
// card-widget/background → --s-color-surface-default, /border →
// --s-color-line-default, /title → --s-color-text-default (font.heading.small),
// /source-label → --s-color-text-subtle (font.label.small — NOT
// color/action/primary/default, correcting the AI Instructions' prose),
// /icon → --s-color-text-subtlest, /padding → --p-space-150 (12px),
// /gap → --p-space-100 (8px), title/subtitle gap → --p-space-050 (4px).
//
// Accessibility: `aria-label` on the header combines the widget title and
// source label per Figma's own example ("GS Home Migration — GAINSIGHT CS
// PROD"). Filter/share icon buttons require a caller-supplied `label` (via
// IconButton's own required prop) — this component does not invent generic
// labels. Overflow trigger is labelled "More options" per Figma. Every
// icon-only action has a real accessible name; none are decorative-only.
// Keyboard order (RE-VERIFIED 2026-08-30 via real Tab/Shift+Tab key
// presses from a neutral focus position, not only programmatic .focus()):
// chart-type trigger (single Tab stop; opening it moves focus into the
// popover's radiogroup, which has its own single roving-focus Tab stop)
// -> Filter -> Share -> Overflow, and the same in reverse via Shift+Tab.
// Re-verified again after the trigger+popover correction (see the
// chartTypeSwitcher reuse-decision note above) — still a single Tab stop
// for this control, just landing on a disclosure button instead of a
// radio item directly. No positive tabIndex or manual keydown handling
// exists anywhere in this component or the chart-type switcher — order
// comes entirely from Radix's native Popover/RadioGroup wiring and DOM
// order.
//
// STATUS: APPROVED WITH DOCUMENTED EXCEPTION (2026-08-30). Design owner
// completed visual review and approved this component, with one accepted
// exception: the chart-type popover's 4th option uses the existing Prism
// `icons/24/formula-number.svg` asset as the design-owner-accepted
// approximation for a "#"/hash glyph this repo has no dedicated matching
// asset for — visually approved, but must not be described as an exact
// Figma icon match. See DashboardWidgetChartTypeSwitcher's own header
// comment for the same note. Visual Review: Approved. Approved for AI use:
// Yes.
// -----------------------------------------------------------------------------

type DashboardWidgetCardAction = {
  label: string
  onClick: () => void
}

type DashboardWidgetCardProps = {
  title: string
  sourceLabel: string
  /** Compose a `DashboardWidgetChartTypeSwitcher` — see header comment for why ViewSwitcher is not used here. */
  chartTypeSwitcher?: React.ReactNode
  /** Accessible label comes from the caller — this component does not invent one. */
  filterAction?: DashboardWidgetCardAction
  /** Accessible label comes from the caller — this component does not invent one. */
  shareAction?: DashboardWidgetCardAction
  /** DropdownMenuItem elements for the overflow (⋮) menu. Omit to hide the trigger entirely. */
  overflowMenu?: React.ReactNode
  /**
   * A footer row of Select/Dropdown controls, rendered at the BOTTOM of
   * the card (after `children`) — Figma's real anatomy is 2 dropdowns
   * grouped on the left plus 1 pinned to the right (see header comment for
   * the exact node evidence); compose the approved `Select`/`SelectTrigger`/
   * `SelectValue`/`SelectContent` directly, wrapping the left pair in their
   * own flex group so this slot's `justify-between` wrapper splits them
   * correctly. Only render when the widget supports configurable data
   * controls (granularity/date-range/segmentation). Never pass an empty
   * node — omit the prop entirely instead, per Figma's explicit rule.
   */
  filterRow?: React.ReactNode
  /** Widget body — any chart component, a table, or nothing (loading/empty/error states are the caller's own content, since none are defined in the Figma evidence). */
  children?: React.ReactNode
  className?: string
}

function DashboardWidgetCard({
  title,
  sourceLabel,
  chartTypeSwitcher,
  filterAction,
  shareAction,
  overflowMenu,
  filterRow,
  children,
  className,
}: DashboardWidgetCardProps) {
  return (
    <div
      data-slot="dashboard-widget-card"
      className={cn(
        "flex min-w-[320px] flex-col gap-[var(--p-space-100)]",
        "rounded-[var(--p-radius-150)] border border-[var(--s-color-line-default)]",
        "bg-[var(--s-color-surface-default)] p-[var(--p-space-150)]",
        className,
      )}
    >
      <div
        className="flex items-start justify-between gap-[var(--p-space-100)]"
        role="group"
        aria-label={`${title} — ${sourceLabel}`}
      >
        <div className="flex min-w-0 flex-col gap-[var(--p-space-050)]">
          <span className="truncate text-[length:var(--t-font-heading-small-size)] font-[number:var(--t-font-heading-small-weight)] leading-[var(--t-font-heading-small-line-height)] tracking-[var(--t-font-heading-small-letter-spacing)] text-[var(--s-color-text-default)]">
            {title}
          </span>
          <span className="truncate text-[length:var(--t-font-label-small-size)] font-[number:var(--t-font-label-small-weight)] leading-[var(--t-font-label-small-line-height)] tracking-[var(--t-font-label-small-letter-spacing)] text-[var(--s-color-text-subtle)]">
            {sourceLabel}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-[var(--p-space-100)]">
          {chartTypeSwitcher}
          {filterAction && (
            <IconButton icon="filter" label={filterAction.label} onClick={filterAction.onClick} />
          )}
          {shareAction && (
            <IconButton icon="share" label={shareAction.label} onClick={shareAction.onClick} />
          )}
          {overflowMenu && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <IconButton icon="more-vertical" label="More options" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">{overflowMenu}</DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {children && <div className="flex-1">{children}</div>}

      {filterRow && (
        <div className="flex items-center justify-between gap-[var(--p-space-100)]">{filterRow}</div>
      )}
    </div>
  )
}

export { DashboardWidgetCard }
export type { DashboardWidgetCardProps, DashboardWidgetCardAction }
