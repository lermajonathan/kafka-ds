# DDR-KF-008 · Componentes de lectura (H2)

- **Estado:** aceptada · 2026-10-21
- **Decide:** Jonathan Lerma.

## Decisiones

1. **`Prose` estiliza por descendencia** (`.kafka-prose` en `components.css`, solo variables de tokens). Un texto de lectura llega como HTML (Markdown, CMS), y pedir una clase por elemento no escala. Los componentes de lectura que son `figure` (cita destacada, epígrafe) quedan fuera de la regla del `blockquote` porque esta solo aplica a hijos directos.
2. **La capitular es `::first-letter`**, no un `<span>`. El párrafo se lee como un solo párrafo en lectores de pantalla y las comillas o rayas iniciales se incluyen solas. Costo: el control fino de líneas (dos o tres) queda en los tokens de tipografía, no en una prop.
3. **Las notas son una sección `doc-endnotes`**, no un `aside`: dentro de un `article`, un `aside` es un punto de referencia anidado y axe lo rechaza. La llamada mide 24 px (WCAG 2.5.8, enlace en línea) y el regreso 44 px. La nota destino se resalta con `:target`.
4. **Preferencias de lectura controladas y sin almacenamiento.** `ReadingSettings` informa un objeto `ReadingPreferences`; `readingStyle()` lo convierte en tres variables CSS (`--kafka-reading-scale`, `--kafka-reading-measure`, `--kafka-reading-family`) que `Prose` lee. El ancho usa los tres tokens de medida (45, 66 y 75 ch); el tamaño usa cinco escalones del cuerpo de 18 px (87,5 %–150 %). El tema lo aplica la aplicación, porque cambia toda la página. Dónde guardar la elección es decisión de quien integra.
5. **`Embed` es opt-in a terceros.** Título obligatorio, `sandbox` sin navegación superior, `referrerPolicy` estricta y modo `deferred` que no pide nada al proveedor hasta el clic. Siempre trae un enlace de salida de 44 px.
6. **Sin router.** `PrevNext`, `Author` y `TableOfContents` usan `<a href>`; la app que use un router intercepta los clics.
7. **Sin estilos de código.** Kafka es para literatura: no hay tipografía monoespaciada semántica. Si hace falta, será un token nuevo con su propia decisión.

## Consecuencias

- 14 componentes, 214 tokens de componente en total, 37 pares de contraste nuevos y 73 comprobaciones de teclado y ARIA nuevas.
- Dos pares se corrigieron al escribirlos: el borde del `Embed` pasó a `border.strong` (el borde por defecto no llegaba a 3:1) y el relleno del progreso se mide contra la página (donde importa), no contra su riel.
- La parte de Figma de estos componentes (criterio 5) se hace en un solo lote en H7, junto con las páginas de documentación.
