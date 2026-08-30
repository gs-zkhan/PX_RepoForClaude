import * as React from "react"

import type { ComponentDoc, DocNavGroup } from "@/docs/types"
import { accordionDoc } from "@/docs/docs/accordion.doc"
import { avatarDoc } from "@/docs/docs/avatar.doc"
import { bannerDoc } from "@/docs/docs/banner.doc"
import { barChartDoc } from "@/docs/docs/bar-chart.doc"
import { breadcrumbDoc } from "@/docs/docs/breadcrumb.doc"
import { buttonDoc } from "@/docs/docs/button.doc"
import { calendarDoc } from "@/docs/docs/calendar.doc"
import { canvasCardDoc } from "@/docs/docs/canvas-card.doc"
import { cardDoc } from "@/docs/docs/card.doc"
import { checkboxDoc } from "@/docs/docs/checkbox.doc"
import { columnSelectorDoc } from "@/docs/docs/column-selector.doc"
import { configRowDoc } from "@/docs/docs/config-row.doc"
import { dateFieldDoc } from "@/docs/docs/date-field.doc"
import { dateFilterDoc } from "@/docs/docs/date-filter.doc"
import { datePickerDoc } from "@/docs/docs/date-picker.doc"
import { dividerDoc } from "@/docs/docs/divider.doc"
import { donutChartDoc } from "@/docs/docs/donut-chart.doc"
import { dragHandleDoc } from "@/docs/docs/drag-handle.doc"
import { dropdownFieldDoc } from "@/docs/docs/dropdown-field.doc"
import { dropdownMenuDoc } from "@/docs/docs/dropdown-menu.doc"
import { emptyStateDoc } from "@/docs/docs/empty-state.doc"
import { fileUploaderDoc } from "@/docs/docs/file-uploader.doc"
import { filterBarDoc } from "@/docs/docs/filter-bar.doc"
import { filterChipDoc } from "@/docs/docs/filter-chip.doc"
import { filterConfigModalDoc } from "@/docs/docs/filter-config-modal.doc"
import { filterDropdownPanelDoc } from "@/docs/docs/filter-dropdown-panel.doc"
import { gaugeChartDoc } from "@/docs/docs/gauge-chart.doc"
import { heatmapDoc } from "@/docs/docs/heatmap.doc"
import { iconButtonDoc } from "@/docs/docs/icon-button.doc"
import { inputDoc } from "@/docs/docs/input.doc"
import { inputNumberDoc } from "@/docs/docs/input-number.doc"
import { letterDoc } from "@/docs/docs/letter.doc"
import { lineChartDoc } from "@/docs/docs/line-chart.doc"
import { linkDoc } from "@/docs/docs/link.doc"
import { metricBarDoc } from "@/docs/docs/metric-bar.doc"
import { modalDoc } from "@/docs/docs/modal.doc"
import { paginationDoc } from "@/docs/docs/pagination.doc"
import { popoverDoc } from "@/docs/docs/popover.doc"
import { prismIconDoc } from "@/docs/docs/prism-icon.doc"
import { pxAnalyticsSecondaryNavDoc } from "@/docs/docs/px-analytics-secondary-nav.doc"
import { progressBarDoc } from "@/docs/docs/progress-bar.doc"
import { radioGroupDoc } from "@/docs/docs/radio-group.doc"
import { searchBarDoc } from "@/docs/docs/search-bar.doc"
import { segmentedBarDoc } from "@/docs/docs/segmented-bar.doc"
import { selectDoc } from "@/docs/docs/select.doc"
import { skeletonDoc } from "@/docs/docs/skeleton.doc"
import { sliderDoc } from "@/docs/docs/slider.doc"
import { spinnerDoc } from "@/docs/docs/spinner.doc"
import { statusLabelDoc } from "@/docs/docs/status-label.doc"
import { statusSelectDoc } from "@/docs/docs/status-select.doc"
import { summaryStatDoc } from "@/docs/docs/summary-stat.doc"
import { tableDoc } from "@/docs/docs/table.doc"
import { tabsDoc } from "@/docs/docs/tabs.doc"
import { textareaDoc } from "@/docs/docs/textarea.doc"
import { textFieldDoc } from "@/docs/docs/text-field.doc"
import { thirdPaneDoc } from "@/docs/docs/third-pane.doc"
import { toastDoc } from "@/docs/docs/toast.doc"
import { toggleDoc } from "@/docs/docs/toggle.doc"
import { tooltipDoc } from "@/docs/docs/tooltip.doc"
import { treeDoc } from "@/docs/docs/tree.doc"
import { viewSelectorDoc } from "@/docs/docs/view-selector.doc"
import { viewSwitcherDoc } from "@/docs/docs/view-switcher.doc"
import { viewsDoc } from "@/docs/docs/views.doc"
import { wizardDoc } from "@/docs/docs/wizard.doc"
import { worldMapDoc } from "@/docs/docs/world-map.doc"

// -----------------------------------------------------------------------------
// Docs registry.
//
// `examples` and `exampleSources` glob the SAME files. The page renders the
// module and prints the raw text, so the snippet on screen is always the code
// that just executed — there is no second copy to fall out of date. This is the
// same ?raw glob pattern PrismIcon uses for SVGs.
//
// Both globs are eager: the docs site is a small internal surface and eager
// loading keeps the page synchronous (no loading states, no Suspense). If this
// grows past ~50 documented components, switch the component glob to lazy.
// -----------------------------------------------------------------------------

type ExampleModule = { default: React.ComponentType }

const examples = import.meta.glob<ExampleModule>("/src/docs/examples/**/*.tsx", {
  eager: true,
})

const exampleSources = import.meta.glob<string>("/src/docs/examples/**/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
})

function keyFor(exampleId: string) {
  return `/src/docs/examples/${exampleId}.tsx`
}

/** The rendered example component, or null when the id doesn't resolve. */
export function getExampleComponent(exampleId: string): React.ComponentType | null {
  return examples[keyFor(exampleId)]?.default ?? null
}

/**
 * The example's on-disk source. Trailing newline trimmed so the code block
 * doesn't render a blank final line.
 */
export function getExampleSource(exampleId: string): string | null {
  const raw = exampleSources[keyFor(exampleId)]
  return raw ? raw.replace(/\s+$/, "") : null
}

const allDocs: ComponentDoc[] = [
  accordionDoc,
  avatarDoc,
  bannerDoc,
  barChartDoc,
  breadcrumbDoc,
  buttonDoc,
  calendarDoc,
  canvasCardDoc,
  cardDoc,
  checkboxDoc,
  columnSelectorDoc,
  configRowDoc,
  dateFieldDoc,
  dateFilterDoc,
  datePickerDoc,
  dividerDoc,
  donutChartDoc,
  dragHandleDoc,
  dropdownFieldDoc,
  dropdownMenuDoc,
  emptyStateDoc,
  fileUploaderDoc,
  filterBarDoc,
  filterChipDoc,
  filterConfigModalDoc,
  filterDropdownPanelDoc,
  gaugeChartDoc,
  heatmapDoc,
  iconButtonDoc,
  inputDoc,
  inputNumberDoc,
  letterDoc,
  lineChartDoc,
  linkDoc,
  metricBarDoc,
  modalDoc,
  paginationDoc,
  popoverDoc,
  prismIconDoc,
  pxAnalyticsSecondaryNavDoc,
  progressBarDoc,
  radioGroupDoc,
  searchBarDoc,
  segmentedBarDoc,
  selectDoc,
  skeletonDoc,
  sliderDoc,
  spinnerDoc,
  statusLabelDoc,
  statusSelectDoc,
  summaryStatDoc,
  tableDoc,
  tabsDoc,
  textareaDoc,
  textFieldDoc,
  thirdPaneDoc,
  toastDoc,
  toggleDoc,
  tooltipDoc,
  treeDoc,
  viewSelectorDoc,
  viewSwitcherDoc,
  viewsDoc,
  wizardDoc,
  worldMapDoc,
]

/** Every documented component, keyed by slug. */
export const componentDocs: Record<string, ComponentDoc> = Object.fromEntries(
  allDocs.map((doc) => [doc.slug, doc]),
)

function navItem(doc: ComponentDoc) {
  return { slug: doc.slug, name: doc.name, status: doc.status }
}

/**
 * Left-nav structure. Groups are functional groupings of the ui/ catalogue,
 * not the ShadCN/Prism/pattern layering in CLAUDE.md — every doc here is a
 * typed Prism component; composed Px* patterns are generally out of scope
 * for this docs system (README + shell-registry.md + Validation Gallery
 * cover them instead). PxAnalyticsSecondaryNav is a deliberate, explicitly-
 * requested exception in the "Navigation" group below — its Figma evidence,
 * API and accessibility model are substantial enough to warrant a full doc
 * page. This is a one-off exception, not a blanket policy change: other
 * patterns (PxListShell, PxCreateEditShell, PxMainContainer) remain
 * README-only. Components without a doc yet are intentionally absent rather
 * than linked to an empty page.
 */
export const navGroups: DocNavGroup[] = [
  {
    title: "Actions & Controls",
    items: [buttonDoc, iconButtonDoc, toggleDoc, sliderDoc, dragHandleDoc].map(navItem),
  },
  {
    title: "Form Fields",
    items: [
      inputDoc,
      inputNumberDoc,
      textFieldDoc,
      textareaDoc,
      dateFieldDoc,
      datePickerDoc,
      dropdownFieldDoc,
      selectDoc,
      checkboxDoc,
      radioGroupDoc,
      searchBarDoc,
      fileUploaderDoc,
    ].map(navItem),
  },
  {
    title: "Filtering",
    items: [
      filterBarDoc,
      filterChipDoc,
      filterConfigModalDoc,
      filterDropdownPanelDoc,
      dateFilterDoc,
      columnSelectorDoc,
    ].map(navItem),
  },
  {
    title: "Navigation",
    items: [
      tabsDoc,
      breadcrumbDoc,
      paginationDoc,
      wizardDoc,
      thirdPaneDoc,
      viewSelectorDoc,
      viewSwitcherDoc,
      viewsDoc,
      pxAnalyticsSecondaryNavDoc,
      linkDoc,
    ].map(navItem),
  },
  {
    title: "Overlays & Feedback",
    items: [
      modalDoc,
      popoverDoc,
      tooltipDoc,
      dropdownMenuDoc,
      toastDoc,
      bannerDoc,
      emptyStateDoc,
      spinnerDoc,
      skeletonDoc,
    ].map(navItem),
  },
  {
    title: "Data Display",
    items: [
      tableDoc,
      configRowDoc,
      treeDoc,
      avatarDoc,
      letterDoc,
      statusLabelDoc,
      statusSelectDoc,
      summaryStatDoc,
      metricBarDoc,
      progressBarDoc,
      segmentedBarDoc,
      calendarDoc,
      canvasCardDoc,
      cardDoc,
    ].map(navItem),
  },
  {
    title: "Charts & Visualization",
    items: [barChartDoc, lineChartDoc, donutChartDoc, gaugeChartDoc, heatmapDoc, worldMapDoc].map(
      navItem,
    ),
  },
  {
    title: "Foundations",
    items: [prismIconDoc, accordionDoc, dividerDoc].map(navItem),
  },
]

export function getDoc(slug: string): ComponentDoc | null {
  return componentDocs[slug] ?? null
}
