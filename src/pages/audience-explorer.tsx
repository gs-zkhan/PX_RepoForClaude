import * as React from "react"

import { cn } from "@/lib/utils"
import { PxListShell } from "@/patterns/px-list-shell"
import { PECDropdown, type PECOption } from "@/components/px-pec-dropdown"
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
import { FilterDropdownPanel } from "@/components/ui/filter-dropdown-panel"
import {
  FilterConfigModal,
  type FilterCriterion,
  type FilterOption,
} from "@/components/ui/filter-config-modal"
import { IconButton } from "@/components/ui/icon-button"
import { Pagination } from "@/components/ui/pagination"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  ColumnSelector,
  type ColumnSelectorColumn,
  type ColumnSelectorView,
} from "@/components/ui/column-selector"
import { PrismIcon } from "@/components/ui/prism-icon"
import { SearchBar } from "@/components/ui/search-bar"
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
  TableSortHeader,
  type TableSortDirection,
} from "@/components/ui/table"

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------

type SearchColumnKey =
  | "user-id"
  | "user-name"
  | "account-name"
  | "email"
  | "total-visits"
  | "last-seen"
  | "phone-number"
  | "signed-up"
  | "registration-date"
  | "status"
  | "city"

const SEARCH_COLUMNS: { key: SearchColumnKey; label: string }[] = [
  { key: "user-id",           label: "User ID"           },
  { key: "user-name",         label: "User Name"         },
  { key: "account-name",      label: "Account Name"      },
  { key: "email",             label: "Email"             },
  { key: "total-visits",      label: "Total Visits"      },
  { key: "last-seen",         label: "Last Seen"         },
  { key: "phone-number",      label: "Phone Number"      },
  { key: "signed-up",         label: "Signed Up"         },
  { key: "registration-date", label: "Registration Date" },
  { key: "status",            label: "Status"            },
  { key: "city",              label: "City"              },
]

type UserRow = {
  id: string
  userId: string
  initials: string
  name: string
  account: string
  email: string
  signedUp: string
  totalVisits: number
  lastSeen: string
  phoneNumber?: string
  registrationDate?: string
  status?: string
  city?: string
}

const USERS: UserRow[] = [
  { id: "u01", userId: "U-1001", initials: "AB", name: "Jacob Jones",       account: "NimbusCore Technologies", email: "bob.johnson@example.com",  signedUp: "Sep 20, 2024 4:43 AM",  totalVisits: 850, lastSeen: "Sep 20, 2024 4:43 AM"  },
  { id: "u02", userId: "U-1002", initials: "CD", name: "Darrell Steward",   account: "Quantilytics Inc.",       email: "charlie.brown@example.com", signedUp: "Sep 29, 2024 01:43 AM", totalVisits: 790, lastSeen: "Sep 29, 2024 01:43 AM" },
  { id: "u03", userId: "U-1003", initials: "EF", name: "Jane Cooper",       account: "BluePeak Systems",        email: "david.jones@example.com",   signedUp: "Oct 01, 2024 01:43 AM", totalVisits: 760, lastSeen: "Oct 01, 2024 01:43 AM" },
  { id: "u04", userId: "U-1004", initials: "GH", name: "Kathryn Murphy",    account: "ZentraFlow Solutions",    email: "eve.davis@example.com",     signedUp: "Oct 29, 2024 01:43 AM", totalVisits: 660, lastSeen: "Oct 29, 2024 01:43 AM" },
  { id: "u05", userId: "U-1005", initials: "IJ", name: "Eleanor Pena",      account: "OpsEdge Dynamics",        email: "frank.miller@example.com",  signedUp: "Nov 01, 2024 01:43 AM", totalVisits: 570, lastSeen: "Nov 01, 2024 01:43 AM" },
  { id: "u06", userId: "U-1006", initials: "KL", name: "Guy Hawkins",       account: "CrestHive Networks",      email: "grace.wilson@example.com",  signedUp: "Nov 29, 2024 01:43 AM", totalVisits: 410, lastSeen: "Nov 29, 2024 01:43 AM" },
  { id: "u07", userId: "U-1007", initials: "MN", name: "Devon Lane",        account: "VeloraSoft Labs",         email: "henry.moore@example.com",   signedUp: "Dec 01, 2024 01:43 AM", totalVisits: 390, lastSeen: "Dec 01, 2024 01:43 AM" },
  { id: "u08", userId: "U-1008", initials: "OP", name: "Savannah Nguyen",   account: "ScaleFusion Corp.",       email: "isla.taylor@example.com",   signedUp: "Dec 29, 2024 01:43 AM", totalVisits: 330, lastSeen: "Dec 29, 2024 01:43 AM" },
  { id: "u09", userId: "U-1009", initials: "QR", name: "Jenny Wilson",      account: "FocalPoint Analytics",    email: "jack.thompson@example.com", signedUp: "Jan 29, 2025 01:43 AM", totalVisits: 300, lastSeen: "Jan 29, 2025 01:43 AM" },
  { id: "u10", userId: "U-1010", initials: "ST", name: "Floyd Miles",       account: "AetherBridge Digital",    email: "karen.anderson@example.com", signedUp: "Feb 29, 2025 01:43 AM", totalVisits: 260, lastSeen: "Feb 29, 2025 01:43 AM" },
  { id: "u11", userId: "U-1011", initials: "UV", name: "Cody Fisher",       account: "AetherBridge Digital",    email: "luke.jackson@example.com",  signedUp: "Sep 20, 2023, 12:00",   totalVisits: 260, lastSeen: "Sep 20, 2023, 12:00"   },
  { id: "u12", userId: "U-1012", initials: "WX", name: "Albert Flores",     account: "VeloraSoft Labs",         email: "mia.harris@example.com",    signedUp: "Sep 20, 2023, 12:00",   totalVisits: 260, lastSeen: "Sep 20, 2023, 12:00"   },
  { id: "u13", userId: "U-1013", initials: "YZ", name: "Jerome Bell",       account: "FocalPoint Analytics",    email: "noah.martin@example.com",   signedUp: "Sep 20, 2023, 12:00",   totalVisits: 260, lastSeen: "Sep 20, 2023, 12:00"   },
  { id: "u14", userId: "U-1014", initials: "AB", name: "Brooklyn Simmons",  account: "ZentraFlow Solutions",    email: "olivia.lee@example.com",    signedUp: "Sep 20, 2023, 12:00",   totalVisits: 260, lastSeen: "Sep 20, 2023, 12:00"   },
  { id: "u15", userId: "U-1015", initials: "CD", name: "Kristin Watson",    account: "ScaleFusion Corp.",       email: "peter.sanchez@example.com", signedUp: "Sep 20, 2023, 12:00",   totalVisits: 260, lastSeen: "Sep 20, 2023, 12:00"   },
  { id: "u16", userId: "U-1016", initials: "EF", name: "Ralph Edwards",     account: "NimbusCore Technologies", email: "quinn.clark@example.com",   signedUp: "Sep 20, 2023, 12:00",   totalVisits: 9000, lastSeen: "Sep 20, 2023, 12:00"  },
  { id: "u17", userId: "U-1017", initials: "GH", name: "Wade Warren",       account: "BluePeak Systems",        email: "ryan.lewis@example.com",    signedUp: "Sep 20, 2023",           totalVisits: 210, lastSeen: "Sep 20, 2023"          },
  { id: "u18", userId: "U-1018", initials: "IJ", name: "Bessie Cooper",     account: "OpsEdge Dynamics",        email: "sophia.rodriguez@example.com", signedUp: "Sep 20, 2023",         totalVisits: 190, lastSeen: "Sep 20, 2023"          },
  { id: "u19", userId: "U-1019", initials: "KL", name: "Darlene Robertson", account: "CrestHive Networks",      email: "tyler.walker@example.com",  signedUp: "Sep 20, 2023",           totalVisits: 170, lastSeen: "Sep 20, 2023"          },
  { id: "u20", userId: "U-1020", initials: "MN", name: "Annette Black",     account: "VeloraSoft Labs",         email: "unicorn.peters@example.com", signedUp: "Sep 20, 2023",           totalVisits: 150, lastSeen: "Sep 20, 2023"          },
]

// The full dataset is 600 users; the exported figure comes from a paginated slice.
// For the POC we work with 20 rows and mirror the "600" total from the PDF.
const TOTAL_USERS = 600
const TOTAL_ACTIVE = 360

// ---------------------------------------------------------------------------
// PEC Dropdown sample data — same option shape as ValidationGallery's demo.
// ---------------------------------------------------------------------------

const PEC_PRODUCT_OPTIONS: PECOption[] = [
  { id: "px", label: "Gainsight PX" },
  { id: "cs", label: "Gainsight CS" },
  { id: "cc", label: "Gainsight CC" },
  { id: "sj", label: "Gainsight SJ" },
  { id: "st", label: "Gainsight ST" },
]

const PEC_ENVIRONMENT_OPTIONS: PECOption[] = [
  { id: "production", label: "Production" },
  { id: "staging", label: "Staging" },
  { id: "qa", label: "QA" },
  { id: "integration", label: "Integration" },
]

const PEC_CHANNEL_OPTIONS: PECOption[] = [
  { id: "web-app", label: "Web App", icon: "webapp" },
  { id: "mobile", label: "Mobile", icon: "mobile" },
  { id: "desktop", label: "Desktop", icon: "monitor" },
]

// ---------------------------------------------------------------------------
// AudienceSearch — screen-level combined search pattern.
//
// Composes Popover + Checkbox list + SearchBar as one visually integrated group.
// Owns: combined layout, selected-column count, dropdown/search alignment,
// search-column state.
// Does NOT own: SearchBar/Popover/Checkbox visual recipes (delegated to
// approved components).
// ---------------------------------------------------------------------------

type AudienceSearchProps = {
  query: string
  onQueryChange: (value: string) => void
  onClear: () => void
  selectedColumns: Set<SearchColumnKey>
  onColumnToggle: (key: SearchColumnKey, checked: boolean) => void
}

function AudienceSearch({
  query,
  onQueryChange,
  onClear,
  selectedColumns,
  onColumnToggle,
}: AudienceSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [columnQuery, setColumnQuery] = React.useState("")

  const filteredColumns = SEARCH_COLUMNS.filter((c) =>
    c.label.toLowerCase().includes(columnQuery.toLowerCase()),
  )
  const selectedCount = selectedColumns.size

  return (
    <div
      role="search"
      aria-label="Search users"
      className="inline-flex items-stretch gap-0"
    >
      {/* Search-in trigger — left segment */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={`Search in ${selectedCount} of ${SEARCH_COLUMNS.length} columns`}
            className={cn(
              "inline-flex items-center gap-2 whitespace-nowrap outline-none",
              "h-[var(--c-textfield-height-large)]",
              "rounded-[var(--c-textfield-radius)]",
              "border border-[var(--s-color-line-default)]",
              "bg-[var(--s-color-surface-default)]",
              "px-3",
              "text-[length:var(--p-font-size-h6)]",
              "leading-[var(--p-font-line-height-h6)]",
              "text-[var(--s-color-text-default)]",
              "hover:border-[var(--c-textfield-border-hover)]",
              "focus-visible:border-[var(--c-textfield-border-focus)]",
              "focus-visible:shadow-[var(--e-shadow-focus)]",
              open && "border-[var(--c-textfield-border-focus)]",
            )}
          >
            <span>Search in</span>
            <span
              aria-hidden="true"
              className="text-[var(--s-color-text-subtlest)]"
            >
              ({selectedCount}/{SEARCH_COLUMNS.length})
            </span>
            <PrismIcon
              name="chevron-down"
              size={16}
              className={cn(
                "text-[var(--s-icon-color-default)] transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={4}
          className="w-64 p-0"
        >
          <div className="p-2">
            <SearchBar
              size="small"
              placeholder="Search Column Name"
              value={columnQuery}
              onChange={(e) => setColumnQuery(e.target.value)}
              aria-label="Filter columns"
            />
          </div>

          <ul
            role="listbox"
            aria-multiselectable="true"
            aria-label="Columns to search"
            className="max-h-64 overflow-y-auto pb-2"
          >
            {filteredColumns.map((c) => {
              const checked = selectedColumns.has(c.key)
              return (
                <li key={c.key} role="option" aria-selected={checked}>
                  <label
                    className={cn(
                      "flex cursor-pointer select-none items-center gap-2 px-3 py-1.5",
                      "text-[length:var(--p-font-size-h6)]",
                      "leading-[var(--p-font-line-height-h6)]",
                      "text-[var(--s-color-text-default)]",
                      "hover:bg-[var(--c-dropdown-menu-item-background-hover)]",
                      checked && "font-[var(--p-font-weight-medium)]",
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => onColumnToggle(c.key, v === true)}
                      aria-label={c.label}
                    />
                    <span>{c.label}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </PopoverContent>
      </Popover>

      {/* SearchBar — right segment */}
      <SearchBar
        size="small"
        value={query}
        placeholder="Search"
        onChange={(e) => onQueryChange(e.target.value)}
        onClear={onClear}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Audience Explorer page
// ---------------------------------------------------------------------------

// Options for the Configure Filters modal, opened from the filter bar's
// "Modify filter". Scoped to fields that exist on this screen's rows.
const FILTER_FIELD_OPTIONS: FilterOption[] = [
  { value: "status", label: "Status" },
  { value: "account-name", label: "Account Name" },
  { value: "user-name", label: "User Name" },
  { value: "email", label: "Email" },
]

const FILTER_OPERATOR_OPTIONS: FilterOption[] = [
  { value: "equals", label: "equals to" },
  { value: "not-equals", label: "not equal to" },
  { value: "contains", label: "contains" },
]

const FILTER_VALUE_OPTIONS: FilterOption[] = [
  { value: "open", label: "Open" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

const DEFAULT_SELECTED: SearchColumnKey[] = ["user-id", "user-name", "account-name"]
const PAGE_SIZE_OPTIONS = [10, 25, 50]

// ---------------------------------------------------------------------------
// Column selector
// ---------------------------------------------------------------------------
const COL_SELECTOR_COLUMNS: ColumnSelectorColumn[] = [
  { id: "name",        label: "User Name",    disabled: true },
  { id: "account",     label: "Account Name" },
  { id: "email",       label: "Email" },
  { id: "signedUp",    label: "Signed Up" },
  { id: "totalVisits", label: "Total Visits" },
  { id: "lastSeen",    label: "Last Seen" },
]
const DEFAULT_COLUMN_IDS = COL_SELECTOR_COLUMNS.map((c) => c.id)

function matchesQuery(user: UserRow, query: string, columns: Set<SearchColumnKey>): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  for (const key of columns) {
    let value = ""
    switch (key) {
      case "user-id":           value = user.userId;                break
      case "user-name":         value = user.name;                  break
      case "account-name":      value = user.account;               break
      case "email":             value = user.email;                 break
      case "total-visits":      value = String(user.totalVisits);   break
      case "last-seen":         value = user.lastSeen;              break
      case "signed-up":         value = user.signedUp;              break
      case "phone-number":      value = user.phoneNumber ?? "";     break
      case "registration-date": value = user.registrationDate ?? ""; break
      case "status":            value = user.status ?? "";          break
      case "city":              value = user.city ?? "";            break
    }
    if (value.toLowerCase().includes(q)) return true
  }
  return false
}

type SortKey = "name" | "account" | "email" | "signedUp" | "totalVisits" | "lastSeen"

type AudienceExplorerProps = {
  activeKey: PxShellNavKey
  onNavigate: (key: PxShellNavKey) => void
  mode: PxShellRailMode
  onModeChange: (mode: PxShellRailMode) => void
}

function AudienceExplorer({ activeKey, onNavigate, mode, onModeChange }: AudienceExplorerProps) {
  const [selectedColumns, setSelectedColumns] = React.useState<Set<SearchColumnKey>>(
    () => new Set(DEFAULT_SELECTED),
  )
  const [query, setQuery] = React.useState("")
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [filterBarOpen, setFilterBarOpen] = React.useState(false)
  const [filterChips, setFilterChips] = React.useState<FilterBarChip[]>([])
  // Which chip's own Filter Dropdown Panel is open. Undefined = none.
  const [openChipId, setOpenChipId] = React.useState<string | undefined>(undefined)

  // Both filter-bar entry points open the SAME modal; only the header differs.
  // "Add filter" (empty bar) reads "Add filter"; "Modify filter" (populated
  // bar) reads "Modify filter".
  const [filterModalMode, setFilterModalMode] = React.useState<"add" | "modify" | null>(null)
  const [filterLogic, setFilterLogic] = React.useState("A")
  const [filterCriteria, setFilterCriteria] = React.useState<FilterCriterion[]>([])
  const [sortKey, setSortKey] = React.useState<SortKey | null>(null)
  const [sortDirection, setSortDirection] = React.useState<TableSortDirection>(undefined)
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  const [pecProduct, setPecProduct] = React.useState("px")
  const [pecEnvironment, setPecEnvironment] = React.useState("production")
  const [pecChannels, setPecChannels] = React.useState<string[]>(["web-app"])

  const [visibleColumnIds, setVisibleColumnIds] = React.useState<string[]>(DEFAULT_COLUMN_IDS)
  const [columnOrder, setColumnOrder] = React.useState<string[]>(DEFAULT_COLUMN_IDS)
  const [colSelectorOpen, setColSelectorOpen] = React.useState(false)
  const [colSelectorView, setColSelectorView] = React.useState<ColumnSelectorView>("selection")
  const colSelectorIsDragging = React.useRef(false)

  const activeColumns = React.useMemo(
    () =>
      columnOrder
        .filter((id) => visibleColumnIds.includes(id))
        .map((id) => COL_SELECTOR_COLUMNS.find((c) => c.id === id)!)
        .filter(Boolean),
    [visibleColumnIds, columnOrder],
  )
  // 1 checkbox col + active data cols + 1 action col
  const tableColSpan = 2 + activeColumns.length

  function toggleColumn(key: SearchColumnKey, checked: boolean) {
    setSelectedColumns((prev) => {
      const next = new Set(prev)
      if (checked) next.add(key)
      else next.delete(key)
      return next
    })
    setPage(1)
  }

  const filteredUsers = React.useMemo(() => {
    if (!query.trim()) return USERS
    return USERS.filter((u) => matchesQuery(u, query, selectedColumns))
  }, [query, selectedColumns])

  const sortedUsers = React.useMemo(() => {
    if (!sortKey || !sortDirection) return filteredUsers
    const dir = sortDirection === "ascending" ? 1 : -1
    return [...filteredUsers].sort((a, b) => {
      const av = sortValue(a, sortKey)
      const bv = sortValue(b, sortKey)
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
  }, [filteredUsers, sortKey, sortDirection])

  const pageCount = Math.max(1, Math.ceil(sortedUsers.length / pageSize))
  const pagedUsers = sortedUsers.slice((page - 1) * pageSize, page * pageSize)

  function cycleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key)
      setSortDirection("ascending")
      return
    }
    if (sortDirection === "ascending") setSortDirection("descending")
    else if (sortDirection === "descending") {
      setSortKey(null)
      setSortDirection(undefined)
    } else setSortDirection("ascending")
  }

  function toggleRow(id: string, checked: boolean) {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const allOnPageSelected =
    pagedUsers.length > 0 && pagedUsers.every((u) => selectedRows.has(u.id))
  const someOnPageSelected =
    pagedUsers.some((u) => selectedRows.has(u.id)) && !allOnPageSelected

  function toggleAllOnPage(checked: boolean | "indeterminate") {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (checked === true) pagedUsers.forEach((u) => next.add(u.id))
      else pagedUsers.forEach((u) => next.delete(u.id))
      return next
    })
  }

  const hasResults = sortedUsers.length > 0
  const searchedLabels = SEARCH_COLUMNS.filter((c) => selectedColumns.has(c.key))
  const summaryText = `(${selectedColumns.size}/${SEARCH_COLUMNS.length}) Columns Searched`

  return (
    <PxListShell
      nav={{ activeKey, onNavigate, mode, onModeChange }}
      header={{
        moduleName: PX_NAV_LABELS[activeKey],
        primaryCenter: (
          <PECDropdown
            productOptions={PEC_PRODUCT_OPTIONS}
            environmentOptions={PEC_ENVIRONMENT_OPTIONS}
            channelOptions={PEC_CHANNEL_OPTIONS}
            product={pecProduct}
            environment={pecEnvironment}
            channels={pecChannels}
            onApply={(next) => {
              setPecProduct(next.product)
              setPecEnvironment(next.environment)
              setPecChannels(next.channels)
            }}
          />
        ),
        primaryUtilities: [
          { id: "messages", icon: "message",         label: "Messages" },
          { id: "apps",     icon: "px-app-switcher", label: "Apps"     },
        ],
        avatar: (
          <Avatar size="medium">
            <AvatarFallback>ZK</AvatarFallback>
          </Avatar>
        ),
      }}
    >
          <section
            className={cn(
              "flex h-full flex-col overflow-hidden",
              "rounded-[var(--p-radius-150)]",
              "border border-[var(--s-color-line-default)]",
              "bg-[var(--s-color-surface-default)]",
              "shadow-[var(--e-shadow-100)]",
            )}
          >
            {/* Card header */}
            <div className="flex shrink-0 items-center gap-4 px-6 py-4">
              <div className="flex-1 text-[length:var(--p-font-size-h6)] font-[var(--p-font-weight-medium)] leading-[var(--p-font-line-height-h6)] text-[var(--s-color-text-default)]">
                Total User ({TOTAL_ACTIVE})
              </div>

              <div className="flex items-center gap-[var(--p-space-300)]">
                <AudienceSearch
                  query={query}
                  onQueryChange={(v) => { setQuery(v); setPage(1) }}
                  onClear={() => { setQuery(""); setPage(1) }}
                  selectedColumns={selectedColumns}
                  onColumnToggle={toggleColumn}
                />

                <IconButton
                  icon="filter"
                  label="More filters"
                  aria-pressed={filterBarOpen}
                  onClick={() => setFilterBarOpen((v) => !v)}
                />

                <Popover open={colSelectorOpen} onOpenChange={setColSelectorOpen}>
                  <PopoverAnchor asChild>
                    <IconButton
                      icon="add-column"
                      label="Configure columns"
                      aria-pressed={colSelectorOpen}
                      onClick={() => setColSelectorOpen((v) => !v)}
                    />
                  </PopoverAnchor>
                  <PopoverContent
                    align="end"
                    sideOffset={4}
                    className="p-0 w-[312px]"
                    onInteractOutside={(e) => {
                      if (colSelectorIsDragging.current) e.preventDefault()
                    }}
                  >
                    <ColumnSelector
                      columns={COL_SELECTOR_COLUMNS}
                      selected={visibleColumnIds}
                      order={columnOrder}
                      view={colSelectorView}
                      onViewChange={setColSelectorView}
                      onSelectedChange={setVisibleColumnIds}
                      onReorder={setColumnOrder}
                      onReset={() => {}}
                      onCancel={() => setColSelectorOpen(false)}
                      onSave={() => setColSelectorOpen(false)}
                      isDraggingRef={colSelectorIsDragging}
                    />
                  </PopoverContent>
                </Popover>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconButton icon="more-vertical" label="More options" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem icon="new-window">Export CSV</DropdownMenuItem>
                    <DropdownMenuItem icon="refresh">Refresh</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Filter Bar — conditional slot, collapses to zero height when closed */}
            {filterBarOpen && (
              <div className="shrink-0 border-t border-[var(--s-color-line-default)]">
                <FilterBar
                  chips={filterChips}
                  openChipId={openChipId}
                  onChipClick={(id) =>
                    setOpenChipId((current) => (current === id ? undefined : id))
                  }
                  renderChipPanel={(id) => {
                    const chip = filterChips.find((c) => c.id === id)
                    return (
                      <FilterDropdownPanel
                        type="value"
                        label={chip?.label ?? "Value"}
                        value={chip?.value ?? ""}
                        onValueChange={(value) =>
                          setFilterChips((prev) =>
                            prev.map((c) => (c.id === id ? { ...c, value } : c)),
                          )
                        }
                        onCancel={() => setOpenChipId(undefined)}
                        onApply={() => setOpenChipId(undefined)}
                        onClear={() =>
                          setFilterChips((prev) =>
                            prev.map((c) => (c.id === id ? { ...c, value: "" } : c)),
                          )
                        }
                      />
                    )
                  }}
                  // Both actions open the same modal — "Add filter" seeds one
                  // blank criterion so the user lands on an editable row rather
                  // than an empty state they have to click through.
                  onAddFilter={() => {
                    if (filterCriteria.length === 0) {
                      setFilterCriteria([
                        {
                          id: `criterion-${Date.now()}`,
                          field: FILTER_FIELD_OPTIONS[0].value,
                          operator: FILTER_OPERATOR_OPTIONS[0].value,
                          value: FILTER_VALUE_OPTIONS[0].value,
                        },
                      ])
                    }
                    setFilterModalMode("add")
                  }}
                  onModifyFilter={() => setFilterModalMode("modify")}
                />
              </div>
            )}

            {/* Rendered outside the filterBarOpen branch on purpose: collapsing
                the bar must not unmount the modal mid-edit. */}
            <FilterConfigModal
              open={filterModalMode !== null}
              onOpenChange={(next) => {
                // Only ever closes from here (Cancel / Esc / backdrop) — the
                // mode is set by whichever bar action opened it.
                if (!next) setFilterModalMode(null)
              }}
              title={filterModalMode === "add" ? "Add filter" : "Modify filter"}
              criteria={filterCriteria}
              onCriteriaChange={setFilterCriteria}
              advancedLogic={filterLogic}
              onAdvancedLogicChange={setFilterLogic}
              fieldOptions={FILTER_FIELD_OPTIONS}
              operatorOptions={FILTER_OPERATOR_OPTIONS}
              valueOptions={FILTER_VALUE_OPTIONS}
              onSave={() => {
                // Reflect the saved criteria back onto the bar's chips so the
                // modal and the bar cannot disagree about the active filter.
                // Saving with zero criteria clears the chips, which returns the
                // bar to its "No filters applied / Add filter" state.
                setFilterChips(
                  filterCriteria.map((criterion) => ({
                    id: criterion.id,
                    label:
                      FILTER_FIELD_OPTIONS.find((o) => o.value === criterion.field)?.label ??
                      criterion.field,
                    value:
                      FILTER_VALUE_OPTIONS.find((o) => o.value === criterion.value)?.label ??
                      criterion.value,
                  })),
                )
                setFilterModalMode(null)
              }}
            />

            {/* Table — scrollable region; header/filter-bar/pagination stay fixed */}
            <Table containerClassName="min-h-0 flex-1">
              <TableHeader>
                <TableRow>
                  <TableSelectionHead>
                    <Checkbox
                      aria-label="Select all users on this page"
                      checked={allOnPageSelected ? true : someOnPageSelected ? "indeterminate" : false}
                      onCheckedChange={toggleAllOnPage}
                    />
                  </TableSelectionHead>
                  {activeColumns.map((col) => (
                    <TableHead
                      key={col.id}
                      sortable
                      sortDirection={sortKey === col.id ? sortDirection : undefined}
                    >
                      <TableSortHeader
                        direction={sortKey === col.id ? sortDirection : undefined}
                        onClick={() => cycleSort(col.id as SortKey)}
                      >
                        {col.label}
                      </TableSortHeader>
                    </TableHead>
                  ))}
                  <TableActionHead />
                </TableRow>
              </TableHeader>

              {hasResults ? (
                <TableBody>
                  {pagedUsers.map((u) => {
                    const isSelected = selectedRows.has(u.id)
                    return (
                      <TableRow key={u.id} selected={isSelected}>
                        <TableSelectionCell>
                          <Checkbox
                            aria-label={`Select ${u.name}`}
                            checked={isSelected}
                            onCheckedChange={(v) => toggleRow(u.id, v === true)}
                          />
                        </TableSelectionCell>
                        {activeColumns.map((col) => {
                          if (col.id === "name") return (
                            <TableCell key="name">
                              <div className="flex items-center gap-[var(--p-space-100)]">
                                <Avatar size="medium">
                                  <AvatarFallback>{u.initials}</AvatarFallback>
                                </Avatar>
                                <a href="#" onClick={(e) => e.preventDefault()} className="text-[var(--s-color-text-information)] hover:underline">{u.name}</a>
                              </div>
                            </TableCell>
                          )
                          if (col.id === "account") return (
                            <TableCell key="account">
                              <a href="#" onClick={(e) => e.preventDefault()} className="text-[var(--s-color-text-information)] hover:underline">{u.account}</a>
                            </TableCell>
                          )
                          if (col.id === "email") return (
                            <TableCell key="email">
                              <span className="block max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap">{u.email}</span>
                            </TableCell>
                          )
                          if (col.id === "signedUp")    return <TableCell key="signedUp">{u.signedUp}</TableCell>
                          if (col.id === "totalVisits") return <TableCell key="totalVisits">{u.totalVisits.toLocaleString()}</TableCell>
                          if (col.id === "lastSeen")    return <TableCell key="lastSeen">{u.lastSeen}</TableCell>
                          return null
                        })}
                        <TableActionCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <IconButton
                                icon="more-vertical"
                                label={`Actions for ${u.name}`}
                              />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem icon="preview">View profile</DropdownMenuItem>
                              <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
                              <DropdownMenuItem icon="copy">Copy user ID</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem icon="delete" destructive>Delete user</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableActionCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              ) : (
                <tbody data-slot="table-empty-state-body">
                  <tr>
                    <td colSpan={tableColSpan} className="p-0">
                      <div className="flex min-h-[368px] flex-col items-center justify-center gap-4 p-6">
                        {/* POC approximation for empty-box illustration */}
                        <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-[var(--s-color-line-subtle)] bg-[var(--s-color-surface-muted)]">
                          <PrismIcon
                            name="folder-open"
                            sourceSize={24}
                            size={32}
                            className="text-[var(--s-icon-color-subtle)]"
                          />
                        </div>

                        <div className="flex flex-col items-center gap-2">
                          <p className="text-[length:var(--p-font-size-h5)] font-[var(--p-font-weight-semi-bold)] leading-[var(--p-font-line-height-h5)] text-[var(--s-color-text-default)]">
                            No results found for search on below column
                          </p>
                          <p className="text-[length:var(--p-font-size-medium)] leading-[var(--p-font-line-height-medium)] text-[var(--s-color-text-subtlest)]">
                            Update columns to search for better results
                          </p>
                        </div>

                        <ul className="flex flex-wrap items-center justify-center gap-2">
                          {searchedLabels.map((c) => (
                            <li
                              key={c.key}
                              className={cn(
                                "inline-flex items-center rounded-[var(--p-radius-full)] border px-3 py-1",
                                "border-[var(--s-color-line-default)]",
                                "text-[length:var(--p-font-size-h6)] leading-[var(--p-font-line-height-h6)]",
                                "text-[var(--s-color-text-subtle)]",
                              )}
                            >
                              {c.label}
                            </li>
                          ))}
                        </ul>

                        <p className="text-[length:var(--p-font-size-small)] leading-[var(--p-font-line-height-small)] text-[var(--s-color-text-subtlest)]">
                          {summaryText}
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              )}
            </Table>

            {/* Pagination */}
            <div className="shrink-0">
              <Pagination
                page={page}
                pageCount={pageCount}
                pageSize={pageSize}
                totalItems={TOTAL_USERS}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
              />
            </div>
          </section>
    </PxListShell>
  )
}

function sortValue(u: UserRow, key: SortKey): string | number {
  switch (key) {
    case "name":        return u.name.toLowerCase()
    case "account":     return u.account.toLowerCase()
    case "email":       return u.email.toLowerCase()
    case "signedUp":    return u.signedUp
    case "totalVisits": return u.totalVisits
    case "lastSeen":    return u.lastSeen
  }
}

export { AudienceExplorer }
