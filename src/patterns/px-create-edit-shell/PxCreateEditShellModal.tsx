import { Modal, ModalFooter } from "@/components/ui/modal"

import type { PxCreateEditShellModalProps } from "./types"

// -----------------------------------------------------------------------------
// PxCreateEditShellModal — the popup/modal tier of Create · Edit Form.
//
// Figma sources (Shell/Create · Edit Form 🟢, node 3187:10):
//   - Assembled example — "Create/Edit on a Popup" (node 3796:2503), the
//     "Add Weblink" reference screen.
//   - Modal instance (node 3791:1498), Size=Small, Microcopy=Off.
//   - Modal Footer instance (node 3791:1499), Width=Large, Buttons=2-Button.
//
// Per the Create Edit Form AI instructions (node 7128:873): use this tier
// for ≤6 fields with no branching or section grouping. The primary CTA
// starts disabled until required fields are valid (pass
// `primaryAction.disabled`) — this shell doesn't own field validation, only
// forwards the caller's computed disabled state to the button.
//
// This composes the existing <Modal>/<ModalFooter> exactly as the "Shell/
// Modal" pattern (node 4537:52515) describes: the modal floats above
// whatever page the caller already renders (typically a <PxListShell />
// screen) — it is never nested inside that page's shell, and this component
// never renders a rail/header itself. Field content (Text Field, Textarea,
// RadioGroup, DropdownField, etc.) is entirely caller-supplied via
// `children`, composed from existing approved components — this shell does
// not know or care what fields a given form needs.
// -----------------------------------------------------------------------------

function PxCreateEditShellModal({
  open,
  onOpenChange,
  size = "small",
  title,
  onCancel,
  primaryAction,
  children,
  className,
}: PxCreateEditShellModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} size={size} title={title} className={className}>
      <div className="overflow-y-auto p-[var(--p-space-300)]">{children}</div>
      <ModalFooter
        size={size}
        secondaryAction={{ label: "Cancel", onClick: onCancel }}
        primaryAction={primaryAction}
      />
    </Modal>
  )
}

export { PxCreateEditShellModal }
