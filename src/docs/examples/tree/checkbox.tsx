import * as React from "react"

import { Tree, TreeItem } from "@/components/ui/tree"

// Chevron and checkbox are independent, simultaneously-renderable slots, not
// mutually exclusive — a multiselect branch row always shows both.
export default function TreeCheckbox() {
  const [checked, setChecked] = React.useState<boolean | "indeterminate">("indeterminate")

  return (
    <Tree>
      <TreeItem
        level={1}
        label="All accounts"
        expandable
        expanded
        checkbox
        checked={checked}
        onCheckedChange={setChecked}
      />
      <TreeItem level={2} label="Active accounts" checkbox checked />
      <TreeItem level={2} label="At-risk accounts" checkbox checked={false} />
    </Tree>
  )
}
