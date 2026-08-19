import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonVariants() {
  return (
    <div className="flex flex-wrap items-start gap-[var(--p-space-300)]">
      <Skeleton variant="line" className="w-40" />
      <Skeleton variant="block" className="w-40" />
      <Skeleton variant="avatar" />
      <Skeleton variant="card" className="w-40" />
    </div>
  )
}
