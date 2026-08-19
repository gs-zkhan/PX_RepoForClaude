import { Wizard } from "@/components/ui/wizard"

export default function WizardDefault() {
  return (
    <Wizard
      steps={[
        { id: "details", label: "Details", state: "completed" },
        { id: "audience", label: "Audience", state: "active" },
        { id: "review", label: "Review", state: "pending" },
      ]}
    />
  )
}
