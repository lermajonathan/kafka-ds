# DDR-KF-005 · Módulo de impresión completo en v1

- **Estado:** aceptada · 2026-10-21
- **Decide:** Jonathan Lerma.

## Decisión

El módulo de impresión sale en v1 con tres partes: **tokens**, **hoja de estilos** y **plantillas**.

- **Tokens de impresión:** tamaños de página (A5, A4, Carta), márgenes, sangrado de 3 mm, medianil, rejilla de líneas base, tipografía en puntos, cabeza corrida, folio, viudas y huérfanas.
- **Hoja de estilos `print.css`:** `@page`, saltos de página, notas al pie y capitulares.
- **Plantillas:** libro (cuento o ensayo), revista (antología) y ficha (programa de un taller).
- **Prueba de salida:** se genera el PDF con Playwright y se comprueban tamaño de página, número de páginas, fuentes incrustadas y que no haya texto cortado.

## Por qué

Kafka se definió como "todo lo literario en pantalla, más un módulo secundario de impresión". La Antología Altazor 2026 y las fichas de los talleres son usos reales.

## Consecuencias

- Literata debe autoalojarse y subconjuntarse con las variantes que usa la impresión.
- Los componentes de lectura (nota al pie, capitular, verso) necesitan una variante de impresión.
