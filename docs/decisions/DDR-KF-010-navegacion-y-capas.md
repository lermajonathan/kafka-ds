# DDR-KF-010 · Navegación y capas (H4)

- **Estado:** aceptada · 2026-10-21
- **Decide:** Jonathan Lerma.

## Decisiones

1. **Las capas usan la plataforma, no z-index.** `Popover`, `Menu`, `Combobox` y `Tooltip` son elementos con `popover="manual"`, que el navegador pinta en la *top layer*: ningún contenedor con `overflow` o `transform` los recorta y no hay guerra de z-index. Por eso no existen tokens `*.z` en estos componentes. Lo que la API nativa no hace lo hace `overlay.ts`: posicionar junto al ancla (con volteo y ajuste al borde de la pantalla), cerrar con Esc o clic fuera y devolver el foco.
2. **`Modal`, `Drawer` y `ConfirmDialog` son `<dialog>` nativo con `showModal()`.** El navegador vuelve inerte la página de atrás, atrapa el foco, cierra con Esc y entrega el foco al elemento que lo abrió. No se reimplementa nada de eso. El cajón es un modal con `side` (`start`, `end`, `bottom`).
3. **Foco inicial: el primer control, salvo en `danger`.** En `ConfirmDialog` con `tone="danger"` el foco empieza en *Cancelar* (`data-autofocus`), un clic fuera no lo cierra y el botón de confirmar repite la acción («Eliminar relato», no «Aceptar»).
4. **`Tooltip` solo describe.** Está siempre en el DOM con `role="tooltip"` y se enlaza con `aria-describedby`; aparece con el foco de teclado o tras una pausa del puntero, se queda mientras el puntero está encima y se oculta con Esc (WCAG 1.4.13). Nunca contiene enlaces ni botones.
5. **`Combobox` mantiene el foco en el campo** y expone la opción activa con `aria-activedescendant`. El filtro ignora tildes y un estado `polite` anuncia cuántos resultados hay. Entra aquí, movido desde H3 (DDR-KF-009, punto 7).
6. **Fechas como cadenas ISO (`YYYY-MM-DD`).** Sin hora no hay zona horaria ni desfases de un día. `Calendar` es una cuadrícula (`role="grid"`) con un solo punto de tabulación y botones con la fecha completa como nombre; `DatePicker` deja escribir `dd/mm/aaaa` (la orden se configura) **y** abrir el calendario: ambos escriben el mismo valor. Si lo escrito no es una fecha válida o queda fuera de `min`/`max`, el texto se conserva y el campo se marca como inválido; nunca se descarta en silencio.
7. **Navegación que informa sin color.** `Tabs` marca la activa con subrayado y peso; `Pagination` y `Breadcrumbs` usan `aria-current="page"`; `Stepper` lleva un texto oculto («Paso 2 de 4, paso actual») y marca los completados con un ícono de verificación y borde, de modo que el dorado nunca es lo único que lo distingue (el relleno solo llega a 2:1 contra la página).
8. **Todo objetivo táctil mide 44 px:** pestañas, títulos del acordeón, ítems de menú y opciones, números de página, días del calendario y cierre del modal.
9. **No entran en v1 de H4:** menú contextual, submenús, `Select` personalizado, selector de rango de fechas, `Popconfirm` y `Toast` (este último va en H5 con las superficies de retroalimentación).

## Consecuencias

- 14 componentes y 175 tokens de componente nuevos; 40 pares de contraste, 90 comprobaciones de teclado y ARIA nuevas, y axe-core también sobre los overlays **abiertos** (los ejemplos los muestran cerrados).
- Al escribir las pruebas aparecieron cuatro defectos: el foco inicial de `ConfirmDialog` caía en «Cerrar», el marcador de paso completado no llegaba a 3:1 contra la página (ver 7), un `DatePicker` descartaba en silencio lo que el lector escribía (ver 6) y el `Popover` no se cerraba al salir por teclado de su último control.
- La versión en Figma sigue pendiente para H7.
