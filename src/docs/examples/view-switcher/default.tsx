import * as React from "react"

import { ViewSwitcher } from "@/components/ui/view-switcher"

export default function ViewSwitcherDefault() {
  const [value, setValue] = React.useState("chart")

  return (
    <ViewSwitcher
      value={value}
      onValueChange={setValue}
      options={[
        { value: "chart", label: "Chart" },
        { value: "table", label: "Table" },
        { value: "list", label: "List" },
      ]}
    />
  )
}
