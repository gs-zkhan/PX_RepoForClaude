import { TextField } from "@/components/ui/text-field"

// Helper text always shows when state is "error" or "success", regardless
// of `helperVisible`.
export default function TextFieldStates() {
  return (
    <div className="flex flex-col gap-[var(--p-space-300)]">
      <TextField
        label="Email"
        defaultValue="not-an-email"
        state="error"
        helperText="Enter a valid email address."
      />
      <TextField
        label="Email"
        defaultValue="person@example.com"
        state="success"
        helperText="Looks good."
      />
    </div>
  )
}
