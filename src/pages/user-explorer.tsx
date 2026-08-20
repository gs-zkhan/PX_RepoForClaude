/**
 * Audience Explorer — user list screen built on <PxListShell>.
 *
 * Anatomy: PX rail + two-bar header (shell's responsibility) wrapping a
 * bordered card that holds a title bar, a conditional Filter Bar, the user
 * table, and pagination.
 *
 * Filtering is real, not decorative. Four multi-select criteria (Status,
 * Company, Role, Sessions) are held in `filters`, rendered as Filter Chips by
 * <FilterBar>, edited through <FilterDropdownPanel> in a popover anchored to
 * the bar, and applied to the rows before sorting and paging. Every count on
 * screen — the title-bar total and the pagination footer — is derived from
 * the filtered set, so nothing can drift out of sync with what's displayed.
 */

import * as React from "react"
import { format, parseISO } from "date-fns"

import { cn } from "@/lib/utils"
import { PxListShell } from "@/patterns/px-list-shell"
import { PECDropdown, type PECOption } from "@/components/px-pec-dropdown"
import { PX_NAV_LABELS, type PxShellNavKey, type PxShellRailMode } from "@/components/px-shell-rail"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ColumnSelector,
  type ColumnSelectorView,
} from "@/components/ui/column-selector"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FilterBar, type FilterBarChip } from "@/components/ui/filter-bar"
import { FilterDropdownPanel, type PicklistOption } from "@/components/ui/filter-dropdown-panel"
import { IconButton } from "@/components/ui/icon-button"
import { Pagination } from "@/components/ui/pagination"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { SearchBar } from "@/components/ui/search-bar"
import { StatusLabel, type StatusLabelVariant } from "@/components/ui/status-label"
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
  type TableColumnPin,
  type TableDensity,
  type TableSortDirection,
} from "@/components/ui/table"

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------

type UserStatus = "active" | "invited" | "inactive" | "suspended"

type UserPlan = "Free" | "Pro" | "Enterprise"

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  company: string
  role: string
  status: UserStatus
  sessions: number
  /** ISO 8601 — kept sortable; formatted only at render time. */
  lastSeenAt: string
  // The five columns below exist to give this table enough columns to
  // require horizontal scroll at a normal viewport width, for exercising
  // column pinning — same reason they're derived rather than hand-authored
  // per row (see USERS below).
  phone: string
  department: string
  country: string
  manager: string
  plan: UserPlan
}

/** The 8 hand-authored fields per seed row — the 5 derived fields are added by `USERS` below. */
type SeedUser = Omit<User, "phone" | "department" | "country" | "manager" | "plan">

const STATUS_LABELS: Record<UserStatus, string> = {
  active: "Active",
  invited: "Invited",
  inactive: "Inactive",
  suspended: "Suspended",
}

// Maps our domain status onto the approved StatusLabel variants rather than
// inventing new ones.
const STATUS_VARIANTS: Record<UserStatus, StatusLabelVariant> = {
  active: "active",
  invited: "waiting",
  inactive: "inactive",
  suspended: "failed",
}

const STATUS_OPTIONS: { status: UserStatus; label: string }[] = (
  Object.keys(STATUS_LABELS) as UserStatus[]
).map((s) => ({ status: s, label: STATUS_LABELS[s] }))

const COMPANIES = [
  "Northwind Labs",
  "Helio Freight",
  "Cobalt Metrics",
  "Marrow & Finch",
  "Tidewater Health",
  "Juniper Systems",
  "Ashgrove Retail",
  "Pinnacle Voss",
] as const

const ROLES = [
  "Administrator",
  "Analyst",
  "Developer",
  "Product Manager",
  "Support Agent",
  "Viewer",
] as const

const DEPARTMENTS = [
  "Engineering",
  "Sales",
  "Marketing",
  "Customer Success",
  "Product",
  "Finance",
  "People",
  "Support",
] as const

const COUNTRIES = [
  "United States",
  "Germany",
  "Nigeria",
  "Sweden",
  "Japan",
  "Brazil",
  "India",
  "Poland",
  "Canada",
  "Turkey",
] as const

const MANAGERS = [
  "Elena Cross",
  "Marcus Webb",
  "Priya Shah",
  "David Kim",
  "Sofia Reyes",
  "James Ndlovu",
] as const

const PLANS: UserPlan[] = ["Free", "Pro", "Enterprise"]

/** Deterministic per-row phone number — stable across renders, no per-row authoring needed. */
function phoneFor(index: number): string {
  const n = 2000000 + ((index * 7919) % 7999999)
  const digits = String(n)
  return `+1 555-${digits.slice(0, 3)}-${digits.slice(3, 7)}`
}

const SEED_USERS: SeedUser[] = [
  { id: "usr-001", firstName: "Amara",     lastName: "Okonkwo",       email: "amara.okonkwo@northwindlabs.com",       company: "Northwind Labs",   role: "Administrator",   status: "active",    sessions: 1284, lastSeenAt: "2026-08-05T14:22:00Z" },
  { id: "usr-002", firstName: "Priya",     lastName: "Raghunathan",   email: "priya.raghunathan@cobaltmetrics.io",    company: "Cobalt Metrics",   role: "Analyst",         status: "active",    sessions: 973,  lastSeenAt: "2026-08-05T09:41:00Z" },
  { id: "usr-003", firstName: "Tomas",     lastName: "Lindqvist",     email: "tomas.lindqvist@heliofreight.com",      company: "Helio Freight",    role: "Developer",       status: "active",    sessions: 2140, lastSeenAt: "2026-08-04T18:03:00Z" },
  { id: "usr-004", firstName: "Yusuf",     lastName: "Demirtas",      email: "yusuf.demirtas@junipersys.com",         company: "Juniper Systems",  role: "Product Manager", status: "invited",   sessions: 0,    lastSeenAt: "2026-07-29T11:15:00Z" },
  { id: "usr-005", firstName: "Ingrid",    lastName: "Halvorsen",     email: "ingrid.halvorsen@tidewaterhealth.org",  company: "Tidewater Health", role: "Support Agent",   status: "active",    sessions: 651,  lastSeenAt: "2026-08-06T07:58:00Z" },
  { id: "usr-006", firstName: "Rafael",    lastName: "Mendoza",       email: "rafael.mendoza@ashgrove.co",            company: "Ashgrove Retail",  role: "Analyst",         status: "inactive",  sessions: 118,  lastSeenAt: "2026-03-12T16:30:00Z" },
  { id: "usr-007", firstName: "Noor",      lastName: "Al-Rashid",     email: "noor.alrashid@pinnaclevoss.com",        company: "Pinnacle Voss",    role: "Administrator",   status: "active",    sessions: 1876, lastSeenAt: "2026-08-05T21:07:00Z" },
  { id: "usr-008", firstName: "Kenji",     lastName: "Nakamura",      email: "kenji.nakamura@marrowfinch.com",        company: "Marrow & Finch",   role: "Developer",       status: "active",    sessions: 1533, lastSeenAt: "2026-08-06T05:44:00Z" },
  { id: "usr-009", firstName: "Fiona",     lastName: "Gallagher",     email: "fiona.gallagher@northwindlabs.com",     company: "Northwind Labs",   role: "Viewer",          status: "inactive",  sessions: 47,   lastSeenAt: "2026-01-24T10:02:00Z" },
  { id: "usr-010", firstName: "Dmitri",    lastName: "Volkov",        email: "dmitri.volkov@cobaltmetrics.io",        company: "Cobalt Metrics",   role: "Developer",       status: "suspended", sessions: 402,  lastSeenAt: "2026-05-19T13:26:00Z" },
  { id: "usr-011", firstName: "Chiara",    lastName: "Bellini",       email: "chiara.bellini@heliofreight.com",       company: "Helio Freight",    role: "Product Manager", status: "active",    sessions: 889,  lastSeenAt: "2026-08-04T15:51:00Z" },
  { id: "usr-012", firstName: "Samuel",    lastName: "Adeyemi",       email: "samuel.adeyemi@junipersys.com",         company: "Juniper Systems",  role: "Analyst",         status: "active",    sessions: 1207, lastSeenAt: "2026-08-05T12:39:00Z" },
  { id: "usr-013", firstName: "Hana",      lastName: "Kobayashi",     email: "hana.kobayashi@tidewaterhealth.org",    company: "Tidewater Health", role: "Administrator",   status: "active",    sessions: 2451, lastSeenAt: "2026-08-06T08:12:00Z" },
  { id: "usr-014", firstName: "Lucas",     lastName: "Ferreira",      email: "lucas.ferreira@ashgrove.co",            company: "Ashgrove Retail",  role: "Support Agent",   status: "invited",   sessions: 0,    lastSeenAt: "2026-08-01T09:00:00Z" },
  { id: "usr-015", firstName: "Marta",     lastName: "Kowalczyk",     email: "marta.kowalczyk@pinnaclevoss.com",      company: "Pinnacle Voss",    role: "Developer",       status: "active",    sessions: 1690, lastSeenAt: "2026-08-05T17:28:00Z" },
  { id: "usr-016", firstName: "Omar",      lastName: "Haddad",        email: "omar.haddad@marrowfinch.com",           company: "Marrow & Finch",   role: "Viewer",          status: "inactive",  sessions: 233,  lastSeenAt: "2026-04-07T14:45:00Z" },
  { id: "usr-017", firstName: "Elin",      lastName: "Bergström",     email: "elin.bergstrom@northwindlabs.com",      company: "Northwind Labs",   role: "Analyst",         status: "active",    sessions: 764,  lastSeenAt: "2026-08-03T11:19:00Z" },
  { id: "usr-018", firstName: "Ravi",      lastName: "Chandrasekar",  email: "ravi.chandrasekar@cobaltmetrics.io",    company: "Cobalt Metrics",   role: "Product Manager", status: "active",    sessions: 1042, lastSeenAt: "2026-08-06T06:33:00Z" },
  { id: "usr-019", firstName: "Zoe",       lastName: "Papadopoulos",  email: "zoe.papadopoulos@heliofreight.com",     company: "Helio Freight",    role: "Support Agent",   status: "suspended", sessions: 316,  lastSeenAt: "2026-06-02T19:54:00Z" },
  { id: "usr-020", firstName: "Mateo",     lastName: "Restrepo",      email: "mateo.restrepo@junipersys.com",         company: "Juniper Systems",  role: "Developer",       status: "active",    sessions: 1998, lastSeenAt: "2026-08-05T22:41:00Z" },
  { id: "usr-021", firstName: "Aisha",     lastName: "Bello",         email: "aisha.bello@tidewaterhealth.org",       company: "Tidewater Health", role: "Analyst",         status: "active",    sessions: 587,  lastSeenAt: "2026-08-04T08:26:00Z" },
  { id: "usr-022", firstName: "Niall",     lastName: "O'Sullivan",    email: "niall.osullivan@ashgrove.co",           company: "Ashgrove Retail",  role: "Administrator",   status: "active",    sessions: 1345, lastSeenAt: "2026-08-05T16:07:00Z" },
  { id: "usr-023", firstName: "Sofia",     lastName: "Andersson",     email: "sofia.andersson@pinnaclevoss.com",      company: "Pinnacle Voss",    role: "Viewer",          status: "invited",   sessions: 0,    lastSeenAt: "2026-07-31T13:48:00Z" },
  { id: "usr-024", firstName: "Wei",       lastName: "Zhang",         email: "wei.zhang@marrowfinch.com",             company: "Marrow & Finch",   role: "Developer",       status: "active",    sessions: 2673, lastSeenAt: "2026-08-06T04:15:00Z" },
  { id: "usr-025", firstName: "Gabriel",   lastName: "Rousseau",      email: "gabriel.rousseau@northwindlabs.com",    company: "Northwind Labs",   role: "Product Manager", status: "active",    sessions: 921,  lastSeenAt: "2026-08-05T10:52:00Z" },
  { id: "usr-026", firstName: "Leila",     lastName: "Nasser",        email: "leila.nasser@cobaltmetrics.io",         company: "Cobalt Metrics",   role: "Support Agent",   status: "inactive",  sessions: 164,  lastSeenAt: "2026-02-18T15:33:00Z" },
  { id: "usr-027", firstName: "Anders",    lastName: "Krogh",         email: "anders.krogh@heliofreight.com",         company: "Helio Freight",    role: "Analyst",         status: "active",    sessions: 1118, lastSeenAt: "2026-08-04T20:09:00Z" },
  { id: "usr-028", firstName: "Divya",     lastName: "Menon",         email: "divya.menon@junipersys.com",            company: "Juniper Systems",  role: "Administrator",   status: "active",    sessions: 1762, lastSeenAt: "2026-08-06T09:21:00Z" },
  { id: "usr-029", firstName: "Tobias",    lastName: "Wagner",        email: "tobias.wagner@tidewaterhealth.org",     company: "Tidewater Health", role: "Developer",       status: "suspended", sessions: 508,  lastSeenAt: "2026-05-30T12:14:00Z" },
  { id: "usr-030", firstName: "Camila",    lastName: "Duarte",        email: "camila.duarte@ashgrove.co",             company: "Ashgrove Retail",  role: "Product Manager", status: "active",    sessions: 843,  lastSeenAt: "2026-08-05T14:57:00Z" },
  { id: "usr-031", firstName: "Ismail",    lastName: "Farouk",        email: "ismail.farouk@pinnaclevoss.com",        company: "Pinnacle Voss",    role: "Analyst",         status: "active",    sessions: 1476, lastSeenAt: "2026-08-03T17:36:00Z" },
  { id: "usr-032", firstName: "Katarzyna", lastName: "Nowak",         email: "katarzyna.nowak@marrowfinch.com",       company: "Marrow & Finch",   role: "Viewer",          status: "inactive",  sessions: 92,   lastSeenAt: "2026-01-09T08:47:00Z" },
  { id: "usr-033", firstName: "Hugo",      lastName: "Almeida",       email: "hugo.almeida@northwindlabs.com",        company: "Northwind Labs",   role: "Developer",       status: "active",    sessions: 2209, lastSeenAt: "2026-08-06T03:02:00Z" },
  { id: "usr-034", firstName: "Nadia",     lastName: "Petrova",       email: "nadia.petrova@cobaltmetrics.io",        company: "Cobalt Metrics",   role: "Administrator",   status: "active",    sessions: 1391, lastSeenAt: "2026-08-05T19:25:00Z" },
  { id: "usr-035", firstName: "Ethan",     lastName: "Brightwater",   email: "ethan.brightwater@heliofreight.com",    company: "Helio Freight",    role: "Support Agent",   status: "invited",   sessions: 0,    lastSeenAt: "2026-08-02T10:30:00Z" },
  { id: "usr-036", firstName: "Mei Lin",   lastName: "Chua",          email: "meilin.chua@junipersys.com",            company: "Juniper Systems",  role: "Analyst",         status: "active",    sessions: 706,  lastSeenAt: "2026-08-04T13:11:00Z" },
  { id: "usr-037", firstName: "Oskar",     lastName: "Virtanen",      email: "oskar.virtanen@tidewaterhealth.org",    company: "Tidewater Health", role: "Viewer",          status: "inactive",  sessions: 271,  lastSeenAt: "2026-03-28T09:38:00Z" },
  { id: "usr-038", firstName: "Rania",     lastName: "Khalil",        email: "rania.khalil@ashgrove.co",              company: "Ashgrove Retail",  role: "Developer",       status: "active",    sessions: 1854, lastSeenAt: "2026-08-05T23:16:00Z" },
  { id: "usr-039", firstName: "Felipe",    lastName: "Ocampo",        email: "felipe.ocampo@pinnaclevoss.com",        company: "Pinnacle Voss",    role: "Product Manager", status: "active",    sessions: 1063, lastSeenAt: "2026-08-06T01:49:00Z" },
  { id: "usr-040", firstName: "Astrid",    lastName: "Nilsen",        email: "astrid.nilsen@marrowfinch.com",         company: "Marrow & Finch",   role: "Support Agent",   status: "active",    sessions: 495,  lastSeenAt: "2026-08-04T07:23:00Z" },
  { id: "usr-041", firstName: "Jonas",     lastName: "Beckmann",      email: "jonas.beckmann@northwindlabs.com",      company: "Northwind Labs",   role: "Analyst",         status: "suspended", sessions: 638,  lastSeenAt: "2026-06-14T18:41:00Z" },
  { id: "usr-042", firstName: "Simone",    lastName: "Rinaldi",       email: "simone.rinaldi@cobaltmetrics.io",       company: "Cobalt Metrics",   role: "Viewer",          status: "active",    sessions: 359,  lastSeenAt: "2026-08-03T20:05:00Z" },
  { id: "usr-043", firstName: "Tariq",     lastName: "Mansour",       email: "tariq.mansour@heliofreight.com",        company: "Helio Freight",    role: "Administrator",   status: "active",    sessions: 2087, lastSeenAt: "2026-08-06T02:34:00Z" },
  { id: "usr-044", firstName: "Freya",     lastName: "Lindgren",      email: "freya.lindgren@junipersys.com",         company: "Juniper Systems",  role: "Support Agent",   status: "inactive",  sessions: 143,  lastSeenAt: "2026-02-05T11:57:00Z" },
  { id: "usr-045", firstName: "Arjun",     lastName: "Kapoor",        email: "arjun.kapoor@tidewaterhealth.org",      company: "Tidewater Health", role: "Developer",       status: "active",    sessions: 1622, lastSeenAt: "2026-08-05T15:43:00Z" },
  { id: "usr-046", firstName: "Beatriz",   lastName: "Salgado",       email: "beatriz.salgado@ashgrove.co",           company: "Ashgrove Retail",  role: "Viewer",          status: "invited",   sessions: 0,    lastSeenAt: "2026-07-28T16:20:00Z" },
  { id: "usr-047", firstName: "Lars",      lastName: "Mikkelsen",     email: "lars.mikkelsen@pinnaclevoss.com",       company: "Pinnacle Voss",    role: "Developer",       status: "active",    sessions: 1237, lastSeenAt: "2026-08-04T22:08:00Z" },
  { id: "usr-048", firstName: "Yara",      lastName: "Haddadin",      email: "yara.haddadin@marrowfinch.com",         company: "Marrow & Finch",   role: "Product Manager", status: "active",    sessions: 954,  lastSeenAt: "2026-08-05T13:12:00Z" },
  { id: "usr-049", firstName: "Marco",     lastName: "Antunes",       email: "marco.antunes@northwindlabs.com",       company: "Northwind Labs",   role: "Analyst",         status: "active",    sessions: 934,  lastSeenAt: "2026-08-06T10:15:00Z" },
  { id: "usr-050", firstName: "Ingrid",    lastName: "Lundberg",      email: "ingrid.lundberg@cobaltmetrics.io",      company: "Cobalt Metrics",   role: "Developer",       status: "active",    sessions: 1456, lastSeenAt: "2026-08-05T09:02:00Z" },
  { id: "usr-051", firstName: "Kwame",     lastName: "Asante",        email: "kwame.asante@heliofreight.com",         company: "Helio Freight",    role: "Support Agent",   status: "active",    sessions: 512,  lastSeenAt: "2026-08-04T14:37:00Z" },
  { id: "usr-052", firstName: "Yuki",      lastName: "Tanaka",        email: "yuki.tanaka@junipersys.com",            company: "Juniper Systems",  role: "Product Manager", status: "active",    sessions: 1789, lastSeenAt: "2026-08-06T07:44:00Z" },
  { id: "usr-053", firstName: "Helena",    lastName: "Kovač",         email: "helena.kovac@tidewaterhealth.org",      company: "Tidewater Health", role: "Viewer",          status: "inactive",  sessions: 88,   lastSeenAt: "2026-02-11T09:20:00Z" },
  { id: "usr-054", firstName: "Diego",     lastName: "Fernández",     email: "diego.fernandez@ashgrove.co",           company: "Ashgrove Retail",  role: "Administrator",   status: "active",    sessions: 2034, lastSeenAt: "2026-08-05T18:52:00Z" },
  { id: "usr-055", firstName: "Aiko",      lastName: "Watanabe",      email: "aiko.watanabe@pinnaclevoss.com",        company: "Pinnacle Voss",    role: "Analyst",         status: "active",    sessions: 673,  lastSeenAt: "2026-08-03T12:09:00Z" },
  { id: "usr-056", firstName: "Sami",      lastName: "Al-Farsi",      email: "sami.alfarsi@marrowfinch.com",          company: "Marrow & Finch",   role: "Developer",       status: "suspended", sessions: 210,  lastSeenAt: "2026-04-22T08:31:00Z" },
  { id: "usr-057", firstName: "Liliana",   lastName: "Popescu",       email: "liliana.popescu@northwindlabs.com",     company: "Northwind Labs",   role: "Support Agent",   status: "active",    sessions: 845,  lastSeenAt: "2026-08-06T11:05:00Z" },
  { id: "usr-058", firstName: "Connor",    lastName: "Byrne",         email: "connor.byrne@cobaltmetrics.io",         company: "Cobalt Metrics",   role: "Viewer",          status: "active",    sessions: 397,  lastSeenAt: "2026-08-02T16:48:00Z" },
  { id: "usr-059", firstName: "Zainab",    lastName: "Yusuf",         email: "zainab.yusuf@heliofreight.com",         company: "Helio Freight",    role: "Product Manager", status: "active",    sessions: 1211, lastSeenAt: "2026-08-05T20:14:00Z" },
  { id: "usr-060", firstName: "Pieter",    lastName: "van Dijk",      email: "pieter.vandijk@junipersys.com",         company: "Juniper Systems",  role: "Administrator",   status: "active",    sessions: 1948, lastSeenAt: "2026-08-06T06:27:00Z" },
  { id: "usr-061", firstName: "Naledi",    lastName: "Mokoena",       email: "naledi.mokoena@tidewaterhealth.org",    company: "Tidewater Health", role: "Analyst",         status: "invited",   sessions: 0,    lastSeenAt: "2026-08-01T13:00:00Z" },
  { id: "usr-062", firstName: "Bruno",     lastName: "Salgado",       email: "bruno.salgado@ashgrove.co",             company: "Ashgrove Retail",  role: "Developer",       status: "active",    sessions: 1567, lastSeenAt: "2026-08-04T19:33:00Z" },
  { id: "usr-063", firstName: "Isabela",   lastName: "Cardoso",       email: "isabela.cardoso@pinnaclevoss.com",      company: "Pinnacle Voss",    role: "Support Agent",   status: "active",    sessions: 623,  lastSeenAt: "2026-08-03T08:19:00Z" },
  { id: "usr-064", firstName: "Timo",      lastName: "Saarinen",      email: "timo.saarinen@marrowfinch.com",         company: "Marrow & Finch",   role: "Viewer",          status: "inactive",  sessions: 156,  lastSeenAt: "2026-01-30T10:41:00Z" },
  { id: "usr-065", firstName: "Grace",     lastName: "Mensah",        email: "grace.mensah@northwindlabs.com",        company: "Northwind Labs",   role: "Product Manager", status: "active",    sessions: 1342, lastSeenAt: "2026-08-06T09:58:00Z" },
  { id: "usr-066", firstName: "Adrian",    lastName: "Kowalski",      email: "adrian.kowalski@cobaltmetrics.io",      company: "Cobalt Metrics",   role: "Analyst",         status: "active",    sessions: 789,  lastSeenAt: "2026-08-05T15:22:00Z" },
  { id: "usr-067", firstName: "Farah",     lastName: "Haidari",       email: "farah.haidari@heliofreight.com",        company: "Helio Freight",    role: "Administrator",   status: "active",    sessions: 2201, lastSeenAt: "2026-08-06T08:04:00Z" },
  { id: "usr-068", firstName: "Lucas",     lastName: "Moretti",       email: "lucas.moretti@junipersys.com",          company: "Juniper Systems",  role: "Developer",       status: "active",    sessions: 1678, lastSeenAt: "2026-08-04T21:15:00Z" },
  { id: "usr-069", firstName: "Sanne",     lastName: "Bakker",        email: "sanne.bakker@tidewaterhealth.org",      company: "Tidewater Health", role: "Support Agent",   status: "suspended", sessions: 302,  lastSeenAt: "2026-05-14T09:47:00Z" },
  { id: "usr-070", firstName: "Kofi",      lastName: "Owusu",         email: "kofi.owusu@ashgrove.co",                company: "Ashgrove Retail",  role: "Viewer",          status: "active",    sessions: 445,  lastSeenAt: "2026-08-02T13:26:00Z" },
  { id: "usr-071", firstName: "Meera",     lastName: "Pillai",        email: "meera.pillai@pinnaclevoss.com",         company: "Pinnacle Voss",    role: "Product Manager", status: "active",    sessions: 1523, lastSeenAt: "2026-08-05T22:03:00Z" },
  { id: "usr-072", firstName: "Erik",      lastName: "Solberg",       email: "erik.solberg@marrowfinch.com",          company: "Marrow & Finch",   role: "Analyst",         status: "active",    sessions: 967,  lastSeenAt: "2026-08-06T05:39:00Z" },
  { id: "usr-073", firstName: "Amina",     lastName: "Diallo",        email: "amina.diallo@northwindlabs.com",        company: "Northwind Labs",   role: "Developer",       status: "invited",   sessions: 0,    lastSeenAt: "2026-07-30T14:10:00Z" },
  { id: "usr-074", firstName: "Hoang",     lastName: "Minh Duc",      email: "hoang.duc@cobaltmetrics.io",            company: "Cobalt Metrics",   role: "Administrator",   status: "active",    sessions: 2456, lastSeenAt: "2026-08-06T07:12:00Z" },
  { id: "usr-075", firstName: "Paula",     lastName: "Jiménez",       email: "paula.jimenez@heliofreight.com",        company: "Helio Freight",    role: "Support Agent",   status: "active",    sessions: 578,  lastSeenAt: "2026-08-03T17:41:00Z" },
  { id: "usr-076", firstName: "Viktor",    lastName: "Novák",         email: "viktor.novak@junipersys.com",           company: "Juniper Systems",  role: "Viewer",          status: "inactive",  sessions: 134,  lastSeenAt: "2026-03-08T11:29:00Z" },
  { id: "usr-077", firstName: "Chidinma",  lastName: "Eze",           email: "chidinma.eze@tidewaterhealth.org",      company: "Tidewater Health", role: "Product Manager", status: "active",    sessions: 1809, lastSeenAt: "2026-08-05T10:52:00Z" },
  { id: "usr-078", firstName: "Oskar",     lastName: "Lindholm",      email: "oskar.lindholm@ashgrove.co",            company: "Ashgrove Retail",  role: "Analyst",         status: "active",    sessions: 712,  lastSeenAt: "2026-08-04T16:08:00Z" },
  { id: "usr-079", firstName: "Ana",       lastName: "Belić",         email: "ana.belic@pinnaclevoss.com",            company: "Pinnacle Voss",    role: "Developer",       status: "active",    sessions: 1295, lastSeenAt: "2026-08-06T09:21:00Z" },
  { id: "usr-080", firstName: "Rami",      lastName: "Haddad",        email: "rami.haddad@marrowfinch.com",           company: "Marrow & Finch",   role: "Administrator",   status: "suspended", sessions: 267,  lastSeenAt: "2026-06-19T12:55:00Z" },
  { id: "usr-081", firstName: "Ingrid",    lastName: "Bachmann",      email: "ingrid.bachmann@northwindlabs.com",     company: "Northwind Labs",   role: "Support Agent",   status: "active",    sessions: 891,  lastSeenAt: "2026-08-05T14:44:00Z" },
  { id: "usr-082", firstName: "Takeshi",   lastName: "Mori",          email: "takeshi.mori@cobaltmetrics.io",         company: "Cobalt Metrics",   role: "Viewer",          status: "active",    sessions: 356,  lastSeenAt: "2026-08-02T10:17:00Z" },
  { id: "usr-083", firstName: "Fatima",    lastName: "Zohra",         email: "fatima.zohra@heliofreight.com",         company: "Helio Freight",    role: "Product Manager", status: "active",    sessions: 1620, lastSeenAt: "2026-08-06T13:30:00Z" },
]

const USERS: User[] = SEED_USERS.map((u, index) => ({
  ...u,
  phone: phoneFor(index),
  department: DEPARTMENTS[index % DEPARTMENTS.length],
  country: COUNTRIES[index % COUNTRIES.length],
  manager: MANAGERS[index % MANAGERS.length],
  plan: PLANS[index % PLANS.length],
}))

// ---------------------------------------------------------------------------
// Filter definitions
// ---------------------------------------------------------------------------

type FilterFieldKey = "status" | "company" | "role" | "sessions"

const SESSION_BUCKETS: { value: string; label: string; test: (n: number) => boolean }[] = [
  { value: "none",   label: "No sessions",   test: (n) => n === 0 },
  { value: "low",    label: "1 – 499",       test: (n) => n >= 1 && n < 500 },
  { value: "medium", label: "500 – 999",     test: (n) => n >= 500 && n < 1000 },
  { value: "high",   label: "1,000 – 1,999", test: (n) => n >= 1000 && n < 2000 },
  { value: "power",  label: "2,000+",        test: (n) => n >= 2000 },
]

type FilterFieldDef = {
  label: string
  options: PicklistOption[]
  /** Reads the option value a given user matches, for predicate evaluation. */
  valueOf: (user: User) => string
}

const FILTER_FIELDS: Record<FilterFieldKey, FilterFieldDef> = {
  status: {
    label: "Status",
    options: (Object.keys(STATUS_LABELS) as UserStatus[]).map((s) => ({
      value: s,
      label: STATUS_LABELS[s],
    })),
    valueOf: (u) => u.status,
  },
  company: {
    label: "Company",
    options: COMPANIES.map((c) => ({ value: c, label: c })),
    valueOf: (u) => u.company,
  },
  role: {
    label: "Role",
    options: ROLES.map((r) => ({ value: r, label: r })),
    valueOf: (u) => u.role,
  },
  sessions: {
    label: "Sessions",
    options: SESSION_BUCKETS.map((b) => ({ value: b.value, label: b.label })),
    valueOf: (u) => SESSION_BUCKETS.find((b) => b.test(u.sessions))?.value ?? "none",
  },
}

const FILTER_FIELD_ORDER: FilterFieldKey[] = ["status", "company", "role", "sessions"]

/** One criterion the user has added to the bar. Empty `selected` = not yet set. */
type ActiveFilter = {
  field: FilterFieldKey
  selected: string[]
}

function filterSummary(field: FilterFieldKey, selected: string[]): string | undefined {
  if (selected.length === 0) return undefined
  const { options } = FILTER_FIELDS[field]
  const first = options.find((o) => o.value === selected[0])?.label ?? selected[0]
  return selected.length === 1 ? first : `${first} +${selected.length - 1}`
}

function matchesFilters(user: User, filters: ActiveFilter[]): boolean {
  return filters.every((f) => {
    if (f.selected.length === 0) return true
    return f.selected.includes(FILTER_FIELDS[f.field].valueOf(user))
  })
}

function matchesQuery(user: User, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    user.firstName.toLowerCase().includes(q) ||
    user.lastName.toLowerCase().includes(q) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(q) ||
    user.email.toLowerCase().includes(q) ||
    user.company.toLowerCase().includes(q) ||
    user.role.toLowerCase().includes(q)
  )
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

type SortKey =
  | "firstName"
  | "lastName"
  | "email"
  | "company"
  | "role"
  | "status"
  | "sessions"
  | "lastSeenAt"
  | "phone"
  | "department"
  | "country"
  | "manager"
  | "plan"

function sortValue(user: User, key: SortKey): string | number {
  switch (key) {
    case "sessions":   return user.sessions
    // Sorts on the raw ISO string, which is lexicographically ordered — the
    // rendered value is a localised label and would sort alphabetically.
    case "lastSeenAt": return user.lastSeenAt
    case "status":     return STATUS_LABELS[user.status].toLowerCase()
    default:           return user[key].toLowerCase()
  }
}

type ColumnDef = {
  key: SortKey
  label: string
  align?: "right"
  /**
   * Columns the user may not hide. First Name is the row's link into the
   * record, so a row without it has no way in.
   */
  locked?: boolean
  render: (user: User) => React.ReactNode
}

const COLUMNS: ColumnDef[] = [
  {
    key: "firstName",
    label: "First Name",
    locked: true,
    // No approved Link component exists in src/components/ui, so this is a
    // native <a> carrying only the semantic link colour token.
    render: (u) => (
      <a
        href={`#/audience/${u.id}`}
        onClick={(e) => e.preventDefault()}
        className="text-[var(--s-color-text-information)] hover:underline"
      >
        {u.firstName}
      </a>
    ),
  },
  { key: "lastName", label: "Last Name", render: (u) => u.lastName },
  { key: "email",    label: "Email",     render: (u) => u.email },
  { key: "company",  label: "Company",   render: (u) => u.company },
  { key: "role",     label: "Role",      render: (u) => u.role },
  {
    key: "status",
    label: "Status",
    render: (u) => (
      <StatusLabel variant={STATUS_VARIANTS[u.status]} editable>
        {STATUS_LABELS[u.status]}
      </StatusLabel>
    ),
  },
  {
    key: "sessions",
    label: "Sessions",
    align: "right",
    render: (u) => u.sessions.toLocaleString(),
  },
  {
    key: "lastSeenAt",
    label: "Last Seen",
    render: (u) => format(parseISO(u.lastSeenAt), "MMM d, yyyy h:mm a"),
  },
  // The five columns below exist to force horizontal overflow at a normal
  // viewport width, so column pinning has something real to scroll past —
  // see the `User` type comment for why their data is derived, not authored.
  { key: "phone",      label: "Phone",      render: (u) => u.phone },
  { key: "department", label: "Department", render: (u) => u.department },
  { key: "country",    label: "Country",    render: (u) => u.country },
  { key: "manager",    label: "Manager",    render: (u) => u.manager },
  { key: "plan",       label: "Plan",       render: (u) => u.plan },
]

const DEFAULT_COLUMN_IDS: string[] = COLUMNS.map((c) => c.key)

const COL_SELECTOR_COLUMNS = COLUMNS.map((c) => ({
  id: c.key,
  label: c.label,
  ...(c.locked ? { disabled: true } : {}),
}))

const DENSITY_OPTIONS: { value: TableDensity; label: string }[] = [
  { value: "compact",     label: "Compact"     },
  { value: "default",     label: "Default"     },
  { value: "comfortable", label: "Comfortable" },
]

const PAGE_SIZE_OPTIONS = [10, 25, 50]

// ---------------------------------------------------------------------------
// PEC sample data
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
// Page
// ---------------------------------------------------------------------------

type UserExplorerProps = {
  activeKey: PxShellNavKey
  onNavigate: (key: PxShellNavKey) => void
  mode: PxShellRailMode
  onModeChange: (mode: PxShellRailMode) => void
}

function UserExplorer({ activeKey, onNavigate, mode, onModeChange }: UserExplorerProps) {
  const [users, setUsers] = React.useState(USERS)
  const [query, setQuery] = React.useState("")
  const [filterBarOpen, setFilterBarOpen] = React.useState(false)
  const [filters, setFilters] = React.useState<ActiveFilter[]>([])
  const [openField, setOpenField] = React.useState<FilterFieldKey | null>(null)
  /** Uncommitted selection for the open panel — discarded on Cancel. */
  const [draft, setDraft] = React.useState<string[]>([])
  const [panelSearch, setPanelSearch] = React.useState("")

  const [sortKey, setSortKey] = React.useState<SortKey | null>(null)
  const [sortDirection, setSortDirection] = React.useState<TableSortDirection>(undefined)
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
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
  const [density, setDensity] = React.useState<TableDensity>("default")

  // Column pinning — first slice: at most one pinned column per side, no
  // persistence, no cumulative offset math (see table.tsx TableColumnPin
  // comment). The checkbox/action columns are never pinned in this slice.
  const [pinnedLeftColumnId, setPinnedLeftColumnId] = React.useState<SortKey | null>(null)
  const [pinnedRightColumnId, setPinnedRightColumnId] = React.useState<SortKey | null>(null)

  // --- filtering / sorting / paging ----------------------------------------

  function updateUserStatus(userId: string, newStatus: UserStatus) {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newStatus } : u))
  }

  const visibleUsers = React.useMemo(
    () => users.filter((u) => matchesQuery(u, query) && matchesFilters(u, filters)),
    [users, query, filters],
  )

  const sortedUsers = React.useMemo(() => {
    if (!sortKey || !sortDirection) return visibleUsers
    const dir = sortDirection === "ascending" ? 1 : -1
    return [...visibleUsers].sort((a, b) => {
      const av = sortValue(a, sortKey)
      const bv = sortValue(b, sortKey)
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
  }, [visibleUsers, sortKey, sortDirection])

  const activeColumns = React.useMemo(() => {
    return columnOrder
      .filter((id) => {
        const col = COLUMNS.find((c) => c.key === id)
        return col && (col.locked || visibleColumnIds.includes(id))
      })
      .map((id) => COLUMNS.find((c) => c.key === id)!)
  }, [visibleColumnIds, columnOrder])

  // checkbox selection col + data cols + row-action col
  const tableColSpan = 1 + activeColumns.length + 1

  // --- column pinning ---------------------------------------------------
  //
  // Interaction assumption (Figma node 3187:9 / component-audit node
  // 1842:38 confirm a single pin-line icon revealed on header-cell hover,
  // but neither documents how a click chooses left vs. right for the
  // reference's "pin either edge" case): a column's pin icon is a single
  // direct toggle. Unpinning always turns the icon off. Pinning decides the
  // side from the column's position among the currently active columns —
  // the first half pins left, the second half pins right — which matches
  // the Figma reference's own arrangement (leading columns pinned left,
  // trailing columns like Status pinned right) without requiring a second
  // affordance or a menu.

  function pinnedSideFor(key: SortKey): TableColumnPin | undefined {
    if (pinnedLeftColumnId === key) return "left"
    if (pinnedRightColumnId === key) return "right"
    return undefined
  }

  function togglePin(key: SortKey) {
    if (pinnedLeftColumnId === key) {
      setPinnedLeftColumnId(null)
      return
    }
    if (pinnedRightColumnId === key) {
      setPinnedRightColumnId(null)
      return
    }
    const index = activeColumns.findIndex((c) => c.key === key)
    const side: TableColumnPin = index < activeColumns.length / 2 ? "left" : "right"
    if (side === "left") setPinnedLeftColumnId(key)
    else setPinnedRightColumnId(key)
  }

  const pageCount = Math.max(1, Math.ceil(sortedUsers.length / pageSize))
  // Guards against a filter change stranding the view past the last page.
  const currentPage = Math.min(page, pageCount)
  const pagedUsers = sortedUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

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

  // --- filter chip editing --------------------------------------------------

  function openPanel(field: FilterFieldKey) {
    setOpenField(field)
    setDraft(filters.find((f) => f.field === field)?.selected ?? [])
    setPanelSearch("")
  }

  function closePanel() {
    setOpenField(null)
    setPanelSearch("")
  }

  function addFilter(field: FilterFieldKey) {
    setFilterBarOpen(true)
    setFilters((prev) => (prev.some((f) => f.field === field) ? prev : [...prev, { field, selected: [] }]))
    openPanel(field)
  }

  function applyDraft() {
    if (!openField) return
    setFilters((prev) =>
      prev.map((f) => (f.field === openField ? { ...f, selected: draft } : f)),
    )
    setPage(1)
    closePanel()
  }

  /** Panel "Clear" removes the criterion entirely — chips have no own remove affordance. */
  function clearOpenFilter() {
    if (!openField) return
    setFilters((prev) => prev.filter((f) => f.field !== openField))
    setPage(1)
    closePanel()
  }

  function clearAllFilters() {
    setFilters([])
    setQuery("")
    setPage(1)
    closePanel()
  }

  const chips: FilterBarChip[] = filters.map((f) => ({
    id: f.field,
    label: FILTER_FIELDS[f.field].label,
    value: filterSummary(f.field, f.selected),
  }))

  const unusedFields = FILTER_FIELD_ORDER.filter((k) => !filters.some((f) => f.field === k))
  const activeFilterCount = filters.filter((f) => f.selected.length > 0).length
  const hasAnyFilter = activeFilterCount > 0 || query.trim().length > 0

  // --- selection ------------------------------------------------------------

  function toggleRow(id: string, checked: boolean) {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const allOnPageSelected = pagedUsers.length > 0 && pagedUsers.every((u) => selectedRows.has(u.id))
  const someOnPageSelected = pagedUsers.some((u) => selectedRows.has(u.id)) && !allOnPageSelected

  function toggleAllOnPage(checked: boolean | "indeterminate") {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (checked === true) pagedUsers.forEach((u) => next.add(u.id))
      else pagedUsers.forEach((u) => next.delete(u.id))
      return next
    })
  }

  const selectedCount = selectedRows.size

  // --- render ---------------------------------------------------------------

  const openPanelOptions = openField
    ? FILTER_FIELDS[openField].options.filter((o) =>
        o.label.toLowerCase().includes(panelSearch.toLowerCase()),
      )
    : []

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
      <section
        className={cn(
          "flex h-full flex-col overflow-hidden",
          "rounded-[var(--p-radius-150)]",
          "border border-[var(--s-color-line-default)]",
          "bg-[var(--s-color-surface-default)]",
          "shadow-[var(--e-shadow-100)]",
        )}
      >
        {/* Title bar ------------------------------------------------------ */}
        <div className="flex shrink-0 items-center gap-4 px-6 py-4">
          <div className="flex flex-1 items-center gap-[var(--p-space-200)]">
            <span className="text-[length:var(--p-font-size-h6)] font-[var(--p-font-weight-medium)] leading-[var(--p-font-line-height-h6)] text-[var(--s-color-text-default)]">
              All Users ({sortedUsers.length.toLocaleString()})
            </span>
            {selectedCount > 0 && (
              <span className="text-[length:var(--p-font-size-small)] leading-[var(--p-font-line-height-small)] text-[var(--s-color-text-subtlest)]">
                {selectedCount} selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-[var(--p-space-300)]">
            <div className="w-[260px]">
              <SearchBar
                size="small"
                placeholder="Search users"
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
            </div>

            <IconButton
              icon="filter"
              label={filterBarOpen ? "Hide filters" : "Show filters"}
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
                  onReset={() => {/* ColumnSelector resets its own draft; committed on Save */}}
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
                <DropdownMenuItem icon="export-document">Export CSV</DropdownMenuItem>
                <DropdownMenuItem icon="refresh">Refresh</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Row density</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {DENSITY_OPTIONS.map((opt) => (
                      <DropdownMenuItem
                        key={opt.value}
                        icon={density === opt.value ? "check" : undefined}
                        onSelect={() => setDensity(opt.value)}
                      >
                        {opt.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="primary" size="large">
              Add User
            </Button>
          </div>
        </div>

        {/* Filter Bar + its dropdown panel -------------------------------- */}
        {filterBarOpen && (
          <Popover
            open={openField !== null}
            onOpenChange={(open) => {
              if (!open) closePanel()
            }}
          >
            <PopoverAnchor asChild>
              <div className="shrink-0 border-t border-[var(--s-color-line-default)]">
                <FilterBar
                  chips={chips}
                  openChipId={openField ?? undefined}
                  onChipClick={(id) => {
                    if (openField === id) closePanel()
                    else openPanel(id as FilterFieldKey)
                  }}
                  onAddFilter={
                    unusedFields.length > 0 ? () => addFilter(unusedFields[0]) : undefined
                  }
                  onModifyFilter={() => {
                    // Re-opens the first criterion for editing; further ones
                    // are reachable by clicking their own chip.
                    if (filters[0]) openPanel(filters[0].field)
                  }}
                />
              </div>
            </PopoverAnchor>

            {openField && (
              <PopoverContent align="start" sideOffset={4} className="w-[320px]">
                <FilterDropdownPanel
                  type="multi-picklist"
                  options={openPanelOptions}
                  totalCount={FILTER_FIELDS[openField].options.length}
                  selected={draft}
                  onSelectedChange={setDraft}
                  searchValue={panelSearch}
                  onSearchChange={setPanelSearch}
                  onClear={clearOpenFilter}
                  onCancel={closePanel}
                  onApply={applyDraft}
                />
              </PopoverContent>
            )}
          </Popover>
        )}

        {/* Add-criterion menu. Only once at least one chip exists — before
            that, FilterBar's own empty state carries the "Add filter" CTA. */}
        {filterBarOpen && filters.length > 0 && unusedFields.length > 0 && (
          <div className="flex shrink-0 items-center border-t border-[var(--s-color-line-default)] px-6 py-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="tertiary" size="small">
                  Add criterion
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                {unusedFields.map((key) => (
                  <DropdownMenuItem key={key} onSelect={() => addFilter(key)}>
                    {FILTER_FIELDS[key].label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Table ----------------------------------------------------------- */}
        <Table density={density} containerClassName="min-h-0 flex-1">
          <TableHeader>
            <TableRow>
              <TableSelectionHead>
                <Checkbox
                  aria-label="Select all users on this page"
                  checked={allOnPageSelected ? true : someOnPageSelected ? "indeterminate" : false}
                  onCheckedChange={toggleAllOnPage}
                />
              </TableSelectionHead>

              {activeColumns.map((col) => {
                const pinSide = pinnedSideFor(col.key)
                const isPinned = pinSide !== undefined
                return (
                  <TableHead
                    key={col.key}
                    sortable
                    sortDirection={sortKey === col.key ? sortDirection : undefined}
                    pinned={pinSide}
                  >
                    <div className="group/pin flex items-center justify-between gap-[var(--p-space-100)]">
                      <TableSortHeader
                        direction={sortKey === col.key ? sortDirection : undefined}
                        onClick={() => cycleSort(col.key)}
                      >
                        {col.label}
                      </TableSortHeader>
                      <div
                        className={cn(
                          "transition-opacity",
                          isPinned
                            ? "opacity-100"
                            : "opacity-0 group-hover/pin:opacity-100 group-focus-within/pin:opacity-100",
                        )}
                      >
                        <IconButton
                          icon={isPinned ? "pin-filled" : "pin-line"}
                          label={isPinned ? `Unpin ${col.label}` : `Pin ${col.label}`}
                          onClick={() => togglePin(col.key)}
                        />
                      </div>
                    </div>
                  </TableHead>
                )
              })}

              <TableActionHead />
            </TableRow>
          </TableHeader>

          {pagedUsers.length > 0 ? (
            <TableBody>
              {pagedUsers.map((user) => {
                const isSelected = selectedRows.has(user.id)
                return (
                  <TableRow key={user.id} selected={isSelected}>
                    <TableSelectionCell>
                      <Checkbox
                        aria-label={`Select ${user.firstName} ${user.lastName}`}
                        checked={isSelected}
                        onCheckedChange={(v) => toggleRow(user.id, v === true)}
                      />
                    </TableSelectionCell>

                    {activeColumns.map((col) => (
                      <TableCell key={col.key} align={col.align} pinned={pinnedSideFor(col.key)}>
                        {col.key === "status" ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <StatusLabel variant={STATUS_VARIANTS[user.status]} editable>
                                {STATUS_LABELS[user.status]}
                              </StatusLabel>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              {STATUS_OPTIONS.map((opt) => (
                                <DropdownMenuItem
                                  key={opt.status}
                                  onSelect={() => updateUserStatus(user.id, opt.status)}
                                >
                                  <StatusLabel variant={STATUS_VARIANTS[opt.status]}>
                                    {opt.label}
                                  </StatusLabel>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          col.render(user)
                        )}
                      </TableCell>
                    ))}

                    <TableActionCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <IconButton
                            icon="more-vertical"
                            label={`Actions for ${user.firstName} ${user.lastName}`}
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem icon="id-card">View profile</DropdownMenuItem>
                          <DropdownMenuItem icon="email">Send email</DropdownMenuItem>
                          <DropdownMenuItem icon="copy">Copy user ID</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem icon="delete" destructive>
                            Remove user
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableActionCell>
                  </TableRow>
                )
              })}
            </TableBody>
          ) : (
            <TableEmptyState
              colSpan={tableColSpan}
              title="No users match your filters"
              body={
                hasAnyFilter
                  ? "Try removing a criterion or broadening your search to see more users."
                  : "There are no users in this environment yet."
              }
              primaryAction={
                hasAnyFilter ? (
                  <Button variant="secondary" size="large" onClick={clearAllFilters}>
                    Clear all filters
                  </Button>
                ) : undefined
              }
            />
          )}
        </Table>

        {/* Pagination ------------------------------------------------------ */}
        <div className="shrink-0">
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            pageSize={pageSize}
            totalItems={sortedUsers.length}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
          />
        </div>
      </section>
    </PxListShell>
  )
}

export { UserExplorer }
