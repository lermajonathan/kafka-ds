# Sincronizar Figma con el repo

Las variables, los estilos y los íconos del archivo de Figma se **generan desde el repo**; nunca se editan a mano.

1. `pnpm figma` — compila los tokens y escribe `figma/variables.json` y `figma/chunks/*.json` (variables en bloques de 145 filas, íconos en bloques de 6).
2. `pnpm figma:check` — falla si los archivos generados no coinciden con los tokens/íconos actuales (corre dentro de `pnpm verify`).
3. Aplicar en Figma con `use_figma`: pegar cada bloque en `figma/apply-variables.js` (variables, idempotente: crea o actualiza, reporta `created/updated/missing/conflicts`). Los íconos se construyen con `figma/chunks/4-icons-*.json` como componentes `Icon/<Nombre>` con variante `Weight=Regular|Bold|Light|Fill|Duotone`, relleno enlazado a `Semantic/color/fg/default`.

Modelo: `Primitives` (modo Value, ocultas), `Semantic` (Light/Dark), `Components` (alias a Semantic). Tipografía, sombras y degradados son *estilos*, no variables. Unidades: rem→px, em→porcentaje, ms→número; `ch/mm/pt` se conservan como texto.

Tests: `pnpm test:figma` (alias, scopes, code syntax, 984 variables, 33 íconos × 5 pesos).

## Páginas de documentación, patrones y QA

- **Componentes** (70): `node scripts/figma/print-call.mjs <id>` imprime el cuerpo de `use_figma` que reconstruye la página; con `--masters` solo rehace los especímenes. El master vive en `figma/masters/<id>.js` (DSL de `figma/doc-dsl.js`).
- **Patrones** (4: Reading, Enrollment, Catalog, Forms & navigation): datos en `scripts/figma/patterns.mjs`, composición en `figma/patterns/<id>.js` con instancias reales (`{ inst: 'Button', variant: '…' }`); `node scripts/figma/print-pattern.mjs <id>` imprime la llamada. Cada composición solo puede usar componentes declarados en `uses` (lo comprueba `tests/figma-patterns.mjs`).
- **QA**: `node scripts/figma/audit.mjs` imprime una llamada de solo lectura; `judge()` (en el mismo módulo, con test) decide si pasa: 0 marcos vacíos, 0 colores sin variable, 0 glifos de texto, 0 textos sin estilo, sin páginas duplicadas, todo componente con master y secciones, `opacity/45` = 45, fondo de canvas `#635841` en todas las páginas, paridad light/dark (mismo número de especímenes) y ningún conjunto de variantes con `clipsContent` (recortaría las sombras).

**Tracking en estilos de texto**: `letterSpacing/*` se guarda como porcentaje (tight −1, normal 0, wide 1, wider 2) y los estilos de texto lo llevan **sin enlazar** en unidad `PERCENT`. Una variable enlazada se lee como píxeles (4 → 4 px = 33 % en 12 px).

**Reglas de la hoja de especímenes** (revisión visual de oct. 2026):

- El canvas de cada página es `#635841`; la paridad light/dark es obligatoria: el modo oscuro instancia **todas** las variantes del master, no solo la primera.
- Los conjuntos de variantes llevan 40 px de relleno y no recortan (`H.variants`), y el escenario oscuro también lleva 40 px: así las sombras no se cortan en el límite del componente.
- Un divisor se dibuja con borde de **un solo lado** (`sw: { b|t|l: … }`); un borde de caja completa en un divisor genera la «caja gris» que rodea al primer grupo. `tests/figma-dsl.mjs` lo comprueba en `figma/masters/`.
- Reconstrucción masiva: `node scripts/figma/print-batch.mjs --from N --count M` imprime una sola llamada `use_figma` que rehace los especímenes de varias páginas (con `try/catch` por página). El kit y el DSL guardados en el archivo (`figma.root.getSharedPluginData('kafka.ds', 'kit' | 'dsl')`) se parchean por reemplazo de cadena cuando cambian `figma/doc-page-kit.js` o `figma/doc-dsl.js`.
