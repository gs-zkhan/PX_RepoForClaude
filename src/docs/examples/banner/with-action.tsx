import { Banner } from "@/components/ui/banner"

export default function BannerWithAction() {
  return (
    <Banner
      variant="danger"
      message="This engagement failed to publish."
      action={{ label: "Retry", onClick: () => {} }}
    />
  )
}
