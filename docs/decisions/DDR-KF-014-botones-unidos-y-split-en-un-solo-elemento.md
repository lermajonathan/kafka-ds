# DDR-KF-014 · Botones unidos y SplitButton en un solo elemento

- **Estado:** aceptada · 2026-10-26
- **Decide:** Jonathan Lerma (revisión visual de Figma). Reemplaza el espacio entre las dos partes que fijó DDR-KF-012 (corte 3c).

## Contexto

El SplitButton eran dos botones separados por 2 px para que cada uno conservara su anillo de foco completo. En Figma se leía como dos elementos pegados, no como uno. Tampoco había botones unidos (formato de texto), botón solo texto ni combinación de icono a ambos lados. Pance DS resuelve la unión con bordes compartidos y esquinas redondeadas solo por fuera.

## Decisión

- **SplitButton** es un solo elemento: las partes se tocan, solo las esquinas exteriores son redondeadas y una línea interna (`button-group.divider`, 1 px) separa el cuerpo de la flecha. Se elimina el token `split-button.gap`.
- **ButtonGroup `joined`** usa la misma forma para opciones que actúan sobre lo mismo. Sin `joined`, sigue separado y con `gap`.
- **Foco:** en las piezas unidas el anillo se dibuja hacia dentro (`outline-offset` negativo) y la pieza enfocada sube de capa; ninguna parte pierde su anillo.
- **Button `link`:** variante solo texto, siempre subrayada, de 44 px de alto. Sigue siendo un botón (acción en la página); para navegar se usa Link.
- **Iconos:** `Icon` y `TrailingIcon` pueden ir juntos.

## Alternativas descartadas

- **Mantener el espacio:** conserva el anillo, pero se lee como dos controles.
- **Solapar bordes con margen negativo:** el anillo de foco queda tapado por el vecino.
