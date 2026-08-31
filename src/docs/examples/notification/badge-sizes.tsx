import { NotificationBadge } from "@/components/ui/notification"

export default function NotificationBadgeSizesExample() {
  return (
    <div className="flex items-center gap-4">
      <NotificationBadge size="small" />
      <NotificationBadge size="medium" />
      <NotificationBadge size="large" />
      <NotificationBadge size="largeWithNumber" count={9} />
    </div>
  )
}
