import * as React from "react"

import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast"

// All four are rendered open at once here purely to compare icon and
// treatment side by side. In a real screen, mount one Toast per notification
// — this repo does not stack or dedupe multiple open toasts.
export default function ToastVariants() {
  const [open, setOpen] = React.useState(true)

  return (
    <ToastProvider>
      <div className="flex flex-col gap-[var(--p-space-100)]">
        <Toast open={open} onOpenChange={setOpen} variant="success" message="Engagement published." />
        <Toast open={open} onOpenChange={setOpen} variant="warning" message="This segment has no members yet." />
        <Toast open={open} onOpenChange={setOpen} variant="danger" message="Failed to save changes." />
        <Toast open={open} onOpenChange={setOpen} variant="info" message="A new version is available." />
      </div>
      <ToastViewport />
    </ToastProvider>
  )
}
