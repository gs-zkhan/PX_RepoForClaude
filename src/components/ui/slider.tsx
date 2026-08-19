import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Slider — Figma "Slider" (node 1273:13, Prism V1 - ShadCN), built on
// @radix-ui/react-slider for pointer/keyboard interaction and ARIA.
//
// Anatomy verified: 8px pill track, active portion in --s-color-line-brand
// against --p-color-neutral-300 inactive; 16x16 thumb at rest with
// --s-color-line-brand ring + shadow/100, expands to 20x20 with shadow/200
// on hover/active/focus. Disabled state swaps ring to --s-color-line-default
// and dims interactivity.
//
// Slider is a range control only — Figma's own "Always show the current
// value" rule means callers must render a companion numeric label. This
// component does not include one; compose it in the parent.
//
// Radix Slider supports N thumbs (single-value = one thumb, range = two
// thumbs) driven off `value.length`. `defaultValue` may be a scalar for
// convenience — normalised into an array before passing to Radix.
// -----------------------------------------------------------------------------

type SliderProps = Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  "defaultValue" | "value"
> & {
  value?: number | number[]
  defaultValue?: number | number[]
}

function normalise(value: number | number[] | undefined): number[] | undefined {
  if (value === undefined) return undefined
  return Array.isArray(value) ? value : [value]
}

function Slider({ value, defaultValue, className, ...props }: SliderProps) {
  const arr = normalise(value)
  const defaultArr = normalise(defaultValue) ?? [0]
  const thumbCount = arr?.length ?? defaultArr.length

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={arr}
      defaultValue={arr ? undefined : defaultArr}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        "data-[disabled]:pointer-events-none",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-2 w-full grow overflow-hidden rounded-[var(--p-radius-full)] bg-[var(--p-color-neutral-300)]"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full bg-[var(--s-color-line-brand)] data-[disabled]:bg-[var(--s-color-line-default)]"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          data-slot="slider-thumb"
          className={cn(
            "block size-4 rounded-full border-2 bg-[var(--s-color-surface-default)]",
            "border-[var(--s-color-line-brand)] shadow-[var(--e-shadow-100)]",
            "transition-[width,height,box-shadow] outline-none",
            "hover:size-5 hover:shadow-[var(--e-shadow-200)]",
            "focus-visible:size-5 focus-visible:shadow-[var(--e-shadow-focus)]",
            "data-[disabled]:border-[var(--s-color-line-default)] data-[disabled]:hover:size-4 data-[disabled]:hover:shadow-[var(--e-shadow-100)]",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
export type { SliderProps }
