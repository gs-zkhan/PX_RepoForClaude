import { Banner } from "@/components/ui/banner"

// Large adds a title + description. Use it only when a single sentence
// isn't enough — never Large just to add visual weight.
export default function BannerLarge() {
  return (
    <Banner
      size="large"
      variant="warning"
      title="Your trial ends soon"
      description="Upgrade before August 20 to keep access to Journeys and Segments."
    />
  )
}
