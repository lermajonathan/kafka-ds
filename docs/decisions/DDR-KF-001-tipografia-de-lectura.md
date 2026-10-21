# DDR-KF-001 · Tipografía de lectura

- **Estado:** aceptada · 2026-10-21
- **Decide:** Jonathan Lerma, tras una prueba de lectura con cuatro candidatas (Literata, Source Serif 4, Newsreader, Spectral) sobre prosa, diálogo con raya y «», y poema, en fondo papel y tinta, de 16 a 24 px.

## Decisión

- **Lectura y títulos:** una sola familia, **Literata** (variable, licencia OFL). Los títulos usan la misma familia en peso 700 y el tamaño óptico grande (`font-optical-sizing: auto`, eje `opsz` 7–72), en vez de una segunda fuente.
- **Interfaz** (botones, navegación, formularios, metadatos): sans de sistema (`system-ui`). Sin descarga extra y se distingue del texto literario.
- **Mono:** mono de sistema, solo para código en la documentación.

## Por qué una sola familia

El eje de tamaño óptico de Literata hace que el mismo diseño se vea robusto en cuerpo y refinado en títulos. Una familia menos son menos bytes, menos decisiones y una voz más coherente. Una segunda fuente de títulos queda como excepción por tema (p. ej. un tema Altazor), no como regla del sistema.

## Consecuencias

- Los tokens `fontFamily.reading` y los roles `typography.reading.*` ya apuntan a Literata.
- Pendiente: autoalojar los archivos variables (regular, itálica, negrita) en WOFF2 con subconjunto latino, y fallback `Georgia`. No cargar desde CDN de terceros.
- Revisar con texto real de Gabriel cuando lo entregue; si falla (p. ej. caracteres, itálicas largas), se reabre esta decisión.
