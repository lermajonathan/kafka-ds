# DDR-KF-013 · Notas al final del capítulo en impresión

- **Estado:** aceptada · 2026-10-26
- **Decide:** Jonathan Lerma.

## Contexto

Las notas al pie por página necesitan `float: footnote` (CSS GCPM). Chromium 153, el motor que genera los PDF de la prueba de salida (DDR-KF-005), no lo soporta (ni `footnote-policy` ni `footnote-display`). Lo resuelven Prince y PDFreactor (comerciales) o Paged.js con JavaScript, que reescribe la paginación.

## Decisión

En v1 las notas van **al final del capítulo**, en estilo `print-footnote`, sobre la rejilla de líneas base y con una regla fina que las separa del texto. La llamada es un superíndice sin zona táctil ni color, que no altera el interlineado. El enlace «volver al texto» no se imprime.

## Alternativas descartadas

- **Paged.js:** dependencia grande que obliga a revalidar `@page` y los márgenes; solo se reconsidera si un texto real necesita notas al pie.
- **Paginación propia en dos pasadas:** reimplementa Paged.js; caro y frágil.
- **Prince o PDFreactor:** comerciales; la prueba de salida con Playwright dejaría de ser la fuente de verdad.
- **Notas laterales:** exigen márgenes más anchos que los del libro A5.

## Consecuencias

- El mismo marcado (`Footnote`, `Footnotes`, `FootnoteItem`) sirve en pantalla y en papel.
- Si más adelante se necesitan notas por página, se reabre esta decisión con una prueba de concepto de Paged.js.
