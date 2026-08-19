import * as React from "react"
import { PrismIcon } from "@/components/ui/prism-icon"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  /**
   * How multiple months are arranged when `numberOfMonths > 1`.
   * "vertical" (default) stacks them; "horizontal" places them side by side
   * separated by a 1px calendar-panel divider — the arrangement Figma's
   * Calendar Panel Mode=Custom Range Start/End pair uses (241px each + a
   * divider, per node 4084:64672).
   */
  monthsOrientation?: "vertical" | "horizontal"
}

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  monthsOrientation = "vertical",
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        // `relative` is load-bearing: the month nav below is absolutely
        // positioned with `inset-x-4 top-4` to flank the month caption, which
        // only lands correctly if THIS element is its containing block.
        // Without it the nav escaped to an outer ancestor and rendered as an
        // invisible full-width bar over whatever sat above the calendar —
        // in DateFilter that was the tab row, so its `pointer-events: auto`
        // silently swallowed every click on Custom Range / Rolling Window /
        // Fiscal Quarter, and its next-month chevron appeared beside the
        // "Fiscal Quarter" tab label.
        "relative",
        "p-[var(--c-datepicker-padding-panel)]",
        "bg-[var(--c-datepicker-panel-background)]",
        className
      )}
      classNames={{
        months:
          monthsOrientation === "horizontal"
            // Divider is scoped to `div + div` on purpose: the month nav is a
            // <nav> and is the FIRST child of this container, so `divide-x`
            // (or any `first:`-based rule) would border the nav instead of
            // falling cleanly between the two months. `border-[color:...]` is
            // also required over `divide-[...]`, which Tailwind parses as a
            // border-WIDTH and silently resolves to 0 for a colour value.
            ? "flex flex-row items-start [&>div+div]:border-l [&>div+div]:border-[color:var(--c-calendar-panel-divider-color)]"
            : "flex flex-col gap-4",
        // Widths come straight from the Figma symbols: Single/Range is 337px
        // wide with a 305px content column (16px root padding either side);
        // Custom Range Start/End are 241px wide with calendar-panel/content/
        // padding (12px) either side. Vertical rhythm is calendar-panel/gap
        // (8px), matching the 8px measured between nav, weekday row and weeks.
        month:
          monthsOrientation === "horizontal"
            ? "w-[241px] space-y-2 px-[var(--c-calendar-panel-content-padding)]"
            : "w-[305px] space-y-2",
        month_caption:
          "pointer-events-none relative flex h-6 items-center justify-center",
        // Month/year caption ("August 2026") is the Calendar Panel's own
        // header — bound to calendar-panel/header/font/* (14/24) — not
        // datepicker/header/font/* (18/24, SemiBold), which belongs to the
        // Fiscal Quarter "FY 2026" and "Q1"–"Q4" card labels instead
        // (confirmed via get_variable_defs on the real Presets panel node).
        //
        // Colour: the caption renders blue. Queried directly on the caption
        // text node (4084:64584), the only colour variable bound to it is
        // datepicker/preset/item/text/active (#0369E9) — there is no
        // calendar-panel/header/color token. Reusing a preset-item token for
        // the month caption is a naming smell on the Figma side, but it is
        // the actual binding, so it is what we follow rather than inventing a
        // token or hard-coding the hex. Revisit if a dedicated
        // calendar-panel/header/color is ever added.
        caption_label:
          "text-[length:var(--c-calendar-panel-header-font-size)] font-semibold leading-[var(--c-calendar-panel-header-font-line-height)] text-[var(--c-datepicker-preset-item-text-active)]",
        // month-nav frame measures x=16 y=12 h=24 with 16px chevrons.
        nav: "absolute inset-x-4 top-3 z-10 flex h-6 items-center justify-between",
        button_previous:
          "pointer-events-auto inline-flex size-6 cursor-pointer items-center justify-center rounded-[var(--c-calendar-panel-day-radius)] outline-none hover:bg-[var(--c-datepicker-day-bg-hover)] focus-visible:shadow-[var(--e-shadow-focus)] focus:not-focus-visible:shadow-none",
        button_next:
          "pointer-events-auto inline-flex size-6 cursor-pointer items-center justify-center rounded-[var(--c-calendar-panel-day-radius)] outline-none hover:bg-[var(--c-datepicker-day-bg-hover)] focus-visible:shadow-[var(--e-shadow-focus)] focus:not-focus-visible:shadow-none",
        month_grid: "w-full border-collapse",
        // Weekday row is separated from the weeks by a 1px rule (the
        // `divider` rounded-rectangle at y=76 in the Figma symbol).
        weekdays:
          "flex w-full justify-between border-b border-[color:var(--c-calendar-panel-divider-color)] pb-2",
        // Weekday row (Su/Mo/Tu...) has its own dedicated token
        // (datepicker/weekday/font/*, 11/16) — distinct from
        // datepicker/label/font/* (also 11px, but 600 weight, used for
        // Rolling Window preview text / Fiscal Quarter date ranges instead).
        weekday:
          "w-6 text-center text-[length:var(--c-datepicker-weekday-font-size)] font-normal leading-[var(--c-datepicker-weekday-font-line-height)] text-[var(--c-calendar-panel-text-subtle)]",
        // Day cells are 24x24 and DO NOT touch — the Figma grid spreads seven
        // 24px cells across the full content width (305px for Single/Range),
        // so each day renders as its own discrete rounded square. Never let
        // them abut or the range fill reads as one merged band, which is not
        // what the design shows.
        week: "mt-2 flex w-full justify-between",
        day: "relative size-6 p-0 text-center",
        day_button:
          "inline-flex size-6 cursor-pointer items-center justify-center rounded-[var(--c-calendar-panel-day-radius)] text-[length:var(--c-datepicker-cell-font-size)] font-[var(--c-datepicker-cell-font-weight)] leading-[var(--c-datepicker-cell-font-line-height)] text-[var(--c-datepicker-day-text-default)] outline-none hover:bg-[var(--c-datepicker-day-bg-hover)] focus-visible:ring-2 focus-visible:ring-[var(--c-datepicker-input-focus-ring-color)]",
        // Range caps (and a single selected day) are a solid blue square with
        // white text — Figma's `day-range-cap`.
        selected:
          "[&>button]:bg-[var(--c-datepicker-day-bg-selected)] [&>button]:text-[var(--c-datepicker-day-text-selected)] [&>button:hover]:bg-[var(--c-datepicker-day-bg-selected)] [&>button:hover]:text-[var(--c-datepicker-day-text-selected)]",
        today:
          "[&>button]:border [&>button]:border-[var(--c-datepicker-day-border-today)] [&>button]:bg-[var(--c-datepicker-day-bg-default)] [&>button]:text-[var(--c-datepicker-input-content-value)]",
        outside: "text-muted-foreground opacity-50",
        disabled: "[&>button]:text-[var(--c-calendar-panel-text-disabled)]",
        // In-range days (Figma `day-in-range`) each keep their own 4px rounded
        // square with the light in-range tint and blue text — they are NOT
        // joined into a continuous band. The `!` is required because DayPicker
        // also applies the base `selected` modifier to every day inside a
        // range, whose solid-blue button background would otherwise cover
        // this tint.
        range_middle:
          "[&>button]:!bg-[var(--c-datepicker-day-bg-in-range)] [&>button]:!text-[var(--c-datepicker-day-text-active)] [&>button:hover]:!bg-[var(--c-datepicker-day-bg-in-range)]",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <PrismIcon
              name="chevron-left"
              size={16}
              className="text-[var(--s-icon-color-default)]"
            />
          ) : (
            <PrismIcon
              name="chevron-right"
              size={16}
              className="text-[var(--s-icon-color-default)]"
            />
          ),
      }}
      {...props}
    />
  )
}

export { Calendar }
