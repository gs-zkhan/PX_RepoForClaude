import { Input } from "@/components/ui/input"
import { PrismIcon } from "@/components/ui/prism-icon"

// leadingAdornment/trailingAdornment only reserve the padding to clear an
// icon or action — positioning the icon itself (e.g. absolute left-3) is
// owned by the composing component, not Input.
export default function InputAdornments() {
  return (
    <div className="flex flex-col gap-[var(--p-space-200)]">
      <div className="relative">
        <PrismIcon
          name="search"
          size={16}
          sourceSize={24}
          decorative
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--s-icon-color-default)]"
        />
        <Input leadingAdornment={16} placeholder="Search" />
      </div>
      <div className="relative">
        <Input trailingAdornment={16} placeholder="With trailing icon" />
        <PrismIcon
          name="cancel"
          size={16}
          decorative
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--s-icon-color-default)]"
        />
      </div>
    </div>
  )
}
