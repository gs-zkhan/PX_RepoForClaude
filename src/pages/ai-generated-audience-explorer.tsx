/**
 * Audience Explorer (AI Demo) — cold-generation screen built ONLY from the
 * reusable PX system (PxListShell + src/components/ui). No existing
 * Audience/User Explorer implementation was read, imported, or used as a
 * reference for this file.
 *
 * Everything feature-specific (mock users, column defs, filter/sort/search
 * state, row actions) lives in this file. The shell + shared components are
 * responsible for chrome, tokens, and interaction primitives only.
 */

import * as React from "react"

import { cn } from "@/lib/utils"
import { PxListShell } from "@/patterns/px-list-shell"
import { PX_NAV_LABELS, type PxShellNavKey, type PxShellRailMode } from "@/components/px-shell-rail"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FilterBar, type FilterBarChip } from "@/components/ui/filter-bar"
import { FilterConfigModal, type FilterCriterion } from "@/components/ui/filter-config-modal"
import { FilterDropdownPanel } from "@/components/ui/filter-dropdown-panel"
import { IconButton } from "@/components/ui/icon-button"
import { Pagination } from "@/components/ui/pagination"
import { SearchBar } from "@/components/ui/search-bar"
import { StatusSelect, type StatusSelectOption } from "@/components/ui/status-select"
import {
  Table,
  TableActionCell,
  TableActionHead,
  TableBody,
  TableCell,
  TableEmptyState,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectionCell,
  TableSelectionHead,
  TableSortHeader,
  type TableDensity,
  type TableSortDirection,
} from "@/components/ui/table"
import { TableCustomizationMenu } from "@/components/ui/table-customization-menu"
import type { ColumnSelectorColumn } from "@/components/ui/column-selector"

// ---------------------------------------------------------------------------
// Mock data — feature-owned, realistic Audience Explorer rows.
// ---------------------------------------------------------------------------

type AudienceStatus = "active" | "inactive" | "waiting"

type AudienceRow = {
  id: string
  userName: string
  userId: string
  email: string
  company: string
  title: string
  department: string
  location: string
  plan: string
  lastSeen: string
  signupDate: string
  sessions: number
  phone: string
  status: AudienceStatus
}

const FIRST_NAMES = [
  "Jacob", "Darrell", "Jane", "Kathryn", "Eleanor", "Guy", "Devon", "Savannah",
  "Jenny", "Floyd", "Cody", "Albert", "Jerome", "Courtney", "Arlene", "Brooklyn",
  "Dianne", "Ronald", "Marvin", "Leslie", "Kristin", "Cameron", "Annette", "Bessie",
  "Wade", "Theresa", "Esther", "Robert", "Jessica", "Ralph", "Pedro", "Alma",
  "Cody", "Ronald", "Kathryn", "Dianne", "Wade", "Esther",
]
const LAST_NAMES = [
  "Jones", "Steward", "Cooper", "Murphy", "Pena", "Hawkins", "Lane", "Nguyen",
  "Wilson", "Miles", "Fisher", "Flores", "Bell", "Henry", "McCoy", "Simmons",
  "Russell", "Richards", "Torres", "Alexander", "Watson", "Vega", "Black", "Rivera",
  "Warren", "Webb", "Howard", "Fox", "Reyes", "Chen", "Duran", "Adams",
  "Gray", "Foster", "Ward", "Long", "Perry", "Ross",
]
const COMPANIES = [
  "Google", "Microsoft", "Salesforce", "HubSpot", "Zendesk", "Slack", "Stripe",
  "Figma", "Notion", "Airtable", "Linear", "Vercel", "Supabase", "Atlassian",
]
const TITLES = [
  "CEO", "VP Sales", "Director", "Manager", "Lead Engineer", "Account Exec",
  "Product Manager", "Designer", "Head of Growth", "Data Analyst", "Engineer",
  "CTO", "Solutions Architect",
]
const DEPARTMENTS = [
  "Engineering", "Sales", "Marketing", "Product", "Support", "Finance", "Human Resources", "Operations",
]
const LOCATIONS = [
  "San Francisco, US", "New York, US", "London, UK", "Berlin, DE",
  "Bangalore, IN", "Toronto, CA", "Sydney, AU", "Singapore, SG",
]
const PLANS = ["Enterprise", "Pro", "Free", "Trial"]
const STATUSES: AudienceStatus[] = ["active", "inactive", "waiting"]

// Fixed reference date keeps the generated demo data stable across renders.
const REFERENCE_DATE = new Date(2026, 7, 20)

function daysAgo(n: number) {
  const d = new Date(REFERENCE_DATE)
  d.setDate(d.getDate() - n)
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
}

function buildMockRows(count: number): AudienceRow[] {
  const rows: AudienceRow[] = []
  for (let i = 0; i < count; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length]
    const last = LAST_NAMES[(i * 3 + 1) % LAST_NAMES.length]
    const company = COMPANIES[(i * 2) % COMPANIES.length]
    const title = TITLES[(i * 5 + 2) % TITLES.length]
    const status = STATUSES[i % STATUSES.length]
    rows.push({
      id: `u${i + 1}`,
      userName: `${first} ${last}`,
      userId: `d886e11f-${i + 1}`,
      email: `${first.toLowerCase()}@${company.toLowerCase()}.com`,
      company,
      title,
      department: DEPARTMENTS[(i * 7 + 3) % DEPARTMENTS.length],
      location: LOCATIONS[(i * 4 + 1) % LOCATIONS.length],
      plan: PLANS[(i * 3) % PLANS.length],
      lastSeen: daysAgo(i % 15),
      signupDate: daysAgo(200 + i * 11),
      sessions: ((i * 13) % 480) + 5,
      phone: `+1 (555) ${String(100 + i).padStart(3, "0")}-${String(1000 + i * 7).padStart(4, "0")}`,
      status,
    })
  }
  return rows
}

const AUDIENCE_ROWS: AudienceRow[] = buildMockRows(42)

const STATUS_OPTIONS: StatusSelectOption[] = [
  { value: "active", variant: "active", label: "Active" },
  { value: "inactive", variant: "inactive", label: "Inactive" },
  { value: "waiting", variant: "waiting", label: "Waiting" },
]

const COMPANY_OPTIONS = COMPANIES.map((c) => ({ value: c, label: c }))

const PAGE_SIZE_OPTIONS = [10, 25, 50]

// ---------------------------------------------------------------------------
// Column definitions — feature-owned. ColumnSelector/TableCustomizationMenu
// only render the disclosure UI; this page decides what each column means
// and drives the actual header/body render from selection + order.
// ---------------------------------------------------------------------------

type AudienceColumnId =
  | "userName"
  | "userId"
  | "email"
  | "company"
  | "title"
  | "department"
  | "location"
  | "plan"
  | "lastSeen"
  | "signupDate"
  | "sessions"
  | "phone"
  | "status"

const AUDIENCE_COLUMNS: ColumnSelectorColumn[] = [
  { id: "userName", label: "User" },
  { id: "userId", label: "User ID" },
  { id: "email", label: "Email" },
  { id: "company", label: "Company" },
  { id: "title", label: "Title" },
  { id: "department", label: "Department" },
  { id: "location", label: "Location" },
  { id: "plan", label: "Plan" },
  { id: "lastSeen", label: "Last Seen" },
  { id: "signupDate", label: "Signup Date" },
  { id: "sessions", label: "Sessions" },
  { id: "phone", label: "Phone" },
  { id: "status", label: "Status" },
]

const AUDIENCE_COLUMN_IDS = AUDIENCE_COLUMNS.map((c) => c.id) as AudienceColumnId[]

const SORTABLE_COLUMNS: AudienceColumnId[] = ["userName", "company"]

// ---------------------------------------------------------------------------
// Feature: table card
// ---------------------------------------------------------------------------

function AudienceExplorerTable() {
  // Search -------------------------------------------------------------
  const [search, setSearch] = React.useState("")

  // Filtering ------------------------------------------------------------
  const [statusFilter, setStatusFilter] = React.useState<string[]>([])
  const [companyFilter, setCompanyFilter] = React.useState<string[]>([])
  const [companySearch, setCompanySearch] = React.useState("")
  const [openChipId, setOpenChipId] = React.useState<string | undefined>(undefined)

  // Modify/Add filter — reuses the repo's FilterConfigModal (opened from
  // FilterBar's onModifyFilter/onAddFilter) instead of a page-local dialog.
  const [filterModalOpen, setFilterModalOpen] = React.useState(false)
  const [filterCriteria, setFilterCriteria] = React.useState<FilterCriterion[]>([])
  const [filterAdvancedLogic, setFilterAdvancedLogic] = React.useState("A")

  // Sorting ----------------------------------------------------------------
  const [sortColumn, setSortColumn] = React.useState<AudienceColumnId | undefined>(undefined)
  const [sortDirection, setSortDirection] = React.useState<TableSortDirection>(undefined)

  function cycleSort(columnId: AudienceColumnId) {
    if (sortColumn !== columnId) {
      setSortColumn(columnId)
      setSortDirection("ascending")
      return
    }
    if (sortDirection === "ascending") {
      setSortDirection("descending")
    } else if (sortDirection === "descending") {
      setSortColumn(undefined)
      setSortDirection(undefined)
    } else {
      setSortDirection("ascending")
    }
  }

  // Pagination ---------------------------------------------------------
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  // Selection ------------------------------------------------------------
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

  // Status editing (per-row, buffered directly into row data) --------------
  const [rows, setRows] = React.useState<AudienceRow[]>(AUDIENCE_ROWS)

  // Table customization: density + column visibility/order -----------------
  const [density, setDensity] = React.useState<TableDensity>("default")
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>(AUDIENCE_COLUMN_IDS)
  const [columnOrder, setColumnOrder] = React.useState<string[]>(AUDIENCE_COLUMN_IDS)

  // --- Derived: filter + search -----------------------------------------
  const filteredRows = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    return rows.filter((row) => {
      if (statusFilter.length > 0 && !statusFilter.includes(row.status)) return false
      if (companyFilter.length > 0 && !companyFilter.includes(row.company)) return false
      if (!query) return true
      return (
        row.userName.toLowerCase().includes(query) ||
        row.email.toLowerCase().includes(query) ||
        row.company.toLowerCase().includes(query) ||
        row.title.toLowerCase().includes(query) ||
        row.userId.toLowerCase().includes(query)
      )
    })
  }, [rows, search, statusFilter, companyFilter])

  // --- Derived: sort ------------------------------------------------------
  const sortedRows = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredRows
    const copy = [...filteredRows]
    copy.sort((a, b) => {
      const [av, bv] = [a[sortColumn], b[sortColumn]]
      const result = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv))
      return sortDirection === "ascending" ? result : -result
    })
    return copy
  }, [filteredRows, sortColumn, sortDirection])

  // --- Derived: pagination --------------------------------------------
  const totalItems = sortedRows.length
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize))
  // Clamp during render (not in an effect) whenever filters/sort/pageSize
  // shrink the result set out from under the current page.
  const clampedPage = Math.min(page, pageCount)
  const pageRows = React.useMemo(() => {
    const start = (clampedPage - 1) * pageSize
    return sortedRows.slice(start, start + pageSize)
  }, [sortedRows, clampedPage, pageSize])

  // --- Selection helpers ----------------------------------------------
  const pageRowIds = pageRows.map((r) => r.id)
  const selectedOnPage = pageRowIds.filter((id) => selectedIds.has(id))
  const allPageSelected = pageRowIds.length > 0 && selectedOnPage.length === pageRowIds.length
  const somePageSelected = selectedOnPage.length > 0 && !allPageSelected

  function toggleSelectAll(checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      pageRowIds.forEach((id) => (checked ? next.add(id) : next.delete(id)))
      return next
    })
  }

  function toggleRowSelected(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function updateStatus(id: string, status: AudienceStatus) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  // --- Column visibility/order (drives actual render, not just the menu) --
  const visibleOrderedColumns = columnOrder
    .filter((id) => selectedColumns.includes(id))
    .map((id) => AUDIENCE_COLUMNS.find((c) => c.id === id))
    .filter((c): c is ColumnSelectorColumn => Boolean(c))

  function renderHeadCell(col: ColumnSelectorColumn) {
    const id = col.id as AudienceColumnId
    if (SORTABLE_COLUMNS.includes(id)) {
      return (
        <TableHead
          key={id}
          sortable
          sortDirection={sortColumn === id ? sortDirection : undefined}
        >
          <TableSortHeader
            direction={sortColumn === id ? sortDirection : undefined}
            onClick={() => cycleSort(id)}
          >
            {col.label}
          </TableSortHeader>
        </TableHead>
      )
    }
    return <TableHead key={id}>{col.label}</TableHead>
  }

  function renderBodyCell(col: ColumnSelectorColumn, row: AudienceRow) {
    const id = col.id as AudienceColumnId
    if (id === "status") {
      return (
        <TableCell key={id}>
          <StatusSelect
            value={row.status}
            options={STATUS_OPTIONS}
            onValueChange={(value) => updateStatus(row.id, value as AudienceStatus)}
          />
        </TableCell>
      )
    }
    return <TableCell key={id}>{row[id]}</TableCell>
  }

  // --- Filter bar chips -----------------------------------------------
  const filterChips: FilterBarChip[] = [
    {
      id: "status",
      label: "Status",
      value:
        statusFilter.length === 0
          ? undefined
          : statusFilter.length === 1
            ? STATUS_OPTIONS.find((o) => o.value === statusFilter[0])?.label
            : `${statusFilter.length} selected`,
    },
    {
      id: "company",
      label: "Company",
      value:
        companyFilter.length === 0
          ? undefined
          : companyFilter.length === 1
            ? companyFilter[0]
            : `${companyFilter.length} selected`,
    },
  ]

  const filteredCompanyOptions = COMPANY_OPTIONS.filter((o) =>
    o.label.toLowerCase().includes(companySearch.trim().toLowerCase()),
  )

  const hasActiveFilters = statusFilter.length > 0 || companyFilter.length > 0
  const [filterBarVisible, setFilterBarVisible] = React.useState(false)

  // --- Modify/Add filter (FilterConfigModal) ---------------------------
  // FIELD_OPTIONS / OPERATOR_OPTIONS / VALUE_OPTIONS mirror the shared
  // component's own doc example (docs/examples/filter-config-modal). Its
  // Value column intentionally uses one shared option list across every
  // field (documented limitation in filter-config-modal.tsx) — Status and
  // Company values are unioned into one list here rather than inventing a
  // per-field value editor the component doesn't yet support.
  const FILTER_FIELD_OPTIONS = [
    { value: "status", label: "Status" },
    { value: "company", label: "Company" },
  ]
  const FILTER_OPERATOR_OPTIONS = [
    { value: "is", label: "Is" },
    { value: "is-not", label: "Is not" },
  ]
  const FILTER_VALUE_OPTIONS = [
    ...STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
    ...COMPANY_OPTIONS,
  ]

  function openFilterModal() {
    const seeded: FilterCriterion[] = [
      ...statusFilter.map((value, i) => ({
        id: `status-${i}`,
        field: "status",
        operator: "is",
        value,
      })),
      ...companyFilter.map((value, i) => ({
        id: `company-${i}`,
        field: "company",
        operator: "is",
        value,
      })),
    ]
    setFilterCriteria(seeded)
    setFilterModalOpen(true)
  }

  // Resolves one field's criteria into the simple inclusion list this page's
  // row filter understands: "is" values win when present; otherwise "is-not"
  // values are subtracted from the full option set.
  function resolveCriteriaFilter(field: string, allValues: string[]) {
    const included = filterCriteria.filter((c) => c.field === field && c.operator === "is").map((c) => c.value)
    if (included.length > 0) return included
    const excluded = filterCriteria.filter((c) => c.field === field && c.operator === "is-not").map((c) => c.value)
    if (excluded.length > 0) return allValues.filter((v) => !excluded.includes(v))
    return []
  }

  function handleFilterModalSave() {
    setStatusFilter(resolveCriteriaFilter("status", STATUSES))
    setCompanyFilter(resolveCriteriaFilter("company", COMPANIES))
    setFilterModalOpen(false)
  }

  return (
    <section
      className={cn(
        "flex h-full flex-col overflow-hidden",
        "rounded-[var(--p-radius-150)]",
        "bg-[var(--s-color-surface-default)]",
      )}
    >
      {/* Title bar — module title on the left, search + filter + customization on the right. */}
      <div className="flex shrink-0 items-center gap-[var(--p-space-200)] p-[var(--p-space-200)]">
        <span
          className={cn(
            "text-[length:var(--p-font-size-medium)]",
            "font-[var(--p-font-weight-regular)]",
            "leading-[var(--p-font-line-height-medium)]",
            "text-[var(--s-color-text-default)]",
          )}
        >
          All Users
        </span>

        <div className="flex-1" />

        <div className="w-[280px]">
          <SearchBar
            size="small"
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
        </div>

        <div className="flex items-center gap-[var(--p-space-200)]">
          <IconButton
            icon="filter"
            label="Filter"
            aria-pressed={filterBarVisible}
            onClick={() => setFilterBarVisible((v) => !v)}
          />

          <TableCustomizationMenu
            columns={AUDIENCE_COLUMNS}
            selectedColumns={selectedColumns}
            onSelectedColumnsChange={setSelectedColumns}
            columnOrder={columnOrder}
            onColumnOrderChange={setColumnOrder}
            onResetColumns={() => {
              setSelectedColumns(AUDIENCE_COLUMN_IDS)
              setColumnOrder(AUDIENCE_COLUMN_IDS)
            }}
            density={density}
            onDensityChange={setDensity}
          />
        </div>
      </div>

      {(filterBarVisible || hasActiveFilters) && (
        <FilterBar
          chips={filterChips}
          openChipId={openChipId}
          onChipClick={(id) => setOpenChipId((prev) => (prev === id ? undefined : id))}
          onAddFilter={openFilterModal}
          onModifyFilter={openFilterModal}
          renderChipPanel={(chipId) => {
            if (chipId === "status") {
              return (
                <FilterDropdownPanel
                  type="multi-picklist"
                  options={STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                  selected={statusFilter}
                  onSelectedChange={setStatusFilter}
                  searchValue=""
                  onSearchChange={() => {}}
                  onClear={() => {
                    setStatusFilter([])
                    setOpenChipId(undefined)
                  }}
                  onCancel={() => setOpenChipId(undefined)}
                  onApply={() => setOpenChipId(undefined)}
                />
              )
            }
            return (
              <FilterDropdownPanel
                type="multi-picklist"
                options={filteredCompanyOptions}
                selected={companyFilter}
                onSelectedChange={setCompanyFilter}
                searchValue={companySearch}
                onSearchChange={setCompanySearch}
                onClear={() => {
                  setCompanyFilter([])
                  setOpenChipId(undefined)
                }}
                onCancel={() => setOpenChipId(undefined)}
                onApply={() => setOpenChipId(undefined)}
              />
            )
          }}
        />
      )}

      <FilterConfigModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        criteria={filterCriteria}
        onCriteriaChange={setFilterCriteria}
        advancedLogic={filterAdvancedLogic}
        onAdvancedLogicChange={setFilterAdvancedLogic}
        fieldOptions={FILTER_FIELD_OPTIONS}
        operatorOptions={FILTER_OPERATOR_OPTIONS}
        valueOptions={FILTER_VALUE_OPTIONS}
        onSave={handleFilterModalSave}
      />

      {/* Table + pagination */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Table density={density} containerClassName="min-h-0 flex-1">
          <TableHeader>
            <TableRow>
              <TableSelectionHead>
                <Checkbox
                  checked={allPageSelected ? true : somePageSelected ? "indeterminate" : false}
                  onCheckedChange={(checked) => toggleSelectAll(checked === true)}
                  aria-label="Select all rows on this page"
                />
              </TableSelectionHead>
              {visibleOrderedColumns.map(renderHeadCell)}
              <TableActionHead />
            </TableRow>
          </TableHeader>

          {pageRows.length === 0 ? (
            <TableEmptyState
              colSpan={visibleOrderedColumns.length + 2}
              title="No users found"
              body="Try adjusting your search or filters."
            />
          ) : (
            <TableBody>
              {pageRows.map((row) => {
                const isSelected = selectedIds.has(row.id)
                return (
                  <TableRow key={row.id} selected={isSelected}>
                    <TableSelectionCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => toggleRowSelected(row.id, checked === true)}
                        aria-label={`Select ${row.userName}`}
                      />
                    </TableSelectionCell>
                    {visibleOrderedColumns.map((col) => renderBodyCell(col, row))}
                    <TableActionCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <IconButton icon="more-vertical" label={`Actions for ${row.userName}`} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem icon="user-profile">View Profile</DropdownMenuItem>
                          <DropdownMenuItem icon="edit">Edit Attributes</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem icon="remove-user" destructive>
                            Remove from Audience
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableActionCell>
                  </TableRow>
                )
              })}
            </TableBody>
          )}
        </Table>

        <Pagination
          page={clampedPage}
          pageCount={pageCount}
          pageSize={pageSize}
          totalItems={totalItems}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type AiGeneratedAudienceExplorerProps = {
  activeKey: PxShellNavKey
  onNavigate: (key: PxShellNavKey) => void
  mode: PxShellRailMode
  onModeChange: (mode: PxShellRailMode) => void
}

function AiGeneratedAudienceExplorer({
  activeKey,
  onNavigate,
  mode,
  onModeChange,
}: AiGeneratedAudienceExplorerProps) {
  return (
    <PxListShell
      nav={{ activeKey, onNavigate, mode, onModeChange }}
      header={{
        moduleName: PX_NAV_LABELS[activeKey],
        primaryUtilities: [
          { id: "messages", icon: "message", label: "Messages" },
          { id: "apps", icon: "px-app-switcher", label: "Apps" },
        ],
        avatar: (
          <Avatar size="medium">
            <AvatarFallback>ZK</AvatarFallback>
          </Avatar>
        ),
      }}
    >
      <AudienceExplorerTable />
    </PxListShell>
  )
}

export { AiGeneratedAudienceExplorer }
