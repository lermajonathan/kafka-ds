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

El contraste de cada par se mide con el tema aplicado (`pnpm test:contrast`). Los tokens del tema se editan en `tokens/themes/altazor.json`; este archivo se genera.

MIT © Jonathan Lerma.
