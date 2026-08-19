import { ConfigRow } from "@/components/ui/config-row"
import { PrismIcon } from "@/components/ui/prism-icon"

export default function ConfigRowDisabled() {
  return (
    <ConfigRow
      icon={<PrismIcon name="announce" size={16} decorative />}
      title="Renewal reminders"
      subtitle="Requires a connected calendar"
      disabled
      onClick={() => {}}
    />
  )
}
