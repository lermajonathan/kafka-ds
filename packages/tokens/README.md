# @kafka/tokens

Design tokens de [Kafka](https://github.com/lermajonathan/kafka-ds), el sistema de diseño para la literatura en pantalla, con un módulo de impresión.

> **Pre-1.0, no publicado todavía.** Se publicará junto con Kafka 1.0.0 ([roadmap](https://github.com/lermajonathan/kafka-ds/blob/main/docs/roadmap.md)).

```css
@import '@kafka/tokens/tokens.css';   /* variables --kafka-* en claro y oscuro */
@import '@kafka/tokens/fonts.css';    /* Literata autoalojada (OFL), sin pedir nada a terceros */
```

```ts
import tokens from '@kafka/tokens'    // valores resueltos y tipados
```

| Archivo | Qué es |
|---|---|
| `tokens.css` | Variables CSS `--kafka-*`. El modo oscuro sigue al sistema; `data-theme="dark"` o `"light"` lo fuerza |
| `theme.css` | Tema de Tailwind v4: solo existen utilidades respaldadas por un token |
| `fonts.css` | Literata variable (normal y cursiva, latín y latín extendido), con su licencia OFL en `fonts/`. El navegador solo baja el archivo que la página usa |
| `typography.css` | Una clase por rol tipográfico, p. ej. `.kafka-type-reading-body` |
| `tokens.json` | Valores resueltos, planos (para otras plataformas) |
| `json/*.json` | Las tres capas en formato W3C DTCG |

MIT © Jonathan Lerma.
