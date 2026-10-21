# Política de deprecación

Un sistema de diseño solo es de fiar si no rompe lo que ya funciona. Esta política vale desde la versión 1.0.0.

## Qué es un cambio incompatible

Renombrar o eliminar un token, un componente, una propiedad o una variante; cambiar el valor de un token semántico de forma que altere el significado (no un ajuste de tono); cambiar el comportamiento de teclado o ARIA de un componente.

Los cambios de valor que corrigen un fallo de accesibilidad **no** se consideran incompatibles: se publican como correcciones y quedan en el CHANGELOG.

## Proceso

1. **Se anuncia.** El elemento se marca `deprecated` en la documentación, en el CHANGELOG y, en código, con un aviso en consola en desarrollo. Se indica la alternativa.
2. **Convive.** Sigue funcionando durante **al menos dos versiones menores** y **no menos de 90 días**.
3. **Se elimina.** Solo en una versión mayor, con una DDR que lo explica y una guía de migración.

## En los tokens

Un token deprecado se mantiene en `tokens/*.json` con `"$extensions": { "kafka.deprecated": "usa color.fg.muted" }`. El compilador lo avisa y la referencia (`docs/tokens.md`) lo marca.
