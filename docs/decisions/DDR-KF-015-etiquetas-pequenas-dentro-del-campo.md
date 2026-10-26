# DDR-KF-015 · Etiquetas pequeñas dentro del campo e icono de RadioCard cuadrado

- **Estado:** aceptada · 2026-10-26
- **Decide:** Jonathan Lerma (revisión visual de Figma, corte C3).

## Contexto

En Figma las etiquetas de TagInput (44 px) iban dentro del campo y lo hacían crecer; en el código iban encima del campo. Además "Añadir…" se salía del campo. El icono de RadioCard usaba el radio de tarjeta (16) sobre 32 px: un círculo casi perfecto que se leía raro.

## Decisión

- **TagInput:** las etiquetas van dentro del campo, que mantiene 44 px con una o dos etiquetas. Cada etiqueta mide 32 px y su botón de quitar 32 × 32 px (cumple el mínimo de 24 px de WCAG 2.5.8; el campo entero sigue siendo de 44 px). Al faltar espacio, etiquetas y caja de texto pasan a una nueva fila: nada se desborda. Tokens nuevos: `tag-height`, `field-padding-y`, `input-min-width`; `remove-size` baja a 32. Nuevo token semántico `radius.tile` (8 px) para iconos cuadrados pequeños.
- **RadioCard:** el icono usa `radio-card.icon-radius` (`radius.tile`, 8 px): conserva la figura cuadrada.
- **FileUpload:** el icono de subida ya existía en el código; el master de Figma lo muestra.

## Alternativas descartadas

- **Etiquetas encima del campo:** el campo nunca crece, pero se aleja de los selectores de etiquetas habituales y de lo que Jonathan esperaba ver.
- **Icono totalmente circular:** válido, pero el cuadrado de radio 8 distingue el icono del botón de radio.
