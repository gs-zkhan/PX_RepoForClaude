import { Toggle } from "@/components/ui/toggle"

// `label` is optional — omit it when the surrounding row already carries a
// label (e.g. a settings table where the row text is the label).
export default function ToggleNoLabel() {
  return <Toggle aria-label="Enable feature" />
}
