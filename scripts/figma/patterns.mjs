// Pattern pages of the Figma file: how components combine into the screens of a literary-arts site.
// Compositions live in figma/patterns/<id>.js (built with real instances of the component masters).
const u = (name, role) => ({ name, role })

const PATTERNS = [
  {
    id: 'reading',
    page: 'Reading',
    name: 'Reading an article or poem',
    category: 'Reading',
    summary: 'A calm, single-column reading surface: the text leads, tools stay at the edges.',
    whenTo: ['Essays, chronicles and blog posts with a reading column of 45–75 characters.', 'Poems and verse, where line breaks carry meaning.', 'Any long text a person may leave and return to.'],
    dos: ['Keep one reading column; put the table of contents and settings beside it, never inside it.', 'Show reading progress and time up front so the person can decide to start.', 'Offer previous / next at the end, with titles, not just arrows.', 'Let the person change size and theme without leaving the text.'],
    donts: ['Do not place banners, cards or alerts between paragraphs.', 'Do not cut a poem\'s lines to fit: let the stanza scroll sideways or reduce the size.', 'Do not rely on colour alone to mark footnote calls.'],
    accessibility: ['The article is one <main> with a single <h1>; the table of contents is a <nav> with a label.', 'Reading progress is decorative and hidden from assistive technology; reading time is plain text.', 'Footnote calls are links with an accessible name ("Nota 1") and return links.', 'Body text keeps 7:1 contrast in light and dark; sizes follow the person\'s settings.'],
    uses: [u('ReadingProgress', 'Thin bar fixed at the top; shows how far the person has read.'), u('Breadcrumbs', 'Where the text lives in the site.'), u('ReadingTime', 'Estimated time, next to the title.'), u('Author', 'Byline with optional bio.'), u('Prose', 'The reading column itself.'), u('PullQuote', 'One highlighted line per section, at most.'), u('Footnote', 'Calls inline and notes at the end.'), u('TableOfContents', 'Section links in the side rail.'), u('ReadingSettings', 'Size, theme and spacing.'), u('PrevNext', 'Move on at the end of the text.'), u('Divider', 'Separates the text from what follows.')],
    related: ['Prose', 'Verse', 'TableOfContents'],
  },
  {
    id: 'enrollment',
    page: 'Enrollment',
    name: 'Enrollment and payment',
    category: 'Flows',
    summary: 'A guided, four-step enrollment: who you are, which workshop, how you pay, confirmation.',
    whenTo: ['Signing up for a workshop, with manual payment confirmed by the team.', 'Any flow with more than one screen and a point of no return.'],
    dos: ['Show the whole path with the Stepper and keep the person on the current step.', 'Summarise the chosen workshop with a ProgramCard next to the form.', 'Validate on blur and again on submit; the error says how to fix it.', 'Ask for confirmation before anything that costs money.', 'End with a clear status: received, in review, confirmed.'],
    donts: ['Do not open a modal to start the flow: it is a page.', 'Do not ask for data the team already has.', 'Do not show a success Toast as the only proof of a payment: keep the status on the page.'],
    accessibility: ['The Stepper is an ordered list; the current step has aria-current="step".', 'Every field has a visible label and, when it fails, a message linked with aria-describedby.', 'On a validation error focus moves to the first invalid field and an Alert summarises the problems.', 'The confirmation dialog traps focus and returns it to the button that opened it.'],
    uses: [u('Stepper', 'Four steps: data, program, payment, confirmation.'), u('Field', 'Label, control, hint and error as one unit.'), u('Input', 'Text, email and phone entries.'), u('RadioCardGroup', 'Choose a payment method.'), u('ProgramCard', 'Recap of the chosen workshop.'), u('Alert', 'Summary of errors or the payment status.'), u('Button', 'Continue, back and pay.'), u('ButtonGroup', 'Keeps back and continue together.'), u('ConfirmDialog', 'Last check before sending.'), u('Toast', 'Short confirmation after saving a step.')],
    related: ['Stepper', 'Field', 'ConfirmDialog'],
  },
  {
    id: 'catalog',
    page: 'Catalog',
    name: 'Workshop catalog',
    category: 'Browsing',
    summary: 'A grid of workshops that can be filtered, paged and understood at a glance.',
    whenTo: ['Listing programs, courses or editions with a cover, a price and a state.', 'Any collection the person scans before choosing.'],
    dos: ['Lead with filters as Chips for the few that matter (genre, level) and a Select for the rest.', 'Use ProgramCard consistently; the featured card is rare, the VIP card rarer.', 'Show a Skeleton while loading and an EmptyState with a way out when nothing matches.', 'Page with Pagination and keep the filters in the address.'],
    donts: ['Do not mix card sizes in one row.', 'Do not hide the price or the date behind a hover.', 'Do not use more than one featured card per page.'],
    accessibility: ['Chips are toggle buttons with aria-pressed; the group has a name.', 'The result count is announced politely when filters change.', 'Each card is one link; its name comes from the title, not from "Ver más".', 'Pagination is a <nav>; the current page has aria-current="page".'],
    uses: [u('SegmentedControl', 'Switch between upcoming and past editions.'), u('Chip', 'Quick filters.'), u('Select', 'Longer filter lists.'), u('ProgramCard', 'One workshop, with cover, badges and price.'), u('Badge', 'State: open, last spots, closed.'), u('Skeleton', 'Placeholder while the list loads.'), u('EmptyState', 'No results, with a way to clear filters.'), u('Pagination', 'Move through the results.')],
    related: ['ProgramCard', 'Chip', 'Pagination'],
  },
  {
    id: 'forms-navigation',
    page: 'Forms & navigation',
    name: 'Forms and global navigation',
    category: 'Structure',
    summary: 'The frame around every screen: where you are, how to move, and how a form tells you what went wrong.',
    whenTo: ['Building account, profile and settings screens.', 'Any screen that must keep navigation, notifications and theme in the same place.'],
    dos: ['Keep the NavMenu in one place across screens and mark the current section.', 'Use Breadcrumbs from the third level down, Tabs for views of the same thing.', 'Group a form\'s fields in a Field each and put its errors next to them.', 'Confirm destructive actions with a ConfirmDialog in the danger tone.', 'Keep the theme toggle in the header, never in the footer only.'],
    donts: ['Do not use Tabs to navigate between pages.', 'Do not hide required information in the NotificationCenter: it is for news, not for errors.', 'Do not stack more than one dialog.'],
    accessibility: ['The NavMenu is a <nav> with a label and aria-current on the active link; groups use buttons with aria-expanded.', 'Tabs follow the tabs pattern: arrow keys move, Tab leaves.', 'PinInput announces each box ("Dígito 1 de 6") and accepts pasting the whole code.', 'FileUpload is reachable and operable by keyboard; dragging is never the only way.'],
    uses: [u('NavMenu', 'Main sections, collapsible groups.'), u('Breadcrumbs', 'Path inside the current section.'), u('Tabs', 'Views of one thing (summary, program, price).'), u('Field', 'Every control with its label, hint and error.'), u('PinInput', 'Verification codes.'), u('FileUpload', 'Receipts and attachments.'), u('ConfirmDialog', 'Destructive or irreversible actions.'), u('NotificationCenter', 'News and reminders.'), u('ThemeToggle', 'Light, dark or system.')],
    related: ['NavMenu', 'Tabs', 'Field'],
  },
]

export function buildPatterns() { return PATTERNS }
