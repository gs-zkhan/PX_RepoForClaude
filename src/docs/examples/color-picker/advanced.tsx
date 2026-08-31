import * as React from "react"

import { ColorPickerAdvanced } from "@/components/ui/color-picker-advanced"

export default function ColorPickerAdvancedExample() {
  const [value, setValue] = React.useState({ hex: "#DC3626", alpha: 100 })

  return (
    <ColorPickerAdvanced
      value={value}
      onValueChange={setValue}
      presets={[
        { hex: "#0369E9", label: "Royal Blue 700" },
        { hex: "#13AD68", label: "Fresh Green 700" },
        { hex: "#DC3626", label: "Tart Red 700" },
        { hex: "#8F54D4", label: "Purple 600" },
        { hex: "#181F26", label: "Neutral 800" },
      ]}
    />
  )
}
