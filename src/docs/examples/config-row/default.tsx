import { ConfigRow } from "@/components/ui/config-row"
import { PrismIcon } from "@/components/ui/prism-icon"

export default function ConfigRowDefault() {
  return (
    <ConfigRow
      icon={<PrismIcon name="settings" size={16} decorative />}
      title="General settings"
      subtitle="Name, timezone and default locale"
      onClick={() => {}}
    />
  )
}
