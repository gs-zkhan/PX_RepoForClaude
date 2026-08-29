import { Link } from "@/components/ui/link"

export default function LinkIconExternal() {
  return (
    <div className="flex flex-col gap-[var(--p-space-100)]">
      <Link href="#" icon>View invoice</Link>
      <Link href="#" external aria-label="Read the guide (opens in a new tab)">
        Read the guide
      </Link>
      <Link href="#" icon external aria-label="View source (opens in a new tab)">
        View source
      </Link>
    </div>
  )
}
