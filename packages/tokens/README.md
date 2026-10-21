# @kafka/tokens

Design tokens de [Kafka](https://github.com/lermajonathan/kafka-ds), el sistema de diseño para la literatura en pantalla, con un módulo de impresión.

> **Pre-1.0, no publicado todavía.** Se publicará junto con Kafka 1.0.0 ([roadmap](https://github.com/lermajonathan/kafka-ds/blob/main/docs/roadmap.md)).

```css
@import '@kafka/tokens/tokens.css';   /* variables --kafka-* en claro y oscuro */
```

```ts
import tokens from '@kafka/tokens'    // valores resueltos y tipados
```

| Archivo | Qué es |
|---|---|
| `tokens.css` | Variables CSS `--kafka-*`. El modo oscuro sigue al sistema; `data-theme="dark"` o `"light"` lo fuerza |
| `theme.css` | Tema de Tailwind v4: solo existen utilidades respaldadas por un token |
| `typography.css` | Una clase por rol tipográfico, p. ej. `.kafka-type-reading-body` |
| `tokens.json` | Valores resueltos, planos (para otras plataformas) |
| `json/*.json` | Las tres capas en formato W3C DTCG |

MIT © Jonathan Lerma.
