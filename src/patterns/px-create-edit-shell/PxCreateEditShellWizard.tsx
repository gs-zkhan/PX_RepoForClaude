import { cn } from "@/lib/utils"
import { Wizard } from "@/components/ui/wizard"
import { PxMainContainer } from "@/patterns/px-main-container"

import { PxCreateEditFooter } from "./PxCreateEditFooter"
import type { PxCreateEditShellWizardProps } from "./types"

// -----------------------------------------------------------------------------
// PxCreateEditShellWizard — the full-page, step-dependent tier of Create ·
// Edit Form.
//
// Figma sources (Shell/Create · Edit Form 🟢, node 3187:10):
//   - Assembled example — node 3802:3615. Its Figma layer name is "Create/
//     Edit with Accordion" — a copy-paste artifact, not a real accordion.
//     Its content is unambiguously the wizard tier: a bordered sidebar of
//     <Wizard> step instances (Audience/Editor/Schedule/Launch) beside an
//     empty content pane, and it sits directly under the "Create/Edit with
//     Wizard" text label (node 3802:3614). Implemented per content and
//     position, not the stale layer name — this stale name needs a Figma-
//     side fix, tracked here rather than silently worked around.
//   - Create Edit Form AI instructions (node 7128:873): use this tier only
//     when a later step depends on an earlier one, or 5+ sections benefit
//     from explicit progress tracking. The PX Shell stays visible.
//
// Known Figma inconsistencies (flagged, not silently resolved):
//   1. Sidebar width — the written AI instructions state "Stepper sidebar:
//      240px fixed width," but the assembled example frame (3802:3615)
//      measures the sidebar at 156px. Implemented at the written 240px —
//      kept deliberately, per direction, as the correct spec value; the
//      156px measurement is the thing that needs a Figma-side correction,
//      not this component.
//   2. Content-pane placement — the assembled example frame places its
//      336px-wide "Content" instance flush against the *right* edge of the
//      1392px content area (measured x:1056), leaving a large blank gap
//      between it and the sidebar, rather than sitting immediately next to
//      it. Matched here exactly (sidebar, blank flexible spacer, then a
//      fixed 336px content pane pinned right) even though it reads as
//      unusual — Figma's own measured layout is treated as ground truth
//      for this specific placement question, per explicit direction.
//
// Composes <PxMainContainer> directly (rail + header + one content row) —
// not <PxListShell> — since this shell has nothing to do with lists. See
// src/patterns/px-main-container.
//
// The sidebar is structural chrome (always the same shape), so this shell
// owns rendering it from a `steps` prop via the shared <Wizard> component —
// unlike the accordion sections or modal body, which are fully caller-
// composed. The content pane (header/body/actions for whichever step is
// active) is caller-supplied via `children`; Figma's own example frame
// left this pane's internal slots empty, so no specific sub-layout is
// prescribed here.
// -----------------------------------------------------------------------------

function PxCreateEditShellWizard({
  nav,
  header,
  onBack,
  title,
  onEditTitle,
  titleChip,
  secondaryUtilities,
  onCancel,
  primaryAction,
  steps,
  onStepClick,
  children,
  className,
}: PxCreateEditShellWizardProps) {
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
        secondaryUtilities,
        secondaryActions: [
          { id: "cancel", label: "Cancel", variant: "secondary", onClick: onCancel },
          {
            id: "primary",
            label: primaryAction.label,
            variant: "primary",
            onClick: primaryAction.onClick,
            disabled: primaryAction.disabled,
          },
        ],
      }}
    >
      <section
        data-slot="px-create-edit-shell-wizard"
        className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}
      >
        <div className="flex min-h-0 flex-1">
          <div
            className={cn(
              "w-60 shrink-0 overflow-y-auto",
              "border border-[var(--s-color-line-default)]",
              "bg-[var(--s-color-surface-default)] p-[var(--p-space-300)]",
            )}
          >
            <Wizard steps={steps} orientation="vertical" onStepClick={onStepClick} />
          </div>

          {/* Blank flexible spacer — matches Figma's own measured geometry,
              which parks the content pane flush against the right edge
              rather than immediately after the sidebar (see header comment,
              inconsistency #2). */}
          <div className="min-h-0 flex-1" aria-hidden="true" />

          <div
            className={cn(
              "w-[336px] shrink-0 overflow-y-auto",
              "border-l border-[var(--s-color-line-default)]",
              "p-[var(--p-space-200)]",
            )}
          >
            {children}
          </div>
        </div>
        <PxCreateEditFooter onCancel={onCancel} primaryAction={primaryAction} />
      </section>
    </PxMainContainer>
  )
}

export { PxCreateEditShellWizard }
