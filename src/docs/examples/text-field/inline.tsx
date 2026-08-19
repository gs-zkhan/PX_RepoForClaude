import { TextField } from "@/components/ui/text-field"

// Inline=True removes border/background so the field blends into its
// container surface. Reserve it for table cells and dense inline editing —
// never in a standalone form.
export default function TextFieldInline() {
  return (
    <TextField
      label="Account name"
      labelVisible={false}
      inline
      defaultValue="Acme Inc."
    />
  )
}
