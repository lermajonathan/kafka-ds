/* Kafka · Stepper */
import { type HTMLAttributes, type ReactNode } from 'react'
import { IconCheck } from '../icons'
import { useLabels } from './labels'
import { cx } from './shared'

export interface Step {
  label: string
  description?: ReactNode
}

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  steps: Step[]
  /** Index of the current step, starting at 0. Earlier steps are shown as completed. */
  current: number
}

/** The steps of a process, with the current one marked (`aria-current="step"`). It shows where you are; it is not navigation. Status is written for screen readers, not left to colour. */
export function Stepper({ steps, current, className, ...rest }: StepperProps) {
  const labels = useLabels()
  return (
    <ol className={cx('m-0 flex list-none flex-col gap-(--kafka-stepper-gap) p-0 sm:flex-row sm:gap-0', className)} {...rest}>
      {steps.map((step, i) => {
        const done = i < current, isCurrent = i === current
        return (
          <li key={step.label} aria-current={isCurrent ? 'step' : undefined} className="relative flex flex-1 gap-(--kafka-stepper-gap) sm:flex-col">
            <div className="flex items-center sm:w-full">
              <span
                aria-hidden="true"
                className={cx(
                  'kafka-type-stepper-label-type z-10 grid size-(--kafka-stepper-marker-size) shrink-0 place-items-center rounded-full border-(length:--kafka-stepper-marker-border-width)',
                  done && 'border-(--kafka-stepper-done-border) bg-(--kafka-stepper-done-bg) text-(--kafka-stepper-done-fg)',
                  isCurrent && 'border-(--kafka-stepper-current-bg) bg-(--kafka-stepper-current-bg) text-(--kafka-stepper-current-fg)',
                  !done && !isCurrent && 'border-(--kafka-stepper-marker-border) bg-(--kafka-stepper-marker-bg) text-(--kafka-stepper-marker-fg)',
                )}
              >
                {done ? <IconCheck className="size-(--kafka-size-icon-sm)" /> : i + 1}
              </span>
              {i < steps.length - 1 && <span aria-hidden="true" className={cx('ml-(--kafka-stepper-gap) hidden h-(--kafka-stepper-line-width) grow sm:block', done ? 'bg-(--kafka-stepper-line-done)' : 'bg-(--kafka-stepper-line)')} />}
            </div>
            <div className="pr-(--kafka-stepper-gap) sm:mt-(--kafka-stepper-gap)">
              <p className={cx('kafka-type-stepper-label-type', isCurrent || done ? 'font-bold text-(--kafka-stepper-label)' : 'text-(--kafka-stepper-label-muted)')}>
                {step.label}
                <span className="sr-only">. {labels.stepOf(i + 1, steps.length)}{done ? `, ${labels.stepDone}` : isCurrent ? `, ${labels.stepCurrent}` : ''}</span>
              </p>
              {step.description && <p className="kafka-type-stepper-description-type text-(--kafka-stepper-label-muted)">{step.description}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
