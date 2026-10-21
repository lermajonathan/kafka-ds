/* Kafka · FileUpload */
import { useId, useState, type DragEvent, type ReactNode } from 'react'
import { IconClose, IconFile, IconUpload } from '../icons'
import { useFieldControl } from './field'
import { useLabels } from './labels'
import { cx, focus } from './shared'

export interface FileUploadProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  /** Same syntax as the native `accept`: `.pdf,.docx` or `image/*`. */
  accept?: string
  multiple?: boolean
  /** Largest size in bytes per file. */
  maxSize?: number
  /** Most files allowed in total. */
  maxFiles?: number
  /** Text under the zone, for example "PDF o Word, hasta 5 MB". Read with the control. */
  hint?: ReactNode
  disabled?: boolean
  id?: string
  className?: string
}

export const formatBytes = (n: number) => (n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`)

const matches = (file: File, accept?: string) => {
  if (!accept) return true
  return accept.split(',').map((a) => a.trim().toLowerCase()).filter(Boolean).some((a) =>
    a.startsWith('.') ? file.name.toLowerCase().endsWith(a) : a.endsWith('/*') ? file.type.startsWith(a.slice(0, -1)) : file.type === a)
}

/** Choose or drop files. The native file input is inside, so the keyboard and screen readers work as they do everywhere; files that do not fit the rules are refused with a message that says why. */
export function FileUpload({ files, onFilesChange, accept, multiple = false, maxSize, maxFiles, hint, disabled, id, className }: FileUploadProps) {
  const labels = useLabels()
  const a11y = useFieldControl({ id })
  const hintId = useId()
  const [dragging, setDragging] = useState(false)
  const [problems, setProblems] = useState<string[]>([])
  const take = (incoming: File[]) => {
    const issues: string[] = []
    const ok: File[] = []
    for (const f of incoming) {
      if (!matches(f, accept)) issues.push(labels.fileTypeNotAllowed(f.name))
      else if (maxSize !== undefined && f.size > maxSize) issues.push(labels.fileTooLarge(f.name, formatBytes(maxSize)))
      else ok.push(f)
    }
    let next = multiple ? [...files, ...ok] : ok.slice(0, 1)
    if (maxFiles !== undefined && next.length > maxFiles) { issues.push(labels.tooManyFiles(maxFiles)); next = next.slice(0, maxFiles) }
    setProblems(issues)
    if (ok.length) onFilesChange(next)
  }
  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragging(false); if (!disabled) take(Array.from(e.dataTransfer.files)) }
  return (
    <div className={cx('flex flex-col gap-(--kafka-file-upload-gap)', className)}>
      <label
        data-dragging={dragging}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className="kafka-dropzone has-focus-visible:outline-(length:--kafka-focus-width) has-focus-visible:outline-offset-(--kafka-focus-offset) has-focus-visible:outline-(--kafka-color-border-focus) flex cursor-pointer flex-col items-center gap-(--kafka-file-upload-gap) rounded-(--kafka-file-upload-radius) border-(length:--kafka-file-upload-border-width) border-dashed border-(--kafka-file-upload-border) bg-(--kafka-file-upload-bg) p-(--kafka-file-upload-padding) text-center hover:bg-(--kafka-file-upload-bg-hover) has-disabled:cursor-not-allowed has-disabled:opacity-(--kafka-input-disabled-opacity)"
      >
        <input type="file" accept={accept} multiple={multiple} disabled={disabled} className="peer sr-only" aria-describedby={[hint ? hintId : null, a11y['aria-describedby']].filter(Boolean).join(' ') || undefined} id={a11y.id}
          onChange={(e) => { take(Array.from(e.target.files ?? [])); e.target.value = '' }} />
        <IconUpload aria-hidden="true" className="size-(--kafka-file-upload-icon-size) text-(--kafka-file-upload-icon)" />
        <span className="kafka-type-button-type text-(--kafka-field-label) underline underline-offset-4">{labels.chooseFiles}</span>
        <span className="kafka-type-file-upload-hint-type text-(--kafka-file-upload-hint)">{labels.dropFiles}</span>
      </label>
      {hint && <p id={hintId} className="kafka-type-file-upload-hint-type text-(--kafka-file-upload-hint)">{hint}</p>}
      <div aria-live="polite">
        {problems.length > 0 && <ul className="kafka-type-file-upload-hint-type m-0 list-none p-0 text-(--kafka-file-upload-error)">{problems.map((p) => <li key={p}>{p}</li>)}</ul>}
      </div>
      {files.length > 0 && (
        <ul aria-label={labels.filesSelected(files.length)} className="m-0 flex list-none flex-col gap-(--kafka-file-upload-gap) p-0">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="kafka-type-file-upload-item-type flex items-center gap-(--kafka-file-upload-gap) rounded-(--kafka-file-upload-item-radius) bg-(--kafka-file-upload-item-bg) pl-(--kafka-file-upload-item-padding)">
              <IconFile aria-hidden="true" className="size-(--kafka-file-upload-icon-size) shrink-0 text-(--kafka-file-upload-icon)" />
              <span className="min-w-0 grow truncate">{f.name} <span className="text-(--kafka-file-upload-hint)">· {formatBytes(f.size)}</span></span>
              <button type="button" aria-label={labels.removeFile(f.name)} onClick={() => onFilesChange(files.filter((_, j) => j !== i))} className={cx(focus, 'inline-flex size-(--kafka-file-upload-remove-size) shrink-0 cursor-pointer items-center justify-center rounded-(--kafka-file-upload-item-radius) hover:bg-(--kafka-file-upload-bg-hover)')}>
                <IconClose aria-hidden="true" className="size-(--kafka-size-icon-sm)" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
