import * as React from "react"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import { Spinner } from "@/components/ui/spinner"
import { IconButton } from "@/components/ui/icon-button"

// -----------------------------------------------------------------------------
// FileUploader — Figma "Uploader" (node 1273:15, Prism V1 - ShadCN).
//
// Drop-zone + file-picker for a single file. Two size × two variant matrix
// with 5 states each:
//
//   Size:    large (icon 64/48px)      · small (icon 48/32px)
//   Variant: square (stacked, centred) · wider (horizontal row)
//   State:   idle / loading / uploaded / error (hover is a CSS state)
//
// `status` drives the visual state; caller owns file selection, upload
// progress tracking, and cancellation:
//
//   idle       — upload icon + label + "browse" link. Clicking or
//                dropping calls `onFilesSelected(files)`.
//   loading    — spinner + filename + Cancel action (calls onCancel).
//   uploaded   — file icon + filename + Delete action (calls onDelete).
//   error      — error icon + error message + optional retry link.
//
// Uses component tokens (--c-uploader-*) already in the token catalog.
// Drag-and-drop uses native HTML5 drag events; the file <input> is
// visually hidden but keyboard-reachable.
//
// FileUploaderRow is a companion compact row for showing multiple queued
// files below the drop zone (Figma's "Multiple File Interaction" symbol).
// -----------------------------------------------------------------------------

type FileUploaderSize = "large" | "small"
type FileUploaderVariant = "square" | "wider"
type FileUploaderStatus = "idle" | "loading" | "uploaded" | "error"

type FileUploaderProps = {
  size?: FileUploaderSize
  variant?: FileUploaderVariant
  status?: FileUploaderStatus
  /** File name shown in loading/uploaded/error states. */
  fileName?: string
  /** File size label (e.g. "2.4 MB") shown in uploaded state. */
  fileSize?: string
  /** Error message shown when status="error". */
  errorMessage?: string
  /** Idle-state label. Default: "Drag and drop file here or browse". */
  label?: React.ReactNode
  /** Idle-state hint (secondary text). */
  hint?: React.ReactNode
  /** Accepted MIME types / extensions (native <input accept>). */
  accept?: string
  /** Called when user selects file(s) via picker or drop. */
  onFilesSelected?: (files: FileList) => void
  onCancel?: () => void
  onDelete?: () => void
  onRetry?: () => void
  disabled?: boolean
  className?: string
}

const ICON_PX: Record<FileUploaderSize, { large: number; small: number }> = {
  large: { large: 64, small: 48 },
  small: { large: 48, small: 32 },
}

function FileUploader({
  size = "large",
  variant = "square",
  status = "idle",
  fileName,
  fileSize,
  errorMessage,
  label = "Drag and drop file here or browse",
  hint,
  accept,
  onFilesSelected,
  onCancel,
  onDelete,
  onRetry,
  disabled = false,
  className,
}: FileUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [isDragOver, setIsDragOver] = React.useState(false)

  const iconSize = variant === "square" ? ICON_PX[size].large : ICON_PX[size].small
  const iconSource = iconSize === 64 ? 64 : iconSize === 48 ? 48 : 32

  const handleBrowse = () => {
    if (disabled || status === "loading") return
    inputRef.current?.click()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    if (disabled || status === "loading") return
    if (event.dataTransfer.files.length > 0) {
      onFilesSelected?.(event.dataTransfer.files)
    }
  }

  const shellPadding =
    size === "large"
      ? "p-[var(--c-uploader-padding-large)]"
      : "p-[var(--c-uploader-padding-small)]"

  const orientation = variant === "square"
    ? "flex-col items-center text-center gap-[var(--c-uploader-gap-row)]"
    : "flex-row items-center gap-[var(--c-uploader-gap-row)] text-left"

  return (
    <div
      role="button"
      tabIndex={disabled || status === "loading" ? -1 : 0}
      aria-label={typeof label === "string" ? label : "Upload file"}
      aria-disabled={disabled || undefined}
      onClick={status === "idle" ? handleBrowse : undefined}
      onKeyDown={(event) => {
        if (status === "idle" && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault()
          handleBrowse()
        }
      }}
      onDragEnter={(event) => {
        event.preventDefault()
        if (status === "idle" && !disabled) setIsDragOver(true)
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        "flex w-full outline-none transition-colors",
        shellPadding,
        orientation,
        "rounded-[var(--c-uploader-radius)] border border-dashed",
        // Border color per state
        status === "error"
          ? "border-[var(--c-uploader-border-error)] border-solid"
          : isDragOver
            ? "border-[var(--c-uploader-border-hover-blue)]"
            : "border-[var(--c-uploader-border-default)]",
        // Background per state
        status === "error"
          ? "bg-[var(--c-uploader-background)]"
          : isDragOver
            ? "bg-[var(--c-uploader-background-hover-blue)]"
            : "bg-[var(--c-uploader-background)]",
        !disabled && status === "idle" && "cursor-pointer hover:bg-[var(--c-uploader-background-hover)]",
        (disabled || status === "loading") && "cursor-not-allowed",
        "focus-visible:shadow-[var(--e-shadow-focus)]",
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={(event) => {
          if (event.target.files && event.target.files.length > 0) {
            onFilesSelected?.(event.target.files)
          }
          event.target.value = ""
        }}
        className="sr-only"
      />

      <div className="shrink-0" style={{ width: iconSize, height: iconSize }}>
        {status === "loading" ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner size={iconSize >= 48 ? "l" : iconSize >= 32 ? "m" : "s"} label="Uploading" />
          </div>
        ) : status === "error" ? (
          <PrismIcon name="upload-error" size={iconSize} sourceSize={iconSource} decorative />
        ) : status === "uploaded" ? (
          <PrismIcon name="file" size={iconSize} sourceSize={iconSource} decorative />
        ) : (
          <PrismIcon name="upload" size={iconSize} sourceSize={iconSource} decorative />
        )}
      </div>

      <div className={cn("flex min-w-0 flex-1 flex-col gap-[var(--c-uploader-gap-content)]", variant === "square" ? "items-center text-center" : "items-start text-left")}>
        {status === "idle" ? (
          <>
            <p className="text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] text-[var(--c-uploader-content-label)]">
              {typeof label === "string" ? (
                <>
                  {label.split(/(browse)/i).map((chunk, i) =>
                    /^browse$/i.test(chunk) ? (
                      <span key={i} className="font-semibold text-[var(--c-uploader-content-browse)]">
                        {chunk}
                      </span>
                    ) : (
                      <React.Fragment key={i}>{chunk}</React.Fragment>
                    ),
                  )}
                </>
              ) : (
                label
              )}
            </p>
            {hint ? (
              <p className="text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] text-[var(--c-uploader-content-hint)]">
                {hint}
              </p>
            ) : null}
          </>
        ) : status === "loading" ? (
          <div className={cn("flex w-full items-center gap-[var(--p-space-100)]", variant === "square" ? "justify-center" : "justify-between")}>
            <span className="min-w-0 flex-1 truncate text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] text-[var(--c-uploader-content-hint)]">
              {fileName ?? "Uploading…"}
            </span>
            {onCancel ? (
              <button
                type="button"
                aria-label="Cancel upload"
                onClick={(e) => {
                  e.stopPropagation()
                  onCancel()
                }}
                className="shrink-0 text-[length:var(--t-font-body-medium-size)] font-semibold text-[var(--c-uploader-content-action)]"
              >
                Cancel
              </button>
            ) : null}
          </div>
        ) : status === "uploaded" ? (
          <div className={cn("flex w-full items-center gap-[var(--p-space-100)]", variant === "square" ? "justify-center" : "justify-between")}>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] text-[var(--c-uploader-content-label)]">
                {fileName}
              </span>
              {fileSize ? (
                <span className="text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] text-[var(--c-uploader-content-filesize)]">
                  {fileSize}
                </span>
              ) : null}
            </div>
            {onDelete ? (
              <IconButton
                icon="delete"
                label={`Delete ${fileName ?? "file"}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="shrink-0"
              />
            ) : null}
          </div>
        ) : (
          // error
          <div className="flex w-full flex-col items-start gap-[var(--p-space-050)]">
            <div className="flex w-full items-center gap-[var(--p-space-100)]">
              {fileName ? (
                <span className="min-w-0 flex-1 truncate text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] text-[var(--c-uploader-content-label)]">
                  {fileName}
                </span>
              ) : null}
              {onRetry ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRetry()
                  }}
                  className="shrink-0 text-[length:var(--t-font-body-medium-size)] font-semibold text-[var(--c-uploader-content-action)]"
                >
                  Retry
                </button>
              ) : null}
            </div>
            {errorMessage ? (
              <p
                role="alert"
                className="text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] text-[var(--c-uploader-error-text)]"
              >
                {errorMessage}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// FileUploaderRow — compact row for a file in a multi-file queue below the
// main drop zone. Figma's "File Uploader / Multiple File Interaction".
// ---------------------------------------------------------------------------

type FileUploaderRowProps = {
  fileName: string
  fileSize?: string
  status?: "idle" | "loading"
  onCancel?: () => void
  onDelete?: () => void
  className?: string
}

function FileUploaderRow({
  fileName,
  fileSize,
  status = "idle",
  onCancel,
  onDelete,
  className,
}: FileUploaderRowProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-[var(--p-space-100)] px-[var(--c-uploader-padding-row)] py-[var(--p-space-100)]",
        "rounded-[var(--p-radius-050)] hover:bg-[var(--c-uploader-row-hover-bg)]",
        className,
      )}
    >
      {status === "loading" ? (
        <Spinner size="s" label="Uploading" />
      ) : (
        <PrismIcon name="document" size={24} decorative className="text-[var(--s-icon-color-default)]" />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] text-[var(--c-uploader-content-label)]">
          {fileName}
        </span>
        {fileSize ? (
          <span className="text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] text-[var(--c-uploader-content-filesize)]">
            {fileSize}
          </span>
        ) : null}
      </div>
      {status === "loading" && onCancel ? (
        <IconButton icon="cancel" label={`Cancel ${fileName}`} onClick={onCancel} className="shrink-0" />
      ) : status === "idle" && onDelete ? (
        <IconButton
          icon="delete"
          label={`Delete ${fileName}`}
          onClick={onDelete}
          className="shrink-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
        />
      ) : null}
    </div>
  )
}

export { FileUploader, FileUploaderRow }
export type {
  FileUploaderProps,
  FileUploaderSize,
  FileUploaderVariant,
  FileUploaderStatus,
  FileUploaderRowProps,
}
