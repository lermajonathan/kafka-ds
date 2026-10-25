# Sincronizar Figma con el repo

Las variables, los estilos y los íconos del archivo de Figma se **generan desde el repo**; nunca se editan a mano.

1. `pnpm figma` — compila los tokens y escribe `figma/variables.json` y `figma/chunks/*.json` (variables en bloques de 145 filas, íconos en bloques de 6).
2. `pnpm figma:check` — falla si los archivos generados no coinciden con los tokens/íconos actuales (corre dentro de `pnpm verify`).
3. Aplicar en Figma con `use_figma`: pegar cada bloque en `figma/apply-variables.js` (variables, idempotente: crea o actualiza, reporta `created/updated/missing/conflicts`). Los íconos se construyen con `figma/chunks/4-icons-*.json` como componentes `Icon/<Nombre>` con variante `Weight=Regular|Bold|Light|Fill|Duotone`, relleno enlazado a `Semantic/color/fg/default`.

Modelo: `Primitives` (modo Value, ocultas), `Semantic` (Light/Dark), `Components` (alias a Semantic). Tipografía, sombras y degradados son *estilos*, no variables. Unidades: rem→px, em→porcentaje, ms→número; `ch/mm/pt` se conservan como texto.

Tests: `pnpm test:figma` (alias, scopes, code syntax, 984 variables, 33 íconos × 5 pesos).
