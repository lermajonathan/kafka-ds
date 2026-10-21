# DDR-KF-002 · Librería de íconos

- **Estado:** aceptada · 2026-10-21
- **Decide:** Jonathan Lerma, tras comparar Phosphor con Lucide (la que usa hoy el sitio de Altazor) sobre la portada.

## Decisión

Kafka usa **Phosphor Icons** (MIT), la misma librería que Pance.

- **Páginas estáticas (Astro):** SVG de `@phosphor-icons/core`, sin JavaScript.
- **Islas interactivas (React):** `@phosphor-icons/react`.
- **Peso por uso:** `light` para íconos grandes y decorativos (comillas), `regular` para interfaz, `bold` para flechas y acciones, `duotone` para mosaicos y tarjetas, `fill` para detalles puntuales (estrella, corazón).
- **Vocabulario literario:** `quotes`, `feather`, `pen-nib`, `book-open`, `book-open-text`, `bookmark-simple`, `scroll`, `books`.

## Por qué

Una sola familia de íconos con Pance y con el sitio, seis pesos por ícono (Lucide tiene uno) y equivalentes directos de los íconos que hoy usa Altazor (libro, comillas, pluma, trofeo, calendario, reloj).

## Consecuencias

- Los íconos heredan `currentColor`; el color sale de los tokens, nunca de un valor fijo.
- Pendiente: si faltan íconos literarios propios (tintero, pluma estilográfica, página), dibujarlos como extensión de Kafka v1.x sobre la cuadrícula de 256 de Phosphor.
