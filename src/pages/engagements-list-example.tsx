/**
 * Engagements list — example screen built on <PxListShell>.
 *
 * Reproduces the Figma frame `Shell/ListPage` (node 7306:20074) from the
 * Prism V1 - ShadCN file: PX rail on the left, PX Header with module name +
 * PEC + utilities on top, and a bordered card containing a titled toolbar,
 * data table, and pagination inside the shell content slot.
 *
 * Everything feature-specific (columns, data, actions, PEC options) lives in
 * this file. The shell is responsible for chrome only.
 */

import * as React from "react"

import { cn } from "@/lib/utils"
import { PxListShell, PxFilterSlider, type PxFilterSliderTab } from "@/patterns/px-list-shell"
import { PECDropdown, type PECOption } from "@/components/px-pec-dropdown"
import { PX_NAV_LABELS, type PxShellNavKey, type PxShellRailMode } from "@/components/px-shell-rail"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconButton } from "@/components/ui/icon-button"
import { Pagination } from "@/components/ui/pagination"
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
} from "@/components/ui/table"

// ---------------------------------------------------------------------------
// Sample data — matches the Figma Shell/ListPage frame
// ---------------------------------------------------------------------------

type EngagementRow = {
  id: string
  userName: string
  userId: string
  email: string
  company: string
  title: string
  status: "Open"
}

const ENGAGEMENTS: EngagementRow[] = [
  { id: "e01", userName: "Jacob Jones",     userId: "d886e11f-1",  email: "jacob@jones.com",     company: "Google",    title: "CEO",                  status: "Open" },
  { id: "e02", userName: "Darrell Steward", userId: "d886e11f-2",  email: "darrell@steward.com", company: "Microsoft", title: "VP Sales",             status: "Open" },
  { id: "e03", userName: "Jane Cooper",     userId: "d886e11f-3",  email: "jane@cooper.com",     company: "Salesforce", title: "Director",            status: "Open" },
  { id: "e04", userName: "Kathryn Murphy",  userId: "d886e11f-4",  email: "kathryn@murphy.com",  company: "HubSpot",   title: "Manager",              status: "Open" },
  { id: "e05", userName: "Eleanor Pena",    userId: "d886e11f-5",  email: "eleanor@pena.com",    company: "Zendesk",   title: "Lead Engineer",        status: "Open" },
  { id: "e06", userName: "Guy Hawkins",     userId: "d886e11f-6",  email: "guy@hawkins.com",     company: "Slack",     title: "Account Exec",         status: "Open" },
  { id: "e07", userName: "Devon Lane",      userId: "d886e11f-7",  email: "devon@lane.com",      company: "Stripe",    title: "Product Manager",      status: "Open" },
  { id: "e08", userName: "Savannah Nguyen", userId: "d886e11f-8",  email: "savannah@nguyen.com", company: "Figma",     title: "Designer",             status: "Open" },
  { id: "e09", userName: "Jenny Wilson",    userId: "d886e11f-9",  email: "jenny@wilson.com",    company: "Notion",    title: "Head of Growth",       status: "Open" },
  { id: "e10", userName: "Floyd Miles",     userId: "d886e11f-10", email: "floyd@miles.com",     company: "Airtable",  title: "Data Analyst",         status: "Open" },
  { id: "e11", userName: "Cody Fisher",     userId: "d886e11f-11", email: "cody@fisher.com",     company: "Linear",    title: "Engineer",             status: "Open" },
  { id: "e12", userName: "Albert Flores",   userId: "d886e11f-12", email: "albert@flores.com",   company: "Vercel",    title: "CTO",                  status: "Open" },
  { id: "e13", userName: "Jerome Bell",     userId: "d886e11f-13", email: "jerome@bell.com",     company: "Supabase",  title: "Solutions Architect",  status: "Open" },
  { id: "e14", userName: "Jerome Bell",     userId: "d886e11f-13", email: "jerome@bell.com",     company: "Supabase",  title: "Solutions Architect",  status: "Open" },
  { id: "e15", userName: "Jerome Bell",     userId: "d886e11f-13", email: "jerome@bell.com",     company: "Supabase",  title: "Solutions Architect",  status: "Open" },
]

const TOTAL_ROWS = 248
const PAGE_SIZE_OPTIONS = [10, 25, 50]

// ---------------------------------------------------------------------------
// PEC Dropdown sample data — same option shape used by AudienceExplorer.
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
// Feature: table card
// ---------------------------------------------------------------------------

type EngagementsTableProps = {
  rows: EngagementRow[]
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  query: string
  onQueryChange: (value: string) => void
  onCreate?: () => void
}

function EngagementsTable({
  rows,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  query,
  onQueryChange,
  onCreate,
}: EngagementsTableProps) {
  const pageCount = Math.max(1, Math.ceil(TOTAL_ROWS / pageSize))

  // Filter Slider — toggled by the Filter icon in this card's own title bar.
  // Per Figma (node 3721:22905), the title bar always spans the full card
  // width; only the row below it (table + slider) narrows.
  const [filterOpen, setFilterOpen] = React.useState(false)
  const [filterTab, setFilterTab] = React.useState<PxFilterSliderTab>("filter")

  return (
    <section
      className={cn(
        "flex h-full flex-col overflow-hidden",
        "rounded-[var(--p-radius-150)]",
        "border border-[var(--s-color-line-default)]",
        "bg-[var(--s-color-surface-default)]",
        "shadow-[var(--e-shadow-100)]",
      )}
    >
      {/* Toolbar — search bar (left) · filter, more options, Create (right) */}
      <div className="flex shrink-0 items-center gap-4 px-6 py-4">
        <div className="w-[280px]">
          <SearchBar
            size="small"
            placeholder="Search engagements"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>

        <div className="flex flex-1 items-center justify-end gap-[var(--p-space-300)]">
          <IconButton
            icon="filter"
            label="Filter"
            aria-pressed={filterOpen}
            onClick={() => setFilterOpen((v) => !v)}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton icon="more-vertical" label="More options" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem icon="new-window">Export CSV</DropdownMenuItem>
              <DropdownMenuItem icon="refresh">Refresh</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon="settings">Configure columns</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="primary" size="large" onClick={onCreate}>
            Create
          </Button>
        </div>
      </div>

      {/* Table + Filter Slider row — slider narrows only this row, never the toolbar above */}
      <div className="flex min-h-0 flex-1 border-t border-[var(--s-color-line-default)]">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <Table containerClassName="min-h-0 flex-1">
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableActionHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.userName}</TableCell>
                    <TableCell>{row.userId}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>
                      <StatusPill>{row.status}</StatusPill>
                    </TableCell>
                    <TableActionCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <IconButton
                            icon="more-vertical"
                            label={`Actions for ${row.userName}`}
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
                          <DropdownMenuItem icon="copy">Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem icon="delete" destructive>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableActionCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          <Pagination
            page={page}
            pageCount={pageCount}
            pageSize={pageSize}
            totalItems={TOTAL_ROWS}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>

        {filterOpen && (
          <PxFilterSlider
            activeTab={filterTab}
            onTabChange={setFilterTab}
            onAddFilter={() => {}}
          />
        )}
      </div>
    </section>
  )
}

// Native rendition of a Prism DS "Open" status label. The full StatusLabel
// component isn't in this repo yet; when it lands, replace this with
// <StatusLabel variant="open">Open</StatusLabel>.
function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        "rounded-[var(--p-radius-100)]",
        "bg-[var(--s-color-surface-muted)]",
        "px-2 py-0.5",
        "text-[length:var(--p-font-size-small)]",
        "leading-[var(--p-font-line-height-small)]",
        "text-[var(--s-color-text-subtle)]",
      )}
    >
      {children}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type EngagementsListExampleProps = {
  activeKey: PxShellNavKey
  onNavigate: (key: PxShellNavKey) => void
  mode: PxShellRailMode
  onModeChange: (mode: PxShellRailMode) => void
}

function EngagementsListExample({
  activeKey,
  onNavigate,
  mode,
  onModeChange,
}: EngagementsListExampleProps) {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [query, setQuery] = React.useState("")

  const [pecProduct, setPecProduct] = React.useState("px")
  const [pecEnvironment, setPecEnvironment] = React.useState("production")
  const [pecChannels, setPecChannels] = React.useState<string[]>(["web-app"])

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
      <EngagementsTable
        rows={ENGAGEMENTS}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
        query={query}
        onQueryChange={(v) => {
          setQuery(v)
          setPage(1)
        }}
      />
    </PxListShell>
  )
}

export { EngagementsListExample }
