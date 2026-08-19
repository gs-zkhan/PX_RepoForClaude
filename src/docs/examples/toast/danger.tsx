import * as React from "react"

import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast"

// Danger is the only variant that never auto-dismisses — it stays open until
// the user manually closes it, and is announced as role="alert"
// aria-live="assertive" instead of the polite live region other variants use.
export default function ToastDanger() {
  const [open, setOpen] = React.useState(true)

  return (
    <ToastProvider>
      <Toast
        open={open}
        onOpenChange={setOpen}
        variant="danger"
        message="Unable to reach the server. Changes were not saved."
      />
      <ToastViewport />
    </ToastProvider>
  )
}
