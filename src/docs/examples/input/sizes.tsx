import { Input } from "@/components/ui/input"

// `size` only applies when controlRecipe="textfield" (the default). Small is
// for table-cell inline edit / PEC search only.
export default function InputSizes() {
  return (
    <div className="flex flex-col gap-[var(--p-space-200)]">
      <Input size="large" placeholder="Large (32px, default)" />
      <Input size="small" placeholder="Small (24px)" />
    </div>
  )
}
