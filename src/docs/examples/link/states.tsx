import { Link } from "@/components/ui/link"

export default function LinkStates() {
  return (
    <div className="flex flex-col gap-[var(--p-space-100)]">
      <Link href="#">Default state — hover to see the underline</Link>
      <Link disabled title="Unavailable until the invoice is finalized">
        Disabled — Download invoice
      </Link>
    </div>
  )
}
