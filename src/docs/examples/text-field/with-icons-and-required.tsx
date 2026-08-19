import { TextField } from "@/components/ui/text-field"

// Required renders a danger-coloured asterisk; infoIcon adds a tooltip after
// the label; leading/trailing icons sit inside the input via Input's
// adornment padding.
export default function TextFieldWithIconsAndRequired() {
  return (
    <TextField
      label="Search term"
      required
      infoIcon
      infoTooltip="Matches account and contact names."
      leadingIcon="search"
      placeholder="Search accounts"
    />
  )
}
