# DDR-KF-011 · Retroalimentación y superficies (H5)

- **Estado:** aceptada · 2026-10-25
- **Decide:** Jonathan Lerma.

## Contexto

H5 cierra la paridad de Kafka con Pance en mensajes, contenedores y estados de carga, y añade las tres piezas que pide el tema Altazor (tarjeta VIP, caja de noticias y tarjeta de programa). Se entrega en dos cortes y cada componente sigue TDD: primero la prueba (contraste, teclado y ARIA, axe, ejemplo que se renderiza) y se la ve fallar; después el código.

| Corte | Contenido |
|---|---|
| 1a | Alert, Divider, Skeleton, EmptyState |
| 1b | Card, Panel, Avatar (con AvatarGroup), Progress, Spinner |
| 1c | Toast/ToastStack, CountBadge, NotificationCenter |
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

## Decisiones del corte 1c

Revisado contra Pance (`feedback.tsx`, `notifications.tsx`). Pance deja el Toast controlado y sin temporizador; Kafka mantiene eso por defecto y añade un cierre automático opcional.

1. **`Toast` es controlado y se cierra a mano por defecto.** La página guarda la lista y quita el aviso en `onDismiss`. Así nadie pierde un mensaje por leer despacio (WCAG 2.2.1).
2. **`duration` es opcional** (milisegundos) para avisos de bajo riesgo. El temporizador se pausa mientras el puntero está encima o el foco está dentro, y al reanudar usa el tiempo que quedaba, no empieza de cero. **Un toast `danger` ignora `duration`** y no se cierra solo.
3. **Cada toast se anuncia por sí mismo:** `role="status"` atómico, y `role="alert"` para `danger`. `ToastStack` es solo una región con nombre («Notificaciones», configurable con `label`), fija abajo y con `z-index` del token `layer.toast`. Una sola pila por página (axe lo exige: dos regiones con el mismo nombre fallan `landmark-unique`).
4. **Una acción de seguimiento por toast** (por ejemplo Deshacer); al pulsarla también lo cierra. Cierre y acción miden 44 px. La entrada con desvanecimiento se quita con movimiento reducido.
5. **`NotificationCenter` se apoya en `Popover`** (no modal, Esc cierra y devuelve el foco a la campana). El nombre de la campana incluye el contador («Notificaciones, 2 sin leer»). Los ítems sin leer lo dicen con texto («Sin leer: …»), no solo con peso y fondo. Al marcar o descartar un ítem el foco pasa a un elemento que permanece (el propio ítem o el diálogo), para que nunca se pierda hacia la página.
6. **`CountBadge` entra con él** (Pance lo tiene aparte): «9+» sobre el máximo, nada en cero y `label` opcional para decir qué cuenta el número. Sobre un botón, el número va en el nombre del botón y la insignia se oculta.
7. **Tonos de las notificaciones:** `brand`, `success`, `warning`, `danger` (Pance usa `primary`). Textos nuevos en `labelsEn` y `labelsEs`. Tokens: `toast`, `count-badge`, `notification-center` (54 nuevos; 983 en total).

## Decisiones del corte 2a (tarjeta de programa y VIP)

- **`Card.featured` pasa a `highlight: 'none' | 'featured' | 'vip'`.** Un solo eje en lugar de dos booleanos que podrían combinarse; `as` permite `article` o `li`, y `padded={false}` deja que la portada llegue al borde.
- **VIP es CSS puro:** fondo dorado, texto en ink 900 fijo en ambos modos (el oro no cambia) y un borde con brillo cónico (`@property --kafka-ang`). Con `prefers-reduced-motion` el brillo queda quieto en un ángulo fijo. El estado se dice con palabras: la insignia con corona dice «Miembros».
- **Botón `vip`:** tinta fija, solo para usar sobre la tarjeta VIP. Una variante `inverse` falló el contraste oscuro (1,02:1 contra el borde dorado), por eso no existe.
- **`ProgramCard`:** `article` con portada 16:10, título sobre un velo que llega a ink 900 (se lee sobre cualquier imagen), insignias arriba a la izquierda, precio arriba a la derecha, descripción, lista de detalles y una sola acción. La imagen exige `alt`; si falla, cae a una portada generada decorativa (`aria-hidden`).
- **Paleta de portada en la capa semántica** (`color.cover.*`, `color.vip.button-*`): el chequeo de estructura impide que los componentes apunten a primitivos.
- La elevación al pasar el puntero (6 px) y el zoom de la imagen se anulan con movimiento reducido.

## Decisiones del corte 2b (caja de noticias)

- **`NewsBox` es una región con nombre (`section`), no un diálogo ni un `aside`:** axe rechaza un `aside` dentro de `main`, y un diálogo bloquearía la página. No atrapa el foco.
- **Controlado y sin rotación automática:** la página es dueña de la lista y recibe `onDismiss`. Muestra hasta tres noticias; los puntos (botones de 24 px con `aria-current`) cambian la noticia y el cambio se anuncia con `aria-live="polite"`. Cerrar quita la noticia y la siguiente ocupa su lugar.
- **Cuatro tipos** (`evento`, `felicitacion`, `aviso`, `convocatoria`) con icono y nombre en palabras. `href` convierte el título en enlace; `viewAllHref` muestra «Ver todas».
- **`floating`** la fija abajo a la derecha (ancho completo menos margen en móvil). `label` evita duplicar el nombre del landmark si hubiera más de una caja.
- El punto activo usa `border.brand`: con `bg.brand` daba 2,07:1 en claro. La entrada animada se quita con movimiento reducido.

## Consecuencias

- Los tonos de `Alert` reutilizan `color.status.*`, ya verificados en claro y oscuro con `Badge`; igual se prueban los pares nuevos (título sobre su fondo y cuerpo sobre su fondo).
- Las decisiones de Toast, Panel, Card y Avatar se registran en este mismo DDR al llegar su corte.
- La versión en Figma sigue pendiente para H7.
