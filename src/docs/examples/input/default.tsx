import { Input } from "@/components/ui/input"

// Input is the shared low-level primitive underneath TextField, SearchBar and
// DropdownField. Most product screens should reach for one of those instead —
// this page documents Input in isolation for people composing a new field
// component on top of it.
export default function InputDefault() {
  return <Input placeholder="Enter a value" />
}
