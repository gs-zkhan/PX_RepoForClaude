import { ConfigRow } from "@/components/ui/config-row"
import { PrismIcon } from "@/components/ui/prism-icon"
import { StatusLabel } from "@/components/ui/status-label"

// `trailing` is a freeform slot before the chevron — drop in a StatusLabel,
// a Chip, or plain text.
export default function ConfigRowWithTrailing() {
  return (
    <ConfigRow
      icon={<PrismIcon name="auto-update" size={16} decorative />}
      title="Webhook integration"
      subtitle="Notifies on every engagement completion"
      trailing={<StatusLabel variant="active">Active</StatusLabel>}
      onClick={() => {}}
    />
  )
}
