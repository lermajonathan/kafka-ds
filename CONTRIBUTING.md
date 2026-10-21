# Contribuir a Kafka

Gracias por querer mejorar Kafka. Antes de abrir un cambio, abre una *issue* y cuéntanos el problema real que resuelve: Kafka crece por necesidad, no por completar listas.

## Flujo de un cambio

1. **Issue** con el problema, quién lo sufre y una captura o ejemplo.
2. **Acuerdo** del mantenedor sobre el alcance. Si el cambio toma una decisión de diseño, se escribe una DDR en `docs/decisions/`.
3. **Rama y cambio pequeño.** Una idea por *pull request*.
4. **`npm run verify` en verde** antes de pedir revisión.
5. **Revisión** del mantenedor y *merge*.

## Los tokens son la fuente de verdad

Todo valor visual vive en `tokens/*.json`. Para cambiarlo:

```bash
# edita tokens/primitives.json, semantic.json o components.json
npm run verify      # recompila los archivos generados y corre las pruebas
git add -A          # incluye src/styles/tokens.css, src/tokens.ts, tokens/dist y docs/tokens.md
```

Los archivos generados no se editan a mano: CI falla si no coinciden con los tokens.

## Cuándo está «completo» un componente

Un componente solo se acepta si cumple los siete criterios de [DDR-KF-004](docs/decisions/DDR-KF-004-alcance-v1.md):

1. Lee solo tokens semánticos o de componente (`npm run lint:tokens` y `npm run test:structure`).
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
