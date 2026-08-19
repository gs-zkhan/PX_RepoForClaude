import { ProgressBar } from "@/components/ui/progress-bar"

export default function ProgressBarStatus() {
  return (
    <div className="flex w-64 flex-col gap-[var(--p-space-200)]">
      <ProgressBar value={40} status="default" label="Step progress" />
      <ProgressBar value={100} status="success" label="Upload complete" />
      <ProgressBar value={70} status="warning" label="Storage nearing limit" />
      <ProgressBar value={20} status="danger" label="Import failing" />
    </div>
  )
}
