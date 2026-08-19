import * as React from "react"

import { InputNumber } from "@/components/ui/input-number"

export default function InputNumberDefault() {
  const [value, setValue] = React.useState(5)

  return <InputNumber value={value} onValueChange={setValue} min={0} max={10} ariaLabel="Quantity" />
}
