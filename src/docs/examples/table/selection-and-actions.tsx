import {
  Table,
  TableActionCell,
  TableActionHead,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectionCell,
  TableSelectionHead,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { IconButton } from "@/components/ui/icon-button"

// Selection and action columns share a fixed action-column width. Action
// cell content is opacity-0 until the row is hovered, focused within, or
// selected — TableRow already carries the `group` class this depends on.
export default function TableSelectionAndActions() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableSelectionHead>
            <Checkbox aria-label="Select all" />
          </TableSelectionHead>
          <TableHead>Account</TableHead>
          <TableActionHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableSelectionCell>
            <Checkbox aria-label="Select row" />
          </TableSelectionCell>
          <TableCell>Acme Inc.</TableCell>
          <TableActionCell>
            <IconButton icon="more-vertical" label="Row actions" />
          </TableActionCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
