import * as React from "react"

import { ColorPicker } from "@/components/ui/color-picker"
import type { BasicColorValue } from "@/components/ui/color-picker-basic"

export default function ColorPickerAnchoredTrigger() {
  const [basic, setBasic] = React.useState<BasicColorValue | null>(null)
  const [advanced, setAdvanced] = React.useState({ hex: "#0369E9", alpha: 100 })

  return (
    <div className="flex items-center gap-4">
      <ColorPicker mode="basic" value={basic} onValueChange={setBasic} triggerLabel="Label colour" />
      <ColorPicker mode="advanced" value={advanced} onValueChange={setAdvanced} triggerLabel="Custom colour" />
    </div>
  )
}
