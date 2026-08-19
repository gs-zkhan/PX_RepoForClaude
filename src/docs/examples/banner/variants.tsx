import { Banner } from "@/components/ui/banner"

export default function BannerVariants() {
  return (
    <div className="flex flex-col gap-[var(--p-space-200)]">
      <Banner variant="success" message="Segment published successfully." />
      <Banner variant="warning" message="This engagement expires in 3 days." />
      <Banner variant="danger" message="Failed to sync with Salesforce." />
      <Banner variant="information" message="A new PX release is available." />
    </div>
  )
}
