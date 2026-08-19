import { Wizard } from "@/components/ui/wizard"

// `showLabels={false}` renders only the numbered circles — useful for a
// compact header where the step body already names the current step.
export default function WizardNoLabels() {
  return (
    <Wizard
      showLabels={false}
      steps={[
        { id: "1", state: "completed" },
        { id: "2", state: "completed" },
        { id: "3", state: "active" },
        { id: "4", state: "pending" },
      ]}
    />
  )
}
