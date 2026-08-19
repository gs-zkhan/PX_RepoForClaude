import * as React from "react"

import { Modal, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

// ModalFooter lays out tertiary (far left), secondary and primary (right,
// grouped) — all three are optional and independently omissible.
export default function ModalFooterActions() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal with full footer</Button>
      <Modal open={open} onOpenChange={setOpen} title="Delete 3 accounts">
        <div className="p-[var(--p-space-300)]">
          <p className="text-sm text-[var(--s-color-text-subtle)]">
            This action cannot be undone.
          </p>
        </div>
        <ModalFooter
          tertiaryAction={{ label: "Learn more", onClick: () => {} }}
          secondaryAction={{ label: "Cancel", onClick: () => setOpen(false) }}
          primaryAction={{ label: "Delete", onClick: () => setOpen(false) }}
        />
      </Modal>
    </>
  )
}
