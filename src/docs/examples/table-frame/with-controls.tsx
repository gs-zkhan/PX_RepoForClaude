import * as React from "react"

import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/ui/search-bar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type TableDensity,
} from "@/components/ui/table"
import { TableCustomizationMenu } from "@/components/ui/table-customization-menu"
import { TableFrame } from "@/components/ui/table-frame"

const COLUMNS = [
  { id: "name", label: "Name" },
  { id: "status", label: "Status" },
]

const ROWS = [
  { name: "Northwind Labs", status: "Healthy" },
  { name: "Cobalt Metrics", status: "Healthy" },
  { name: "Helio Freight", status: "At Risk" },
]

export default function TableFrameWithControls() {
  const [query, setQuery] = React.useState("")
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [filterOpen, setFilterOpen] = React.useState(false)
  const [density, setDensity] = React.useState<TableDensity>("default")
  const [selectedColumns, setSelectedColumns] = React.useState(COLUMNS.map((c) => c.id))
  const [columnOrder, setColumnOrder] = React.useState(COLUMNS.map((c) => c.id))

  return (
    <TableFrame
      title="Accounts"
      count={ROWS.length}
      search={{
        open: searchOpen,
        onToggle: () => setSearchOpen((v) => !v),
        render: (
          <SearchBar
            size="small"
            placeholder="Search accounts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery("")}
          />
        ),
      }}
      filter={{ active: filterOpen, onToggle: () => setFilterOpen((v) => !v) }}
      customization={
        <TableCustomizationMenu
          columns={COLUMNS}
          selectedColumns={selectedColumns}
          onSelectedColumnsChange={setSelectedColumns}
          columnOrder={columnOrder}
          onColumnOrderChange={setColumnOrder}
          density={density}
          onDensityChange={setDensity}
        />
      }
      actions={
        <Button variant="primary" size="large">
          Add Account
        </Button>
      }
    >
      <Table density={density}>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableFrame>
  )
}
