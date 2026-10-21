/* Kafka · helpers shared by every component. */

/** Joins class names, dropping falsy values. Class strings stay written out in full so Tailwind can see them. */
export const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ')

/** The focus ring. Defined once in styles/components.css from the `focus.*` tokens; applies on `:focus-visible` only. */
export const focus = 'kafka-focus'

/** Focus ring for a visible element that follows a visually hidden input (`peer`): checkbox box, radio dot, switch track. */
export const peerFocus =
  'peer-focus-visible:outline-(length:--kafka-focus-width) peer-focus-visible:outline-offset-(--kafka-focus-offset) peer-focus-visible:outline-(--kafka-color-border-focus)'
