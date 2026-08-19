import * as React from "react"

import { InputNumber } from "@/components/ui/input-number"

// The stepper clamps to [min, max] on click. At a bound, that stepper button
// disables itself rather than doing nothing silently.
export default function InputNumberBounds() {
  const [value, setValue] = React.useState(10)

  return <InputNumber value={value} onValueChange={setValue} min={0} max={10} ariaLabel="Score" />
}
