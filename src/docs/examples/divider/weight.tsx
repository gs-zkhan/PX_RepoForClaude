import { Divider } from "@/components/ui/divider"

export default function DividerWeight() {
  return (
    <div className="flex w-[320px] flex-col gap-[var(--p-space-300)]">
      <Divider weight={1} />
      <Divider weight={2} />
    </div>
  )
}
