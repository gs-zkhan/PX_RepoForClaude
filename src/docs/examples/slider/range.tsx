import { Slider } from "@/components/ui/slider"

// value.length drives the thumb count — two values render two thumbs.
export default function SliderRange() {
  return (
    <div className="w-64">
      <Slider defaultValue={[20, 80]} max={100} step={1} />
    </div>
  )
}
