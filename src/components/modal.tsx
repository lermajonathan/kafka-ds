/* Kafka · Modal */
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { IconClose } from '../icons'
import { IconButton } from './icon-button'
import { useLabels } from './labels'
import { cx } from './shared'

export interface ModalProps {
  open: boolean
  /** Called with `false` when the dialog is closed by Esc, the close button or a click on the backdrop. */
  onOpenChange: (open: boolean) => void
  /** The dialog's name, shown as its heading. Required: a dialog without a name is announced as just "dialog". */
  title: ReactNode
  /** Short text under the title, read as the dialog's description. */
  description?: ReactNode
  children?: ReactNode
  /** Buttons at the bottom. Put the main action last. */
  actions?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  /** Whether a click on the backdrop closes the dialog. Turn it off when closing would lose work. */
  dismissible?: boolean
  /** `alertdialog` interrupts with a message that needs an answer (ConfirmDialog uses it when the action destroys something). */
  role?: 'dialog' | 'alertdialog'
  /** Used by Drawer. */
  side?: 'center' | 'start' | 'end' | 'bottom'
  className?: string
}

/** A dialog on the native `<dialog>` (put `data-autofocus` on a control to start focus there): the page behind becomes inert, Tab stays inside, Esc closes, and focus returns to the control that opened it. */
export function Modal({ open, onOpenChange, title, description, children, actions, size = 'md', dismissible = true, role, side = 'center', className }: ModalProps) {
  const labels = useLabels()
  const uid = useId()
  const ref = useRef<HTMLDialogElement | null>(null)
  const returnTo = useRef<Element | null>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) { returnTo.current = document.activeElement; d.showModal(); d.querySelector<HTMLElement>('[data-autofocus]')?.focus() }
    else if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      role={role}
      aria-labelledby={`${uid}-title`}
      aria-describedby={description ? `${uid}-desc` : undefined}
      data-size={size}
      data-side={side}
      onClose={() => { onOpenChange(false); const r = returnTo.current as HTMLElement | null; if (r?.isConnected) r.focus() }}
      onClick={(e) => { if (dismissible && e.target === e.currentTarget) onOpenChange(false) }}
      className={cx('kafka-dialog', className)}
    >
      <div className="flex max-h-[inherit] min-h-0 flex-1 flex-col gap-(--kafka-modal-gap) p-(--kafka-modal-padding)">
        <div className="flex items-start justify-between gap-(--kafka-modal-gap)">
          <div className="flex flex-col gap-(--kafka-modal-actions-gap)">
            <h2 id={`${uid}-title`} className="kafka-type-modal-title-type m-0">{title}</h2>
            {description && <p id={`${uid}-desc`} className="m-0 text-(--kafka-modal-description)">{description}</p>}
          </div>
          <IconButton Icon={IconClose} label={labels.close} variant="soft" onClick={() => onOpenChange(false)} className="-mt-2 -mr-2" />
        </div>
        {children && <div className="min-h-0 overflow-y-auto">{children}</div>}
        {actions && <div className="flex flex-wrap justify-end gap-(--kafka-modal-actions-gap)">{actions}</div>}
      </div>
    </dialog>
  )
}
