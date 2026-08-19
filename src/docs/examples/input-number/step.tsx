import * as React from "react"

import { InputNumber } from "@/components/ui/input-number"

// Bounds and step are always caller-owned — always pass min/max/step.
export default function InputNumberStep() {
  const [value, setValue] = React.useState(50)

  return <InputNumber value={value} onValueChange={setValue} min={0} max={100} step={10} ariaLabel="Percent" />
}
