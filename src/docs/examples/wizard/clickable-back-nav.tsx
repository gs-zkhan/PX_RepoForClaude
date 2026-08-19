import { Wizard } from "@/components/ui/wizard"

// Only completed steps are clickable — onStepClick enables backwards nav,
// but Wizard itself does not move the user forward; the caller owns that.
export default function WizardClickableBackNav() {
  return (
    <Wizard
      steps={[
        { id: "details", label: "Details", state: "completed" },
        { id: "audience", label: "Audience", state: "active" },
        { id: "review", label: "Review", state: "pending" },
      ]}
      onStepClick={(id) => console.log("navigate back to", id)}
    />
  )
}
