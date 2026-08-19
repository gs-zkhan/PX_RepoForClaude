import { Toggle } from "@/components/ui/toggle"

export default function ToggleDisabled() {
  return (
    <div className="flex flex-col gap-[var(--p-space-100)]">
      <Toggle label="Off, disabled" disabled />
      <Toggle label="On, disabled" disabled defaultChecked />
    </div>
  )
}
