import type * as React from "react"

import type { ModalSize } from "@/components/ui/modal"
import type { WizardStep } from "@/components/ui/wizard"
import type {
  PxHeaderAction,
  PxHeaderProps,
  PxHeaderUtility,
  PxNavProps,
} from "@/patterns/px-list-shell"

// -----------------------------------------------------------------------------
// Public types for the PxCreateEditShell pattern
// -----------------------------------------------------------------------------
//
// The shell provides structure only — field content is always supplied by the
// calling screen via `children`. See PxCreateEditShellModal.tsx /
// PxCreateEditShellAccordion.tsx / PxCreateEditShellWizard.tsx and the README
// for anatomy, Figma sources, and composition rules.
// -----------------------------------------------------------------------------

/** A single footer/sub-header action button. Mirrors ModalFooterAction's shape. */
export type PxCreateEditAction = {
  label: string
  onClick: () => void
  disabled?: boolean
}

/**
 * Common props for the two full-page compositions (Accordion, Wizard) — both
 * keep the PX Shell (rail + primary header) visible and add the same
 * sub-header bar + sticky footer described in the Create·Edit Form AI
 * instructions (Figma node 7128:873).
 *
 * There is no separate `mode: "create" | "edit"` prop — per the Figma "Edit
 * vs Create" rule, both modes render the identical surface; the only
 * differences (pre-filled field values, the primary CTA's label
 * "Create"/"Add" vs "Save", never "Update") are already fully expressed by
 * the values the caller passes for `title` and `primaryAction.label`, so
 * threading a redundant mode flag through the shell would drive no actual
 * behavior here.
 */
export type PxCreateEditPageProps = {
  /** Left-rail state, forwarded to <PxListShell>. */
  nav: PxNavProps
  /** Primary-bar-only fields forwarded to <PxListShell>'s header. */
  header: Pick<PxHeaderProps, "moduleName" | "primaryCenter" | "primaryUtilities" | "avatar">
  /** Back-arrow handler in the sub-header. Required — full-page forms always navigate back to the list. */
  onBack: () => void
  /** Inline-editable record name. Placeholder should read "Untitled [Object]" per the naming convention. */
  title: string
  /** Called with the committed value when the inline-editable title is saved. */
  onEditTitle?: (newTitle: string) => void
  /** Optional chip after the title (e.g. a status chip on Edit). */
  titleChip?: React.ReactNode
  /**
   * Contextual icon actions in the sub-header RHS (info, duplicate, etc.).
   * Never put destructive actions (Delete, Archive) here directly — the
   * Figma spec routes those through a ⋮ overflow item instead; compose one
   * of these utilities as that overflow trigger if needed.
   */
  secondaryUtilities?: PxHeaderUtility[]
  onCancel: () => void
  primaryAction: PxCreateEditAction
  className?: string
}

export type PxCreateEditShellModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Small (≤4 fields) · Medium (5–6 fields) · Large (complex, side-by-side inputs). Default "small". */
  size?: ModalSize
  /** States the action, never the record name — e.g. "Add Weblink", "Create Segment", "Edit Account". */
  title: string
  onCancel: () => void
  primaryAction: PxCreateEditAction
  children: React.ReactNode
  className?: string
}

export type PxCreateEditShellAccordionProps = PxCreateEditPageProps & {
  /** Accordion sections — compose with the shared <Accordion>/<AccordionItem>. */
  children: React.ReactNode
}

export type PxCreateEditShellWizardProps = PxCreateEditPageProps & {
  steps: WizardStep[]
  onStepClick?: (id: string) => void
  /** Current step's body content — header/subtitle/actions inside this pane are the caller's own composition. */
  children: React.ReactNode
}

export type { PxHeaderAction }
