import * as React from "react"
import { RteField } from "@/components/ui/rte-field"

export default function RteFieldDefaultExample() {
  const [value, setValue] = React.useState("")

  return (
    <RteField
      type="default"
      label="Comment"
      value={value}
      onValueChange={setValue}
      showCtAs
      onCancel={() => setValue("")}
      onSave={() => {}}
    />
  )
}
