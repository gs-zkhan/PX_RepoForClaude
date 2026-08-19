import * as React from "react"

import { FilterBar } from "@/components/ui/filter-bar"
import { FilterDropdownPanel } from "@/components/ui/filter-dropdown-panel"

// `renderChipPanel` makes FilterBar own the Popover for each chip (open
// state = chip.id === openChipId) so anchoring can't be wired wrong per
// screen. `onChipClick` here only needs to flip `openChipId` — the Popover's
// onOpenChange, not the chip's own onClick, is what reports every open/close.
export default function FilterBarWithChipPanel() {
  const [openChipId, setOpenChipId] = React.useState<string | undefined>(undefined)
  const [status, setStatus] = React.useState("Active")

  return (
    <FilterBar
      chips={[{ id: "status", label: "Status", value: status }]}
      openChipId={openChipId}
      onChipClick={(id) => setOpenChipId((current) => (current === id ? undefined : id))}
      onModifyFilter={() => {}}
      renderChipPanel={(chipId) =>
        chipId === "status" ? (
          <FilterDropdownPanel
            type="value"
            label="Status"
            value={status}
            onValueChange={setStatus}
            onApply={() => setOpenChipId(undefined)}
            onCancel={() => setOpenChipId(undefined)}
          />
        ) : null
      }
    />
  )
}
