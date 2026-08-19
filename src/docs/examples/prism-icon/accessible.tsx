import { PrismIcon } from "@/components/ui/prism-icon"

// decorative defaults to true (aria-hidden, no accessible name) because most
// icons decorate adjacent text. Set decorative={false} with a label when the
// icon is the only carrier of meaning, e.g. a standalone status glyph.
export default function PrismIconAccessible() {
  return <PrismIcon name="danger-filled" iconStyle="filled" size={24} decorative={false} label="At risk" />
}
