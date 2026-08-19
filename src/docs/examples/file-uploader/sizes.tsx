import { FileUploader } from "@/components/ui/file-uploader"

export default function FileUploaderSizes() {
  return (
    <div className="flex flex-wrap gap-[var(--p-space-300)]">
      <FileUploader size="large" hint="Large (default)" className="max-w-[240px]" />
      <FileUploader size="small" hint="Small" className="max-w-[240px]" />
    </div>
  )
}
