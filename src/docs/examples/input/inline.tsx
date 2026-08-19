import { Input } from "@/components/ui/input"

// inline=true removes border/background so the field blends into its
// container surface — border still appears on hover/focus/error. Table cells,
// inline editing, dense UI contexts only — never in a standalone form.
export default function InputInline() {
  return <Input inline placeholder="Inline value" />
}
