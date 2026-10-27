/* Kafka · ConfirmDialog */
import { type ReactNode } from 'react'
import { IconDanger, IconInfo } from '../icons'
import { Button } from './button'
import { useLabels } from './labels'
import { Modal } from './modal'

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  /** What will happen, in a sentence. Say the consequence, not "Are you sure?". */
  description: ReactNode
  /** Called when the person confirms. The dialog closes afterwards. */
  onConfirm: () => void
  confirmLabel?: string
  cancelLabel?: string
  /** `danger` is for actions that destroy something: focus starts on Cancel, and a click outside does not close the dialog. */
  tone?: 'default' | 'danger'
}

/** Asks for confirmation before an action. Buttons are named for the action ("Eliminar relato"), not "Sí" and "No". */
export function ConfirmDialog({ open, onOpenChange, title, description, onConfirm, confirmLabel, cancelLabel, tone = 'default' }: ConfirmDialogProps) {
  const labels = useLabels()
  const danger = tone === 'danger'
  const Icon = danger ? IconDanger : IconInfo
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      role={danger ? 'alertdialog' : undefined}
      dismissible={!danger}
      title={title}
      description={
        <span className="flex items-start gap-(--kafka-confirm-dialog-gap)">
          <Icon aria-hidden="true" className={`size-(--kafka-confirm-dialog-icon-size) shrink-0 ${danger ? 'text-(--kafka-confirm-dialog-icon-danger)' : 'text-(--kafka-confirm-dialog-icon)'}`} />
          <span>{description}</span>
        </span>
      }
      actions={
        <>
          <Button variant="outline" data-autofocus={danger ? '' : undefined} onClick={() => onOpenChange(false)}>{cancelLabel ?? labels.cancel}</Button>
          <Button onClick={() => { onConfirm(); onOpenChange(false) }}>{confirmLabel ?? labels.confirm}</Button>
        </>
      }
    />
  )
}
