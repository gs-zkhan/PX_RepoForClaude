import { Views } from "@/components/ui/views"

// Large (32px, font.body.medium), Small (28px, font.label.small), Extrasmall
// (24px, font.label.small, 16px icon instead of 24px) — verified per size,
// not assumed uniform.
export default function ViewsSizes() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
      <Views size="large" label="Owner" value="Me" />
      <Views size="small" label="Owner" value="Me" />
      <Views size="extrasmall" label="Owner" value="Me" />
    </div>
  )
}
