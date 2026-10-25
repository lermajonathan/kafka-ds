# DDR-KF-011 · Retroalimentación y superficies (H5)

- **Estado:** aceptada · 2026-10-25
- **Decide:** Jonathan Lerma.

## Contexto

H5 cierra la paridad de Kafka con Pance en mensajes, contenedores y estados de carga, y añade las tres piezas que pide el tema Altazor (tarjeta VIP, caja de noticias y tarjeta de programa). Se entrega en dos cortes y cada componente sigue TDD: primero la prueba (contraste, teclado y ARIA, axe, ejemplo que se renderiza) y se la ve fallar; después el código.

| Corte | Contenido |
|---|---|
| 1a | Alert, Divider, Skeleton, EmptyState |
| 1b | Card, Panel, Avatar (con AvatarGroup), Progress, Spinner |
| 1c | Toast y notificaciones |
| 2 | Tarjeta VIP, caja de noticias, tarjeta de programa y auditoría de paridad con Pance |

## Decisiones del corte 1a

1. **`Alert` informa sin interrumpir.** Es un bloque en el flujo de la página con `role="status"` (anuncio educado). Solo con `urgent` usa `role="alert"`, para lo que el lector debe oír ya (un pago que falló). Cada tono lleva ícono y borde del color de estado, de modo que el color nunca es la única señal (misma regla que `Badge`). El título y el ícono usan el color de estado; el cuerpo usa `fg.default`.
2. **`Alert` no administra el foco.** Si se cierra con `onDismiss`, quien lo monta decide a dónde va el foco; el componente solo ofrece el botón de cierre de 44 px, con el nombre del `labels.close`.
3. **`Divider` es un `<hr>`.** Horizontal por defecto. `decorative` le quita el rol de separador. Con `label` se dibuja texto entre dos líneas ocultas a la tecnología de asistencia; el texto se lee como contenido normal. Vertical usa `role="separator"` y `aria-orientation="vertical"`.
4. **`Skeleton` anuncia una vez y calla.** El contenedor es `role="status"` con `aria-busy="true"` y un texto oculto (`labels.loading`); las formas son `aria-hidden`. El brillo se detiene con `prefers-reduced-motion` y deja la forma quieta.
5. **`EmptyState` explica y ofrece un paso.** Título (nivel configurable con `headingLevel`, 2 por defecto), descripción opcional, ícono decorativo y una acción opcional. El ícono nunca es el único mensaje.
6. **Tokens:** 4 grupos nuevos (`alert`, `divider`, `skeleton`, `empty-state`), todos alias de semánticos. No hay tokens `*.z`: los mensajes viven en el flujo.

## Decisiones del corte 1b

Se revisó primero cómo los resuelve Pance (`layout.tsx`, `avatar.tsx`, `feedback.tsx`) y se conservó su división; las diferencias son deliberadas.

1. **`Card` y `Panel` son dos componentes.** `Card` es una superficie presentacional con borde y sombra (sin rol, sin foco); `featured` solo añade el borde de marca. `Panel` es una tarjeta con encabezado (título como encabezado de nivel configurable, descripción, ícono, acciones), cuerpo y pie. Como en Pance, un contenedor liso es `Card`; varios colapsables apilados son `Accordion`.
2. **El colapso del `Panel` es un botón de 44 px** con `aria-expanded`, `aria-controls` y el título como nombre (Enter y Espacio). Colapsado, el cuerpo se oculta para todos (`hidden`). Pance lo hace con 24 px; Kafka sube al objetivo principal de DDR-KF-004.
3. **`Avatar` exige `name`** y cae a las iniciales si la foto falla. El tamaño pasa de píxeles libres a `sm`, `md` y `lg` (tokens), porque el lint no admite medidas sueltas. El estado de presencia se dice con palabras (`labels.statusOnline`…) y cada punto cumple 3:1 contra su anillo. `AvatarGroup` vive en el mismo archivo; su chip «+N» es un `role="img"` con el texto «2 más».
4. **`Progress` exige `label`.** Pance lo deja opcional; una barra sin nombre es solo un número (WCAG 4.1.2). El relleno cumple 3:1 contra la pista en los cuatro tonos y en ambos modos. `valueText` sustituye el porcentaje en lo que oyen los lectores de pantalla.
5. **`Spinner` entra en H5** aunque no estaba en la lista original: Pance lo tiene y la auditoría de paridad lo habría pedido. Es `role="status"` con texto; con movimiento reducido gira despacio, como el botón en carga.
6. **Tokens:** `panel`, `avatar`, `progress` y `spinner` (69 nuevos; 929 en total). `card` ya existía desde DDR-KF-003 y es la base de las tarjetas VIP y de programa del corte 2.

## Consecuencias

- Los tonos de `Alert` reutilizan `color.status.*`, ya verificados en claro y oscuro con `Badge`; igual se prueban los pares nuevos (título sobre su fondo y cuerpo sobre su fondo).
- Las decisiones de Toast, Panel, Card y Avatar se registran en este mismo DDR al llegar su corte.
- La versión en Figma sigue pendiente para H7.
