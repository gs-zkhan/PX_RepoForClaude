import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"

export default function CheckboxDefault() {
  const [checked, setChecked] = React.useState<boolean>(false)

  return (
    <Checkbox
      checked={checked}
      onCheckedChange={(value) => setChecked(value === true)}
    />
  )
}
