# DDR-KF-004 · Alcance de Kafka v1

- **Estado:** aceptada · 2026-10-21
- **Decide:** Jonathan Lerma, después de auditar Kafka contra el criterio de Pance.

## Decisión

Kafka v1 llega con **paridad con Pance, sin los componentes de visualización de datos**, más los componentes de lectura propios de Kafka y el **módulo de impresión completo**.

| Bloque | Qué incluye | Cantidad |
|---|---|---|
| Heredados de Pance | Los 59 componentes de Pance que no son de datos | 59 |
| Lectura (propios de Kafka) | Prosa, cita destacada, nota al pie, verso, epígrafe, capitular, progreso de lectura, tabla de contenidos, ajustes de lectura, navegación anterior/siguiente, figura con pie, autor, tiempo de lectura, incrustado | 14 |
| Altazor como tema | Tarjeta VIP, caja de noticias y tarjeta de programa (variantes de Card y un componente nuevo) | 2 nuevos |
| Impresión | Tokens, hojas de estilo y plantillas (libro, revista, ficha) con salida a PDF probada | módulo |

**Quedan fuera** (visualización de datos, que pertenece a Pance): BarChart, LineChart, DonutChart, DivergingBarChart, RankedBarChart, ScatterChart, Heatmap, Sparkline, Meter, Delta, MetricCard y DataTable. El CRM los toma de Pance.

## Qué significa "completo"

Un componente solo cuenta cuando cumple todo esto (es el mismo criterio de Pance):

1. Código que lee únicamente tokens semánticos o de componente; `lint:tokens` bloquea colores y píxeles sueltos.
2. Contraste verificado en claro y oscuro (texto 4,5:1, lectura 7:1, controles 3:1).
3. Teclado y ARIA con pruebas (patrón WAI-ARIA que corresponda) y axe sin violaciones.
4. Objetivos táctiles de 24 px como mínimo (WCAG 2.5.8) y de 44 px en controles principales.
5. Componente en Figma con propiedades reales (texto, ícono, estado), variables enlazadas y modo oscuro.
6. Página de documentación generada: cuándo usarlo, propiedades, accesibilidad, contenido y un ejemplo que se ejecuta en CI.
7. Una DDR cuando el componente exige una decisión de diseño.

## Consecuencias

- Es un alcance grande: se entrega por hitos (ver [roadmap](../roadmap.md)) y no se publica en npm hasta que todo esté completo, como se hizo con Pance.
- Kafka v1 no se anuncia antes de cumplir el criterio de arriba.
