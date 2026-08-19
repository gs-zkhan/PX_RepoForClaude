import { IconButton } from "@/components/ui/icon-button"

// The 24px button box never changes — only the glyph scales. Pass iconSize=16
// where Figma binds icon/size/016 on a compact nav/stepper control (e.g. the
// Date Filter fiscal-year nav and rolling-window stepper).
export default function IconButtonIconSize() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
      <IconButton icon="chevron-left" label="Previous" iconSize={16} />
      <IconButton icon="settings" label="Settings" iconSize={24} />
    </div>
  )
}
