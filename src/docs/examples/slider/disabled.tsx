import { Slider } from "@/components/ui/slider"

export default function SliderDisabled() {
  return (
    <div className="w-64">
      <Slider defaultValue={30} max={100} step={1} disabled />
    </div>
  )
}
