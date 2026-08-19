import * as React from "react"

import { Pagination } from "@/components/ui/pagination"

// Custom pageSizeOptions replaces the default [10, 25, 50] list entirely.
export default function PaginationPageSizeOptions() {
  const [page, setPage] = React.useState(2)
  const [pageSize, setPageSize] = React.useState(20)
  const totalItems = 96

  return (
    <Pagination
      page={page}
      pageCount={Math.ceil(totalItems / pageSize)}
      pageSize={pageSize}
      totalItems={totalItems}
      pageSizeOptions={[20, 40, 100]}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
    />
  )
}
