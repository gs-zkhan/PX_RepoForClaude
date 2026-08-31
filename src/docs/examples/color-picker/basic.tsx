import * as React from "react"

import { ColorPickerBasic, type BasicColorValue } from "@/components/ui/color-picker-basic"

export default function ColorPickerBasicExample() {
  const [value, setValue] = React.useState<BasicColorValue | null>({
    family: "royalBlue",
    shade: 600,
    token: "color/royalBlue/600",
    cssVar: "var(--p-color-royal-blue-600)",
  })

  return <ColorPickerBasic value={value} onValueChange={setValue} />
}
