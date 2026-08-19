import * as React from "react"

import { Slider } from "@/components/ui/slider"

// Slider has no built-in value display — Figma requires the current value to
// always be visible, so the caller composes a companion label.
export default function SliderWithValueLabel() {
  const [value, setValue] = React.useState(40)

  return (
    <div className="flex w-64 items-center gap-[var(--p-space-200)]">
      <Slider
        value={value}
        max={100}
        step={1}
        onValueChange={([v]) => setValue(v)}
      />
      <span className="w-8 text-right text-[length:var(--t-font-label-small-size)] text-[var(--s-color-text-subtle)]">
        {value}
      </span>
    </div>
  )
}
