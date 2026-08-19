import * as React from "react"

import { ViewSwitcher } from "@/components/ui/view-switcher"

// `icon` on an option is optional — Figma's own spec allows mixing icon and
// no-icon options within the same switcher.
export default function ViewSwitcherWithIcons() {
  const [value, setValue] = React.useState("chart")

  return (
    <ViewSwitcher
      value={value}
      onValueChange={setValue}
      options={[
        { value: "chart", label: "Chart", icon: "bar-chart" },
        { value: "table", label: "Table", icon: "table" },
        { value: "list", label: "List" },
      ]}
    />
  )
}
