# DDR-KF-009 · UI esencial y colores de estado (H3)

- **Estado:** aceptada · 2026-10-21
- **Decide:** Jonathan Lerma.

## Decisiones

1. **Colores de estado como semánticos** (`color.status.{danger,success,warning,info}.{fg,bg,border}`), con cuatro escalas primitivas nuevas (red, green, amber, blue). Los componentes nunca leen la primitiva. `fg` pasa 4,5:1 sobre su fondo, la página y la superficie; `border` pasa 3:1 contra la página. Solo se usan con un ícono o un texto al lado: el color no es nunca la única señal.
2. **Un solo tamaño de control: 44 px.** Pance tiene `sm/md/lg`; Kafka no, porque un control más pequeño que el área táctil de 44 px es justo lo que el criterio de «completo» (DDR-KF-004, punto 4) prohíbe, y porque un DS literario no necesita densidad de tablero. El texto de los campos es de 16 px (por debajo, iOS amplía la página al enfocar).
3. **Controles nativos por debajo.** `Checkbox`, `Radio`, `Switch`, `Slider` y `FileUpload` envuelven un `<input>` real, con la marca dibujada aparte y `pointer-events: none`. `Select` es el `<select>` nativo. Así teclado, autocompletado, formularios y lectores de pantalla funcionan sin código propio. El combobox con búsqueda queda para H4, con las capas.
4. **`Field` conecta por contexto** (id, `aria-describedby`, `aria-invalid`, `aria-required`), de modo que ningún control repite ids. El error va en una región `aria-live="polite"` con ícono. «Obligatorio» se escribe en palabras, no solo con asterisco.
5. **El borde de los campos usa `border.strong`** (3:1) y no `border.default`: sin relleno diferenciador, el borde es lo que identifica el campo (WCAG 1.4.11).
6. **El relleno del deslizador es un indicio redundante.** La tinta sobre el riel solo se separa 2,6:1; el valor lo llevan la posición del pulgar (3:1 contra la página) y el texto impreso. Está documentado en la página del componente.
7. **No entran en v1 de H3:** `InputGroup`, `InlineEdit`, `Combobox` (H4), `SplitButton` y `ToggleButton` (superficies de capas o de poco uso en el sitio), `RadioCard`, `SegmentedControl` y `CheckboxGroup` (se componen con los anteriores). Se revisan en la auditoría de paridad de H5.

## Consecuencias

- 16 componentes, 363 tokens de componente (648 en total), 82 pares de contraste nuevos y 94 comprobaciones de teclado y ARIA nuevas.
- Al escribir las pruebas aparecieron tres defectos: la marca dibujada interceptaba los clics del input, el relleno del deslizador no llegaba a 3:1 contra el riel (ver 6) y el texto del deslizador se partía en dos líneas.
- La versión en Figma sigue pendiente para H7.
