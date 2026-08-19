import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function TableDefault() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Account</TableHead>
          <TableHead>MRR</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Acme Inc.</TableCell>
          <TableCell align="right">$4,200</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Globex Corp.</TableCell>
          <TableCell align="right">$1,850</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
