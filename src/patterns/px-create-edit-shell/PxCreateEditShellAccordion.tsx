import { cn } from "@/lib/utils"
import { PxMainContainer } from "@/patterns/px-main-container"

import { PxCreateEditFooter } from "./PxCreateEditFooter"
import type { PxCreateEditShellAccordionProps } from "./types"

// -----------------------------------------------------------------------------
// PxCreateEditShellAccordion — the full-page, multi-section tier of Create ·
// Edit Form.
//
// Figma sources (Shell/Create · Edit Form 🟢, node 3187:10):
//   - Assembled example — "Create/Edit with Accordion" (node 3796:2504):
//     4 collapsed <Accordion> sections (Audience, Steps, Date Range,
//     Additional Settings) inside the Shell content area.
//   - Create Edit Form AI instructions (node 7128:873): use this tier for
//     multi-section linear config where sections are independent. The PX
//     Shell (rail + primary header) stays visible — only the content area
//     is replaced.
//
// Known Figma inconsistency (flagged, not silently resolved): the assembled
// example frame above shows only the 4 accordion rows, with no sub-header
// bar and no sticky footer — but the written AI instructions explicitly
// state both are "Present on all full-page forms (Accordion and Stepper)."
// This component follows the written instructions (sub-header + footer
// always present) since that is the more complete, explicit source;
// flagged for design-owner confirmation against the example frame.
//
// This composes <PxMainContainer> directly (rail + header + one content
// row) — not <PxListShell> — since this shell has nothing to do with lists
// and must not inherit PxListShell's filterSlider slot or list-page
// semantics. See src/patterns/px-main-container.
//
// The sub-header is PxHeader's own Secondary Bar (rendered by
// PxMainContainer) — verified, not assumed: Figma's TableSecHeader
// "BackArrow" variant (node 9452:13652) has the exact anatomy back-arrow →
// editable title → edit-pencil → chip, a field-for-field match to this
// spec's "LHS: back arrow + inline-editable record name + optional edit
// icon + optional status chip · RHS: contextual icons + divider + Cancel +
// primary CTA" (see px-main-container's README for the full comparison).
// So this component does not build a second sub-header, it configures
// PxMainContainer's existing one. The sticky footer is a separate,
// pattern-owned <PxCreateEditFooter> (see that file for why it can't reuse
// <ModalFooter> as-is).
//
// Accordion sections are entirely caller-composed via `children` — this
// shell doesn't know what sections a given form needs. Compose with the
// shared <Accordion>/<AccordionItem> (src/components/ui/accordion.tsx).
// -----------------------------------------------------------------------------

function PxCreateEditShellAccordion({
  nav,
  header,
  onBack,
  title,
  onEditTitle,
  titleChip,
  secondaryUtilities,
  onCancel,
  primaryAction,
  children,
  className,
}: PxCreateEditShellAccordionProps) {
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
        data-slot="px-create-edit-shell-accordion"
        className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}
      >
        <div className="min-h-0 flex-1 overflow-y-auto p-[var(--p-space-300)]">
          <div className="flex flex-col gap-[var(--p-space-100)]">{children}</div>
        </div>
        <PxCreateEditFooter onCancel={onCancel} primaryAction={primaryAction} />
      </section>
    </PxMainContainer>
  )
}

export { PxCreateEditShellAccordion }
