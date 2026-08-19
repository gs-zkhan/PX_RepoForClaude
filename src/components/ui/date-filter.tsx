import * as React from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PrismIcon } from "@/components/ui/prism-icon"
import { IconButton } from "@/components/ui/icon-button"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"

// -----------------------------------------------------------------------------
// DateFilter — Figma "Date · Time Picker" page (node 1273:12), Prism V1 -
// ShadCN. Rebuilt against the real "Date Range Filter" component anatomy
// after the design team split DatePicker and DateFilter into two separate
// Figma components that share the `datepicker/*` and `calendar-panel/*`
// component token namespaces (confirmed via the page's own AI-instructions:
// "The two share a trigger shell and panel container but serve fundamentally
// different goals").
//
// Trigger: 320px wide, calendar icon + label + chevron, same textfield-style
// shell as DatePicker (--c-datepicker-input-*).
//
// Panel (df-panel): radius/150 (12px), --c-datepicker-panel-background/
// -border, shadow = --p-shadow-500 (0 20px 40px rgba(24,31,38,0.16)) — a
// primitive shadow token, verified as the exact match; NOT --e-shadow-500
// (a different, lighter elevation token used elsewhere).
//
// Tab bar: Presets | Custom Range | Rolling Window | Fiscal Quarter — the
// shared Tabs component, Secondary/Large (pill-style active background),
// verified against the assembled screenshot showing "Presets" active as a
// solid pill, not an underline.
//
// Four modes, each a real Figma source component:
//   Presets       — Preset List (160px, 11 static presets) | divider |
//                   Calendar (range mode, single month)
//   Custom Range  — Calendar (range mode, 2 months) + a start/end date
//                   readout row with an arrow between
//   Rolling Window — stepper (−/value/+) + unit chips (Days/Weeks/Months)
//                    + a resolved-range preview line
//   Fiscal Quarter — year nav + 2x2 quarter grid, active quarter gets a
//                    blue border/background/label
// Apply Row (Cancel + Apply, right-aligned) is always the last child,
// verified as a standalone 498x44 source component sitting flush below
// whichever mode is active.
// -----------------------------------------------------------------------------

type DateFilterMode = "presets" | "custom" | "rolling" | "fiscal"
type RollingUnit = "days" | "weeks" | "months"

type DateFilterPresetKey =
  | "today"
  | "yesterday"
  | "last-7"
  | "last-30"
  | "last-90"
  | "this-month"
  | "last-month"
  | "this-quarter"
  | "last-quarter"
  | "this-year"
  | "last-year"

type DateFilterValue =
  | { mode: "presets"; label: string; preset: DateFilterPresetKey; range: DateRange }
  | { mode: "custom"; label: string; range: DateRange }
  | { mode: "rolling"; label: string; rolling: { value: number; unit: RollingUnit }; range: DateRange }
  | { mode: "fiscal"; label: string; fiscal: { year: number; quarter: 1 | 2 | 3 | 4 }; range: DateRange }

type DateFilterProps = {
  value?: DateFilterValue | null
  onChange?: (value: DateFilterValue) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

const PRESETS: Array<{ key: DateFilterPresetKey; label: string; resolve: () => DateRange }> = [
  { key: "today", label: "Today", resolve: () => { const t = new Date(); return { from: t, to: t } } },
  { key: "yesterday", label: "Yesterday", resolve: () => { const d = new Date(); d.setDate(d.getDate() - 1); return { from: d, to: d } } },
  { key: "last-7", label: "Last 7 days", resolve: () => { const to = new Date(); const from = new Date(); from.setDate(from.getDate() - 6); return { from, to } } },
  { key: "last-30", label: "Last 30 days", resolve: () => { const to = new Date(); const from = new Date(); from.setDate(from.getDate() - 29); return { from, to } } },
  { key: "last-90", label: "Last 90 days", resolve: () => { const to = new Date(); const from = new Date(); from.setDate(from.getDate() - 89); return { from, to } } },
  { key: "this-month", label: "This month", resolve: () => { const to = new Date(); const from = new Date(to.getFullYear(), to.getMonth(), 1); return { from, to } } },
  { key: "last-month", label: "Last month", resolve: () => { const now = new Date(); const from = new Date(now.getFullYear(), now.getMonth() - 1, 1); const to = new Date(now.getFullYear(), now.getMonth(), 0); return { from, to } } },
  { key: "this-quarter", label: "This quarter", resolve: () => { const now = new Date(); const qStart = Math.floor(now.getMonth() / 3) * 3; return { from: new Date(now.getFullYear(), qStart, 1), to: now } } },
  { key: "last-quarter", label: "Last quarter", resolve: () => { const now = new Date(); const qStart = Math.floor(now.getMonth() / 3) * 3 - 3; return { from: new Date(now.getFullYear(), qStart, 1), to: new Date(now.getFullYear(), qStart + 3, 0) } } },
  { key: "this-year", label: "This year", resolve: () => { const now = new Date(); return { from: new Date(now.getFullYear(), 0, 1), to: now } } },
  { key: "last-year", label: "Last year", resolve: () => { const now = new Date(); return { from: new Date(now.getFullYear() - 1, 0, 1), to: new Date(now.getFullYear() - 1, 11, 31) } } },
]

const UNIT_LABEL: Record<RollingUnit, string> = { days: "Days", weeks: "Weeks", months: "Months" }

function resolveRolling(value: number, unit: RollingUnit): DateRange {
  const to = new Date()
  const from = new Date()
  if (unit === "days") from.setDate(from.getDate() - (value - 1))
  else if (unit === "weeks") from.setDate(from.getDate() - (value * 7 - 1))
  else from.setMonth(from.getMonth() - value)
  return { from, to }
}

function quarterRange(year: number, quarter: 1 | 2 | 3 | 4): DateRange {
  const startMonth = (quarter - 1) * 3
  return { from: new Date(year, startMonth, 1), to: new Date(year, startMonth + 3, 0) }
}

const QUARTERS: Array<{ q: 1 | 2 | 3 | 4; label: string }> = [
  { q: 1, label: "Q1" },
  { q: 2, label: "Q2" },
  { q: 3, label: "Q3" },
  { q: 4, label: "Q4" },
]

function DateFilter({ value, onChange, placeholder = "Select a date range", disabled = false, className }: DateFilterProps) {
  const [open, setOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<DateFilterMode>(value?.mode ?? "presets")

  const [presetRange, setPresetRange] = React.useState<DateRange | undefined>(
    value?.mode === "presets" ? value.range : PRESETS.find((p) => p.key === "last-30")!.resolve(),
  )
  const [activePreset, setActivePreset] = React.useState<DateFilterPresetKey>(
    value?.mode === "presets" ? value.preset : "last-30",
  )

  const [customRange, setCustomRange] = React.useState<DateRange | undefined>(
    value?.mode === "custom" ? value.range : undefined,
  )

  // Controlled `month` (not `defaultMonth`, which only seeds the initial
  // render): per the Figma "Do" rule "Match calendar state to the active
  // preset — when 'Last 30 days' is active, Calendar Panel must use Mode=Range
  // with all 30 days highlighted", the visible month must follow whichever
  // preset/range is currently active, not just the day it first opened on.
  const [presetMonth, setPresetMonth] = React.useState<Date | undefined>(presetRange?.to)
  const [customMonth, setCustomMonth] = React.useState<Date | undefined>(customRange?.from ?? new Date())

  const [rollingValue, setRollingValue] = React.useState(value?.mode === "rolling" ? value.rolling.value : 30)
  const [rollingUnit, setRollingUnit] = React.useState<RollingUnit>(value?.mode === "rolling" ? value.rolling.unit : "days")

  const now = new Date()
  const [fiscalYear, setFiscalYear] = React.useState(value?.mode === "fiscal" ? value.fiscal.year : now.getFullYear())
  const [fiscalQuarter, setFiscalQuarter] = React.useState<1 | 2 | 3 | 4>(
    value?.mode === "fiscal" ? value.fiscal.quarter : ((Math.floor(now.getMonth() / 3) + 1) as 1 | 2 | 3 | 4),
  )

  const triggerLabel = value?.label ?? placeholder

  const commit = (next: DateFilterValue) => {
    onChange?.(next)
    setOpen(false)
  }

  const handleApplyPresets = () => {
    if (!presetRange?.from) return
    const to = presetRange.to ?? presetRange.from
    commit({
      mode: "presets",
      preset: activePreset,
      range: { from: presetRange.from, to },
      label: PRESETS.find((p) => p.key === activePreset)?.label ?? "Custom",
    })
  }

  const handleApplyCustom = () => {
    if (!customRange?.from || !customRange.to) return
    commit({
      mode: "custom",
      range: customRange,
      label: `${format(customRange.from, "MMM d, yyyy")} – ${format(customRange.to, "MMM d, yyyy")}`,
    })
  }

  const handleApplyRolling = () => {
    const range = resolveRolling(rollingValue, rollingUnit)
    commit({
      mode: "rolling",
      rolling: { value: rollingValue, unit: rollingUnit },
      range,
      label: `Last ${rollingValue} ${UNIT_LABEL[rollingUnit].toLowerCase()}`,
    })
  }

  const handleApplyFiscal = () => {
    const range = quarterRange(fiscalYear, fiscalQuarter)
    commit({
      mode: "fiscal",
      fiscal: { year: fiscalYear, quarter: fiscalQuarter },
      range,
      label: `Q${fiscalQuarter} FY${fiscalYear}`,
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "group inline-flex h-8 w-[320px] items-center justify-between border outline-none transition-colors",
            "rounded-[var(--c-datepicker-input-radius)]",
            "border-[length:var(--c-datepicker-input-border-width)] border-[var(--c-datepicker-input-border-default)]",
            "bg-[var(--c-datepicker-input-background-default)]",
            "pl-[var(--c-datepicker-input-padding-left)] pr-[var(--c-datepicker-input-padding-right)]",
            "hover:border-[var(--c-datepicker-input-border-hover)]",
            "focus-visible:border-[var(--c-datepicker-input-border-focus)]",
            disabled && "cursor-not-allowed border-[var(--c-datepicker-input-border-disabled)] bg-[var(--c-datepicker-input-background-disabled)]",
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-[var(--c-datepicker-gap-trigger)]">
            <PrismIcon
              name="calendar"
              size={16}
              sourceSize={24}
              decorative
              className={disabled ? "shrink-0 text-[var(--c-datepicker-icon-color-disabled)]" : "shrink-0 text-[var(--c-datepicker-icon-color-default)]"}
            />
            <span
              className={cn(
                "truncate text-[length:var(--c-datepicker-button-font-size)] font-[number:var(--c-datepicker-button-font-weight)] leading-[var(--c-datepicker-button-font-line-height)]",
                disabled
                  ? "text-[var(--c-datepicker-input-content-disabled)]"
                  : value
                    ? "text-[var(--c-datepicker-input-content-value)]"
                    : "text-[var(--c-datepicker-input-content-placeholder)]",
              )}
            >
              {triggerLabel}
            </span>
          </span>
          <PrismIcon
            name={open ? "chevron-up" : "chevron-down"}
            size={16}
            sourceSize={24}
            decorative
            className={disabled ? "shrink-0 text-[var(--c-datepicker-icon-color-disabled)]" : "shrink-0 text-[var(--c-datepicker-icon-color-default)]"}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-auto rounded-[var(--c-datepicker-panel-radius)] border-[var(--c-datepicker-panel-border)] bg-[var(--c-datepicker-panel-background)] p-0 shadow-[var(--p-shadow-500)]"
      >
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DateFilterMode)}>
          <div className="px-[var(--c-datepicker-padding-item)] pt-[var(--c-datepicker-padding-item)]">
            <TabsList variant="secondary" size="large">
              <TabsTrigger value="presets">Presets</TabsTrigger>
              <TabsTrigger value="custom">Custom Range</TabsTrigger>
              <TabsTrigger value="rolling">Rolling Window</TabsTrigger>
              <TabsTrigger value="fiscal">Fiscal Quarter</TabsTrigger>
            </TabsList>
          </div>

          {/* ---- Presets: preset list | divider | range calendar ---- */}
          <TabsContent value="presets" className="flex">
            <ul className="flex h-[352px] w-[160px] shrink-0 flex-col overflow-y-auto py-[var(--p-space-100)]">
              {PRESETS.map((preset) => {
                const active = preset.key === activePreset
                return (
                  <li key={preset.key}>
                    <button
                      type="button"
                      onClick={() => {
                        const range = preset.resolve()
                        setActivePreset(preset.key)
                        setPresetRange(range)
                        setPresetMonth(range.to)
                      }}
                      className={cn(
                        "w-full px-[var(--c-datepicker-padding-item)] py-[var(--p-space-100)] text-left",
                        "text-[length:var(--c-datepicker-content-font-size)] leading-[var(--c-datepicker-content-font-line-height)]",
                        active
                          ? "bg-[var(--c-datepicker-preset-item-bg-active)] font-medium text-[var(--c-datepicker-preset-item-text-active)]"
                          : "text-[var(--c-datepicker-text-subtlest)] hover:bg-[var(--c-datepicker-day-bg-hover)]",
                      )}
                    >
                      {preset.label}
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="w-px shrink-0 bg-[var(--c-datepicker-divider-color)]" />
            <div className="shrink-0">
              <Calendar
                mode="range"
                selected={presetRange}
                onSelect={(range) => {
                  setPresetRange(range)
                  if (range) setPresetMonth(range.to ?? range.from)
                }}
                month={presetMonth}
                onMonthChange={setPresetMonth}
              />
            </div>
          </TabsContent>

          {/* ---- Custom Range: 2-month calendar + date readout row ---- */}
          <TabsContent value="custom" className="flex flex-col">
            <Calendar
              mode="range"
              numberOfMonths={2}
              monthsOrientation="horizontal"
              selected={customRange}
              onSelect={(range) => {
                setCustomRange(range)
                if (range?.from) setCustomMonth(range.from)
              }}
              month={customMonth}
              onMonthChange={setCustomMonth}
            />
            <div className="flex items-center gap-[var(--c-datepicker-gap-item)] px-[var(--c-datepicker-padding-item)] pb-[var(--c-datepicker-padding-item)]">
              <DateReadout value={customRange?.from} placeholder="Start date" focused />
              <PrismIcon name="arrow-right" size={16} decorative className="shrink-0 text-[var(--c-datepicker-icon-color-default)]" />
              <DateReadout value={customRange?.to} placeholder="End date" />
            </div>
          </TabsContent>

          {/* ---- Rolling Window: stepper + unit chips + preview ---- */}
          <TabsContent value="rolling" className="flex w-[530px] flex-col gap-[var(--c-datepicker-gap-item)] p-[var(--c-datepicker-padding-item)]">
            <p className="text-[length:var(--c-datepicker-content-font-size)] leading-[var(--c-datepicker-content-font-line-height)] text-[var(--c-datepicker-text-default)]">
              Show data for the last
            </p>
            <div className="flex items-center gap-[var(--c-datepicker-gap-item)]">
              {/* Stepper is ONE textfield shell wrapping −/value/+, not three
                  separate controls: the Rolling Window symbol binds
                  textfield/height/large + textfield/radius +
                  textfield/border/default on a single container, with
                  icon/size/016 glyphs and datepicker/gap/base (2px) between
                  them (verified via get_variable_defs on node 9093:53066). */}
              <div className="inline-flex h-[var(--c-textfield-height-large)] items-center gap-[var(--c-datepicker-gap-base)] rounded-[var(--c-textfield-radius)] border border-[var(--c-textfield-border-default)] px-[var(--p-space-050)]">
                <IconButton
                  icon="remove"
                  iconSize={16}
                  label="Decrease"
                  onClick={() => setRollingValue((v) => Math.max(1, v - 1))}
                  disabled={rollingValue <= 1}
                />
                <span className="min-w-6 text-center text-[length:var(--c-datepicker-content-font-size)] leading-[var(--c-datepicker-content-font-line-height)] text-[var(--c-datepicker-text-default)]">
                  {rollingValue}
                </span>
                <IconButton
                  icon="add"
                  iconSize={16}
                  label="Increase"
                  onClick={() => setRollingValue((v) => v + 1)}
                />
              </div>
              <div className="flex items-center gap-[var(--p-space-100)]">
                {(["days", "weeks", "months"] as const).map((unit) => (
                  <Button
                    key={unit}
                    type="button"
                    variant={rollingUnit === unit ? "primary" : "secondary"}
                    size="small"
                    onClick={() => setRollingUnit(unit)}
                  >
                    {UNIT_LABEL[unit]}
                  </Button>
                ))}
              </div>
            </div>
            {/* font.label.small (12/400/16) — NOT datepicker/label/font/*
                (11/600), which is the calendar weekday-row token. */}
            <p className="text-[length:var(--t-font-label-small-size)] font-[number:var(--t-font-label-small-weight)] leading-[var(--t-font-label-small-line-height)] text-[var(--c-datepicker-text-subtlest)]">
              Resolves to {format(resolveRolling(rollingValue, rollingUnit).from!, "MMM d, yyyy")} –{" "}
              {format(resolveRolling(rollingValue, rollingUnit).to!, "MMM d, yyyy")} · updates on each page load
            </p>
          </TabsContent>

          {/* ---- Fiscal Quarter: year nav + 2x2 quarter grid ---- */}
          <TabsContent value="fiscal" className="flex w-[530px] flex-col gap-[var(--c-datepicker-gap-item)] p-[var(--c-datepicker-padding-item)]">
            <div className="flex items-center justify-between">
              <IconButton icon="chevron-left" iconSize={16} label="Previous year" onClick={() => setFiscalYear((y) => y - 1)} />
              {/* datepicker/content/font/* (14/24) SemiBold — NOT
                  datepicker/header/font/* (18/600). Figma's prose claims the
                  header token here, but get_variable_defs on the real Fiscal
                  Quarter symbol (9093:53091) binds no header font at all;
                  content/font is the only label-scale token present. */}
              <span className="text-[length:var(--c-datepicker-content-font-size)] font-semibold leading-[var(--c-datepicker-content-font-line-height)] text-[var(--c-datepicker-text-default)]">
                FY {fiscalYear}
              </span>
              <IconButton icon="chevron-right" iconSize={16} label="Next year" onClick={() => setFiscalYear((y) => y + 1)} />
            </div>
            <div className="grid grid-cols-2 gap-[var(--c-datepicker-gap-item)]">
              {QUARTERS.map(({ q, label }) => {
                const active = q === fiscalQuarter
                const range = quarterRange(fiscalYear, q)
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setFiscalQuarter(q)}
                    className={cn(
                      "flex flex-col items-center gap-[var(--p-space-050)] rounded-[var(--p-radius-100)] border p-[var(--p-space-200)] text-center",
                      active
                        ? "border-[var(--c-datepicker-quarter-border-active)] bg-[var(--c-datepicker-quarter-background-active)]"
                        : "border-[var(--c-datepicker-input-border-default)] hover:bg-[var(--c-datepicker-day-bg-hover)]",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[length:var(--c-datepicker-content-font-size)] font-semibold leading-[var(--c-datepicker-content-font-line-height)]",
                        active ? "text-[var(--c-datepicker-quarter-label-active)]" : "text-[var(--c-datepicker-text-default)]",
                      )}
                    >
                      {label}
                    </span>
                    <span
                      className={cn(
                        "text-[length:var(--t-font-label-small-size)] font-[number:var(--t-font-label-small-weight)] leading-[var(--t-font-label-small-line-height)]",
                        active ? "text-[var(--c-datepicker-quarter-label-active)]" : "text-[var(--c-datepicker-text-subtlest)]",
                      )}
                    >
                      {format(range.from!, "MMM")} – {format(range.to!, "MMM yyyy")}
                    </span>
                  </button>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* ---- Apply Row: always last, right-aligned ---- */}
        <div className="flex items-center justify-end gap-[var(--c-datepicker-gap-item)] border-t border-[var(--c-datepicker-divider-color)] px-[var(--c-datepicker-padding-item)] py-[var(--p-space-100)]">
          <Button variant="secondary" size="medium" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="medium"
            onClick={
              activeTab === "presets"
                ? handleApplyPresets
                : activeTab === "custom"
                  ? handleApplyCustom
                  : activeTab === "rolling"
                    ? handleApplyRolling
                    : handleApplyFiscal
            }
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function DateReadout({ value, placeholder, focused }: { value?: Date; placeholder: string; focused?: boolean }) {
  return (
    <span
      className={cn(
        "flex h-8 flex-1 items-center rounded-[var(--c-datepicker-input-radius)] border px-[var(--c-datepicker-input-padding-left)]",
        "text-[length:var(--c-datepicker-input-font-size)] leading-[var(--c-datepicker-input-font-line-height)]",
        focused ? "border-[var(--c-datepicker-input-border-focus)]" : "border-[var(--c-datepicker-input-border-default)]",
        value ? "text-[var(--c-datepicker-input-content-value)]" : "text-[var(--c-datepicker-input-content-placeholder)]",
      )}
    >
      {value ? format(value, "MMM d, yyyy") : placeholder}
    </span>
  )
}

export { DateFilter }
export type { DateFilterProps, DateFilterValue, DateFilterMode, DateFilterPresetKey, RollingUnit }
