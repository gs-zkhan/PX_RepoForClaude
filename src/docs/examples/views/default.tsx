import * as React from "react"

import { Views } from "@/components/ui/views"

export default function ViewsDefault() {
  const [open, setOpen] = React.useState(false)

  return <Views label="Status" value="Active" open={open} onClick={() => setOpen((v) => !v)} />
}
