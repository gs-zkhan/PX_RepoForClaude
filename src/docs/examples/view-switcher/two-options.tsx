import * as React from "react"

import { ViewSwitcher } from "@/components/ui/view-switcher"

// ViewSwitcher supports 2-3 fixed options — for more, use a dropdown instead.
export default function ViewSwitcherTwoOptions() {
  const [value, setValue] = React.useState("table")

  return (
    <ViewSwitcher
      value={value}
      onValueChange={setValue}
      options={[
        { value: "table", label: "Table" },
        { value: "chart", label: "Chart" },
      ]}
    />
  )
}
