import * as React from "react"

import { ColumnSelector } from "@/components/ui/column-selector"

const columns = [
  { id: "name", label: "Account name" },
  { id: "health", label: "Health score" },
  { id: "mrr", label: "MRR" },
]

// The "order" view swaps the checkbox list for a drag-handle glyph plus
// keyboard up/down reordering via onReorder. Reset is hidden in this view.
export default function ColumnSelectorOrderView() {
  const [order, setOrder] = React.useState(["name", "health", "mrr"])

  return (
    <ColumnSelector
      columns={columns}
      selected={order}
      order={order}
      view="order"
      onSelectedChange={() => {}}
      onReorder={setOrder}
    />
  )
}
