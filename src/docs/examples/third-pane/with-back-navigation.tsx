import * as React from "react"

import { ThirdPane } from "@/components/ui/third-pane"
import { Button } from "@/components/ui/button"

// `onBack` renders a leading back arrow for in-panel drill-down navigation
// and reduces the title-row inset to make room for it.
export default function ThirdPaneWithBackNavigation() {
  const [open, setOpen] = React.useState(false)
  const [drilledIn, setDrilledIn] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open panel</Button>
      <ThirdPane
        open={open}
        onOpenChange={setOpen}
        title={drilledIn ? "Contact details" : "Account details"}
        onBack={drilledIn ? () => setDrilledIn(false) : undefined}
      >
        {!drilledIn && (
          <Button variant="tertiary" onClick={() => setDrilledIn(true)}>
            View contact
          </Button>
        )}
      </ThirdPane>
    </>
  )
}
