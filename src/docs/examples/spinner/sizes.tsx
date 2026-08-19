import { Spinner } from "@/components/ui/spinner"

export default function SpinnerSizes() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--p-space-300)]">
      <Spinner size="xs" />
      <Spinner size="s" />
      <Spinner size="m" />
      <Spinner size="l" />
      <Spinner size="xl" />
    </div>
  )
}
