import { ConfigRow } from "@/components/ui/config-row"
import { PrismIcon } from "@/components/ui/prism-icon"

// Without `onClick`, the row renders as a non-interactive <div> with no
// hover/focus states. `hideChevron` suits purely informational rows.
export default function ConfigRowNonInteractive() {
  return (
    <ConfigRow
      icon={<PrismIcon name="user" size={16} decorative />}
      title="Created by"
      subtitle="Jamie Summers on Jul 12, 2026"
      hideChevron
    />
  )
}
