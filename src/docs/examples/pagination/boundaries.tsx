import { Pagination } from "@/components/ui/pagination"

// Previous/Next collapse to their disabled treatment automatically at the
// first and last page — there is no separate disabled prop to set.
export default function PaginationBoundaries() {
  return (
    <div className="flex flex-col gap-[var(--p-space-200)]">
      <Pagination
        page={1}
        pageCount={10}
        pageSize={25}
        totalItems={238}
        onPageChange={() => {}}
      />
      <Pagination
        page={10}
        pageCount={10}
        pageSize={25}
        totalItems={238}
        onPageChange={() => {}}
      />
    </div>
  )
}
