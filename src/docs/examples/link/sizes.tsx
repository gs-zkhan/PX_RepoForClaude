import { Link } from "@/components/ui/link"

export default function LinkSizes() {
  return (
    <div className="flex flex-col gap-[var(--p-space-100)]">
      <Link href="#">Default link (14px)</Link>
      <Link href="#" size="small">Small link (12px)</Link>
    </div>
  )
}
