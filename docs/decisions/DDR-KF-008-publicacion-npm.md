# DDR-KF-008 · Publicación en npm bajo `@kafka-ds`

**Estado:** aceptada · 27 oct 2026

## Contexto

DDR-KF-004 pide publicar solo cuando el sistema esté completo. El scope `@kafka` en npm pertenece a otra cuenta, así que ese scope no se puede usar.

## Decisión

- Scope **`@kafka-ds`** (organización de npm con el mismo nombre).
- Tres paquetes, **todos en 1.0.0** y con el mismo número en adelante: `@kafka-ds/tokens`, `@kafka-ds/react`, `@kafka-ds/theme-altazor`.
- Publicación como en Pance: `.github/workflows/release.yml`, con **trusted publishing (OIDC)** y procedencia, sin token de npm guardado. Se dispara al publicar un release `vX.Y.Z`; falla si la etiqueta y las versiones no coinciden. `workflow_dispatch` hace un ensayo (`--dry-run`).
- `tests/release.mjs` (dentro de `pnpm verify`) protege el scope, las versiones y el flujo.

## Pasos manuales (los hace Jonathan)

1. Crear la organización `kafka-ds` en npmjs.com.
2. Reservar los tres nombres con una versión `0.0.0-stage` (un `npm publish` manual por paquete), porque el trusted publishing se configura sobre un paquete que ya existe.
3. En cada paquete: Settings → Trusted publisher → GitHub Actions · `lermajonathan/kafka-ds` · `release.yml`.
4. Ejecutar el flujo a mano (ensayo) y revisar el resultado.
5. Publicar el release `v1.0.0` en GitHub.
