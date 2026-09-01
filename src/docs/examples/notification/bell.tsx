import * as React from "react"
import { NotificationBell, type NotificationItemData } from "@/components/ui/notification"

export default function NotificationBellExample() {
  const [items, setItems] = React.useState<NotificationItemData[]>([
    { id: "1", type: "info", title: "Account health score dropped below 60%", body: "Acme Corp — Health Score: 72 → 58", timestamp: "2 min ago", read: false },
    { id: "2", type: "warning", title: "Renewal date approaching in 14 days", body: "Acme Corp — Renewal: Mar 15, 2026", timestamp: "3 hours ago", read: false },
    { id: "3", type: "success", title: "Onboarding completed for Acme Corp", body: "Acme Corp — 5 steps complete", timestamp: "1 hour ago", read: true },
  ])
  const [viewAllClicked, setViewAllClicked] = React.useState(false)

  return (
    <div className="flex flex-col gap-2">
      <NotificationBell
        items={items}
        onDismissItem={(id) => setItems((prev) => prev.filter((item) => item.id !== id))}
        onMarkAllRead={() => setItems((prev) => prev.map((item) => ({ ...item, read: true })))}
        onViewAll={() => setViewAllClicked(true)}
      />
      {viewAllClicked && (
        <span className="text-xs text-[var(--s-color-text-subtlest)]">
          &quot;View all notifications&quot; fired onViewAll — this component never navigates itself, the
          consumer must handle the destination.
        </span>
      )}
    </div>
  )
}
