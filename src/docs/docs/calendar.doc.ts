import type { ComponentDoc } from "@/docs/types"

// No Figma node id found in the component's header comment — it references
// several Figma node ids for sub-parts of DatePicker/DateFilter panels
// (e.g. 4084:64672) but none for Calendar itself as a standalone component,
// so figmaNodeId is omitted rather than guessed.
export const calendarDoc: ComponentDoc = {
  slug: "calendar",
  name: "Calendar",
  status: "stable",
  description:
    "A month grid for picking single dates or ranges, built on react-day-picker and styled with the datepicker/calendar-panel Prism tokens.",
  sourcePath: "src/components/ui/calendar.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Calendar wraps react-day-picker's DayPicker directly — every DayPicker prop (`mode`, `selected`, `onSelect`, `numberOfMonths`, etc.) is supported. `showOutsideDays` defaults to false, unlike DayPicker's own default. In practice, most screens consume Calendar indirectly through DatePicker or DateFilter, which supply the trigger and popover shell around it — but it renders correctly standalone too, as shown here.",
      exampleId: "calendar/default",
    },
    {
      id: "range",
      title: "Range selection",
      body:
        "Set `mode=\"range\"` and manage a `DateRange` (`{ from, to }`) via `selected`/`onSelect`. Range caps and single selected days render as a solid square; days strictly between the caps get a lighter in-range tint and stay visually distinct rather than merging into one band.",
      exampleId: "calendar/range",
    },
    {
      id: "horizontal-months",
      title: "Horizontal multi-month layout",
      body:
        "With `numberOfMonths > 1`, `monthsOrientation` controls arrangement: \"vertical\" (default) stacks the months; \"horizontal\" places them side by side separated by a 1px divider — the layout used by the Custom Range Start/End preset pair.",
      exampleId: "calendar/horizontal-months",
    },
  ],

  props: [
    {
      name: "monthsOrientation",
      type: '"vertical" | "horizontal"',
      defaultValue: '"vertical"',
      description: "Arrangement of months when numberOfMonths > 1. See Horizontal multi-month layout.",
    },
    {
      name: "showOutsideDays",
      type: "boolean",
      defaultValue: "false",
      description: "Whether to render days from adjacent months to fill the grid. Overrides DayPicker's own default of true.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the DayPicker root. Note: `relative` on this root is load-bearing for positioning the month nav — don't strip it.",
    },
    {
      name: "classNames",
      type: "DayPicker classNames",
      description: "Merged on top of Calendar's own part classNames (months, month, nav, day, etc.); Calendar's own classes still apply where not overridden.",
    },
    {
      name: "...props",
      type: "React.ComponentProps<typeof DayPicker>",
      description: "Any other react-day-picker prop, e.g. mode, selected, onSelect, disabled, fromDate, toDate.",
    },
  ],

  tokens: [
    "--c-calendar-panel-content-padding",
    "--c-calendar-panel-day-radius",
    "--c-calendar-panel-divider-color",
    "--c-calendar-panel-header-font-line-height",
    "--c-calendar-panel-header-font-size",
    "--c-calendar-panel-text-disabled",
    "--c-calendar-panel-text-subtle",
    "--c-datepicker-cell-font-line-height",
    "--c-datepicker-cell-font-size",
    "--c-datepicker-cell-font-weight",
    "--c-datepicker-day-bg-default",
    "--c-datepicker-day-bg-hover",
    "--c-datepicker-day-bg-in-range",
    "--c-datepicker-day-bg-selected",
    "--c-datepicker-day-border-today",
    "--c-datepicker-day-text-active",
    "--c-datepicker-day-text-default",
    "--c-datepicker-day-text-selected",
    "--c-datepicker-input-content-value",
    "--c-datepicker-input-focus-ring-color",
    "--c-datepicker-panel-background",
    "--c-datepicker-padding-panel",
    "--c-datepicker-preset-item-text-active",
    "--c-datepicker-weekday-font-line-height",
    "--c-datepicker-weekday-font-size",
    "--e-shadow-focus",
    "--s-icon-color-default",
  ],

  guidelines: {
    dos: [
      "Prefer DatePicker or DateFilter for a field-triggered calendar — they compose Calendar with the right popover shell.",
      "Use `monthsOrientation=\"horizontal\"` for a Custom Range start/end pair; keep the default vertical stack for a single wide month list.",
      "Manage `selected` state explicitly for range mode — Calendar does not track selection internally.",
    ],
    donts: [
      "Don't strip the `relative` class via className overrides — the month nav is absolutely positioned against it and will escape to an ancestor if removed.",
      "Don't let in-range days visually merge into one band; the light tint on each day is intentional, not a bug to \"fix\" with a continuous background.",
      "Don't reach for the caption color token from elsewhere — the month caption's blue color comes from a verified (if oddly-named) datepicker preset-item token, not a dedicated calendar-panel header color token.",
    ],
  },
}
