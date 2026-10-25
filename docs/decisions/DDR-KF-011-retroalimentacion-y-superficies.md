# DDR-KF-011 · Retroalimentación y superficies (H5)

- **Estado:** aceptada · 2026-10-25
- **Decide:** Jonathan Lerma.

## Contexto

H5 cierra la paridad de Kafka con Pance en mensajes, contenedores y estados de carga, y añade las tres piezas que pide el tema Altazor (tarjeta VIP, caja de noticias y tarjeta de programa). Se entrega en dos cortes y cada componente sigue TDD: primero la prueba (contraste, teclado y ARIA, axe, ejemplo que se renderiza) y se la ve fallar; después el código.

| Corte | Contenido |
|---|---|
| 1a | Alert, Divider, Skeleton, EmptyState |
| 1b | Card, Panel, Avatar, Progress |
| 1c | Toast y notificaciones |
| 2 | Tarjeta VIP, caja de noticias, tarjeta de programa y auditoría de paridad con Pance |

## Decisiones del corte 1a

1. **`Alert` informa sin interrumpir.** Es un bloque en el flujo de la página con `role="status"` (anuncio educado). Solo con `urgent` usa `role="alert"`, para lo que el lector debe oír ya (un pago que falló). Cada tono lleva ícono y borde del color de estado, de modo que el color nunca es la única señal (misma regla que `Badge`). El título y el ícono usan el color de estado; el cuerpo usa `fg.default`.
2. **`Alert` no administra el foco.** Si se cierra con `onDismiss`, quien lo monta decide a dónde va el foco; el componente solo ofrece el botón de cierre de 44 px, con el nombre del `labels.close`.
3. **`Divider` es un `<hr>`.** Horizontal por defecto. `decorative` le quita el rol de separador. Con `label` se dibuja texto entre dos líneas ocultas a la tecnología de asistencia; el texto se lee como contenido normal. Vertical usa `role="separator"` y `aria-orientation="vertical"`.
4. **`Skeleton` anuncia una vez y calla.** El contenedor es `role="status"` con `aria-busy="true"` y un texto oculto (`labels.loading`); las formas son `aria-hidden`. El brillo se detiene con `prefers-reduced-motion` y deja la forma quieta.
5. **`EmptyState` explica y ofrece un paso.** Título (nivel configurable con `headingLevel`, 2 por defecto), descripción opcional, ícono decorativo y una acción opcional. El ícono nunca es el único mensaje.
6. **Tokens:** 4 grupos nuevos (`alert`, `divider`, `skeleton`, `empty-state`), todos alias de semánticos. No hay tokens `*.z`: los mensajes viven en el flujo.

## Consecuencias

- Los tonos de `Alert` reutilizan `color.status.*`, ya verificados en claro y oscuro con `Badge`; igual se prueban los pares nuevos (título sobre su fondo y cuerpo sobre su fondo).
- Las decisiones de Toast, Panel, Card y Avatar se registran en este mismo DDR al llegar su corte.
- La versión en Figma sigue pendiente para H7.
