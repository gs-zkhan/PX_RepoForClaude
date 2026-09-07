import { cn } from "@/lib/utils"
import { PxMainContainer } from "@/patterns/px-main-container"

import type { PxDetailDrilldownShellProps } from "./types"

// -----------------------------------------------------------------------------
// PxDetailDrilldownShell — generic page-shell for any PX single-record
// detail/drilldown view (Account, Segment, Feature, Engagement, User, or any
// entity where the user navigates from a list into a single-record view).
//
// Figma sources: "Detail · Drilldown Page 🟢" (node 3187:11) — the canonical,
// dedicated Figma page for this archetype, containing the "Shell / Detail
// Drilldown" instance (node 9665:57781) plus its own "Detail Drilldown AI
// Instructions" (9669:4541) and "Detail Drilldown Dos and Don'ts" (9669:4571)
// frames. A near-identical copy of the same content also exists embedded in
// Shell/MainContainer (node 3792:8575, section "Detail/Drilldown", node
// 9661:38956) — that copy is supporting/reference evidence only; node 3187:11
// is the canonical source this implementation is verified against.
//
// Anatomy (verified against both Figma locations and a live screenshot of the
// Shell/Detail Drilldown instance):
//   ① PX Primary/Global Header — inherited unchanged from the parent list
//      page (module name, PEC trigger, RHS icons). Never drilldown-specific.
//   ② Drilldown Secondary Header — three zones: left = back arrow + record
//      title (with an optional edit pencil and chip); centre = optional tabs
//      or empty; right = drilldown-owned utilities/actions or empty.
//   ③ Main Content Region — flexible, scrollable, product-owned content.
//
// This is a thin composition of two already-existing primitives — no new
// visual/header component was created:
//   - <PxMainContainer> supplies the rail, the page background, and the
//     content row. Its own registry status remains Internal foundation (it
//     is never independently approved); its use here is sanctioned because
//     this shell is a fourth registered, approved direct consumer, alongside
//     PxListShell/PxCreateEditShell{Accordion,Wizard}/PxAnalyticsSecondaryNav
//     (see ai/figma-coverage.json's decision-px-main-container-internal).
//   - <PxHeader> (rendered by PxMainContainer) already exposes every field
//     the Secondary Bar's three zones need — onBack, title, onEditTitle,
//     titleChip (left zone), tabs/activeTabId/onTabChange (centre zone),
//     secondaryUtilities/secondaryActions (right zone) — confirmed
//     field-for-field against the Figma screenshot (back arrow, "Record
//     Title", info/duplicate/delete icon utilities, two pill actions). No
//     new PxHeader prop was needed.
//
// Unlike PxCreateEditShellAccordion/Wizard, this shell does NOT force a
// Cancel+Primary secondaryActions pair or add a sticky footer — Figma's own
// instructions explicitly allow the right zone to be entirely empty, and the
// drilldown's actions (Edit, Delete, Share, ...) live directly in the
// Secondary Bar, not a separate footer element.
//
// Content region: a single <main> (matching the accessibility landmark rule
// on Shell/MainContainer's own AI instructions — <main> for the content
// area) with 24px padding (space/300) and its own vertical scroll — the
// header and rail never scroll. This must remain generic: never hard-code
// entity-specific content (e.g. Account Explorer cards/tables/metrics) here —
// that belongs to the screen composing this shell.
// -----------------------------------------------------------------------------

function PxDetailDrilldownShell({
  nav,
  header,
  onBack,
  title,
  onEditTitle,
  titleChip,
  tabs,
  activeTabId,
  onTabChange,
  secondaryUtilities,
  secondaryActions,
  children,
  className,
}: PxDetailDrilldownShellProps) {
  return (
    <PxMainContainer
      nav={nav}
      header={{
        ...header,
        showSecondary: true,
        onBack,
        title,
        onEditTitle,
        titleChip,
        tabs,
        activeTabId,
        onTabChange,
        secondaryUtilities,
        secondaryActions,
      }}
    >
      <main
        data-slot="px-detail-drilldown-shell"
        className={cn("min-h-0 min-w-0 flex-1 overflow-y-auto p-[var(--p-space-300)]", className)}
      >
        {children}
      </main>
    </PxMainContainer>
  )
}

export { PxDetailDrilldownShell }
