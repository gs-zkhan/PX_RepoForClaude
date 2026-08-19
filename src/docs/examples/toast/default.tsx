import * as React from "react"

import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast"

export default function ToastDefault() {
  const [open, setOpen] = React.useState(true)

  return (
    <ToastProvider>
      <Toast open={open} onOpenChange={setOpen} message="Changes saved successfully." />
      <ToastViewport />
    </ToastProvider>
  )
}
