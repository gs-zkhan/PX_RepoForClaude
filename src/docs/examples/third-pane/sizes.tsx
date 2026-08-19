import * as React from "react"

import { ThirdPane } from "@/components/ui/third-pane"
import type { ThirdPaneSize } from "@/components/ui/third-pane"
import { Button } from "@/components/ui/button"

// Small (336px) is too narrow for label+input form layouts — use Medium
// (584px, the default) as the minimum for form-heavy content.
export default function ThirdPaneSizes() {
  const [open, setOpen] = React.useState<ThirdPaneSize | null>(null)

  return (
    <>
      <div className="flex flex-wrap gap-[var(--p-space-200)]">
        {(["small", "medium", "large", "xlarge"] as const).map((size) => (
          <Button key={size} variant="secondary" onClick={() => setOpen(size)}>
            {size}
          </Button>
        ))}
      </div>
      <ThirdPane
        open={open !== null}
        onOpenChange={(next) => setOpen(next ? open : null)}
        size={open ?? "medium"}
        title={`${open ?? "medium"} panel`}
      >
        <p>Panel content goes here.</p>
      </ThirdPane>
    </>
  )
}
