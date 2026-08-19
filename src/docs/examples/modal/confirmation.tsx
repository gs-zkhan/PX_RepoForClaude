import * as React from "react"

import { ModalConfirmation } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

// ModalConfirmation is a structurally distinct variant — icon + title +
// subtitle + inline button row, no header bar, no separate footer, and no
// close icon. It must be dismissed via its own action buttons only.
export default function ModalConfirmationExample() {
  const [variant, setVariant] = React.useState<"success" | "danger" | null>(null)

  return (
    <>
      <div className="flex gap-[var(--p-space-200)]">
        <Button size="small" onClick={() => setVariant("success")}>Show success</Button>
        <Button size="small" variant="destructive" onClick={() => setVariant("danger")}>Show danger</Button>
      </div>
      <ModalConfirmation
        open={variant !== null}
        onOpenChange={(next) => setVariant(next ? variant : null)}
        variant={variant ?? "success"}
        title={variant === "danger" ? "Failed to publish" : "Segment published"}
        description={
          variant === "danger"
            ? "The segment couldn't be published. Try again."
            : "Your segment is now live for all users."
        }
        primaryAction={{ label: "Done", onClick: () => setVariant(null) }}
      />
    </>
  )
}
