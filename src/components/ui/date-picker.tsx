import * as React from "react"
import { PrismIcon } from "@/components/ui/prism-icon"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerSize = "large" | "small"

const datepickerHeight: Record<DatePickerSize, string> = {
  large: "h-[var(--c-datepicker-input-height-large)]", // 32px — DEFAULT
  small: "h-[var(--c-datepicker-input-height-small)]", // 24px — compact/inline contexts only
}

const datepickerPaddingVertical: Record<DatePickerSize, string> = {
  large: "py-[var(--c-datepicker-input-padding-vertical-large)]",
  small: "py-[var(--c-datepicker-input-padding-vertical-small)]",
}

type DatePickerProps = {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  /** Large (32px, DEFAULT) or Small (24px, compact/inline contexts only). */
  size?: DatePickerSize
  /** Success state — sets border to --c-datepicker-input-border-success. */
  success?: boolean
  /** Inline=True/False (Figma boolean property) — no border/background until Hover/Focus/Error. */
  inline?: boolean
  id?: string
  className?: string
} & Pick<
  React.ComponentProps<"button">,
  "aria-invalid" | "aria-describedby" | "aria-required" | "aria-label"
>

function DatePicker({
  value,
  onChange,
  placeholder = "Select a date",
  disabled = false,
  size = "large",
  success = false,
  inline = false,
  id,
  className,
  ...ariaProps
}: DatePickerProps) {
  const [internalValue, setInternalValue] = React.useState<Date | undefined>(
    value
  )

  const selectedDate = value ?? internalValue
  const iconSize = size === "small" ? 16 : 24

  function handleSelect(date: Date | undefined) {
    setInternalValue(date)
    onChange?.(date)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          data-state-success={success ? "true" : undefined}
          className={cn(
            "group flex w-full items-center justify-between border outline-none transition-colors",
            datepickerHeight[size],
            "rounded-[var(--c-datepicker-input-radius)]",
            "border-[length:var(--c-datepicker-input-border-width)]",
            inline ? "border-transparent" : "border-[var(--c-datepicker-input-border-default)]",
            inline ? "bg-transparent" : "bg-[var(--c-datepicker-input-background-default)]",
            "pl-[var(--c-datepicker-input-padding-left)]",
            "pr-[var(--c-datepicker-input-padding-right)]",
            datepickerPaddingVertical[size],
            "text-left",
            "text-[length:var(--c-datepicker-input-font-size)]",
            "font-[var(--c-datepicker-input-font-weight)]",
            "leading-[var(--c-datepicker-input-font-line-height)]",
            selectedDate
              ? "text-[var(--c-datepicker-input-content-value)]"
              : "text-[var(--c-datepicker-input-content-placeholder)]",
            "hover:border-[var(--c-datepicker-input-border-hover)]",
            "focus-visible:border-[var(--c-datepicker-input-border-focus)]",
            "focus-visible:ring-[length:var(--c-datepicker-input-focus-ring-width)]",
            "focus-visible:ring-[var(--c-datepicker-input-focus-ring-color)]",
            "data-[state-success=true]:border-[var(--c-datepicker-input-border-success)]",
            "aria-invalid:border-[var(--c-datepicker-input-border-error)]",
            "aria-invalid:text-[var(--c-datepicker-input-content-error)]",
            "disabled:cursor-not-allowed",
            "disabled:border-[var(--c-datepicker-input-border-disabled)]",
            "disabled:bg-[var(--c-datepicker-input-background-disabled)]",
            "disabled:text-[var(--c-datepicker-input-content-disabled)]",
            className
          )}
          {...ariaProps}
        >
          <span>
            {selectedDate ? format(selectedDate, "PPP") : placeholder}
          </span>

          <PrismIcon
            name="calendar"
            size={iconSize}
            sourceSize={24}
            className="text-[var(--s-icon-color-default)] group-disabled:text-[var(--s-icon-color-disabled)]"
          />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
export type { DatePickerProps, DatePickerSize }
