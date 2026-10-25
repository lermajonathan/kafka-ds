# Registro de cambios

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Kafka no se publica en npm hasta la 1.0.0.

## [Sin publicar]

### H5 · Retroalimentación y superficies, corte 1a (25 oct 2026)
- **4 componentes**: [Alert](docs/components/alert.md), [Divider](docs/components/divider.md), [Skeleton](docs/components/skeleton.md) y [EmptyState](docs/components/empty-state.md) ([DDR-KF-011](docs/decisions/DDR-KF-011-retroalimentacion-y-superficies.md)).
- `Alert` informa sin interrumpir (`role="status"`; `urgent` usa `role="alert"`), con ícono y borde en cada tono. `Skeleton` anuncia «Cargando» una sola vez y se detiene con movimiento reducido.
- 860 tokens; 244 pares de contraste en claro y 243 en oscuro; 302 comprobaciones de teclado y ARIA; axe-core sin violaciones en 49 componentes (228 páginas).
- Pendiente de H5: Card, Panel, Avatar, Progress (1b), Toast y notificaciones (1c), y las tarjetas VIP, de noticias y de programa (corte 2).

### H4 · Navegación y capas (21 oct 2026)
- **14 componentes**: [Tabs](docs/components/tabs.md), [Accordion](docs/components/accordion.md), [Breadcrumbs](docs/components/breadcrumbs.md), [Pagination](docs/components/pagination.md), [Stepper](docs/components/stepper.md), [Popover](docs/components/popover.md), [Menu](docs/components/menu.md), [Tooltip](docs/components/tooltip.md), [Combobox](docs/components/combobox.md), [Modal](docs/components/modal.md), [Drawer](docs/components/drawer.md), [ConfirmDialog](docs/components/confirm-dialog.md), [Calendar](docs/components/calendar.md) y [DatePicker](docs/components/date-picker.md) ([DDR-KF-010](docs/decisions/DDR-KF-010-navegacion-y-capas.md)).
- Capas con la API nativa `popover` y `<dialog>`; fechas como cadenas ISO; `Button` e `IconButton` aceptan `ref` como prop.
- Tokens nuevos `color.bg.scrim`, `size.menu`, `size.listbox` y `size.dialog.*`; 819 tokens en total.
- 226 pares de contraste en claro y 225 en oscuro; 278 comprobaciones de teclado y ARIA; axe-core sin violaciones en 45 componentes (212 páginas, incluidos los overlays abiertos).
- Pendiente: la versión en Figma (H7).

### H3 · UI esencial (21 oct 2026)
- **16 componentes**: [IconButton](docs/components/icon-button.md), [ButtonGroup](docs/components/button-group.md), [Link](docs/components/link.md), [Badge](docs/components/badge.md), [Chip](docs/components/chip.md), [Field](docs/components/field.md), [Input](docs/components/input.md), [Textarea](docs/components/textarea.md), [Select](docs/components/select.md), [Checkbox](docs/components/checkbox.md), [Radio](docs/components/radio.md), [Switch](docs/components/switch.md), [Slider](docs/components/slider.md), [PinInput](docs/components/pin-input.md), [TagInput](docs/components/tag-input.md) y [FileUpload](docs/components/file-upload.md) ([DDR-KF-009](docs/decisions/DDR-KF-009-ui-esencial-y-estados.md)).
- **Colores de estado** `color.status.*` (peligro, éxito, aviso, info) con cuatro escalas primitivas, verificados en claro y oscuro. Rol tipográfico `typography.ui.input` (16 px).
- 648 tokens; 184 pares de contraste en claro y 183 en oscuro; 183 comprobaciones de teclado y ARIA; axe-core sin violaciones en 31 componentes (124 páginas).

### H2 · Componentes de lectura (21 oct 2026)
- **14 componentes**: [Prose](docs/components/prose.md), [PullQuote](docs/components/pull-quote.md), [Footnote](docs/components/footnote.md), [Verse](docs/components/verse.md), [Epigraph](docs/components/epigraph.md), [DropCap](docs/components/drop-cap.md), [ReadingProgress](docs/components/reading-progress.md), [TableOfContents](docs/components/toc.md), [ReadingSettings](docs/components/reading-settings.md), [PrevNext](docs/components/prev-next.md), [Figure](docs/components/figure.md), [Author](docs/components/author.md), [ReadingTime](docs/components/reading-time.md) y [Embed](docs/components/embed.md) ([DDR-KF-008](docs/decisions/DDR-KF-008-componentes-de-lectura.md)).
- 141 tokens de componente nuevos (214 en total); textos de la interfaz en inglés y español (`labelsEs`).
- 37 pares de contraste nuevos (ahora 102 en claro y 101 en oscuro), 89 comprobaciones de teclado y ARIA, axe-core en 15 componentes × 2 tamaños × 2 temas con 0 violaciones, y los paquetes exportan y renderizan en servidor todos los componentes documentados.
- Pendiente: la versión en Figma de estos componentes (H7).

### H1 · Librería (21 oct 2026)
- **Pila**: React 19, Tailwind v4, Vite 8, TypeScript 5.9 y pnpm 10 ([DDR-KF-007](docs/decisions/DDR-KF-007-pila-de-la-libreria.md)).
- **Tema de Tailwind generado desde los tokens** (`src/styles/theme.css`) que desactiva paletas, tamaños, radios y sombras por defecto, más una clase por rol tipográfico (`typography.css`).
- **Primer componente terminado: [Button](docs/components/button.md)**, con variantes primary, soft y outline, íconos, estado de carga y deshabilitado, anillo de foco desde tokens y 44 px de alto.
- **Íconos**: selección nombrada de Phosphor (`src/icons.tsx`). **Textos**: `KafkaProvider`, `labelsEn` y `labelsEs`.
- **Playground** con todos los ejemplos (`?theme=dark`, `?only=button`).
- **Documentación generada** por componente (props desde los tipos, ejemplos ejecutables) y `docs:check` en CI.
- **Paquetes** `@kafka/tokens` y `@kafka/react` (sin publicar), probados instalándolos como tarball en un proyecto nuevo (28 comprobaciones: archivos, hoja de estilos, render en servidor y tipos).
- **Pruebas nuevas**: teclado y ARIA en navegador real (16 comprobaciones), axe-core (cada ejemplo × 2 tamaños × 2 temas, 0 violaciones), ejemplos de la documentación, diferencia visual contra la rama base. El lint ahora revisa componentes y ejemplos, y detecta colores de la paleta de Tailwind.

### H0 · Cimientos (21 oct 2026)
- **Tokens**: de 184 a 313. Nuevos: estados (`bg.hover`, `bg.active`, `bg.sunken-hover/active`, `bg.brand-hover/active`), enlaces (`fg.link-hover`, `fg.link-visited`), `selection` y `highlight`, capas (`layer.*`), movimiento (`motion.*`), `opacity.disabled`, breakpoints, `layout.*`, pesos y espaciado de letra como primitivos, y los roles de lectura `quote`, `footnote` y `dropcap`.
- **Módulo de impresión**: primitivos `physical.*` (páginas A5, A4 y Carta, sangrado, márgenes, tipografía en puntos, rejilla de 3,5 pt) y semánticos `print.*` para libro, revista y ficha.
- **Componentes de tokens**: estados hover, activo y deshabilitado en botón y chip. Ya no leen colores, sombras ni movimiento primitivos.
- **Cambio**: el degradado `gradient.vip` pasó de primitivos a semánticos; los colores de la tarjeta VIP son ahora `color.vip.*`.
- **Compilador**: soporta `fontStyle` en tipografía y alias entre tokens de tipografía.
- **Pruebas**: contraste de 87 a 129 pares; nueva `test:structure` (reglas de capas, escalas, rejilla de impresión y modos); `test:lint` comprueba que el lint detecta hex, `rgb()` y dimensiones mágicas.
- **Gobierno**: README, CONTRIBUTING, GOVERNANCE, SECURITY, CODE_OF_CONDUCT y política de deprecación.
- **Decisiones**: DDR-KF-004 (alcance), 005 (impresión) y 006 (cimientos de tokens).

### Antes de H0
- Tokens v0.1 (184), compilador, pruebas de contraste, CI y DDR-KF-001 a 003.
