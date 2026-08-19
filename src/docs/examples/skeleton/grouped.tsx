import { Skeleton } from "@/components/ui/skeleton"

// A single Line skeleton is never sufficient — group instances to mirror the
// real content layout that will arrive (here: an avatar row with two lines).
export default function SkeletonGrouped() {
  return (
    <div className="flex items-center gap-[var(--p-space-200)]">
      <Skeleton variant="avatar" />
      <div className="flex flex-1 flex-col gap-[var(--p-space-100)]">
        <Skeleton variant="line" className="w-1/3" />
        <Skeleton variant="line" className="w-2/3" />
      </div>
    </div>
  )
}
