import * as React from "react"

import { Button } from "@/components/ui/button"
import { FilterConfigModal } from "@/components/ui/filter-config-modal"
import type { FilterCriterion } from "@/components/ui/filter-config-modal"

const FIELD_OPTIONS = [
  { value: "status", label: "Status" },
  { value: "mrr", label: "MRR" },
  { value: "owner", label: "Owner" },
]
const OPERATOR_OPTIONS = [
  { value: "is", label: "Is" },
  { value: "is-not", label: "Is not" },
]
const VALUE_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "at-risk", label: "At risk" },
]

export default function FilterConfigModalDefault() {
  const [open, setOpen] = React.useState(false)
  const [criteria, setCriteria] = React.useState<FilterCriterion[]>([
    { id: "1", field: "status", operator: "is", value: "active" },
  ])
  const [advancedLogic, setAdvancedLogic] = React.useState("A")

  return (
    <>
      <Button onClick={() => setOpen(true)}>Modify filter</Button>
      <FilterConfigModal
        open={open}
        onOpenChange={setOpen}
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
