# Kafka

[![CI](https://github.com/lermajonathan/kafka-ds/actions/workflows/ci.yml/badge.svg)](https://github.com/lermajonathan/kafka-ds/actions/workflows/ci.yml)
[![Licencia: MIT](https://img.shields.io/badge/licencia-MIT-b8932a.svg)](LICENSE)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2%20AA-b8932a.svg)](#accesibilidad)

Sistema de diseño para la literatura en pantalla: legibilidad, contraste y tipografía editorial pensados para medios digitales, con un módulo para medios impresos. Su primer uso es el sitio de [Altazor Taller de Escritura Creativa](https://altazorescrituracreativa.com), que es un tema de Kafka.

Kafka parte de la arquitectura de [Pance](https://github.com/lermajonathan/pance-ds) (tokens en tres capas, geometría, lista de componentes y controles de calidad) con una identidad propia: papel cálido, tinta y oro, y tipografía de lectura Literata.

> **Estado: pre-1.0, en construcción.** No hay versión en npm. Kafka se publica y se anuncia solo cuando cumple el criterio de «completo» de [DDR-KF-004](docs/decisions/DDR-KF-004-alcance-v1.md). El avance está en el [roadmap](docs/roadmap.md).

## Qué hay hoy

| | Qué | Dónde |
|---|---|---|
| 🎨 | **Tokens**: 313 en tres niveles (primitivos → semánticos → componentes), formato W3C DTCG, claro y oscuro | [`tokens/`](tokens) · [referencia](docs/tokens.md) |
| 🖨️ | **Tokens de impresión**: página, sangrado, márgenes, tipografía en puntos y rejilla de líneas base | [`tokens/`](tokens) (`physical.*`, `print.*`) |
| 🧩 | **Librería React**: `@kafka/react`, con 31 componentes terminados según el criterio de «completo» (14 de lectura y 17 de UI esencial, empezando por [Button](docs/components/button.md)); el resto llega por hitos | [`src/components/`](src/components) · [documentación](docs/components/README.md) |
| 📦 | **Paquetes** (sin publicar): `@kafka/tokens` y `@kafka/react`, probados instalándolos en un proyecto nuevo | [`packages/`](packages) |
| 🧪 | **Pruebas**: contraste (129 pares), estructura de tokens, lint, teclado y ARIA, axe-core, ejemplos de la documentación, paquetes y diferencia visual | [`tests/`](tests) |
| 📐 | **Figma**: variables (Primitives, Semantic, Components), estilos y 6 conjuntos de componentes | [archivo en Figma](https://www.figma.com/design/S3WoutgiyT1a5kwahRaKJ2) |
| 📝 | **Decisiones de diseño** (DDR-KF) | [`docs/decisions/`](docs/decisions) |

Falta el resto de los componentes (H4 y H5), el módulo de impresión (H6), el sitio de documentación y la documentación en Figma (H7) y el lanzamiento (H8).

## Empezar

```bash
# Node 22+ y pnpm 10
pnpm install
pnpm dev              # playground con todos los ejemplos en http://localhost:5173 (?theme=dark, ?only=button)
pnpm run tokens       # compila tokens/*.json → CSS, tema de Tailwind, clases tipográficas, TypeScript y JSON
pnpm run verify       # compila y pasa todas las pruebas (las mismas que CI)
```

Los tokens salen como variables CSS (`--kafka-*`):

```css
.mi-tarjeta {
  background: var(--kafka-color-bg-surface);
  color: var(--kafka-color-fg-default);
  border-radius: var(--kafka-radius-card);
  box-shadow: var(--kafka-elevation-card);
}
```

El modo oscuro sigue al sistema. Para forzarlo: `<html data-theme="dark">`; para forzar el claro: `data-theme="light"`.

## Arquitectura de tokens

```
primitivos   valores en bruto (paper, ink, gold, escalas)        ← solo los leen los demás niveles
semánticos   propósito: bg.surface, fg.link, reading.text…       ← lo que usa el producto
componentes  decisiones por componente: button.primary.bg…       ← lo que lee el código del componente
```

Regla fija: **los componentes no leen colores, sombras, tipografía, radios, movimiento ni capas primitivos**; pasan por un token semántico. Las escalas (espacio, tamaño, ancho de borde, medida, breakpoints) sí se leen directas. La prueba [`tests/structure.mjs`](tests/structure.mjs) lo hace cumplir ([DDR-KF-006](docs/decisions/DDR-KF-006-cimientos-de-tokens.md)).

## Accesibilidad

- Texto de lectura a 7:1 (AAA), texto de interfaz a 4,5:1 y elementos no textuales a 3:1, en claro y en oscuro. Los 129 pares se prueban en cada cambio, y axe-core revisa cada ejemplo en dos tamaños y dos temas.
- El oro de marca (`#d4af37`) mide 1,98:1 sobre el papel, así que **nunca** se usa como texto sobre papel: va como superficie con texto de tinta (8,3:1) o como texto sobre tinta.
- Los enlaces siempre van subrayados; el color solo nunca los distingue.
- Objetivo táctil mínimo de 44 px en controles principales.

## Contribuir

Lee [CONTRIBUTING.md](CONTRIBUTING.md) y [GOVERNANCE.md](GOVERNANCE.md). Kafka es de código abierto, pero toda propuesta que se implementa o se rechaza la aprueba su autor.

## Licencia

[MIT](LICENSE) © Jonathan Lerma.
