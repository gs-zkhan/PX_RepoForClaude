import * as React from "react"

import { ThirdPane } from "@/components/ui/third-pane"
import { Button } from "@/components/ui/button"

export default function ThirdPaneDefault() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open panel</Button>
      <ThirdPane open={open} onOpenChange={setOpen} title="Account details">
        <p>Panel content goes here.</p>
      </ThirdPane>
    </>
  )
}
