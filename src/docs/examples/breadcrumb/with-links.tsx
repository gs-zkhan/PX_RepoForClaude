import { Breadcrumb } from "@/components/ui/breadcrumb"

// Non-current items with an `href` render as real <a> elements; without it
// they render as buttons calling onItemClick. The last item is never a link.
export default function BreadcrumbWithLinks() {
  return (
    <Breadcrumb
      items={[
        { id: "home", label: "Home", href: "/" },
        { id: "settings", label: "Settings", href: "/settings" },
        { id: "billing", label: "Billing" },
      ]}
    />
  )
}
