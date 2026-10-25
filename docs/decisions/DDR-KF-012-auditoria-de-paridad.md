---
id: DDR-KF-012
title: Auditoría de paridad con Pance
status: aceptada
date: 2026-10-25
---

# DDR-KF-012 · Auditoría de paridad con Pance

## Método
Se compararon los componentes exportados por `src/components` de Pance (72) y de Kafka (67). Doce de Pance son de visualización de datos y quedan fuera por [DDR-KF-004](DDR-KF-004-alcance-v1.md). Los demás se clasificaron como equivalentes, faltantes o propios de Kafka.

## Equivalentes con otro nombre o forma
| Pance | Kafka | Nota |
|---|---|---|
| Breadcrumb | Breadcrumbs | |
| DropdownMenu | Menu | |
| FileDropzone | FileUpload | |
| Steps | Stepper | |
| Toggle | Switch | |
| TabPanel | Tabs | Los paneles viajan dentro de `items`, no como pieza aparte |
| PanceProvider | KafkaProvider | |
| Divider | Divider | Pance usa `div role="separator"`; Kafka usa `<hr>`, que ya tiene el rol |

## Faltantes (14) y decisión
Jonathan decidió construirlos todos antes de cerrar H5, en un corte 3 dividido en cuatro partes. Cada uno sigue TDD y los criterios de DDR-KF-004.

| Corte | Componentes | Motivo |
|---|---|---|
| 3a | SegmentedControl, ThemeProvider, ThemeToggle | Tema claro, oscuro o sistema para lectores; hoy solo existe dentro de ReadingSettings |
| 3b | CheckboxGroup, SwitchRow, RadioCard | Formularios: seleccionar todos, filas de ajuste, inscripción a talleres |
| 3c | InputGroup, InlineEdit, SplitButton, ToggleButton | Formularios y acciones del CRM |
| 3d | NavMenu, RangeSlider, RangeCalendar, DateRangePicker | Navegación de app y rangos |

DDR-KF-009 había pospuesto varios de estos «a la auditoría de H5»; esta DDR cierra esa revisión.

## Propios de Kafka (sin equivalente en Pance)
Los 14 de lectura (Prose, PullQuote, Footnote, Verse, Epigraph, DropCap, ReadingProgress, TableOfContents, ReadingSettings, PrevNext, Figure, Author, ReadingTime, Embed), más Chip, NewsBox y ProgramCard.

## Consecuencias
- El alcance de v1 sube de 59 a 73 componentes heredados; H5 no cierra hasta el corte 3d.
- Sigue sin publicarse en npm antes de H8.
