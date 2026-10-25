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

## Corte 3a (SegmentedControl, ThemeProvider, ThemeToggle)
- **SegmentedControl** es un `radiogroup` con una sola parada de Tab y flechas que mueven y seleccionan (con vuelta al extremo, Home y End). Mide 44 px (`md`) o 32 px (`sm`, para barras densas). La opción activa se distingue por superficie y borde de marca, no solo por color.
- **ThemeProvider** pone `data-theme` en `<html>`, recuerda la elección en `localStorage` (`kafka-theme`; `storageKey={null}` lo apaga) y sigue el dispositivo con «Sistema», incluso si este cambia. `themeInitScript()` evita el parpadeo del primer pintado. La clave de almacenamiento es `kafka-theme`, no la de Pance.
- **ThemeToggle** es un SegmentedControl con icono y texto (Claro, Oscuro, Sistema). `ReadingSettings` conserva su propio control de tema.
- **Pruebas de axe:** se escanean con movimiento reducido; sin eso, la entrada animada de NewsBox se leía a medio desvanecer y daba un falso fallo de contraste.

## Corte 3b (CheckboxGroup, RadioCard; SwitchRow ya existe)
- **SwitchRow no se construye: `Switch` ya es esa fila.** `Switch` de Kafka es una fila completa (texto y descripción a la izquierda, interruptor a la derecha, toda la fila clicable, 44 px) y la prueba existente la cubre. Crear otro componente sería duplicarlo. Queda como equivalente en la tabla de la auditoría.
- **CheckboxGroup** es un `fieldset` con `legend` (no `role="group"` suelto), controlado con un arreglo de valores en lugar del `Set` de Pance. «Seleccionar todos» es un `Checkbox` real con estado mixto y omite las opciones deshabilitadas. Lleva pista y error como `RadioGroup`.
- **RadioCard** es un radio nativo mostrado como tarjeta, no un `button role="radio"` como en Pance: así las flechas, el Tab y el envío de formularios funcionan sin código propio. Se acompaña de **`RadioCardGroup`** (fieldset, legend, nombre compartido, pista y error), que Pance no tiene. El nombre accesible es el título y la descripción va con `aria-describedby`. La tarjeta elegida se distingue por borde de marca y punto relleno, no solo por color.

## Corte 3c (InputGroup, InlineEdit, SplitButton, ToggleButton)
- **InputGroup** recibe el `Input` como hijo y pega a sus lados texto, iconos o un botón de acción; solo las esquinas exteriores son redondas y la parte enfocada sube sobre sus vecinas para que el anillo no se recorte. Los complementos no nombran el campo: lo nombra el `Field`. Pance lo lograba con selectores `!important` sobre el input; aquí es CSS propio de la familia.
- **InlineEdit** exige `label` (nombra el campo y se lee como «Editar {campo}»). Enter guarda y devuelve el foco al botón, Escape cancela, salir del campo guarda, y un valor vacío no se guarda. El lápiz está siempre visible (en Pance solo al pasar el puntero, lo que dejaba sin pista a quien usa táctil o teclado).
- **SplitButton** compone `Button` y `Menu`: dos botones de 44 px separados por un espacio pequeño para que cada uno conserve su anillo de foco completo. La flecha se llama «Más acciones» y lleva `aria-haspopup="menu"`.
- **ToggleButton** conserva siempre la misma etiqueta y deja el estado a `aria-pressed`, a diferencia de Pance, que cambiaba el texto («Seguir» / «Dejar de seguir») y a la vez `aria-pressed`, lo que se lee doble. El estado pulsado se ve por la variante rellena y, si se pasa `PressedIcon`, también por el icono.
- `IconSearch` se añade a los iconos.
