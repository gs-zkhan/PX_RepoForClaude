/**
 * ValidationGallery — Temporary gallery for visual verification of new components.
 * Do NOT wire into App.tsx or production routes.
 * Do NOT ship to production.
 */

import * as React from "react"
import { SearchBar } from "@/components/ui/search-bar"
import { FilterChip } from "@/components/ui/filter-chip"
import { Chip } from "@/components/ui/chip"
import { FilterBar, type FilterBarChip } from "@/components/ui/filter-bar"
import { FilterDropdownPanel, type NumberOperator } from "@/components/ui/filter-dropdown-panel"
import { DateFilter, type DateFilterValue } from "@/components/ui/date-filter"
import { Spinner } from "@/components/ui/spinner"
import { ProgressBar } from "@/components/ui/progress-bar"
import { Skeleton } from "@/components/ui/skeleton"
import { Banner } from "@/components/ui/banner"
import { EmptyState } from "@/components/ui/empty-state"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ThirdPane } from "@/components/ui/third-pane"
import { ToastProvider, ToastViewport, Toast } from "@/components/ui/toast"
import type { ToastVariant } from "@/components/ui/toast"
import { Modal, ModalFooter, ModalConfirmation } from "@/components/ui/modal"
import { Tree, TreeItem } from "@/components/ui/tree"
import { Views } from "@/components/ui/views"
import { ViewSelector } from "@/components/ui/view-selector"
import { ViewSwitcher } from "@/components/ui/view-switcher"
import { Toggle } from "@/components/ui/toggle"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { SummaryStat, StatsRow } from "@/components/ui/summary-stat"
import { CanvasCard } from "@/components/ui/canvas-card"
import { Card } from "@/components/ui/card"
import { ConfigRow } from "@/components/ui/config-row"
import { Wizard, type WizardStep } from "@/components/ui/wizard"
import { InputNumber } from "@/components/ui/input-number"
import { Accordion, AccordionItem } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { ColumnSelector, type ColumnSelectorView } from "@/components/ui/column-selector"
import { FileUploader, FileUploaderRow } from "@/components/ui/file-uploader"
import { MetricBar } from "@/components/ui/metric-bar"
import { SegmentedBar } from "@/components/ui/segmented-bar"
import { BarChart } from "@/components/ui/bar-chart"
import { LineChart } from "@/components/ui/line-chart"
import { DonutChart } from "@/components/ui/donut-chart"
import { GaugeChart } from "@/components/ui/gauge-chart"
import { Heatmap } from "@/components/ui/heatmap"
import { WorldMap } from "@/components/ui/world-map"
import noDataFoundIllustration from "@/assets/illustrations/no-data-found.svg?raw"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { SplitButton } from "@/components/ui/split-button"
import { Link } from "@/components/ui/link"
import { Divider } from "@/components/ui/divider"
import { IconButton } from "@/components/ui/icon-button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TextField } from "@/components/ui/text-field"
import {
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select"
import { DropdownField } from "@/components/ui/dropdown-field"
import { DateField } from "@/components/ui/date-field"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { StatusLabel } from "@/components/ui/status-label"
import { StatusSelect, type StatusSelectOption } from "@/components/ui/status-select"
import { Letter } from "@/components/ui/letter"
import {
  FilterConfigModal,
  type FilterCriterion,
  type FilterOption,
} from "@/components/ui/filter-config-modal"
import { Pagination } from "@/components/ui/pagination"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableSortHeader,
  TableSelectionHead,
  TableSelectionCell,
  TableActionHead,
  TableActionCell,
  TableEmptyState,
} from "@/components/ui/table"
import { PrismIcon } from "@/components/ui/prism-icon"
import { PxShellRail } from "@/components/px-shell-rail"
import type { PxShellRailMode } from "@/components/px-shell-rail"
import type { PxShellNavKey } from "@/components/px-shell-rail"
import { PxHeader } from "@/patterns/px-list-shell/PxHeader"
import { PECDropdown, type PECOption } from "@/components/px-pec-dropdown"
import { PxFilterSlider } from "@/patterns/px-list-shell/PxFilterSlider"
import { PxCreateEditShellModal } from "@/patterns/px-create-edit-shell"
import { Textarea } from "@/components/ui/textarea"
import { CreateEditShellExample } from "@/pages/create-edit-shell-example"
import { PxAnalyticsSecondaryNav } from "@/patterns/px-analytics-secondary-nav"
import { AnalyticsExample, ANALYTICS_SECTIONS } from "@/pages/analytics-example"

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-[var(--s-color-text-default)] border-b border-[var(--s-color-line-default)] pb-2">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-xs text-[var(--s-color-text-subtle)]">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PEC Dropdown demo data
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

const PICKLIST_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "trial", label: "In Trial" },
  { value: "onboarding", label: "Onboarding" },
  { value: "at-risk", label: "At Risk" },
  { value: "churned", label: "Churned" },
  { value: "paused", label: "Paused" },
  { value: "prospect", label: "Prospect" },
  { value: "renewal-due", label: "Renewal due" },
  { value: "expansion", label: "Expansion" },
  { value: "vip", label: "VIP" },
]

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

// Mirrors the five statuses in Figma's Status Chip dropdown (node 4084:37903),
// including its fuller wording — the menu reads "Work in progress", not the
// chip's shorter "In Progress".
const STATUS_OPTIONS: StatusSelectOption[] = [
  { value: "open", variant: "open", label: "Open" },
  { value: "in-progress", variant: "in-progress", label: "Work in progress" },
  { value: "waiting", variant: "waiting", label: "Waiting" },
  { value: "completed", variant: "completed", label: "Completed" },
  { value: "failed", variant: "failed", label: "Failed" },
]

const FILTER_FIELD_OPTIONS: FilterOption[] = [
  { value: "is-closed", label: "Is Closed" },
  { value: "owner", label: "Owner" },
  { value: "renewal-date", label: "Renewal Date" },
  { value: "stage", label: "Stage" },
]

const FILTER_OPERATOR_OPTIONS: FilterOption[] = [
  { value: "equals", label: "equals to" },
  { value: "not-equals", label: "not equal to" },
  { value: "contains", label: "contains" },
]

const FILTER_VALUE_OPTIONS: FilterOption[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
]

function ValidationGallery() {
  const [searchValue, setSearchValue] = React.useState("")
  const [searchValueFilled, setSearchValueFilled] = React.useState("Query text")
  const [checkedA, setCheckedA] = React.useState<boolean | "indeterminate">(true)
  const [checkedB, setCheckedB] = React.useState<boolean | "indeterminate">("indeterminate")
  const [radioValue, setRadioValue] = React.useState("open")
  const [textValue, setTextValue] = React.useState("")
  const [textFilled, setTextFilled] = React.useState("Acme Corp")
  const [selectValue, setSelectValue] = React.useState("active")
  const [dateValue, setDateValue] = React.useState<Date | undefined>(undefined)
  const [dateFilled, setDateFilled] = React.useState<Date | undefined>(new Date())
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [navKey, setNavKey] = React.useState<PxShellNavKey>("audience")
  const [navMode, setNavMode] = React.useState<PxShellRailMode>("collapsed")
  const [createEditNavKey, setCreateEditNavKey] = React.useState<PxShellNavKey>("engagements")
  const [createEditNavMode, setCreateEditNavMode] = React.useState<PxShellRailMode>("collapsed")
  const [createEditModalOpen, setCreateEditModalOpen] = React.useState(false)
  const [analyticsNavKey, setAnalyticsNavKey] = React.useState<PxShellNavKey>("analytics")
  const [analyticsNavMode, setAnalyticsNavMode] = React.useState<PxShellRailMode>("collapsed")
  const [analyticsActiveItemId, setAnalyticsActiveItemId] = React.useState("retention-analysis")
  const [analyticsOpenSectionIds, setAnalyticsOpenSectionIds] = React.useState(
    ANALYTICS_SECTIONS.map((s) => s.id),
  )
  const [analyticsCollapsed, setAnalyticsCollapsed] = React.useState(false)
  const [pec, setPec] = React.useState({ product: "px", environment: "production", channels: ["web-app"] })
  const [filterTab, setFilterTab] = React.useState<"filter" | "global-context">("filter")
  const [filterBarOpenChip, setFilterBarOpenChip] = React.useState<string | undefined>(undefined)
  const [fdpOpen, setFdpOpen] = React.useState<
    "search" | "value" | "date" | "number" | "picklist" | "multi" | null
  >(null)
  const [fdpSearch, setFdpSearch] = React.useState("")
  const [fdpValue, setFdpValue] = React.useState("")
  const [fdpDate, setFdpDate] = React.useState<Date | undefined>(undefined)
  const [fdpNumberOp, setFdpNumberOp] = React.useState<NumberOperator>("equal")
  const [fdpNumber, setFdpNumber] = React.useState("")
  const [fdpPicklistValue, setFdpPicklistValue] = React.useState("")
  const [fdpPicklistSearch, setFdpPicklistSearch] = React.useState("")
  const [fdpMultiSelected, setFdpMultiSelected] = React.useState<string[]>([])
  const [fdpMultiSearch, setFdpMultiSearch] = React.useState("")
  const [dateFilterValue, setDateFilterValue] = React.useState<DateFilterValue | null>(null)
  const [statusValue, setStatusValue] = React.useState("open")
  const [filterModalOpen, setFilterModalOpen] = React.useState(false)
  const [filterLogic, setFilterLogic] = React.useState("A")
  const [filterCriteria, setFilterCriteria] = React.useState<FilterCriterion[]>([
    { id: "criterion-1", field: "is-closed", operator: "equals", value: "yes" },
  ])
  const [thirdPaneVariant, setThirdPaneVariant] = React.useState<{
    size: "small" | "medium" | "large" | "xlarge"
    back: boolean
  } | null>(null)
  const [toastVariant, setToastVariant] = React.useState<ToastVariant>("success")
  const [toastAction, setToastAction] = React.useState<"close" | "undo" | "cta">("close")
  const [toastOpen, setToastOpen] = React.useState(false)
  const [modalVariant, setModalVariant] = React.useState<{
    size: "small" | "medium" | "large"
    microcopy: boolean
  } | null>(null)
  const [modalConfirmOpen, setModalConfirmOpen] = React.useState(false)
  const [modalConfirmDangerOpen, setModalConfirmDangerOpen] = React.useState(false)
  const [treeExpanded, setTreeExpanded] = React.useState(true)
  const [treeChild2Expanded, setTreeChild2Expanded] = React.useState(true)
  const [treeMultiExpanded, setTreeMultiExpanded] = React.useState(true)
  const [treeSelected, setTreeSelected] = React.useState("child-2")
  const [treeChecked, setTreeChecked] = React.useState<Record<string, boolean>>({
    "parent": true,
    "child-1": true,
    "child-2": false,
  })
  const [viewsOpen, setViewsOpen] = React.useState(false)
  const [viewSelectorOpen, setViewSelectorOpen] = React.useState(false)
  const [viewSwitcherValue, setViewSwitcherValue] = React.useState("table")
  const [toggleOn, setToggleOn] = React.useState(true)
  const [summaryStatSelected, setSummaryStatSelected] = React.useState<"all" | "healthy" | "warning">("all")
  const [inputNumberValue, setInputNumberValue] = React.useState(5)
  const [inputNumberPrice, setInputNumberPrice] = React.useState(19.99)
  const [sliderValue, setSliderValue] = React.useState<number[]>([40])
  const [sliderRange, setSliderRange] = React.useState<number[]>([25, 75])
  const [columnSelectorView, setColumnSelectorView] = React.useState<ColumnSelectorView>("selection")
  const [columnSelectorSelected, setColumnSelectorSelected] = React.useState<string[]>([
    "name",
    "email",
    "company",
    "title",
  ])
  const [columnSelectorOrder, setColumnSelectorOrder] = React.useState<string[]>([
    "name",
    "email",
    "company",
    "title",
    "status",
    "created",
    "updated",
  ])
  const columnSelectorColumns = React.useMemo(
    () => [
      { id: "name", label: "User name", disabled: true },
      { id: "email", label: "Email" },
      { id: "company", label: "Company" },
      { id: "title", label: "Title" },
      { id: "status", label: "Status" },
      { id: "created", label: "Created" },
      { id: "updated", label: "Last updated" },
    ],
    [],
  )

  const FILTER_BAR_CHIPS: FilterBarChip[] = [
    { id: "account", label: "Account", value: "All" },
    { id: "user", label: "User", value: "All" },
    { id: "date", label: "Date", value: "Any" },
    { id: "product", label: "Product", value: "All" },
    { id: "region", label: "Region", value: "Europe" },
    { id: "state", label: "State", value: "All" },
    { id: "category", label: "Category", value: "Value" },
    { id: "channel", label: "Channel" },
  ]

  return (
    <TooltipProvider>
      <div className="p-8 space-y-12 max-w-6xl bg-[var(--s-color-surface-default)]">
        <h1 className="text-xl font-semibold text-[var(--s-color-text-default)]">
          Component Validation Gallery
        </h1>

        {/* ------------------------------------------------------------------ */}
        {/* Button                                                               */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Button">
          <Row label="primary">
            <Button variant="primary" size="large">Save changes</Button>
            <Button variant="primary" size="medium">Save changes</Button>
            <Button variant="primary" size="small">Save</Button>
          </Row>
          <Row label="secondary">
            <Button variant="secondary" size="large">Cancel</Button>
            <Button variant="secondary" size="medium">Cancel</Button>
            <Button variant="secondary" size="small">Cancel</Button>
          </Row>
          <Row label="tertiary">
            <Button variant="tertiary" size="large">Learn more</Button>
            <Button variant="tertiary" size="medium">Learn more</Button>
          </Row>
          <Row label="destructive">
            <Button variant="destructive" size="large">Delete record</Button>
            <Button variant="destructive" size="medium">Delete</Button>
          </Row>
          <Row label="disabled">
            <Button variant="primary" disabled>Save changes</Button>
            <Button variant="secondary" disabled>Cancel</Button>
          </Row>
          <Row label="bulk action (Visual Review: Approved — Approved for AI use: Yes (2026-08-29))">
            <Button variant="bulkAction" size="large">Bulk</Button>
            <Button variant="bulkAction" size="medium">Bulk</Button>
            <Button variant="bulkAction" size="small">Bulk</Button>
            <Button variant="bulkAction" size="large" disabled>Bulk</Button>
          </Row>
          <Row label="split (Visual Review: Approved — Approved for AI use: Yes (2026-08-29))">
            <SplitButton
              size="large"
              onAction={() => console.log("split primary action")}
              menuLabel="More save options"
              menuContent={
                <>
                  <DropdownMenuItem>Save as draft</DropdownMenuItem>
                  <DropdownMenuItem>Save and duplicate</DropdownMenuItem>
                </>
              }
            >
              Save
            </SplitButton>
            <SplitButton
              size="medium"
              onAction={() => console.log("split primary action")}
              menuLabel="More save options"
              menuContent={
                <>
                  <DropdownMenuItem>Save as draft</DropdownMenuItem>
                  <DropdownMenuItem>Save and duplicate</DropdownMenuItem>
                </>
              }
            >
              Save
            </SplitButton>
            <SplitButton
              size="large"
              disabled
              onAction={() => console.log("split primary action")}
              menuLabel="More save options"
              menuContent={<DropdownMenuItem>Save as draft</DropdownMenuItem>}
            >
              Save
            </SplitButton>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Link                                                                 */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Link (Visual Review: Approved — Approved for AI use: Yes (2026-08-29))">
          <Row label="default / small">
            <Link href="#">Default link</Link>
            <Link href="#" size="small">Small link</Link>
          </Row>
          <Row label="with icon / external">
            <Link href="#" icon>View invoice</Link>
            <Link href="#" external aria-label="Read the guide (opens in a new tab)">
              Read the guide
            </Link>
            <Link href="#" icon external aria-label="View source (opens in a new tab)">
              View source
            </Link>
          </Row>
          <Row label="disabled">
            <Link disabled title="Unavailable until the invoice is finalized">
              Download invoice
            </Link>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Divider                                                              */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Divider (Visual Review: Approved — Approved for AI use: Yes (2026-08-29))">
          <Row label="horizontal — 1px / 2px">
            <div className="flex w-[320px] flex-col gap-4">
              <Divider />
              <Divider weight={2} />
            </div>
          </Row>
          <Row label="vertical — 1px / 2px">
            <div className="flex h-12 items-stretch gap-4">
              <span className="text-sm text-[var(--s-color-text-default)]">Left</span>
              <Divider orientation="vertical" />
              <span className="text-sm text-[var(--s-color-text-default)]">Middle</span>
              <Divider orientation="vertical" weight={2} />
              <span className="text-sm text-[var(--s-color-text-default)]">Right</span>
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Card                                                                 */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Card (Visual Review: Approved 2026-08-30 — Approved for AI use: Yes) — 8/8 legal Figma variants">
          <Row label="1. large / default / with tags — 7623:3891">
            <div className="w-[420px]">
              <Card
                size="large"
                icon={
                  <span className="flex size-10 items-center justify-center rounded-[var(--p-radius-100)] bg-[var(--s-color-surface-selected)]">
                    <PrismIcon name="feature-px" size={24} decorative />
                  </span>
                }
                title="Card Title"
                description="Card description text"
                tags={
                  <>
                    <Chip color="gray">Getting Started</Chip>
                    <Chip color="gray">Recommended</Chip>
                    <Chip color="gray">Learn</Chip>
                  </>
                }
                onSelect={() => console.log("card selected")}
              />
            </div>
          </Row>
          <Row label="2. large / selected / with tags — 7623:3906">
            <div className="w-[420px]">
              <Card
                size="large"
                state="selected"
                icon={
                  <span className="flex size-10 items-center justify-center rounded-[var(--p-radius-100)] bg-[var(--s-color-surface-selected)]">
                    <PrismIcon name="feature-px" size={24} decorative />
                  </span>
                }
                title="Card Title"
                description="Card description text"
                tags={
                  <>
                    <Chip color="gray">Getting Started</Chip>
                    <Chip color="gray">Recommended</Chip>
                    <Chip color="gray">Learn</Chip>
                  </>
                }
                onSelect={() => console.log("card selected")}
              />
            </div>
          </Row>
          <Row label="3. large / default / without tags — 7623:3921">
            <div className="w-[420px]">
              <Card
                size="large"
                icon={
                  <span className="flex size-10 items-center justify-center rounded-[var(--p-radius-100)] bg-[var(--s-color-surface-selected)]">
                    <PrismIcon name="feature-px" size={24} decorative />
                  </span>
                }
                title="Card Title"
                description="Card description text"
                onSelect={() => console.log("card selected")}
              />
            </div>
          </Row>
          <Row label="4. large / selected / without tags — 7623:3929">
            <div className="w-[420px]">
              <Card
                size="large"
                state="selected"
                icon={
                  <span className="flex size-10 items-center justify-center rounded-[var(--p-radius-100)] bg-[var(--s-color-surface-selected)]">
                    <PrismIcon name="feature-px" size={24} decorative />
                  </span>
                }
                title="Card Title"
                description="Card description text"
                onSelect={() => console.log("card selected")}
              />
            </div>
          </Row>
          <Row label="5. small / default — 7614:231">
            <div className="w-[420px]">
              <Card
                size="small"
                icon={
                  <span className="flex size-8 items-center justify-center rounded-[var(--p-radius-100)] bg-[var(--s-color-surface-selected)]">
                    <PrismIcon name="feature-px" size={16} sourceSize={24} decorative />
                  </span>
                }
                title="Card Title"
                description="Card description text"
                reorderHandle={<PrismIcon name="drag-and-drop" size={16} decorative />}
                trailing={
                  <>
                    <Chip color="yellow">Setup Pending</Chip>
                    <IconButton icon="delete" label="Delete" />
                    <PrismIcon name="chevron-right" size={16} decorative />
                  </>
                }
                onSelect={() => console.log("card selected")}
              />
            </div>
          </Row>
          <Row label="6. small / selected — 7614:284">
            <div className="w-[420px]">
              <Card
                size="small"
                state="selected"
                icon={
                  <span className="flex size-8 items-center justify-center rounded-[var(--p-radius-100)] bg-[var(--s-color-surface-selected)]">
                    <PrismIcon name="feature-px" size={16} sourceSize={24} decorative />
                  </span>
                }
                title="Card Title"
                description="Card description text"
                trailing={
                  <>
                    <Chip color="yellow">Setup Pending</Chip>
                    <IconButton icon="delete" label="Delete" />
                    <PrismIcon name="chevron-right" size={16} decorative />
                  </>
                }
                onSelect={() => console.log("card selected")}
              />
            </div>
          </Row>
          <Row label="7. small / compact, mapped from Figma SelectedMin — 7621:3622">
            <div className="w-[420px]">
              <Card
                size="small"
                state="compact"
                icon={
                  <span className="flex size-8 items-center justify-center rounded-[var(--p-radius-100)] bg-[var(--s-color-surface-selected)]">
                    <PrismIcon name="feature-px" size={16} sourceSize={24} decorative />
                  </span>
                }
                title="Card Title"
                reorderHandle={<PrismIcon name="drag-and-drop" size={16} decorative />}
                trailing={
                  <>
                    <Chip color="yellow">Setup Pending</Chip>
                    <IconButton icon="delete" label="Delete" />
                    <PrismIcon name="chevron-right" size={16} decorative />
                  </>
                }
                onSelect={() => console.log("card selected")}
              />
            </div>
          </Row>
          <Row label="8. small / empty — 7620:315">
            <div className="w-[420px]">
              <Card
                size="small"
                state="empty"
                icon={
                  <span className="flex size-8 items-center justify-center rounded-[var(--p-radius-100)] bg-[var(--s-color-surface-muted)]">
                    <PrismIcon name="feature-px" size={16} sourceSize={24} decorative />
                  </span>
                }
                title="Card Title"
                description="Card description text"
                trailing={<Link href="#">Add</Link>}
              />
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Icon Button                                                          */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Icon Button">
          <Row label="default">
            <IconButton icon="edit" label="Edit" />
            <IconButton icon="delete" label="Delete" />
            <IconButton icon="calendar" label="Open calendar" />
          </Row>
          <Row label="disabled">
            <IconButton icon="edit" label="Edit" disabled />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Checkbox                                                             */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Checkbox">
          <Row label="unchecked / checked">
            <Checkbox checked={checkedA} onCheckedChange={setCheckedA} />
            <Checkbox checked={false} />
          </Row>
          <Row label="indeterminate">
            <Checkbox checked={checkedB} onCheckedChange={setCheckedB} />
          </Row>
          <Row label="disabled">
            <Checkbox disabled />
            <Checkbox checked disabled />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Radio Group                                                          */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Radio Group">
          <Row label="default">
            <RadioGroup value={radioValue} onValueChange={setRadioValue} className="flex flex-row gap-4">
              <label className="flex items-center gap-2 text-sm text-[var(--s-color-text-default)]">
                <RadioGroupItem value="open" /> Open
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--s-color-text-default)]">
                <RadioGroupItem value="closed" /> Closed
              </label>
            </RadioGroup>
          </Row>
          <Row label="disabled">
            <RadioGroup value="open" className="flex flex-row gap-4">
              <label className="flex items-center gap-2 text-sm text-[var(--s-color-text-disabled)]">
                <RadioGroupItem value="open" disabled /> Open
              </label>
            </RadioGroup>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Text Field                                                           */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Text Field">
          <Row label="default (label on, no info icon, no helper)">
            <TextField
              label="Account name"
              placeholder="Enter a value"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              className="w-[240px]"
            />
          </Row>
          <Row label="filled">
            <TextField
              label="Account name"
              value={textFilled}
              onChange={(e) => setTextFilled(e.target.value)}
              className="w-[240px]"
            />
          </Row>
          <Row label="required">
            <TextField
              label="Account name"
              required
              placeholder="Enter a value"
              className="w-[240px]"
            />
          </Row>
          <Row label="info icon">
            <TextField
              label="API key"
              infoIcon
              infoTooltip="Found in Settings → Integrations."
              placeholder="Enter a value"
              className="w-[240px]"
            />
          </Row>
          <Row label="helper text (hint)">
            <TextField
              label="Account name"
              helperText="Visible to other users on your team."
              helperVisible
              placeholder="Enter a value"
              className="w-[240px]"
            />
          </Row>
          <Row label="error">
            <TextField
              label="Email"
              state="error"
              helperText="Enter a valid email address."
              defaultValue="invalid@"
              className="w-[240px]"
            />
          </Row>
          <Row label="success">
            <TextField
              label="Email"
              state="success"
              helperText="Looks good."
              defaultValue="valid@gainsight.com"
              className="w-[240px]"
            />
          </Row>
          <Row label="disabled">
            <TextField label="Account name" disabled placeholder="Disabled" className="w-[240px]" />
          </Row>
          <Row label="label off (aria-label only)">
            <TextField label="Search term" labelVisible={false} placeholder="No visible label" className="w-[240px]" />
          </Row>
          <Row label="small (table cell / inline edit)">
            <TextField label="Row value" labelVisible={false} size="small" defaultValue="Inline edit" className="w-[160px]" />
          </Row>
          <Row label="inline (blends into container)">
            <TextField label="Row value" inline defaultValue="Inline, no border" className="w-[200px]" />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Select / Dropdown                                                    */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Select / Dropdown">
          <Row label="default (label on, no info icon, no helper)">
            <DropdownField label="Status" value={selectValue} onValueChange={setSelectValue} className="w-[200px]">
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="active" showIndicator>Active</SelectItem>
                <SelectItem value="inactive" showIndicator>Inactive</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectItem value="draft" showIndicator>Draft</SelectItem>
            </DropdownField>
          </Row>
          <Row label="placeholder">
            <DropdownField label="Status" placeholder="Select an option" className="w-[200px]">
              <SelectItem value="one">Option one</SelectItem>
              <SelectItem value="two">Option two</SelectItem>
            </DropdownField>
          </Row>
          <Row label="required">
            <DropdownField label="Status" required placeholder="Select an option" className="w-[200px]">
              <SelectItem value="one">Option one</SelectItem>
            </DropdownField>
          </Row>
          <Row label="info icon">
            <DropdownField
              label="Channel"
              infoIcon
              infoTooltip="Determines where this engagement is delivered."
              placeholder="Select a channel"
              className="w-[200px]"
            >
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
            </DropdownField>
          </Row>
          <Row label="helper text (hint)">
            <DropdownField
              label="Status"
              helperText="Choose the current lifecycle state."
              helperVisible
              placeholder="Select an option"
              className="w-[200px]"
            >
              <SelectItem value="one">Option one</SelectItem>
            </DropdownField>
          </Row>
          <Row label="error">
            <DropdownField
              label="Status"
              state="error"
              helperText="This field is required."
              placeholder="Select an option"
              className="w-[200px]"
            >
              <SelectItem value="one">Option one</SelectItem>
            </DropdownField>
          </Row>
          <Row label="success">
            <DropdownField
              label="Status"
              state="success"
              helperText="Looks good."
              defaultValue="active"
              className="w-[200px]"
            >
              <SelectItem value="active" showIndicator>Active</SelectItem>
            </DropdownField>
          </Row>
          <Row label="disabled">
            <DropdownField label="Status" disabled placeholder="Disabled" className="w-[200px]">
              <SelectItem value="one">Option one</SelectItem>
            </DropdownField>
          </Row>
          <Row label="label off (aria-label only)">
            <DropdownField label="Status" labelVisible={false} placeholder="No visible label" className="w-[200px]">
              <SelectItem value="one">Option one</SelectItem>
            </DropdownField>
          </Row>
          <Row label="small (compact toolbar / side-panel filter)">
            <DropdownField label="Status" size="small" placeholder="Select an option" className="w-[160px]">
              <SelectItem value="one">Option one</SelectItem>
            </DropdownField>
          </Row>
          <Row label="inline (blends into container)">
            <DropdownField label="Row value" inline defaultValue="one" className="w-[200px]">
              <SelectItem value="one">Option one</SelectItem>
            </DropdownField>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Date Picker                                                          */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Date Picker">
          <Row label="default (label on, no info icon, no helper)">
            <DateField label="Start date" value={dateValue} onChange={setDateValue} className="w-[240px]" />
          </Row>
          <Row label="filled">
            <DateField label="Start date" value={dateFilled} onChange={setDateFilled} className="w-[240px]" />
          </Row>
          <Row label="required">
            <DateField label="Start date" required className="w-[240px]" />
          </Row>
          <Row label="info icon">
            <DateField
              label="Renewal date"
              infoIcon
              infoTooltip="The date this contract term ends."
              className="w-[240px]"
            />
          </Row>
          <Row label="helper text (hint)">
            <DateField
              label="Start date"
              helperText="Defaults to today if left blank."
              helperVisible
              className="w-[240px]"
            />
          </Row>
          <Row label="error">
            <DateField
              label="Start date"
              state="error"
              helperText="Start date is required."
              className="w-[240px]"
            />
          </Row>
          <Row label="success">
            <DateField
              label="Start date"
              state="success"
              helperText="Looks good."
              value={dateFilled}
              className="w-[240px]"
            />
          </Row>
          <Row label="disabled">
            <DateField label="Start date" disabled placeholder="Select a date" className="w-[240px]" />
          </Row>
          <Row label="label off (aria-label only)">
            <DateField label="Filter date" labelVisible={false} className="w-[240px]" />
          </Row>
          <Row label="small (compact/inline contexts)">
            <DateField label="Row value" size="small" className="w-[200px]" />
          </Row>
          <Row label="inline (blends into container)">
            <DateField label="Row value" inline value={dateFilled} className="w-[200px]" />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Popover                                                              */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Popover">
          <Row label="default">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="medium">Open popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 text-sm text-[var(--s-color-text-default)]">
                Popover content goes here.
              </PopoverContent>
            </Popover>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* PEC Dropdown                                                         */}
        {/* ------------------------------------------------------------------ */}
        <Section title="PEC Dropdown">
          <Row label="live — click to open, search/select each column, Apply or Cancel">
            <PECDropdown
              productOptions={PEC_PRODUCT_OPTIONS}
              environmentOptions={PEC_ENVIRONMENT_OPTIONS}
              channelOptions={PEC_CHANNEL_OPTIONS}
              product={pec.product}
              environment={pec.environment}
              channels={pec.channels}
              onApply={setPec}
            />
          </Row>
          <Row label="disabled">
            <PECDropdown
              productOptions={PEC_PRODUCT_OPTIONS}
              environmentOptions={PEC_ENVIRONMENT_OPTIONS}
              channelOptions={PEC_CHANNEL_OPTIONS}
              product={pec.product}
              environment={pec.environment}
              channels={pec.channels}
              onApply={setPec}
              disabled
            />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Status Label                                                         */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Status Label">
          <Row label="regular">
            <StatusLabel variant="open">Open</StatusLabel>
            <StatusLabel variant="in-progress">In Progress</StatusLabel>
            <StatusLabel variant="waiting">Waiting</StatusLabel>
            <StatusLabel variant="completed">Completed</StatusLabel>
            <StatusLabel variant="failed">Failed</StatusLabel>
          </Row>
          <Row label="chip-style (non-workflow)">
            <StatusLabel variant="active">Active</StatusLabel>
            <StatusLabel variant="inactive">Inactive</StatusLabel>
          </Row>
          <Row label="small">
            <StatusLabel variant="completed" size="small">Completed</StatusLabel>
            <StatusLabel variant="failed" size="small">Failed</StatusLabel>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Status Select (chip + dropdown)                                     */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Status Select">
          <Row label="regular — click to open">
            <StatusSelect
              value={statusValue}
              onValueChange={setStatusValue}
              options={STATUS_OPTIONS}
            />
          </Row>
          <Row label="small">
            <StatusSelect
              value={statusValue}
              onValueChange={setStatusValue}
              options={STATUS_OPTIONS}
              size="small"
            />
          </Row>
          <Row label="disabled">
            <StatusSelect value="open" options={STATUS_OPTIONS} disabled />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Filter Config Modal                                                 */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Configure Filters modal">
          <Row label="opens from the filter bar's “Modify filter”">
            <Button variant="secondary" size="medium" onClick={() => setFilterModalOpen(true)}>
              Modify filter
            </Button>
            <FilterConfigModal
              open={filterModalOpen}
              onOpenChange={setFilterModalOpen}
              criteria={filterCriteria}
              onCriteriaChange={setFilterCriteria}
              advancedLogic={filterLogic}
              onAdvancedLogicChange={setFilterLogic}
              fieldOptions={FILTER_FIELD_OPTIONS}
              operatorOptions={FILTER_OPERATOR_OPTIONS}
              valueOptions={FILTER_VALUE_OPTIONS}
              onSave={() => setFilterModalOpen(false)}
            />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Letter                                                             */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Letter">
          <Row label="default / selected / borderless">
            <Letter letter="A" />
            <Letter letter="A" state="selected" />
            <Letter letter="A" state="borderless" />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Pagination                                                           */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Pagination">
          <Row label="default">
            <div className="w-full rounded border border-[var(--s-color-line-default)]">
              <Pagination
                page={page}
                pageCount={25}
                pageSize={pageSize}
                totalItems={247}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Table                                                                */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Table">
          <Row label="default (density=default)">
            <div className="w-full overflow-hidden rounded border border-[var(--s-color-line-default)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableSelectionHead>
                      <Checkbox />
                    </TableSelectionHead>
                    <TableHead sortable sortDirection="ascending">
                      <TableSortHeader direction="ascending">Name</TableSortHeader>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableActionHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableSelectionCell>
                      <Checkbox />
                    </TableSelectionCell>
                    <TableCell>Acme Corp</TableCell>
                    <TableCell>
                      <StatusLabel variant="active">Active</StatusLabel>
                    </TableCell>
                    <TableActionCell>
                      <IconButton icon="edit" label="Edit row" />
                    </TableActionCell>
                  </TableRow>
                  <TableRow selected>
                    <TableSelectionCell>
                      <Checkbox checked />
                    </TableSelectionCell>
                    <TableCell>Globex Inc</TableCell>
                    <TableCell>
                      <StatusLabel variant="waiting">Waiting</StatusLabel>
                    </TableCell>
                    <TableActionCell>
                      <IconButton icon="edit" label="Edit row" />
                    </TableActionCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Row>
          <Row label="empty state">
            <div className="w-full overflow-hidden rounded border border-[var(--s-color-line-default)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableEmptyState
                  colSpan={2}
                  title="No records found"
                  body="Try adjusting your filters or search query."
                />
              </Table>
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Prism Icon                                                           */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Prism Icon">
          <Row label="sizes (--s-icon-color-default)">
            <PrismIcon name="calendar" size={16} sourceSize={24} className="text-[var(--s-icon-color-default)]" />
            <PrismIcon name="calendar" size={24} className="text-[var(--s-icon-color-default)]" />
            <PrismIcon name="calendar" size={32} sourceSize={24} className="text-[var(--s-icon-color-default)]" />
          </Row>
          <Row label="semantic color tokens">
            <PrismIcon name="edit" size={24} className="text-[var(--s-icon-color-default)]" />
            <PrismIcon name="edit" size={24} className="text-[var(--s-icon-color-subtle)]" />
            <PrismIcon name="edit" size={24} className="text-[var(--s-icon-color-hover)]" />
            <PrismIcon name="edit" size={24} className="text-[var(--s-icon-color-selected)]" />
            <PrismIcon name="edit" size={24} className="text-[var(--s-icon-color-success)]" />
            <PrismIcon name="edit" size={24} className="text-[var(--s-icon-color-warning)]" />
            <PrismIcon name="edit" size={24} className="text-[var(--s-icon-color-danger)]" />
            <PrismIcon name="edit" size={24} className="text-[var(--s-icon-color-disabled)]" />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Shells & Patterns                                                    */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Left Navigation (PxShellRail)">
          <Row label="live — click the pin icon to expand, then Settings to open Admin mode">
            <div className="h-[560px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
              <PxShellRail
                activeKey={navKey}
                onNavigate={setNavKey}
                mode={navMode}
                onModeChange={setNavMode}
                onSearchClick={() => setNavMode("expanded")}
              />
            </div>
          </Row>
          <Row label="collapsed (48px, side-by-side reference)">
            <div className="h-[420px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
              <PxShellRail activeKey="engagements" onNavigate={() => {}} mode="collapsed" />
            </div>
          </Row>
          <Row label="expanded (240px, side-by-side reference)">
            <div className="h-[420px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
              <PxShellRail activeKey="engagements" onNavigate={() => {}} mode="expanded" />
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Shells & Patterns                                                    */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Shells & Patterns">
          <Row label="Page Header (PxHeader) — full anatomy">
            <div className="w-full overflow-x-auto rounded border border-[var(--s-color-line-default)]">
              <div className="min-w-[900px]">
                <PxHeader
                  moduleName="Engagements"
                  primaryCenter={
                    <PECDropdown
                      productOptions={PEC_PRODUCT_OPTIONS}
                      environmentOptions={PEC_ENVIRONMENT_OPTIONS}
                      channelOptions={PEC_CHANNEL_OPTIONS}
                      product={pec.product}
                      environment={pec.environment}
                      channels={pec.channels}
                      onApply={setPec}
                    />
                  }
                  primaryUtilities={[
                    { id: "messages", icon: "message", label: "Messages" },
                    { id: "apps", icon: "px-app-switcher", label: "Apps" },
                  ]}
                  onBack={() => {}}
                  title="All Engagements"
                  onEditTitle={(newTitle) => console.log("commit title", newTitle)}
                  titleChip={<Chip color="gray">Gray</Chip>}
                  tabs={[
                    { id: "active", label: "Active" },
                    { id: "archived", label: "Archived" },
                    { id: "drafts", label: "Drafts", badge: 3 },
                  ]}
                  activeTabId="active"
                  secondaryUtilities={[
                    { id: "info", icon: "info", label: "Info" },
                    { id: "copy", icon: "copy", label: "Duplicate" },
                    { id: "delete", icon: "delete", label: "Delete" },
                  ]}
                  secondaryActions={[
                    { id: "export", label: "Export", variant: "secondary" },
                    { id: "create", label: "Create Engagement" },
                  ]}
                  avatar={
                    <Avatar size="medium">
                      <AvatarFallback>ZK</AvatarFallback>
                    </Avatar>
                  }
                />
              </div>
            </div>
          </Row>
          <Row label="Page Header — SecTitle variant (no onBack, bold title, no chip)">
            <div className="w-full overflow-x-auto rounded border border-[var(--s-color-line-default)]">
              <div className="min-w-[900px]">
                <PxHeader
                  moduleName="Engagements"
                  title="All Engagements"
                  onEditTitle={(newTitle) => console.log("commit title", newTitle)}
                  secondaryActions={[
                    { id: "create", label: "Create Engagement" },
                  ]}
                  avatar={
                    <Avatar size="medium">
                      <AvatarFallback>ZK</AvatarFallback>
                    </Avatar>
                  }
                />
              </div>
            </div>
          </Row>
          <Row label="Filter Slider (PxFilterSlider)">
            <div className="h-[420px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
              <PxFilterSlider
                activeTab={filterTab}
                onTabChange={setFilterTab}
                hasSavedFilter
                savedFilterName="My Filter"
              />
            </div>
          </Row>
          <p className="text-xs text-[var(--s-color-text-subtlest)]">
            The full <code>PxListShell</code> composition (rail + header + content + optional filter) is best
            reviewed at full size — see the "Engagements" rail item, which renders{" "}
            <code>src/pages/engagements-list-example.tsx</code>.
          </p>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Create · Edit Shell (PxCreateEditShell)                              */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Create · Edit Shell (PxCreateEditShell)">
          <Row label="Live example — all 3 tiers">
            <div className="h-[700px] w-full overflow-hidden rounded border border-[var(--s-color-line-default)]">
              <CreateEditShellExample
                activeKey={createEditNavKey}
                onNavigate={setCreateEditNavKey}
                mode={createEditNavMode}
                onModeChange={setCreateEditNavMode}
              />
            </div>
          </Row>
          <Row label="Modal tier — Add Weblink">
            <Button onClick={() => setCreateEditModalOpen(true)}>Open Add Weblink</Button>
            <PxCreateEditShellModal
              open={createEditModalOpen}
              onOpenChange={setCreateEditModalOpen}
              title="Add Weblink"
              onCancel={() => setCreateEditModalOpen(false)}
              primaryAction={{ label: "Save", onClick: () => setCreateEditModalOpen(false) }}
            >
              <div className="flex flex-col gap-[var(--p-space-300)]">
                <TextField label="Title" required placeholder="Placeholder text" />
                <Textarea label="Description" />
                <Textarea label="URL" />
              </div>
            </PxCreateEditShellModal>
          </Row>
          <p className="text-xs text-[var(--s-color-text-subtlest)]">
            Figma: Shell/Create · Edit Form 🟢 (node 3187:10). See{" "}
            <code>src/patterns/px-create-edit-shell/README.md</code> for the full anatomy, Figma node
            traceability, and known Figma inconsistencies. Full worked example:{" "}
            <code>src/pages/create-edit-shell-example.tsx</code>.
          </p>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Analytics Secondary Navigation (PxAnalyticsSecondaryNav)            */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Analytics Secondary Navigation (PxAnalyticsSecondaryNav)">
          <Row label="Live example">
            <div className="h-[700px] w-full overflow-hidden rounded border border-[var(--s-color-line-default)]">
              <AnalyticsExample
                activeKey={analyticsNavKey}
                onNavigate={setAnalyticsNavKey}
                mode={analyticsNavMode}
                onModeChange={setAnalyticsNavMode}
              />
            </div>
          </Row>
          <Row label="Standalone — all sections open">
            <div className="h-[500px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
              <PxAnalyticsSecondaryNav
                title="All Reports"
                sections={ANALYTICS_SECTIONS}
                activeItemId={analyticsActiveItemId}
                onSelectItem={setAnalyticsActiveItemId}
              />
            </div>
          </Row>
          <Row label="Standalone — controlled section-open state">
            <div className="h-[500px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
              <PxAnalyticsSecondaryNav
                title="All Reports"
                sections={ANALYTICS_SECTIONS}
                activeItemId={analyticsActiveItemId}
                onSelectItem={setAnalyticsActiveItemId}
                openSectionIds={analyticsOpenSectionIds}
                onOpenSectionIdsChange={setAnalyticsOpenSectionIds}
              />
            </div>
          </Row>
          <Row label="Collapse / expand (controlled) — chevron in the title row, beside &quot;All Reports&quot;">
            <div className="flex flex-col gap-[var(--p-space-100)]">
              <button
                type="button"
                className="self-start text-xs text-[var(--s-color-link-default)] underline"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setAnalyticsCollapsed((value) => !value)}
              >
                {analyticsCollapsed ? "Expand" : "Collapse"} (external control)
              </button>
              <div className="h-[500px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
                <PxAnalyticsSecondaryNav
                  title="All Reports"
                  sections={ANALYTICS_SECTIONS}
                  activeItemId={analyticsActiveItemId}
                  onSelectItem={setAnalyticsActiveItemId}
                  collapsed={analyticsCollapsed}
                  onCollapsedChange={setAnalyticsCollapsed}
                />
              </div>
            </div>
          </Row>
          <Row label="Scroll ownership — only right content scrolls, nav stays fixed">
            <div className="flex h-[400px] w-full overflow-hidden rounded border border-[var(--s-color-line-default)]">
              <PxAnalyticsSecondaryNav
                title="All Reports"
                sections={ANALYTICS_SECTIONS}
                activeItemId={analyticsActiveItemId}
                onSelectItem={setAnalyticsActiveItemId}
              />
              <div className="flex-1 overflow-auto p-[var(--p-space-300)]">
                <div className="flex flex-col gap-[var(--p-space-200)]">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div
                      key={i}
                      className="rounded border border-[var(--s-color-line-default)] p-[var(--p-space-200)] text-xs text-[var(--s-color-text-subtle)]"
                    >
                      Scroll-test row {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Row>
          <p className="text-xs text-[var(--s-color-text-subtlest)]">
            Figma: Shell/Analytics/Secondary-Left Navigation 🟢 (page 3351:3925, symbol 3397:2451). Collapse/expand
            chevron: icons/filled/chevron-leftmenu-{"{"}collapse,expand{"}"}-filled (node 491:83) — a design-owner
            extension added after the original Analytics frame, not part of it. See{" "}
            <code>src/patterns/px-analytics-secondary-nav/README.md</code> for the full anatomy, Figma node
            traceability, and known deviations. Full worked example:{" "}
            <code>src/pages/analytics-example.tsx</code>.
          </p>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Search Bar                                                           */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Search Bar">
          <Row label="small (32px)">
            <SearchBar
              size="small"
              value={searchValue}
              placeholder="Search…"
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue("")}
            />
          </Row>
          <Row label="medium (36px) — DEFAULT">
            <SearchBar
              size="medium"
              value={searchValue}
              placeholder="Search…"
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue("")}
            />
          </Row>
          <Row label="no size prop — resolves to medium (36px)">
            <SearchBar
              value={searchValue}
              placeholder="Search…"
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue("")}
            />
          </Row>
          <Row label="large (40px)">
            <SearchBar
              size="large"
              value={searchValue}
              placeholder="Search…"
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue("")}
            />
          </Row>
          <Row label="rounded">
            <SearchBar
              size="large"
              rounded
              value={searchValue}
              placeholder="Rounded search…"
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue("")}
            />
          </Row>
          <Row label="small + inline (dense panel contexts, e.g. PEC Dropdown)">
            <div className="w-[240px] rounded bg-[var(--s-color-surface-muted)] p-2">
              <SearchBar
                size="small"
                inline
                value={searchValue}
                placeholder="Search…"
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue("")}
              />
            </div>
          </Row>
          <Row label="with value + clear">
            <SearchBar
              size="large"
              value={searchValueFilled}
              placeholder="Search…"
              onChange={(e) => setSearchValueFilled(e.target.value)}
              onClear={() => setSearchValueFilled("")}
            />
          </Row>
          <Row label="disabled">
            <SearchBar
              size="large"
              disabled
              placeholder="Disabled search…"
            />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Chip                                                                 */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Chip">
          <Row label="base colors (regular)">
            <Chip color="gray">Gray</Chip>
            <Chip color="green">Green</Chip>
            <Chip color="red">Red</Chip>
            <Chip color="yellow">Yellow</Chip>
          </Row>
          <Row label="accent colors (regular)">
            <Chip color="beta">Beta</Chip>
            <Chip color="new">New</Chip>
            <Chip color="tutorial">Tutorial</Chip>
            <Chip color="tip">Tip</Chip>
            <Chip color="active">Active</Chip>
            <Chip color="inactive">Inactive</Chip>
          </Row>
          <Row label="small size">
            <Chip color="gray" size="small">Gray</Chip>
            <Chip color="green" size="small">Green</Chip>
            <Chip color="red" size="small">Red</Chip>
            <Chip color="yellow" size="small">Yellow</Chip>
          </Row>
          <Row label="selected (base colors only)">
            <Chip color="gray" selected>Gray</Chip>
            <Chip color="green" selected>Green</Chip>
            <Chip color="red" selected>Red</Chip>
            <Chip color="yellow" selected>Yellow</Chip>
          </Row>
          <Row label="disabled (any color)">
            <Chip color="gray" disabled>Gray</Chip>
            <Chip color="beta" disabled>Beta</Chip>
          </Row>
          <Row label="dismissible">
            <Chip color="gray" dismissible onDismiss={() => console.log("dismiss gray")}>Gray</Chip>
            <Chip color="green" dismissible onDismiss={() => console.log("dismiss green")}>Green</Chip>
            <Chip color="gray" dismissible disabled>Gray</Chip>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Filter Chip                                                          */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Filter Chip">
          <Row label="no value (dashed border)">
            <FilterChip label="Stage" />
          </Row>
          <Row label="with value">
            <FilterChip label="Stage" value="Active" />
            <FilterChip label="Account" value="Gainsight" />
          </Row>
          <Row label="open">
            <FilterChip label="Stage" open />
            <FilterChip label="Stage" value="Active" open />
          </Row>
          <Row label="disabled">
            <FilterChip label="Stage" disabled />
            <FilterChip label="Stage" value="Active" disabled />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Filter Bar                                                            */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Filter Bar">
          <Row label="empty">
            <div className="w-full rounded border border-[var(--s-color-line-default)]">
              <FilterBar chips={[]} onAddFilter={() => {}} />
            </div>
          </Row>
          <Row label="one line (fits — wide container)">
            <div className="w-full rounded border border-[var(--s-color-line-default)]">
              <FilterBar
                chips={FILTER_BAR_CHIPS.slice(0, 3)}
                openChipId={filterBarOpenChip}
                onChipClick={(id) => setFilterBarOpenChip((prev) => (prev === id ? undefined : id))}
                onModifyFilter={() => {}}
              />
            </div>
          </Row>
          <Row label="overflow + show full (narrow container, 8 chips)">
            <div className="w-[480px] rounded border border-[var(--s-color-line-default)]">
              <FilterBar
                chips={FILTER_BAR_CHIPS}
                openChipId={filterBarOpenChip}
                onChipClick={(id) => setFilterBarOpenChip((prev) => (prev === id ? undefined : id))}
                onModifyFilter={() => {}}
              />
            </div>
          </Row>
          <Row label="save as new view">
            <div className="w-full rounded border border-[var(--s-color-line-default)]">
              <FilterBar
                chips={FILTER_BAR_CHIPS.slice(0, 3)}
                onModifyFilter={() => {}}
                onSaveAsNew={() => {}}
              />
            </div>
          </Row>
          <Row label="with disabled chip">
            <div className="w-full rounded border border-[var(--s-color-line-default)]">
              <FilterBar
                chips={[
                  { id: "stage", label: "Stage", value: "Active" },
                  { id: "owner", label: "Owner", disabled: true },
                ]}
                onModifyFilter={() => {}}
              />
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Filter Dropdown Panel                                                */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Filter Dropdown Panel">
          <Row label="search">
            <Popover open={fdpOpen === "search"} onOpenChange={(o) => setFdpOpen(o ? "search" : null)}>
              <PopoverTrigger asChild>
                <FilterChip label="Account" value={fdpSearch || undefined} open={fdpOpen === "search"} onClick={() => setFdpOpen(fdpOpen === "search" ? null : "search")} />
              </PopoverTrigger>
              <PopoverContent align="start" sideOffset={4} className="w-[312px] p-0">
                <FilterDropdownPanel
                  type="search"
                  value={fdpSearch}
                  onValueChange={setFdpSearch}
                  onClear={() => setFdpSearch("")}
                  onCancel={() => setFdpOpen(null)}
                  onApply={() => setFdpOpen(null)}
                />
              </PopoverContent>
            </Popover>
          </Row>
          <Row label="value">
            <Popover open={fdpOpen === "value"} onOpenChange={(o) => setFdpOpen(o ? "value" : null)}>
              <PopoverTrigger asChild>
                <FilterChip label="Name" value={fdpValue || undefined} open={fdpOpen === "value"} onClick={() => setFdpOpen(fdpOpen === "value" ? null : "value")} />
              </PopoverTrigger>
              <PopoverContent align="start" sideOffset={4} className="w-[312px] p-0">
                <FilterDropdownPanel
                  type="value"
                  label="Label"
                  value={fdpValue}
                  onValueChange={setFdpValue}
                  placeholder="Enter Value"
                  onClear={() => setFdpValue("")}
                  onCancel={() => setFdpOpen(null)}
                  onApply={() => setFdpOpen(null)}
                />
              </PopoverContent>
            </Popover>
          </Row>
          <Row label="date">
            <Popover open={fdpOpen === "date"} onOpenChange={(o) => setFdpOpen(o ? "date" : null)}>
              <PopoverTrigger asChild>
                <FilterChip label="Created" value={fdpDate ? fdpDate.toLocaleDateString() : undefined} open={fdpOpen === "date"} onClick={() => setFdpOpen(fdpOpen === "date" ? null : "date")} />
              </PopoverTrigger>
              <PopoverContent align="start" sideOffset={4} className="w-[288px] p-0">
                <FilterDropdownPanel
                  type="date"
                  value={fdpDate}
                  onValueChange={setFdpDate}
                  placeholder="Date range"
                  onClear={() => setFdpDate(undefined)}
                  onCancel={() => setFdpOpen(null)}
                  onApply={() => setFdpOpen(null)}
                />
              </PopoverContent>
            </Popover>
          </Row>
          <Row label="number">
            <Popover open={fdpOpen === "number"} onOpenChange={(o) => setFdpOpen(o ? "number" : null)}>
              <PopoverTrigger asChild>
                <FilterChip label="Score" value={fdpNumber || undefined} open={fdpOpen === "number"} onClick={() => setFdpOpen(fdpOpen === "number" ? null : "number")} />
              </PopoverTrigger>
              <PopoverContent align="start" sideOffset={4} className="w-[312px] p-0">
                <FilterDropdownPanel
                  type="number"
                  operator={fdpNumberOp}
                  onOperatorChange={setFdpNumberOp}
                  value={fdpNumber}
                  onValueChange={setFdpNumber}
                  onClear={() => setFdpNumber("")}
                  onCancel={() => setFdpOpen(null)}
                  onApply={() => setFdpOpen(null)}
                />
              </PopoverContent>
            </Popover>
          </Row>
          <Row label="picklist">
            <Popover open={fdpOpen === "picklist"} onOpenChange={(o) => setFdpOpen(o ? "picklist" : null)}>
              <PopoverTrigger asChild>
                <FilterChip label="Status" value={fdpPicklistValue || undefined} open={fdpOpen === "picklist"} onClick={() => setFdpOpen(fdpOpen === "picklist" ? null : "picklist")} />
              </PopoverTrigger>
              <PopoverContent align="start" sideOffset={4} className="w-[312px] p-0">
                <FilterDropdownPanel
                  type="picklist"
                  options={PICKLIST_OPTIONS}
                  value={fdpPicklistValue}
                  onValueChange={setFdpPicklistValue}
                  searchValue={fdpPicklistSearch}
                  onSearchChange={setFdpPicklistSearch}
                  onClear={() => setFdpPicklistValue("")}
                  onCancel={() => setFdpOpen(null)}
                  onApply={() => setFdpOpen(null)}
                />
              </PopoverContent>
            </Popover>
          </Row>
          <Row label="multi-picklist">
            <Popover open={fdpOpen === "multi"} onOpenChange={(o) => setFdpOpen(o ? "multi" : null)}>
              <PopoverTrigger asChild>
                <FilterChip label="Tags" value={fdpMultiSelected.length ? `${fdpMultiSelected.length} selected` : undefined} open={fdpOpen === "multi"} onClick={() => setFdpOpen(fdpOpen === "multi" ? null : "multi")} />
              </PopoverTrigger>
              <PopoverContent align="start" sideOffset={4} className="w-[312px] p-0">
                <FilterDropdownPanel
                  type="multi-picklist"
                  options={PICKLIST_OPTIONS}
                  selected={fdpMultiSelected}
                  onSelectedChange={setFdpMultiSelected}
                  searchValue={fdpMultiSearch}
                  onSearchChange={setFdpMultiSearch}
                  totalCount={200}
                  onClear={() => setFdpMultiSelected([])}
                  onCancel={() => setFdpOpen(null)}
                  onApply={() => setFdpOpen(null)}
                />
              </PopoverContent>
            </Popover>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Date Filter                                                          */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Date Filter">
          <Row label="empty">
            <DateFilter value={dateFilterValue} onChange={setDateFilterValue} />
          </Row>
          <Row label="disabled">
            <DateFilter placeholder="Select a date range" disabled />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Spinner                                                              */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Spinner">
          <Row label="xs (16 — inline button loading only)">
            <Spinner size="xs" label="Loading" />
          </Row>
          <Row label="s (24 — inline table/list cell)">
            <Spinner size="s" label="Loading" />
          </Row>
          <Row label="m (32 — default, section-level)">
            <Spinner size="m" label="Loading" />
          </Row>
          <Row label="l (48 — full-page/large area)">
            <Spinner size="l" label="Loading" />
          </Row>
          <Row label="xl (56 — hero/modal overlay)">
            <Spinner size="xl" label="Loading" />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Progress Bar                                                         */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Progress Bar">
          {(["default", "success", "warning", "danger"] as const).map((status) => (
            <Row key={status} label={status}>
              <div className="flex w-full items-center gap-4">
                {[0, 25, 50, 75, 100].map((value) => (
                  <div key={value} className="flex flex-col gap-1">
                    <div className="w-[140px]">
                      <ProgressBar value={value} status={status} label={`${status} ${value}%`} />
                    </div>
                    <span className="text-[length:var(--t-font-label-small-size)] text-[var(--s-color-text-subtlest)]">
                      {value}%
                    </span>
                  </div>
                ))}
              </div>
            </Row>
          ))}
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Skeleton                                                             */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Skeleton">
          <Row label="line">
            <div className="w-[240px]">
              <Skeleton variant="line" />
            </div>
          </Row>
          <Row label="block">
            <div className="w-[240px]">
              <Skeleton variant="block" />
            </div>
          </Row>
          <Row label="avatar">
            <Skeleton variant="avatar" />
          </Row>
          <Row label="card">
            <div className="w-[240px]">
              <Skeleton variant="card" />
            </div>
          </Row>
          <Row label="grouped (mirrors real content layout)">
            <div className="flex w-[280px] items-start gap-3">
              <Skeleton variant="avatar" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton variant="line" className="w-1/2" />
                <Skeleton variant="line" />
              </div>
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Banner                                                               */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Banner">
          <Row label="small / success">
            <div className="w-[500px]">
              <Banner variant="success" message="Changes saved successfully." onDismiss={() => {}} />
            </div>
          </Row>
          <Row label="small / warning">
            <div className="w-[500px]">
              <Banner variant="warning" message="Some fields need your review before continuing." />
            </div>
          </Row>
          <Row label="small / danger">
            <div className="w-[500px]">
              <Banner variant="danger" message="Failed to sync data with the server." onDismiss={() => {}} />
            </div>
          </Row>
          <Row label="small / information">
            <div className="w-[500px]">
              <Banner variant="information" message="A new version of this report is available." />
            </div>
          </Row>
          <Row label="large / with description">
            <div className="w-[500px]">
              <Banner
                size="large"
                variant="warning"
                title="Storage almost full"
                description="You've used 90% of your available storage. Free up space or upgrade your plan to avoid disruption."
                onDismiss={() => {}}
              />
            </div>
          </Row>
          <Row label="large / with action">
            <div className="w-[500px]">
              <Banner
                size="large"
                variant="danger"
                title="Sync failed"
                description="We couldn't sync your latest changes. Retry now to avoid losing data."
                action={{ label: "Retry", onClick: () => {} }}
                onDismiss={() => {}}
              />
            </div>
          </Row>
          <Row label="small / with undo">
            <div className="w-[500px]">
              <Banner
                variant="success"
                message="Report archived."
                action={{ label: "Undo", onClick: () => {} }}
                onDismiss={() => {}}
              />
            </div>
          </Row>
          <Row label="small / with action, no dismiss">
            <div className="w-[500px]">
              <Banner
                variant="information"
                message="A new version of this report is available."
                action={{ label: "Review changes", onClick: () => {} }}
              />
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Empty State                                                          */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Empty State">
          <p className="mb-2 w-full text-xs text-[var(--s-color-text-subtlest)]">
            Only "No Data Found" (medium/80px) has been extracted from Figma's 17-illustration ×
            5-size set so far — see project_pending_exceptions.md. The `illustration` prop accepts
            any node, so other types can be wired in once exported.
          </p>
          <Row label="portrait / medium">
            <div className="w-[472px] rounded border border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)] p-6">
              <EmptyState
                size="medium"
                illustration={
                  <span
                    className="inline-flex"
                    dangerouslySetInnerHTML={{ __html: noDataFoundIllustration }}
                  />
                }
                title="No data found"
                description="This body explains the empty state. The icon relates to the situation."
                secondaryAction={{ label: "Learn more", onClick: () => {} }}
                primaryAction={{ label: "Add data", onClick: () => {} }}
              />
            </div>
          </Row>
          <Row label="landscape / medium">
            <div className="w-[576px] rounded border border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)] p-6">
              <EmptyState
                size="medium"
                orientation="landscape"
                illustration={
                  <span
                    className="inline-flex"
                    dangerouslySetInnerHTML={{ __html: noDataFoundIllustration }}
                  />
                }
                title="No data found"
                description="This body explains the empty state. The icon relates to the situation."
                secondaryAction={{ label: "Learn more", onClick: () => {} }}
                primaryAction={{ label: "Add data", onClick: () => {} }}
              />
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Tabs                                                                 */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Tabs">
          <Row label="primary / large">
            <Tabs defaultValue="overview">
              <TabsList variant="primary" size="large">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings" icon="settings">
                  Settings
                </TabsTrigger>
                <TabsTrigger value="disabled" disabled>
                  Disabled
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="pt-3 text-sm text-[var(--s-color-text-subtlest)]">
                Overview panel content.
              </TabsContent>
              <TabsContent value="activity" className="pt-3 text-sm text-[var(--s-color-text-subtlest)]">
                Activity panel content.
              </TabsContent>
              <TabsContent value="settings" className="pt-3 text-sm text-[var(--s-color-text-subtlest)]">
                Settings panel content.
              </TabsContent>
            </Tabs>
          </Row>
          <Row label="primary / medium">
            <Tabs defaultValue="overview">
              <TabsList variant="primary" size="medium">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </Row>
          <Row label="primary / small">
            <Tabs defaultValue="overview">
              <TabsList variant="primary" size="small">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </Row>
          <Row label="secondary / large">
            <Tabs defaultValue="overview">
              <TabsList variant="secondary" size="large">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="disabled" disabled>
                  Disabled
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </Row>
          <Row label="secondary / medium">
            <Tabs defaultValue="overview">
              <TabsList variant="secondary" size="medium">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </Row>
          <Row label="secondary / small">
            <Tabs defaultValue="overview">
              <TabsList variant="secondary" size="small">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Third Pane                                                           */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Third Pane">
          {(["small", "medium", "large", "xlarge"] as const).map((size) => (
            <React.Fragment key={size}>
              <Row label={`${size} · no back`}>
                <Button onClick={() => setThirdPaneVariant({ size, back: false })}>
                  Open {size}
                </Button>
              </Row>
              <Row label={`${size} · with back`}>
                <Button onClick={() => setThirdPaneVariant({ size, back: true })}>
                  Open {size}
                </Button>
              </Row>
            </React.Fragment>
          ))}
          {thirdPaneVariant ? (
            <ThirdPane
              open={!!thirdPaneVariant}
              onOpenChange={(open) => !open && setThirdPaneVariant(null)}
              size={thirdPaneVariant.size}
              title={`${thirdPaneVariant.size} pane`}
              onBack={thirdPaneVariant.back ? () => setThirdPaneVariant(null) : undefined}
            >
              <p className="text-sm text-[var(--s-color-text-subtlest)]">
                Third Pane content is fully caller-owned — this is placeholder body copy to verify
                sizing and scroll behavior for the {thirdPaneVariant.size} variant
                {thirdPaneVariant.back ? " with back arrow" : ""}.
              </p>
            </ThirdPane>
          ) : null}
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Toast                                                                */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Toast">
          <ToastProvider swipeDirection="right">
            {(["success", "warning", "danger", "info"] as const).map((variant) => (
              <Row key={variant} label={variant}>
                <div className="flex flex-wrap items-center gap-2">
                  {(["close", "undo", "cta"] as const).map((action) => (
                    <Button
                      key={action}
                      variant={variant === "danger" ? "destructive" : "secondary"}
                      size="small"
                      onClick={() => {
                        setToastVariant(variant)
                        setToastAction(action)
                        setToastOpen(false)
                        // small delay to allow re-open of same variant
                        setTimeout(() => setToastOpen(true), 50)
                      }}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </Row>
            ))}
            <Toast
              open={toastOpen}
              onOpenChange={setToastOpen}
              variant={toastVariant}
              message={
                toastVariant === "success"
                  ? "Changes saved successfully."
                  : toastVariant === "warning"
                    ? "Some fields need your review."
                    : toastVariant === "danger"
                      ? "Failed to save changes."
                      : "A new version is available."
              }
              action={
                toastAction === "close"
                  ? { type: "none" }
                  : toastAction === "undo"
                    ? { type: "undo", onUndo: () => setToastOpen(false) }
                    : { type: "cta", label: "Retry", onAction: () => setToastOpen(false) }
              }
            />
            <ToastViewport />
          </ToastProvider>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Modal                                                                */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Modal">
          {(["small", "medium", "large"] as const).map((size) => (
            <React.Fragment key={size}>
              <Row label={`${size} · microcopy off`}>
                <Button onClick={() => setModalVariant({ size, microcopy: false })}>
                  Open {size}
                </Button>
              </Row>
              <Row label={`${size} · microcopy on`}>
                <Button onClick={() => setModalVariant({ size, microcopy: true })}>
                  Open {size}
                </Button>
              </Row>
            </React.Fragment>
          ))}
          {modalVariant ? (
            <Modal
              open={!!modalVariant}
              onOpenChange={(open) => !open && setModalVariant(null)}
              size={modalVariant.size}
              title="Archive report"
              description={
                modalVariant.microcopy
                  ? "Archived reports move to cold storage and can be restored within 30 days."
                  : undefined
              }
            >
              <div className="flex-1 overflow-y-auto p-[var(--p-space-300)] text-sm text-[var(--s-color-text-subtlest)]">
                {modalVariant.size} modal · width fixed per size, height grows with content.
              </div>
              <ModalFooter
                size={modalVariant.size}
                secondaryAction={{ label: "Cancel", onClick: () => setModalVariant(null) }}
                primaryAction={{ label: "Archive", onClick: () => setModalVariant(null) }}
              />
            </Modal>
          ) : null}
          <Row label="confirmation / success">
            <Button onClick={() => setModalConfirmOpen(true)}>Open Confirmation</Button>
            <ModalConfirmation
              open={modalConfirmOpen}
              onOpenChange={setModalConfirmOpen}
              variant="success"
              title="Title placeholder"
              description="Please change the icon based on your use case."
              secondaryAction={{ label: "Cancel", onClick: () => setModalConfirmOpen(false) }}
              primaryAction={{ label: "Confirm", onClick: () => setModalConfirmOpen(false) }}
            />
          </Row>
          <Row label="confirmation / danger">
            <Button variant="destructive" onClick={() => setModalConfirmDangerOpen(true)}>Open Confirmation</Button>
            <ModalConfirmation
              open={modalConfirmDangerOpen}
              onOpenChange={setModalConfirmDangerOpen}
              variant="danger"
              title="Delete report"
              description="This action cannot be undone."
              secondaryAction={{ label: "Cancel", onClick: () => setModalConfirmDangerOpen(false) }}
              primaryAction={{ label: "Delete", onClick: () => setModalConfirmDangerOpen(false) }}
            />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Modal Footer                                                         */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Modal Footer">
          <p className="mb-2 w-full text-xs text-[var(--s-color-text-subtlest)]">
            Static instances — the Modal section above shows Footer composed inside an actual
            Modal (only visible once opened); these are rendered directly so the shell is visible
            without interaction.
          </p>
          <Row label="large / 2-button (64px)">
            <div className="w-[904px] max-w-full overflow-hidden rounded-[var(--p-radius-200)] border border-[var(--s-color-line-default)]">
              <ModalFooter
                size="large"
                secondaryAction={{ label: "Cancel", onClick: () => {} }}
                primaryAction={{ label: "Archive", onClick: () => {} }}
              />
            </div>
          </Row>
          <Row label="medium / 3-button (48px)">
            <div className="w-[712px] max-w-full overflow-hidden rounded-[var(--p-radius-200)] border border-[var(--s-color-line-default)]">
              <ModalFooter
                size="medium"
                tertiaryAction={{ label: "Back", onClick: () => {} }}
                secondaryAction={{ label: "Cancel", onClick: () => {} }}
                primaryAction={{ label: "Next", onClick: () => {} }}
              />
            </div>
          </Row>
          <Row label="small / 2-button (40px)">
            <div className="w-[424px] max-w-full overflow-hidden rounded-[var(--p-radius-200)] border border-[var(--s-color-line-default)]">
              <ModalFooter
                size="small"
                secondaryAction={{ label: "Cancel", onClick: () => {} }}
                primaryAction={{ label: "Delete", onClick: () => {} }}
              />
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Tree                                                                 */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Tree">
          <Row label="single-select navigation">
            <div className="w-[312px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
              <Tree>
                <TreeItem
                  level={1}
                  label="Parent Node"
                  expandable
                  expanded={treeExpanded}
                  onToggleExpand={() => setTreeExpanded((v) => !v)}
                  selected={treeSelected === "parent"}
                  onSelect={() => setTreeSelected("parent")}
                  onMoreActions={() => {}}
                />
                {treeExpanded ? (
                  <>
                    <TreeItem
                      level={2}
                      label="Child · Level 2"
                      expandable
                      expanded={treeChild2Expanded}
                      onToggleExpand={() => setTreeChild2Expanded((v) => !v)}
                      selected={treeSelected === "child-1"}
                      onSelect={() => setTreeSelected("child-1")}
                    />
                    {treeChild2Expanded ? (
                      <TreeItem
                        level={3}
                        label="Leaf · Level 3"
                        selected={treeSelected === "child-2"}
                        onSelect={() => setTreeSelected("child-2")}
                      />
                    ) : null}
                  </>
                ) : null}
                <TreeItem level={1} label="Disabled Node" disabled />
              </Tree>
            </div>
          </Row>
          <Row label="multi-select · checkbox">
            <div className="w-[312px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
              <Tree>
                <TreeItem
                  level={1}
                  label="Parent Node"
                  expandable
                  expanded={treeMultiExpanded}
                  onToggleExpand={() => setTreeMultiExpanded((v) => !v)}
                  checkbox
                  checked={treeChecked["parent"]}
                  onCheckedChange={(checked) =>
                    setTreeChecked((prev) => ({ ...prev, parent: checked === true }))
                  }
                />
                {treeMultiExpanded ? (
                  <>
                    <TreeItem
                      level={3}
                      label="Child Node A"
                      checkbox
                      checked={treeChecked["child-1"]}
                      onCheckedChange={(checked) =>
                        setTreeChecked((prev) => ({ ...prev, "child-1": checked === true }))
                      }
                    />
                    <TreeItem
                      level={3}
                      label="Child Node B"
                      checkbox
                      checked={treeChecked["child-2"]}
                      onCheckedChange={(checked) =>
                        setTreeChecked((prev) => ({ ...prev, "child-2": checked === true }))
                      }
                    />
                  </>
                ) : null}
              </Tree>
            </div>
          </Row>
          <Row label="with icons · Type=1 Icon">
            <div className="w-[312px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
              <Tree>
                <TreeItem level={1} label="Reports" expandable expanded icons={["folder-closed"]} />
                <TreeItem level={2} label="Monthly" expandable expanded icons={["folder-closed"]} />
                <TreeItem level={3} label="August" icons={["document"]} selected />
                <TreeItem level={3} label="July" icons={["document"]} />
              </Tree>
            </div>
          </Row>
          <Row label="with icons · Type=2 Icons">
            <div className="w-[312px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
              <Tree>
                <TreeItem
                  level={1}
                  label="Team Alpha"
                  expandable
                  expanded
                  icons={["folder-closed", "star-line"]}
                />
                <TreeItem
                  level={3}
                  label="Project X"
                  icons={["document", "lock"]}
                />
              </Tree>
            </div>
          </Row>
          <Row label="hover-action · more menu">
            <div className="w-[312px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
              <Tree>
                <TreeItem level={1} label="Node with actions" expandable onMoreActions={() => {}} />
                <TreeItem level={1} label="Another node" expandable onMoreActions={() => {}} />
              </Tree>
            </div>
          </Row>
          <Row label="all disabled states">
            <div className="w-[312px] overflow-hidden rounded border border-[var(--s-color-line-default)]">
              <Tree>
                <TreeItem level={1} label="Disabled branch" expandable disabled />
                <TreeItem level={1} label="Disabled with icon" icons={["folder-closed"]} disabled />
                <TreeItem level={1} label="Disabled + checkbox" checkbox disabled />
              </Tree>
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Views / View Selector / View Switcher                               */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Views">
          <Row label="non-inline / large">
            <Views
              size="large"
              label="Status"
              value="Open"
              open={viewsOpen}
              onClick={() => setViewsOpen((v) => !v)}
            />
          </Row>
          <Row label="non-inline / with icon">
            <Views size="large" label="Owner" value="Jacob Jones" icon="user" />
          </Row>
          <Row label="inline / extrasmall">
            <Views inline size="extrasmall" label="Status:" value="Open" />
          </Row>
          <Row label="disabled">
            <Views size="large" label="Status" value="Open" disabled />
          </Row>
        </Section>

        <Section title="View Selector">
          <Row label="large">
            <ViewSelector
              size="large"
              label="My Dashboard"
              open={viewSelectorOpen}
              onClick={() => setViewSelectorOpen((v) => !v)}
            />
          </Row>
        </Section>

        <Section title="View Switcher">
          <Row label="3 views">
            <ViewSwitcher
              value={viewSwitcherValue}
              onValueChange={setViewSwitcherValue}
              options={[
                { value: "chart", label: "Chart" },
                { value: "table", label: "Table" },
                { value: "list", label: "List" },
              ]}
            />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Toggle                                                               */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Toggle">
          <Row label="off (default)">
            <Toggle label="Enable notifications" />
          </Row>
          <Row label="on">
            <Toggle label="Enable notifications" defaultChecked />
          </Row>
          <Row label="on / controlled">
            <Toggle
              label="Send weekly summary"
              checked={toggleOn}
              onChange={(e) => setToggleOn(e.currentTarget.checked)}
            />
          </Row>
          <Row label="disabled off">
            <Toggle label="Sync (unavailable)" disabled />
          </Row>
          <Row label="disabled on">
            <Toggle label="Sync (unavailable)" disabled defaultChecked />
          </Row>
          <Row label="no label">
            <Toggle defaultChecked aria-label="Enable feature" />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Breadcrumb                                                           */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Breadcrumb">
          <Row label="single level">
            <Breadcrumb items={[{ id: "root", label: "Home" }]} />
          </Row>
          <Row label="two levels">
            <Breadcrumb
              items={[
                { id: "engagements", label: "Engagements", href: "#" },
                { id: "current", label: "Jacob Jones" },
              ]}
            />
          </Row>
          <Row label="three levels">
            <Breadcrumb
              items={[
                { id: "home", label: "Home", href: "#" },
                { id: "engagements", label: "Engagements", href: "#" },
                { id: "current", label: "Jacob Jones" },
              ]}
            />
          </Row>
          <Row label="truncated (6 → 4 max)">
            <Breadcrumb
              maxItems={4}
              items={[
                { id: "l1", label: "Level 1", href: "#" },
                { id: "l2", label: "Level 2", href: "#" },
                { id: "l3", label: "Level 3", href: "#" },
                { id: "l4", label: "Level 4", href: "#" },
                { id: "l5", label: "Level 5", href: "#" },
                { id: "current", label: "Current page" },
              ]}
            />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Summary Stat                                                         */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Summary Stat">
          <Row label="compact / stats row">
            <div className="w-[720px] rounded-[var(--p-radius-100)] bg-[var(--s-color-surface-default)] p-[var(--p-space-200)]">
              <StatsRow>
                <SummaryStat value="1,248" label="Active users" />
                <SummaryStat value="82%" label="Adoption" />
                <SummaryStat value="4.6" label="Avg rating" />
                <SummaryStat value="12" label="Pending" />
              </StatsRow>
            </div>
          </Row>
          <Row label="clickable / selectable">
            <div className="w-[560px] rounded-[var(--p-radius-100)] bg-[var(--s-color-surface-default)] p-[var(--p-space-200)]">
              <StatsRow>
                <SummaryStat
                  value="248"
                  label="All accounts"
                  type="clickable"
                  selected={summaryStatSelected === "all"}
                  onClick={() => setSummaryStatSelected("all")}
                />
                <SummaryStat
                  value="140"
                  label="Healthy"
                  type="clickable"
                  selected={summaryStatSelected === "healthy"}
                  onClick={() => setSummaryStatSelected("healthy")}
                />
                <SummaryStat
                  value="68"
                  label="Warning"
                  type="clickable"
                  selected={summaryStatSelected === "warning"}
                  onClick={() => setSummaryStatSelected("warning")}
                />
              </StatsRow>
            </div>
          </Row>
          <Row label="metric / trend up">
            <SummaryStat
              value="82%"
              label="Adoption"
              trend={{ direction: "up", delta: "+12%", comparator: "vs last month" }}
            />
          </Row>
          <Row label="metric / trend down">
            <SummaryStat
              value="4.6"
              label="Avg rating"
              trend={{ direction: "down", delta: "−0.3", comparator: "vs last month" }}
            />
          </Row>
          <Row label="metric / description only">
            <SummaryStat
              value="1,248"
              label="Active users"
              description="Users active in the last 30 days"
            />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Canvas Card                                                          */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Canvas Card">
          <Row label="split / 50-50">
            <div className="flex h-[240px] w-[720px] flex-col">
              <CanvasCard
                left={<div className="flex h-full items-center justify-center text-sm text-[var(--s-color-text-subtlest)]">Left pane (flex)</div>}
                right={<div className="flex h-full items-center justify-center text-sm text-[var(--s-color-text-subtlest)]">Right pane (flex)</div>}
              />
            </div>
          </Row>
          <Row label="fixed-right / 320px config">
            <div className="flex h-[240px] w-[720px] flex-col">
              <CanvasCard
                mode="fixed-right"
                fixedSize={320}
                left={<div className="flex h-full items-center justify-center text-sm text-[var(--s-color-text-subtlest)]">Preview (flex)</div>}
                right={<div className="flex h-full items-center justify-center bg-[var(--s-color-surface-page)] text-sm text-[var(--s-color-text-subtlest)]">Config (fixed 320)</div>}
              />
            </div>
          </Row>
          <Row label="split / resizable (drag divider)">
            <div className="flex h-[240px] w-[720px] flex-col">
              <CanvasCard
                resizable
                minSize={200}
                maxSize={520}
                left={<div className="flex h-full items-center justify-center text-sm text-[var(--s-color-text-subtlest)]">Left (drag divider →)</div>}
                right={<div className="flex h-full items-center justify-center text-sm text-[var(--s-color-text-subtlest)]">Right</div>}
              />
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Config Row                                                           */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Config Row">
          <Row label="basic">
            <div className="w-[480px]">
              <ConfigRow
                icon={<PrismIcon name="settings" size={16} decorative />}
                title="Notification settings"
                onClick={() => {}}
              />
            </div>
          </Row>
          <Row label="with subtitle">
            <div className="w-[480px]">
              <ConfigRow
                icon={<PrismIcon name="email" size={16} sourceSize={24} decorative />}
                title="Email delivery"
                subtitle="Sends to zkhan@gainsight.com"
                onClick={() => {}}
              />
            </div>
          </Row>
          <Row label="with trailing badge">
            <div className="w-[480px]">
              <ConfigRow
                icon={<PrismIcon name="user" size={16} decorative />}
                title="Assigned to"
                subtitle="Jacob Jones"
                trailing={<StatusLabel variant="active">Owner</StatusLabel>}
                onClick={() => {}}
              />
            </div>
          </Row>
          <Row label="non-interactive / no chevron">
            <div className="w-[480px]">
              <ConfigRow
                icon={<PrismIcon name="calendar" size={16} sourceSize={24} decorative />}
                title="Created"
                subtitle="Aug 4, 2026"
                hideChevron
              />
            </div>
          </Row>
          <Row label="disabled">
            <div className="w-[480px]">
              <ConfigRow
                icon={<PrismIcon name="lock" size={16} decorative />}
                title="Locked configuration"
                subtitle="Contact admin to change"
                onClick={() => {}}
                disabled
              />
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Wizard                                                               */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Wizard">
          <Row label="horizontal / step 2 of 4">
            <Wizard
              steps={
                [
                  { id: "s1", label: "Choose source", state: "completed" },
                  { id: "s2", label: "Map fields", state: "active" },
                  { id: "s3", label: "Preview", state: "pending" },
                  { id: "s4", label: "Import", state: "pending" },
                ] satisfies WizardStep[]
              }
              onStepClick={() => {}}
            />
          </Row>
          <Row label="horizontal / all completed">
            <Wizard
              steps={
                [
                  { id: "a1", label: "Sign up", state: "completed" },
                  { id: "a2", label: "Verify", state: "completed" },
                  { id: "a3", label: "Setup", state: "completed" },
                ] satisfies WizardStep[]
              }
            />
          </Row>
          <Row label="horizontal / numbers only">
            <Wizard
              showLabels={false}
              steps={
                [
                  { id: "n1", state: "completed" },
                  { id: "n2", state: "completed" },
                  { id: "n3", state: "active" },
                  { id: "n4", state: "pending" },
                  { id: "n5", state: "pending" },
                ] satisfies WizardStep[]
              }
            />
          </Row>
          <Row label="vertical / step 3 of 5">
            <Wizard
              orientation="vertical"
              steps={
                [
                  { id: "v1", label: "Account details", state: "completed" },
                  { id: "v2", label: "Company info", state: "completed" },
                  { id: "v3", label: "Integrations", state: "active" },
                  { id: "v4", label: "Team", state: "pending" },
                  { id: "v5", label: "Finish", state: "pending" },
                ] satisfies WizardStep[]
              }
              onStepClick={() => {}}
            />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Input Number                                                         */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Input Number">
          <Row label="default (0–100)">
            <InputNumber value={inputNumberValue} onValueChange={setInputNumberValue} min={0} max={100} ariaLabel="Priority" />
          </Row>
          <Row label="with step 0.01 (currency-style)">
            <InputNumber value={inputNumberPrice} onValueChange={setInputNumberPrice} min={0} max={9999} step={0.01} ariaLabel="Price" className="w-32" />
          </Row>
          <Row label="disabled">
            <InputNumber value={50} onValueChange={() => {}} min={0} max={100} disabled ariaLabel="Read-only" />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Accordion                                                            */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Accordion">
          <Row label="off-material / 56px (default)">
            <div className="w-[480px]">
              <Accordion defaultValue="general">
                <AccordionItem value="general" title="General settings" icon="settings">
                  Body content for general settings goes here — checkboxes, form fields, etc.
                </AccordionItem>
                <AccordionItem value="notifications" title="Notifications" icon="notifications">
                  Body content for notifications.
                </AccordionItem>
                <AccordionItem value="advanced" title="Advanced" icon="star-line">
                  Body content for advanced settings.
                </AccordionItem>
              </Accordion>
            </div>
          </Row>
          <Row label="off-material-shadow / 64px with subtitle, expanded (24px gap to content)">
            <div className="w-[480px]">
              <Accordion type="off-material-shadow" size={64} defaultValue="a">
                <AccordionItem value="a" title="Account" subtitle="Profile, credentials, sessions">
                  Account settings body.
                </AccordionItem>
                <AccordionItem value="b" title="Billing" subtitle="Plan, invoices, payment methods">
                  Billing settings body.
                </AccordionItem>
              </Accordion>
            </div>
          </Row>
          <Row label="on-material / 48px (compact) — no container, inherits page background">
            <div className="w-[480px]">
              <Accordion type="on-material" size={48}>
                <AccordionItem value="q1" title="How do I invite teammates?">Body copy.</AccordionItem>
                <AccordionItem value="q2" title="Can I export data?">Body copy.</AccordionItem>
                <AccordionItem value="q3" title="Where do reports live?">Body copy.</AccordionItem>
              </Accordion>
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Slider                                                               */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Slider">
          <Row label="single value (0–100)">
            <div className="w-[320px]">
              <Slider value={sliderValue} onValueChange={(v) => setSliderValue(v)} min={0} max={100} step={1} />
            </div>
          </Row>
          <Row label="range (dual thumbs)">
            <div className="w-[320px]">
              <Slider value={sliderRange} onValueChange={(v) => setSliderRange(v)} min={0} max={100} step={5} />
            </div>
          </Row>
          <Row label="disabled">
            <div className="w-[320px]">
              <Slider defaultValue={40} min={0} max={100} disabled />
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Column Selector                                                      */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Column Selector">
          <p className="mb-2 w-full text-xs text-[var(--s-color-text-subtlest)]">
            Popover panel — normally opens from a Table toolbar icon. Rendered inline here for anatomy inspection.
            Drag-and-drop reordering is caller-owned; the Order view exposes ↑/↓ buttons for keyboard reordering.
          </p>
          <Row label="controlled (select + order)">
            <div className="rounded-[var(--p-radius-150)] border border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)] shadow-[var(--e-shadow-500)]">
              <ColumnSelector
                columns={columnSelectorColumns}
                selected={columnSelectorSelected}
                order={columnSelectorOrder}
                view={columnSelectorView}
                onViewChange={setColumnSelectorView}
                onSelectedChange={setColumnSelectorSelected}
                onReorder={setColumnSelectorOrder}
                onReset={() => {
                  setColumnSelectorSelected(["name", "email", "company"])
                  setColumnSelectorOrder(["name", "email", "company", "title", "status", "created", "updated"])
                }}
                onCancel={() => {}}
                onSave={() => {}}
              />
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* File Uploader                                                        */}
        {/* ------------------------------------------------------------------ */}
        <Section title="File Uploader">
          <Row label="large / square / idle">
            <div className="w-[440px]">
              <FileUploader hint="PNG, JPG or PDF up to 10MB" />
            </div>
          </Row>
          <Row label="large / square / uploaded">
            <div className="w-[440px]">
              <FileUploader status="uploaded" fileName="proposal-final-v3.pdf" fileSize="2.4 MB" onDelete={() => {}} />
            </div>
          </Row>
          <Row label="large / square / loading">
            <div className="w-[440px]">
              <FileUploader status="loading" fileName="Uploading big-report.csv..." onCancel={() => {}} />
            </div>
          </Row>
          <Row label="large / square / error">
            <div className="w-[440px]">
              <FileUploader status="error" fileName="video.mov" errorMessage="File exceeds 10MB limit — try a smaller file." onRetry={() => {}} />
            </div>
          </Row>
          <Row label="small / wider / idle">
            <div className="w-[440px]">
              <FileUploader size="small" variant="wider" hint="CSV only" />
            </div>
          </Row>
          <Row label="multi-file rows">
            <div className="flex w-[440px] flex-col gap-[var(--p-space-050)] rounded border border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)] p-[var(--p-space-200)]">
              <FileUploaderRow fileName="q3-report.pdf" fileSize="1.2 MB" onDelete={() => {}} />
              <FileUploaderRow fileName="revenue.xlsx" fileSize="482 KB" onDelete={() => {}} />
              <FileUploaderRow fileName="Uploading customers.csv..." status="loading" onCancel={() => {}} />
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Metric Bar                                                           */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Metric Bar">
          <Row label="series / 65%">
            <div className="flex w-[280px] items-center gap-[var(--p-space-200)]">
              <MetricBar value={65} color={{ series: 1 }} label="Product Score" className="flex-1" />
              <span className="text-sm text-[var(--s-color-text-subtlest)]">65%</span>
            </div>
          </Row>
          <Row label="status / healthy">
            <div className="flex w-[280px] items-center gap-[var(--p-space-200)]">
              <MetricBar value={82} color={{ status: "healthy" }} label="Health score" className="flex-1" />
              <span className="text-sm text-[var(--s-color-text-subtlest)]">82%</span>
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Segmented Bar                                                        */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Segmented Bar">
          <Row label="status-3">
            <div className="w-[320px]">
              <SegmentedBar
                segments={[
                  { label: "At risk", value: 20, color: { status: "atrisk" } },
                  { label: "Neutral", value: 30, color: { status: "warning" } },
                  { label: "Healthy", value: 50, color: { status: "healthy" } },
                ]}
              />
            </div>
          </Row>
          <Row label="weighted-5">
            <div className="w-[320px]">
              <SegmentedBar
                segments={[
                  { label: "Adoption", value: 25, color: { series: 1 } },
                  { label: "Engagement", value: 25, color: { series: 2 } },
                  { label: "Retention", value: 25, color: { series: 3 } },
                  { label: "Support", value: 15, color: { series: 4 } },
                  { label: "NPS", value: 10, color: { series: 5 } },
                ]}
              />
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Bar Chart                                                            */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Bar Chart">
          <Row label="vertical / single">
            <div className="w-[360px]">
              <BarChart
                orientation="vertical"
                categoryKey="month"
                data={[
                  { month: "Jan", value: 40 },
                  { month: "Feb", value: 62 },
                  { month: "Mar", value: 55 },
                  { month: "Apr", value: 78 },
                ]}
                series={[{ key: "value", label: "Active users", color: { series: 1 } }]}
              />
            </div>
          </Row>
          <Row label="vertical / grouped">
            <div className="w-[360px]">
              <BarChart
                orientation="vertical"
                categoryKey="month"
                data={[
                  { month: "Jan", desktop: 40, mobile: 24 },
                  { month: "Feb", desktop: 62, mobile: 38 },
                  { month: "Mar", desktop: 55, mobile: 45 },
                ]}
                series={[
                  { key: "desktop", label: "Desktop", color: { series: 1 } },
                  { key: "mobile", label: "Mobile", color: { series: 2 } },
                ]}
              />
            </div>
          </Row>
          <Row label="horizontal / single">
            <div className="w-[360px]">
              <BarChart
                orientation="horizontal"
                categoryKey="cohort"
                data={[
                  { cohort: "Enterprise", value: 82 },
                  { cohort: "Mid-market", value: 61 },
                  { cohort: "SMB", value: 34 },
                ]}
                series={[{ key: "value", label: "Accounts", color: { series: 1 } }]}
              />
            </div>
          </Row>
          <Row label="horizontal / multi">
            <div className="w-[360px]">
              <BarChart
                orientation="horizontal"
                categoryKey="cohort"
                data={[
                  { cohort: "Enterprise", current: 82, prior: 70 },
                  { cohort: "Mid-market", current: 61, prior: 58 },
                  { cohort: "SMB", current: 34, prior: 40 },
                ]}
                series={[
                  { key: "current", label: "This quarter", color: { series: 1 } },
                  { key: "prior", label: "Last quarter", color: { series: 2 } },
                ]}
              />
            </div>
          </Row>
          <Row label="vertical / status-health">
            <div className="w-[360px]">
              <BarChart
                orientation="vertical"
                categoryKey="account"
                data={[
                  { account: "Acme", value: 82, health: "healthy" },
                  { account: "Globex", value: 45, health: "warning" },
                  { account: "Initech", value: 20, health: "atrisk" },
                  { account: "Umbrella", value: 90, health: "healthy" },
                ]}
                series={[{ key: "value", label: "Health score", color: { statusKey: "health" } }]}
              />
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Line Chart                                                           */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Line Chart">
          <Row label="single / line">
            <div className="w-[360px]">
              <LineChart
                categoryKey="day"
                data={[
                  { day: "Mon", value: 12 },
                  { day: "Tue", value: 18 },
                  { day: "Wed", value: 14 },
                  { day: "Thu", value: 22 },
                  { day: "Fri", value: 30 },
                ]}
                series={[{ key: "value", label: "Sessions", series: 1 }]}
              />
            </div>
          </Row>
          <Row label="single / area">
            <div className="w-[360px]">
              <LineChart
                area
                categoryKey="day"
                data={[
                  { day: "Mon", value: 12 },
                  { day: "Tue", value: 18 },
                  { day: "Wed", value: 14 },
                  { day: "Thu", value: 22 },
                  { day: "Fri", value: 30 },
                ]}
                series={[{ key: "value", label: "Sessions", series: 1 }]}
              />
            </div>
          </Row>
          <Row label="multi / line">
            <div className="w-[360px]">
              <LineChart
                categoryKey="day"
                data={[
                  { day: "Mon", active: 12, new: 4 },
                  { day: "Tue", active: 18, new: 6 },
                  { day: "Wed", active: 14, new: 5 },
                  { day: "Thu", active: 22, new: 9 },
                ]}
                series={[
                  { key: "active", label: "Active users", series: 1 },
                  { key: "new", label: "New users", series: 2 },
                ]}
              />
            </div>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Donut Chart                                                          */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Donut Chart">
          <Row label="status / 3 segments">
            <DonutChart
              size={160}
              centerLabel="248"
              centerSubLabel="Accounts"
              segments={[
                { label: "Healthy", value: 140, status: "healthy" },
                { label: "Warning", value: 68, status: "warning" },
                { label: "At risk", value: 40, status: "atrisk" },
              ]}
            />
          </Row>
          <Row label="series / 4 segments">
            <DonutChart
              size={160}
              segments={[
                { label: "Web", value: 45, series: 1 },
                { label: "Mobile", value: 30, series: 2 },
                { label: "API", value: 15, series: 3 },
                { label: "Other", value: 10, series: 4 },
              ]}
            />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Gauge Chart                                                          */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Gauge Chart">
          <Row label="NPS / healthy">
            <GaugeChart size={160} value={(72 + 100) / 200} status="healthy" label="72" />
          </Row>
          <Row label="NPS / warning">
            <GaugeChart size={160} value={(20 + 100) / 200} status="warning" label="20" />
          </Row>
          <Row label="NPS / at risk">
            <GaugeChart size={160} value={(-30 + 100) / 200} status="atrisk" label="-30" />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Heatmap                                                              */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Heatmap">
          <Row label="engagement / day × hour">
            <Heatmap
              rows={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
              columns={["6a", "9a", "12p", "3p", "6p", "9p"]}
              data={[
                [2, 5, 8, 12, 18, 6],
                [10, 30, 45, 60, 40, 12],
                [12, 35, 55, 62, 45, 15],
                [11, 32, 50, 58, 42, 14],
                [10, 30, 48, 55, 38, 12],
                [14, 40, 60, 68, 50, 18],
                [4, 8, 12, 18, 20, 8],
              ]}
              seriesColor={1}
            />
          </Row>
          <Row label="different series color">
            <Heatmap
              rows={["Mon", "Tue", "Wed", "Thu", "Fri"]}
              columns={["W1", "W2", "W3", "W4"]}
              data={[
                [100, 80, 60, 40],
                [90, 70, 50, 30],
                [80, 60, 40, 20],
                [70, 50, 30, 10],
                [60, 40, 20, 5],
              ]}
              seriesColor={3}
            />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* World Map                                                            */}
        {/* ------------------------------------------------------------------ */}
        <Section title="World Map">
          <Row label="global reach (10 countries highlighted)">
            <WorldMap
              width={720}
              height={280}
              activeCountryCodes={[
                "840", // USA
                "826", // GBR
                "276", // DEU
                "250", // FRA
                "036", // AUS
                "124", // CAN
                "356", // IND
                "076", // BRA
                "392", // JPN
                "702", // SGP
              ]}
            />
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Dropdown Menu                                                        */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Dropdown Menu">
          <Row label="standard">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="medium">Open menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Row>
          <Row label="with icons">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="medium">With icons</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem icon="edit">Edit</DropdownMenuItem>
                <DropdownMenuItem icon="copy">Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem icon="delete" destructive>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Row>
          <Row label="with selected">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="medium">With selection</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem selected>Active</DropdownMenuItem>
                <DropdownMenuItem>Inactive</DropdownMenuItem>
                <DropdownMenuItem>Draft</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Row>
          <Row label="disabled item">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="medium">Disabled item</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem disabled>Unavailable</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Avatar                                                               */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Avatar">
          <Row label="small">
            <Avatar size="small">
              <AvatarFallback>ZK</AvatarFallback>
            </Avatar>
          </Row>
          <Row label="medium (default)">
            <Avatar size="medium">
              <AvatarFallback>ZK</AvatarFallback>
            </Avatar>
            <Avatar size="medium">
              <AvatarImage src="https://i.pravatar.cc/48?img=3" alt="User avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Row>
          <Row label="large">
            <Avatar size="large">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar size="large">
              <AvatarImage src="https://i.pravatar.cc/64?img=5" alt="User avatar" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
          </Row>
          <Row label="broken src">
            <Avatar size="large">
              <AvatarImage src="/broken-url.jpg" alt="Broken avatar" />
              <AvatarFallback>FB</AvatarFallback>
            </Avatar>
          </Row>
        </Section>

        {/* ------------------------------------------------------------------ */}
        {/* Tooltip                                                              */}
        {/* ------------------------------------------------------------------ */}
        <Section title="Tooltip">
          <Row label="top (default)">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="medium">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>Tooltip label text</TooltipContent>
            </Tooltip>
          </Row>
          <Row label="bottom">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="medium">Bottom</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Tooltip bottom</TooltipContent>
            </Tooltip>
          </Row>
          <Row label="left / right">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="medium">Left</Button>
              </TooltipTrigger>
              <TooltipContent side="left">Tooltip left</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="medium">Right</Button>
              </TooltipTrigger>
              <TooltipContent side="right">Tooltip right</TooltipContent>
            </Tooltip>
          </Row>
        </Section>
      </div>
    </TooltipProvider>
  )
}

export { ValidationGallery }
