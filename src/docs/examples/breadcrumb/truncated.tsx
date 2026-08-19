import { Breadcrumb } from "@/components/ui/breadcrumb"

// With more items than maxItems, the middle collapses to an ellipsis button
// that reveals the hidden levels when clicked. Root + trailing items stay visible.
export default function BreadcrumbTruncated() {
  return (
    <Breadcrumb
      maxItems={4}
      items={[
        { id: "home", label: "Home" },
        { id: "accounts", label: "Accounts" },
        { id: "segments", label: "Segments" },
        { id: "power-users", label: "Power users" },
        { id: "rules", label: "Rules" },
        { id: "rule-3", label: "Rule 3" },
      ]}
    />
  )
}
