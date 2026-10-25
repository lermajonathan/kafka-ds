/* Registry of documented components. Add an entry here when a component ships. */
import type { Example } from './types'
import { examples as button } from './button'
import { examples as icon_button } from './icon-button'
import { examples as button_group } from './button-group'
import { examples as link } from './link'
import { examples as badge } from './badge'
import { examples as chip } from './chip'
import { examples as field } from './field'
import { examples as input } from './input'
import { examples as textarea } from './textarea'
import { examples as select } from './select'
import { examples as checkbox } from './checkbox'
import { examples as radio } from './radio'
import { examples as switch_ } from './switch'
import { examples as slider } from './slider'
import { examples as pin_input } from './pin-input'
import { examples as tag_input } from './tag-input'
import { examples as file_upload } from './file-upload'
import { examples as tabs } from './tabs'
import { examples as accordion } from './accordion'
import { examples as breadcrumbs } from './breadcrumbs'
import { examples as pagination } from './pagination'
import { examples as stepper } from './stepper'
import { examples as popover } from './popover'
import { examples as menu } from './menu'
import { examples as tooltip } from './tooltip'
import { examples as combobox } from './combobox'
import { examples as modal } from './modal'
import { examples as drawer } from './drawer'
import { examples as confirm_dialog } from './confirm-dialog'
import { examples as calendar } from './calendar'
import { examples as date_picker } from './date-picker'
import { examples as prose } from './prose'
import { examples as pull_quote } from './pull-quote'
import { examples as footnote } from './footnote'
import { examples as verse } from './verse'
import { examples as epigraph } from './epigraph'
import { examples as drop_cap } from './drop-cap'
import { examples as reading_progress } from './reading-progress'
import { examples as toc } from './toc'
import { examples as reading_settings } from './reading-settings'
import { examples as prev_next } from './prev-next'
import { examples as figure } from './figure'
import { examples as author } from './author'
import { examples as reading_time } from './reading-time'
import { examples as embed } from './embed'
import { examples as alert } from './alert'
import { examples as divider } from './divider'
import { examples as skeleton } from './skeleton'
import { examples as empty_state } from './empty-state'
import { examples as card } from './card'
import { examples as panel } from './panel'
import { examples as avatar } from './avatar'
import { examples as progress } from './progress'
import { examples as spinner } from './spinner'
import { examples as toast } from './toast'
import { examples as count_badge } from './count-badge'
import { examples as notification_center } from './notification-center'

export interface ComponentEntry {
  /** Name as exported from the library. */
  name: string
  /** Source file in src/components. */
  file: string
  examples: Example[]
}

export const registry: Record<string, ComponentEntry> = {
  button: { name: 'Button', file: 'button.tsx', examples: button },
  'icon-button': { name: 'IconButton', file: 'icon-button.tsx', examples: icon_button },
  'button-group': { name: 'ButtonGroup', file: 'button-group.tsx', examples: button_group },
  'link': { name: 'Link', file: 'link.tsx', examples: link },
  'badge': { name: 'Badge', file: 'badge.tsx', examples: badge },
  'chip': { name: 'Chip', file: 'chip.tsx', examples: chip },
  'field': { name: 'Field', file: 'field.tsx', examples: field },
  'input': { name: 'Input', file: 'input.tsx', examples: input },
  'textarea': { name: 'Textarea', file: 'textarea.tsx', examples: textarea },
  'select': { name: 'Select', file: 'select.tsx', examples: select },
  'checkbox': { name: 'Checkbox', file: 'checkbox.tsx', examples: checkbox },
  'radio': { name: 'Radio', file: 'radio.tsx', examples: radio },
  'switch': { name: 'Switch', file: 'switch.tsx', examples: switch_ },
  'slider': { name: 'Slider', file: 'slider.tsx', examples: slider },
  'pin-input': { name: 'PinInput', file: 'pin-input.tsx', examples: pin_input },
  'tag-input': { name: 'TagInput', file: 'tag-input.tsx', examples: tag_input },
  'file-upload': { name: 'FileUpload', file: 'file-upload.tsx', examples: file_upload },
  'tabs': { name: 'Tabs', file: 'tabs.tsx', examples: tabs },
  'accordion': { name: 'Accordion', file: 'accordion.tsx', examples: accordion },
  'breadcrumbs': { name: 'Breadcrumbs', file: 'breadcrumbs.tsx', examples: breadcrumbs },
  'pagination': { name: 'Pagination', file: 'pagination.tsx', examples: pagination },
  'stepper': { name: 'Stepper', file: 'stepper.tsx', examples: stepper },
  'popover': { name: 'Popover', file: 'popover.tsx', examples: popover },
  'menu': { name: 'Menu', file: 'menu.tsx', examples: menu },
  'tooltip': { name: 'Tooltip', file: 'tooltip.tsx', examples: tooltip },
  'combobox': { name: 'Combobox', file: 'combobox.tsx', examples: combobox },
  'modal': { name: 'Modal', file: 'modal.tsx', examples: modal },
  'drawer': { name: 'Drawer', file: 'drawer.tsx', examples: drawer },
  'confirm-dialog': { name: 'ConfirmDialog', file: 'confirm-dialog.tsx', examples: confirm_dialog },
  'calendar': { name: 'Calendar', file: 'calendar.tsx', examples: calendar },
  'date-picker': { name: 'DatePicker', file: 'date-picker.tsx', examples: date_picker },
  'prose': { name: 'Prose', file: 'prose.tsx', examples: prose },
  'pull-quote': { name: 'PullQuote', file: 'pull-quote.tsx', examples: pull_quote },
  'footnote': { name: 'Footnote', file: 'footnote.tsx', examples: footnote },
  'verse': { name: 'Verse', file: 'verse.tsx', examples: verse },
  'epigraph': { name: 'Epigraph', file: 'epigraph.tsx', examples: epigraph },
  'drop-cap': { name: 'DropCap', file: 'drop-cap.tsx', examples: drop_cap },
  'reading-progress': { name: 'ReadingProgress', file: 'reading-progress.tsx', examples: reading_progress },
  'toc': { name: 'TableOfContents', file: 'toc.tsx', examples: toc },
  'reading-settings': { name: 'ReadingSettings', file: 'reading-settings.tsx', examples: reading_settings },
  'prev-next': { name: 'PrevNext', file: 'prev-next.tsx', examples: prev_next },
  'figure': { name: 'Figure', file: 'figure.tsx', examples: figure },
  'author': { name: 'Author', file: 'author.tsx', examples: author },
  'reading-time': { name: 'ReadingTime', file: 'reading-time.tsx', examples: reading_time },
  'embed': { name: 'Embed', file: 'embed.tsx', examples: embed },
  'alert': { name: 'Alert', file: 'alert.tsx', examples: alert },
  'divider': { name: 'Divider', file: 'divider.tsx', examples: divider },
  'skeleton': { name: 'Skeleton', file: 'skeleton.tsx', examples: skeleton },
  'empty-state': { name: 'EmptyState', file: 'empty-state.tsx', examples: empty_state },
  'card': { name: 'Card', file: 'card.tsx', examples: card },
  'panel': { name: 'Panel', file: 'panel.tsx', examples: panel },
  'avatar': { name: 'Avatar', file: 'avatar.tsx', examples: avatar },
  'progress': { name: 'Progress', file: 'progress.tsx', examples: progress },
  'spinner': { name: 'Spinner', file: 'spinner.tsx', examples: spinner },
  'toast': { name: 'Toast', file: 'toast.tsx', examples: toast },
  'count-badge': { name: 'CountBadge', file: 'count-badge.tsx', examples: count_badge },
  'notification-center': { name: 'NotificationCenter', file: 'notification-center.tsx', examples: notification_center },
}
