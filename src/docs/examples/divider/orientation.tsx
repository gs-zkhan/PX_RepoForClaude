import { Divider } from "@/components/ui/divider"

export default function DividerOrientation() {
  return (
    <div className="flex w-[320px] flex-col gap-[var(--p-space-300)]">
      <Divider />
      <div className="flex h-12 items-stretch gap-[var(--p-space-300)]">
        <span className="text-sm text-[var(--s-color-text-default)]">Left</span>
        <Divider orientation="vertical" />
        <span className="text-sm text-[var(--s-color-text-default)]">Right</span>
      </div>
    </div>
  )
}
