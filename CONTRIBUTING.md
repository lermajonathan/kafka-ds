# Contribuir a Kafka

Gracias por querer mejorar Kafka. Antes de abrir un cambio, abre una *issue* y cuéntanos el problema real que resuelve: Kafka crece por necesidad, no por completar listas.

## Flujo de un cambio

1. **Issue** con el problema, quién lo sufre y una captura o ejemplo.
2. **Acuerdo** del mantenedor sobre el alcance. Si el cambio toma una decisión de diseño, se escribe una DDR en `docs/decisions/`.
3. **Rama y cambio pequeño.** Una idea por *pull request*.
4. **`pnpm run verify` en verde** antes de pedir revisión. Si tu cambio altera píxeles a propósito, el PR lleva la etiqueta `visual-change`.
5. **Revisión** del mantenedor y *merge*.

## Los tokens son la fuente de verdad

Todo valor visual vive en `tokens/*.json`. Para cambiarlo:

```bash
# edita tokens/primitives.json, semantic.json o components.json
pnpm run verify     # recompila los archivos generados y corre las pruebas
git add -A          # incluye src/styles/*.css, src/tokens.ts, tokens/dist y docs/tokens.md
```

Los archivos generados (`src/styles`, `src/tokens.ts`, `tokens/dist`, `docs/tokens.md` y `docs/components/`) no se editan a mano: CI falla si no coinciden con su fuente (`pnpm run docs` regenera la documentación de componentes).

## Añadir un componente

1. `src/components/<nombre>.tsx` con la interfaz `<Nombre>Props` documentada (JSDoc) y las clases escritas completas.
2. Tokens del componente en `tokens/components.json` (y semánticos si faltan), solo con alias a semánticos.
3. `examples/<nombre>.tsx` (cada ejemplo con título y descripción) y una entrada en `examples/index.ts`.
4. `scripts/docs/<nombre>.mjs` con el criterio de uso, la accesibilidad y el contenido.
5. Un bloque en `tests/keyboard.mjs` y, si es un patrón nuevo, los pares de `tests/contrast.mjs`.
6. `pnpm run docs` y `pnpm run verify`.

## Cuándo está «completo» un componente

Un componente solo se acepta si cumple los siete criterios de [DDR-KF-004](docs/decisions/DDR-KF-004-alcance-v1.md):

1. Lee solo tokens semánticos o de componente (`pnpm run lint:tokens` y `pnpm run test:structure`).
2. Contraste verificado en claro y oscuro.
3. Pruebas de teclado y ARIA con el patrón WAI-ARIA que corresponda, y axe sin violaciones.
4. Objetivos táctiles de 24 px como mínimo (WCAG 2.5.8) y de 44 px en controles principales.
5. Componente en Figma con propiedades reales y modo oscuro.
6. Página de documentación con un ejemplo que se ejecuta en CI.
7. Una DDR si exige una decisión de diseño.

## Reglas de contenido

- Español neutro, claro y sin jerga innecesaria. Los nombres de tokens y de código van en inglés.
- Los cambios incompatibles siguen la [política de deprecación](docs/deprecation.md).
- No se añaden dependencias sin una razón escrita en la *issue*.

## Mensajes de commit

Una línea en imperativo que diga qué cambia y por qué importa. Ejemplo: `Añadir estados hover y activo a los botones`.
