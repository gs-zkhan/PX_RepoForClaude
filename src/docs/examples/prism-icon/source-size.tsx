import { PrismIcon } from "@/components/ui/prism-icon"

// sourceSize picks the asset folder independently of the rendered size — use
// it when only one folder has the glyph you need, scaled to fit a smaller or
// larger slot than it was drawn for.
export default function PrismIconSourceSize() {
  return <PrismIcon name="search" sourceSize={24} size={16} />
}
