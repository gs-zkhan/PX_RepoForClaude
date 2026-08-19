import { FileUploader } from "@/components/ui/file-uploader"

export default function FileUploaderDefault() {
  return (
    <FileUploader hint="PDF, PNG or JPG up to 10MB" onFilesSelected={() => {}} className="max-w-[280px]" />
  )
}
