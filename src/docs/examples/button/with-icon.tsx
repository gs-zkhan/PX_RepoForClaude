import { Button } from "@/components/ui/button"
import { PrismIcon } from "@/components/ui/prism-icon"

// Button has no `icon` prop — icons are composed as children. The button owns
// the gap between icon and label via --c-button-gap-*, so no spacing classes
// are needed here.
export default function ButtonWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
      <Button>
        <PrismIcon name="add" size={16} sourceSize={24} decorative />
        Create engagement
      </Button>
      <Button variant="secondary">
        Export
        <PrismIcon name="arrow-right" size={16} decorative />
      </Button>
    </div>
  )
}
