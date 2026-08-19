import * as React from "react"

import { Modal, ModalFooter } from "@/components/ui/modal"
import type { ModalSize } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

// Width is fixed per size (Large 904px / Medium 712px / Small 424px); height
// always grows with content — Modal never scrolls internally.
export default function ModalSizes() {
  const [openSize, setOpenSize] = React.useState<ModalSize | null>(null)

  return (
    <>
      <div className="flex gap-[var(--p-space-200)]">
        <Button size="small" onClick={() => setOpenSize("large")}>Large</Button>
        <Button size="small" onClick={() => setOpenSize("medium")}>Medium</Button>
        <Button size="small" onClick={() => setOpenSize("small")}>Small</Button>
      </div>
      <Modal
        open={openSize !== null}
        onOpenChange={(next) => setOpenSize(next ? openSize : null)}
        size={openSize ?? "medium"}
        title={`${openSize ?? "medium"} modal`}
      >
        <div className="p-[var(--p-space-300)]">
          <p className="text-sm text-[var(--s-color-text-subtle)]">
            Width is fixed for this size; height grows with content.
          </p>
        </div>
        <ModalFooter
          size={openSize ?? "medium"}
          primaryAction={{ label: "Done", onClick: () => setOpenSize(null) }}
        />
      </Modal>
    </>
  )
}
