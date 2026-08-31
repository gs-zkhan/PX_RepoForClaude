import * as React from "react"

import { ColorPickerAdvanced } from "@/components/ui/color-picker-advanced"

// Demonstrates alpha handling (drag the opacity slider) and the invalid-HEX
// error path (type a non-hex value into the HEX field and blur/press Enter).
export default function ColorPickerAlphaAndError() {
  const [value, setValue] = React.useState({ hex: "#13AD68", alpha: 45 })

  return <ColorPickerAdvanced value={value} onValueChange={setValue} />
}
