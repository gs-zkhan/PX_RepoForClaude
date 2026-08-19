import * as React from "react"

import { ViewSelector } from "@/components/ui/view-selector"

export default function ViewSelectorDefault() {
  const [open, setOpen] = React.useState(false)

  return <ViewSelector label="My CTAs due this week" open={open} onClick={() => setOpen((value) => !value)} />
}
