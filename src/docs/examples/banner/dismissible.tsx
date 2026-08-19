import { Banner } from "@/components/ui/banner"

export default function BannerDismissible() {
  return (
    <Banner
      variant="information"
      message="You're viewing a saved filter."
      onDismiss={() => {}}
    />
  )
}
