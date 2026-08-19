import { Letter } from "@/components/ui/letter"

// Letter labels a filter criterion so it can be referenced by letter in
// advanced boolean logic, e.g. "(A and B) or (C and D)" — used standalone in
// FilterConfigModal, one Letter per criterion row.
export default function LetterDefault() {
  return <Letter letter="A" />
}
