import * as React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSortHeader,
} from "@/components/ui/table"
import type { TableSortDirection } from "@/components/ui/table"

// `sortable` opts a header into interactive styling and aria-sort — it is
// never inferred from `sortDirection` alone.
export default function TableSortableHeader() {
  const [direction, setDirection] = React.useState<TableSortDirection>("ascending")

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead sortable sortDirection={direction}>
            <TableSortHeader
              direction={direction}
              onClick={() =>
                setDirection(direction === "ascending" ? "descending" : "ascending")
              }
            >
              Account
            </TableSortHeader>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Acme Inc.</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
