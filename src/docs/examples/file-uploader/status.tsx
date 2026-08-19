import { FileUploader } from "@/components/ui/file-uploader"

// `status` drives the visual state end to end — the caller owns file
// selection, upload progress and cancellation, and just passes the current
// status in.
export default function FileUploaderStatus() {
  return (
    <div className="flex flex-wrap gap-[var(--p-space-300)]">
      <FileUploader status="loading" fileName="contract.pdf" onCancel={() => {}} className="max-w-[240px]" />
      <FileUploader status="uploaded" fileName="contract.pdf" fileSize="2.4 MB" onDelete={() => {}} className="max-w-[240px]" />
      <FileUploader status="error" fileName="contract.pdf" errorMessage="File exceeds 10MB." onRetry={() => {}} className="max-w-[240px]" />
    </div>
  )
}
