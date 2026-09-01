import * as React from "react"
import { RteField } from "@/components/ui/rte-field"

export default function RteFieldFloatingExample() {
  const [value, setValue] = React.useState(
    "Select some of this text to see the floating formatting toolbar appear near your selection.",
  )

  return <RteField type="floating" value={value} onValueChange={setValue} />
}
