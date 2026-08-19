import {
  Table,
  TableEmptyState,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function TableEmptyStateExample() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Account</TableHead>
          <TableHead>MRR</TableHead>
        </TableRow>
      </TableHeader>
      <TableEmptyState
        colSpan={2}
        title="No accounts yet"
        body="Accounts you add will show up here."
        primaryAction={<Button size="small">Add account</Button>}
      />
    </Table>
  )
}
