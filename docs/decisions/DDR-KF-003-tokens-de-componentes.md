# DDR-KF-003 · Tokens para los primeros componentes

- **Estado:** aceptada · 2026-10-21
- **Decide:** Jonathan Lerma, tras construir el prototipo del sitio de Altazor.

## Decisión

Kafka v0.1 pasa de 70 a 184 tokens y completa las tres capas:

- **Primitivos (80):** se agregan `gold.50`, `color.shadow.*`, `fontSize.12`, `space.20`, `radius.*`, `borderWidth.*`, `size.*` (área táctil de 44 px, íconos, ancho flotante), `duration.*`, `ease.standard`, `shadow.*` y `gradient.vip`.
- **Semánticos (38):** `bg.brand`, `fg.on-brand`, `border.brand`, `border.strong`, `radius.*`, `elevation.*`, `focus.*` y los roles tipográficos `lead`, `heading-lg/md/sm`, `ui.button/label/caption/overline`.
- **Componentes (66):** `button`, `badge`, `chip`, `card` (+ `featured`), `vip`, `news` y `article`.

## Por qué

Salen de lo que el sitio ya usa, no de una lista teórica. El oro vivo sigue sin ir como texto sobre papel: `bg.brand` lo usa solo como superficie con `fg.on-brand` (8,3:1) y el borde dorado sobre papel usa `gold.600` (≥ 3:1).

## Consecuencias

- Compilador: soporta los tipos compuestos `shadow` y `gradient`.
- Pruebas: 87 pares de contraste (44 claro y 43 oscuro), incluidos los tres puntos del degradado VIP.
- La caja de noticias y la tarjeta VIP quedan definidas por tokens; la animación del brillo solo usa `vip.shine-*`.
- Pendiente: autoalojar Literata (DDR-KF-001) y revisar `fontSize.12`, que solo se admite en metadatos.
