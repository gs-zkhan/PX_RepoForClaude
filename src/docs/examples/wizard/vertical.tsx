import { Wizard } from "@/components/ui/wizard"

// Vertical orientation draws the connector below each circle with the label
// to the right, instead of a horizontal line between circles.
export default function WizardVertical() {
  return (
    <Wizard
      orientation="vertical"
      steps={[
        { id: "import", label: "Import accounts", state: "completed" },
        { id: "map", label: "Map fields", state: "completed" },
        { id: "validate", label: "Validate", state: "active" },
        { id: "confirm", label: "Confirm", state: "pending" },
      ]}
    />
  )
}
