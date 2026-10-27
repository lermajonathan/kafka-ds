# Registro de cambios

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Kafka no se publica en npm hasta la 1.0.0.

## [Sin publicar]

### H7 · Sitio con profundidad, movimiento y cabecera móvil (27 oct 2026)

- **Profundidad:** sombra de reposo en la cabecera, el catálogo, el módulo de impresión, las tarjetas y los ejemplos en vivo. Las tarjetas se elevan al pasar el puntero o al recibir el foco, y el botón dorado gana un brillo.
- **Movimiento:** en «Papel, tinta y oro» el color bajo el puntero crece y los demás ceden sitio. Todo el movimiento se apaga con `prefers-reduced-motion`.
- **Cabecera móvil:** por debajo de 1000 px los enlaces pasan a un panel lateral (menú hamburguesa, con `Drawer`); entre 1000 y 1199 px el selector de tema muestra solo iconos.
- **Pie:** el nombre del autor enlaza a ux.jonathanlerma.com.
- **Librería:** `SegmentedControl` y `ThemeToggle` ganan `iconOnly` (solo iconos; el texto queda como nombre accesible y tooltip).

### Arreglo · enlaces sin contorno permanente (26 oct 2026)

- Una regla de CSS mal fusionada dibujaba el anillo de foco alrededor de todos los enlaces de la documentación. Ahora solo aparece con el foco del teclado; un test lo exige en cinco rutas.

### H7 · Sitio público sin decisiones ni hoja de ruta (26 oct 2026)

- Las decisiones (DDR-KF) y la hoja de ruta dejan de estar en el sitio: sin rutas, sin buscador, sin enlaces y sin menciones en el texto publicado. Siguen en el repositorio. Los tests lo exigen sobre los datos y sobre el sitio construido.
- El menú gana **Inicio** y un icono a la izquierda en Inicio, Primeros pasos, Componentes y Tokens.
- Todo enlace que sale a GitHub se abre en una pestaña nueva.

### H7 · Detalle en el catálogo y páginas internas (26 oct 2026)

- Cada componente se abre dentro del panel del catálogo: buscador arriba, familias a la izquierda (se expanden con sus componentes) y el detalle a la derecha, con ruta, importación, pestañas de sección, ejemplos en vivo, propiedades y anterior/siguiente.
- Las páginas internas (Primeros pasos, Componentes, Decisiones, Tokens) usan el lenguaje de la portada: ruta, buscador en la cabecera, título grande, índice «En esta página», secciones y banda de cierre. Se elimina la barra lateral y el botón Menú.

### H7 · Ajustes del sitio tras la primera revisión (26 oct 2026)

- Cabecera con el menú centrado, logotipo K sobre fondo dorado y etiqueta de versión alineada a la línea base; el buscador de las páginas de documentación pasa a la barra lateral.
- Estados hover en los botones de contorno, las etiquetas populares, la paginación y «Volver arriba».
- Fuera el «§» de los títulos Escala y Medida; Libro, Revista y Ficha dejan de ser enlaces.
- Espacio entre el campo de búsqueda y las etiquetas del catálogo.

### Arreglo · InlineEdit (26 oct 2026)
- `InlineEdit` devuelve el foco al botón en cuanto confirma o cancela, no un fotograma después. Antes, durante ese instante, el foco quedaba en la página; era la causa del test intermitente «Enter saves and focus returns to the button». Prueba nueva que lo exige sin depender del tiempo.

### H7 · Rediseño del sitio (26 oct 2026)
- **Nueva portada** (dirección F): cabecera con navegación principal y selector de tema, muestra de Literata con guías medidas, escala y medida, banda de tinta «Papel, tinta y oro», «Un texto. Dos páginas.», módulo de impresión, cifras y catálogo con buscador, familias, paginación y miniaturas reales de cada componente.
- **Pie de página** oscuro en todas las páginas. La cabecera deja de seguir al lector por debajo de 1200 px.
- `tests/site-browser.mjs` cubre cabecera, orden de secciones, banda oscura en ambos temas, catálogo, pie y que la guía de línea base coincida con la de la fuente.

### H7 · Sitio de documentación (26 oct 2026)
- **Sitio de documentación** en Vite y React (`site/`): inicio, primeros pasos, 70 páginas de componentes con ejemplos que corren encima de su código, 19 decisiones y la referencia de tokens. Claro y oscuro, navegable con teclado, sin peticiones fuera de su origen ([DDR-KF-019](docs/decisions/DDR-KF-019-sitio-de-documentacion.md)).
- `pnpm run dev:site`, `pnpm run build:site` y `pnpm run test:site` (datos, rutas, foco, tema, axe-core en dos tamaños y dos temas, sin desborde en 390 px). Se publica en GitHub Pages cuando `main` cambia (`.github/workflows/pages.yml`).
- Nueva guía [Primeros pasos](docs/getting-started.md).
- Pulido del sitio: **Literata autoalojada**, **buscador** (componentes, decisiones y páginas; atajo `/`) y **JavaScript dividido por página** (primera carga ≈120 kB comprimidos, antes 218 kB; `tests/site-size.mjs`).
- Figma: marco editorial (cabecera, línea dorada y colofón) en todas las páginas menos la portada; la página Decisions suma DDR-KF-019.

### H5 cerrado (25 oct 2026)
- Retroalimentación y superficies, tarjetas de Altazor y paridad con Pance terminados: **70 componentes**, 1113 tokens, 336/335 pares de contraste, 511 comprobaciones de teclado y ARIA y axe-core sin violaciones ([DDR-KF-011](docs/decisions/DDR-KF-011-retroalimentacion-y-superficies.md), [DDR-KF-012](docs/decisions/DDR-KF-012-auditoria-de-paridad.md)).
- Siguiente: **H5b**, Figma completo (fundaciones, páginas de componentes, patrones, decisiones), antes de H6 (impresión).

### H5 · Paridad con Pance, corte 3d-2 (25 oct 2026)
- **[RangeCalendar](docs/components/range-calendar.md)** y **[DateRangePicker](docs/components/date-range-picker.md)**, sobre un `CalendarBase` compartido con `Calendar` ([DDR-KF-012](docs/decisions/DDR-KF-012-auditoria-de-paridad.md)). Termina el corte 3.
- 1113 tokens; 336 pares de contraste en claro y 335 en oscuro; 511 comprobaciones de teclado y ARIA; axe-core sin violaciones.
- Siguiente: sincronizar las variables de Figma y cerrar H5.

### H5 · Paridad con Pance, corte 3d-1 (25 oct 2026)
- **[NavMenu](docs/components/nav-menu.md)**: navegación vertical con enlaces reales, grupos que se abren y modo compacto ([DDR-KF-012](docs/decisions/DDR-KF-012-auditoria-de-paridad.md)). `RangeSlider` no se construye: `Slider` ya cubre el deslizador de un valor.
- 1106 tokens; 333 pares de contraste en claro y 332 en oscuro; 489 comprobaciones de teclado y ARIA; axe-core sin violaciones.
- Sigue 3d-2 (RangeCalendar y DateRangePicker); después, variables de Figma.

### H5 · Paridad con Pance, corte 3c (25 oct 2026)
- **4 componentes**: [InputGroup](docs/components/input-group.md), [InlineEdit](docs/components/inline-edit.md), [SplitButton](docs/components/split-button.md) y [ToggleButton](docs/components/toggle-button.md) ([DDR-KF-012](docs/decisions/DDR-KF-012-auditoria-de-paridad.md)).
- `ToggleButton` no cambia su etiqueta con el estado; el lápiz de `InlineEdit` siempre es visible.
- 1089 tokens; 328 pares de contraste en claro y 327 en oscuro; 475 comprobaciones de teclado y ARIA; axe-core sin violaciones.
- Sigue 3d (NavMenu, RangeSlider, RangeCalendar, DateRangePicker); después, variables de Figma.

### H5 · Paridad con Pance, corte 3b (25 oct 2026)
- **[CheckboxGroup](docs/components/checkbox-group.md)** y **[RadioCard y RadioCardGroup](docs/components/radio-card.md)** ([DDR-KF-012](docs/decisions/DDR-KF-012-auditoria-de-paridad.md)). `SwitchRow` no se construye: `Switch` ya es una fila completa.
- 1074 tokens; 323 pares de contraste en claro y 322 en oscuro; 443 comprobaciones de teclado y ARIA; axe-core sin violaciones.
- Siguen: 3c (InputGroup, InlineEdit, SplitButton, ToggleButton) y 3d.

### H5 · Paridad con Pance, corte 3a (25 oct 2026)
- **3 piezas**: [SegmentedControl](docs/components/segmented-control.md), `ThemeProvider` y [ThemeToggle](docs/components/theme-toggle.md) (con `useTheme` y `themeInitScript`) ([DDR-KF-012](docs/decisions/DDR-KF-012-auditoria-de-paridad.md)).
- 1052 tokens; 316 pares de contraste en claro y 315 en oscuro; 421 comprobaciones de teclado y ARIA; axe-core sin violaciones (ahora con movimiento reducido para no leer animaciones a medias).
- Siguen: 3b (CheckboxGroup, SwitchRow, RadioCard), 3c y 3d.

### H5 · Auditoría de paridad con Pance (25 oct 2026)
- Comparados los 72 componentes exportados de Pance con los de Kafka: 8 equivalentes con otro nombre, 12 de datos fuera de alcance y **14 faltantes**. Decisión: construirlos todos en el corte 3 (3a–3d) antes de cerrar H5 ([DDR-KF-012](docs/decisions/DDR-KF-012-auditoria-de-paridad.md)).

### H5 · Retroalimentación y superficies, corte 2b (25 oct 2026)
- **[NewsBox](docs/components/news-box.md)**: caja de noticias con cuatro tipos, hasta tres noticias a la vez, puntos de navegación, cierre de 44 px y modo `floating` ([DDR-KF-011](docs/decisions/DDR-KF-011-retroalimentacion-y-superficies.md)). Sin rotación automática y sin trampa de foco.
- 1035 tokens; 312 pares de contraste en claro y 311 en oscuro; 402 comprobaciones de teclado y ARIA (la ausencia de rotación se prueba con reloj simulado); axe-core sin violaciones.
- Pendiente de H5: auditoría de paridad con Pance.

### H5 · Retroalimentación y superficies, corte 2a (25 oct 2026)
- **[ProgramCard](docs/components/program-card.md)**, **Card `highlight`** (`featured` | `vip`, reemplaza el booleano `featured`) y **Button `vip`** ([DDR-KF-011](docs/decisions/DDR-KF-011-retroalimentacion-y-superficies.md)).
- Portada con imagen (con `alt` obligatorio) o generada; la imagen rota cae a la generada. El brillo VIP y la elevación al pasar el puntero se detienen con movimiento reducido.
- 1024 tokens (nuevos grupos semánticos `color.cover.*` y `color.vip.button-*`); 308 pares de contraste en claro y 307 en oscuro; 382 comprobaciones de teclado y ARIA; axe-core sin violaciones.
- Pendiente de H5: caja de noticias (2b) y auditoría de paridad con Pance.

### H5 · Retroalimentación y superficies, corte 1c (25 oct 2026)
- **3 componentes**: [Toast y ToastStack](docs/components/toast.md), [CountBadge](docs/components/count-badge.md) y [NotificationCenter](docs/components/notification-center.md) ([DDR-KF-011](docs/decisions/DDR-KF-011-retroalimentacion-y-superficies.md)). Con esto termina el corte 1 de H5.
- `Toast` es controlado y se cierra a mano; `duration` opcional que se pausa con puntero y foco y que `danger` ignora. `NotificationCenter` conserva el foco dentro del panel al marcar o descartar.
- 983 tokens; 298 pares de contraste en claro y 297 en oscuro; 362 comprobaciones de teclado y ARIA (el temporizador se prueba con reloj simulado); axe-core sin violaciones en 57 componentes (268 páginas, con Toast y NotificationCenter también abiertos). axe obligó a dejar una sola pila de toasts por página.
- Pendiente de H5: tarjetas VIP, de noticias y de programa, y la auditoría de paridad con Pance (corte 2).

### H5 · Retroalimentación y superficies, corte 1b (25 oct 2026)
- **5 componentes**: [Card](docs/components/card.md), [Panel](docs/components/panel.md), [Avatar y AvatarGroup](docs/components/avatar.md), [Progress](docs/components/progress.md) y [Spinner](docs/components/spinner.md) ([DDR-KF-011](docs/decisions/DDR-KF-011-retroalimentacion-y-superficies.md)). Revisados contra Pance antes de implementarlos.
- `Progress` exige `label`; `Avatar` dice su estado en palabras; el colapso de `Panel` mide 44 px. Textos nuevos en `labelsEn` y `labelsEs` (estados de presencia y «+N»).
- 929 tokens; 269 pares de contraste en claro y 268 en oscuro; 333 comprobaciones de teclado y ARIA; axe-core sin violaciones en 54 componentes (248 páginas). axe encontró un `aria-label` sin rol en el chip «+N» y se corrigió.
- Pendiente de H5: Toast y notificaciones (1c) y las tarjetas VIP, de noticias y de programa (corte 2).

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
