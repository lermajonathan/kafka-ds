# DDR-KF-007 · Pila de la librería (H1)

- **Estado:** aceptada · 2026-10-21
- **Decide:** Jonathan Lerma.

## Decisión

Kafka usa la misma pila que Pance, para que ambos se mantengan igual y se puedan comparar:

| Pieza | Elección | Por qué |
|---|---|---|
| Componentes | React 19 | Es lo que usan Altazor (después de Astro) y el CRM |
| Estilos | Tailwind CSS v4 con un tema generado desde los tokens | Las utilidades son las que respaldan los tokens |
| Gestor de paquetes | pnpm 10 | Mismo que Pance; instalación reproducible con `--frozen-lockfile` |
| Build | Vite 8 (librería y *playground*) | Mismo que Pance |
| Tipos | TypeScript 5.9, `strict` y `noUncheckedIndexedAccess` | La API de documentación lee los tipos |
| Íconos | Phosphor, una selección nombrada (DDR-KF-002) | |
| Pruebas en navegador | Playwright 1.56 y axe-core 4.10 | Versiones fijas, igual que Pance |
| Paquetes | `@kafka/tokens` y `@kafka/react` (ESM, tipos, `styles.css` y `tailwind.css`) | |

**El tema de Tailwind desactiva lo que no viene de un token.** `theme.css` pone `--color-*`, `--text-*`, `--radius-*`, `--shadow-*` y los demás en `initial` y define solo las utilidades respaldadas por tokens. Así `bg-red-500` no existe, y el lint (`lint:tokens`) lo atrapa además de los hex, `rgb()` y las dimensiones sueltas.

**Los componentes leen tokens de componente** con la sintaxis `bg-(--kafka-button-primary-bg)`; las clases se escriben completas para que Tailwind las vea.

**Cada componente se documenta desde el código:** las propiedades salen de los tipos de TypeScript y los ejemplos son los mismos que corren en el *playground*, en la prueba de ejemplos y en la documentación generada (`pnpm docs`; `docs:check` falla si se desfasa).

**Regresión visual sin capturas guardadas:** se compila la rama base y este commit en la misma máquina y se comparan con pixelmatch. Un cambio intencional se marca con la etiqueta `visual-change` en el PR.

## Textos de la librería

Los textos integrados (por ejemplo «Cargando») van en inglés por defecto y se cambian con `KafkaProvider`; se incluye `labelsEs`. La librería no importa ningún paquete de i18n ni de rutas.

## Consecuencias

- Kafka queda fijado a Tailwind v4 para las utilidades; quien no lo use importa `@kafka/react/styles.css`, que ya trae todo compilado.
- Literata sigue sin autoalojarse (H8): hasta entonces los títulos de lectura se ven con la tipografía de respaldo.
