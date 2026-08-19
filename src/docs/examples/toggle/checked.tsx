import { Toggle } from "@/components/ui/toggle"

// `checked`/`defaultChecked`/`onChange` pass straight through to the
// underlying <input type="checkbox" role="switch"> via ...rest.
export default function ToggleChecked() {
  return (
    <div className="flex flex-col gap-[var(--p-space-100)]">
      <Toggle label="Off" defaultChecked={false} />
      <Toggle label="On" defaultChecked />
    </div>
  )
}
