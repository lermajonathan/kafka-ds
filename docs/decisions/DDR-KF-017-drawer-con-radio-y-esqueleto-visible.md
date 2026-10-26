# DDR-KF-017 · Drawer con radio, esqueleto visible en dark y ConfirmDialog alineado

- **Estado:** aceptada · 2026-10-26
- **Decide:** Jonathan Lerma (revisión visual de Figma, corte C5).

## Contexto

El Drawer de Figma era una caja pequeña sin radio, parecida a un modal; en el código llegaba al borde de la pantalla con las esquinas planas. El esqueleto usaba `color.bg.sunken`, que en dark es más oscuro que la página (1.10:1) y casi no se veía. En el master de ConfirmDialog el icono estaba al lado del título y no del mensaje, a diferencia del componente.

## Decisión

- **Drawer:** las esquinas que miran a la página llevan `drawer.radius` (`radius.card`); las que tocan el borde de la pantalla quedan planas. En Figma se muestra del alto de una pantalla de escritorio (388 × 800 px; el inferior 960 × 360) con un panel de filtros real.
- **Esqueleto:** nuevo token semántico `color.bg.placeholder` (`color.border.default`). Los esqueletos se ven a 1.4:1 como mínimo sobre la página y sobre una tarjeta, en claro y oscuro (lo comprueba `test:contrast`).
- **ConfirmDialog (Figma):** título arriba y debajo una fila con el icono centrado en la primera línea del mensaje, como el componente (el código ya lo cumple y un test lo comprueba).
- **ReadingProgress:** las barras son cuadradas por diseño, tanto en el código como en Figma; lo que parecía un radio era el borde del conjunto de variantes.
- **QA de Figma:** la auditoría mide ahora cada sombra contra los marcos que recortan y falla si alguna queda cortada.

## Alternativas descartadas

- **Radio en las cuatro esquinas del Drawer:** deja huecos contra el borde de la pantalla.
- **Subir el contraste con `color.bg.sunken-hover`:** en dark da 1.37:1 sobre la página y solo 1.23:1 sobre una tarjeta.
