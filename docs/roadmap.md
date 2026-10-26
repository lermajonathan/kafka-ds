# Roadmap hacia Kafka v1

Alcance: [DDR-KF-004](decisions/DDR-KF-004-alcance-v1.md) y [DDR-KF-005](decisions/DDR-KF-005-modulo-de-impresion.md). Estado a 21 de octubre de 2026.

## Estado actual

| Capa | Hecho | Falta |
|---|---|---|
| Tokens | 184 en tres niveles, claro y oscuro, compilador, contraste 87 pares | Estados, breakpoints, z-index, opacidad, lectura, impresión, oscuro por componente |
| Figma | Variables (Primitives, Semantic, Components), 10 estilos de texto, 4 de efecto, 1 de relleno, 6 conjuntos de componentes | Propiedades de texto e íconos, estados, página de documentación por componente, modo oscuro de componentes |
| Código | Compilador de tokens; **H1: librería, paquetes, documentación generada y pruebas, con Button como primer componente** | Los demás componentes (H2 a H5), impresión (H6), sitio (H7) |
| Gobierno | LICENSE, 5 DDR | README, CONTRIBUTING, GOVERNANCE, SECURITY, CODE_OF_CONDUCT, CHANGELOG, deprecación |

## Hitos

| # | Hito | Contenido | Cierra cuando |
|---|---|---|---|
| H0 ✅ | Cimientos | Tokens que faltan (estados, breakpoints, z-index, opacidad, lectura, impresión); componentes leen solo semánticos; oscuro por componente; archivos de gobierno; README y CHANGELOG | `npm run verify` pasa y el lint ya comprueba componentes reales |
| H1 ✅ | Librería | React + Tailwind v4 sobre los tokens, `@kafka/tokens` y `@kafka/react` (ESM y tipos), generador de documentación, CI con teclado, axe y diff visual | Un componente de ejemplo pasa todas las pruebas en CI |
| H2 ✅ | Lectura (14), código y pruebas; Figma en H7 | Prosa, cita destacada, nota al pie, verso, epígrafe, capitular, progreso, tabla de contenidos, ajustes de lectura, anterior/siguiente, figura, autor, tiempo de lectura, incrustado | Cada uno cumple los 7 criterios de DDR-KF-004 |
| H3 ✅ | UI esencial, código y pruebas; Figma en H7 | Botón, ícono-botón, grupo, enlace, insignia, chip, campo, entrada, área de texto, selección, casilla, radio, interruptor, deslizador, pin, etiquetas, archivo | Idem |
| H4 ✅ | Navegación y capas, código y pruebas; Figma en H7 | Pestañas, acordeón, migas, paginación, pasos, menú, desplegable, popover, tooltip, modal, cajón, confirmar, calendarios | Idem |
| H5 ✅ | Retroalimentación y superficies | Alerta, toast, progreso, esqueleto, estado vacío, tarjeta, panel, divisor, avatar, notificaciones, **tarjeta VIP, caja de noticias, tarjeta de programa** | Idem |
| H5b | Figma completo | Variables claro y oscuro, estilos, portada, inicio, fundamentos, una página por componente, patrones y decisiones, como el archivo de Pance | Figma refleja el repo componente por componente y tiene el mismo nivel de documentación que Pance |
| H6 ✅ | Impresión | Tokens de página, `print.css`, plantillas libro, revista y ficha, prueba de PDF | PDF de ejemplo pasa la prueba de salida |
| H7 | Figma y documentación | Una página por componente (cabecera, ejemplos, variantes, tokens), página DDR, guía de inicio, sitio publicado, Figma Community. **Hecho:** Figma, guía de inicio, páginas de decisiones y sitio construido y probado ([DDR-KF-019](decisions/DDR-KF-019-sitio-de-documentacion.md)); **falta:** publicar el sitio al fusionar a `main` y la publicación en Figma Community | Figma refleja el repo componente por componente |
| H8 | Lanzamiento | Tema Altazor, autoalojar Literata, pruebas con lector de pantalla, versión 1.0.0 en npm | Criterio completo cumplido; sin versiones intermedias |

**Figma (decisión del 25 oct 2026):** el código va por delante (1113 tokens y 70 componentes frente a ~184 tokens y 5 conjuntos en Figma). H5 se cierra en el repo y Figma pasa a ser un hito propio, **H5b**, antes de H6: primero fundaciones (variables, estilos, portada, inicio, fundamentos, decisiones), luego páginas de componentes por familias y al final patrones, iconos y revisión. Debe quedar visualmente actualizado y con el nivel de un sistema de diseño profesional, como el de Pance.

Regla: no se publica en npm ni se anuncia hasta cerrar H8.
