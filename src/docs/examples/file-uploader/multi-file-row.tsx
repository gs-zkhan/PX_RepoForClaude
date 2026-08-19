import { FileUploader, FileUploaderRow } from "@/components/ui/file-uploader"

// FileUploaderRow is a companion compact row for a multi-file queue below
// the main drop zone (Figma's "Multiple File Interaction" symbol) — it is
// not a variant of FileUploader itself, so compose the two together.
export default function FileUploaderMultiFileRow() {
  return (
    <div className="flex max-w-[320px] flex-col gap-[var(--p-space-100)]">
      <FileUploader hint="PDF, PNG or JPG up to 10MB" onFilesSelected={() => {}} />
      <FileUploaderRow fileName="contract.pdf" fileSize="2.4 MB" onDelete={() => {}} />
      <FileUploaderRow fileName="invoice.pdf" status="loading" onCancel={() => {}} />
    </div>
  )
}
