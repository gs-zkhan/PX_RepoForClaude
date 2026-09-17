/**
 * Account Explorer — list of accounts with summary analytics, built on
 * <PxListShell>, plus a per-account drilldown built on
 * <PxDetailDrilldownShell>. Anatomy is list-driven (a single filterable
 * dataset with an analytics strip above it), so PxListShell is the correct
 * shell per ai/shell-registry.md; the drilldown reuses PxDetailDrilldownShell
 * exactly as documented there, composing PxMainContainer only indirectly
 * through that shell.
 *
 * Both tables use <TableFrame> (src/components/ui/table-frame.tsx) for their
 * title bar and surface treatment, per CLAUDE.md's Table Composition and
 * Product Surface Rule sections — corrected in the v1.1 shared-system audit
 * follow-up (previously this file hand-rolled a border+shadow-together card
 * wrapper on the list, and rendered the drilldown activity table bare).
 *
 * Deliberately minimal for a first pass: no filter bar, column
 * customization, or row-action menus yet — those all compose
 * `component-dropdown-menu` (status `Implemented-unmapped`), which is not
 * directly usable per CLAUDE.md's Component Eligibility Policy outside the
 * four scoped compositions the registry already documents (SplitButton,
 * PxAnalyticsSecondaryNav's flyout, DashboardWidgetCard's overflow menu,
 * TableCustomizationMenu's Toolbar "More" trigger). Sorting instead uses
 * <TableSortHeader> directly, which needs no menu.
 *
 * See the bottom of this file for the Component Composition Audit.
 */

import * as React from "react"
import { format, parseISO } from "date-fns"

import { PxListShell } from "@/patterns/px-list-shell"
import { PxDetailDrilldownShell } from "@/patterns/px-detail-drilldown-shell"
import { PX_NAV_LABELS, type PxShellNavKey, type PxShellRailMode } from "@/components/px-shell-rail"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Link } from "@/components/ui/link"
import { Pagination } from "@/components/ui/pagination"
import { SearchBar } from "@/components/ui/search-bar"
import { StatusLabel, type StatusLabelVariant } from "@/components/ui/status-label"
import { SummaryStat, StatsRow } from "@/components/ui/summary-stat"
import { LineChart } from "@/components/ui/line-chart"
import {
  Table,
  TableBody,
  TableCell,
  TableEmptyState,
  TableHead,
  TableHeader,
  TableRow,
  TableSortHeader,
  type TableSortDirection,
} from "@/components/ui/table"
import { TableFrame } from "@/components/ui/table-frame"

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------

type AccountHealth = "healthy" | "at-risk" | "critical" | "churned"
type AccountPlan = "Free" | "Pro" | "Enterprise"

type Account = {
  id: string
  name: string
  industry: string
  plan: AccountPlan
  health: AccountHealth
  users: number
  mrr: number
  csm: string
  /** ISO 8601 — kept sortable; formatted only at render time. */
  lastActiveAt: string
}

const HEALTH_LABELS: Record<AccountHealth, string> = {
  healthy: "Healthy",
  "at-risk": "At Risk",
  critical: "Critical",
  churned: "Churned",
}

// Maps our domain health onto the approved StatusLabel variants rather than
// inventing new ones (StatusLabel has no dedicated "health" variant set).
const HEALTH_VARIANTS: Record<AccountHealth, StatusLabelVariant> = {
  healthy: "active",
  "at-risk": "waiting",
  critical: "failed",
  churned: "inactive",
}

const SEED_ACCOUNTS: Account[] = [
  { id: "acc-001", name: "Northwind Labs",   industry: "Software",            plan: "Enterprise", health: "healthy",  users: 482, mrr: 24800, csm: "Elena Cross",  lastActiveAt: "2026-09-06T14:22:00Z" },
  { id: "acc-002", name: "Cobalt Metrics",   industry: "Financial Services",  plan: "Pro",        health: "healthy",  users: 156, mrr: 8600,  csm: "Marcus Webb",  lastActiveAt: "2026-09-05T09:41:00Z" },
  { id: "acc-003", name: "Helio Freight",    industry: "Logistics",           plan: "Enterprise", health: "at-risk",  users: 310, mrr: 15200, csm: "Priya Shah",   lastActiveAt: "2026-08-28T18:03:00Z" },
  { id: "acc-004", name: "Juniper Systems",  industry: "Software",            plan: "Pro",        health: "healthy",  users: 98,  mrr: 5400,  csm: "David Kim",    lastActiveAt: "2026-09-06T11:15:00Z" },
  { id: "acc-005", name: "Tidewater Health", industry: "Healthcare",          plan: "Enterprise", health: "healthy",  users: 674, mrr: 31200, csm: "Sofia Reyes",  lastActiveAt: "2026-09-06T07:58:00Z" },
  { id: "acc-006", name: "Ashgrove Retail",  industry: "Retail",              plan: "Free",       health: "critical", users: 12,  mrr: 0,     csm: "Elena Cross",  lastActiveAt: "2026-07-12T16:30:00Z" },
  { id: "acc-007", name: "Pinnacle Voss",    industry: "Manufacturing",       plan: "Pro",        health: "healthy",  users: 203, mrr: 9800,  csm: "Marcus Webb",  lastActiveAt: "2026-09-05T21:07:00Z" },
  { id: "acc-008", name: "Marrow & Finch",   industry: "Media",               plan: "Enterprise", health: "healthy",  users: 388, mrr: 19600, csm: "Priya Shah",   lastActiveAt: "2026-09-06T05:44:00Z" },
  { id: "acc-009", name: "Sable & Rowe",     industry: "Financial Services",  plan: "Pro",        health: "at-risk",  users: 87,  mrr: 4200,  csm: "David Kim",    lastActiveAt: "2026-08-20T10:02:00Z" },
  { id: "acc-010", name: "Larkspur Health",  industry: "Healthcare",          plan: "Free",       health: "churned",  users: 4,   mrr: 0,     csm: "Sofia Reyes",  lastActiveAt: "2026-05-19T13:26:00Z" },
  { id: "acc-011", name: "Vantage Point",    industry: "Software",            plan: "Enterprise", health: "healthy",  users: 512, mrr: 27400, csm: "Elena Cross",  lastActiveAt: "2026-09-04T15:51:00Z" },
  { id: "acc-012", name: "Brightline Media", industry: "Media",               plan: "Pro",        health: "healthy",  users: 141, mrr: 7100,  csm: "Marcus Webb",  lastActiveAt: "2026-09-05T12:39:00Z" },
  { id: "acc-013", name: "Redwood Systems",  industry: "Manufacturing",       plan: "Enterprise", health: "healthy",  users: 296, mrr: 14300, csm: "Priya Shah",   lastActiveAt: "2026-09-06T08:12:00Z" },
  { id: "acc-014", name: "Copper Trail",     industry: "Retail",              plan: "Free",       health: "at-risk",  users: 21,  mrr: 0,     csm: "David Kim",    lastActiveAt: "2026-08-15T09:00:00Z" },
  { id: "acc-015", name: "Fernbank Group",   industry: "Education",           plan: "Pro",        health: "healthy",  users: 176, mrr: 8900,  csm: "Sofia Reyes",  lastActiveAt: "2026-09-05T17:28:00Z" },
]

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

type SortKey = "name" | "industry" | "plan" | "health" | "users" | "mrr" | "csm" | "lastActiveAt"

function sortValue(account: Account, key: SortKey): string | number {
  switch (key) {
    case "users":        return account.users
    case "mrr":          return account.mrr
    // Sorts on the raw ISO string, which is lexicographically ordered — the
    // rendered value is a localised label and would sort alphabetically.
    case "lastActiveAt": return account.lastActiveAt
    case "health":        return HEALTH_LABELS[account.health].toLowerCase()
    default:              return account[key].toLowerCase()
  }
}

function matchesQuery(account: Account, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    account.name.toLowerCase().includes(q) ||
    account.industry.toLowerCase().includes(q) ||
    account.csm.toLowerCase().includes(q)
  )
}

const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const PAGE_SIZE_OPTIONS = [10, 25, 50]

// ---------------------------------------------------------------------------
// Drilldown mock detail data
// ---------------------------------------------------------------------------

const USAGE_TREND = [
  { month: "Apr", sessions: 1180 },
  { month: "May", sessions: 1340 },
  { month: "Jun", sessions: 1290 },
  { month: "Jul", sessions: 1510 },
  { month: "Aug", sessions: 1610 },
  { month: "Sep", sessions: 1720 },
]

const RECENT_ACTIVITY = [
  { event: "New session recorded", when: "Sep 6, 2026" },
  { event: "Feature adopted: Product Mapper", when: "Sep 4, 2026" },
  { event: "Plan changed", when: "Aug 22, 2026" },
  { event: "CSM assigned", when: "Aug 10, 2026" },
]

// ---------------------------------------------------------------------------
// Account list
// ---------------------------------------------------------------------------

type AccountListProps = {
  accounts: Account[]
  onOpenAccount: (id: string) => void
  nav: {
    activeKey: PxShellNavKey
    onNavigate: (key: PxShellNavKey) => void
    mode: PxShellRailMode
    onModeChange: (mode: PxShellRailMode) => void
  }
}

function AccountList({ accounts, onOpenAccount, nav }: AccountListProps) {
  const [query, setQuery] = React.useState("")
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [sortKey, setSortKey] = React.useState<SortKey | null>(null)
  const [sortDirection, setSortDirection] = React.useState<TableSortDirection>(undefined)
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  const totalAccounts = accounts.length
  const healthyCount = accounts.filter((a) => a.health === "healthy").length
  const atRiskCount = accounts.filter((a) => a.health === "at-risk" || a.health === "critical").length
  const totalMrr = accounts.reduce((sum, a) => sum + a.mrr, 0)

  const visibleAccounts = React.useMemo(
    () => accounts.filter((a) => matchesQuery(a, query)),
    [accounts, query],
  )

  const sortedAccounts = React.useMemo(() => {
    if (!sortKey || !sortDirection) return visibleAccounts
    const dir = sortDirection === "ascending" ? 1 : -1
    return [...visibleAccounts].sort((a, b) => {
      const av = sortValue(a, sortKey)
      const bv = sortValue(b, sortKey)
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
  }, [visibleAccounts, sortKey, sortDirection])

  const pageCount = Math.max(1, Math.ceil(sortedAccounts.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pagedAccounts = sortedAccounts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function cycleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key)
      setSortDirection("ascending")
      return
    }
    if (sortDirection === "ascending") {
      setSortDirection("descending")
    } else {
      setSortKey(null)
      setSortDirection(undefined)
    }
  }

  return (
    <PxListShell
      nav={nav}
      header={{
        moduleName: PX_NAV_LABELS[nav.activeKey],
        avatar: (
          <Avatar size="medium">
            <AvatarFallback>ZK</AvatarFallback>
          </Avatar>
        ),
      }}
    >
      <div className="flex h-full flex-col gap-[var(--p-space-300)]">
        {/* Account analytics ------------------------------------------------ */}
        {/* Max 4 SummaryStats per row (CLAUDE.md / Figma Stats Row spec) —
            "Avg. Users / Account" moved out to stay within the cap. */}
        <StatsRow>
          <SummaryStat value={totalAccounts.toLocaleString()} label="Total Accounts" />
          <SummaryStat value={healthyCount.toLocaleString()} label="Healthy Accounts" />
          <SummaryStat value={atRiskCount.toLocaleString()} label="At Risk / Critical" />
          <SummaryStat value={CURRENCY.format(totalMrr)} label="Total MRR" />
        </StatsRow>

        {/* Account list ------------------------------------------------------ */}
        <TableFrame
          title="All Accounts"
          count={sortedAccounts.length}
          surface="page"
          search={{
            open: searchOpen,
            onToggle: () => setSearchOpen((v) => !v),
            render: (
              <SearchBar
                size="small"
                placeholder="Search accounts"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                onClear={() => {
                  setQuery("")
                  setPage(1)
                }}
              />
            ),
          }}
        >
          <Table containerClassName="min-h-0 flex-1">
            <TableHeader>
              <TableRow>
                {([
                  ["name", "Account Name"],
                  ["industry", "Industry"],
                  ["plan", "Plan"],
                  ["health", "Health"],
                  ["users", "Users"],
                  ["mrr", "MRR"],
                  ["csm", "CSM Owner"],
                  ["lastActiveAt", "Last Active"],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <TableHead key={key} sortable sortDirection={sortKey === key ? sortDirection : undefined}>
                    <TableSortHeader
                      direction={sortKey === key ? sortDirection : undefined}
                      onClick={() => cycleSort(key)}
                    >
                      {label}
                    </TableSortHeader>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            {pagedAccounts.length > 0 ? (
              <TableBody>
                {pagedAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <Link href={`#/accounts/${account.id}`} onClick={(e) => { e.preventDefault(); onOpenAccount(account.id) }}>
                        {account.name}
                      </Link>
                    </TableCell>
                    <TableCell>{account.industry}</TableCell>
                    <TableCell>{account.plan}</TableCell>
                    <TableCell>
                      <StatusLabel variant={HEALTH_VARIANTS[account.health]}>
                        {HEALTH_LABELS[account.health]}
                      </StatusLabel>
                    </TableCell>
                    <TableCell>{account.users.toLocaleString()}</TableCell>
                    <TableCell>{CURRENCY.format(account.mrr)}</TableCell>
                    <TableCell>{account.csm}</TableCell>
                    <TableCell>{format(parseISO(account.lastActiveAt), "MMM d, yyyy")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableEmptyState
                colSpan={8}
                title="No accounts match your search"
                body="Try a different name, industry, or CSM."
              />
            )}
          </Table>

          <div className="shrink-0">
            <Pagination
              page={currentPage}
              pageCount={pageCount}
              pageSize={pageSize}
              totalItems={sortedAccounts.length}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
            />
          </div>
        </TableFrame>
      </div>
    </PxListShell>
  )
}

// ---------------------------------------------------------------------------
// Account drilldown
// ---------------------------------------------------------------------------

type AccountDetailProps = {
  account: Account
  onBack: () => void
  nav: {
    activeKey: PxShellNavKey
    onNavigate: (key: PxShellNavKey) => void
    mode: PxShellRailMode
    onModeChange: (mode: PxShellRailMode) => void
  }
}

function AccountDetail({ account, onBack, nav }: AccountDetailProps) {
  return (
    <PxDetailDrilldownShell
      nav={nav}
      header={{ moduleName: PX_NAV_LABELS[nav.activeKey] }}
      onBack={onBack}
      title={account.name}
      titleChip={<StatusLabel variant={HEALTH_VARIANTS[account.health]}>{HEALTH_LABELS[account.health]}</StatusLabel>}
    >
      <div className="flex flex-col gap-[var(--p-space-300)]">
        {/* Max 4 SummaryStats per row (CLAUDE.md / Figma Stats Row spec) —
            CSM Owner dropped from this strip to stay within the cap; it's
            still shown on the list row this drilldown was opened from. */}
        <StatsRow>
          <SummaryStat value={account.users.toLocaleString()} label="Users" />
          <SummaryStat value={CURRENCY.format(account.mrr)} label="MRR" />
          <SummaryStat value={account.plan} label="Plan" />
          <SummaryStat value={format(parseISO(account.lastActiveAt), "MMM d, yyyy")} label="Last Active" />
        </StatsRow>

        {/* Directly on the drilldown's page background (surface/page), so per
            CLAUDE.md's Product Surface Rule this gets shadow-100 and no
            border — corrected from an earlier border-only treatment. */}
        <div className="rounded-[var(--p-radius-150)] bg-[var(--s-color-surface-default)] shadow-[var(--e-shadow-100)] p-[var(--p-space-300)]">
          <h3 className="mb-[var(--p-space-200)] text-[length:var(--p-font-size-medium)] font-[var(--p-font-weight-medium)] text-[var(--s-color-text-default)]">
            Session Trend (6 months)
          </h3>
          <LineChart
            data={USAGE_TREND}
            categoryKey="month"
            series={[{ key: "sessions", label: "Sessions", series: 1 }]}
            area
          />
        </div>

        <TableFrame title="Recent Activity" count={RECENT_ACTIVITY.length} surface="page">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECENT_ACTIVITY.map((row) => (
                <TableRow key={row.event}>
                  <TableCell>{row.event}</TableCell>
                  <TableCell>{row.when}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableFrame>
      </div>
    </PxDetailDrilldownShell>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type AccountExplorerProps = {
  activeKey: PxShellNavKey
  onNavigate: (key: PxShellNavKey) => void
  mode: PxShellRailMode
  onModeChange: (mode: PxShellRailMode) => void
}

function AccountExplorer({ activeKey, onNavigate, mode, onModeChange }: AccountExplorerProps) {
  const [accounts] = React.useState(SEED_ACCOUNTS)
  const [selectedAccountId, setSelectedAccountId] = React.useState<string | null>(null)

  const nav = { activeKey, onNavigate, mode, onModeChange }
  const selectedAccount = accounts.find((a) => a.id === selectedAccountId) ?? null

  if (selectedAccount) {
    return (
      <AccountDetail
        account={selectedAccount}
        onBack={() => setSelectedAccountId(null)}
        nav={nav}
      />
    )
  }

  return (
    <AccountList
      accounts={accounts}
      onOpenAccount={setSelectedAccountId}
      nav={nav}
    />
  )
}

export { AccountExplorer }

// ---------------------------------------------------------------------------
// Component Composition Audit
// ---------------------------------------------------------------------------
//
// Approved components reused: PxListShell (shell, Approved),
// PxDetailDrilldownShell (shell, Approved), Link (Approved).
//
// Mapped-review-pending components used directly (provisional, disclosed
// per CLAUDE.md's Component Eligibility Policy — no suitable Approved
// equivalent exists for these roles, existing typed APIs used as documented,
// no invented props/variants): SummaryStat/StatsRow, Table family
// (TableHeader/TableRow/TableHead/TableSortHeader/TableBody/TableCell/
// TableEmptyState), TableFrame, StatusLabel, SearchBar, Pagination,
// LineChart, Avatar.
//
// v1.1 shared-system audit follow-up (this pass): both tables now use
// <TableFrame> instead of a hand-rolled wrapper — the list's card previously
// combined a visible border with a shadow (a Product Surface Rule
// violation); the drilldown's activity table was previously rendered bare,
// with no title bar. The drilldown's chart card was previously border-only;
// since it sits directly on the page background, it's now shadow-only
// (bg-surface-default + shadow-100, no border), consistent with the same
// rule.
//
// New components created: none.
// Native interactive elements introduced: none (all interactive surfaces —
// search input, sort headers, pagination, links — go through the components
// above).
// className overrides on approved/provisional components: none — all
// className usage here is on plain wrapper <div>/<h3> elements for
// layout/placement only, using semantic tokens, not on the components
// themselves.
// Cross-component token references: none — no visual literal styling used;
// wrapper elements use existing semantic surface/text/radius/shadow tokens.
// Duplicate implementations found: none.
// Unresolved API/token gaps: none for this v1 scope. Deliberately deferred
// (not gaps, scope decisions): filter bar, column customization, and
// row/record action menus — all three would require importing
// `component-dropdown-menu` (`Implemented-unmapped`) outside its four
// registry-documented scoped compositions (SplitButton, PxAnalyticsSecondaryNav's
// flyout, DashboardWidgetCard's overflow menu, TableCustomizationMenu's
// Toolbar "More" trigger), which CLAUDE.md's Component Eligibility Policy
// does not allow a screen to do on its own authority.
