# DDR-KF-006 · Cimientos de tokens (H0)

- **Estado:** aceptada · 2026-10-21
- **Decide:** Jonathan Lerma.

## Decisión

1. **Los componentes no leen primitivos de color, sombra, tipografía, radio, movimiento, opacidad ni capa.** Pasan por un token semántico. Las escalas (espacio, tamaño, ancho de borde, medida, breakpoints) sí se leen directas. Es la lección de la auditoría de Pance (§6) aplicada desde el principio, y `tests/structure.mjs` la hace cumplir.
2. **Un solo valor para lo deshabilitado:** `opacity.disabled = 0.45`, el mismo de Pance, para no repetir su incoherencia (§5.1).
3. **Estados con tokens, no con opacidades ad hoc:** hover y activo tienen escalones propios (`bg.hover`, `bg.sunken-hover`, `bg.brand-hover`…). El texto encima nunca baja del contraste mínimo y la prueba lo comprueba.
4. **Oro y estados:** el oro de marca sigue siendo solo superficie (o texto sobre tinta). Hover y activo del botón primario son `gold.300` y `gold.500`, con texto de tinta en ambos.
5. **El progreso de lectura usa `border.brand`** (oro 600, 3:1 sobre el papel) y no `bg.brand` (1,98:1).
6. **Selección y marca de texto** tienen pares propios y verificados (7:1) en claro y oscuro.
7. **Impresión:** `physical.*` guarda las medidas físicas (mm y pt) y `print.*` las asigna a plantillas (libro A5, revista A4, ficha A4). Todo interlineado es múltiplo de una rejilla de 3,5 pt; la prueba de estructura lo exige.
8. **El degradado VIP pasa a semántico** porque un componente no puede leerlo desde primitivos; así los colores de la tarjeta (`color.vip.*`) quedan junto a él.

## Consecuencias

- 313 tokens. Los tokens de los componentes de lectura (prosa, cita, nota al pie, verso…) se añaden **con cada componente** en H2, no antes: no se crean tokens sin un componente que los use.
- Los componentes heredan el modo oscuro de los semánticos. No se duplican valores oscuros por componente.
- Rompe el nombre de `vip.*` y `gradient.vip` solo dentro de Kafka (aún sin publicar), sin migración.
