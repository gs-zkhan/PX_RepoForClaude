import { TextField } from "@/components/ui/text-field"

export default function TextFieldSizes() {
  return (
    <div className="flex flex-col gap-[var(--p-space-300)]">
      <TextField label="Large (default)" size="large" placeholder="32px" />
      <TextField label="Small" size="small" placeholder="24px — table cell inline edit" />
    </div>
  )
}
