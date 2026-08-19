import { Breadcrumb } from "@/components/ui/breadcrumb"

export default function BreadcrumbDefault() {
  return (
    <Breadcrumb
      items={[
        { id: "home", label: "Home" },
        { id: "accounts", label: "Accounts" },
        { id: "acme", label: "Acme Corp" },
      ]}
    />
  )
}
