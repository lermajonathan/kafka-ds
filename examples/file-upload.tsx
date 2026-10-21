import { useState } from 'react'
import { Field, FileUpload } from '../src/components'
import type { Example } from './types'

function Demo() {
  const [files, setFiles] = useState<File[]>([])
  return (
    <div className="max-w-md">
      <Field label="Tu relato">
        <FileUpload files={files} onFilesChange={setFiles} accept=".pdf,.docx" maxSize={5 * 1024 * 1024} hint="PDF o Word, hasta 5 MB." />
      </Field>
    </div>
  )
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Choose or drop',
    description: 'Files outside the accepted types or size are refused with a message that says why.',
    render: () => <Demo />,
  },
]
