import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Row height comes from --c-table-row-height-* keyed off the density passed
// to Table — never set row height by hand on TableRow.
export default function TableDensity() {
  return (
    <div className="flex flex-col gap-[var(--p-space-300)]">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <Table key={density} density={density}>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Acme Inc. ({density})</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ))}
    </div>
  )
}
