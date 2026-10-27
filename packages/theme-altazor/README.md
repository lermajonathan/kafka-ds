# @kafka/theme-altazor

Tema de Altazor sobre [Kafka](https://github.com/lermajonathan/kafka-ds). Solo CSS: sin logotipos, fotografías ni ilustraciones.

> **Pre-1.0, no publicado todavía.** Se publicará junto con Kafka 1.0.0.

```css
@import '@kafka/tokens/tokens.css';
@import '@kafka/theme-altazor';
```

```html
<div data-kafka-theme="altazor"> … </div>
```

El tema vive dentro de `[data-kafka-theme='altazor']`: nada cambia fuera de ese elemento. Respeta el modo claro, oscuro y del sistema.

| Cambia | Valor |
|---|---|
| `color.bg.sunken` (claro) | `paper.100` |
| `radius.control` | 8 px |
| `radius.tile` | 14 px |
| `altazor.deco.*` | morado, rojo y oro para las formas decorativas |

## Patrones

`@kafka/theme-altazor/patterns.css` trae cuatro patrones dentro del mismo ámbito: portada con velo (`.kafka-altazor-hero`, la foto va en `--kafka-altazor-hero-image`), tarjetas de acceso rápido que se montan sobre la portada (`.kafka-altazor-quick`), formas flotantes (`.kafka-altazor-deco`, siempre `aria-hidden`; quietas con `prefers-reduced-motion`) y banda de citas siempre oscura (`.kafka-altazor-quotes`). El contraste del texto sobre la foto se mide sobre píxeles, con una foto blanca como peor caso.

El contraste de cada par se mide con el tema aplicado (`pnpm test:contrast`). Los tokens del tema se editan en `tokens/themes/altazor.json`; este archivo se genera.

MIT © Jonathan Lerma.
