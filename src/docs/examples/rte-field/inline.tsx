import * as React from "react"
import { RteField } from "@/components/ui/rte-field"

export default function RteFieldInlineExample() {
  const [value, setValue] = React.useState("")

  return <RteField type="inline" label="Card note" value={value} onValueChange={setValue} />
}
