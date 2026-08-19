import * as React from "react"

import { Pagination } from "@/components/ui/pagination"

export default function PaginationDefault() {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)
  const totalItems = 238

  return (
    <Pagination
      page={page}
      pageCount={Math.ceil(totalItems / pageSize)}
      pageSize={pageSize}
      totalItems={totalItems}
      onPageChange={setPage}
      onPageSizeChange={(size) => {
        setPageSize(size)
        setPage(1)
      }}
    />
  )
}
