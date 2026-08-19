import { Slider } from "@/components/ui/slider"

export default function SliderDefault() {
  return (
    <div className="w-64">
      <Slider defaultValue={40} max={100} step={1} />
    </div>
  )
}
