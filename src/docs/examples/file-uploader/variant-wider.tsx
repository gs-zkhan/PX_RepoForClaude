import { FileUploader } from "@/components/ui/file-uploader"

// `variant="wider"` lays the icon and text out in a horizontal row instead
// of the stacked, centred "square" default — for narrow side-panel contexts.
export default function FileUploaderVariantWider() {
  return <FileUploader variant="wider" hint="PDF, PNG or JPG up to 10MB" className="max-w-[360px]" />
}
