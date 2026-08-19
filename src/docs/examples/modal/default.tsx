import * as React from "react"

import { Modal, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

export default function ModalDefault() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Rename segment"
        description="This updates the segment name everywhere it's referenced."
      >
        <div className="p-[var(--p-space-300)]">
          <p className="text-sm text-[var(--s-color-text-subtle)]">
            Modal body content goes here, composed by the caller.
          </p>
        </div>
        <ModalFooter
          secondaryAction={{ label: "Cancel", onClick: () => setOpen(false) }}
          primaryAction={{ label: "Save changes", onClick: () => setOpen(false) }}
        />
      </Modal>
    </>
  )
}
