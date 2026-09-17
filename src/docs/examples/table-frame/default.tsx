import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TableFrame } from "@/components/ui/table-frame"

const ROWS = [
  { event: "Membership changed", when: "Sep 5, 2026" },
  { event: "Criteria updated", when: "Sep 3, 2026" },
  { event: "Record created", when: "Aug 20, 2026" },
]

export default function TableFrameDefault() {
  return (
    <TableFrame title="Recent Activity" count={ROWS.length}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((row) => (
            <TableRow key={row.event}>
              <TableCell>{row.event}</TableCell>
              <TableCell>{row.when}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableFrame>
  )
}
