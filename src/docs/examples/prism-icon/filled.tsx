import { PrismIcon } from "@/components/ui/prism-icon"

// "filled" looks up src/assets/icons/filled/{size}/{name}.svg — a separate,
// solid status-glyph set. Only 16px and 24px exist in that folder.
export default function PrismIconFilled() {
  return (
    <div className="flex items-center gap-[var(--p-space-300)]">
      <PrismIcon name="success-filled" iconStyle="filled" size={24} />
      <PrismIcon name="warning-filled" iconStyle="filled" size={24} />
      <PrismIcon name="danger-filled" iconStyle="filled" size={24} />
    </div>
  )
}
