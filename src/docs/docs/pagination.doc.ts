import type { ComponentDoc } from "@/docs/types"

export const paginationDoc: ComponentDoc = {
  slug: "pagination",
  name: "Pagination",
  status: "stable",
  description:
    "A table footer control combining a rows-per-page picker, item range summary, and page-step navigation.",
  sourcePath: "src/components/ui/pagination.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Pagination is a fully controlled component — it owns no state itself. It shows the current item range, a rows-per-page select, the current page number, and Previous/Next controls that call `onPageChange` with the next page clamped to [1, pageCount].",
      exampleId: "pagination/default",
    },
    {
      id: "boundaries",
      title: "First and last page",
      body:
        "Previous disables automatically when `page <= 1` and Next disables when `page >= pageCount` — there's no separate disabled prop to manage; both derive from the page/pageCount you pass in.",
      exampleId: "pagination/boundaries",
    },
    {
      id: "page-size-options",
      title: "Custom page size options",
      body:
        "`pageSizeOptions` replaces the default [10, 25, 50] list entirely. Pair a page-size change with resetting to page 1, since the current page may no longer be valid at the new size.",
      exampleId: "pagination/page-size-options",
    },
  ],

  props: [
    {
      name: "page",
      type: "number",
      required: true,
      description: "The current 1-indexed page.",
    },
    {
      name: "pageCount",
      type: "number",
      required: true,
      description: "Total number of pages, used to clamp navigation and disable Next at the boundary.",
    },
    {
      name: "pageSize",
      type: "number",
      required: true,
      description: "Rows per page — must match one of `pageSizeOptions` to display correctly in the select.",
    },
    {
      name: "totalItems",
      type: "number",
      required: true,
      description: "Total row count across all pages, used to compute and display the item range.",
    },
    {
      name: "pageSizeOptions",
      type: "number[]",
      defaultValue: "[10, 25, 50]",
      description: "Options offered in the rows-per-page select.",
    },
    {
      name: "onPageChange",
      type: "(page: number) => void",
      required: true,
      description: "Called with the next page, already clamped to [1, pageCount], from Previous/Next.",
    },
    {
      name: "onPageSizeChange",
      type: "(pageSize: number) => void",
      description: "Called when the rows-per-page select changes. Omit to hide page-size change handling.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the outer row.",
    },
  ],

  tokens: [
    "--c-pagination-background",
    "--c-pagination-content-default",
    "--c-pagination-content-subtle",
    "--c-pagination-divider",
    "--c-pagination-font-line-height",
    "--c-pagination-font-size",
    "--c-pagination-font-weight",
    "--c-pagination-font-weight-strong",
    "--c-pagination-gap",
    "--c-pagination-icon-default",
    "--c-pagination-icon-disabled",
    "--c-pagination-padding-horizontal",
    "--c-pagination-per-page-gap",
    "--c-pagination-pill-background-active",
    "--c-pagination-pill-background-hover",
    "--c-pagination-pill-border-active",
    "--c-pagination-pill-content",
    "--c-pagination-pill-radius",
    "--c-table-pagination-height",
  ],

  guidelines: {
    dos: [
      "Keep Pagination fully controlled — drive `page` and `pageSize` from the caller's own state.",
      "Reset to page 1 when `onPageSizeChange` fires, since the current page may fall outside the new page count.",
      "Reuse this component for every table-driven PX screen rather than building a bespoke page-step control.",
    ],
    donts: [
      "Don't compute `pageCount` incorrectly against `totalItems`/`pageSize` — Previous/Next rely on it to disable at the right boundary.",
      "Don't pass a `pageSize` that isn't included in `pageSizeOptions`; the select won't show the correct selected value.",
      "Don't restyle the current-page pill or nav buttons via className — their radius, hover and focus states come from --c-pagination-pill-* tokens.",
    ],
  },
}
