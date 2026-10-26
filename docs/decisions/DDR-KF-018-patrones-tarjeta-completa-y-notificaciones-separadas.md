# DDR-KF-018 · Patrones: tarjeta de programa completa y notificaciones sin leer separadas

- **Estado:** aceptada · 2026-10-26
- **Decide:** Jonathan Lerma (revisión visual de Figma, corte C6); la forma de separar las notificaciones la propuso Claude y queda abierta a ajuste.

## Contexto

- **ProgramCard (Enrollment y Catalog):** el cuerpo del master medía 191 px dentro de una tarjeta de 360, así que el texto se partía en cinco líneas y la tarjeta parecía corta y cortada. Además el master no tenía lo que sí tiene el componente: insignias sobre la portada, precio, datos con icono y acción. Los patrones ponían la insignia fuera de la tarjeta.
- **NotificationCenter (Forms & navigation):** la regla entre ítems (`color.border.default`) casi no se distingue sobre `color.bg.sunken` (≈1,3:1 en claro), por lo que dos ítems sin leer seguidos se leían como un solo fondo.

## Decisión

- **ProgramCard (Figma):** portada de 225 px (16:10, como el código) con insignia arriba a la izquierda, precio arriba a la derecha y título abajo; cuerpo a ancho completo con descripción, dato con icono y una sola acción. Seis variantes: `Highlight` (None, Featured) × `Status` (Open, Last spots, Plain). Los patrones eligen la variante; no dibujan insignias fuera.
- **NotificationCenter:** cada ítem es una pieza propia. Nuevos tokens `notification-center.inset` (`space.4`) y `notification-center.item-radius` (`radius.tile`): la lista lleva ese margen y esa separación, el fondo de un ítem sin leer tiene esquinas redondeadas y ya no hay regla entre ítems (queda la del encabezado). Igual en código y en Figma.

## Alternativas descartadas

- **Subir el contraste de la regla (`border.strong`):** una línea fuerte entre cada ítem pesa demasiado en una lista corta.
- **Barra de acento a la izquierda:** marca lo no leído, pero no separa los fondos.
- **Solo ensanchar el cuerpo de la tarjeta:** arregla el texto, pero deja un master distinto del componente.
