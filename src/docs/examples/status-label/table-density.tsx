import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { StatusLabel } from "@/components/ui/status-label"

// With no explicit `size`, StatusLabel reads the table's density from
// context via useTableDensity — compact tables render the small chip
// automatically, so callers never pass size by hand inside a table.
export default function StatusLabelTableDensity() {
  return (
    <Table density="compact">
      <TableHeader>
        <TableRow>
          <TableHead>Account</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Acme Inc.</TableCell>
          <TableCell>
            <StatusLabel variant="active">Active</StatusLabel>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
