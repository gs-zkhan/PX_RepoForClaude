import * as React from "react"

import { Button } from "@/components/ui/button"
import { FilterConfigModal } from "@/components/ui/filter-config-modal"
import type { FilterCriterion } from "@/components/ui/filter-config-modal"

const FIELD_OPTIONS = [{ value: "status", label: "Status" }]
const OPERATOR_OPTIONS = [{ value: "is", label: "Is" }]
const VALUE_OPTIONS = [{ value: "active", label: "Active" }]

// With no criteria, the modal renders an EmptyState with its own "Add filter"
// primary action instead of the field/operator/value grid. Saving with zero
// criteria is a legitimate action — the calling Filter Bar returns to its own
// "Add filter" empty state.
export default function FilterConfigModalEmpty() {
  const [open, setOpen] = React.useState(false)
  const [criteria, setCriteria] = React.useState<FilterCriterion[]>([])
  const [advancedLogic, setAdvancedLogic] = React.useState("")

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add filter</Button>
      <FilterConfigModal
        open={open}
        onOpenChange={setOpen}
        title="Add filter"
        criteria={criteria}
        onCriteriaChange={setCriteria}
        advancedLogic={advancedLogic}
        onAdvancedLogicChange={setAdvancedLogic}
        fieldOptions={FIELD_OPTIONS}
        operatorOptions={OPERATOR_OPTIONS}
        valueOptions={VALUE_OPTIONS}
        onSave={() => setOpen(false)}
      />
    </>
  )
}
