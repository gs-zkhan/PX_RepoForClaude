import * as React from "react"

import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast"

// `action` accepts "undo" or "cta" — both extend the auto-dismiss duration
// from 4s to 8s so the user has time to act. Danger toasts never auto-dismiss
// regardless of action, per the component's own Behaviour note.
export default function ToastAction() {
  const [open, setOpen] = React.useState(true)

  return (
    <ToastProvider>
      <div className="flex flex-col gap-[var(--p-space-100)]">
        <Toast
          open={open}
          onOpenChange={setOpen}
          message="Record deleted."
          action={{ type: "undo", onUndo: () => console.log("undo") }}
        />
        <Toast
          open={open}
          onOpenChange={setOpen}
          variant="info"
          message="Export is ready."
          action={{ type: "cta", label: "Download", onAction: () => console.log("download") }}
        />
      </div>
      <ToastViewport />
    </ToastProvider>
  )
}
