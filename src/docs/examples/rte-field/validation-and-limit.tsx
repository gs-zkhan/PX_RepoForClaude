import * as React from "react"
import { RteField } from "@/components/ui/rte-field"

export default function RteFieldValidationAndLimitExample() {
  const [errorValue, setErrorValue] = React.useState("")
  const [limitedValue, setLimitedValue] = React.useState("")

  return (
    <div className="flex flex-col gap-6">
      <RteField
        type="default"
        label="Comment"
        required
        value={errorValue}
        onValueChange={setErrorValue}
        error="A comment is required."
      />
      <RteField
        type="default"
        label="Description"
        value={limitedValue}
        onValueChange={setLimitedValue}
        maxLength={280}
      />
    </div>
  )
}
